/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import { randomUUID } from 'crypto';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type PortfolioData = {
  fullName?: string;
  photoDataUrl?: string;
  about?: string;
  skills?: string[];
  projects?: { name?: string; description?: string; link?: string }[];
  certifications?: string[];
  media?: { title?: string; type?: 'video' | 'podcast' | 'article'; link?: string }[];
  email?: string;
  phone?: string;
  linkedin?: string;
  socials?: { label?: string; url?: string }[];
  cvFileDataUrl?: string;
  cvFileName?: string;
};

export async function POST(req: Request) {
  try {
    const { portfolioData, fingerprint } = (await req.json()) as {
      portfolioData?: PortfolioData;
      fingerprint?: string;
    };
    if (!portfolioData) {
      return NextResponse.json({ error: 'Portfolio data is required' }, { status: 400 });
    }

    const GITHUB_PAT = process.env.GITHUB_PAT;
    const GITHUB_OWNER = process.env.GITHUB_OWNER;              // your org: TheidealcareerproGen
    const GITHUB_OWNER_TYPE = process.env.GITHUB_OWNER_TYPE ?? 'user'; // 'org' | 'user'
    if (!GITHUB_PAT || !GITHUB_OWNER) {
      return NextResponse.json({ error: 'Missing GITHUB_PAT or GITHUB_OWNER' }, { status: 500 });
    }

    const octokit = new Octokit({ auth: GITHUB_PAT });
    const repoName = `portfolio-${Date.now()}`;

    // Create repo and capture ACTUAL owner login + default branch
    let ownerLogin = GITHUB_OWNER;
    let defaultBranch = 'main';

    if (GITHUB_OWNER_TYPE === 'org') {
      const { data: repo } = await octokit.repos.createInOrg({
        org: GITHUB_OWNER,
        name: repoName,
        private: false,
        auto_init: true, // ensures default branch exists
      });
      ownerLogin = repo.owner?.login ?? GITHUB_OWNER;
      defaultBranch = repo.default_branch ?? defaultBranch;
    } else {
      const { data: repo } = await octokit.repos.createForAuthenticatedUser({
        name: repoName,
        private: false,
        auto_init: true,
      });
      ownerLogin = repo.owner?.login ?? ownerLogin;
      defaultBranch = repo.default_branch ?? defaultBranch;
    }

    // Build HTML
    const html = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${portfolioData.fullName || 'Portfolio'} Portfolio</title>
<style>
 body{font-family:Arial,sans-serif;margin:0;padding:20px}
 .portfolio-content{max-width:800px;margin:0 auto}
 h1{font-size:2em} h2{font-size:1.5em;margin-top:20px}
 p,ul{line-height:1.6} img{max-width:100%;height:auto}
 a{color:#07f;text-decoration:none} a:hover{text-decoration:underline}
</style></head><body><div class="portfolio-content">
<h1>${portfolioData.fullName || 'Your Name'}</h1>
${portfolioData.photoDataUrl ? `<img src="${portfolioData.photoDataUrl}" alt="Headshot" style="width:150px;border-radius:50%">` : ''}
${portfolioData.about ? `<h2>About</h2><p>${portfolioData.about}</p>` : ''}
${portfolioData.skills?.filter(Boolean)?.length ? `<h2>Skills</h2><ul>${portfolioData.skills!.map(s => (s ? `<li>${s}</li>` : '')).join('')}</ul>` : ''}
${portfolioData.projects?.filter(p => p.name || p.description)?.length
  ? `<h2>Projects</h2>${portfolioData.projects!.map(p =>
      `<div><h3>${p.name || 'Project'}</h3><p>${p.description ?? ''}</p>${p.link ? `<a href="${p.link}" target="_blank">Visit</a>` : ''}</div>`
    ).join('')}` : ''}
${portfolioData.certifications?.filter(Boolean)?.length ? `<h2>Certifications</h2><ul>${portfolioData.certifications!.map(c => (c ? `<li>${c}</li>` : '')).join('')}</ul>` : ''}
${portfolioData.media?.filter(m => m.title || m.link)?.length
  ? `<h2>Media</h2>${portfolioData.media!.map(m =>
      `<div><h3>${m.title || 'Media'}</h3><p>${m.type ?? ''}</p>${m.link ? `<a href="${m.link}" target="_blank">View</a>` : ''}</div>`
    ).join('')}` : ''}
<h2>Contact</h2>
<p>${portfolioData.email ? `Email: <a href="mailto:${portfolioData.email}">${portfolioData.email}</a>` : ''}</p>
<p>${portfolioData.phone ? `Phone: ${portfolioData.phone}` : ''}</p>
<p>${portfolioData.linkedin ? `LinkedIn: <a href="${portfolioData.linkedin}" target="_blank">LinkedIn</a>` : ''}</p>
${portfolioData.socials?.filter(s => s.label && s.url)?.length
  ? `<h3>Social Links</h3>${portfolioData.socials!.map(s => (s.label && s.url ? `<a href="${s.url}" target="_blank">${s.label}</a><br/>` : '')).join('')}`
  : ''}
${portfolioData.cvFileDataUrl ? `<a href="${portfolioData.cvFileDataUrl}" download="${portfolioData.cvFileName || 'cv.pdf'}">Download CV</a>` : ''}
</div></body></html>`;

    const toB64 = (s: string) => Buffer.from(s, 'utf8').toString('base64');

    // Commit files to the correct owner + default branch
    await octokit.repos.createOrUpdateFileContents({
      owner: ownerLogin,
      repo: repoName,
      path: 'index.html',
      message: 'Add generated portfolio',
      content: toB64(html),
      branch: defaultBranch,
    });
    await octokit.repos.createOrUpdateFileContents({
      owner: ownerLogin,
      repo: repoName,
      path: '404.html',
      message: 'Add 404 page',
      content: toB64('<h1>404 - Not Found</h1>'),
      branch: defaultBranch,
    });
    await octokit.repos.createOrUpdateFileContents({
      owner: ownerLogin,
      repo: repoName,
      path: '.gitignore',
      message: 'Add .gitignore',
      content: toB64('node_modules\n'),
      branch: defaultBranch,
    });

    // Enable GitHub Pages on that branch
    await octokit.request('POST /repos/{owner}/{repo}/pages', {
      owner: ownerLogin,
      repo: repoName,
      source: { branch: defaultBranch, path: '/' },
    }).catch(async (err: any) => {
      if (err?.status === 409 || err?.status === 422) {
        await octokit.request('PUT /repos/{owner}/{repo}/pages', {
          owner: ownerLogin,
          repo: repoName,
          source: { branch: defaultBranch, path: '/' },
        });
      } else {
        throw err;
      }
    });

    // Upsert Supabase row for this fingerprint
    const rowFingerprint = fingerprint ?? randomUUID();
    const expiryIso = new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString();

    const { data, error } = await supabase
      .from('portfolios')
      .upsert(
        {
          fingerprint: rowFingerprint,
          expiry: expiryIso,
          donation_status: { amount: 0, extendedDays: 0 },
          github_repo: `${ownerLogin}/${repoName}`,
        },
        { onConflict: 'fingerprint' }
      )
      .select()
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: 'Failed to save to database', details: (error as any).message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      url: `https://${ownerLogin}.github.io/${repoName}/`,
      repo: `${ownerLogin}/${repoName}`,
      portfolio: data,
    });
  } catch (err: any) {
    console.error('Publish error:', err);
    return NextResponse.json({ ok: false, error: err?.message ?? 'Failed to publish portfolio' }, { status: 500 });
  }
}
