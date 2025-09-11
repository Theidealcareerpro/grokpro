// src/app/api/bmac-webhook/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';        // needed for node 'crypto'
export const dynamic = 'force-dynamic'; // don't cache webhooks

// Utility: JSON response helper
const json = (body: any, status = 200) => NextResponse.json(body, { status });

export async function POST(req: Request) {
  // --- Verify signature using RAW body ---
  const signature = req.headers.get('x-bmac-signature');
  const secret = process.env.BMAC_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return json({ error: 'Missing signature or secret' }, 401);
  }

  const raw = await req.text();
  const computedSignature = crypto.createHmac('sha256', secret).update(raw).digest('hex');

  if (computedSignature !== signature) {
    return json({ error: 'Invalid signature' }, 401);
  }

  // Parse JSON AFTER computing signature
  let body: any;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const { type, data } = body ?? {};
  if (type !== 'support' || !data?.object) {
    return json({ error: 'Invalid webhook event' }, 400);
  }

  const amount = Number(data.object.amount);
  const currency = String(data.object.currency || '').toLowerCase();
  const fingerprint = String(data.object.fingerprint || '');

  if (!fingerprint) return json({ error: 'Missing fingerprint' }, 400);
  if (currency !== 'usd' || !(amount >= 5)) {
    return json({ error: 'Minimum $5 USD donation required' }, 400);
  }

  try {
    // READ: allow 0/1 row without 406
    const { data: portfolio, error: readError } = await supabase
      .from('portfolios')
      .select('expiry, donation_status')
      .eq('fingerprint', fingerprint)
      .limit(1)
      .maybeSingle();

    if (readError) {
      console.error('Supabase read error:', readError);
      return json({ error: 'Database error' }, 500);
    }
    if (!portfolio) {
      return json({ error: 'Portfolio not found' }, 404);
    }

    // Compute extension: $5 = 30 days
    const extendedDays = Math.floor(amount / 5) * 30;
    const newExpiry = new Date(portfolio.expiry);
    newExpiry.setDate(newExpiry.getDate() + extendedDays);

    // Cap to +180 days from NOW (preserves your original behavior)
    const maxExpiry = new Date();
    maxExpiry.setDate(maxExpiry.getDate() + 180);
    if (newExpiry > maxExpiry) newExpiry.setTime(maxExpiry.getTime());

    // Update JSONB donation_status (merge + increment)
    const current = portfolio.donation_status ?? { amount: 0, extendedDays: 0 };
    const nextDonationStatus = {
      amount: (current.amount ?? 0) + amount,
      extendedDays: (current.extendedDays ?? 0) + extendedDays,
    };

    const { error: updateError } = await supabase
      .from('portfolios')
      .update({
        expiry: newExpiry.toISOString(),
        donation_status: nextDonationStatus, // JSONB ✅
      })
      .eq('fingerprint', fingerprint);

    if (updateError) {
      console.error('Supabase update error:', updateError);
      return json({ error: 'Failed to update portfolio' }, 500);
    }

    return json({ success: true, newExpiry: newExpiry.toISOString() });
  } catch (err) {
    console.error('Webhook error:', err);
    return json({ error: 'Failed to process webhook' }, 500);
  }
}

// Optional: explicitly 405 other methods
export function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
