import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import crypto from 'crypto';
import { renderPortfolioHtml } from '@/lib/publish/renderPortfolioHtml';
import { supabaseAdmin } from '@/lib/supabase-admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PortfolioData = Parameters<typeof renderPortfolioHtml>[0];

type AccountRow = {
  fingerprint: string;
  is_admin: boolean;
  expiry: string;                // ISO
  last_publish: string | null;   // ISO | null
  monthly_count: number;
  last_month_reset: string | null; // e.g., '2025-09-01T00:00:00.000Z' or '2025-09-01'
};

function monthAnchor(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1));
}

function safeSlug(p: PortfolioData, fingerprint?: string | null): string {
  const c: string[] = [];
  if (typeof p.username === 'string' && p.username.trim()) c.push(p.username.trim());
  if (typeof fingerprint === 'string' && fingerprint.trim()) c.push(fingerprint.trim());
  if (typeof p.fullName === 'string' && p.fullName.trim()) c.push(p.fullName.trim());
  const base = c[0] ?? 'portfolio';
  const slug = base.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/--+/g, '-').slice(0, 40);
  return slug || 'portfolio';
}

export async function POST(req: Request) {
  const body = (await req.json()) as { portfolioData?: PortfolioData; fingerprint?: string };
  const portfolioData = body.portfolioData;
  const fingerprint = body.fingerprint?.trim() || null;

  if (!portfolioData || !fingerprint) {
    return NextResponse.json({ error: 'portfolioData and fingerprint are required' }, { status: 400 });
  }

  const GITHUB_PAT = process.env.GITHUB_PAT;
  const GITHUB_OWNER = process.env.GITHUB_OWNER;
  const GITHUB_OWNER_TYPE = (process.env.GITHUB_OWNER_TYPE ?? 'user') as 'user' | 'org';
  if (!GITHUB_PAT || !GITHUB_OWNER) {
    return NextResponse.json({ error: 'Missing GITHUB_PAT or GITHUB_OWNER' }, { status: 500 });
  }

  // 1) Ensure account row exists + monthly reset
  const now = new Date();
  const nowIso = now.toISOString();
  const monthKey = monthAnchor(now).toISOString().slice(0, 10);

  let acc: AccountRow | null = null;

  {
    const { data: existing, error } = await supabaseAdmin
      .from('accounts')
      .select('*')
      .eq('fingerprint', fingerprint)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    if (!existing) {
      const { data: created, error: insErr } = await supabaseAdmin
        .from('accounts')
        .insert({
          fingerprint,
          is_admin: false,
          expiry: new Date(now.getTime() + 21 * 24 * 3600 * 1000).toISOString(),
          monthly_count: 0,
          last_month_reset: monthKey,
        })
        .select('*')
        .single();

      if (insErr) return NextResponse.json({ error: insErr.message }, { status: 500 });
      acc = created as AccountRow;
    } else {
      const needReset =
        !existing.last_month_reset ||
        monthAnchor(new Date(existing.last_month_reset)).getTime() !== monthAnchor(now).getTime();

      if (needReset) {
        const { data: upd, error: updErr } = await supabaseAdmin
          .from('accounts')
          .update({ monthly_count: 0, last_month_reset: monthKey })
          .eq('fingerprint', fingerprint)
          .select('*')
          .single();
        if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 });
        acc = upd as AccountRow;
      } else {
        acc = existing as AccountRow;
      }
    }
  }

  const isAdmin = Boolean(acc?.is_admin);
  const lastPublish = acc?.last_publish ? new Date(acc.last_publish) : null;
  const accountExpired = acc ? new Date(acc.expiry) <= now : true;

  // 2) Enforce limits if NOT admin
  if (!isAdmin) {
    if (accountExpired) {
      return NextResponse.json(
        { error: 'Your trial has expired. Please donate to extend access.' },
        { status: 402 } // Payment Required
      );
    }

    // daily (1/day)
    if (lastPublish && now.getTime() - lastPublish.getTime() < 24 * 3600 * 1000) {
      return NextResponse.json(
        { error: 'Daily limit reached. Try again tomorrow.' },
        { status: 429 }
      );
    }

    // monthly (2/month)
    if ((acc?.monthly_count ?? 0) >= 2) {
      return NextResponse.json(
        { error: 'Monthly limit reached (2 publishes).' },
        { status: 429 }
      );
    }

    // max live (2): live = true AND expires_at > now
    const { count: liveCount, error: liveErr } = await supabaseAdmin
      .from('deployments')
      .select('id', { count: 'exact', head: true })
      .eq('fingerprint', fingerprint)
      .eq('live', true)
      .gt('expires_at', nowIso);

    if (liveErr) return NextResponse.json({ error: liveErr.message }, { status: 500 });
    if ((liveCount ?? 0) >= 2) {
      return NextResponse.json(
        { error: 'You already have 2 live portfolios. Delete/expire one to publish again.' },
        { status: 429 }
      );
    }
  }

  // 3) GitHub ops
  const octokit = new Octokit({ auth: GITHUB_PAT });
  const slug = safeSlug(portfolioData, fingerprint);
  const suffix = Date.now().toString(36);
  const repoName = `${slug}-${suffix}`;

  if (GITHUB_OWNER_TYPE === 'org') {
    await octokit.repos.createInOrg({ org: GITHUB_OWNER, name: repoName, private: false, auto_init: true });
  } else {
    await octokit.repos.createForAuthenticatedUser({ name: repoName, private: false, auto_init: true });
  }

  const owner = GITHUB_OWNER;
  const homepage = `https://${owner}.github.io/${repoName}/`;

  const html = await renderPortfolioHtml(portfolioData);
  const toB64 = (s: string) => Buffer.from(s, 'utf8').toString('base64');

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo: repoName,
    path: 'index.html',
    message: 'Add generated portfolio',
    content: toB64(html),
    branch: 'main',
  });
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo: repoName,
    path: '404.html',
    message: 'Add 404 page',
    content: toB64('<h1>404 - Not Found</h1>'),
    branch: 'main',
  });
  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo: repoName,
    path: '.nojekyll',
    message: 'Disable Jekyll',
    content: toB64(''),
    branch: 'main',
  });

  await octokit
    .request('POST /repos/{owner}/{repo}/pages', {
      owner,
      repo: repoName,
      source: { branch: 'main', path: '/' },
    })
    .catch(async (err: unknown) => {
      const status = typeof err === 'object' && err && 'status' in err ? (err as { status?: number }).status ?? 0 : 0;
      if (status === 409 || status === 422) {
        await octokit.request('PUT /repos/{owner}/{repo}/pages', {
          owner,
          repo: repoName,
          source: { branch: 'main', path: '/' },
        });
      } else {
        throw err;
      }
    });

  // 4) Record deployment + update account counters
  const { data: dep, error: depErr } = await supabaseAdmin
    .from('deployments')
    .insert({
      fingerprint,
      repo: `${owner}/${repoName}`,
      homepage,
      state: 'created',
      live: true,
      // use current account expiry (already validated)
      expires_at: acc?.expiry ?? null,
    })
    .select('id')
    .single();

  if (depErr) return NextResponse.json({ error: depErr.message }, { status: 500 });

  const nextMonthly = (acc?.monthly_count ?? 0) + 1;
  await supabaseAdmin
    .from('accounts')
    .update({ last_publish: nowIso, monthly_count: nextMonthly })
    .eq('fingerprint', fingerprint);

  return NextResponse.json(
    { ok: true, url: homepage, repo: `${owner}/${repoName}`, deploymentId: dep?.id ?? null },
    { headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } }
  );
}
