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

const SECTION_IDS = ['profile', 'about', 'skills', 'projects', 'certifications', 'media', 'contact'] as const;
type SectionId = (typeof SECTION_IDS)[number];

export default function PortfolioTemplateClassic({ data }: { data: PortfolioData }) {
  // ===== Data guards =====
  const fullName = data?.fullName || 'Your Name';
  const role = data?.role || 'Classic Professional';
  const tagline = data?.tagline || 'Classic Tagline';
  const location = data?.location || 'Location';
  const photo = data?.photoDataUrl ?? '';

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

  // ===== Theme (Light / Noir) =====
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

  // Soft reveal (never hides content)
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    if (!('IntersectionObserver' in window)) return;

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
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );
    nodes.forEach((n) => obs.observe(n));

    const sections = Array.from(root.querySelectorAll<HTMLElement>('section[data-entrance]'));
    const secObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            secObs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.12 }
    );
    sections.forEach((s) => secObs.observe(s));

    return () => {
      obs.disconnect();
      secObs.disconnect();
    };
  }, []);

  // Active section spy (only observe sections that exist)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = (visible?.target as HTMLElement | null)?.id as SectionId | undefined;
        if (id) setActive(id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.2, 0.5, 0.8, 1] }
    );
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, []);

  // Clipboard helper
  const copy = async (label: 'email' | 'phone', value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1200);
    } catch {}
  };

  // ===== Nav helpers (ALWAYS render sections; show placeholders if empty) =====
  const navItems: { id: SectionId; label: string; show: boolean }[] = [
    { id: 'profile', label: 'Profile', show: !!photo },
    { id: 'about', label: 'About', show: true },
    { id: 'skills', label: 'Skills', show: true },
    { id: 'projects', label: 'Projects', show: true },
    { id: 'certifications', label: 'Certifications', show: true },
    { id: 'media', label: 'Media', show: true },
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
    <div ref={containerRef} className="surface text-[var(--c-text)] min-h-screen antialiased font-sans">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] rounded-md bg-black/5 px-3 py-2 ring-1 ring-black/10 backdrop-blur"
      >
        Skip to content
      </a>

      {/* Spotlight */}
      <div aria-hidden className="fixed inset-0 pointer-events-none z-[1]" id="__spotlight" />

      {/* Top scroll progress */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 z-[60] h-1 bg-gradient-to-r from-[var(--c-accent)] via-[var(--c-accent-soft)] to-[var(--c-accent)] transition-[width]"
        style={{ width: `${scrollPct}%` }}
      />

      {/* ===== NAVBAR (light glass) ===== */}
      <nav
        className={`sticky top-0 z-50 backdrop-blur ${
          navShadow
            ? 'bg-[var(--glass)] border-b border-black/[.08] shadow-[0_10px_35px_rgba(0,0,0,.06)]'
            : 'bg-[var(--glass-soft)] border-b border-transparent'
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
              <span className="text-lg font-semibold tracking-wide">{fullName}</span>
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
                  className="ml-2 inline-flex items-center gap-2 rounded-full bg-[var(--c-accent)] px-4 py-1.5 text-white font-semibold shadow-sm hover:brightness-110"
                >
                  <Download className="h-4 w-4" /> CV
                </a>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md bg-black/5 ring-1 ring-black/10"
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile drawer */}
          {menuOpen && (
            <div className="md:hidden border-t border-black/10 py-2 bg-[var(--glass)] backdrop-blur">
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
                    className="mt-1 inline-flex items-center gap-2 rounded-full bg-[var(--c-accent)] px-4 py-2 text-white font-semibold shadow-sm"
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

      {/* Theme toggle */}
      <div className="fixed right-4 top-3 z-[70] hidden md:flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="inline-flex items-center gap-2 rounded-full bg-black/5 px-3 py-1.5 text-xs ring-1 ring-black/10 hover:bg-black/[.07] backdrop-blur"
          aria-label="Toggle theme"
        >
          {theme === 'classic' ? <Sparkles size={14} /> : theme === 'noir' ? <MoonStar size={14} /> : <SunMedium size={14} />}
          {theme.charAt(0).toUpperCase() + theme.slice(1)}
        </button>
      </div>

      {/* ===== Light background accents ===== */}
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
        <div data-parallax="0.25" className="absolute -inset-[25%] opacity-70 aurora" />
        <div data-parallax="0.10" className="absolute -inset-[45%] opacity-35 aurora alt" />
        <div className="absolute inset-0 noise" />
      </div>

      {/* ===== HERO (text) ===== */}
      <header className="relative overflow-hidden py-14 text-center z-10">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <h1 className="text-4xl md:text-6xl font-semibold tracking-tight reveal" data-reveal>
            {fullName}
          </h1>
          <p className="text-xl md:text-2xl mt-2 text-[var(--c-subtle)] reveal" data-reveal>
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

      {/* ===== MAIN ===== */}
      <main id="main" className="relative z-10 max-w-4xl mx-auto px-6 py-10 space-y-10">
        {/* PROFILE (image) — full section bar like others */}
        {photo && (
          <Section id="profile" icon={<ImageIcon size={20} />} title="Profile">
            <figure
              className="group mx-auto w-fit [transform-style:preserve-3d] reveal"
              data-reveal
              onMouseMove={(e) => {
                const el = e.currentTarget as HTMLElement;
                const r = el.getBoundingClientRect();
                const rx = ((e.clientY - (r.top + r.height / 2)) / r.height) * -4;
                const ry = ((e.clientX - (r.left + r.width / 2)) / r.width) * 4;
                el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg)`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.transform = 'perspective(900px) rotateX(0) rotateY(0)';
              }}
            >
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
                  <Image src={photo} alt={fullName} fill sizes="256px" priority className="object-cover" />
                  {/* gentle sheen */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.35),transparent)] transition-transform duration-[1200ms] ease-out"
                  />
                </div>
              </div>
            </figure>
          </Section>
        )}

        {/* ABOUT (always render; placeholder if empty) */}
        <Section id="about" icon={<UserRound size={20} />} title="About Me">
          <p className="leading-relaxed text-justify reveal" data-reveal>
            {data?.about?.trim() || 'Tell your story here — background, passions, and what you’re excited to build next.'}
          </p>
        </Section>

        {/* SKILLS */}
        <Section id="skills" icon={<Wand2 size={20} />} title="Skills">
          <div className="mx-auto max-w-3xl flex flex-col gap-3">
            {(skills.length ? skills : ['Add your core skills, tools, and stacks'])
              .slice(0, Math.max(1, skills.length))
              .map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-[var(--chip-bg)] p-3 ring-1 ring-black/10 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[var(--chip-ring)] reveal"
                  data-reveal
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
            {(projects.length ? projects : [{ name: 'Your Project', description: 'Brief problem → solution → impact.' } as any]).map(
              (p, i) => (
                <article
                  key={i}
                  className="rounded-2xl border border-black/10 bg-[var(--glass-card)] backdrop-blur-xl p-4 shadow-[0_10px_40px_rgba(0,0,0,.05)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_50px_rgba(0,0,0,.08)] reveal"
                  data-reveal
                >
                  <h3 className="text-xl font-medium">{p.name?.trim() || `Project ${i + 1}`}</h3>
                  {p.description?.trim() && (
                    <p className="text-[var(--c-muted)] mt-2 text-justify leading-relaxed">{p.description}</p>
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
              )
            )}
          </div>
        </Section>

        {/* CERTIFICATIONS */}
        <Section id="certifications" icon={<BookOpen size={20} />} title="Certifications">
          <div className="mx-auto max-w-3xl flex flex-col gap-3">
            {(certifications.length ? certifications : ['Add a certification or recognition']).map((cert, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-2xl border border-black/10 bg-[var(--glass-card)] backdrop-blur-xl p-3 ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md reveal"
                data-reveal
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
            {(media.length ? media : [{ title: 'Portfolio Deck', type: 'Slides' } as any]).map((m, i) => {
              const label = m.type ? String(m.type) : 'Media';
              const labelNice = label.charAt(0).toUpperCase() + label.slice(1);
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-black/10 bg-[var(--glass-card)] backdrop-blur-xl p-4 transition hover:shadow-[0_16px_50px_rgba(0,0,0,.08)] reveal"
                  data-reveal
                >
                  <h3 className="text-xl font-medium">{m.title?.trim() || `Media ${i + 1}`}</h3>
                  <p className="text-[var(--c-muted)] mt-1 text-justify">{labelNice}</p>
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

        {/* CONTACT */}
        <Section id="contact" icon={<Mail size={20} />} title="Contact">
          <div className="space-y-2">
            {data?.email && (
              <div className="flex items-center gap-2 reveal" data-reveal>
                <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:text-[var(--c-accent)]">
                  <Mail size={16} /> {data.email}
                </a>
                <button
                  onClick={() => copy('email', data.email!)}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ring-1 ring-black/10 hover:bg-black/5"
                  aria-label="Copy email"
                >
                  {copied === 'email' ? <Check size={14} /> : <Copy size={14} />} {copied === 'email' ? 'Copied' : 'Copy'}
                </button>
              </div>
            )}
            {data?.phone && (
              <div className="flex items-center gap-2 reveal" data-reveal>
                <a href={`tel:${data.phone}`} className="flex items-center gap-2 hover:text-[var(--c-accent)]">
                  <Phone size={16} /> {data.phone}
                </a>
                <button
                  onClick={() => copy('phone', data.phone!)}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs ring-1 ring-black/10 hover:bg-black/5"
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
                className="flex items-center gap-2 text-[var(--c-accent)] hover:underline reveal"
                data-reveal
              >
                <Linkedin size={16} /> LinkedIn
              </a>
            )}

            {socials.length > 0 && (
              <div className="pt-2 reveal" data-reveal>
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
                className="mt-3 inline-flex items-center gap-2 text-[var(--c-accent)] hover:underline reveal"
                data-reveal
              >
                <Download size={16} /> Download CV
              </a>
            )}
          </div>
        </Section>
      </main>

      {/* Dot nav (only for visible sections) */}
      <aside
        aria-label="Sections"
        className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3"
      >
        {navItems
          .filter((n) => n.show)
          .map(({ id }) => (
            <a
              key={id}
              href={`#${id}`}
              aria-label={id}
              className={`grid place-items-center h-6 w-6 rounded-full ring-1 transition ${
                active === id
                  ? 'bg-[var(--c-accent)] text-white ring-[var(--c-accent)]'
                  : 'bg-[var(--glass-soft)] ring-black/10 hover:ring-[var(--c-accent)]'
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

      {/* Back to top FAB */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-5 right-5 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--glass)] ring-1 ring-black/10 backdrop-blur hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--c-accent)]"
        aria-label="Back to top"
      >
        <ChevronUp className="h-5 w-5" />
      </button>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[var(--glass)] backdrop-blur py-5 text-center text-[var(--c-muted)] ring-1 ring-black/5">
        <p>
          © {new Date().getFullYear()} {fullName} | Classic Portfolio
        </p>
      </footer>

      {/* Global style tokens + effects */}
      <style jsx global>{`
        :root {
          --mx: 50vw;
          --my: 50vh;
          --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
          /* Calmer whites + balanced glass */
          --glass: rgba(255, 255, 255, 0.78);
          --glass-soft: rgba(255, 255, 255, 0.6);
          --glass-card: rgba(255, 255, 255, 0.82);
        }
        body { font-family: var(--font-sans); }

        /* Light (white & orange — calm) */
        :root[data-classic-theme='classic'] {
          --c-accent:#DF6A1C;            /* professional orange */
          --c-accent-soft:#FFD8B0;       /* soft sweep for bars */
          --c-text:#1f2937;              /* slate-800 */
          --c-subtle:#374151;            /* slate-700 */
          --c-muted:#6b7280;             /* slate-500/600 */
          --bg1:#f7f7f5; --bg2:#fbfaf8; --bg3:#ffffff;  /* calmer white blend */
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
        .aurora {
          background:
            radial-gradient(60% 50% at 50% 0%, rgba(223,106,28,0.09) 0%, transparent 60%),
            radial-gradient(40% 40% at 80% 10%, rgba(242,155,56,0.10) 0%, transparent 70%),
            radial-gradient(40% 40% at 20% 20%, rgba(255,216,176,0.16) 0%, transparent 70%),
            linear-gradient(to bottom, var(--bg1), var(--bg2));
          filter: saturate(108%);
        }
        .aurora.alt {
          background:
            radial-gradient(45% 50% at 20% 10%, rgba(255,216,176,0.10) 0%, transparent 70%),
            radial-gradient(40% 40% at 80% 10%, rgba(223,106,28,0.08) 0%, transparent 70%),
            linear-gradient(to bottom, transparent, var(--bg3));
          mix-blend-mode: screen;
        }
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.03'/%3E%3C/svg%3E");
          background-size: 220px 220px; opacity: .7; mix-blend-mode: overlay;
        }

        /* Portrait frame (static, glassy, no rotation) */
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

        /* === Soft reveal (never hides content) === */
        .reveal { opacity: 1; transform: translateY(0); }
        .reveal-in {
          transition:
            transform .55s cubic-bezier(.22,.75,.2,1),
            box-shadow .55s ease,
            filter .45s ease;
          transform: translateY(0);
          filter: none;
        }
        /* Start slightly lowered (still visible) */
        [data-reveal]:not(.reveal-in) {
          transform: translateY(8px) scale(.995);
          filter: saturate(.98);
        }
        [data-reveal] { animation-delay: calc(var(--stagger) * 18ms); }

        /* Box-level reveal (visible by default) */
        section[data-entrance] {
          position: relative;
          overflow: clip;
          transform: translateY(6px) scale(.992);
          box-shadow: 0 10px 32px rgba(0,0,0,.04);
          transition:
            transform .6s cubic-bezier(.22,.75,.2,1),
            box-shadow .6s ease,
            filter .6s ease;
        }
        section[data-entrance].in {
          transform: none;
          box-shadow: 0 18px 55px rgba(0,0,0,.08);
        }

        /* Nav underline */
        .navlink { position: relative; }
        .navlink::after {
          content: ''; position: absolute; left: 0; right: 0; bottom: 4px; height: 2px;
          background: linear-gradient(90deg, var(--c-accent), transparent);
          transform: scaleX(0); transform-origin: left;
          transition: transform .35s ease, opacity .35s ease; opacity: .6;
        }
        .navlink:hover::after, .navlink[aria-current="true"]::after { transform: scaleX(1); opacity: 1; }

        /* Spotlight cursor (light) */
        #__spotlight {
          background: radial-gradient(360px 360px at var(--mx) var(--my), rgba(223,106,28,.08), transparent 60%);
        }

        @media (prefers-reduced-motion: reduce) {
          [data-reveal]:not(.reveal-in) { transform: none !important; filter: none !important; }
          section[data-entrance] { transform: none !important; box-shadow: 0 10px 24px rgba(0,0,0,.06) !important; }
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
      className="relative rounded-2xl border border-black/10 bg-[var(--glass-card)] backdrop-blur-xl p-6 transition"
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
