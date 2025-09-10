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
} from 'lucide-react';
import type { PortfolioData } from '@/lib/portfolio-types';

/**
 * Brand palette (blue-forward, accessible)
 * --brand-50  : #eff6ff
 * --brand-100 : #dbeafe
 * --brand-200 : #bfdbfe
 * --brand-300 : #93c5fd
 * --brand-400 : #60a5fa
 * --brand-500 : #3b82f6
 * --brand-600 : #2563eb  (primary)
 * --brand-700 : #1d4ed8
 * --brand-800 : #1e40af
 * --brand-900 : #1e3a8a
 * --accent-1  : #22d3ee  (subtle cyan for gradients)
 */

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
    <div className="font-serif bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800 min-h-screen antialiased">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 backdrop-blur bg-white/85 shadow-sm border-b border-slate-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between" aria-label="Primary">
          <div className="flex items-center gap-3">
            {data?.photoDataUrl ? (
              <span className="relative inline-block h-8 w-8 overflow-hidden rounded-full ring-2 ring-[var(--brand-300)]">
                <Image src={data.photoDataUrl} alt={data.fullName || 'Avatar'} fill sizes="32px" className="object-cover" />
              </span>
            ) : (
              <span aria-hidden className="h-8 w-8 rounded-full bg-slate-200" />
            )}
            <div className="text-xl sm:text-2xl font-bold text-[var(--brand-700)] tracking-tight">
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
                    ? 'text-[var(--brand-700)] after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-gradient-to-r after:from-[var(--brand-500)] after:to-[var(--accent-1)]'
                    : 'text-slate-600 hover:text-[var(--brand-700)] focus-visible:text-[var(--brand-700)]')
                }
              >
                {label}
              </a>
            ))}
          </div>

          <button
            className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-300)]"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 grid grid-cols-2 gap-3">
              {SECTIONS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => handleAnchorClick(e, id)}
                  className={
                    'rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-50 ' +
                    (active === id ? 'text-[var(--brand-700)]' : 'text-slate-600')
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
        className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 text-center scroll-mt-24"
        aria-label="Hero"
      >
        <div
          aria-hidden
          className={
            'pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,#cbd5e1_0%,transparent_60%),radial-gradient(40%_40%_at_80%_10%,#2563eb33_0%,transparent_70%),radial-gradient(45%_45%_at_20%_5%,#22d3ee33_0%,transparent_70%),linear-gradient(to_bottom,#ffffff,#f1f5f9)] ' +
            (prefersReducedMotion ? '' : 'animate-[gradientShift_14s_ease_in_out_infinite] bg-[length:160%_160%]')
          }
        />
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          {data?.photoDataUrl ? (
            <figure className="relative mb-6 inline-block rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200">
              <div className="relative h-48 w-48 overflow-hidden rounded-xl">
                <Image
                  src={data.photoDataUrl}
                  alt={data.fullName || 'Profile photo'}
                  fill
                  sizes="192px"
                  priority
                  className="object-cover"
                />
              </div>
              {data?.fullName && <figcaption className="mt-2 text-sm text-slate-500">{data.fullName}</figcaption>}
            </figure>
          ) : (
            <span className="mb-6 inline-block h-48 w-48 rounded-xl bg-slate-200" />
          )}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--brand-700)]">
            {data?.fullName || 'Your Name'} {data?.role ? `| ${data.role}` : ''}
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl text-slate-600">
            {data?.tagline || 'Delivering expertise with precision and insight'}
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {data?.cvFileDataUrl && (
              <a
                href={data.cvFileDataUrl}
                download={data.cvFileName ?? 'cv.pdf'}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-600)] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-[var(--brand-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-300)]"
              >
                <Download className="h-4 w-4" /> Download CV
              </a>
            )}
            {data?.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-600)] px-6 py-3 font-semibold text-[var(--brand-700)] shadow-lg transition hover:bg-[var(--brand-600)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-300)]"
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
          <p className="text-lg leading-relaxed text-justify text-slate-600/90">{data.about}</p>
        </section>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <section id="skills" className="scroll-mt-24 bg-white px-6 py-20" aria-label="Skills">
          <SectionTitle center>Expertise</SectionTitle>
          <div className="mx-auto max-w-3xl flex flex-col gap-6">
            {skills.map((s, i) => {
              if (!s) return null;
              const Icon = defaultSkillIcons[i % defaultSkillIcons.length];
              return (
                <div
                  key={i}
                  className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:ring-1 hover:ring-[var(--brand-300)]"
                >
                  <Icon className="h-7 w-7 text-[var(--brand-600)]" />
                  <p className="font-medium text-slate-800">{s}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* PROJECTS */}
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
                  className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:ring-1 hover:ring-[var(--brand-200)]"
                >
                  <Icon className="h-8 w-8 flex-shrink-0 text-[var(--brand-600)]" />
                  <div>
                    <h3 className="text-xl font-semibold text-[var(--brand-700)]">{p?.name}</h3>
                    {p?.description && <p className="mt-1 text-justify text-slate-600">{p.description}</p>}
                    {p?.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-flex items-center gap-1 text-[var(--brand-700)] underline-offset-4 hover:underline"
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

      {/* CERTIFICATIONS */}
      {certifications.length > 0 && (
        <section id="certifications" className="scroll-mt-24 bg-white px-6 py-20" aria-label="Certifications">
          <SectionTitle center>Certifications</SectionTitle>
          <div className="mx-auto max-w-3xl flex flex-col gap-4">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-50)] ring-1 ring-[var(--brand-200)]">
                  {/* award icon via lucide-like svg */}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-6 w-6 text-[var(--brand-800)]">
                    <circle cx="12" cy="10" r="5" />
                    <path d="M8 21v-3.5a6.97 6.97 0 0 0 8 0V21l-4-2Z" />
                  </svg>
                </span>
                <p className="pt-1 text-lg text-slate-800">{cert}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="scroll-mt-24 bg-white px-6 py-20" aria-label="Contact">
        <SectionTitle center>Contact</SectionTitle>
        <div className="flex flex-wrap justify-center gap-6 text-lg">
          {data?.email && (
            <a
              href={`mailto:${data.email}`}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-[var(--brand-700)] transition hover:text-[var(--brand-800)]"
            >
              <Mail className="h-5 w-5" /> {data.email}
            </a>
          )}
          {data?.phone && (
            <a
              href={`tel:${data.phone}`}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-[var(--brand-700)] transition hover:text-[var(--brand-800)]"
            >
              <Phone className="h-5 w-5" /> {data.phone}
            </a>
          )}
        </div>
      </section>

      <footer className="bg-white py-6 text-center text-slate-500 border-t border-slate-200">
        <p>© {new Date().getFullYear()} {data?.fullName || 'Your Name'} | Professional Portfolio</p>
      </footer>

      <style jsx global>{`
        :root{
          --brand-50:#eff6ff; --brand-100:#dbeafe; --brand-200:#bfdbfe; --brand-300:#93c5fd; --brand-400:#60a5fa;
          --brand-500:#3b82f6; --brand-600:#2563eb; --brand-700:#1d4ed8; --brand-800:#1e40af; --brand-900:#1e3a8a;
          --accent-1:#22d3ee;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 0%; }
        }

        /* Optional subtle brand glow helpers (kept tasteful) */
        .neon {
          text-shadow: 0 0 10px rgba(37,99,235,.35), 0 0 22px rgba(34,211,238,.25);
          filter: drop-shadow(0 0 .2rem rgba(37,99,235,.35));
        }
        .neon-ring {
          box-shadow: 0 0 12px rgba(37,99,235,.25), 0 0 28px rgba(34,211,238,.2);
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-[gradientShift_14s_ease_in_out_infinite]{ animation: none !important; }
          .neon{ text-shadow: none !important; filter: none !important; }
        }
      `}</style>
    </div>
  );
}

function SectionTitle({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <h2
      className={
        'relative mb-10 text-3xl font-bold text-[var(--brand-700)] ' +
        (center ? 'text-center mx-auto w-fit' : 'inline-block')
      }
    >
      {children}
      <span
        className={
          (center ? 'left-1/2 -translate-x-1/2 ' : 'left-0 ') +
          'absolute -bottom-2 h-1 w-28 bg-gradient-to-r from-[var(--brand-500)] to-[var(--accent-1)]'
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
