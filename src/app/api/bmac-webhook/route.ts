import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type DonationStatus = { amount?: number; extendedDays?: number };
type AccountRecord = { expiry: string; donation_status: DonationStatus | null };

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

export async function POST(req: Request) {
  const signature = req.headers.get('x-bmac-signature');
  const secret = process.env.BMAC_WEBHOOK_SECRET;
  if (!signature || !secret) return json({ error: 'Missing signature or secret' }, 401);

  const raw = await req.text();
  const computed = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  if (computed !== signature) return json({ error: 'Invalid signature' }, 401);

  let evt: {
    type: string;
    data?: { object?: { amount?: number; currency?: string; fingerprint?: string } };
  };
  try {
    evt = JSON.parse(raw) as typeof evt;
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  if (evt.type !== 'support' || !evt.data?.object) return json({ error: 'Invalid event' }, 400);

  const amount = Number(evt.data.object.amount ?? 0);
  const currency = String(evt.data.object.currency ?? '').toLowerCase();
  const fingerprint = String(evt.data.object.fingerprint ?? '');
  if (!fingerprint) return json({ error: 'Missing fingerprint' }, 400);
  if (currency !== 'usd' || amount < 5) return json({ error: 'Minimum $5 USD donation required' }, 400);

  // Read account
  const { data: acc, error: accErr } = await supabaseAdmin
    .from('accounts')
    .select('expiry, donation_status')
    .eq('fingerprint', fingerprint)
    .maybeSingle();

  if (accErr) return json({ error: accErr.message }, 500);
  if (!acc) return json({ error: 'Account not found' }, 404);

  const extendedDays = Math.floor(amount / 5) * 30;
  const currentExpiry = new Date((acc as AccountRecord).expiry);
  const newExpiry = new Date(currentExpiry.getTime());
  newExpiry.setUTCDate(newExpiry.getUTCDate() + extendedDays);

  // Cap to +180 days from NOW
  const cap = new Date();
  cap.setUTCDate(cap.getUTCDate() + 180);
  if (newExpiry > cap) newExpiry.setTime(cap.getTime());

  const current = ((acc as AccountRecord).donation_status ?? { amount: 0, extendedDays: 0 }) as DonationStatus;
  const donation_status: DonationStatus = {
    amount: (current.amount ?? 0) + amount,
    extendedDays: (current.extendedDays ?? 0) + extendedDays,
  };

  // Update account
  const { error: updErr } = await supabaseAdmin
    .from('accounts')
    .update({ expiry: newExpiry.toISOString(), donation_status })
    .eq('fingerprint', fingerprint);

  if (updErr) return json({ error: updErr.message }, 500);

  // Update all deployments expiry and revive if now in the future
  const now = new Date();
  const nowIso = now.toISOString();

  // Set new expires_at for all deployments of this user
  const { error: depUpdErr } = await supabaseAdmin
    .from('deployments')
    .update({ expires_at: newExpiry.toISOString() })
    .eq('fingerprint', fingerprint);

  if (depUpdErr) return json({ error: depUpdErr.message }, 500);

  // If new expiry is in the future, mark all as live (revive)
  if (newExpiry > now) {
    const { error: reviveErr } = await supabaseAdmin
      .from('deployments')
      .update({ live: true })
      .eq('fingerprint', fingerprint);

    if (reviveErr) return json({ error: reviveErr.message }, 500);
  }

  return json({ success: true, newExpiry: newExpiry.toISOString() });
}

export function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
