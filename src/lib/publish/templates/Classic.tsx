// publish;
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
} from 'lucide-react';
import type { PortfolioData } from '@/lib/portfolio-types';

const SECTION_IDS = ['about', 'skills', 'projects', 'certifications', 'media', 'contact'] as const;

export default function Classic({ data }: { data: PortfolioData }) {
  const fullName = data?.fullName || 'Your Name';
  const role = data?.role || 'Classic Professional';
  const tagline = data?.tagline || 'Classic Tagline';
  const location = data?.location || 'Location';
  const photo = data?.photoDataUrl;

  const skills = Array.isArray(data?.skills) ? data!.skills.filter(Boolean) : [];
  const projects = Array.isArray(data?.projects)
    ? data!.projects.filter((p) => p && ((p.name && p.name.trim()) || (p.description && p.description.trim())))
    : [];
  const certifications = Array.isArray(data?.certifications) ? data!.certifications.filter(Boolean) : [];
  const media = Array.isArray(data?.media)
    ? data!.media.filter((m) => m && ((m.title && m.title.trim()) || (m.link && m.link.trim())))
    : [];
  const socials = Array.isArray(data?.socials)
    ? data!.socials.filter((s) => s && s.label && s.url)
    : [];

  // Smart badge inference for project links (domain / extension)
  const inferBadge = (link: string): string | null => {
    if (!link) return null;
    try {
      const u = new URL(link);
      const host = u.hostname.replace('www.', '');
      const ext = (u.pathname.split('.').pop() || '').toLowerCase();

      if (host.includes('github.com')) return 'GitHub';
      if (host.includes('gitlab.com')) return 'GitLab';
      if (host.includes('bitbucket.org')) return 'Bitbucket';
      if (host.includes('notion.site') || host.includes('notion.so')) return 'Notion';
      if (host.includes('figma.com')) return 'Figma';
      if (host.includes('vercel.app')) return 'Vercel';
      if (host.includes('powerbi.com') || ext === 'pbix') return 'Power BI';
      if (ext === 'pdf') return 'PDF';
      if (['xlsx', 'xls', 'csv'].includes(ext)) return 'Excel';
      if (['pptx', 'ppt'].includes(ext)) return 'Slides';
      if (['ipynb', 'py'].includes(ext)) return 'Python';
      if (['html', 'htm'].includes(ext)) return 'Web';
      const core = host.split('.').slice(-2, -1)[0];
      return core ? core.toUpperCase() : null;
    } catch {
      const ext = (link.split('.').pop() || '').toLowerCase();
      if (ext === 'pdf') return 'PDF';
      if (['xlsx', 'xls', 'csv'].includes(ext)) return 'Excel';
      if (['pbix'].includes(ext)) return 'Power BI';
      return null;
    }
  };

  return (
    <div className="classic-surface text-white min-h-screen antialiased">
      {/* Skip link */}
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] rounded-md bg-white/10 px-3 py-2 ring-1 ring-white/20 backdrop-blur">
        Skip to content
      </a>

      {/* Spotlight + progress */}
      <div aria-hidden className="fixed inset-0 pointer-events-none z-[1]" id="__spotlight" />
      <div aria-hidden id="__progress" className="fixed inset-x-0 top-0 z-[60] h-1 bg-gradient-to-r from-[var(--c-accent)] via-fuchsia-400 to-violet-400 w-0 transition-[width]" />

      {/* NAVBAR */}
      <nav id="__nav" className="sticky top-0 z-50 backdrop-blur bg-black/20 border-b border-transparent">
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
              <button id="__theme" className="hidden md:inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs ring-1 ring-white/20 hover:bg-white/15 backdrop-blur">
                <Sparkles size={14} /><span>Theme</span>
              </button>
              <button
                id="__hamburger"
                className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/20"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile drawer */}
          <div id="__drawer" className="hidden md:hidden border-t border-white/10 py-2">
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
          {/* Avatar: show ONLY if photo exists */}
          {photo && (
            <figure
              className="group relative w-fit mx-auto mb-7 [transform-style:preserve-3d] will-change-transform"
              onMouseMove={(e) => {
                const el = e.currentTarget as HTMLElement;
                const r = el.getBoundingClientRect();
                const rx = ((e.clientY - (r.top + r.height / 2)) / r.height) * -8;
                const ry = ((e.clientX - (r.left + r.width / 2)) / r.width) * 8;
                el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
              }}
              data-reveal
            >
              <span aria-hidden className="absolute -inset-8 -z-10 rounded-[36px] blur-3xl opacity-70 classic-glow" />
              <span aria-hidden className="avatar-ring absolute inset-[-12px] rounded-[28px]" />
              <div className="relative h-48 w-48 md:h-56 md:w-56 rounded-[28px] p-[2px] classic-frame shadow-2xl">
                <div className="relative h-full w-full overflow-hidden rounded-[26px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
                  <img src={photo} alt={fullName} className="absolute inset-0 h-full w-full object-cover" />
                  <span aria-hidden className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.16),transparent)] transition-transform duration-[1200ms] ease-out" />
                </div>
              </div>
            </figure>
          )}

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow reveal" data-reveal>{fullName}</h1>
          <p className="text-xl md:text-2xl text-[var(--c-subtle)] mt-2 reveal" data-reveal>{role}</p>
          <p className="mt-3 text-sm md:text-base text-[var(--c-muted)] text-justify max-w-2xl mx-auto reveal" data-reveal>{tagline}</p>
          <p className="text-sm md:text-base text-[var(--c-muted)] mt-1 reveal" data-reveal>{location}</p>

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

      {/* RIGHT DOT NAV */}
      <aside aria-label="Sections" className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
        {SECTION_IDS.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className="grid place-items-center h-6 w-6 rounded-full ring-1 ring-white/30 transition hover:ring-[var(--c-accent)] bg-white/10"
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
        {/* ABOUT */}
        {data?.about && (
          <Section id="about" icon={<UserRound size={20} />} title="About Me">
            <div data-seq-item>
              <p className="text-[var(--c-text)] leading-relaxed text-justify">{data.about}</p>
            </div>
          </Section>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <Section id="skills" icon={<Wand2 size={20} />} title="Skills">
            <div className="mx-auto max-w-3xl flex flex-col gap-3">
              {skills.map((s, i) => (
                <div
                  key={i}
                  data-seq-item
                  style={{ ['--i' as never]: String(i) }}
                  className="flex items-center justify-between rounded-lg bg-[var(--chip-bg)] p-3 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[var(--chip-ring)]"
                >
                  <span className="text-sm text-[var(--c-text)] text-justify">{String(s)}</span>
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
              {projects.map((p, i) => {
                const label = p.link ? inferBadge(p.link) : null;
                return (
                  <article
                    key={i}
                    data-seq-item
                    style={{ ['--i' as never]: String(i) }}
                    className="rounded-lg border border-white/10 bg-[var(--card-bg)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--card-ring)]"
                  >
                    <header className="flex items-center gap-2">
                      <h3 className="text-xl font-medium">{p.name?.trim() || `Project ${i + 1}`}</h3>
                      {label && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-[var(--badge-bg)] px-2 py-0.5 text-xs ring-1 ring-[var(--badge-ring)]">
                          {label}
                        </span>
                      )}
                    </header>
                    {p.description?.trim() && <p className="text-[var(--c-subtle)] mt-2 text-justify leading-relaxed">{p.description}</p>}
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
        )}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <Section id="certifications" icon={<BookOpen size={20} />} title="Certifications">
            <div className="mx-auto max-w-3xl flex flex-col gap-3">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  data-seq-item
                  style={{ ['--i' as never]: String(index) }}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-[var(--card-bg)] p-3 ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[var(--card-ring)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--badge-bg)] ring-1 ring-[var(--badge-ring)]">
                    <Award className="h-6 w-6 text-[var(--c-accent)]" />
                  </span>
                  <p className="text-[var(--c-text)] text-justify">{String(cert)}</p>
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
                const labelRaw = m.type ? String(m.type) : 'Media';
                const label = labelRaw.charAt(0).toUpperCase() + labelRaw.slice(1);
                return (
                  <div
                    key={i}
                    data-seq-item
                    style={{ ['--i' as never]: String(i) }}
                    className="rounded-lg border border-white/10 bg-[var(--card-bg)] p-4 transition hover:border-[var(--card-ring)]"
                  >
                    <h3 className="text-xl font-medium">{m.title?.trim() || `Media ${i + 1}`}</h3>
                    <p className="text-[var(--c-subtle)] mt-1 text-justify">{label}</p>
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
        )}

        {/* CONTACT */}
        <Section id="contact" icon={<Mail size={20} />} title="Contact">
          <div className="text-[var(--c-text)] space-y-2">
            {data?.email && (
              <div className="flex items-center gap-2" data-seq-item>
                <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:text-[var(--c-accent)]">
                  <Mail size={16} /> {data.email}
                </a>
              </div>
            )}
            {data?.phone && (
              <div className="flex items-center gap-2" data-seq-item>
                <a href={`tel:${data.phone}`} className="flex items-center gap-2 hover:text-[var(--c-accent)]">
                  <Phone size={16} /> {data.phone}
                </a>
              </div>
            )}
            {data?.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--c-accent)] hover:underline"
                data-seq-item
              >
                <Linkedin size={16} /> LinkedIn
              </a>
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
        className="fixed bottom-5 right-5 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)]"
        aria-label="Back to top"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 15l-6-6-6 6"/></svg>
      </button>

      <footer className="bg-[var(--footer-bg)] py-5 text-center text-[var(--c-subtle)]">
        <p>© {new Date().getFullYear()} {fullName} | Classic Portfolio</p>
      </footer>

      {/* Styles + tokens + animations */}
      <style>{`
        :root { --mx: 50vw; --my: 50vh; }

        /* Executive palettes */
        :root[data-classic-theme='classic'] {
          --c-accent:#00CFFF; --c-text:#ffeafe; --c-subtle:#ffd7fb; --c-muted:#f4c8f6cc;
          --bg1:#0d0b1e; --bg2:#1a0f2e; --bg3:#250e3a;
          --chip-bg: rgba(236, 72, 153, 0.18); --chip-ring: rgba(0,207,255,0.35);
          --card-bg: rgba(76, 29, 149, 0.28); --card-ring: rgba(0,207,255,0.35);
          --badge-bg: rgba(0,207,255,0.15); --badge-ring: rgba(0,207,255,0.35);
          --footer-bg:#130a22;
        }
        :root[data-classic-theme='noir'] {
          --c-accent:#e3b04b; --c-text:#e9f3f7; --c-subtle:#d7e6ec; --c-muted:#b6c6cf;
          --bg1:#0b1720; --bg2:#0e1e29; --bg3:#102735;
          --chip-bg: rgba(227,176,75,0.10); --chip-ring: rgba(227,176,75,0.35);
          --card-bg: rgba(12,21,31,0.60); --card-ring: rgba(227,176,75,0.35);
          --badge-bg: rgba(227,176,75,0.10); --badge-ring: rgba(227,176,75,0.35);
          --footer-bg:#081018;
        }

        .classic-surface { background: linear-gradient(120deg, var(--bg1), var(--bg2), var(--bg3)); }
        .classic-aurora {
          background: radial-gradient(60% 50% at 50% 0%, rgba(255,0,204,0.18) 0%, transparent 60%),
                      radial-gradient(40% 40% at 80% 10%, rgba(0,207,255,0.22) 0%, transparent 70%),
                      radial-gradient(40% 40% at 20% 20%, rgba(168,85,247,0.22) 0%, transparent 70%),
                      linear-gradient(to bottom, var(--bg1), var(--bg2));
          filter: saturate(120%);
        }
        .classic-aurora.alt {
          background: radial-gradient(45% 50% at 20% 10%, rgba(255,122,245,0.18) 0%, transparent 70%),
                      radial-gradient(40% 40% at 80% 10%, rgba(0,207,255,0.18) 0%, transparent 70%),
                      linear-gradient(to bottom, transparent, var(--bg3));
          mix-blend-mode: screen;
        }
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
          background-size: 220px 220px; opacity: .6; mix-blend-mode: overlay;
        }

        .classic-glow { background: radial-gradient(60% 60% at 50% 50%, rgba(255,0,204,0.28) 0%, transparent 60%); }
        .classic-frame {
          background:
            conic-gradient(from 210deg, rgba(255,255,255,.25), rgba(255,255,255,0) 30% 70%, rgba(255,255,255,.25)),
            linear-gradient(180deg, #f7e9c6, #e3b04b 35%, #c9982f 70%, #b88c14 100%);
          border-radius: 28px; padding: 2px;
        }

        /* Nav underline + shadow state */
        .navlink { position: relative; }
        .navlink::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: 4px; height: 2px;
          background: linear-gradient(90deg, var(--c-accent), transparent);
          transform: scaleX(0); transform-origin: left;
          transition: transform .35s ease, opacity .35s ease;
          opacity: .7;
        }
        .navlink:hover::after, .navlink[aria-current="true"]::after { transform: scaleX(1); opacity: 1; }
        #__nav.with-shadow { border-bottom-color: rgba(255,255,255,0.10); box-shadow: 0 8px 30px rgba(0,0,0,0.20); }

        /* IO-based reveals (kept) */
        .reveal { opacity: 0; transform: translateY(12px); }
        .reveal-in { opacity: 1; transform: translateY(0); transition: opacity .6s ease, transform .6s ease; }
        [data-reveal] { animation-delay: calc(var(--stagger) * 18ms); }

        @keyframes spin360 { to { transform: rotate(360deg); } }
        .avatar-ring::before {
          content: ''; position: absolute; inset: 0; border-radius: inherit;
          background: conic-gradient(from 0deg, rgba(0,207,255,0.00) 0deg, rgba(255,0,204,0.45) 80deg, rgba(0,207,255,0.70) 160deg, rgba(168,85,247,0.55) 240deg, rgba(0,207,255,0.00) 360deg);
          animation: spin360 16s linear infinite; opacity: 0.9;
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0); mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
        }

        /* Spotlight cursor */
        #__spotlight { background: radial-gradient(350px 350px at var(--mx) var(--my), rgba(255,255,255,.08), transparent 60%); }

        /* NEW: Section-level box reveal (entire card) */
        .section[data-entrance] {
          opacity: 0;
          transform: translateY(18px) scale(0.98);
          filter: blur(6px);
          will-change: opacity, transform, filter, box-shadow;
        }
        .section[data-entrance].in {
          opacity: 1;
          transform: none;
          filter: none;
          box-shadow: 0 12px 40px rgba(0,0,0,.22);
          transition:
            opacity .6s ease,
            transform .6s ease,
            filter .6s ease,
            box-shadow .6s ease;
        }

        /* Section entrance orchestration (header first, then children) */
        .section { position: relative; overflow: clip; }
        .section[data-entrance]::before {
          content: ''; position: absolute; inset: 0;
          background:
            radial-gradient(120% 120% at -20% 0%, rgba(255,255,255,.08), transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.02));
          clip-path: inset(0 100% 0 0);
          opacity: .0;
          transition: clip-path .9s cubic-bezier(.22,.75,.2,1), opacity .9s ease;
          pointer-events: none;
        }
        .section[data-entrance].in::before { clip-path: inset(0 0 0 0); opacity: .06; }

        .section-head {
          opacity: 0; transform: translateY(14px) scale(.98); filter: blur(6px);
          transition: opacity .55s ease, transform .55s ease, filter .55s ease;
        }
        [data-entrance].in .section-head { opacity: 1; transform: none; filter: none; }

        .section-body > [data-seq-item] {
          opacity: 0; transform: translateY(16px); filter: blur(4px);
          transition: opacity .55s cubic-bezier(.22,.75,.2,1), transform .55s cubic-bezier(.22,.75,.2,1), filter .55s ease;
          transition-delay: calc(var(--i, 0) * 70ms);
        }
        [data-entrance].in .section-body > [data-seq-item] { opacity: 1; transform: none; filter: none; }

        @media (prefers-reduced-motion: reduce) {
          .avatar-ring::before { animation: none !important; }
          .reveal { opacity: 1 !important; transform: none !important; }
          .section[data-entrance] { opacity: 1 !important; transform: none !important; filter: none !important; box-shadow: none !important; }
          .section[data-entrance]::before { clip-path: none !important; opacity: .02 !important; }
          .section-head, .section-body > [data-seq-item] { opacity: 1 !important; transform: none !important; filter: none !important; transition: none !important; }
          .navlink::after { transition: none !important; }
        }

        /* Print-friendly */
        @media print {
          #__spotlight, aside, .noise, nav { display:none !important; }
          button, a[href^="#"] { display:none !important; }
          body { background:#fff !important; color:#111 !important; }
        }
      `}</style>

      {/* Tiny runtime */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function () {
            var doc = document.documentElement;
            var bar = document.getElementById('__progress');
            var themeBtn = document.getElementById('__theme');
            var nav = document.getElementById('__nav');
            var hamburger = document.getElementById('__hamburger');
            var drawer = document.getElementById('__drawer');
            var isOpen = false;

            // Inline SVGs
            var MENU_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
            var X_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

            // Theme init & toggle
            try {
              var t = localStorage.getItem('__classic_theme') || 'noir';
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

            // Spotlight / parallax / magnetic
            var prefersReduced = false;
            try { prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(_){}
            window.addEventListener('mousemove', function (e) {
              var x = e.clientX, y = e.clientY;
              doc.style.setProperty('--mx', x + 'px');
              doc.style.setProperty('--my', y + 'px');

              if (prefersReduced) return;

              document.querySelectorAll('[data-parallax]').forEach(function (l) {
                var depth = parseFloat(l.getAttribute('data-parallax') || '0');
                var dx = (x / window.innerWidth - 0.5) * depth * 12;
                var dy = (y / window.innerHeight - 0.5) * depth * 12;
                l.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
              });

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

            // Reveal (existing)
            try {
              var reduce = prefersReduced;
              if (!reduce && 'IntersectionObserver' in window) {
                var obs = new IntersectionObserver(function (entries) {
                  entries.forEach(function (e, idx) {
                    if (e.isIntersecting) {
                      e.target.classList.add('reveal-in');
                      e.target.style.setProperty('--stagger', String(idx % 8));
                      obs.unobserve(e.target);
                    }
                  });
                }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
                document.querySelectorAll('[data-reveal]').forEach(function (n) { obs.observe(n); });
              } else {
                document.querySelectorAll('.reveal, [data-reveal]').forEach(function (n) { n.classList.add('reveal-in'); });
              }

              // Active dot + navbar underline sync
              var spy = new IntersectionObserver(function (entries) {
                var visible = entries.filter(function(e){return e.isIntersecting;}).sort(function(a,b){return b.intersectionRatio - a.intersectionRatio;})[0];
                if (visible && visible.target && visible.target.id) {
                  var id = visible.target.id;
                  document.querySelectorAll('[data-dot]').forEach(function(d){
                    var on = d.getAttribute('data-dot') === id;
                    d.classList.toggle('bg-[var(--c-accent)]', on);
                    d.classList.toggle('text-black', on);
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

            // Section entrance orchestrator (header first, then items) + full-card reveal
            (function(){
              if (!('IntersectionObserver' in window)) return;
              var seq = new IntersectionObserver(function(entries){
                entries.forEach(function(e){
                  if (e.isIntersecting) {
                    e.target.classList.add('in');
                    seq.unobserve(e.target);
                  }
                });
              }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

              document.querySelectorAll('[data-entrance]').forEach(function(section){
                var items = section.querySelectorAll('.section-body > [data-seq-item]');
                items.forEach(function(node, idx){
                  if (node && node.style) node.style.setProperty('--i', String(idx));
                });
                seq.observe(section);
              });
            })();

            // Keyboard jumps 1..N
            window.addEventListener('keydown', function(e){
              if (e.ctrlKey || e.metaKey || e.altKey) return;
              var n = Number(e.key) - 1;
              var ids = ${JSON.stringify(SECTION_IDS)};
              if (n >= 0 && n < ids.length) {
                var el = document.getElementById(ids[n]);
                if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
              }
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
      className={`navlink px-3 py-2 text-sm font-medium transition text-[var(--c-muted)] hover:text-[var(--c-accent)]`}
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
    <section id={id} className="section rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm hover:shadow-md transition" data-entrance>
      <header className="section-head mb-4 flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--badge-bg)] ring-1 ring-[var(--badge-ring)]">
          {icon}
        </span>
        <h2 className="text-2xl font-semibold">{title}</h2>
      </header>
      <div className="section-body">{children}</div>
    </section>
  );
}
