import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import crypto from 'crypto';
import { renderPortfolioHtml } from '@/lib/publish/renderPortfolioHtml';
import { supabase } from '@/lib/supabase';
import type { PostgrestError } from '@supabase/supabase-js';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type PortfolioData = Parameters<typeof renderPortfolioHtml>[0];

function hasStatus(e: unknown): e is { status: number } {
  return (
    typeof e === 'object' &&
    e !== null &&
    'status' in e &&
    typeof (e as Record<string, unknown>).status === 'number'
  );
}

function toB64(s: string): string {
  return Buffer.from(s, 'utf8').toString('base64');
}

function safeSlug(p: PortfolioData, fingerprint?: string | null): string {
  const candidates: string[] = [];

  if (typeof p.username === 'string' && p.username.trim()) candidates.push(p.username.trim());
  if (typeof fingerprint === 'string' && fingerprint.trim()) candidates.push(fingerprint.trim());
  if (typeof p.fullName === 'string' && p.fullName.trim()) candidates.push(p.fullName.trim());

  const base = candidates[0] ?? 'portfolio';
  const slug = base
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .slice(0, 40);

  return slug || 'portfolio';
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { portfolioData?: PortfolioData; fingerprint?: string };
    const portfolioData = body.portfolioData;
    const fingerprint = body.fingerprint ?? null;

    if (!portfolioData) {
      return NextResponse.json({ error: 'portfolioData is required' }, { status: 400 });
    }

    const GITHUB_PAT = process.env.GITHUB_PAT;
    const GITHUB_OWNER = process.env.GITHUB_OWNER;
    const GITHUB_OWNER_TYPE = (process.env.GITHUB_OWNER_TYPE ?? 'user') as 'user' | 'org';

    if (!GITHUB_PAT || !GITHUB_OWNER) {
      return NextResponse.json({ error: 'Missing GITHUB_PAT or GITHUB_OWNER' }, { status: 500 });
    }

    const octokit = new Octokit({ auth: GITHUB_PAT });

    const slug = safeSlug(portfolioData, fingerprint);
    const suffix = Date.now().toString(36);
    const repoName = `${slug}-${suffix}`;

    // Create repo
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

    // Generate HTML
    const html = await renderPortfolioHtml(portfolioData);

    // Commit files
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

    // Enable Pages (POST then fallback to PUT for some repos)
    await octokit
      .request('POST /repos/{owner}/{repo}/pages', {
        owner,
        repo: repoName,
        source: { branch: 'main', path: '/' },
      })
      .catch(async (err: unknown) => {
        if (hasStatus(err) && (err.status === 409 || err.status === 422)) {
          await octokit.request('PUT /repos/{owner}/{repo}/pages', {
            owner,
            repo: repoName,
            source: { branch: 'main', path: '/' },
          });
        } else {
          throw err;
        }
      });

    // Supabase upsert
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
      const e = error as PostgrestError;
      return NextResponse.json(
        { error: 'Failed to save to database', details: e.message, hint: e.hint },
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
  } catch (err: unknown) {
    const msg =
      typeof err === 'object' && err !== null && 'message' in err && typeof (err as Record<string, unknown>).message === 'string'
        ? (err as Record<string, string>).message
        : 'Failed to publish portfolio';
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
