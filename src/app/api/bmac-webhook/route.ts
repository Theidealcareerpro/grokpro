// src/app/api/bmac-webhook/route.ts
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* ---------------- helpers ---------------- */

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status });
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null;
}

/** Pull amount/currency from common BMAC shapes (flat or nested). */
function getAmountCurrency(payload: unknown): { amount: number; currency: string } | null {
  if (!isRecord(payload)) return null;

  // Many payloads use { data: {...} }, some use { object: {...} }
  const container = ((): Record<string, unknown> | null => {
    if (isRecord(payload.data)) return payload.data as Record<string, unknown>;
    if (isRecord(payload.object)) return payload.object as Record<string, unknown>;
    return null;
  })();

  if (!container) return null;

  // Try flat first
  const flatAmountRaw = container.amount;
  const flatCurrencyRaw = container.currency;
  // Then nested under .object
  const nested = isRecord(container.object) ? (container.object as Record<string, unknown>) : null;
  const nestedAmountRaw = nested?.amount;
  const nestedCurrencyRaw = nested?.currency;

  const amountRaw = flatAmountRaw ?? nestedAmountRaw;
  const currencyRaw = flatCurrencyRaw ?? nestedCurrencyRaw;

  const amount = typeof amountRaw === 'string' ? Number(amountRaw) : typeof amountRaw === 'number' ? amountRaw : NaN;
  const currency =
    typeof currencyRaw === 'string' && currencyRaw.trim() ? currencyRaw.trim().toUpperCase() : '';

  if (!Number.isFinite(amount) || !currency) return null;
  return { amount, currency };
}

/** Pull supporter note/message where the user pastes fp:xxxx. */
function getSupportNote(payload: unknown): string | null {
  if (!isRecord(payload)) return null;
  const container = ((): Record<string, unknown> | null => {
    if (isRecord(payload.data)) return payload.data as Record<string, unknown>;
    if (isRecord(payload.object)) return payload.object as Record<string, unknown>;
    return null;
  })();
  if (!container) return null;

  const flat =
    (typeof container.support_note === 'string' && container.support_note) ||
    (typeof container.message === 'string' && container.message) ||
    (typeof container.note === 'string' && container.note) ||
    null;

  const nested = isRecord(container.object) ? (container.object as Record<string, unknown>) : null;
  const nestedNote =
    (nested && typeof nested.support_note === 'string' && nested.support_note) ||
    (nested && typeof nested.message === 'string' && nested.message) ||
    (nested && typeof nested.note === 'string' && nested.note) ||
    null;

  const val = flat ?? nestedNote;
  return val && val.trim() ? val.trim() : null;
}

/** If BMAC ever sends a dedicated fingerprint field, use it. */
function getDirectFingerprint(payload: unknown): string | null {
  if (!isRecord(payload)) return null;
  const container = ((): Record<string, unknown> | null => {
    if (isRecord(payload.data)) return payload.data as Record<string, unknown>;
    if (isRecord(payload.object)) return payload.object as Record<string, unknown>;
    return null;
  })();
  if (!container) return null;

  const flat =
    (typeof container.fingerprint === 'string' && container.fingerprint) || null;

  const nested = isRecord(container.object) ? (container.object as Record<string, unknown>) : null;
  const nestedFp =
    (nested && typeof nested.fingerprint === 'string' && nested.fingerprint) || null;

  const fp = flat ?? nestedFp;
  return fp && fp.trim() ? fp.trim() : null;
}

/** Extract `fp:xxxxxxxx` from free-text note. */
function extractFingerprint(note: string | null): string | null {
  if (!note) return null;
  const m = note.match(/fp:([a-z0-9_-]{8,64})/i);
  return m?.[1] ?? null;
}

/* ---------------- webhook ---------------- */

type BmacEvent = {
  type?: string;
  live_mode?: boolean;
  data?: unknown;
  object?: unknown;
};

export async function POST(req: Request) {
  // 1) Verify signature
  const signature = req.headers.get('x-bmac-signature');
  const secret = process.env.BMAC_WEBHOOK_SECRET;
  if (!signature || !secret) return json({ error: 'Missing signature or secret' }, 401);

  const raw = await req.text();
  const computed = crypto.createHmac('sha256', secret).update(raw).digest('hex');
  if (computed !== signature) return json({ error: 'Invalid signature' }, 401);

  // 2) Parse
  let evt: BmacEvent;
  try {
    evt = JSON.parse(raw) as BmacEvent;
  } catch {
    return json({ error: 'Invalid JSON' }, 400);
  }

  const type = (evt.type || '').toLowerCase();
  // Accept common variants
  if (!['donation.created', 'support.created', 'support'].includes(type)) {
    return json({ error: `Unhandled event type: ${evt.type ?? 'unknown'}` }, 400);
  }

  // 3) Normalize amount/currency
  const amtCur = getAmountCurrency(evt);
  if (!amtCur) return json({ error: 'Missing amount/currency' }, 400);

  const amount = amtCur.amount;
  const currency = amtCur.currency; // e.g., "USD" | "GBP"

  // Multi-currency (simple): accept USD or GBP, amount >= 5
  if (!['USD', 'GBP'].includes(currency) || amount < 5) {
    return json({ error: 'Minimum 5 in USD or GBP required' }, 400);
  }

  // 4) Find fingerprint (direct or fp:xxxx in note)
  const fingerprint = getDirectFingerprint(evt) ?? extractFingerprint(getSupportNote(evt)) ?? '';
  if (!fingerprint) return json({ error: 'Missing fingerprint (paste fp:xxxx in the note)' }, 400);

  // 5) Extend account + deployments
  const { data: acc, error: accErr } = await supabaseAdmin
    .from('accounts')
    .select('expiry, donation_status')
    .eq('fingerprint', fingerprint)
    .maybeSingle();

  if (accErr) return json({ error: accErr.message }, 500);
  if (!acc) return json({ error: 'Account not found' }, 404);

  // Every full 5 units = +30 days
  const extendedDays = Math.floor(amount / 5) * 30;

  const now = new Date();
  const cap = new Date(now.getTime());
  cap.setUTCDate(cap.getUTCDate() + 180);

  const currentExpiry = new Date((acc as { expiry: string }).expiry);
  const base = Number.isFinite(currentExpiry.getTime()) ? currentExpiry : now;

  const newExpiry = new Date(base.getTime());
  newExpiry.setUTCDate(newExpiry.getUTCDate() + extendedDays);
  if (newExpiry > cap) newExpiry.setTime(cap.getTime());

  // donation_status: keep aggregating
  const current = ((acc as { donation_status?: { amount?: number; extendedDays?: number } }).donation_status) ?? {
    amount: 0,
    extendedDays: 0,
  };
  const donation_status = {
    amount: (current.amount ?? 0) + amount,
    extendedDays: (current.extendedDays ?? 0) + extendedDays,
  };

  // Update account
  const { error: updErr } = await supabaseAdmin
    .from('accounts')
    .update({ expiry: newExpiry.toISOString(), donation_status })
    .eq('fingerprint', fingerprint);

  if (updErr) return json({ error: updErr.message }, 500);

  // Update all live deployments (your schema uses expires_at)
  const { error: depErr } = await supabaseAdmin
    .from('deployments')
    .update({ expires_at: newExpiry.toISOString() })
    .eq('fingerprint', fingerprint)
    .eq('live', true);

  if (depErr) return json({ error: depErr.message }, 500);

  return json({
    success: true,
    fingerprint,
    currency,
    amount,
    extendedDays,
    newExpiry: newExpiry.toISOString(),
  });
}

// Optional: explicitly 405 others
export function GET() {
  return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
}
