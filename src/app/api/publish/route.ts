/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type PortfolioProject = { name?: string; description?: string; link?: string };
type PortfolioSocial = { label?: string; url?: string };
type Media = { title?: string; type?: 'video' | 'podcast' | 'article'; link?: string };

type TemplateId =
  | 'classic'
  | 'classicLeft'
  | 'modern'
  | 'minimal'
  | 'corporate'
  | 'tech'
  | 'creative';

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
  templateId?: TemplateId;
  username?: string;
};

const h = (v?: string) =>
  (v ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const list = <T,>(arr: T[] | undefined | null) => (Array.isArray(arr) ? arr : []);
const has = (s?: string | null) => Boolean(s && s.trim());

/** ===== Shared tiny inline icons (keep DOM light; no external libs) ===== */
const ICON = {
  dl: `<svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3v12"/><path d="m7 12 5 5 5-5"/><path d="M5 21h14"/></svg>`,
  link: `<svg class="inline-block -mt-[2px] mr-1 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10 13a5 5 0 0 1 7 7l-2 2M14 17a5 5 0 0 1-7-7l2-2"/></svg>`,
  mail: `<svg class="inline -mt-[2px] mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>`,
  phone: `<svg class="inline -mt-[2px] mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.15 11 19.79 19.79 0 0 1 .08 2.37 2 2 0 0 1 2.05.19h3a2 2 0 0 1 2 1.72A12.66 12.66 0 0 0 7.1 5.7a2 2 0 0 1-.45 2L5.6 8.75a16 16 0 0 0 6.65 6.65l1.05-1.05a2 2 0 0 1 2-.45 12.66 12.66 0 0 0 3.79.07A2 2 0 0 1 22 16.92z"/></svg>`,
  award: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" class="h-6 w-6"><circle cx="12" cy="10" r="5"/><path d="M8 21v-3.5a6.97 6.97 0 0 0 8 0V21l-4-2Z"/></svg>`,
  skill: `<svg class="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 3l2.5 2.5M12 3L9.5 5.5M12 3v6M4 13l2.5-2.5M4 13l2.5 2.5M4 13h6M20 13l-2.5-2.5M20 13l-2.5 2.5M20 13h-6"/></svg>`,
  proj: `<svg class="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`,
};

/** ===== Global + per-template CSS (mirrors your component <style jsx global>) ===== */
const GLOBAL_CSS = `
:root{
  --brand-50:#eff6ff;--brand-100:#dbeafe;--brand-200:#bfdbfe;--brand-300:#93c5fd;--brand-400:#60a5fa;
  --brand-500:#3b82f6;--brand-600:#2563eb;--brand-700:#1d4ed8;--brand-800:#1e40af;--brand-900:#1e3a8a;
  --neon:#00CFFF;
}
html{scroll-behavior:smooth}
@keyframes gradientShift{0%{background-position:0% 0%}50%{background-position:100% 50%}100%{background-position:0% 0%}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes spin360{to{transform:rotate(360deg)}}
.avatar-ring::before{
  content:'';
  position:absolute; inset:0; border-radius:inherit; opacity:.9;
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
          mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
}
@media (prefers-reduced-motion: reduce){
  .animate-[gradientShift_14s_ease_in_out_infinite]{animation:none!important}
  .animate-[gradientShift_12s_ease_infinite]{animation:none!important}
  .avatar-ring::before{animation:none!important}
}
`;

const CSS_BY_TEMPLATE: Record<TemplateId, string> = {
  classic: ``,
  classicLeft: `
  .avatar-ring::before{
    background: conic-gradient(
      from 0deg,
      rgba(20,184,166,0.0) 0deg,
      rgba(20,184,166,0.45) 90deg,
      rgba(6,182,212,0.65) 160deg,
      rgba(34,197,94,0.45) 220deg,
      rgba(20,184,166,0.0) 360deg
    );
    animation: spin 12s linear infinite;
  }`,
  modern: ``,
  minimal: ``,
  corporate: ``,
  tech: `
  .avatar-ring::before{
    background: conic-gradient(
      from 0deg,
      rgba(0,207,255,0.00) 0deg,
      rgba(0,207,255,0.55) 90deg,
      rgba(14,165,233,0.65) 160deg,
      rgba(99,102,241,0.50) 220deg,
      rgba(0,207,255,0.00) 360deg
    );
    animation: spin360 14s linear infinite;
  }`,
  creative: `
  .avatar-ring::before{
    background: conic-gradient(
      from 0deg,
      rgba(0,207,255,0.00) 0deg,
      rgba(255,0,204,0.45) 80deg,
      rgba(0,207,255,0.70) 160deg,
      rgba(168,85,247,0.55) 240deg,
      rgba(0,207,255,0.00) 360deg
    );
    animation: spin360 16s linear infinite;
  }`,
};

/** ===== Tiny UX script for scroll, mobile menu, and active state ===== */
const UX_SCRIPT = `
(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const links = Array.from(document.querySelectorAll('a[href^="#"]'));
  links.forEach(a=>{
    a.addEventListener('click', (e)=>{
      const id = a.getAttribute('href')?.slice(1);
      const el = id ? document.getElementById(id) : null;
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
        history.replaceState(null, '', '#' + id);
      }
    });
  });

  // Mobile menu toggle (if a button is present)
  const toggles = document.querySelectorAll('[data-menu-toggle]');
  toggles.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const target = document.querySelector(btn.getAttribute('data-menu-toggle') || '');
      if (!target) return;
      const open = target.getAttribute('data-open') === 'true';
      target.setAttribute('data-open', (!open).toString());
      btn.setAttribute('aria-expanded', (!open).toString());
      target.classList.toggle('hidden', open);
    });
  });

  // Scroll spy
  const sectionIds = ['home','about','skills','projects','certifications','contact'];
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);
  const navLinks = Array.from(document.querySelectorAll('[data-spy-link]'));
  const setActive = (id) => {
    navLinks.forEach(a=>{
      if (a.getAttribute('href') === '#' + id) a.classList.add('is-active');
      else a.classList.remove('is-active');
    });
  };
  const obs = new IntersectionObserver(entries=>{
    const vis = entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio - a.intersectionRatio)[0];
    if (vis?.target?.id) setActive(vis.target.id);
  }, { rootMargin: '-40% 0px -50% 0px', threshold: [0, .25, .5, .75, 1] });
  sections.forEach(el=>obs.observe(el));
})();
`;

/** ===== Section builders that mirror your React templates ===== */
function renderAboutLight(text: string) {
  return `
<section id="about" class="mx-auto max-w-5xl scroll-mt-24 px-6 py-20" aria-label="About">
  <h2 class="relative mb-10 text-3xl font-bold text-[#0A1E4F] inline-block">
    About Me
    <span class="absolute -bottom-2 left-0 h-1 w-28 bg-gradient-to-r from-[#00CFFF] to-[#FF7AF5]" aria-hidden></span>
  </h2>
  <p class="text-lg leading-relaxed text-justify text-slate-600/90">${h(text)}</p>
</section>`;
}
function renderAboutDarkTeal(text: string) {
  return `
<section id="about" class="mx-auto max-w-5xl scroll-mt-24 px-6 py-20" aria-label="About">
  <h2 class="relative mb-10 text-3xl font-bold text-white inline-block">
    About Me
    <span class="absolute -bottom-2 left-0 h-1 w-28 bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-400" aria-hidden></span>
  </h2>
  <p class="text-lg leading-relaxed text-justify text-gray-200/90">${h(text)}</p>
</section>`;
}
function renderAboutBlue(text: string) {
  return `
<section id="about" class="mx-auto max-w-5xl scroll-mt-24 px-6 py-20" aria-label="About">
  <h2 class="relative mb-10 text-3xl font-bold text-[var(--brand-700)] inline-block">
    About Me
    <span class="absolute -bottom-2 left-0 h-1 w-28 bg-gradient-to-r from-[var(--brand-500)] to-[var(--accent-1)]" aria-hidden></span>
  </h2>
  <p class="text-lg leading-relaxed text-justify text-slate-600/90">${h(text)}</p>
</section>`;
}

function renderSkills({
  items,
  variant,
}: {
  items: string[];
  variant:
    | 'light'        // classic
    | 'darkTeal'     // classic-left
    | 'blue'         // modern/minimal
    | 'corporate'    // corporate
    | 'tech'         // tech
    | 'creative';    // creative
}) {
  if (!items.length) return '';
  const map = {
    light: {
      wrap: 'scroll-mt-24 bg-white px-6 py-20',
      title: 'relative mb-10 text-3xl font-bold text-[#0A1E4F] text-center mx-auto w-fit',
      card: 'group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:ring-1 hover:ring-[#00CFFF]/40',
      icon: 'h-7 w-7 text-[#0A1E4F]',
      text: 'font-medium text-slate-800',
    },
    darkTeal: {
      wrap: 'scroll-mt-24 bg-[#1a2b2b] px-6 py-20',
      title: 'relative mb-10 text-3xl font-bold text-white text-center mx-auto w-fit',
      card: 'group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl hover:border-teal-300/40',
      icon: 'h-7 w-7 text-teal-300',
      text: 'font-medium text-gray-100',
    },
    blue: {
      wrap: 'scroll-mt-24 bg-white px-6 py-20',
      title: 'relative mb-10 text-3xl font-bold text-[var(--brand-700)] text-center mx-auto w-fit',
      card: 'group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:ring-1 hover:ring-[var(--brand-300)]',
      icon: 'h-7 w-7 text-[var(--brand-600)]',
      text: 'font-medium text-slate-800',
    },
    corporate: {
      wrap: 'bg-[#2e3b3e] py-20 px-6',
      title: 'text-3xl font-bold text-center mb-12',
      card: 'group flex items-center gap-4 rounded-xl bg-[#4a5568] p-5 ring-1 ring-white/10 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:ring-yellow-400/40',
      icon: 'h-7 w-7 text-yellow-400',
      text: 'font-medium',
    },
    tech: {
      wrap: 'max-w-4xl mx-auto px-6',
      title: 'text-xl font-semibold text-[color:var(--neon)] mb-3',
      card: 'flex items-center justify-between rounded-lg bg-gray-900/40 p-3 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[rgba(0,207,255,0.35)]',
      icon: 'hidden',
      text: 'text-sm text-gray-200 text-justify',
    },
    creative: {
      wrap: 'max-w-4xl mx-auto px-6 py-6 rounded-xl border border-white/10 bg-white/5 shadow-sm',
      title: 'text-2xl font-semibold text-pink-200 mb-4',
      card: 'flex items-center justify-between rounded-lg bg-fuchsia-900/20 p-3 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[rgba(0,207,255,0.35)]',
      icon: 'hidden',
      text: 'text-sm text-pink-100 text-justify',
    },
  }[variant];

  return `
<section id="skills" class="${map.wrap}" aria-label="Skills">
  <h2 class="${map.title}">Expertise</h2>
  <div class="mx-auto max-w-3xl flex flex-col gap-6">
    ${items
      .map(
        (s) => `
      <div class="${map.card}">
        <span class="${map.icon}">${ICON.skill}</span>
        <p class="${map.text}">${h(s)}</p>
      </div>`
      )
      .join('')}
  </div>
</section>`;
}

function renderProjects({
  items,
  variant,
}: {
  items: PortfolioProject[];
  variant: 'light' | 'darkTeal' | 'blue' | 'corporate' | 'tech' | 'creative';
}) {
  const projects = items.filter((p) => has(p?.name) || has(p?.description));
  if (!projects.length) return '';

  const map = {
    light: {
      wrap: 'mx-auto max-w-3xl scroll-mt-24 px-6 py-20',
      title: 'relative mb-10 text-3xl font-bold text-[#0A1E4F] text-center mx-auto w-fit',
      card: 'group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:ring-1 hover:ring-[#FF7AF5]/40',
      icon: 'h-8 w-8 flex-shrink-0 text-[#FF7AF5]',
      name: 'text-xl font-semibold text-[#0A1E4F]',
      desc: 'mt-1 text-justify text-slate-600',
      link: 'mt-2 inline-flex items-center gap-1 text-[#00CFFF] underline-offset-4 hover:underline',
    },
    darkTeal: {
      wrap: 'mx-auto max-w-3xl scroll-mt-24 px-6 py-20',
      title: 'relative mb-10 text-3xl font-bold text-white text-center mx-auto w-fit',
      card: 'group flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl hover:border-teal-300/40',
      icon: 'h-8 w-8 flex-shrink-0 text-teal-300',
      name: 'text-xl font-semibold text-white',
      desc: 'mt-1 text-justify text-gray-200/90',
      link: 'mt-2 inline-flex items-center gap-1 text-teal-300 underline-offset-4 hover:underline',
    },
    blue: {
      wrap: 'mx-auto max-w-3xl scroll-mt-24 px-6 py-20',
      title: 'relative mb-10 text-3xl font-bold text-[var(--brand-700)] text-center mx-auto w-fit',
      card: 'group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:ring-1 hover:ring-[var(--brand-200)]',
      icon: 'h-8 w-8 flex-shrink-0 text-[var(--brand-600)]',
      name: 'text-xl font-semibold text-[var(--brand-700)]',
      desc: 'mt-1 text-justify text-slate-600',
      link: 'mt-2 inline-flex items-center gap-1 text-[var(--brand-700)] underline-offset-4 hover:underline',
    },
    corporate: {
      wrap: 'mx-auto max-w-3xl py-20 px-6',
      title: 'text-3xl font-bold text-center mb-12',
      card: 'group rounded-xl bg-[#4a5568] p-6 ring-1 ring-white/10 shadow-md transition hover:-translate-y-1 hover:shadow-xl hover:ring-yellow-400/30',
      icon: 'w-9 h-9 text-yellow-400 flex-shrink-0',
      name: 'text-xl font-semibold',
      desc: 'mt-2 text-justify text-gray-200',
      link: 'inline-flex items-center gap-1 text-yellow-400 hover:underline mt-3',
    },
    tech: {
      wrap: 'max-w-4xl mx-auto px-6',
      title: 'text-xl font-semibold text-[color:var(--neon)] mb-3',
      card: 'rounded-lg border border-white/10 bg-gray-900/40 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-[rgba(0,207,255,0.35)]',
      icon: 'hidden',
      name: 'text-lg font-medium text-white',
      desc: 'text-gray-400 mt-2 text-justify leading-relaxed',
      link: 'inline-flex items-center gap-1 text-[color:var(--neon)] hover:underline mt-3',
    },
    creative: {
      wrap: 'max-w-4xl mx-auto px-6 py-6 rounded-xl border border-white/10 bg-white/5 shadow-sm',
      title: 'text-2xl font-semibold text-pink-200 mb-4',
      card: 'rounded-lg border border-white/10 bg-purple-950/40 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-[rgba(0,207,255,0.35)]',
      icon: 'hidden',
      name: 'text-xl font-medium',
      desc: 'text-pink-100 mt-2 text-justify leading-relaxed',
      link: 'inline-flex items-center gap-1 text-[color:var(--neon)] hover:underline mt-3',
    },
  }[variant];

  return `
<section id="projects" class="${map.wrap}" aria-label="Projects">
  <h2 class="${map.title}">Projects</h2>
  <div class="flex flex-col gap-6 max-w-3xl mx-auto">
    ${projects
      .map(
        (p, i) => `
      <article class="${map.card}">
        <span class="${map.icon}">${ICON.proj}</span>
        <div>
          <h3 class="${map.name}">${h(p.name || `Project ${i + 1}`)}</h3>
          ${has(p.description) ? `<p class="${map.desc}">${h(p.description!)}</p>` : ''}
          ${has(p.link) ? `<a href="${h(p.link!)}" target="_blank" rel="noopener noreferrer" class="${map.link}">${ICON.link}Visit</a>` : ''}
        </div>
      </article>`
      )
      .join('')}
  </div>
</section>`;
}

function renderCerts({
  items,
  variant,
}: {
  items: string[];
  variant: 'light' | 'darkTeal' | 'blue' | 'corporate' | 'tech' | 'creative';
}) {
  if (!items.length) return '';
  const map = {
    light: {
      wrap: 'scroll-mt-24 bg-white px-6 py-20',
      title: 'relative mb-10 text-3xl font-bold text-[#0A1E4F] text-center mx-auto w-fit',
      row: 'group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md',
      badge: 'flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFD700]/20 ring-1 ring-[#FFD700]/60',
      text: 'pt-1 text-lg text-slate-800',
    },
    darkTeal: {
      wrap: 'scroll-mt-24 bg-[#1a2b2b] px-6 py-20',
      title: 'relative mb-10 text-3xl font-bold text-white text-center mx-auto w-fit',
      row: 'group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg hover:border-teal-300/35',
      badge: 'flex h-10 w-10 items-center justify-center rounded-lg bg-teal-300/15 ring-1 ring-teal-300/40',
      text: 'text-lg text-gray-100/95',
    },
    blue: {
      wrap: 'scroll-mt-24 bg-white px-6 py-20',
      title: 'relative mb-10 text-3xl font-bold text-[var(--brand-700)] text-center mx-auto w-fit',
      row: 'group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md',
      badge: 'flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-50)] ring-1 ring-[var(--brand-200)]',
      text: 'pt-1 text-lg text-slate-800',
    },
    corporate: {
      wrap: 'bg-[#2e3b3e] py-20 px-6',
      title: 'text-3xl font-bold text-center mb-12',
      row: 'group flex items-center gap-3 rounded-xl bg-[#4a5568] p-4 ring-1 ring-white/10 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg hover:ring-yellow-400/30',
      badge: 'flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400/15 ring-1 ring-yellow-400/40',
      text: 'text-lg',
    },
    tech: {
      wrap: 'max-w-4xl mx-auto px-6',
      title: 'text-xl font-semibold text-[color:var(--neon)] mb-3',
      row: 'flex items-center gap-3 rounded-lg border border-white/10 bg-gray-900/40 p-3 ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[rgba(0,207,255,0.3)]',
      badge: 'flex h-10 w-10 items-center justify-center rounded-md bg-[rgba(0,207,255,0.15)] ring-1 ring-[rgba(0,207,255,0.35)]',
      text: 'text-gray-200 text-justify',
    },
    creative: {
      wrap: 'max-w-4xl mx-auto px-6 py-6 rounded-xl border border-white/10 bg-white/5 shadow-sm',
      title: 'text-2xl font-semibold text-pink-200 mb-4',
      row: 'flex items-center gap-3 rounded-lg border border-white/10 bg-purple-950/40 p-3 ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[rgba(0,207,255,0.3)]',
      badge: 'flex h-10 w-10 items-center justify-center rounded-md bg-[rgba(0,207,255,0.15)] ring-1 ring-[rgba(0,207,255,0.35)]',
      text: 'text-pink-100 text-justify',
    },
  }[variant];

  return `
<section id="certifications" class="${map.wrap}" aria-label="Certifications">
  <h2 class="${map.title}">Certifications</h2>
  <div class="mx-auto max-w-3xl flex flex-col gap-4">
    ${items
      .map(
        (c) => `
      <div class="${map.row}">
        <span class="${map.badge}">${ICON.award}</span>
        <p class="${map.text}">${h(c)}</p>
      </div>`
      )
      .join('')}
  </div>
</section>`;
}

function renderContact({
  email,
  phone,
  variant,
}: {
  email?: string;
  phone?: string;
  variant: 'light' | 'darkTeal' | 'blue' | 'corporate' | 'tech' | 'creative';
}) {
  const bits: string[] = [];
  if (has(email)) bits.push(`<a href="mailto:${h(email!)}" class="inline-flex items-center gap-2 rounded-md px-3 py-2">${ICON.mail}${h(email!)}</a>`);
  if (has(phone)) bits.push(`<a href="tel:${h(phone!)}" class="inline-flex items-center gap-2 rounded-md px-3 py-2">${ICON.phone}${h(phone!)}</a>`);
  if (!bits.length) return '';

  const wrap = {
    light: 'scroll-mt-24 bg-white px-6 py-20 text-[#0A1E4F]',
    darkTeal: 'scroll-mt-24 bg-[#1a2b2b] px-6 py-20 text-gray-100',
    blue: 'scroll-mt-24 bg-white px-6 py-20 text-[var(--brand-700)]',
    corporate: 'bg-[#2e3b3e] py-20 px-6 text-gray-100',
    tech: 'max-w-4xl mx-auto px-6 py-5 text-gray-300',
    creative: 'max-w-4xl mx-auto px-6 py-6 rounded-xl border border-white/10 bg-white/5 shadow-sm text-pink-100',
  }[variant];

  const title = {
    light:
      'relative mb-10 text-3xl font-bold text-[#0A1E4F] text-center mx-auto w-fit',
    darkTeal:
      'relative mb-10 text-3xl font-bold text-white text-center mx-auto w-fit',
    blue:
      'relative mb-10 text-3xl font-bold text-[var(--brand-700)] text-center mx-auto w-fit',
    corporate: 'text-3xl font-bold text-center mb-8',
    tech: 'text-xl font-semibold text-[color:var(--neon)] mb-2',
    creative: 'text-2xl font-semibold text-pink-200 mb-4',
  }[variant];

  const linkClass = {
    light: 'inline-flex items-center gap-2 rounded-md px-3 py-2 text-[#0A1E4F] transition hover:text-[#00CFFF]',
    darkTeal: 'inline-flex items-center gap-2 rounded-md px-3 py-2 text-gray-100 transition hover:text-teal-300',
    blue: 'inline-flex items-center gap-2 rounded-md px-3 py-2 text-[var(--brand-700)] transition hover:text-[var(--brand-800)]',
    corporate: 'flex items-center gap-2 hover:text-yellow-400',
    tech: 'flex items-center gap-2 hover:text-[color:var(--neon)]',
    creative: 'flex items-center gap-2 hover:text-[color:var(--neon)]',
  }[variant];

  return `
<section id="contact" class="${wrap}" aria-label="Contact">
  <h2 class="${title}">Contact</h2>
  <div class="flex flex-wrap justify-center gap-6 text-lg">
    ${bits.map((b)=>b.replace('class="inline-flex', `class="${linkClass.split('class="')[1] || linkClass}`)).join('\n')}
  </div>
</section>`;
}

/** ===== HERO + NAV blocks that mirror each template’s preview ===== */
function heroClassicLeft(d: PortfolioData) {
  const name = has(d.fullName) ? h(d.fullName!) : 'Your Name';
  const role = has(d.role) ? ` | ${h(d.role!)}` : '';
  const tagline = has(d.tagline) ? h(d.tagline!) : 'Delivering expertise with precision and insight';

  return `
<header class="sticky top-0 z-50 backdrop-blur bg-[#0d1a1a]/90 shadow-lg border-b border-white/5">
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between" aria-label="Primary">
    <div class="flex items-center gap-3">
      ${has(d.photoDataUrl)
        ? `<span class="relative inline-block h-8 w-8 overflow-hidden rounded-full ring-2 ring-teal-400/80"><img src="${h(d.photoDataUrl!)}" alt="${name}" class="object-cover h-full w-full"/></span>`
        : `<span aria-hidden class="h-8 w-8 rounded-full bg-white/10 ring-2 ring-teal-400/40"></span>`}
      <div class="text-xl sm:text-2xl font-bold text-teal-400 tracking-tight">${name}</div>
    </div>
    <div class="hidden md:flex items-center gap-6 font-medium">
      ${['home','about','skills','projects','certifications','contact'].map(id=>`<a data-spy-link href="#${id}" class="relative px-1 py-2 text-gray-200 hover:text-teal-300">${id[0].toUpperCase()+id.slice(1)}</a>`).join('')}
    </div>
    <button data-menu-toggle='[data-mobile-menu]' class="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 hover:bg-white/5" aria-label="Open menu" aria-expanded="false">☰</button>
  </nav>
  <div data-mobile-menu class="hidden md:hidden border-t border-white/10 bg-[#0d1a1a]/95" data-open="false">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-3 grid grid-cols-2 gap-3">
      ${['home','about','skills','projects','certifications','contact'].map(id=>`<a data-spy-link href="#${id}" class="rounded-md px-3 py-2 text-sm font-medium ring-1 ring-inset ring-white/10 hover:bg-white/5 text-gray-200">${id[0].toUpperCase()+id.slice(1)}</a>`).join('')}
    </div>
  </div>
</header>

<section id="home" class="relative flex min-h-[88vh] items-center justify-center overflow-hidden px-6 text-center scroll-mt-24" aria-label="Hero">
  <div aria-hidden class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,#1a3a3a_0%,transparent_60%),radial-gradient(40%_40%_at_80%_10%,#14b8a633_0%,transparent_70%),linear-gradient(to_bottom,#0d1a1a,#1a2f2f)] animate-[gradientShift_14s_ease_in_out_infinite] bg-[length:160%_160%]"></div>
  <div class="mx-auto flex max-w-4xl flex-col items-center">
    <figure class="group relative mb-8">
      <span aria-hidden class="absolute -inset-8 -z-10 rounded-full blur-2xl opacity-60 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(20,184,166,0.35)_0%,transparent_60%)]"></span>
      <span aria-hidden class="avatar-ring absolute inset-[-10px] rounded-full"></span>
      <div class="relative h-44 w-44 md:h-52 md:w-52 rounded-[28px] p-[3px] bg-gradient-to-b from-teal-300 via-cyan-300 to-emerald-400 shadow-2xl">
        <div class="relative h-full w-full overflow-hidden rounded-[24px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
          ${has(d.photoDataUrl) ? `<img src="${h(d.photoDataUrl!)}" alt="${name}" class="object-cover h-full w-full"/>` : `<span class="absolute inset-0 grid place-items-center text-teal-300/70">No Photo</span>`}
          <span aria-hidden class="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.12),transparent)] transition-transform duration-[1200ms] ease-out group-hover:translate-x-[120%]"></span>
          <span aria-hidden class="pointer-events-none absolute inset-0 mix-blend-soft-light bg-[radial-gradient(80%_80%_at_50%_0%,rgba(20,184,166,0.25)_0%,transparent_60%)]"></span>
        </div>
      </div>
    </figure>
    <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-sm">${name}${role}</h1>
    <p class="mt-4 text-lg md:text-xl max-w-2xl text-gray-200">${tagline}</p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      ${has(d.cvFileDataUrl) ? `<a href="${h(d.cvFileDataUrl!)}" download="${h(d.cvFileName || 'cv.pdf')}" class="inline-flex items-center gap-2 rounded-full bg-teal-400 px-6 py-3 font-semibold text-[#0c1616] shadow-lg transition hover:bg-teal-300">${ICON.dl}Download CV</a>` : ''}
      ${has(d.linkedin) ? `<a href="${h(d.linkedin!)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-full border border-teal-400 px-6 py-3 font-semibold text-teal-300 shadow-lg transition hover:bg-teal-400 hover:text-[#0c1616]">in LinkedIn</a>` : ''}
    </div>
  </div>
</section>`;
}

function heroClassicLight(d: PortfolioData) {
  const name = has(d.fullName) ? h(d.fullName!) : 'Your Name';
  const role = has(d.role) ? ` | ${h(d.role!)}` : '';
  const tagline = has(d.tagline) ? h(d.tagline!) : 'Delivering expertise with precision and insight';
  return `
<header class="sticky top-0 z-50 backdrop-blur bg-white/85 shadow-sm border-b border-slate-200">
  <nav class="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between" aria-label="Primary">
    <div class="flex items-center gap-3">
      ${has(d.photoDataUrl)
        ? `<span class="relative inline-block h-8 w-8 overflow-hidden rounded-full ring-2 ring-[#0A1E4F]/20"><img src="${h(d.photoDataUrl!)}" alt="${name}" class="object-cover h-full w-full"/></span>`
        : `<span aria-hidden class="h-8 w-8 rounded-full bg-slate-200"></span>`}
      <div class="text-xl sm:text-2xl font-bold text-[#0A1E4F] tracking-tight">${name}</div>
    </div>
    <div class="hidden md:flex items-center gap-6 font-medium">
      ${['home','about','skills','projects','certifications','contact'].map(id=>`<a data-spy-link href="#${id}" class="relative px-1 py-2 text-slate-600 hover:text-[#0A1E4F]">${id[0].toUpperCase()+id.slice(1)}</a>`).join('')}
    </div>
  </nav>
</header>

<section id="home" class="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 text-center scroll-mt-24" aria-label="Hero">
  <div aria-hidden class="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,#cbd5e1_0%,transparent_60%),radial-gradient(40%_40%_at_80%_10%,#00CFFF33_0%,transparent_70%),radial-gradient(45%_45%_at_20%_5%,#FF7AF533_0%,transparent_70%),linear-gradient(to_bottom,#ffffff,#f1f5f9)] animate-[gradientShift_14s_ease_in_out_infinite] bg-[length:160%_160%]"></div>
  <div class="mx-auto flex max-w-4xl flex-col items-center">
    ${has(d.photoDataUrl) ? `
      <figure class="relative mb-6 inline-block rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200">
        <div class="relative h-48 w-48 overflow-hidden rounded-xl">
          <img src="${h(d.photoDataUrl!)}" alt="${name}" class="object-cover h-full w-full"/>
        </div>
        <figcaption class="mt-2 text-sm text-slate-500">${name}</figcaption>
      </figure>` : `<span class="mb-6 inline-block h-48 w-48 rounded-xl bg-slate-200"></span>`
    }
    <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-[#0A1E4F]">${name}${role}</h1>
    <p class="mt-4 text-lg md:text-xl max-w-2xl text-slate-600">${tagline}</p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      ${has(d.cvFileDataUrl) ? `<a href="${h(d.cvFileDataUrl!)}" download="${h(d.cvFileName || 'cv.pdf')}" class="inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-6 py-3 font-semibold text-[#0A1E4F] shadow-lg transition hover:bg-[#e6c200]">${ICON.dl}Download CV</a>` : ''}
      ${has(d.linkedin) ? `<a href="${h(d.linkedin!)}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-full border border-[#00CFFF] px-6 py-3 font-semibold text-[#0A1E4F] shadow-lg transition hover:bg-[#00CFFF] hover:text-white">in LinkedIn</a>` : ''}
    </div>
  </div>
</section>`;
}

function heroModernBlue(d: PortfolioData) {
  // (Uses the “modern/minimal brand-blue” hero from your #3)
  return heroClassicLight(d);
}
function heroMinimalBlue(d: PortfolioData) {
  return heroClassicLight(d);
}
function heroCorporate(d: PortfolioData) {
  const name = has(d.fullName) ? h(d.fullName!) : 'Your Name';
  const role = has(d.role) ? ` | ${h(d.role!)}` : '';
  const tagline = has(d.tagline) ? h(d.tagline!) : 'Delivering expertise with precision and insight';
  return `
<nav class="sticky top-0 z-50 bg-gradient-to-r from-[#0a1c3a] to-[#2b3a5c] shadow-lg">
  <div class="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
    <div class="text-2xl font-bold text-yellow-400">${name}</div>
    <div class="hidden md:flex gap-8 font-medium">
      ${['home','about','skills','projects','certifications','contact'].map(id=>`<a data-spy-link href="#${id}" class="hover:text-yellow-400">${id[0].toUpperCase()+id.slice(1)}</a>`).join('')}
    </div>
  </div>
</nav>
<section id="home" class="h-[90vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden bg-gradient-to-r from-[#0a1c3a] via-[#2b3a5c] to-[#c9982f] bg-[length:400%_400%] animate-[gradientShift_12s_ease_infinite]">
  ${has(d.photoDataUrl)
    ? `<img src="${h(d.photoDataUrl!)}" alt="${name}" class="w-48 h-48 rounded-full object-cover mb-6 ring-4 ring-yellow-400 ring-offset-4 ring-offset-[#1c2526] shadow-2xl"/>`
    : `<div class="w-48 h-48 mb-6 rounded-full bg-gray-600 ring-4 ring-yellow-400 ring-offset-4 ring-offset-[#1c2526]"></div>`}
  <h1 class="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">${name}${role}</h1>
  <p class="mt-4 text-lg md:text-xl max-w-2xl text-gray-200">${tagline}</p>
  <div class="mt-8 flex gap-4 flex-wrap justify-center">
    ${has(d.cvFileDataUrl) ? `<a href="${h(d.cvFileDataUrl!)}" download="${h(d.cvFileName || 'cv.pdf')}" class="px-6 py-3 rounded-full bg-yellow-400 text-[#0a1c3a] font-semibold shadow-lg hover:bg-[#c9982f] hover:text-white transition">${ICON.dl}Download CV</a>` : ''}
    ${has(d.linkedin) ? `<a href="${h(d.linkedin!)}" target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-full border border-yellow-400 text-yellow-400 font-semibold shadow-lg hover:bg-yellow-400 hover:text-[#0a1c3a] transition">in LinkedIn</a>` : ''}
  </div>
</section>`;
}
function heroTech(d: PortfolioData) {
  const name = has(d.fullName) ? h(d.fullName!) : 'Your Name';
  const role = has(d.role) ? h(d.role!) : 'Tech Professional';
  const tagline = has(d.tagline) ? h(d.tagline!) : 'Tech Tagline';
  return `
<header class="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950">
  <div aria-hidden class="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_0%,rgba(0,207,255,0.22)_0%,transparent_60%)]"></div>
  <div class="max-w-4xl mx-auto px-6 py-12 text-center relative">
    <figure class="group relative w-fit mx-auto mb-6">
      <span aria-hidden class="absolute -inset-8 -z-10 rounded-full blur-2xl opacity-60 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(0,207,255,0.26)_0%,transparent_60%)]"></span>
      <span aria-hidden class="avatar-ring absolute inset-[-10px] rounded-[28px]"></span>
      <div class="relative h-36 w-36 md:h-40 md:w-40 rounded-[28px] p-[3px] bg-gradient-to-b from-[#7dd3fc] via-[#38bdf8] to-[#00cfff] shadow-2xl">
        <div class="relative h-full w-full overflow-hidden rounded-[24px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
          ${has(d.photoDataUrl) ? `<img src="${h(d.photoDataUrl!)}" alt="${name}" class="object-cover h-full w-full"/>` : `<span class="absolute inset-0 grid place-items-center text-[color:var(--neon)]/70">No Photo</span>`}
          <span aria-hidden class="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.12),transparent)] transition-transform duration-[1200ms] ease-out group-hover:translate-x-[120%]"></span>
        </div>
      </div>
    </figure>
    <h1 class="text-3xl md:text-4xl font-bold text-white tracking-tight">${name}</h1>
    <p class="text-lg text-gray-400 mt-1">${role}</p>
    <p class="text-sm text-gray-500 mt-1">${tagline}</p>
  </div>
</header>`;
}
function heroCreative(d: PortfolioData) {
  const name = has(d.fullName) ? h(d.fullName!) : 'Your Name';
  const role = has(d.role) ? h(d.role!) : 'Creative Professional';
  const tagline = has(d.tagline) ? h(d.tagline!) : 'Creative Tagline';
  return `
<header class="relative overflow-hidden py-12 text-center bg-gradient-to-r from-[#0d0b1e] via-[#1a0f2e] to-[#250e3a]">
  <div aria-hidden class="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_0%,rgba(255,0,204,0.18)_0%,transparent_60%)]"></div>
  <div aria-hidden class="pointer-events-none absolute inset-0 opacity-[0.08] bg-[repeating-linear-gradient(90deg,transparent_0,transparent_28px,rgba(255,255,255,0.16)_29px,transparent_30px)]"></div>
  <div class="relative z-10 max-w-4xl mx-auto px-6">
    <figure class="group relative w-fit mx-auto mb-6">
      <span aria-hidden class="absolute -inset-10 -z-10 rounded-[36px] blur-3xl opacity-70 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(255,0,204,0.28)_0%,transparent_60%)]"></span>
      <span aria-hidden class="avatar-ring absolute inset-[-12px] rounded-[28px]"></span>
      <div class="relative h-36 w-36 md:h-40 md:w-40 rounded-[28px] p-[3px] bg-gradient-to-b from-fuchsia-400 via-pink-400 to-[color:var(--neon)] shadow-2xl">
        <div class="relative h-full w-full overflow-hidden rounded-[24px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
          ${has(d.photoDataUrl) ? `<img src="${h(d.photoDataUrl!)}" alt="${name}" class="object-cover h-full w-full"/>` : `<span class="absolute inset-0 grid place-items-center text-pink-200/80">No Photo</span>`}
          <span aria-hidden class="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.14),transparent)] transition-transform duration-[1200ms] ease-out group-hover:translate-x-[120%]"></span>
        </div>
      </div>
    </figure>
    <h1 class="text-4xl font-bold tracking-tight">${name}</h1>
    <p class="text-xl text-pink-200 mt-2">${role}</p>
    <p class="text-sm text-pink-100 mt-1">${tagline}</p>
  </div>
</header>`;
}

/** ===== Page builders (compose hero + sections exactly per preview) ===== */
function buildPage(data: PortfolioData, tpl: TemplateId) {
  const name = has(data.fullName) ? h(data.fullName!) : 'Your Name';
  const bodyClass = {
    classic: `font-serif bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800 min-h-screen antialiased`,
    classicLeft: `font-serif bg-gradient-to-b from-[#0f1a1a] to-[#1b2b2b] text-gray-100 min-h-screen antialiased`,
    modern: `font-serif bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800 min-h-screen antialiased`,
    minimal: `font-serif bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800 min-h-screen antialiased`,
    corporate: `font-serif bg-gradient-to-b from-[#1c2526] to-[#2e3b3e] text-gray-100 min-h-screen`,
    tech: `font-mono bg-gray-950 text-gray-100 min-h-screen antialiased`,
    creative: `font-sans bg-gradient-to-r from-[#0d0b1e] via-[#1a0f2e] to-[#250e3a] text-white min-h-screen antialiased`,
  }[tpl];

  const about = has(data.about)
    ? (tpl === 'classicLeft'
        ? renderAboutDarkTeal(data.about!)
        : tpl === 'classic' || tpl === 'modern' || tpl === 'minimal'
        ? renderAboutLight(data.about!)
        : tpl === 'corporate'
        ? `<section id="about" class="max-w-5xl mx-auto py-20 px-6"><h2 class="text-3xl font-bold mb-6 relative inline-block after:absolute after:-bottom-2 after:left-0 after:w-24 after:h-1 after:bg-gradient-to-r from-yellow-400 to-[#c9982f]">About Me</h2><p class="text-lg leading-relaxed text-justify">${h(
            data.about!
          )}</p></section>`
        : tpl === 'tech'
        ? `<section id="about" class="max-w-4xl mx-auto px-6 py-8"><h2 class="text-xl font-semibold text-[color:var(--neon)] mb-2">About Me</h2><p class="text-gray-300 leading-relaxed text-justify">${h(
            data.about!
          )}</p></section>`
        : `<section id="about" class="max-w-4xl mx-auto px-6 py-10 rounded-xl border border-white/10 bg-white/5 shadow-sm"><h2 class="text-2xl font-semibold text-pink-200 mb-4">About Me</h2><p class="text-pink-100 leading-relaxed text-justify">${h(
            data.about!
          )}</p></section>`)
    : '';

  const skills = list(data.skills).filter(Boolean);
  const skillsHtml =
    skills.length === 0
      ? ''
      : renderSkills({
          items: skills as string[],
          variant:
            tpl === 'classicLeft'
              ? 'darkTeal'
              : tpl === 'classic'
              ? 'light'
              : tpl === 'modern' || tpl === 'minimal'
              ? 'blue'
              : tpl === 'corporate'
              ? 'corporate'
              : tpl === 'tech'
              ? 'tech'
              : 'creative',
        });

  const projects = list(data.projects);
  const projectsHtml =
    projects.length === 0
      ? ''
      : renderProjects({
          items: projects,
          variant:
            tpl === 'classicLeft'
              ? 'darkTeal'
              : tpl === 'classic'
              ? 'light'
              : tpl === 'modern' || tpl === 'minimal'
              ? 'blue'
              : tpl === 'corporate'
              ? 'corporate'
              : tpl === 'tech'
              ? 'tech'
              : 'creative',
        });

  const certs = list<string>(data.certifications).filter(Boolean);
  const certsHtml =
    certs.length === 0
      ? ''
      : renderCerts({
          items: certs,
          variant:
            tpl === 'classicLeft'
              ? 'darkTeal'
              : tpl === 'classic'
              ? 'light'
              : tpl === 'modern' || tpl === 'minimal'
              ? 'blue'
              : tpl === 'corporate'
              ? 'corporate'
              : tpl === 'tech'
              ? 'tech'
              : 'creative',
        });

  const contactHtml = renderContact({
    email: data.email,
    phone: data.phone,
    variant:
      tpl === 'classicLeft'
        ? 'darkTeal'
        : tpl === 'classic'
        ? 'light'
        : tpl === 'modern' || tpl === 'minimal'
        ? 'blue'
        : tpl === 'corporate'
        ? 'corporate'
        : tpl === 'tech'
        ? 'tech'
        : 'creative',
  });

  const footer =
    tpl === 'classicLeft'
      ? `<footer class="bg-[#0d1a1a] py-6 text-center text-gray-400"><p>© ${new Date().getFullYear()} ${name} | Professional Portfolio</p></footer>`
      : tpl === 'classic' || tpl === 'modern' || tpl === 'minimal'
      ? `<footer class="bg-white py-6 text-center text-slate-500 border-t border-slate-200"><p>© ${new Date().getFullYear()} ${name} | Professional Portfolio</p></footer>`
      : tpl === 'corporate'
      ? `<footer class="bg-[#0a1c3a] text-gray-400 text-center py-6"><p>© ${new Date().getFullYear()} ${name} | Professional Portfolio</p></footer>`
      : tpl === 'tech'
      ? `<footer class="bg-gray-900 py-3 text-center text-gray-500"><p>© ${new Date().getFullYear()} ${name} | Tech Portfolio</p></footer>`
      : `<footer class="bg-[#130a22] py-4 text-center text-pink-200/70"><p>© ${new Date().getFullYear()} ${name} | Creative Portfolio</p></footer>`;

  const hero =
    tpl === 'classicLeft'
      ? heroClassicLeft(data)
      : tpl === 'classic'
      ? heroClassicLight(data)
      : tpl === 'modern'
      ? heroModernBlue(data)
      : tpl === 'minimal'
      ? heroMinimalBlue(data)
      : tpl === 'corporate'
      ? heroCorporate(data)
      : tpl === 'tech'
      ? heroTech(data)
      : heroCreative(data);

  return { bodyClass, hero, about, skillsHtml, projectsHtml, certsHtml, contactHtml, footer };
}

function buildHtml(data: PortfolioData) {
  const tpl: TemplateId = (data.templateId as TemplateId) || 'modern';
  const { bodyClass, hero, about, skillsHtml, projectsHtml, certsHtml, contactHtml, footer } = buildPage(data, tpl);
  const name = has(data.fullName) ? h(data.fullName!) : 'Your Name';

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${name} | Portfolio</title>

<!-- Tailwind CDN (guarantees class parity on GitHub Pages) -->
<script src="https://cdn.tailwindcss.com"></script>
<script>tailwind.config={ darkMode:'class' }</script>

<style>
${GLOBAL_CSS}
${CSS_BY_TEMPLATE[tpl] || ''}
/* Active link styling for scroll-spy */
a[data-spy-link].is-active{ color: inherit; }
header a[data-spy-link].is-active::after{
  content:''; position:absolute; left:0; right:0; bottom:-2px; height:2px;
  background-image: linear-gradient(90deg, rgb(34 211 238), rgb(99 102 241));
}
</style>
</head>
<body class="${bodyClass}">
  ${hero}
  ${about}
  ${skillsHtml}
  ${projectsHtml}
  ${certsHtml}
  ${contactHtml}
  ${footer}

<script>${UX_SCRIPT}</script>
</body>
</html>`;
}

/** ===== API handler (creates repo, commits HTML, enables Pages, upserts Supabase) ===== */
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
    const GITHUB_OWNER = process.env.GITHUB_OWNER;
    const GITHUB_OWNER_TYPE = process.env.GITHUB_OWNER_TYPE ?? 'user'; // 'user' | 'org'
    if (!GITHUB_PAT || !GITHUB_OWNER) {
      return NextResponse.json({ error: 'Missing GITHUB_PAT or GITHUB_OWNER' }, { status: 500 });
    }

    const octokit = new Octokit({ auth: GITHUB_PAT });
    const repoName = `portfolio-${Date.now()}`;
    if (GITHUB_OWNER_TYPE === 'org') {
      await octokit.repos.createInOrg({ org: GITHUB_OWNER, name: repoName, private: false, auto_init: true });
    } else {
      await octokit.repos.createForAuthenticatedUser({ name: repoName, private: false, auto_init: true });
    }

    const owner = GITHUB_OWNER;
    const homepage = `https://${owner}.github.io/${repoName}/`;
    const html = buildHtml(portfolioData);
    const toB64 = (s: string) => Buffer.from(s, 'utf8').toString('base64');

    await octokit.repos.createOrUpdateFileContents({
      owner, repo: repoName, path: 'index.html', message: 'Add generated portfolio', content: toB64(html), branch: 'main',
    });
    await octokit.repos.createOrUpdateFileContents({
      owner, repo: repoName, path: '404.html', message: 'Add 404 page', content: toB64('<h1>404 - Not Found</h1>'), branch: 'main',
    });
    await octokit.repos.createOrUpdateFileContents({
      owner, repo: repoName, path: '.nojekyll', message: 'Disable Jekyll', content: toB64(''), branch: 'main',
    });

    // Enable GitHub Pages
    await octokit.request('POST /repos/{owner}/{repo}/pages', {
      owner, repo: repoName, source: { branch: 'main', path: '/' },
    }).catch(async (err: any) => {
      if (err?.status === 409 || err?.status === 422) {
        await octokit.request('PUT /repos/{owner}/{repo}/pages', {
          owner, repo: repoName, source: { branch: 'main', path: '/' },
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
      return NextResponse.json(
        { error: 'Failed to save to database', details: error.message, hint: (error as any).hint },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, url: homepage, repo: `${owner}/${repoName}`, portfolio: data });
  } catch (err: any) {
    console.error('Publish error:', err);
    return NextResponse.json({ ok: false, error: err?.message ?? 'Failed to publish portfolio' }, { status: 500 });
  }
}
