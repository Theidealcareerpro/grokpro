'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
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

const SECTION_IDS = ['about', 'skills', 'projects', 'certifications', 'media', 'contact'] as const;
type SectionId = (typeof SECTION_IDS)[number];

export default function PortfolioTemplateClassic({ data }: { data: PortfolioData }) {
  // ===== Data guards =====
  const fullName = data?.fullName || 'Your Name';
  const role = data?.role || 'Classic Professional';
  const tagline = data?.tagline || 'Classic Tagline';
  const location = data?.location || 'Location';
  const photo = data?.photoDataUrl;

  const skills = useMemo(() => (Array.isArray(data?.skills) ? data!.skills.filter(Boolean) : []), [data]);
  const projects = useMemo(
    () =>
      Array.isArray(data?.projects)
        ? data!.projects.filter((p) => p && ((p.name && p.name.trim()) || (p.description && p.description.trim())))
        : [],
    [data]
  );
  const certifications = useMemo(
    () => (Array.isArray(data?.certifications) ? data!.certifications.filter(Boolean) : []),
    [data]
  );
  const media = useMemo(
    () =>
      Array.isArray(data?.media)
        ? data!.media.filter((m) => m && ((m.title && m.title.trim()) || (m.link && m.link.trim())))
        : [],
    [data]
  );
  const socials = useMemo(
    () => (Array.isArray(data?.socials) ? data!.socials.filter((s) => s && s.label && s.url) : []),
    [data]
  );

  // ===== Theme (Classic / Noir) =====
  type Theme = 'classic' | 'noir';
  const [theme, setTheme] = useState<Theme>('classic');
  useEffect(() => {
    const t = (localStorage.getItem('__classic_theme') as Theme) || 'classic';
    setTheme(t);
    document.documentElement.setAttribute('data-classic-theme', t);
  }, []);
  const toggleTheme = () => {
    const order: Theme[] = ['classic', 'noir'];
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
    document.documentElement.setAttribute('data-classic-theme', next);
    localStorage.setItem('__classic_theme', next);
  };

  // ===== UX niceties =====
  const [copied, setCopied] = useState<'email' | 'phone' | null>(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [navShadow, setNavShadow] = useState(false);
  const [active, setActive] = useState<SectionId>('about');
  const [menuOpen, setMenuOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll progress + nav shadow
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const h = el.scrollHeight - el.clientHeight;
      setScrollPct(h > 0 ? (el.scrollTop / h) * 100 : 0);
      setNavShadow(window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Section reveal (element-level) + Section entrance (box-level)
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced) {
      // 1) Existing per-node reveal (for inner bits using [data-reveal])
      const nodes = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
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

      // 2) Stronger section-level box reveal (fade + lift + slight scale + blur)
      const sections = Array.from(root.querySelectorAll<HTMLElement>('section[data-entrance]'));
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

      return () => {
        obs.disconnect();
        secObs.disconnect();
      };
    }
  }, []);

  // Active section spy
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = (visible?.target as HTMLElement | null)?.id as SectionId | undefined;
        if (id && SECTION_IDS.includes(id)) setActive(id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.2, 0.5, 0.8, 1] }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Spotlight cursor + parallax + magnets
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const root = containerRef.current;
    if (!root) return;

    const onMove = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;
      document.documentElement.style.setProperty('--mx', `${x}px`);
      document.documentElement.style.setProperty('--my', `${y}px`);

      if (prefersReduced) return;

      // Parallax layers
      const layers = root.querySelectorAll<HTMLElement>('[data-parallax]');
      layers.forEach((l) => {
        const depth = parseFloat(l.dataset.parallax || '0');
        const dx = (x / window.innerWidth - 0.5) * depth * 12;
        const dy = (y / window.innerHeight - 0.5) * depth * 12;
        l.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
      });

      // Magnetic buttons
      const mags = root.querySelectorAll<HTMLElement>('[data-magnet]');
      mags.forEach((m) => {
        const r = m.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dist = Math.hypot(x - cx, y - cy);
        const pull = Math.max(0, 1 - dist / 260);
        const tx = (x - cx) * 0.08 * pull;
        const ty = (y - cy) * 0.08 * pull;
        m.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      });
    };

    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  // Keyboard jumps (1..6)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const idx = Number(e.key) - 1;
      if (idx >= 0 && idx < SECTION_IDS.length) {
        const id = SECTION_IDS[idx];
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Clipboard helper
  const copy = async (label: 'email' | 'phone', value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1200);
    } catch {}
  };

  // ===== Nav helpers =====
  const navItems: { id: SectionId; label: string; show: boolean }[] = [
    { id: 'about', label: 'About', show: !!data?.about },
    { id: 'skills', label: 'Skills', show: skills.length > 0 },
    { id: 'projects', label: 'Projects', show: projects.length > 0 },
    { id: 'certifications', label: 'Certifications', show: certifications.length > 0 },
    { id: 'media', label: 'Media', show: media.length > 0 },
    { id: 'contact', label: 'Contact', show: true },
  ];

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
          isActive ? 'text-[var(--c-accent)]' : 'text-[var(--c-muted)] hover:text-[var(--c-accent)]'
        }`}
        aria-current={isActive ? 'true' : undefined}
      >
        {label}
      </a>
    );
  };

  return (
    <div ref={containerRef} className="classic-surface text-white min-h-screen antialiased">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] rounded-md bg-white/10 px-3 py-2 ring-1 ring-white/20 backdrop-blur"
      >
        Skip to content
      </a>

      {/* Spotlight cursor */}
      <div aria-hidden className="fixed inset-0 pointer-events-none z-[1]" id="__spotlight" />

      {/* Top scroll progress (uses theme tokens) */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[60] h-1 bg-gradient-to-r from-[var(--c-accent)] via-[var(--c-accent-soft)] to-[var(--c-accent)] transition-[width]"
        style={{ width: `${scrollPct}%` }}
      />

      {/* ===== NAVBAR ===== */}
      <nav
        className={`sticky top-0 z-50 backdrop-blur bg-black/20 ${
          navShadow ? 'border-b border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.2)]' : 'border-b border-transparent'
        }`}
      >
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
              {navItems.filter((n) => n.show).map((n) => (
                <NavLink key={n.id} id={n.id} label={n.label} />
              ))}
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
                    className="mt-1 inline-flex items-center gap-2 rounded-full bg-[var(--c-accent)] px-4 py-2 text-gray-900 font-semibold shadow-md"
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

      {/* Header controls (theme) */}
      <div className="fixed right-4 top-3 z-[70] hidden md:flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs ring-1 ring-white/20 hover:bg-white/15 backdrop-blur"
          aria-label="Toggle theme"
        >
          {theme === 'classic' ? <Sparkles size={14} /> : theme === 'noir' ? <MoonStar size={14} /> : <SunMedium size={14} />}
          {theme.charAt(0).toUpperCase() + theme.slice(1)}
        </button>
      </div>

      {/* ===== Auroral background with parallax layers ===== */}
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
        <div data-parallax="0.5" className="absolute -inset-[20%] opacity-80 classic-aurora" />
        <div data-parallax="0.18" className="absolute -inset-[40%] opacity-40 classic-aurora alt" />
        <div className="absolute inset-0 noise" />
      </div>

      {/* ===== HERO ===== */}
      <header className="relative overflow-hidden py-16 text-center z-10">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {/* Only render the avatar frame if a photo exists */}
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
              <div className="relative h-40 w-40 md:h-44 md:w-44 rounded-[28px] p-[2px] classic-frame shadow-2xl">
                <div className="relative h-full w-full overflow-hidden rounded-[26px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
                  <Image src={photo} alt={fullName} fill sizes="176px" priority className="object-cover" />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.16),transparent)] transition-transform duration-[1200ms] ease-out"
                  />
                </div>
              </div>
            </figure>
          )}

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow reveal" data-reveal>
            {fullName}
          </h1>
          <p className="text-xl md:text-2xl text-[var(--c-subtle)] mt-2 reveal" data-reveal>
            {role}
          </p>
          <p className="mt-3 text-sm md:text-base text-[var(--c-muted)] text-justify max-w-2xl mx-auto reveal" data-reveal>
            {tagline}
          </p>
          <p className="text-l text-[var(--c-muted)] mt-1 reveal" data-reveal>
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

      {/* ===== RIGHT DOT NAV ===== */}
      <aside
        aria-label="Sections"
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3"
      >
        {SECTION_IDS.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            aria-label={id}
            className={`grid place-items-center h-6 w-6 rounded-full ring-1 ring-white/30 transition hover:ring-[var(--c-accent)] ${
              active === id ? 'bg-[var(--c-accent)] text-black' : 'bg-white/10'
            }`}
            title={id.charAt(0).toUpperCase() + id.slice(1)}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}
          >
            <Circle className="h-3 w-3" />
          </a>
        ))}
      </aside>

      {/* ===== MAIN ===== */}
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
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-[var(--chip-bg)] p-3 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[var(--chip-ring)]"
                  data-reveal
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
              {projects.map((p, i) => (
                <article
                  key={i}
                  className="rounded-lg border border-white/10 bg-[var(--card-bg)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--card-ring)]"
                  data-reveal
                >
                  <h3 className="text-xl font-medium">{p.name?.trim() || `Project ${i + 1}`}</h3>
                  {p.description?.trim() && (
                    <p className="text-[var(--c-subtle)] mt-2 text-justify leading-relaxed">{p.description}</p>
                  )}
                  {p.link && (
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
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-[var(--card-bg)] p-3 ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[var(--card-ring)]"
                  data-reveal
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
                const label = m.type ? String(m.type) : 'Media';
                const labelNice = label.charAt(0).toUpperCase() + label.slice(1);
                return (
                  <div
                    key={i}
                    className="rounded-lg border border-white/10 bg-[var(--card-bg)] p-4 transition hover:border-[var(--card-ring)]"
                    data-reveal
                  >
                    <h3 className="text-xl font-medium">{m.title?.trim() || `Media ${i + 1}`}</h3>
                    <p className="text-[var(--c-subtle)] mt-1 text-justify">{labelNice}</p>
                    {m.link && (
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
                  onClick={() => copy('email', data.email!)}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ring-1 ring-white/15 hover:bg-white/5"
                  aria-label="Copy email"
                >
                  {copied === 'email' ? <Check size={14} /> : <Copy size={14} />} {copied === 'email' ? 'Copied' : 'Copy'}
                </button>
              </div>
            )}
            {data?.phone && (
              <div className="flex items-center gap-2" data-reveal>
                <a href={`tel:${data.phone}`} className="flex items-center gap-2 hover:text-[var(--c-accent)]">
                  <Phone size={16} /> {data.phone}
                </a>
                <button
                  onClick={() => copy('phone', data.phone!)}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ring-1 ring-white/15 hover:bg-white/5"
                  aria-label="Copy phone"
                >
                  {copied === 'phone' ? <Check size={14} /> : <Copy size={14} />} {copied === 'phone' ? 'Copied' : 'Copy'}
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
                    <a
                      key={i}
                      href={s.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--c-accent)] hover:underline"
                    >
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

      {/* Back to top FAB */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-5 right-5 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 backdrop-blur hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)]"
        aria-label="Back to top"
      >
        <ChevronUp className="h-5 w-5" />
      </button>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[var(--footer-bg)] py-5 text-center text-[var(--c-subtle)]">
        <p>
          © {new Date().getFullYear()} {fullName} | Classic Portfolio
        </p>
      </footer>

      {/* Global style tokens + effects */}
      <style jsx global>{`
        :root { --mx: 50vw; --my: 50vh; }

        /* === GOLD / YELLOW — HIGH IMPACT === */
        :root[data-classic-theme='classic'] {
          --c-accent:#FFC107;           /* vivid amber (primary) */
          --c-accent-soft:#FFE082;      /* soft sweep for bars & hovers */
          --c-text:#FFF9EC;             /* warm near-white */
          --c-subtle:#FFE8A3;           /* soft gold for subheads */
          --c-muted:#FFD98ACC;          /* muted gold for body */
          --bg1:#0B0700; --bg2:#141007; --bg3:#1C1509;  /* deep espresso-brown gradient */
          --chip-bg: rgba(255,193,7,0.16);
          --chip-ring: rgba(255,193,7,0.38);
          --card-bg: rgba(255,215,0,0.12);
          --card-ring: rgba(255,215,0,0.35);
          --badge-bg: rgba(255,200,0,0.16);
          --badge-ring: rgba(255,200,0,0.38);
          --footer-bg:#0A0600;
        }
        :root[data-classic-theme='noir'] {
          --c-accent:#FFD54F;           /* bright golden */
          --c-accent-soft:#FFECB3;      /* pale gold */
          --c-text:#FFF9ED;
          --c-subtle:#FFE7B3;
          --c-muted:#EFDCA6CC;
          --bg1:#0A0A06; --bg2:#12110A; --bg3:#19170E;  /* dark olive/sepia */
          --chip-bg: rgba(255,213,79,0.12);
          --chip-ring: rgba(255,213,79,0.34);
          --card-bg: rgba(255,213,79,0.10);
          --card-ring: rgba(255,213,79,0.30);
          --badge-bg: rgba(255,213,79,0.14);
          --badge-ring: rgba(255,213,79,0.34);
          --footer-bg:#0D0C08;
        }
        /* keep porcelain + extras available (unchanged) */
        :root[data-classic-theme='porcelain'] {
          --c-accent:#ff7ad9; --c-accent-soft:#FFD3F1;
          --c-text:#1f1b24; --c-subtle:#3c2b46; --c-muted:#4b3a56cc;
          --bg1:#fff8ff; --bg2:#fdf3ff; --bg3:#faeaff;
          --chip-bg: rgba(255, 122, 217, 0.12); --chip-ring: rgba(255,122,217,0.35);
          --card-bg: rgba(255,255,255,0.75); --card-ring: rgba(255,122,217,0.35);
          --badge-bg: rgba(255, 122, 217, 0.15); --badge-ring: rgba(255,122,217,0.35);
          --footer-bg:#efe3f7;
        }
        /* Optional professional palettes left intact */
        :root[data-classic-theme='navy']{
          --c-accent:#2F6BFF; --c-accent-soft:#CFE0FF;
          --c-text:#0F172A; --c-subtle:#334155; --c-muted:#64748B;
          --bg1:#F8FAFF; --bg2:#F3F6FF; --bg3:#EEF2FF;
          --chip-bg:rgba(47,107,255,.10); --chip-ring:rgba(47,107,255,.26);
          --card-bg:rgba(255,255,255,.82); --card-ring:rgba(15,23,42,.08);
          --badge-bg:rgba(47,107,255,.12); --badge-ring:rgba(47,107,255,.26);
          --footer-bg:#EAF0FF;
        }
        :root[data-classic-theme='teal']{
          --c-accent:#14B8A6; --c-accent-soft:#BFEFE9;
          --c-text:#0F172A; --c-subtle:#1F2937; --c-muted:#475569;
          --bg1:#F6FBFA; --bg2:#F2F8F7; --bg3:#EDF6F4;
          --chip-bg:rgba(20,184,166,.10); --chip-ring:rgba(20,184,166,.26);
          --card-bg:rgba(255,255,255,.82); --card-ring:rgba(15,23,42,.08);
          --badge-bg:rgba(20,184,166,.12); --badge-ring:rgba(20,184,166,.26);
          --footer-bg:#E8F4F2;
        }
        :root[data-classic-theme='indigo']{
          --c-accent:#6366F1; --c-accent-soft:#DADDFE;
          --c-text:#111827; --c-subtle:#374151; --c-muted:#6B7280;
          --bg1:#F7F8FF; --bg2:#F3F5FF; --bg3:#EEF1FF;
          --chip-bg:rgba(99,102,241,.12); --chip-ring:rgba(99,102,241,.28);
          --card-bg:rgba(255,255,255,.82); --card-ring:rgba(17,24,39,.08);
          --badge-bg:rgba(99,102,241,.14); --badge-ring:rgba(99,102,241,.28);
          --footer-bg:#EAEFFF;
        }
        :root[data-classic-theme='emerald']{
          --c-accent:#10B981; --c-accent-soft:#C7F3E3;
          --c-text:#0B1220; --c-subtle:#1E293B; --c-muted:#475569;
          --bg1:#F7FCFA; --bg2:#F2FAF6; --bg3:#ECF7F1;
          --chip-bg:rgba(16,185,129,.12); --chip-ring:rgba(16,185,129,.26);
          --card-bg:rgba(255,255,255,.82); --card-ring:rgba(11,18,32,.08);
          --badge-bg:rgba(16,185,129,.14); --badge-ring:rgba(16,185,129,.26);
          --footer-bg:#E6F3EE;
        }
        :root[data-classic-theme='copper']{
          --c-accent:#C9722C; --c-accent-soft:#F6D7BD;
          --c-text:#1F2937; --c-subtle:#374151; --c-muted:#6B7280;
          --bg1:#FFFDFB; --bg2:#FBF8F4; --bg3:#F6F2EE;
          --chip-bg:rgba(201,114,44,.12); --chip-ring:rgba(201,114,44,.26);
          --card-bg:rgba(255,255,255,.85); --card-ring:rgba(17,24,39,.08);
          --badge-bg:rgba(201,114,44,.14); --badge-ring:rgba(201,114,44,.26);
          --footer-bg:#EFE8E1;
        }

        .classic-surface { background: linear-gradient(120deg, var(--bg1), var(--bg2), var(--bg3)); }

        /* GOLD aurora layers */
        .classic-aurora {
          background:
            radial-gradient(60% 50% at 50% 0%, rgba(255,215,0,0.22) 0%, transparent 60%),
            radial-gradient(40% 40% at 80% 10%, rgba(255,193,7,0.20) 0%, transparent 70%),
            radial-gradient(40% 40% at 20% 20%, rgba(255,140,0,0.18) 0%, transparent 70%),
            linear-gradient(to bottom, var(--bg1), var(--bg2));
          filter: saturate(120%);
        }
        .classic-aurora.alt {
          background:
            radial-gradient(45% 50% at 20% 10%, rgba(255,236,179,0.18) 0%, transparent 70%),
            radial-gradient(40% 40% at 80% 10%, rgba(255,215,0,0.18) 0%, transparent 70%),
            linear-gradient(to bottom, transparent, var(--bg3));
          mix-blend-mode: screen;
        }
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
          background-size: 220px 220px; opacity: .6; mix-blend-mode: overlay;
        }

        .classic-glow { background: radial-gradient(60% 60% at 50% 50%, rgba(255,215,0,0.36) 0%, transparent 60%); }

        /* GOLD metal frame around avatar */
        .classic-frame {
          background:
            conic-gradient(from 210deg, rgba(255,255,255,.55), rgba(255,255,255,0) 30% 70%, rgba(255,255,255,.55)),
            linear-gradient(180deg, #FFF6DF, #FFE082 30%, #FFC107 60%, #FFB300 100%);
          border-radius: 28px;
          padding: 2px;
        }

        /* Reveal (per-element) */
        .reveal { opacity: 0; transform: translateY(12px); }
        .reveal-in { opacity: 1; transform: translateY(0); transition: opacity .6s ease, transform .6s ease; }
        [data-reveal] { animation-delay: calc(var(--stagger) * 18ms); }

        @keyframes spin360 { to { transform: rotate(360deg); } }
        /* GOLD ring sweep */
        .avatar-ring::before {
          content: ''; position: absolute; inset: 0; border-radius: inherit;
          background: conic-gradient(
            from 0deg,
            rgba(255,193,7,0.00) 0deg,
            rgba(255,236,179,0.55) 72deg,
            rgba(255,215,0,0.85) 160deg,
            rgba(255,179,0,0.60) 240deg,
            rgba(255,193,7,0.00) 360deg
          );
          animation: spin360 16s linear infinite; opacity: 0.95;
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
                  mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
        }

        /* Spotlight cursor */
        #__spotlight {
          background: radial-gradient(350px 350px at var(--mx) var(--my), rgba(255,215,0,.14), transparent 60%);
        }

        /* NAV underline animation */
        .navlink { position: relative; }
        .navlink::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: 4px; height: 2px;
          background: linear-gradient(90deg, var(--c-accent), transparent);
          transform: scaleX(0); transform-origin: left;
          transition: transform .35s ease, opacity .35s ease;
          opacity: .8;
        }
        .navlink:hover::after, .navlink[aria-current="true"]::after { transform: scaleX(1); opacity: 1; }

        /* Section entrance (unchanged logic, brighter feel due to palette) */
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
          transition: opacity .65s cubic-bezier(.22,.75,.2,1), transform .65s cubic-bezier(.22,.75,.2,1), filter .65s ease;
        }
        section[data-entrance]::before {
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(120% 120% at -20% 0%, rgba(255,255,255,.10), transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,.05), rgba(255,255,255,.03));
          clip-path: inset(0 100% 0 0);
          opacity: 0;
          transition: clip-path .9s cubic-bezier(.22,.75,.2,1), opacity .9s ease;
        }
        section[data-entrance].in::before { clip-path: inset(0 0 0 0); opacity: .08; }

        @media (prefers-reduced-motion: reduce) {
          .avatar-ring::before { animation: none !important; }
          .reveal { opacity: 1 !important; transform: none !important; }
          section[data-entrance] { opacity: 1 !important; transform: none !important; filter: none !important; }
          section[data-entrance]::before { clip-path: none !important; opacity: .02 !important; transition: none !important; }
          .navlink::after { transition: none !important; }
        }

        /* Print-friendly */
        @media print {
          #__spotlight, aside, .noise, nav { display: none !important; }
          button, a[href^="#"] { display: none !important; }
          body { background: #fff !important; color: #111 !important; }
        }
      `}</style>
    </div>
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
    <section
      id={id}
      className="relative rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm hover:shadow-md transition"
      data-entrance
    >
      <header className="mb-4 flex items-center gap-3" data-reveal>
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--badge-bg)] ring-1 ring-[var(--badge-ring)]">
          {icon}
        </span>
        <h2 className="text-2xl font-semibold">{title}</h2>
      </header>
      {children}
    </section>
  );
}
