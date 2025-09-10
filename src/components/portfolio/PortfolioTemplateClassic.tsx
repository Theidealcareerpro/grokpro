'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Briefcase,
  BarChart3,
  Code,
  BookOpen,
  Lightbulb,
  Users,
  Database,
  PieChart,
  Rocket,
  Laptop,
  TrendingUp,
  Link as LinkIcon,
  Mail,
  Phone,
  Linkedin,
  Download,
  Menu,
  X,
  Award,
} from 'lucide-react';
import type { PortfolioData } from '@/lib/portfolio-types';

const defaultSkillIcons = [Briefcase, BarChart3, Code, BookOpen, Lightbulb, Users];
const defaultProjectIcons = [Briefcase, Database, PieChart, Rocket, Laptop, TrendingUp];

const SECTIONS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

export default function PortfolioTemplateModern({ data }: { data: PortfolioData }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<SectionId>('home');
  const prefersReducedMotion = usePrefersReducedMotion();

  const skills = useMemo(() => (Array.isArray(data?.skills) ? data.skills.filter(Boolean) : []), [data]);
  const certifications = useMemo(
    () => (Array.isArray(data?.certifications) ? data.certifications.filter(Boolean) : []),
    [data]
  );
  const projects = useMemo(() => (Array.isArray(data?.projects) ? data.projects : []), [data]);

  useScrollSpy(setActive);

  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, []);

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="font-serif bg-gradient-to-b from-[#0f1a1a] to-[#1b2b2b] text-gray-100 min-h-screen antialiased">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 backdrop-blur bg-[#0d1a1a]/90 shadow-lg border-b border-white/5">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between" aria-label="Primary">
          <div className="flex items-center gap-3">
            {data?.photoDataUrl ? (
              <span className="relative inline-block h-8 w-8 overflow-hidden rounded-full ring-2 ring-teal-400/80">
                <Image src={data.photoDataUrl} alt={data.fullName || 'Avatar'} fill sizes="32px" className="object-cover" />
              </span>
            ) : (
              <span aria-hidden className="h-8 w-8 rounded-full bg-white/10 ring-2 ring-teal-400/40" />
            )}
            <div className="text-xl sm:text-2xl font-bold text-teal-400 tracking-tight">
              {data?.fullName || 'Your Name'}
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 font-medium">
            {SECTIONS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => handleAnchorClick(e, id)}
                className={
                  'relative px-1 py-2 outline-none transition ' +
                  (active === id
                    ? 'text-teal-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-gradient-to-r after:from-teal-300 after:to-teal-500'
                    : 'text-gray-200 hover:text-teal-300 focus-visible:text-teal-300')
                }
              >
                {label}
              </a>
            ))}
          </div>
          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 hover:bg-white/5 focus-visible:outline-none focus-visible:ring focus-visible:ring-teal-400/70"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0d1a1a]/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 grid grid-cols-2 gap-3">
              {SECTIONS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => handleAnchorClick(e, id)}
                  className={
                    'rounded-md px-3 py-2 text-sm font-medium ring-1 ring-inset ring-white/10 hover:bg-white/5 ' +
                    (active === id ? 'text-teal-300' : 'text-gray-200')
                  }
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative flex min-h-[88vh] items-center justify-center overflow-hidden px-6 text-center scroll-mt-24"
        aria-label="Hero"
      >
        <div
          aria-hidden
          className={
            'pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,#1a3a3a_0%,transparent_60%),radial-gradient(40%_40%_at_80%_10%,#14b8a633_0%,transparent_70%),linear-gradient(to_bottom,#0d1a1a,#1a2f2f)] ' +
            (prefersReducedMotion ? '' : 'animate-[gradientShift_14s_ease_in_out_infinite] bg-[length:160%_160%]')
          }
        />

        <div className="mx-auto flex max-w-4xl flex-col items-center">
          {/* Modern, vibrant photo holder */}
          <figure className="group relative mb-8">
            {/* soft aura */}
            <span
              aria-hidden
              className={
                'absolute -inset-8 -z-10 rounded-full blur-2xl opacity-60 ' +
                'bg-[radial-gradient(60%_60%_at_50%_50%,rgba(20,184,166,0.35)_0%,transparent_60%)]'
              }
            />
            {/* spinning conic ring */}
            {!prefersReducedMotion && (
              <span aria-hidden className="avatar-ring absolute inset-[-10px] rounded-full" />
            )}

            <div className="relative h-44 w-44 md:h-52 md:w-52 rounded-[28px] p-[3px] bg-gradient-to-b from-teal-300 via-cyan-300 to-emerald-400 shadow-2xl">
              <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
                {data?.photoDataUrl ? (
                  <Image
                    src={data.photoDataUrl}
                    alt={data.fullName || 'Profile photo'}
                    fill
                    sizes="208px"
                    priority
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-teal-300/70">No Photo</span>
                )}
                {/* subtle highlight sweep on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.12),transparent)] transition-transform duration-[1200ms] ease-out group-hover:translate-x-[120%]"
                />
                {/* inner radial tint */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 mix-blend-soft-light bg-[radial-gradient(80%_80%_at_50%_0%,rgba(20,184,166,0.25)_0%,transparent_60%)]"
                />
              </div>
            </div>
          </figure>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white drop-shadow-sm">
            {data?.fullName || 'Your Name'} {data?.role ? `| ${data.role}` : ''}
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl text-gray-200">
            {data?.tagline || 'Delivering expertise with precision and insight'}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {data?.cvFileDataUrl && (
              <a
                href={data.cvFileDataUrl}
                download={data.cvFileName ?? 'cv.pdf'}
                className="inline-flex items-center gap-2 rounded-full bg-teal-400 px-6 py-3 font-semibold text-[#0c1616] shadow-lg transition hover:bg-teal-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/60"
              >
                <Download className="h-4 w-4" /> Download CV
              </a>
            )}
            {data?.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-teal-400 px-6 py-3 font-semibold text-teal-300 shadow-lg transition hover:bg-teal-400 hover:text-[#0c1616] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300/60"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      {data?.about && (
        <section id="about" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20" aria-label="About">
          <SectionTitle>About Me</SectionTitle>
          <p className="text-lg leading-relaxed text-justify text-gray-200/90">{data.about}</p>
        </section>
      )}

      {/* SKILLS (single-column) */}
      {skills.length > 0 && (
        <section id="skills" className="scroll-mt-24 bg-[#1a2b2b] px-6 py-20" aria-label="Skills">
          <SectionTitle center>Expertise</SectionTitle>
          <div className="mx-auto max-w-3xl flex flex-col gap-6">
            {skills.map((s, i) => {
              if (!s) return null;
              const Icon = defaultSkillIcons[i % defaultSkillIcons.length];
              return (
                <div
                  key={i}
                  className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl hover:border-teal-300/40"
                >
                  <Icon className="h-7 w-7 text-teal-300" />
                  <p className="font-medium text-gray-100">{s}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* PROJECTS (single-column) */}
      {projects.filter((p) => (p?.name?.trim?.() || p?.description?.trim?.())).length > 0 && (
        <section id="projects" className="mx-auto max-w-3xl scroll-mt-24 px-6 py-20" aria-label="Projects">
          <SectionTitle center>Projects</SectionTitle>
          <div className="flex flex-col gap-6">
            {projects.map((p, i) => {
              const show = Boolean(p?.name?.trim?.() || p?.description?.trim?.());
              if (!show) return null;
              const Icon = defaultProjectIcons[i % defaultProjectIcons.length];
              return (
                <article
                  key={i}
                  className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl hover:border-teal-300/40"
                >
                  <Icon className="h-8 w-8 flex-shrink-0 text-teal-300" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">{p?.name}</h3>
                    {p?.description && <p className="mt-1 text-justify text-gray-200/90">{p.description}</p>}
                    {p?.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-teal-300 underline-offset-4 hover:underline"
                      >
                        <LinkIcon size={16} aria-hidden /> Visit
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* CERTIFICATIONS (cards) */}
      {certifications.length > 0 && (
        <section id="certifications" className="scroll-mt-24 bg-[#1a2b2b] px-6 py-20" aria-label="Certifications">
          <SectionTitle center>Certifications</SectionTitle>
          <div className="mx-auto max-w-3xl flex flex-col gap-4">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg hover:border-teal-300/35"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-300/15 ring-1 ring-teal-300/40">
                  <Award className="h-6 w-6 text-teal-300" />
                </span>
                <p className="text-lg text-gray-100/95">{cert}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="scroll-mt-24 bg-[#1a2b2b] px-6 py-20" aria-label="Contact">
        <SectionTitle center>Contact</SectionTitle>
        <div className="flex flex-wrap justify-center gap-6 text-lg">
          {data?.email && (
            <a
              href={`mailto:${data.email}`}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-gray-100 transition hover:text-teal-300"
            >
              <Mail className="h-5 w-5" /> {data.email}
            </a>
          )}
          {data?.phone && (
            <a
              href={`tel:${data.phone}`}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-gray-100 transition hover:text-teal-300"
            >
              <Phone className="h-5 w-5" /> {data.phone}
            </a>
          )}
        </div>
      </section>

      <footer className="bg-[#0d1a1a] py-6 text-center text-gray-400">
        <p>
          © {new Date().getFullYear()} {data?.fullName || 'Your Name'} | Professional Portfolio
        </p>
      </footer>

      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 0%; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        /* Spinning conic ring around avatar (with Safari support) */
        .avatar-ring::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: conic-gradient(
            from 0deg,
            rgba(20,184,166,0.0) 0deg,
            rgba(20,184,166,0.45) 90deg,
            rgba(6,182,212,0.65) 160deg,
            rgba(34,197,94,0.45) 220deg,
            rgba(20,184,166,0.0) 360deg
          );
          animation: spin 12s linear infinite;
          opacity: 0.9;
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
                  mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-[gradientShift_14s_ease_in_out_infinite] { animation: none !important; }
          .avatar-ring::before { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

function SectionTitle({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <h2
      className={
        'relative mb-10 text-3xl font-bold text-white ' + (center ? 'text-center mx-auto w-fit' : 'inline-block')
      }
    >
      {children}
      <span
        className={
          'absolute -bottom-2 ' +
          (center ? 'left-1/2 -translate-x-1/2' : 'left-0') +
          ' h-1 w-28 bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-400'
        }
        aria-hidden
      />
    </h2>
  );
}

function useScrollSpy(onChange: (id: SectionId) => void) {
  const lastId = useRef<SectionId>('home');
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) {
          const id = visible.target.id as SectionId;
          if (id !== lastId.current) {
            lastId.current = id;
            onChange(id);
          }
        }
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as Element[];
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [onChange]);
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = (e: MediaQueryListEvent) => setReduced(e.matches);
    setReduced(mql.matches);
    mql.addEventListener?.('change', listener);
    return () => mql.removeEventListener?.('change', listener);
  }, []);
  return reduced;
}
