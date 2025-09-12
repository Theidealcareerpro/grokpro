// app/publish/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import crypto from 'crypto';
import { renderPortfolioHtml } from '@/lib/publish/renderPortfolioHtml';
// If you keep anon key + permissive RLS:
import { supabase } from '@/lib/supabase';
// If/when you restrict RLS, swap to a server client:
// import { createClient } from '@supabase/supabase-js';
// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE!);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PortfolioData = Parameters<typeof renderPortfolioHtml>[0];

export async function POST(req: Request) {
  try {
    const { portfolioData, fingerprint } = (await req.json()) as {
      portfolioData?: PortfolioData;
      fingerprint?: string;
    };

    if (!portfolioData) {
      return NextResponse.json({ error: 'portfolioData is required' }, { status: 400 });
    }

    // === Env (GitHub) ===
    const GITHUB_PAT = process.env.GITHUB_PAT;
    const GITHUB_OWNER = process.env.GITHUB_OWNER; // username or org
    const GITHUB_OWNER_TYPE = (process.env.GITHUB_OWNER_TYPE ?? 'user') as 'user' | 'org';
    if (!GITHUB_PAT || !GITHUB_OWNER) {
      return NextResponse.json({ error: 'Missing GITHUB_PAT or GITHUB_OWNER' }, { status: 500 });
    }

    const octokit = new Octokit({ auth: GITHUB_PAT });

    // Idempotent-ish repo name: prefer a stable slug if we have a fingerprint/username
    const base =
      (portfolioData as any)?.username?.toString?.().trim() ||
      fingerprint ||
      (portfolioData as any)?.fullName?.toString?.().trim()?.toLowerCase()?.replace(/\s+/g, '-') ||
      'portfolio';
    const slug = base.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40) || 'portfolio';
    const suffix = Date.now().toString(36);
    const repoName = `${slug}-${suffix}`;

    // 1) Create repo with an initial commit so 'main' exists
    if (GITHUB_OWNER_TYPE === 'org') {
      await octokit.repos.createInOrg({
        org: GITHUB_OWNER,
        name: repoName,
        private: false,
        auto_init: true,
      });
    } else {
      await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        private: false,
        auto_init: true,
      });
    }

    const owner = GITHUB_OWNER;
    const homepage = `https://${owner}.github.io/${repoName}/`;

    // 2) Generate static HTML from the SAME React template you preview
    const html = renderPortfolioHtml(portfolioData);

    // 3) Commit files (Pages-friendly)
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

    // 4) Enable GitHub Pages (main branch / root)
    await octokit
      .request('POST /repos/{owner}/{repo}/pages', {
        owner,
        repo: repoName,
        source: { branch: 'main', path: '/' },
      })
      .catch(async (err: any) => {
        if (err?.status === 409 || err?.status === 422) {
          // already configured or requires PUT on some repos
          await octokit.request('PUT /repos/{owner}/{repo}/pages', {
            owner,
            repo: repoName,
            source: { branch: 'main', path: '/' },
          });
        } else {
          throw err;
        }
      });

    // 5) Supabase upsert (trial record)
    const rowFingerprint = fingerprint ?? crypto.randomUUID();
    const expiryIso = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('portfolios')
      .upsert(
        {
          fingerprint: rowFingerprint,
          expiry: expiryIso,
          donation_status: { amount: 0, extendedDays: 0 },
          github_repo: `${owner}/${repoName}`,
        },
        { onConflict: 'fingerprint' }
      )
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to save to database', details: error.message, hint: (error as any).hint },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        url: homepage,
        repo: `${owner}/${repoName}`,
        portfolio: data,
      },
      {
        headers: {
          'Cache-Control': 'no-store',
          'X-Content-Type-Options': 'nosniff',
        },
      }
    );
  } catch (err: any) {
    console.error('publish error', err);
    return NextResponse.json({ ok: false, error: err?.message ?? 'Failed to publish portfolio' }, { status: 500 });
  }
}
