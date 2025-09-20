import { NextResponse } from 'next/server';
import { createClient, PostgrestError } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Counts = {
  publishesToday: number;
  publishedThisMonth: number;
  liveSites: number;
};

type Limits = { daily: number; monthly: number; live: number };

type UsageOk = {
  ok: true;
  admin: boolean;
  fingerprint: string;
  counts: Counts;
  limits: Limits;
  nextResetAt: string; // ISO
  expirySoon: boolean;
};

type UsageErr = { ok: false; error: string };
type UsageResponse = UsageOk | UsageErr;

const DAILY_LIMIT = 1;
const MONTHLY_LIMIT = 2;
const LIVE_LIMIT = 2;

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE!;
  return createClient(url, key, { auth: { persistSession: false } });
}

function getFingerprintFromReq(req: Request): string | null {
  const url = new URL(req.url);
  const qp = url.searchParams.get('fp');
  const hdr = req.headers.get('x-fingerprint');
  return (hdr || qp || '').trim() || null;
}

function envAdminList(): string[] {
  const raw = (process.env.ADMIN_FINGERPRINTS || '').trim();
  return raw ? raw.split(',').map((s) => s.trim()).filter(Boolean) : [];
}

async function isAdminFingerprint(fp: string): Promise<boolean> {
  const supabase = getServiceClient();

  // Try DB flag first
  const { data } = await supabase
    .from('accounts')
    .select('is_admin')
    .eq('fingerprint', fp)
    .maybeSingle();

  const row = (data as { is_admin?: boolean } | null) ?? null;
  if (row?.is_admin === true) return true;

  // Fallback: env list
  return envAdminList().includes(fp);
}

function startOfUtcMonth(d = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1, 0, 0, 0));
}

function firstOfNextUtcMonth(d = new Date()): Date {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1, 0, 0, 0));
}

export async function GET(req: Request) {
  const fp = getFingerprintFromReq(req);
  if (!fp) {
    return NextResponse.json<UsageResponse>({ ok: false, error: 'Missing fingerprint' }, { status: 400 });
  }

  const supabase = getServiceClient();
  const admin = await isAdminFingerprint(fp);

  const now = new Date();
  const nowIso = now.toISOString();
  const monthStartIso = startOfUtcMonth(now).toISOString();
  const dayAgoIso = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  // publishes in last 24h
  const { count: publishesToday, error: e1 } = await supabase
    .from('deployments')
    .select('id', { count: 'exact', head: true })
    .eq('fingerprint', fp)
    .gt('created_at', dayAgoIso);

  if (e1) {
    return NextResponse.json<UsageResponse>({ ok: false, error: (e1 as PostgrestError).message }, { status: 500 });
  }

  // publishes this month
  const { count: publishedThisMonth, error: e2 } = await supabase
    .from('deployments')
    .select('id', { count: 'exact', head: true })
    .eq('fingerprint', fp)
    .gte('created_at', monthStartIso);

  if (e2) {
    return NextResponse.json<UsageResponse>({ ok: false, error: (e2 as PostgrestError).message }, { status: 500 });
  }

  // current live sites: live = true AND expires_at > now
  const { count: liveSites, error: e3 } = await supabase
    .from('deployments')
    .select('id', { count: 'exact', head: true })
    .eq('fingerprint', fp)
    .eq('live', true)
    .gt('expires_at', nowIso);

  if (e3) {
    return NextResponse.json<UsageResponse>({ ok: false, error: (e3 as PostgrestError).message }, { status: 500 });
  }

  // expiring within 7 days (still live and in the future)
  const soonIso = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const { count: expSoonCount } = await supabase
    .from('deployments')
    .select('id', { count: 'exact', head: true })
    .eq('fingerprint', fp)
    .eq('live', true)
    .gt('expires_at', nowIso)
    .lte('expires_at', soonIso);

  const res: UsageOk = {
    ok: true,
    admin,
    fingerprint: fp,
    counts: {
      publishesToday: publishesToday || 0,
      publishedThisMonth: publishedThisMonth || 0,
      liveSites: liveSites || 0,
    },
    limits: { daily: DAILY_LIMIT, monthly: MONTHLY_LIMIT, live: LIVE_LIMIT },
    nextResetAt: firstOfNextUtcMonth(now).toISOString(),
    expirySoon: (expSoonCount || 0) > 0,
  };

  return NextResponse.json(res, { headers: { 'Cache-Control': 'no-store' } });
}
