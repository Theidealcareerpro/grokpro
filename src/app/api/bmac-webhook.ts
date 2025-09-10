import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const signature = req.headers['x-bmac-signature'] as string;
  const secret = process.env.BMAC_WEBHOOK_SECRET;
  if (!signature || !secret) {
    return res.status(401).json({ error: 'Missing signature or secret' });
  }

  const payload = JSON.stringify(req.body);
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');

  if (computedSignature !== signature) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { type, data } = req.body;
  if (type !== 'support' || !data?.object) {
    return res.status(400).json({ error: 'Invalid webhook event' });
  }

  const { amount, currency, fingerprint } = data.object;
  if (currency !== 'usd' || amount < 5) {
    return res.status(400).json({ error: 'Minimum $5 USD donation required' });
  }

  if (!fingerprint) {
    return res.status(400).json({ error: 'Missing fingerprint' });
  }

  try {
    const { data: portfolioData, error } = await supabase
      .from('portfolios')
      .select('expiry, donation_status')
      .eq('fingerprint', fingerprint)
      .single();

    if (error && error.code !== 'PGRST116') {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!portfolioData) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }

    const extendedDays = Math.floor(amount / 5) * 30; // $5 = 30 days
    const newExpiry = new Date(portfolioData.expiry);
    newExpiry.setDate(newExpiry.getDate() + extendedDays);
    const maxExpiry = new Date();
    maxExpiry.setDate(maxExpiry.getDate() + 180);
    if (newExpiry > maxExpiry) newExpiry.setTime(maxExpiry.getTime());

    const newDonationStatus = {
      ...portfolioData.donation_status,
      amount: (portfolioData.donation_status?.amount || 0) + amount,
      extendedDays: (portfolioData.donation_status?.extendedDays || 0) + extendedDays,
    };

    await supabase
      .from('portfolios')
      .update({ expiry: newExpiry.toISOString(), donation_status: newDonationStatus })
      .eq('fingerprint', fingerprint);

    return res.status(200).json({ success: true, newExpiry: newExpiry.toISOString() });
  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Failed to process webhook' });
  }
}
