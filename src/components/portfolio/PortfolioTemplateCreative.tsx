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
    // Gate reveal styles so content is visible by default if JS/IO fails
    document.documentElement.classList.add('io-ready');

    const root = containerRef.current;
    if (!root) return;
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReduced) {
      // 1) Per-node reveal
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

      // 2) Section-level box reveal
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
    <div ref={containerRef} className="classic-surface text-white min-h-screen antialiased font-sans">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] rounded-md bg-white/10 px-3 py-2 ring-1 ring-white/20 backdrop-blur"
      >
        Skip to content
      </a>

      {/* Spotlight cursor */}
      <div aria-hidden className="fixed inset-0 pointer-events-none z-[1]" id="__spotlight" />

      {/* Top scroll progress */}
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

      {/* ===== HERO (text-only) ===== */}
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

      {/* ===== SHOWCASE PORTRAIT (after hero, before About) — NO rotation ===== */}
      {photo && (
        <section className="relative z-10 max-w-4xl mx-auto px-6 -mt-4 mb-6" aria-label="Profile image">
          <figure
            className="portrait group mx-auto w-fit [transform-style:preserve-3d]"
            onMouseMove={(e) => {
              const el = e.currentTarget as HTMLElement;
              const r = el.getBoundingClientRect();
              const rx = ((e.clientY - (r.top + r.height / 2)) / r.height) * -6;
              const ry = ((e.clientX - (r.left + r.width / 2)) / r.width) * 6;
              el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
            }}
            data-reveal
          >
            <span aria-hidden className="portrait-glow absolute -inset-10 -z-10 blur-3xl opacity-60" />
            <div className="portrait-frame relative h-56 w-56 md:h-64 md:w-64 rounded-[30px] p-[2px] shadow-2xl">
              <div className="relative h-full w-full overflow-hidden rounded-[28px] bg-white/[0.08] backdrop-blur-md ring-1 ring-white/10">
                {/* subtle gridlines */}
                <span
                  aria-hidden
                  className="absolute inset-0 opacity-[0.12]"
                  style={{
                    backgroundImage:
                      'linear-gradient(to right, rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,.08) 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                  }}
                />
                <Image src={photo} alt={fullName} fill sizes="256px" priority className="object-cover" />
                {/* sheen sweep */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.22),transparent)] transition-transform duration-[1200ms] ease-out"
                />
              </div>
            </div>
          </figure>
        </section>
      )}

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
        :root { --mx: 50vw; --my: 50vh; --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"; }
        body { font-family: var(--font-sans); }

        /* Professional Orange Mix */
        :root[data-classic-theme='classic'] {
          --c-accent:#FF8A3D;            /* copper orange */
          --c-accent-soft:#FFC38A;       /* soft sweep for bars */
          --c-text:#fff9f6;              /* warm near-white */
          --c-subtle:#ffe0cc;            /* subhead */
          --c-muted:#ffd2b8cc;           /* muted */
          --bg1:#0f0b07; --bg2:#1a140d; --bg3:#22160a; /* ember dusk */
          --chip-bg: rgba(255,138,61,0.14);
          --chip-ring: rgba(255,178,102,0.38);
          --card-bg: rgba(255,255,255,0.055);
          --card-ring: rgba(255,178,102,0.38);
          --badge-bg: rgba(255,178,102,0.14);
          --badge-ring: rgba(255,178,102,0.38);
          --footer-bg:#0e0a06;
        }
        :root[data-classic-theme='noir'] {
          --c-accent:#FFB04A; --c-accent-soft:#FFD199;
          --c-text:#eef6f9; --c-subtle:#dfeaf0; --c-muted:#cfdbe2cc;
          --bg1:#0a0c10; --bg2:#0f1216; --bg3:#12161c; /* charcoal slate */
          --chip-bg: rgba(255,176,74,0.12);
          --chip-ring: rgba(255,176,74,0.38);
          --card-bg: rgba(255,255,255,0.045);
          --card-ring: rgba(255,176,74,0.35);
          --badge-bg: rgba(255,176,74,0.12);
          --badge-ring: rgba(255,176,74,0.35);
          --footer-bg:#0b0e13;
        }

        .classic-surface { background: linear-gradient(120deg, var(--bg1), var(--bg2), var(--bg3)); }
        .classic-aurora {
          background:
            radial-gradient(60% 50% at 50% 0%, rgba(255,138,61,0.20) 0%, transparent 60%),
            radial-gradient(40% 40% at 80% 10%, rgba(255,176,74,0.18) 0%, transparent 70%),
            radial-gradient(40% 40% at 20% 20%, rgba(255,195,138,0.18) 0%, transparent 70%),
            linear-gradient(to bottom, var(--bg1), var(--bg2));
          filter: saturate(115%);
        }
        .classic-aurora.alt {
          background:
            radial-gradient(45% 50% at 20% 10%, rgba(255,195,138,0.16) 0%, transparent 70%),
            radial-gradient(40% 40% at 80% 10%, rgba(255,138,61,0.16) 0%, transparent 70%),
            linear-gradient(to bottom, transparent, var(--bg3));
          mix-blend-mode: screen;
        }
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
          background-size: 220px 220px; opacity: .6; mix-blend-mode: overlay;
        }

        /* Portrait frame (static copper gradient, no rotation) */
        .portrait-frame {
          background:
            conic-gradient(from 210deg, rgba(255,255,255,.20), rgba(255,255,255,0) 30% 70%, rgba(255,255,255,.20)),
            linear-gradient(180deg, #ffe0c2, #ffb76b 35%, #ff8a3d 70%, #f0772a 100%);
          border-radius: 30px;
          padding: 2px;
        }
        .portrait-glow {
          background: radial-gradient(60% 60% at 50% 50%, rgba(255,138,61,0.28) 0%, transparent 60%);
        }

        /* Reveal (per-element) — gated so content is visible by default */
        .reveal { opacity: 1; transform: none; }
        :root.io-ready .reveal { opacity: 0; transform: translateY(12px); }
        :root.io-ready .reveal-in { opacity: 1; transform: translateY(0); transition: opacity .6s ease, transform .6s ease; }
        [data-reveal] { animation-delay: calc(var(--stagger) * 18ms); }

        /* NAV underline animation */
        .navlink { position: relative; }
        .navlink::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: 4px; height: 2px;
          background: linear-gradient(90deg, var(--c-accent), transparent);
          transform: scaleX(0); transform-origin: left;
          transition: transform .35s ease, opacity .35s ease; opacity: .7;
        }
        .navlink:hover::after, .navlink[aria-current="true"]::after { transform: scaleX(1); opacity: 1; }

        /* Stronger section-level box reveal — gated for safety */
        section[data-entrance] { opacity: 1; transform: none; filter: none; }
        :root.io-ready section[data-entrance] {
          opacity: 0; transform: translateY(18px) scale(.985); filter: blur(6px);
          will-change: opacity, transform, filter, box-shadow;
        }
        :root.io-ready section[data-entrance].in {
          opacity: 1; transform: none; filter: none;
          box-shadow: 0 12px 40px rgba(0,0,0,.22);
          transition: opacity .65s cubic-bezier(.22,.75,.2,1), transform .65s cubic-bezier(.22,.75,.2,1), filter .65s ease, box-shadow .65s ease;
        }
        section[data-entrance]::before { display:none; }
        :root.io-ready section[data-entrance]::before {
          display:block;
          content: ''; position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(120% 120% at -20% 0%, rgba(255,255,255,.08), transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.02));
          clip-path: inset(0 100% 0 0); opacity: 0;
          transition: clip-path .9s cubic-bezier(.22,.75,.2,1), opacity .9s ease;
        }
        :root.io-ready section[data-entrance].in::before { clip-path: inset(0 0 0 0); opacity: .06; }

        @media (prefers-reduced-motion: reduce) {
          .reveal, :root.io-ready .reveal { opacity: 1 !important; transform: none !important; }
          section[data-entrance], :root.io-ready section[data-entrance] { opacity: 1 !important; transform: none !important; filter: none !important; box-shadow: none !important; }
          section[data-entrance]::before { clip-path: none !important; opacity: .02 !important; transition: none !important; }
          .navlink::after { transition: none !important; }
        }

        /* Spotlight cursor */
        #__spotlight {
          background: radial-gradient(350px 350px at var(--mx) var(--my), rgba(255,255,255,.08), transparent 60%);
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
