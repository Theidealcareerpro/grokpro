// publish
import * as React from 'react';
import {
  UserRound,
  Wand2,
  FolderGit2,
  BookOpen,
  Image as ImageIcon,
  Mail,
  Phone,
  Linkedin,
  Download,
  Award,
  Link as LinkIcon,
  Circle,
  Menu,
  Sparkles,
  Copy as CopyIcon,
} from 'lucide-react';
import type { PortfolioData } from '@/lib/portfolio-types';

const SECTION_IDS = ['about', 'skills', 'projects', 'certifications', 'media', 'contact'] as const;

// Safe getter for string fields
function getStr(obj: unknown, keys: string[]): string {
  if (typeof obj !== 'object' || obj === null) return '';
  const rec = obj as Record<string, unknown>;
  for (const k of keys) {
    const v = rec[k];
    if (typeof v === 'string') return v;
  }
  return '';
}

type ProjectNorm = { name: string; desc: string; link: string };
type MediaNorm = { title: string; type: string; link: string };
type CertNorm = string;

export default function PortfolioPublish({ data }: { data: PortfolioData }) {
  // ===== Data guards (SSR-safe) =====
  const fullName = data?.fullName || 'Your Name';
  const role = data?.role || 'Classic Professional';
  const tagline = data?.tagline || 'Classic Tagline';
  const location = data?.location || 'Location';
  const photo = data?.photoDataUrl || '';

  // Normalize arrays for resilience
  const skills: string[] = Array.isArray(data?.skills)
    ? data!.skills.map((s) => (typeof s === 'string' ? s : String(s ?? ''))).filter((s) => s.trim() !== '')
    : [];

  const projects: ProjectNorm[] = Array.isArray(data?.projects)
    ? data!.projects
        .map((p) => ({
          name: getStr(p, ['name', 'title']),
          desc: getStr(p, ['description', 'summary']),
          link: getStr(p, ['link', 'url']),
        }))
        .filter((x) => (x.name || x.desc || x.link).trim() !== '')
    : [];

  const certifications: CertNorm[] = Array.isArray(data?.certifications)
    ? data!.certifications
        .map((c) => (typeof c === 'string' ? c : getStr(c, ['name', 'title'])))
        .filter((s) => s.trim() !== '')
    : [];

  const media: MediaNorm[] = Array.isArray(data?.media)
    ? data!.media
        .map((m) => ({
          title: getStr(m, ['title', 'name']),
          type: getStr(m, ['type']) || 'Media',
          link: getStr(m, ['link', 'url']),
        }))
        .filter((x) => (x.title || x.link).trim() !== '')
    : [];

  const socials = Array.isArray(data?.socials) ? data!.socials.filter((s) => s && s.label && s.url) : [];

  return (
    <div className="classic-surface min-h-screen antialiased">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] rounded-md bg-black/5 px-3 py-2 ring-1 ring-black/10 backdrop-blur"
      >
        Skip to content
      </a>

      {/* Spotlight + progress */}
      <div aria-hidden className="fixed inset-0 pointer-events-none z-[1]" id="__spotlight" />
      <div
        aria-hidden
        id="__progress"
        className="fixed inset-x-0 top-0 z-[60] h-1 bg-gradient-to-r from-[var(--c-accent)] via-[var(--c-accent-soft)] to-[var(--c-accent)] w-0 transition-[width]"
      />

      {/* NAVBAR */}
      <nav id="__nav" className="sticky top-0 z-50 backdrop-blur bg-white/60 border-b border-transparent">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            {/* Brand */}
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="flex items-baseline gap-3"
            >
              <span className="text-lg font-semibold tracking-wide text-[var(--c-text)]">{fullName}</span>
              <span className="hidden md:inline text-xs text-[var(--c-muted)]">{role}</span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {data?.about && <NavLink id="about" label="About" />}
              {skills.length > 0 && <NavLink id="skills" label="Skills" />}
              {projects.length > 0 && <NavLink id="projects" label="Projects" />}
              {certifications.length > 0 && <NavLink id="certifications" label="Certifications" />}
              {media.length > 0 && <NavLink id="media" label="Media" />}
              <NavLink id="contact" label="Contact" />

              {data?.cvFileDataUrl && (
                <a
                  data-magnet
                  href={data.cvFileDataUrl}
                  download={data.cvFileName ?? 'cv.pdf'}
                  className="ml-2 inline-flex items-center gap-2 rounded-full bg-[var(--c-accent)] px-4 py-1.5 text-gray-900 font-semibold shadow-md hover:brightness-110"
                >
                  <Download className="h-4 w-4" /> CV
                </a>
              )}
            </div>

            {/* Theme & Mobile toggle */}
            <div className="flex items-center gap-2">
              <button
                id="__theme"
                className="hidden md:inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1.5 text-xs ring-1 ring-black/10 hover:bg-black/10 backdrop-blur"
              >
                <Sparkles size={14} />
                <span>Theme</span>
              </button>
              <button
                id="__hamburger"
                className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md bg-black/5 ring-1 ring-black/10"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile drawer */}
          <div id="__drawer" className="hidden md:hidden border-t border-black/10 py-2 bg-white/70 backdrop-blur">
            <div className="flex flex-col">
              {data?.about && <NavLink id="about" label="About" mobile />}
              {skills.length > 0 && <NavLink id="skills" label="Skills" mobile />}
              {projects.length > 0 && <NavLink id="projects" label="Projects" mobile />}
              {certifications.length > 0 && <NavLink id="certifications" label="Certifications" mobile />}
              {media.length > 0 && <NavLink id="media" label="Media" mobile />}
              <NavLink id="contact" label="Contact" mobile />
              {data?.cvFileDataUrl && (
                <a
                  href={data.cvFileDataUrl}
                  download={data.cvFileName ?? 'cv.pdf'}
                  className="mt-1 inline-flex items-center gap-2 rounded-full bg-[var(--c-accent)] px-4 py-2 text-gray-900 font-semibold shadow-md"
                >
                  <Download className="h-4 w-4" /> CV
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header className="relative overflow-hidden py-16 text-center z-10">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight drop-shadow reveal" data-reveal>
            {fullName}
          </h1>
          <p className="text-xl md:text-2xl text-[var(--c-subtle)] mt-2 reveal" data-reveal>
            {role}
          </p>
          <p className="mt-3 text-sm md:text-base text-[var(--c-muted)] text-justify max-w-2xl mx-auto reveal" data-reveal>
            {tagline}
          </p>
          <p className="text-sm md:text-base text-[var(--c-muted)] mt-1 reveal" data-reveal>
            {location}
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 reveal" data-reveal>
            {data?.cvFileDataUrl && (
              <a
                data-magnet
                href={data.cvFileDataUrl}
                download={data.cvFileName ?? 'cv.pdf'}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--c-accent)] px-5 py-2 font-semibold text-gray-900 shadow-md transition will-change-transform"
              >
                <Download className="h-4 w-4" /> Download CV
              </a>
            )}
            {data?.linkedin && (
              <a
                data-magnet
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--c-accent)] px-5 py-2 font-semibold text-[var(--c-accent)] shadow-md transition will-change-transform hover:bg-[var(--c-accent)] hover:text-gray-900"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </header>

      {/* PORTRAIT (kept outside sections, as in preview) */}
      {photo && (
        <section aria-label="Profile image" className="relative z-10 max-w-4xl mx-auto px-6 -mt-4 mb-6">
          <figure className="group mx-auto w-fit">
            <span aria-hidden className="portrait-glow absolute -inset-10 -z-10 blur-3xl opacity-60" />
            <div className="portrait-frame relative h-56 w-56 md:h-64 md:w-64 rounded-[30px] p-[2px] shadow-2xl">
              <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-white/70 backdrop-blur-md ring-1 ring-black/10">
                <span
                  aria-hidden
                  className="absolute inset-0 opacity-[0.10]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgba(0,0,0,.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,.06) 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                  }}
                />
                <img src={photo} alt={fullName} className="absolute inset-0 h-full w-full object-cover" />
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.32),transparent)] transition-transform duration-[1200ms] ease-out"
                />
              </div>
            </div>
          </figure>
        </section>
      )}

      {/* RIGHT DOT NAV */}
      <aside aria-label="Sections" className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
        {SECTION_IDS.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className="grid place-items-center h-6 w-6 rounded-full ring-1 ring-black/10 transition hover:ring-[var(--c-accent)] bg-black/5"
            data-dot={id}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
            title={id}
          >
            <Circle className="h-3 w-3" />
          </a>
        ))}
      </aside>

      {/* MAIN */}
      <main id="main" className="relative z-10 max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* ABOUT */}
        {data?.about && (
          <Section id="about" icon={<UserRound size={20} />} title="About Me">
            <p className="text-[var(--c-text)] leading-relaxed text-justify" data-reveal>
              {data.about}
            </p>
          </Section>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <Section id="skills" icon={<Wand2 size={20} />} title="Skills">
            <div className="mx-auto max-w-3xl flex flex-col gap-3">
              {skills.map((s, i) => (
                <div
                  key={`${s}-${i}`}
                  className="flex items-center justify-between rounded-lg bg-[var(--chip-bg)] p-3 ring-1 ring-black/10 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[var(--chip-ring)]"
                  data-reveal
                >
                  <span className="text-sm text-[var(--c-text)] text-justify">{s}</span>
                  <span className="h-2 w-2 rounded-full bg-[var(--c-accent)]/90" />
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <Section id="projects" icon={<FolderGit2 size={20} />} title="Projects">
            <div className="mx-auto max-w-3xl flex flex-col gap-4">
              {projects.map((p, i) => (
                <article
                  key={`${p.name || p.link}-${i}`}
                  className="rounded-lg border border-black/10 bg-[var(--card-bg)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--card-ring)]"
                  data-reveal
                >
                  <h3 className="text-xl font-medium">{p.name.trim() || `Project ${i + 1}`}</h3>
                  {p.desc.trim() && <p className="text-[var(--c-subtle)] mt-2 text-justify leading-relaxed">{p.desc}</p>}
                  {p.link.trim() && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[var(--c-accent)] hover:underline mt-3"
                    >
                      <LinkIcon size={16} /> View
                    </a>
                  )}
                </article>
              ))}
            </div>
          </Section>
        )}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <Section id="certifications" icon={<BookOpen size={20} />} title="Certifications">
            <div className="mx-auto max-w-3xl flex flex-col gap-3">
              {certifications.map((cert, index) => (
                <div
                  key={`${cert}-${index}`}
                  className="flex items-center gap-3 rounded-lg border border-black/10 bg-[var(--card-bg)] p-3 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[var(--card-ring)]"
                  data-reveal
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--badge-bg)] ring-1 ring-[var(--badge-ring)]">
                    <Award className="h-6 w-6 text-[var(--c-accent)]" />
                  </span>
                  <p className="text-[var(--c-text)] text-justify">{cert}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* MEDIA */}
        {media.length > 0 && (
          <Section id="media" icon={<ImageIcon size={20} />} title="Media">
            <div className="mx-auto max-w-3xl flex flex-col gap-4">
              {media.map((m, i) => {
                const label = m.type || 'Media';
                const labelNice = label.charAt(0).toUpperCase() + label.slice(1);
                return (
                  <div
                    key={`${m.title || m.link}-${i}`}
                    className="rounded-lg border border-black/10 bg-[var(--card-bg)] p-4 transition hover:border-[var(--card-ring)]"
                    data-reveal
                  >
                    <h3 className="text-xl font-medium">{m.title.trim() || `Media ${i + 1}`}</h3>
                    <p className="text-[var(--c-subtle)] mt-1 text-justify">{labelNice}</p>
                    {m.link.trim() && (
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[var(--c-accent)] hover:underline mt-2"
                      >
                        <LinkIcon size={16} /> View
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* CONTACT */}
        <Section id="contact" icon={<Mail size={20} />} title="Contact">
          <div className="text-[var(--c-text)] space-y-2">
            {data?.email && (
              <div className="flex items-center gap-2" data-reveal>
                <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:text-[var(--c-accent)]">
                  <Mail size={16} /> {data.email}
                </a>
                <button
                  className="copy-btn inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ring-1 ring-black/10 hover:bg-black/5"
                  data-value={data.email}
                  aria-label="Copy email"
                >
                  <CopyIcon size={14} />
                  <span className="copy-label">Copy</span>
                </button>
              </div>
            )}
            {data?.phone && (
              <div className="flex items-center gap-2" data-reveal>
                <a href={`tel:${data.phone}`} className="flex items-center gap-2 hover:text-[var(--c-accent)]">
                  <Phone size={16} /> {data.phone}
                </a>
                <button
                  className="copy-btn inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ring-1 ring-black/10 hover:bg-black/5"
                  data-value={data.phone}
                  aria-label="Copy phone"
                >
                  <CopyIcon size={14} />
                  <span className="copy-label">Copy</span>
                </button>
              </div>
            )}
            {data?.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--c-accent)] hover:underline"
                data-reveal
              >
                <Linkedin size={16} /> LinkedIn
              </a>
            )}
            {socials.length > 0 && (
              <div className="pt-2" data-reveal>
                <h3 className="text-base font-medium text-[var(--c-subtle)]">Social Links</h3>
                <div className="mt-1 grid grid-cols-1 gap-1">
                  {socials.map((s, i) => (
                    <a key={`${s.label}-${i}`} href={s.url!} target="_blank" rel="noopener noreferrer" className="text-[var(--c-accent)] hover:underline">
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {data?.cvFileDataUrl && (
              <a
                href={data.cvFileDataUrl}
                download={data.cvFileName ?? 'cv.pdf'}
                className="mt-3 inline-flex items-center gap-2 text-[var(--c-accent)] hover:underline"
                data-reveal
              >
                <Download size={16} /> Download CV
              </a>
            )}
          </div>
        </Section>
      </main>

      {/* Back to top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-5 right-5 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/5 ring-1 ring-black/10 backdrop-blur hover:bg-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)]"
        aria-label="Back to top"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>

      {/* FOOTER */}
      <footer className="bg-[var(--footer-bg)] py-5 text-center text-[var(--c-subtle)]">
        <p>© {new Date().getFullYear()} {fullName} | Classic Portfolio</p>
      </footer>

      {/* Styles: light-grey palette, professional font, glassy feel. ALWAYS-VISIBLE sections. */}
      <style>{`
        :root {
          --mx: 50vw; --my: 50vh;
          --font-sans: "Plus Jakarta Sans", Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI",
            Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        }
        body { font-family: var(--font-sans); -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }

        /* Light Grey Palette */
        :root[data-classic-theme='classic'] {
          --c-accent:#F2994A; --c-accent-soft:#FAD6B8;
          --c-text:#2B2F33; --c-subtle:#4B5563; --c-muted:#6B7280CC;
          --bg1:#F7F8FA; --bg2:#F2F4F7; --bg3:#ECEFF3;

          --chip-bg: rgba(242,153,74,0.10);
          --chip-ring: rgba(242,153,74,0.30);

          --card-bg: rgba(255,255,255,0.70);
          --card-ring: rgba(17,24,39,0.10);

          --badge-bg: rgba(242,153,74,0.12);
          --badge-ring: rgba(242,153,74,0.30);

          --footer-bg:#E9ECEF;
        }
        :root[data-classic-theme='noir'] {
          --c-accent:#F2994A; --c-accent-soft:#F7D3B0;
          --c-text:#1F2937; --c-subtle:#374151; --c-muted:#6B7280CC;
          --bg1:#F8FAFC; --bg2:#F3F4F6; --bg3:#EDEFF3;

          --chip-bg: rgba(31,41,55,0.06);
          --chip-ring: rgba(31,41,55,0.12);

          --card-bg: rgba(255,255,255,0.78);
          --card-ring: rgba(17,24,39,0.10);

          --badge-bg: rgba(31,41,55,0.06);
          --badge-ring: rgba(31,41,55,0.12);

          --footer-bg:#EAECEF;
        }

        .classic-surface { background: linear-gradient(120deg, var(--bg1), var(--bg2), var(--bg3)); color: var(--c-text); }

        .classic-aurora {
          background:
            radial-gradient(60% 50% at 50% 0%, rgba(242,153,74,0.12) 0%, transparent 60%),
            radial-gradient(40% 40% at 80% 10%, rgba(31,41,55,0.06) 0%, transparent 70%),
            radial-gradient(40% 40% at 20% 20%, rgba(242,153,74,0.08) 0%, transparent 70%),
            linear-gradient(to bottom, var(--bg1), var(--bg2));
          filter: saturate(110%);
        }
        .classic-aurora.alt {
          background:
            radial-gradient(45% 50% at 20% 10%, rgba(242,153,74,0.08) 0%, transparent 70%),
            radial-gradient(40% 40% at 80% 10%, rgba(31,41,55,0.05) 0%, transparent 70%),
            linear-gradient(to bottom, transparent, var(--bg3));
          mix-blend-mode: screen;
        }
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.025'/%3E%3C/svg%3E");
          background-size: 220px 220px; opacity: .55; mix-blend-mode: multiply;
        }

        .portrait-frame {
          background:
            conic-gradient(from 210deg, rgba(255,255,255,.35), rgba(255,255,255,0) 30% 70%, rgba(255,255,255,.35)),
            linear-gradient(180deg, #FFE7D1, #FAD0AA 35%, #F2994A 70%, #E2812A 100%);
          border-radius: 30px; padding: 2px;
        }
        .portrait-glow { background: radial-gradient(60% 60% at 50% 50%, rgba(242,153,74,0.20) 0%, transparent 60%); }

        /* ALWAYS VISIBLE: no hiding via gating */
        .reveal { opacity: 1; transform: none; }
        .reveal-in { transition: opacity .6s ease, transform .6s ease; }
        .section { position: relative; overflow: clip; }
        .section[data-entrance] { opacity: 1; transform: none; filter: none; }
        .section[data-entrance].in { box-shadow: 0 10px 28px rgba(15,23,42,.10); transition: box-shadow .65s ease; }

        /* Nav underline + shadow state */
        .navlink { position: relative; color: var(--c-muted); }
        .navlink::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: 4px; height: 2px;
          background: linear-gradient(90deg, var(--c-accent), transparent);
          transform: scaleX(0); transform-origin: left;
          transition: transform .35s ease, opacity .35s ease; opacity: .7;
        }
        .navlink:hover { color: var(--c-accent); }
        .navlink:hover::after, .navlink[aria-current="true"]::after { transform: scaleX(1); opacity: 1; }
        #__nav.with-shadow { border-bottom-color: rgba(0,0,0,0.10); box-shadow: 0 8px 30px rgba(0,0,0,0.08); }

        /* Spotlight for light UI */
        #__spotlight { background: radial-gradient(320px 320px at var(--mx) var(--my), rgba(15,23,42,.06), transparent 60%); }

        @media (prefers-reduced-motion: reduce) {
          .reveal, .reveal-in, .section[data-entrance] { opacity: 1 !important; transform: none !important; box-shadow: none !important; }
          .navlink::after { transition: none !important; }
        }

        @media print {
          #__spotlight, aside, .noise, nav { display:none !important; }
          button, a[href^="#"] { display:none !important; }
          body { background:#fff !important; color:#111 !important; }
        }
      `}</style>

      {/* Tiny runtime: theme toggle, scroll progress, spy, drawer, copy, spotlight */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function () {
            var doc = document.documentElement;
            // Theme init (light by default)
            try {
              var t = localStorage.getItem('__classic_theme') || 'classic';
              doc.setAttribute('data-classic-theme', t);
            } catch(_) {}

            var bar = document.getElementById('__progress');
            var nav = document.getElementById('__nav');
            var themeBtn = document.getElementById('__theme');
            var hamburger = document.getElementById('__hamburger');
            var drawer = document.getElementById('__drawer');

            // Theme toggle
            if (themeBtn) {
              var setLabel = function(name){
                try { themeBtn.querySelector('span').textContent = name[0].toUpperCase()+name.slice(1); } catch(_){}
              };
              setLabel(doc.getAttribute('data-classic-theme') || 'classic');
              themeBtn.addEventListener('click', function(){
                var order = ['classic','noir'];
                var cur = doc.getAttribute('data-classic-theme') || 'classic';
                var next = order[(order.indexOf(cur)+1)%order.length];
                doc.setAttribute('data-classic-theme', next);
                try { localStorage.setItem('__classic_theme', next); } catch(_){}
                setLabel(next);
              });
            }

            // Scroll progress + nav shadow + spotlight cursor
            function onScroll() {
              var h = doc.scrollHeight - doc.clientHeight;
              var pct = h > 0 ? (doc.scrollTop / h) * 100 : 0;
              if (bar) bar.style.width = pct + '%';
              if (nav) nav.classList.toggle('with-shadow', window.scrollY > 8);
            }
            onScroll();
            window.addEventListener('scroll', onScroll, { passive: true });
            window.addEventListener('mousemove', function(e){
              doc.style.setProperty('--mx', e.clientX + 'px');
              doc.style.setProperty('--my', e.clientY + 'px');
            }, { passive: true });

            // Mobile drawer
            if (hamburger && drawer) {
              var open = false;
              var MENU = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
              var X = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
              var btn = document.getElementById('__hamburger');
              function toggle(){ open = !open; drawer.classList.toggle('hidden', !open); if (btn) btn.innerHTML = open ? X : MENU; }
              hamburger.addEventListener('click', toggle);
              drawer.querySelectorAll('a[href^="#"]').forEach(function(a){ a.addEventListener('click', function(){ if(open){ toggle(); } });});
            }

            // Section spy (ALL SECTIONS VISIBLE regardless)
            if ('IntersectionObserver' in window) {
              var spy = new IntersectionObserver(function(entries){
                var visible = entries.filter(function(e){return e.isIntersecting;})
                  .sort(function(a,b){return b.intersectionRatio - a.intersectionRatio;})[0];
                if (!visible) return;
                var id = visible.target.id;
                // dots
                document.querySelectorAll('[data-dot]').forEach(function(d){
                  var on = d.getAttribute('data-dot') === id;
                  d.classList.toggle('bg-[var(--c-accent)]', on);
                  d.classList.toggle('text-black', on);
                  d.classList.toggle('bg-black/5', !on);
                });
                // navlinks
                document.querySelectorAll('.navlink').forEach(function(l){
                  var href = (l.getAttribute('href')||'').replace('#','');
                  l.setAttribute('aria-current', href === id ? 'true' : 'false');
                });
              }, { rootMargin: '-40% 0px -50% 0px', threshold: [0, .2, .5, .8, 1] });

              ${SECTION_IDS.map((id) => `var el_${id} = document.getElementById('${id}'); if (el_${id}) spy.observe(el_${id});`).join('\n')}
            }

            // Copy buttons
            document.querySelectorAll('.copy-btn').forEach(function(btn){
              btn.addEventListener('click', function(){
                var val = btn.getAttribute('data-value') || '';
                if (!val) return;
                try {
                  navigator.clipboard.writeText(val).then(function(){
                    var label = btn.querySelector('.copy-label');
                    if (label) {
                      var old = label.textContent;
                      label.textContent = 'Copied';
                      setTimeout(function(){ label.textContent = old || 'Copy'; }, 1200);
                    }
                  });
                } catch(_){}
              });
            });
          })();
        `,
        }}
      />
    </div>
  );
}

function NavLink({ id, label, mobile }: { id: string; label: string; mobile?: boolean }) {
  return (
    <a
      href={`#${id}`}
      className="navlink px-3 py-2 text-sm font-medium transition"
      onClick={(e) => {
        e.preventDefault();
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }}
      aria-current="false"
    >
      {label}
    </a>
  );
}

function Section({
  id,
  title,
  icon,
  children,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="section rounded-xl border border-black/10 bg-[var(--card-bg)] backdrop-blur p-6 shadow-sm hover:shadow-md transition" data-entrance>
      <header className="mb-4 flex items-center gap-3" data-reveal>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--badge-bg)] ring-1 ring-[var(--badge-ring)]">
          {icon}
        </span>
        <h2 className="text-2xl font-semibold text-[var(--c-text)]">{title}</h2>
      </header>
      {children}
    </section>
  );
}
