'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Download, Linkedin, Link as LinkIcon, Mail, Phone, Menu, X, Award,
  Briefcase, BarChart3, Code, BookOpen, Lightbulb, Users,
  Database, PieChart, Rocket, Laptop, TrendingUp
} from 'lucide-react';
import type { PortfolioData } from '@/lib/portfolio-types';

/** Section map */
const SECTIONS = [
  { id: 'home',            label: 'Home' },
  { id: 'about',           label: 'About' },
  { id: 'skills',          label: 'Skills' },
  { id: 'projects',        label: 'Projects' },
  { id: 'certifications',  label: 'Certifications' },
  { id: 'contact',         label: 'Contact' },
] as const;
type SectionId = (typeof SECTIONS)[number]['id'];

/** Icon cycles */
const SKILL_ICONS = [Briefcase, BarChart3, Code, BookOpen, Lightbulb, Users] as const;
const PROJ_ICONS  = [Briefcase, Database, PieChart, Rocket, Laptop, TrendingUp] as const;

export default function ClassicProLeft({ data }: { data: PortfolioData }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<SectionId>('home');
  const prefersReduced = usePrefersReducedMotion();
  useScrollSpy(setActive);

  // Safe data
  const skills = useMemo(() => Array.isArray(data?.skills) ? data!.skills.filter(Boolean) : [], [data]);
  const projects = useMemo(
    () => Array.isArray(data?.projects) ? data!.projects.filter(p => p && ((p.name && p.name.trim()) || (p.description && p.description.trim()))) : [],
    [data]
  );
  const certs = useMemo(() => Array.isArray(data?.certifications) ? data!.certifications.filter(Boolean) : [], [data]);

  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, []);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="font-serif bg-gradient-to-b from-[#0f1a1a] to-[#1b2b2b] text-gray-100 min-h-screen antialiased">
      {/* ===== Mobile top bar (sidebar collapses) ===== */}
      <header className="lg:hidden sticky top-0 z-50 border-b border-white/10 bg-[#0d1a1a]/90 backdrop-blur">
        <nav className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {data?.photoDataUrl ? (
              <span className="relative inline-block h-9 w-9 overflow-hidden rounded-full ring-2 ring-teal-400/80">
                <Image src={data.photoDataUrl} alt={data.fullName || 'Avatar'} fill sizes="36px" className="object-cover" />
              </span>
            ) : <span aria-hidden className="h-9 w-9 rounded-full bg-white/10 ring-2 ring-teal-400/40" />}
            <div className="text-xl font-bold text-teal-300">{data?.fullName || 'Your Name'}</div>
          </div>
          <button
            aria-label="Menu"
            onClick={() => setMobileOpen(v => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 hover:bg-white/5"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
        {mobileOpen && (
          <div className="border-t border-white/10 bg-[#0d1a1a]">
            <div className="max-w-6xl mx-auto px-4 py-3 grid grid-cols-2 gap-3">
              {SECTIONS.map(({ id, label }) => (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => go(e, id)}
                  className={'rounded-md px-3 py-2 text-sm font-medium ring-1 ring-inset ring-white/10 hover:bg-white/5 ' + (active === id ? 'text-teal-300' : 'text-gray-200')}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* ===== Desktop layout: fixed left sidebar + scrollable main ===== */}
      <div className="mx-auto lg:grid lg:grid-cols-[22rem_1fr] max-w-[1440px]">
        {/* Sidebar (hidden on mobile) */}
        <aside className="hidden lg:block sticky top-0 h-screen border-r border-white/10 bg-[#0d1a1a]/95 backdrop-blur px-6 py-8">
          <div className="flex flex-col h-full">
            {/* Profile */}
            <div>
              <figure className="group relative w-fit">
                {!prefersReduced && <span aria-hidden className="avatar-ring absolute inset-[-10px] rounded-[28px]" />}
                <div className="relative h-28 w-28 rounded-[28px] p-[3px] bg-gradient-to-b from-teal-300 via-cyan-300 to-emerald-400 shadow-2xl">
                  <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
                    {data?.photoDataUrl ? (
                      <Image src={data.photoDataUrl} alt={data.fullName || 'Profile photo'} fill sizes="112px" priority className="object-cover" />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center text-teal-300/70">No Photo</span>
                    )}
                    <span aria-hidden className="pointer-events-none absolute inset-0 mix-blend-soft-light bg-[radial-gradient(80%_80%_at_50%_0%,rgba(20,184,166,0.25)_0%,transparent_60%)]" />
                  </div>
                </div>
              </figure>

              <div className="mt-4">
                <h1 className="text-2xl font-extrabold tracking-tight text-white">{data?.fullName || 'Your Name'}</h1>
                <p className="text-teal-300/90">{data?.role || 'Professional'}</p>
                {data?.tagline && <p className="mt-2 text-sm text-gray-300/90">{data.tagline}</p>}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {data?.cvFileDataUrl && (
                  <a
                    href={data.cvFileDataUrl}
                    download={data.cvFileName ?? 'cv.pdf'}
                    className="inline-flex items-center gap-2 rounded-full bg-teal-400 px-4 py-2 text-sm font-semibold text-[#0c1616] shadow hover:bg-teal-300"
                  >
                    <Download className="h-4 w-4" /> CV
                  </a>
                )}
                {data?.linkedin && (
                  <a
                    href={data.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-teal-400 px-4 py-2 text-sm font-semibold text-teal-300 hover:bg-teal-400 hover:text-[#0c1616]"
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                )}
              </div>
            </div>

            {/* Nav */}
            <nav aria-label="Section" className="mt-8">
              <ul className="space-y-1">
                {SECTIONS.map(({ id, label }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      onClick={(e) => go(e, id)}
                      className={
                        'group flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition ' +
                        (active === id
                          ? 'bg-white/5 ring-1 ring-teal-300/40 text-teal-300'
                          : 'text-gray-200 hover:bg-white/5 hover:text-teal-300')
                      }
                    >
                      <span className={'h-1.5 w-1.5 rounded-full ' + (active === id ? 'bg-teal-300' : 'bg-white/20')} aria-hidden />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Contact quick links */}
            <div className="mt-auto pt-8 border-t border-white/10">
              <div className="space-y-2 text-sm">
                {data?.email && (
                  <a href={`mailto:${data.email}`} className="flex items-center gap-2 text-gray-200 hover:text-teal-300">
                    <Mail className="h-4 w-4" /> {data.email}
                  </a>
                )}
                {data?.phone && (
                  <a href={`tel:${data.phone}`} className="flex items-center gap-2 text-gray-200 hover:text-teal-300">
                    <Phone className="h-4 w-4" /> {data.phone}
                  </a>
                )}
              </div>
              <p className="mt-6 text-xs text-gray-400">© {new Date().getFullYear()} {data?.fullName || 'Your Name'}</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-h-screen">
          {/* HERO (still present for hash/spy + mobile) */}
          <section
            id="home"
            className="relative flex min-h-[48vh] items-center justify-center overflow-hidden px-6 text-center scroll-mt-24"
          >
            <div
              aria-hidden
              className={
                'pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,#1a3a3a_0%,transparent_60%),radial-gradient(40%_40%_at_80%_10%,#14b8a633_0%,transparent_70%),linear-gradient(to_bottom,#0d1a1a,#1a2f2f)] ' +
                (prefersReduced ? '' : 'animate-[gradientShift_14s_ease_in_out_infinite] bg-[length:160%_160%]')
              }
            />
            <div className="mx-auto max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                {data?.fullName || 'Your Name'} {data?.role ? `| ${data.role}` : ''}
              </h2>
              <p className="mt-3 text-lg text-gray-200">
                {data?.tagline || 'Delivering expertise with precision and insight'}
              </p>
            </div>
          </section>

          {/* ABOUT */}
          {data?.about && (
            <section id="about" className="scroll-mt-24 px-6 md:px-10 lg:px-14 py-10">
              <SectionTitle>About Me</SectionTitle>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-sm">
                <p className="text-gray-200/95 leading-relaxed text-justify">
                  {data.about}
                </p>
              </div>
            </section>
          )}

          {/* SKILLS */}
          {skills.length > 0 && (
            <section id="skills" className="scroll-mt-24 px-6 md:px-10 lg:px-14 py-10">
              <SectionTitle center>Expertise</SectionTitle>
              <div className="mx-auto max-w-3xl flex flex-col gap-4">
                {skills.map((s, i) => {
                  const Icon = SKILL_ICONS[i % SKILL_ICONS.length];
                  return (
                    <div
                      key={i}
                      className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-teal-300/35"
                    >
                      <Icon className="h-6 w-6 text-teal-300" />
                      <p className="font-medium text-gray-100">{s}</p>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* PROJECTS */}
          {projects.length > 0 && (
            <section id="projects" className="scroll-mt-24 px-6 md:px-10 lg:px-14 py-10">
              <SectionTitle center>Projects</SectionTitle>
              <div className="mx-auto max-w-3xl flex flex-col gap-6">
                {projects.map((p, i) => {
                  const Icon = PROJ_ICONS[i % PROJ_ICONS.length];
                  return (
                    <article
                      key={i}
                      className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-teal-300/35"
                    >
                      <Icon className="h-7 w-7 text-teal-300 flex-shrink-0" />
                      <div>
                        <h3 className="text-xl font-semibold text-white">{p.name?.trim() || `Project ${i + 1}`}</h3>
                        {p.description?.trim() && (
                          <p className="mt-1 text-justify text-gray-200/90">{p.description}</p>
                        )}
                        {p.link && (
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

          {/* CERTIFICATIONS */}
          {certs.length > 0 && (
            <section id="certifications" className="scroll-mt-24 px-6 md:px-10 lg:px-14 py-10">
              <SectionTitle center>Certifications</SectionTitle>
              <div className="mx-auto max-w-3xl flex flex-col gap-3">
                {certs.map((c, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 shadow-sm hover:shadow-md transition hover:border-teal-300/35"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-300/15 ring-1 ring-teal-300/40">
                      <Award className="h-6 w-6 text-teal-300" />
                    </span>
                    <p className="text-gray-100/95">{c}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CONTACT */}
          <section id="contact" className="scroll-mt-24 px-6 md:px-10 lg:px-14 py-10">
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

          <footer className="px-6 md:px-10 lg:px-14 py-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} {data?.fullName || 'Your Name'} | Classic Left Portfolio</p>
          </footer>
        </main>
      </div>

      {/* Global helpers */}
      <style jsx global>{`
        @keyframes gradientShift { 0%{background-position:0% 0%} 50%{background-position:100% 50%} 100%{background-position:0% 0%} }
        @keyframes spin { to { transform: rotate(360deg); } }
        .avatar-ring::before{
          content:'';
          position:absolute; inset:0; border-radius:inherit; opacity:.9;
          background:conic-gradient(
            from 0deg,
            rgba(20,184,166,0.0) 0deg,
            rgba(20,184,166,0.45) 90deg,
            rgba(6,182,212,0.65) 160deg,
            rgba(34,197,94,0.45) 220deg,
            rgba(20,184,166,0.0) 360deg
          );
          animation: spin 14s linear infinite;
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
                  mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
        }
        @media (prefers-reduced-motion: reduce){
          .animate-[gradientShift_14s_ease_in_out_infinite]{ animation: none !important; }
          .avatar-ring::before{ animation: none !important; }
        }
      `}</style>
    </div>
  );
}

/* ===== Subcomponents & hooks ===== */
function SectionTitle({ children, center=false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <h2 className={(center?'text-center mx-auto w-fit ':'')+'relative mb-8 text-3xl font-bold text-white'}>
      {children}
      <span
        className={(center?'left-1/2 -translate-x-1/2 ':'left-0 ')+'absolute -bottom-2 h-1 w-28 bg-gradient-to-r from-teal-300 via-cyan-300 to-emerald-400'}
        aria-hidden
      />
    </h2>
  );
}

function useScrollSpy(onChange: (id: SectionId) => void) {
  const lastId = useRef<SectionId>('home');
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      const id = (visible?.target?.id || '') as SectionId;
      if (id && id !== lastId.current) {
        lastId.current = id;
        onChange(id);
      }
    }, { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] });

    const els = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean) as Element[];
    els.forEach(el => observer.observe(el));
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
