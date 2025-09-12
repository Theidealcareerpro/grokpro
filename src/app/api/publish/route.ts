/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { supabase } from '@/lib/supabase';
import { renderPortfolioHtml } from '@/lib/publish/renderPortfolioHtml';
import { sanitizePortfolioData, type PortfolioData as StrictPortfolioData } from '@/lib/portfolio-types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* ---------- Input types (loose) ---------- */
type PortfolioProjectIn = { name?: string; description?: string; link?: string };
type PortfolioSocialIn  = { label?: string; url?: string };
type MediaIn = { title?: string; type?: 'video' | 'podcast' | 'article'; link?: string };

type PortfolioDataIn = {
  fullName?: string;
  role?: string;
  tagline?: string;
  location?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  photoDataUrl?: string;
  cvFileDataUrl?: string;
  cvFileName?: string;
  about?: string;
  skills?: string[];
  projects?: PortfolioProjectIn[];
  certifications?: string[];
  media?: MediaIn[];
  socials?: PortfolioSocialIn[];
  templateId?: 'modern' | 'classic' | 'minimal' | 'tech' | 'creative' | 'corporate';
  username?: string;
};

type PublishInput = {
  bodyHtml?: string;
  portfolioData?: PortfolioDataIn;
  fingerprint?: string;
  seo?: { title?: string; description?: string };
};

/* ---------- Utils ---------- */
const toB64 = (s: string) => Buffer.from(s, 'utf8').toString('base64');
const nice = (s?: string) => (s && `${s}`.trim() ? `${s}`.trim() : '');
const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m] as string));

/* ---------- Only used if bodyHtml path is taken ---------- */
function wrapHtmlShell(bodyHtml: string, seo?: PublishInput['seo'], fallbackData?: PortfolioDataIn) {
  const title = esc(seo?.title || fallbackData?.fullName || 'Portfolio');
  const description = esc(seo?.description || fallbackData?.tagline || '');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title}</title>
<meta name="description" content="${description}"/>
<script>
  tailwind = window.tailwind || {};
  tailwind.config = {
    darkMode: 'class',
    theme: {
      screens: { sm:'640px', md:'768px', lg:'1024px', xl:'1280px' },
      extend: {
        colors: {
          navy:{ 700:'#1E3A8A' },
          slate:{ 200:'#E2E8F0' },
          teal:{ 500:'#14B8A6', 600:'#0F766E', 700:'#0F766E' },
          gray:{ 50:'#F9FAFB', 600:'#4B5563', 800:'#1F2937' },
        }
      }
    }
  };
</script>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="min-h-screen antialiased">
${bodyHtml}
</body>
</html>`;
}

/* ---------- API handler ---------- */
export async function POST(req: Request) {
  try {
    const { bodyHtml, portfolioData = {}, fingerprint, seo } = (await req.json()) as PublishInput;

    const GITHUB_PAT = process.env.GITHUB_PAT;
    const GITHUB_OWNER = process.env.GITHUB_OWNER; // username or org
    const GITHUB_OWNER_TYPE = (process.env.GITHUB_OWNER_TYPE || 'user').toLowerCase(); // 'user' | 'org'
    if (!GITHUB_PAT || !GITHUB_OWNER) {
      return NextResponse.json({ error: 'Missing GITHUB_PAT or GITHUB_OWNER' }, { status: 500 });
    }

    const octokit = new Octokit({ auth: GITHUB_PAT });

    // repo name
    const base = nice(portfolioData?.username) || 'portfolio';
    const repoName = `${base}-${Date.now()}`;

    // create repo
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

    // ✅ Sanitize to strict shape expected by renderer
    const strictData: StrictPortfolioData = sanitizePortfolioData(portfolioData);

    // ✅ Build page HTML (await the async renderer)
    const fullHtml = bodyHtml
      ? wrapHtmlShell(String(bodyHtml), seo, portfolioData)
      : await renderPortfolioHtml(strictData);

    // commit files
    await octokit.repos.createOrUpdateFileContents({
      owner, repo: repoName, path: 'index.html',
      message: 'Add generated portfolio (static)',
      content: toB64(fullHtml), branch: 'main',
    });
    await octokit.repos.createOrUpdateFileContents({
      owner, repo: repoName, path: '404.html',
      message: 'Add 404',
      content: toB64('<!doctype html><title>404</title><h1>Not Found</h1>'), branch: 'main',
    });
    await octokit.repos.createOrUpdateFileContents({
      owner, repo: repoName, path: '.nojekyll',
      message: 'Disable Jekyll',
      content: toB64(''), branch: 'main',
    });

    // enable GitHub Pages
    await octokit.request('POST /repos/{owner}/{repo}/pages', {
      owner, repo: repoName, source: { branch: 'main', path: '/' },
    }).catch(async (err: any) => {
      if (err?.status === 409 || err?.status === 422) {
        await octokit.request('PUT /repos/{owner}/{repo}/pages', {
          owner, repo: repoName, source: { branch: 'main', path: '/' },
        });
      } else { throw err; }
    });

    const pagesUrl = `https://${owner}.github.io/${repoName}/`;

    // save metadata
    const rowFingerprint = fingerprint || crypto.randomUUID();
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

    return NextResponse.json({
      ok: true,
      url: pagesUrl,
      repo: `${owner}/${repoName}`,
      portfolio: data,
    });
  } catch (err: any) {
    console.error('Publish error:', err);
    return NextResponse.json({ ok: false, error: err?.message ?? 'Failed to publish portfolio' }, { status: 500 });
  }
}
