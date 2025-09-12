/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

// If you keep using anon key + permissive RLS, this import is fine:
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/* ---------- Types ---------- */
type PortfolioProject = { name?: string; description?: string; link?: string };
type PortfolioSocial  = { label?: string; url?: string };
type Media = { title?: string; type?: 'video' | 'podcast' | 'article'; link?: string };

type PortfolioData = {
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
  projects?: PortfolioProject[];
  certifications?: string[];
  media?: Media[];
  socials?: PortfolioSocial[];
  templateId?: 'modern' | 'classic' | 'minimal' | 'tech' | 'creative' | 'corporate';
  username?: string;
};

type PublishInput = {
  // send this for PERFECT parity: literal HTML from the preview root
  bodyHtml?: string;
  // or send structured data — we'll render a good-looking static fallback
  portfolioData?: PortfolioData;
  fingerprint?: string;
  seo?: { title?: string; description?: string };
};

/* ---------- Small utils ---------- */
const esc = (s = '') =>
  String(s).replace(/[&<>"']/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m] as string));
const toB64 = (s: string) => Buffer.from(s, 'utf8').toString('base64');
const nice = (s?: string) => (s && s.trim() ? s.trim() : '');

/* ---------- Tailwind runtime config (matches your tailwind.config.ts) ---------- */
const TAILWIND_RUNTIME_CONFIG = `
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
`;

/* ---------- Minimal global CSS used by multiple templates (animations, font) ---------- */
const GLOBAL_STYLE = `
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Lora:wght@400;600&display=swap" rel="stylesheet"/>
<style>
  html,body{margin:0}
  body{font-family:'Lora', ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;}
  @keyframes gradientShift{0%{background-position:0% 0%}50%{background-position:100% 50%}100%{background-position:0% 0%}}
  @keyframes spin{to{transform:rotate(360deg)}}
  .avatar-ring::before{
    content:'';position:absolute;inset:0;border-radius:inherit;opacity:.9;
    background:conic-gradient(from 0deg,rgba(20,184,166,0.0) 0deg,rgba(20,184,166,0.45) 90deg,rgba(6,182,212,0.65) 160deg,rgba(34,197,94,0.45) 220deg,rgba(20,184,166,0.0) 360deg);
    animation:spin 12s linear infinite;
    -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
            mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
  }
  @media (prefers-reduced-motion: reduce){
    .animate-[gradientShift_14s_ease_in_out_infinite]{animation:none!important}
    .avatar-ring::before{animation:none!important}
  }
</style>
`;

/* ---------- Very good static fallback renderer (if no bodyHtml provided) ---------- */
function renderFallbackHTML(d: PortfolioData): string {
  const fullName = nice(d.fullName) || 'Your Name';
  const role = nice(d.role);
  const tagline = nice(d.tagline) || 'Delivering expertise with precision and insight';
  const skills = (d.skills || []).filter(Boolean);
  const certifications = (d.certifications || []).filter(Boolean);
  const projects = (d.projects || []).filter(p => nice(p?.name) || nice(p?.description));
  const socials = (d.socials || []).filter(s => nice(s?.label) && nice(s?.url));
  const media = (d.media || []).filter(m => nice(m?.title) || nice(m?.link));

  // one elegant layout that works for all templateIds while staying polished
  return `
<header class="sticky top-0 z-50 backdrop-blur bg-white/85 shadow-sm border-b border-slate-200">
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
    <div class="flex items-center gap-3">
      ${d.photoDataUrl
        ? `<span class="relative inline-block h-8 w-8 overflow-hidden rounded-full ring-2 ring-teal-500/30">
             <img src="${esc(d.photoDataUrl)}" alt="${esc(fullName)}" class="h-full w-full object-cover"/>
           </span>`
        : `<span aria-hidden class="h-8 w-8 rounded-full bg-slate-200"></span>`
      }
      <div class="text-xl sm:text-2xl font-bold text-navy-700 tracking-tight">${esc(fullName)}</div>
    </div>
    <div class="hidden md:flex items-center gap-6 font-medium">
      ${['home','about','skills','projects','certifications','contact'].map(id=>(
        `<a href="#${id}" class="relative px-1 py-2 text-slate-600 hover:text-navy-700">${id[0].toUpperCase()+id.slice(1)}</a>`
      )).join('')}
    </div>
  </nav>
</header>

<section id="home" class="relative flex min-h-[72vh] items-center justify-center overflow-hidden px-6 text-center">
  <div aria-hidden class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,#cbd5e1_0%,transparent_60%),radial-gradient(40%_40%_at_80%_10%,#14B8A633_0%,transparent_70%),linear-gradient(to_bottom,#ffffff,#f1f5f9)]
  animate-[gradientShift_14s_ease_in_out_infinite] bg-[length:160%_160%]"></div>

  <div class="mx-auto flex max-w-4xl flex-col items-center">
    <figure class="group relative mb-6 inline-block rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200">
      <div class="relative h-44 w-44 overflow-hidden rounded-xl">
        ${d.photoDataUrl
          ? `<img src="${esc(d.photoDataUrl)}" alt="${esc(fullName)}" class="h-full w-full object-cover" />`
          : `<span class="absolute inset-0 grid place-items-center text-slate-400">No Photo</span>`
        }
      </div>
    </figure>
    <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-navy-700">${esc(fullName)} ${role ? `| ${esc(role)}` : ''}</h1>
    <p class="mt-4 text-lg md:text-xl max-w-2xl text-slate-600">${esc(tagline)}</p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      ${d.cvFileDataUrl ? `<a href="${esc(d.cvFileDataUrl)}" download="${esc(d.cvFileName || 'cv.pdf')}" class="inline-flex items-center gap-2 rounded-full bg-teal-500 px-6 py-3 font-semibold text-white shadow-lg hover:bg-teal-600">Download CV</a>` : ''}
      ${d.linkedin ? `<a href="${esc(d.linkedin!)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-full border border-teal-600 px-6 py-3 font-semibold text-teal-700 hover:bg-teal-50">LinkedIn</a>` : ''}
    </div>
  </div>
</section>

${d.about ? `
<section id="about" class="mx-auto max-w-5xl px-6 py-16">
  <h2 class="relative mb-8 text-3xl font-bold text-navy-700 inline-block">About Me
    <span class="absolute -bottom-2 left-0 h-1 w-28 bg-gradient-to-r from-teal-500 to-emerald-400" aria-hidden></span>
  </h2>
  <p class="text-lg leading-relaxed text-justify text-slate-700">${esc(d.about!)}</p>
</section>` : ''}

${skills.length ? `
<section id="skills" class="bg-white px-6 py-16">
  <h2 class="relative mb-10 text-3xl font-bold text-navy-700 text-center w-fit mx-auto">Expertise
    <span class="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-28 bg-gradient-to-r from-teal-500 to-emerald-400"></span>
  </h2>
  <div class="mx-auto max-w-3xl flex flex-col gap-4">
    ${skills.map(s=>`
      <div class="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
        <div class="h-2 w-2 rounded-full bg-teal-500" aria-hidden></div>
        <p class="font-medium text-slate-800">${esc(s)}</p>
      </div>
    `).join('')}
  </div>
</section>` : ''}

${projects.length ? `
<section id="projects" class="mx-auto max-w-3xl px-6 py-16">
  <h2 class="relative mb-10 text-3xl font-bold text-navy-700 text-center w-fit mx-auto">Projects
    <span class="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-28 bg-gradient-to-r from-teal-500 to-emerald-400"></span>
  </h2>
  <div class="flex flex-col gap-6">
    ${projects.map(p=>`
      <article class="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
        <h3 class="text-xl font-semibold text-navy-700">${esc(p.name || 'Project')}</h3>
        ${nice(p.description) ? `<p class="mt-1 text-justify text-slate-600">${esc(p.description!)}</p>` : ''}
        ${nice(p.link) ? `<a href="${esc(p.link!)}" target="_blank" class="mt-2 inline-block text-teal-700 underline-offset-4 hover:underline">Visit</a>` : ''}
      </article>
    `).join('')}
  </div>
</section>` : ''}

${certifications.length ? `
<section id="certifications" class="bg-white px-6 py-16">
  <h2 class="relative mb-10 text-3xl font-bold text-navy-700 text-center w-fit mx-auto">Certifications
    <span class="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-28 bg-gradient-to-r from-teal-500 to-emerald-400"></span>
  </h2>
  <div class="mx-auto max-w-3xl flex flex-col gap-3">
    ${certifications.map(c=>`
      <div class="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
        <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 ring-1 ring-teal-200">
          <svg viewBox="0 0 24 24" fill="none" stroke="#0F766E" stroke-width="2" class="h-6 w-6"><circle cx="12" cy="10" r="5"/><path d="M8 21v-3.5a6.97 6.97 0 0 0 8 0V21l-4-2Z"/></svg>
        </span>
        <p class="text-lg text-slate-800">${esc(c)}</p>
      </div>
    `).join('')}
  </div>
</section>` : ''}

<section id="contact" class="bg-white px-6 py-14">
  <h2 class="relative mb-8 text-3xl font-bold text-navy-700 text-center w-fit mx-auto">Contact
    <span class="absolute -bottom-2 left-1/2 -translate-x-1/2 h-1 w-28 bg-gradient-to-r from-teal-500 to-emerald-400"></span>
  </h2>
  <div class="flex flex-wrap justify-center gap-6 text-lg">
    ${nice(d.email) ? `<a href="mailto:${esc(d.email!)}" class="inline-flex items-center gap-2 text-navy-700 hover:text-teal-700">📧 ${esc(d.email!)}</a>` : ''}
    ${nice(d.phone) ? `<a href="tel:${esc(d.phone!)}" class="inline-flex items-center gap-2 text-navy-700 hover:text-teal-700">📞 ${esc(d.phone!)}</a>` : ''}
  </div>
  ${socials.length ? `
    <div class="mt-6 text-center">
      <h3 class="text-base font-semibold text-slate-700">Social Links</h3>
      <div class="mt-1 flex flex-wrap justify-center gap-3">
        ${socials.map(s=>`<a href="${esc(s.url!)}" target="_blank" class="text-teal-700 underline-offset-4 hover:underline">${esc(s.label!)}</a>`).join('')}
      </div>
    </div>` : ''
  }
</section>

<footer class="bg-white py-6 text-center text-slate-500 border-t border-slate-200">
  <p>© ${new Date().getFullYear()} ${esc(fullName)} | Professional Portfolio</p>
</footer>
`;
}

/* ---------- Wrap bodyHtml with full <html> shell (Tailwind config + CDN) ---------- */
function wrapHtmlShell(bodyHtml: string, seo?: PublishInput['seo']) {
  const title = esc(seo?.title || 'Portfolio');
  const description = esc(seo?.description || '');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title}</title>
<meta name="description" content="${description}"/>
${GLOBAL_STYLE}
${TAILWIND_RUNTIME_CONFIG}
</head>
<body class="antialiased">
${bodyHtml}
</body>
</html>`;
}

/* ---------- API handler ---------- */
export async function POST(req: Request) {
  try {
    const { bodyHtml, portfolioData, fingerprint, seo } = (await req.json()) as PublishInput;

    const GITHUB_PAT = process.env.GITHUB_PAT;
    const GITHUB_OWNER = process.env.GITHUB_OWNER; // username or org
    const GITHUB_OWNER_TYPE = (process.env.GITHUB_OWNER_TYPE || 'user').toLowerCase(); // 'user' | 'org'
    if (!GITHUB_PAT || !GITHUB_OWNER) {
      return NextResponse.json({ error: 'Missing GITHUB_PAT or GITHUB_OWNER' }, { status: 500 });
    }

    const octokit = new Octokit({ auth: GITHUB_PAT });

    // repo name (stable-ish if username is present, otherwise timestamped)
    const base = nice(portfolioData?.username) || 'portfolio';
    const repoName = `${base}-${Date.now()}`;

    // Create the repo with an initial default branch
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

    // Build page HTML
    const inner = bodyHtml
      ? String(bodyHtml)
      : renderFallbackHTML(portfolioData || {});
    const fullHtml = wrapHtmlShell(inner, {
      title: seo?.title || portfolioData?.fullName || 'Portfolio',
      description: seo?.description || portfolioData?.tagline || '',
    });

    // Commit files
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

    // Enable GitHub Pages (root of main)
    await octokit.request('POST /repos/{owner}/{repo}/pages', {
      owner, repo: repoName, source: { branch: 'main', path: '/' },
    }).catch(async (err: any) => {
      // If already initialized or needs PUT
      if (err?.status === 409 || err?.status === 422) {
        await octokit.request('PUT /repos/{owner}/{repo}/pages', {
          owner, repo: repoName, source: { branch: 'main', path: '/' },
        });
      } else { throw err; }
    });

    const pagesUrl = `https://${owner}.github.io/${repoName}/`;

    // Save metadata to Supabase (same columns as before)
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
