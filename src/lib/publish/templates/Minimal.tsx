// publish
import * as React from 'react';
import {
  BookOpen,
  Link as LinkIcon,
  Mail,
  Phone,
  Lightbulb,
  Database,
  PieChart,
  Rocket,
  Laptop,
  Users,
  TrendingUp,
  Briefcase,
  BarChart3,
  Linkedin,
  Download,
  Award,
  Check,
  Image as ImageIcon,
  Copy,
  ChevronUp,
  UserRound,
  Wand2,
  FolderGit2,
  Sparkles,
  SunMedium,
  MoonStar,
  Circle,
  Menu,
  Code,
  X,
} from 'lucide-react';
import type { PortfolioData } from '@/lib/portfolio-types';

const SECTION_IDS = ['profile', 'about', 'skills', 'projects', 'certifications', 'media', 'contact'] as const;

export default function ClassicPublish({ data }: { data: PortfolioData }) {
  // ===== Data guards (server-safe, no hooks) =====
  const fullName = data?.fullName || 'Your Name';
  const role = data?.role || 'Classic Professional';
  const tagline = data?.tagline || 'Classic Tagline goes here — concise and confident.';
  const location = data?.location || 'City, Country';
  const photo = data?.photoDataUrl || '';

  const rawSkills = Array.isArray(data?.skills) ? data!.skills.filter(Boolean) : [];
  const skills = rawSkills.length ? rawSkills : (['Add your core skills, tools, and stacks'] as (string | number)[]);

  const rawProjects = Array.isArray(data?.projects)
    ? data!.projects.filter((p) => p && ((p.name && p.name.trim()) || (p.description && p.description.trim())))
    : [];
  const projects =
    rawProjects.length > 0
      ? rawProjects
      : [{ name: 'Your Project', description: 'Problem → approach → impact.', link: '' }];

  const rawCerts = Array.isArray(data?.certifications) ? data!.certifications.filter(Boolean) : [];
  const certifications = rawCerts.length ? rawCerts : (['Add a certification or recognition'] as (string | number)[]);

  const rawMedia = Array.isArray(data?.media)
    ? data!.media.filter((m) => m && ((m.title && m.title.trim()) || (m.link && m.link.trim())))
    : [];
  const media = rawMedia.length ? rawMedia : [{ title: 'Portfolio Deck', type: 'Slides', link: '' }];

  const socials = Array.isArray(data?.socials) ? data!.socials.filter((s) => s && s.label && s.url) : [];

  // Helper for media type label
  const nice = (s: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : 'Media');

  // Simple badge inference for project link
  const inferBadge = (link: string): string | null => {
    if (!link) return null;
    try {
      const u = new URL(link);
      const host = u.hostname.replace('www.', '');
      const ext = (u.pathname.split('.').pop() || '').toLowerCase();
      if (host.includes('github.com')) return 'GitHub';
      if (host.includes('gitlab.com')) return 'GitLab';
      if (host.includes('bitbucket.org')) return 'Bitbucket';
      if (host.includes('notion.so') || host.includes('notion.site')) return 'Notion';
      if (host.includes('figma.com')) return 'Figma';
      if (ext === 'pdf') return 'PDF';
      if (['xlsx', 'xls', 'csv'].includes(ext)) return 'Excel';
      if (['pptx', 'ppt'].includes(ext)) return 'Slides';
      const core = host.split('.').slice(-2, -1)[0];
      return core ? core.toUpperCase() : null;
    } catch {
      return null;
    }
  };

  return (
    <div className="surface text-[var(--c-text)] min-h-screen antialiased">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] rounded-md bg-black/5 px-3 py-2 ring-1 ring-black/10 backdrop-blur"
      >
        Skip to content
      </a>

      {/* Spotlight + progress */}
      <div aria-hidden className="fixed inset-0 pointer-events-none z-[1]" id="__spotlight" />
      <div aria-hidden id="__progress" className="fixed inset-x-0 top-0 z-[60] h-1 bg-gradient-to-r from-[var(--c-accent)] via-[var(--c-accent-soft)] to-[var(--c-accent)] w-0 transition-[width]" />

      {/* NAVBAR (glassy light) */}
      <nav id="__nav" className="sticky top-0 z-50 backdrop-blur bg-[var(--glass-soft)] border-b border-transparent">
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
              <span className="text-lg font-semibold tracking-wide">{fullName}</span>
              <span className="hidden md:inline text-xs text-[var(--c-muted)]">{role}</span>
            </a>

            {/* Desktop links (always render all sections) */}
            <div className="hidden md:flex items-center gap-1">
              {SECTION_IDS.map((id) => (
                <NavLink key={id} id={id} label={id.charAt(0).toUpperCase() + id.slice(1)} />
              ))}
              {data?.cvFileDataUrl && (
                <a
                  data-magnet
                  href={data.cvFileDataUrl}
                  download={data.cvFileName ?? 'cv.pdf'}
                  className="ml-2 inline-flex items-center gap-2 rounded-full bg-[var(--c-accent)] px-4 py-1.5 text-white font-semibold shadow-sm hover:brightness-110"
                >
                  <Download className="h-4 w-4" /> CV
                </a>
              )}
            </div>

            {/* Theme & Mobile toggle */}
            <div className="flex items-center gap-2">
              <button id="__theme" className="hidden md:inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1.5 text-xs ring-1 ring-black/10 hover:bg-black/[.07] backdrop-blur">
                <Sparkles size={14} /><span>Theme</span>
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
          <div id="__drawer" className="hidden md:hidden border-t border-black/10 py-2 bg-[var(--glass)] backdrop-blur">
            <div className="flex flex-col">
              {SECTION_IDS.map((id) => (
                <NavLink key={id} id={id} label={id.charAt(0).toUpperCase() + id.slice(1)} mobile />
              ))}
              {data?.cvFileDataUrl && (
                <a
                  href={data.cvFileDataUrl}
                  download={data.cvFileName ?? 'cv.pdf'}
                  className="mt-1 inline-flex items-center gap-2 rounded-full bg-[var(--c-accent)] px-4 py-2 text-white font-semibold shadow-sm"
                >
                  <Download className="h-4 w-4" /> CV
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO (text-only) */}
      <header className="relative overflow-hidden py-14 text-center z-10">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight reveal" data-reveal>{fullName}</h1>
          <p className="text-xl md:text-2xl mt-2 text-[var(--c-subtle)] reveal" data-reveal>{role}</p>
          <p className="mt-3 text-sm md:text-base text-[var(--c-muted)] text-justify max-w-2xl mx-auto reveal" data-reveal>{tagline}</p>
          <p className="text-sm md:text-base text-[var(--c-muted)] mt-1 reveal" data-reveal>{location}</p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 reveal" data-reveal>
            {data?.cvFileDataUrl && (
              <a
                data-magnet
                href={data.cvFileDataUrl}
                download={data.cvFileName ?? 'cv.pdf'}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--c-accent)] px-5 py-2 font-semibold text-white shadow-sm transition will-change-transform"
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
                className="inline-flex items-center gap-2 rounded-full border border-[var(--c-accent)] px-5 py-2 font-semibold text-[var(--c-accent)] shadow-sm transition will-change-transform hover:bg-[var(--c-accent)] hover:text-white"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Dot nav (right) */}
      <aside aria-label="Sections" className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
        {SECTION_IDS.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className="grid place-items-center h-6 w-6 rounded-full ring-1 ring-black/10 transition hover:ring-[var(--c-accent)] bg-[var(--glass-soft)]"
            data-dot={id}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            <Circle className="h-3 w-3" />
          </a>
        ))}
      </aside>

      {/* MAIN */}
      <main id="main" className="relative z-10 max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* PROFILE (image in a proper section bar; shows placeholder card if no photo) */}
        <Section id="profile" icon={<ImageIcon size={20} />} title="Profile">
          <figure className="group mx-auto w-fit [transform-style:preserve-3d] reveal" data-reveal>
            <span aria-hidden className="portrait-glow absolute -inset-10 -z-10 blur-3xl opacity-45" />
            <div className="portrait-frame relative h-56 w-56 md:h-64 md:w-64 rounded-[28px] p-[1.5px] shadow-[0_18px_55px_rgba(0,0,0,.08)] mx-auto">
              <div className="relative h-full w-full overflow-hidden rounded-[26px] bg-white/85 backdrop-blur-xl ring-1 ring-black/10">
                {/* subtle gridlines */}
                <span
                  aria-hidden
                  className="absolute inset-0 opacity-[0.06] pointer-events-none"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgba(0,0,0,.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,.05) 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                  }}
                />
                {photo ? (
                  <img src={photo} alt={fullName} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 grid place-items-center text-[var(--c-muted)] text-sm">Add a profile photo</div>
                )}
                {/* gentle sheen */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.35),transparent)] transition-transform duration-[1200ms] ease-out"
                />
              </div>
            </div>
          </figure>
        </Section>

        {/* ABOUT (always visible; placeholder if empty) */}
        <Section id="about" icon={<UserRound size={20} />} title="About Me">
          <div data-seq-item>
            <p className="leading-relaxed text-justify">
              {data?.about?.trim() || 'Tell your story here — background, passions, and what you’re excited to build next.'}
            </p>
          </div>
        </Section>

        {/* SKILLS */}
        <Section id="skills" icon={<Wand2 size={20} />} title="Skills">
          <div className="mx-auto max-w-3xl flex flex-col gap-3">
            {skills.map((s, i) => (
              <div
                key={i}
                data-seq-item
                className="flex items-center justify-between rounded-lg bg-[var(--chip-bg)] p-3 ring-1 ring-black/10 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[var(--chip-ring)]"
              >
                <span className="text-sm text-justify">{String(s)}</span>
                <span className="h-2 w-2 rounded-full bg-[var(--c-accent)]/90" />
              </div>
            ))}
          </div>
        </Section>

        {/* PROJECTS */}
        <Section id="projects" icon={<FolderGit2 size={20} />} title="Projects">
          <div className="mx-auto max-w-3xl flex flex-col gap-4">
            {projects.map((p: any, i: number) => {
              const label = p.link ? inferBadge(p.link) : null;
              return (
                <article
                  key={i}
                  data-seq-item
                  className="rounded-2xl border border-black/10 bg-[var(--glass-card)] backdrop-blur-xl p-4 shadow-[0_10px_40px_rgba(0,0,0,.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_50px_rgba(0,0,0,.08)]"
                >
                  <header className="flex items-center gap-2">
                    <h3 className="text-xl font-medium">{p.name?.trim() || `Project ${i + 1}`}</h3>
                    {label && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-[var(--badge-bg)] px-2 py-0.5 text-xs ring-1 ring-[var(--badge-ring)]">
                        {label}
                      </span>
                    )}
                  </header>
                  {p.description?.trim() && <p className="text-[var(--c-muted)] mt-2 text-justify leading-relaxed">{p.description}</p>}
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[var(--c-accent)] hover:underline mt-3">
                      <LinkIcon size={16} /> View
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        </Section>

        {/* CERTIFICATIONS */}
        <Section id="certifications" icon={<BookOpen size={20} />} title="Certifications">
          <div className="mx-auto max-w-3xl flex flex-col gap-3">
            {certifications.map((cert: any, index: number) => (
              <div
                key={index}
                data-seq-item
                className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[var(--glass-card)] backdrop-blur-xl p-3 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--badge-bg)] ring-1 ring-[var(--badge-ring)]">
                  <Award className="h-6 w-6 text-[var(--c-accent)]" />
                </span>
                <p className="text-justify">{String(cert)}</p>
              </div>
            ))}
          </div>
        </Section>

        {/* MEDIA */}
        <Section id="media" icon={<ImageIcon size={20} />} title="Media">
          <div className="mx-auto max-w-3xl flex flex-col gap-4">
            {media.map((m: any, i: number) => {
              const label = nice(m.type || 'Media');
              return (
                <div
                  key={i}
                  data-seq-item
                  className="rounded-2xl border border-black/10 bg-[var(--glass-card)] backdrop-blur-xl p-4 transition hover:shadow-[0_16px_50px_rgba(0,0,0,.08)]"
                >
                  <h3 className="text-xl font-medium">{m.title?.trim() || `Media ${i + 1}`}</h3>
                  <p className="text-[var(--c-muted)] mt-1 text-justify">{label}</p>
                  {m.link && (
                    <a href={m.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[var(--c-accent)] hover:underline mt-2">
                      <LinkIcon size={16} /> View
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        </Section>

        {/* CONTACT (always visible) */}
        <Section id="contact" icon={<Mail size={20} />} title="Contact">
          <div className="text-[var(--c-text)] space-y-2">
            {data?.email ? (
              <div className="flex items-center gap-2" data-seq-item>
                <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:text-[var(--c-accent)]">
                  <Mail size={16} /> {data.email}
                </a>
              </div>
            ) : (
              <p className="text-[var(--c-muted)]" data-seq-item>Add your email address.</p>
            )}
            {data?.phone ? (
              <div className="flex items-center gap-2" data-seq-item>
                <a href={`tel:${data.phone}`} className="flex items-center gap-2 hover:text-[var(--c-accent)]">
                  <Phone size={16} /> {data.phone}
                </a>
              </div>
            ) : (
              <p className="text-[var(--c-muted)]" data-seq-item>Add your phone number.</p>
            )}
            {data?.linkedin ? (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--c-accent)] hover:underline"
                data-seq-item
              >
                <Linkedin size={16} /> LinkedIn
              </a>
            ) : (
              <p className="text-[var(--c-muted)]" data-seq-item>Add your LinkedIn URL.</p>
            )}

            {socials.length > 0 && (
              <div className="pt-2" data-seq-item>
                <h3 className="text-base font-medium text-[var(--c-subtle)]">Social Links</h3>
                <div className="mt-1 grid grid-cols-1 gap-1">
                  {socials.map((s, i) => (
                    <a key={i} href={s.url!} target="_blank" rel="noopener noreferrer" className="text-[var(--c-accent)] hover:underline">
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
                data-seq-item
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
        className="fixed bottom-5 right-5 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--glass)] ring-1 ring-black/10 backdrop-blur hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)]"
        aria-label="Back to top"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
      </button>

      <footer className="bg-[var(--glass)] backdrop-blur py-5 text-center text-[var(--c-muted)] ring-1 ring-black/5">
        <p>© {new Date().getFullYear()} {fullName} | Classic Portfolio</p>
      </footer>

      {/* Styles + tokens + soft reveals */}
      <style>{`
        :root {
          --mx: 50vw;
          --my: 50vh;
          --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          --glass: rgba(255, 255, 255, 0.78);
          --glass-soft: rgba(255, 255, 255, 0.60);
          --glass-card: rgba(255, 255, 255, 0.82);
        }
        body { font-family: var(--font-sans); }

        /* Light (calm white + pro orange) */
        :root[data-classic-theme='classic'] {
          --c-accent:#DF6A1C;
          --c-accent-soft:#FFD8B0;
          --c-text:#1f2937;
          --c-subtle:#374151;
          --c-muted:#6b7280;
          --bg1:#f7f7f5; --bg2:#fbfaf8; --bg3:#ffffff;
          --chip-bg: rgba(223,106,28,0.10);
          --chip-ring: rgba(223,106,28,0.24);
          --badge-bg: rgba(223,106,28,0.12);
          --badge-ring: rgba(223,106,28,0.24);
        }
        /* Noir (muted warm slate) */
        :root[data-classic-theme='noir'] {
          --c-accent:#F29B38; --c-accent-soft:#FFD7A6;
          --c-text:#0f172a;
          --c-subtle:#1f2937;
          --c-muted:#475569;
          --bg1:#f5f7fb; --bg2:#ffffff; --bg3:#ffffff;
          --chip-bg: rgba(242,155,56,0.10);
          --chip-ring: rgba(242,155,56,0.22);
          --badge-bg: rgba(242,155,56,0.12);
          --badge-ring: rgba(242,155,56,0.22);
        }

        .surface { background: linear-gradient(140deg, var(--bg1), var(--bg2) 40%, var(--bg3)); }
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.03'/%3E%3C/svg%3E");
          background-size: 220px 220px; opacity: .7; mix-blend-mode: overlay;
        }

        /* Portrait frame (static, glassy) */
        .portrait-frame {
          background:
            conic-gradient(from 200deg, rgba(255,255,255,.55), rgba(255,255,255,0) 28% 72%, rgba(255,255,255,.55)),
            linear-gradient(180deg, #ffe7d1, #ffc792 35%, #ffb271 68%, #ff9a4c 100%);
          border-radius: 28px;
          padding: 1.5px;
        }
        .portrait-glow {
          background: radial-gradient(60% 60% at 50% 50%, rgba(223,106,28,0.22) 0%, transparent 60%);
        }

        /* Nav underline + active shadow */
        .navlink { position: relative; }
        .navlink::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: 4px; height: 2px;
          background: linear-gradient(90deg, var(--c-accent), transparent);
          transform: scaleX(0); transform-origin: left;
          transition: transform .35s ease, opacity .35s ease; opacity: .6;
        }
        .navlink:hover::after, .navlink[aria-current="true"]::after { transform: scaleX(1); opacity: 1; }
        #__nav.with-shadow { border-bottom-color: rgba(0,0,0,0.08); box-shadow: 0 10px 35px rgba(0,0,0,0.06); }

        /* Soft reveal (never hides content) */
        .reveal { transform: translateY(8px) scale(.995); filter: saturate(.98); }
        .reveal-in { transform: none; filter: none; transition: transform .55s cubic-bezier(.22,.75,.2,1), filter .45s ease; }
        [data-reveal] { animation-delay: calc(var(--stagger) * 18ms); }

        /* Section box reveal (visible by default) */
        .section { position: relative; overflow: clip; transform: translateY(6px) scale(.992); box-shadow: 0 10px 32px rgba(0,0,0,.04); }
        .section.in { transform: none; box-shadow: 0 18px 55px rgba(0,0,0,.08); transition: transform .6s cubic-bezier(.22,.75,.2,1), box-shadow .6s ease; }

        /* Spotlight cursor (light) */
        #__spotlight { background: radial-gradient(360px 360px at var(--mx) var(--my), rgba(223,106,28,.08), transparent 60%); }

        /* Print-friendly */
        @media print {
          #__spotlight, aside, .noise, nav { display:none !important; }
          button, a[href^="#"] { display:none !important; }
          body { background:#fff !important; color:#111 !important; }
        }
      `}</style>

      {/* Tiny runtime (progress, theme, drawer, reveals, spy) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function () {
            var doc = document.documentElement;
            var bar = document.getElementById('__progress');
            var nav = document.getElementById('__nav');
            var themeBtn = document.getElementById('__theme');
            var hamburger = document.getElementById('__hamburger');
            var drawer = document.getElementById('__drawer');

            // Theme init & toggle
            try {
              var t = localStorage.getItem('__classic_theme') || 'classic';
              doc.setAttribute('data-classic-theme', t);
              if (themeBtn) {
                var setLabel = function(name){
                  try { themeBtn.querySelector('span').textContent = name[0].toUpperCase()+name.slice(1); } catch(_){}
                };
                setLabel(t);
                themeBtn.addEventListener('click', function () {
                  var order = ['classic','noir'];
                  var cur = doc.getAttribute('data-classic-theme') || 'classic';
                  var next = order[(order.indexOf(cur) + 1) % order.length];
                  doc.setAttribute('data-classic-theme', next);
                  localStorage.setItem('__classic_theme', next);
                  setLabel(next);
                });
              }
            } catch (_){}

            // Scroll progress + nav shadow
            function onScroll() {
              var h = doc.scrollHeight - doc.clientHeight;
              var pct = h > 0 ? (doc.scrollTop / h) * 100 : 0;
              if (bar) bar.style.width = pct + '%';
              if (nav) {
                if (window.scrollY > 8) nav.classList.add('with-shadow');
                else nav.classList.remove('with-shadow');
              }
            }
            onScroll();
            window.addEventListener('scroll', onScroll, { passive: true });

            // Mobile drawer toggle
            if (hamburger && drawer) {
              var isOpen = false;
              var MENU_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
              var X_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
              hamburger.addEventListener('click', function(){
                isOpen = !isOpen;
                drawer.classList.toggle('hidden', !isOpen);
                hamburger.innerHTML = isOpen ? X_SVG : MENU_SVG;
              });
              drawer.querySelectorAll('a[href^="#"]').forEach(function(a){
                a.addEventListener('click', function(){
                  isOpen = false;
                  drawer.classList.add('hidden');
                  hamburger.innerHTML = MENU_SVG;
                });
              });
            }

            // Spotlight + magnets
            var prefersReduced = false;
            try { prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(_){}
            window.addEventListener('mousemove', function (e) {
              var x = e.clientX, y = e.clientY;
              doc.style.setProperty('--mx', x + 'px');
              doc.style.setProperty('--my', y + 'px');

              if (prefersReduced) return;
              document.querySelectorAll('[data-magnet]').forEach(function (m) {
                var r = m.getBoundingClientRect();
                var cx = r.left + r.width / 2;
                var cy = r.top + r.height / 2;
                var dist = Math.hypot(x - cx, y - cy);
                var pull = Math.max(0, 1 - dist / 260);
                var tx = (x - cx) * 0.08 * pull;
                var ty = (y - cy) * 0.08 * pull;
                m.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
              });
            }, { passive: true });

            // Soft reveal (progressive, never hides content)
            try {
              if ('IntersectionObserver' in window) {
                var obs = new IntersectionObserver(function (entries) {
                  entries.forEach(function (e, idx) {
                    if (e.isIntersecting) {
                      e.target.classList.add('reveal-in');
                      e.target.style.setProperty('--stagger', String(idx % 8));
                      obs.unobserve(e.target);
                    }
                  });
                }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
                document.querySelectorAll('[data-reveal]').forEach(function (n) { obs.observe(n); });

                var sec = new IntersectionObserver(function(entries){
                  entries.forEach(function (e) {
                    if (e.isIntersecting) {
                      e.target.classList.add('in');
                      sec.unobserve(e.target);
                    }
                  });
                }, { rootMargin: '0px 0px -12% 0px', threshold: 0.12 });
                document.querySelectorAll('.section').forEach(function (n) { sec.observe(n); });
              }
            } catch(_){}

            // Active dot + navbar underline sync
            try {
              var spy = new IntersectionObserver(function (entries) {
                var visible = entries.filter(function(e){return e.isIntersecting;}).sort(function(a,b){return b.intersectionRatio - a.intersectionRatio;})[0];
                if (visible && visible.target && visible.target.id) {
                  var id = visible.target.id;
                  document.querySelectorAll('[data-dot]').forEach(function(d){
                    var on = d.getAttribute('data-dot') === id;
                    d.classList.toggle('bg-[var(--c-accent)]', on);
                    d.classList.toggle('text-white', on);
                  });
                  document.querySelectorAll('.navlink').forEach(function(l){
                    var href = l.getAttribute('href') || '';
                    var match = href.replace('#','') === id;
                    l.setAttribute('aria-current', match ? 'true' : 'false');
                  });
                }
              }, { rootMargin: '-40% 0px -50% 0px', threshold: [0, .2, .5, .8, 1] });
              ${SECTION_IDS.map((id) => `var el_${id} = document.getElementById('${id}'); if (el_${id}) spy.observe(el_${id});`).join('\n')}
            } catch(_){}
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
      className="navlink px-3 py-2 text-sm font-medium transition text-[var(--c-muted)] hover:text-[var(--c-accent)]"
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
    <section id={id} className="section rounded-2xl border border-black/10 bg-[var(--glass-card)] backdrop-blur-xl p-6 transition">
      <header className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--badge-bg)] ring-1 ring-[var(--badge-ring)]">
          {icon}
        </span>
        <h2 className="text-2xl font-semibold">{title}</h2>
      </header>
      <div className="section-body">{children}</div>
    </section>
  );
}
