'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Download, Linkedin, Link as LinkIcon,
  Mail, Phone, Menu, X, Award, Briefcase, Code, BookOpen, Lightbulb, Users, BarChart3,
  Database, PieChart, Rocket, Laptop, TrendingUp
} from 'lucide-react';
import type { PortfolioData } from '@/lib/portfolio-types';

const SKILL_ICONS = [Briefcase, BarChart3, Code, BookOpen, Lightbulb, Users];
const PROJ_ICONS  = [Briefcase, Database, PieChart, Rocket, Laptop, TrendingUp] as const;
const SECTIONS = [
  { id:'home', label:'Home' },
  { id:'about', label:'About' },
  { id:'skills', label:'Skills' },
  { id:'projects', label:'Projects' },
  { id:'certifications', label:'Certifications' },
  { id:'contact', label:'Contact' },
] as const;
type SectionId = (typeof SECTIONS)[number]['id'];

export default function ModernPro({ data }: { data: PortfolioData }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<SectionId>('home');
  const prefersReduced = usePrefersReducedMotion();

  const skills = useMemo(() => (Array.isArray(data?.skills) ? data.skills.filter(Boolean) : []), [data]);
  const certs  = useMemo(() => (Array.isArray(data?.certifications) ? data.certifications.filter(Boolean) : []), [data]);
  const projs  = useMemo(() => (Array.isArray(data?.projects) ? data.projects : []), [data]);

  useScrollSpy(setActive);
  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, []);

  const go = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block:'start' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <div className="font-serif text-slate-800 bg-gradient-to-b from-slate-50 to-slate-100 min-h-screen antialiased">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/85 backdrop-blur">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {data?.photoDataUrl ? (
              <span className="relative inline-block h-9 w-9 overflow-hidden rounded-full ring-2 ring-slate-200">
                <Image src={data.photoDataUrl} alt={data.fullName || 'Avatar'} fill sizes="36px" className="object-cover" />
              </span>
            ) : <span aria-hidden className="h-9 w-9 rounded-full bg-slate-200" />}
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-navy-700">{data?.fullName || 'Your Name'}</div>
          </div>

          <div className="hidden md:flex items-center gap-6 font-medium">
            {SECTIONS.map(({ id, label }) => (
              <a key={id} href={`#${id}`} onClick={(e)=>go(e,id)}
                 className={'relative px-1 py-2 transition ' + (active===id
                   ? 'text-navy-700 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:bg-gradient-to-r after:from-teal-500 after:to-emerald-400'
                   : 'text-slate-600 hover:text-navy-700')}>{label}</a>
            ))}
          </div>

          <button aria-label={mobileOpen?'Close menu':'Open menu'} aria-expanded={mobileOpen}
                  onClick={()=>setMobileOpen(v=>!v)}
                  className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300">
            {mobileOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
          </button>
        </nav>
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white/95">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 grid grid-cols-2 gap-3">
              {SECTIONS.map(({ id, label }) => (
                <a key={id} href={`#${id}`} onClick={(e)=>go(e,id)}
                   className={'rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-50 ' + (active===id?'text-navy-700':'text-slate-600')}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative flex min-h-[72vh] items-center justify-center overflow-hidden px-6 text-center scroll-mt-24">
        <div aria-hidden className={
          'pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,#cbd5e1_0%,transparent_60%),radial-gradient(40%_40%_at_80%_10%,#22d3ee33_0%,transparent_70%),radial-gradient(45%_45%_at_20%_5%,#a7f3d033_0%,transparent_70%),linear-gradient(to_bottom,#ffffff,#f1f5f9)] ' +
          (prefersReduced ? '' : 'animate-[gradientShift_14s_ease_in_out_infinite] bg-[length:160%_160%]')
        }/>
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          <figure className="relative mb-6 inline-block rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200">
            <div className="relative h-48 w-48 overflow-hidden rounded-xl">
              {data?.photoDataUrl
                ? <Image src={data.photoDataUrl} alt={data.fullName || 'Profile photo'} fill sizes="192px" priority className="object-cover"/>
                : <span className="absolute inset-0 grid place-items-center text-slate-400">No Photo</span>}
            </div>
          </figure>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-navy-700">
            {data?.fullName || 'Your Name'} {data?.role ? `| ${data.role}` : ''}
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl text-slate-600">{data?.tagline || 'Delivering expertise with precision and insight'}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {data?.cvFileDataUrl && (
              <a href={data.cvFileDataUrl} download={data.cvFileName ?? 'cv.pdf'}
                 className="inline-flex items-center gap-2 rounded-full bg-teal-500 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-teal-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300">
                <Download className="h-4 w-4"/> Download CV
              </a>
            )}
            {data?.linkedin && (
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 rounded-full border border-teal-600 px-6 py-3 font-semibold text-navy-700 shadow-lg transition hover:bg-teal-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-300">
                <Linkedin className="h-4 w-4"/> LinkedIn
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      {data?.about && (
        <section id="about" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20">
          <Title>About Me</Title>
          <p className="text-lg leading-relaxed text-justify text-slate-700">{data.about}</p>
        </section>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <section id="skills" className="scroll-mt-24 bg-white px-6 py-20">
          <Title center>Expertise</Title>
          <div className="mx-auto max-w-3xl flex flex-col gap-5">
            {skills.map((s, i) => {
              const Icon = SKILL_ICONS[i % SKILL_ICONS.length];
              return (
                <div key={i} className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
                  <Icon className="h-7 w-7 text-teal-600"/>
                  <p className="font-medium text-slate-800">{s}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projs.filter(p => (p?.name?.trim?.() || p?.description?.trim?.())).length > 0 && (
        <section id="projects" className="mx-auto max-w-3xl scroll-mt-24 px-6 py-20">
          <Title center>Projects</Title>
          <div className="flex flex-col gap-6">
            {projs.map((p, i) => {
              const show = Boolean(p?.name?.trim?.() || p?.description?.trim?.()); if (!show) return null;
              const Icon = PROJ_ICONS[i % PROJ_ICONS.length];
              return (
                <article key={i} className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition">
                  <Icon className="h-8 w-8 text-teal-600 flex-shrink-0"/>
                  <div>
                    <h3 className="text-xl font-semibold text-navy-700">{p?.name}</h3>
                    {p?.description && <p className="mt-1 text-justify text-slate-600">{p.description}</p>}
                    {p?.link && (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-navy-700 underline-offset-4 hover:underline">
                        <LinkIcon size={16}/> Visit
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
        <section id="certifications" className="scroll-mt-24 bg-white px-6 py-20">
          <Title center>Certifications</Title>
          <div className="mx-auto max-w-3xl flex flex-col gap-4">
            {certs.map((c, idx) => (
              <div key={idx} className="group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50 ring-1 ring-teal-200">
                  <Award className="h-6 w-6 text-teal-600"/>
                </span>
                <p className="text-lg text-slate-800">{c}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="scroll-mt-24 bg-white px-6 py-20">
        <Title center>Contact</Title>
        <div className="flex flex-wrap justify-center gap-6 text-lg">
          {data?.email && <a href={`mailto:${data.email}`} className="inline-flex items-center gap-2 text-navy-700 hover:text-teal-700"><Mail className="h-5 w-5"/>{data.email}</a>}
          {data?.phone && <a href={`tel:${data.phone}`} className="inline-flex items-center gap-2 text-navy-700 hover:text-teal-700"><Phone className="h-5 w-5"/>{data.phone}</a>}
        </div>
      </section>

      <footer className="bg-white py-6 text-center text-slate-500 border-t border-slate-200">
        <p>© {new Date().getFullYear()} {data?.fullName || 'Your Name'} | Professional Portfolio</p>
      </footer>

      <style jsx global>{`
        @keyframes gradientShift{0%{background-position:0% 0%}50%{background-position:100% 50%}100%{background-position:0% 0%}}
      `}</style>
    </div>
  );
}

function Title({ children, center=false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <h2 className={(center?'text-center mx-auto w-fit ':'')+'relative mb-10 text-3xl font-bold text-navy-700'}>
      {children}
      <span className={(center?'left-1/2 -translate-x-1/2 ':'left-0 ')+'absolute -bottom-2 h-1 w-28 bg-gradient-to-r from-teal-500 to-emerald-400'} aria-hidden/>
    </h2>
  );
}

function useScrollSpy(on: (id: SectionId)=>void) {
  const last = useRef<SectionId>('home');
  useEffect(()=>{
    const io = new IntersectionObserver((entries)=>{
      const top = entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      const id = (top?.target?.id || '') as SectionId;
      if(id && id!==last.current){ last.current=id; on(id); }
    }, { rootMargin:'-40% 0px -50% 0px', threshold:[0, .25, .5, .75, 1] });
    const els = ['home','about','skills','projects','certifications','contact'].map(i=>document.getElementById(i)).filter(Boolean) as Element[];
    els.forEach(el=>io.observe(el));
    return ()=>io.disconnect();
  },[on]);
}
function usePrefersReducedMotion() {
  const [reduced, set] = useState(false);
  useEffect(()=>{
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    set(m.matches);
    const fn = (e: MediaQueryListEvent)=>set(e.matches);
    m.addEventListener?.('change', fn);
    return ()=>m.removeEventListener?.('change', fn);
  },[]);
  return reduced;
}
