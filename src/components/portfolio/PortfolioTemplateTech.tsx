'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Code,
  BookOpen,
  Link as LinkIcon,
  Mail,
  Phone,
  Linkedin,
  Download,
  Award,
  Menu,
  X,
} from 'lucide-react';
import type { PortfolioData } from '@/lib/portfolio-types';

const SECTION_IDS = ['about', 'skills', 'projects', 'certifications', 'media', 'contact'] as const;
type SectionId = (typeof SECTION_IDS)[number];

export default function PortfolioTemplateTech({ data }: { data: PortfolioData }) {
  // Safe guards for optional arrays/strings
  const fullName = data?.fullName || 'Your Name';
  const role = data?.role || 'Tech Professional';
  const tagline = data?.tagline || 'Tech Tagline';
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

  // ===== Navbar / spy =====
  const [active, setActive] = useState<SectionId>('about');
  const [menuOpen, setMenuOpen] = useState(false);
  const [navShadow, setNavShadow] = useState(false);

  const navItems: { id: SectionId; label: string; show: boolean }[] = [
    { id: 'about', label: 'About', show: !!data?.about },
    { id: 'skills', label: 'Skills', show: skills.length > 0 },
    { id: 'projects', label: 'Projects', show: projects.length > 0 },
    { id: 'certifications', label: 'Certifications', show: certifications.length > 0 },
    { id: 'media', label: 'Media', show: media.length > 0 },
    { id: 'contact', label: 'Contact', show: true },
  ];

  useEffect(() => {
    const onScroll = () => setNavShadow(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const spy = new IntersectionObserver(
      (entries) => {
        const vis = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = (vis?.target?.id || '') as SectionId;
        if (id && SECTION_IDS.includes(id)) setActive(id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.2, 0.5, 0.8, 1] }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) spy.observe(el);
    });
    return () => spy.disconnect();
  }, []);

  // ===== Reveal orchestration (section box + inner items) =====
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    const sections = Array.from(root.querySelectorAll<HTMLElement>('section[data-entrance]'));

    // Fallbacks so nothing stays invisible
    if (prefersReduced || !('IntersectionObserver' in window)) {
      nodes.forEach((n) => n.classList.add('reveal-in'));
      sections.forEach((s) => s.classList.add('in'));
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, idx) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add('reveal-in');
            el.style.setProperty('--stagger', String(idx % 8));
            obs.unobserve(el);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    );
    nodes.forEach((n) => obs.observe(n));

    const secObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.classList.add('in');
            secObs.unobserve(el);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    );
    sections.forEach((s) => secObs.observe(s));

    // Safety: if for some reason nothing fires above the fold, unlock after a tick
    const safety = window.setTimeout(() => {
      sections.slice(0, 2).forEach((s) => s.classList.add('in'));
      nodes.slice(0, 6).forEach((n) => n.classList.add('reveal-in'));
    }, 600);

    return () => {
      window.clearTimeout(safety);
      obs.disconnect();
      secObs.disconnect();
    };
  }, []);

  // ===== Keyboard jumps (1..N) =====
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const idx = Number(e.key) - 1;
      if (idx >= 0 && idx < SECTION_IDS.length) {
        const id = SECTION_IDS[idx];
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const NavLink = ({ id, label }: { id: SectionId; label: string }) => {
    const isActive = active === id;
    return (
      <a
        href={`#${id}`}
        onClick={(e) => {
          e.preventDefault();
          setMenuOpen(false);
          document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        className={`navlink px-3 py-2 text-sm font-medium transition ${
          isActive ? 'text-[color:var(--neon)]' : 'text-gray-400 hover:text-[color:var(--neon)]'
        }`}
        aria-current={isActive ? 'true' : undefined}
      >
        {label}
      </a>
    );
  };

  return (
    <div ref={containerRef} className="font-mono bg-gray-950 text-gray-100 min-h-screen antialiased">
      {/* ===== NAVBAR ===== */}
      <nav
        className={`sticky top-0 z-50 bg-gray-950/60 backdrop-blur border-b ${
          navShadow ? 'border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.35)]' : 'border-transparent'
        }`}
      >
        <div className="max-w-4xl mx-auto px-4">
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
              <span className="text-lg font-semibold tracking-wide text-white">{fullName}</span>
              <span className="hidden sm:inline text-xs text-gray-400">{role}</span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.filter((n) => n.show).map((n) => (
                <NavLink key={n.id} id={n.id} label={n.label} />
              ))}
              {data?.cvFileDataUrl && (
                <a
                  href={data.cvFileDataUrl}
                  download={data.cvFileName ?? 'cv.pdf'}
                  className="ml-2 inline-flex items-center gap-2 rounded-full bg-[color:var(--neon)] px-4 py-1.5 text-gray-900 font-semibold shadow-md hover:brightness-110"
                >
                  <Download className="h-4 w-4" /> CV
                </a>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/20"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile drawer */}
          {menuOpen && (
            <div className="md:hidden border-t border-white/10 py-2">
              <div className="flex flex-col">
                {navItems
                  .filter((n) => n.show)
                  .map((n) => (
                    <NavLink key={n.id} id={n.id} label={n.label} />
                  ))}
                {data?.cvFileDataUrl && (
                  <a
                    href={data.cvFileDataUrl}
                    download={data.cvFileName ?? 'cv.pdf'}
                    className="mt-1 inline-flex items-center gap-2 rounded-full bg-[color:var(--neon)] px-4 py-2 text-gray-900 font-semibold shadow-md"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Download className="h-4 w-4" /> CV
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* ===== HEADER / HERO ===== */}
      <header className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950">
        {/* subtle neon background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_0%,rgba(0,207,255,0.22)_0%,transparent_60%)]"
        />
        <div className="max-w-4xl mx-auto px-6 py-12 text-center relative">
          {/* Avatar: render only when a photo exists */}
          {photo && (
            <figure className="group relative w-fit mx-auto mb-6" data-reveal>
              <span
                aria-hidden
                className="absolute -inset-8 -z-10 rounded-full blur-2xl opacity-60 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(0,207,255,0.26)_0%,transparent_60%)]"
              />
              <span aria-hidden className="avatar-ring absolute inset-[-10px] rounded-[28px]" />
              <div className="relative h-36 w-36 md:h-40 md:w-40 rounded-[28px] p-[3px] bg-gradient-to-b from-[#7dd3fc] via-[#38bdf8] to-[#00cfff] shadow-2xl">
                <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
                  <Image src={photo} alt={fullName} fill sizes="160px" priority className="object-cover" />
                  {/* sheen on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.12),transparent)] transition-transform duration-[1200ms] ease-out group-hover:translate-x-[120%]"
                  />
                </div>
              </div>
            </figure>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight" data-reveal>{fullName}</h1>
          <p className="text-lg text-gray-400 mt-1" data-reveal>{role}</p>
          <p className="text-sm text-gray-500 mt-1 text-justify" data-reveal>{tagline}</p>
          <p className="text-xs text-gray-600 mt-1" data-reveal>{location}</p>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3" data-reveal>
            {data?.cvFileDataUrl && (
              <a
                href={data.cvFileDataUrl}
                download={data.cvFileName ?? 'cv.pdf'}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--neon)] px-5 py-2 font-semibold text-gray-900 shadow-md transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,207,255,0.5)]"
              >
                <Download className="h-4 w-4" /> Download CV
              </a>
            )}
            {data?.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--neon)] px-5 py-2 font-semibold text-[color:var(--neon)] shadow-md transition hover:bg-[color:var(--neon)] hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,207,255,0.5)]"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* ABOUT */}
        {data?.about && (
          <section
            id="about"
            className="relative rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm hover:shadow-md transition"
            data-entrance
          >
            <h2 className="text-xl font-semibold text-[color:var(--neon)] mb-2 flex items-center" data-reveal>
              <Code size={20} className="mr-2" /> About Me
            </h2>
            <p className="text-gray-300 leading-relaxed text-justify" data-reveal>{data.about}</p>
          </section>
        )}

        {/* SKILLS — single column (clean rows) */}
        {skills.length > 0 && (
          <section
            id="skills"
            className="relative rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm"
            data-entrance
          >
            <h2 className="text-xl font-semibold text-[color:var(--neon)] mb-3 flex items-center" data-reveal>
              <Code size={20} className="mr-2" /> Skills
            </h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-3">
              {skills.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-gray-900/40 p-3 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[rgba(0,207,255,0.35)]"
                  data-reveal
                  style={{ ['--stagger' as never]: String(i % 8) }}
                >
                  <span className="text-sm text-gray-200 text-justify">{s as string}</span>
                  <span className="h-2 w-2 rounded-full bg-[color:var(--neon)]/80" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS — single column (clean rows) */}
        {projects.length > 0 && (
          <section
            id="projects"
            className="relative rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm"
            data-entrance
          >
            <h2 className="text-xl font-semibold text-[color:var(--neon)] mb-3 flex items-center" data-reveal>
              <Code size={20} className="mr-2" /> Projects
            </h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-4">
              {projects.map((p, i) => (
                <article
                  key={i}
                  className="rounded-lg border border-white/10 bg-gray-900/40 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-[rgba(0,207,255,0.35)]"
                  data-reveal
                  style={{ ['--stagger' as never]: String(i % 8) }}
                >
                  <h3 className="text-lg font-medium text-white">{p.name?.trim() || `Project ${i + 1}`}</h3>
                  {p.description?.trim() && (
                    <p className="text-gray-400 mt-2 text-justify leading-relaxed">{p.description}</p>
                  )}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[color:var(--neon)] hover:underline mt-3"
                    >
                      <LinkIcon size={16} /> View
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS — card pattern with Award icon */}
        {certifications.length > 0 && (
          <section
            id="certifications"
            className="relative rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm"
            data-entrance
          >
            <h2 className="text-xl font-semibold text-[color:var(--neon)] mb-3 flex items-center" data-reveal>
              <BookOpen size={20} className="mr-2" /> Certifications
            </h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-3">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-gray-900/40 p-3 ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[rgba(0,207,255,0.3)]"
                  data-reveal
                  style={{ ['--stagger' as never]: String(index % 8) }}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[rgba(0,207,255,0.15)] ring-1 ring-[rgba(0,207,255,0.35)]">
                    <Award className="h-6 w-6 text-[color:var(--neon)]" />
                  </span>
                  <p className="text-gray-200 text-justify">{cert as string}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MEDIA — single column */}
        {media.length > 0 && (
          <section
            id="media"
            className="relative rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm"
            data-entrance
          >
            <h2 className="text-xl font-semibold text-[color:var(--neon)] mb-3 flex items-center" data-reveal>
              <Code size={20} className="mr-2" /> Media
            </h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-4">
              {media.map((m, i) => {
                const raw = m.type ? String(m.type) : 'Media';
                const labelNice = raw.charAt(0).toUpperCase() + raw.slice(1);
                return (
                  <div
                    key={i}
                    className="rounded-lg border border-white/10 bg-gray-900/40 p-4 transition hover:border-[rgba(0,207,255,0.35)]"
                    data-reveal
                    style={{ ['--stagger' as never]: String(i % 8) }}
                  >
                    <h3 className="text-lg font-medium">{m.title?.trim() || `Media ${i + 1}`}</h3>
                    <p className="text-gray-400 mt-1 text-justify">{labelNice}</p>
                    {m.link && (
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[color:var(--neon)] hover:underline mt-2"
                      >
                        <LinkIcon size={16} /> View
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* CONTACT */}
        <section
          id="contact"
          className="relative rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm"
          data-entrance
        >
          <h2 className="text-xl font-semibold text-[color:var(--neon)] mb-2 flex items-center" data-reveal>
            <Mail size={20} className="mr-2" /> Contact
          </h2>
          <div className="text-gray-300 space-y-2">
            {data?.email && (
              <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:text-[color:var(--neon)]" data-reveal>
                <Mail size={16} /> {data.email}
              </a>
            )}
            {data?.phone && (
              <a href={`tel:${data.phone}`} className="flex items-center gap-2 hover:text-[color:var(--neon)]" data-reveal>
                <Phone size={16} /> {data.phone}
              </a>
            )}
            {data?.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[color:var(--neon)] hover:underline"
                data-reveal
              >
                <Linkedin size={16} /> LinkedIn
              </a>
            )}

            {socials.length > 0 && (
              <div className="pt-2" data-reveal>
                <h3 className="text-base font-medium text-gray-200/90">Social Links</h3>
                <div className="mt-1 grid grid-cols-1 gap-1">
                  {socials.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="text-[color:var(--neon)] hover:underline">
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
                className="mt-3 inline-flex items-center gap-2 text-[color:var(--neon)] hover:underline"
                data-reveal
              >
                <Download size={16} /> Download CV
              </a>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-3 text-center text-gray-500">
        <p>© {new Date().getFullYear()} {fullName} | Tech Portfolio</p>
      </footer>

      {/* Global helpers (reduced-motion friendly) */}
      <style jsx global>{`
        :root { --neon:#00CFFF; }

        /* NAV underline animation */
        .navlink { position: relative; }
        .navlink::after {
          content: '';
          position: absolute;
          left: 0; right: 0; bottom: 4px; height: 2px;
          background: linear-gradient(90deg, var(--neon), transparent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform .35s ease, opacity .35s ease;
          opacity: .7;
        }
        .navlink:hover::after, .navlink[aria-current="true"]::after { transform: scaleX(1); opacity: 1; }

        /* Per-item reveal */
        .reveal { opacity: 0; transform: translateY(12px); }
        .reveal-in { opacity: 1; transform: translateY(0); transition: opacity .6s ease, transform .6s ease; }
        [data-reveal] { animation-delay: calc(var(--stagger, 0) * 18ms); }

        /* Strong section box reveal */
        section[data-entrance] {
          opacity: 0;
          transform: translateY(18px) scale(.985);
          filter: blur(6px);
          will-change: opacity, transform, filter;
        }
        section[data-entrance].in {
          opacity: 1;
          transform: none;
          filter: none;
          transition: opacity .65s cubic-bezier(.22,.75,.2,1),
                      transform .65s cubic-bezier(.22,.75,.2,1),
                      filter .65s ease;
        }
        section[data-entrance]::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(120% 120% at -20% 0%, rgba(255,255,255,.08), transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.02));
          clip-path: inset(0 100% 0 0);
          opacity: 0;
          transition: clip-path .9s cubic-bezier(.22,.75,.2,1), opacity .9s ease;
        }
        section[data-entrance].in::before { clip-path: inset(0 0 0 0); opacity: .06; }

        /* Avatar ring */
        @keyframes spin360 { to { transform: rotate(360deg); } }
        .avatar-ring::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: conic-gradient(
            from 0deg,
            rgba(0,207,255,0.00) 0deg,
            rgba(0,207,255,0.55) 90deg,
            rgba(14,165,233,0.65) 160deg,
            rgba(99,102,241,0.50) 220deg,
            rgba(0,207,255,0.00) 360deg
          );
          animation: spin360 14s linear infinite;
          opacity: 0.9;
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
                  mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
        }

        @media (prefers-reduced-motion: reduce) {
          .avatar-ring::before { animation: none !important; }
          .reveal { opacity: 1 !important; transform: none !important; }
          section[data-entrance] { opacity: 1 !important; transform: none !important; filter: none !important; }
          section[data-entrance]::before { clip-path: none !important; opacity: .02 !important; transition: none !important; }
          .navlink::after { transition: none !important; }
        }
      `}</style>
    </div>
  );
}
