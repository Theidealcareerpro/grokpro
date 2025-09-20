import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type DeploymentRow = {
  id: string;
  fingerprint: string;
  repo: string;       // "owner/repo"
  homepage: string;   // pages url
  state: 'created' | 'deleted' | 'archived' | 'error';
  live: boolean;
  created_at: string;
  expires_at: string | null;
};

type DeploymentsOk = { ok: true; admin: boolean; sites: DeploymentRow[] };
type DeploymentsErr = { ok: false; error: string };
type DeploymentsResponse = DeploymentsOk | DeploymentsErr;

function getServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE!;
  return createClient(url, key, { auth: { persistSession: false } });
}

function getFingerprint(req: Request): string | null {
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

  const { data } = await supabase
    .from('accounts')
    .select('is_admin')
    .eq('fingerprint', fp)
    .maybeSingle();

  const row = (data as { is_admin?: boolean } | null) ?? null;
  if (row?.is_admin === true) return true;

  return envAdminList().includes(fp);
}

export async function GET(req: Request) {
  const fp = getFingerprint(req);
  if (!fp) {
    return NextResponse.json<DeploymentsResponse>({ ok: false, error: 'Missing fingerprint' }, { status: 400 });
  }

  const supabase = getServiceClient();
  const admin = await isAdminFingerprint(fp);

  const url = new URL(req.url);
  const all = url.searchParams.get('all') === '1';

  let query = supabase
    .from('deployments')
    .select('*')
    .order('created_at', { ascending: false });

  if (!(admin && all)) {
    query = query.eq('fingerprint', fp);
  }

  const { data, error } = await query;
  if (error) {
    return NextResponse.json<DeploymentsResponse>({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json<DeploymentsResponse>(
    { ok: true, admin, sites: (data || []) as DeploymentRow[] },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}
