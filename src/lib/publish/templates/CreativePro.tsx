'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Download, Linkedin, Link as LinkIcon, Mail, Phone, Menu, X, Award, Palette } from 'lucide-react';
import type { PortfolioData } from '@/lib/portfolio-types';

const SECTIONS = [
  { id:'home', label:'Home' },
  { id:'about', label:'About' },
  { id:'skills', label:'Skills' },
  { id:'projects', label:'Projects' },
  { id:'certifications', label:'Certifications' },
  { id:'contact', label:'Contact' },
] as const;
type SectionId = (typeof SECTIONS)[number]['id'];

export default function CreativePro({ data }: { data: PortfolioData }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<SectionId>('home');
  const prefersReduced = usePrefersReducedMotion();

  const skills = useMemo(()=>Array.isArray(data?.skills)?data!.skills.filter(Boolean):[],[data]);
  const projects = useMemo(()=>Array.isArray(data?.projects)?data!.projects.filter(p=>p && ((p.name && p.name.trim()) || (p.description && p.description.trim()))):[],[data]);
  const certs = useMemo(()=>Array.isArray(data?.certifications)?data!.certifications.filter(Boolean):[],[data]);

  useScrollSpy(setActive);
  useEffect(()=>{ const close=()=>setMobileOpen(false); window.addEventListener('hashchange',close); return ()=>window.removeEventListener('hashchange',close);},[]);
  const go=(e:React.MouseEvent<HTMLAnchorElement>, id:string)=>{ e.preventDefault(); document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'}); history.replaceState(null,'',`#${id}`); };

  return (
    <div className="font-sans bg-gradient-to-tr from-[#0d0b1e] via-[#191234] to-[#231143] text-white min-h-screen antialiased">
      {/* NAV */}
      <header className="sticky top-0 z-50 bg-[#120e26]/80 backdrop-blur border-b border-white/10">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {data?.photoDataUrl ? (
              <span className="relative inline-block h-9 w-9 overflow-hidden rounded-xl ring-2 ring-fuchsia-400/70">
                <Image src={data.photoDataUrl} alt={data.fullName || 'Avatar'} fill sizes="36px" className="object-cover"/>
              </span>
            ) : <span aria-hidden className="h-9 w-9 rounded-xl bg-white/10 ring-2 ring-fuchsia-400/40" />}
            <div className="text-xl sm:text-2xl font-bold tracking-tight text-fuchsia-300">{data?.fullName || 'Your Name'}</div>
          </div>

          <div className="hidden md:flex items-center gap-6 font-medium">
            {SECTIONS.map(({id,label})=>(
              <a key={id} href={`#${id}`} onClick={(e)=>go(e,id)}
                 className={'relative px-1 py-2 transition ' + (active===id
                   ? 'text-fuchsia-300 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-[2px] after:bg-gradient-to-r after:from-fuchsia-300 after:to-cyan-300'
                   : 'text-pink-200/80 hover:text-fuchsia-300')}>{label}</a>
            ))}
          </div>

          <button aria-label="menu" onClick={()=>setMobileOpen(v=>!v)}
                  className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 hover:bg-white/5">
            {mobileOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
          </button>
        </nav>
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#120e26]/95">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 grid grid-cols-2 gap-3">
              {SECTIONS.map(({id,label})=>(
                <a key={id} href={`#${id}`} onClick={(e)=>go(e,id)}
                   className={'rounded-md px-3 py-2 text-sm font-medium ring-1 ring-white/10 hover:bg-white/5 ' + (active===id?'text-fuchsia-300':'text-pink-100/90')}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative flex min-h-[78vh] items-center justify-center px-6 text-center scroll-mt-24 overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] bg-[repeating-linear-gradient(90deg,transparent_0,transparent_28px,rgba(255,255,255,0.16)_29px,transparent_30px)]"/>
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(80%_50%_at_50%_0%,rgba(255,0,204,0.20)_0%,transparent_60%)]"/>
        <div className="mx-auto max-w-3xl">
          <figure className="group relative w-fit mx-auto mb-6">
            {!prefersReduced && <span aria-hidden className="avatar-ring absolute inset-[-12px] rounded-[28px]" />}
            <div className="relative h-36 w-36 md:h-40 md:w-40 rounded-[28px] p-[3px] bg-gradient-to-b from-fuchsia-400 via-pink-400 to-cyan-300 shadow-2xl">
              <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
                {data?.photoDataUrl
                  ? <Image src={data.photoDataUrl} alt={data.fullName || 'Avatar'} fill sizes="160px" priority className="object-cover"/>
                  : <span className="absolute inset-0 grid place-items-center text-pink-200/80">No Photo</span>}
                <span aria-hidden className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.14),transparent)] transition-transform duration-[1200ms] ease-out group-hover:translate-x-[120%]"/>
              </div>
            </div>
          </figure>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{data?.fullName || 'Your Name'}</h1>
          <p className="text-xl text-pink-200 mt-1">{data?.role || 'Creative Professional'}</p>
          <p className="text-sm text-pink-100 mt-2 text-justify">{data?.tagline || 'Thoughtful, striking, memorable.'}</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {data?.cvFileDataUrl && (
              <a href={data.cvFileDataUrl} download={data.cvFileName ?? 'cv.pdf'}
                 className="inline-flex items-center gap-2 rounded-full bg-pink-300 px-5 py-2 font-semibold text-gray-900 shadow-md hover:brightness-110">
                <Download className="h-4 w-4"/> Download CV
              </a>
            )}
            {data?.linkedin && (
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 rounded-full border border-pink-300 px-5 py-2 font-semibold text-pink-300 hover:bg-pink-300 hover:text-gray-900">
                <Linkedin className="h-4 w-4"/> LinkedIn
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      {data?.about && (
        <section id="about" className="max-w-4xl mx-auto px-6 py-8 scroll-mt-24">
          <H2><Palette className="h-5 w-5 mr-2"/>About Me</H2>
          <Card><p className="text-pink-100 leading-relaxed text-justify">{data.about}</p></Card>
        </section>
      )}

      {/* SKILLS */}
      {skills.length>0 && (
        <section id="skills" className="max-w-4xl mx-auto px-6 py-8 scroll-mt-24">
          <H2><Palette className="h-5 w-5 mr-2"/>Skills</H2>
          <div className="grid grid-cols-1 gap-3">
            {skills.map((s,i)=>(
              <div key={i} className="flex items-center justify-between rounded-lg bg-fuchsia-900/25 p-3 ring-1 ring-white/10 hover:ring-pink-300/40 transition">
                <span className="text-sm text-pink-100 text-justify">{s}</span>
                <span className="h-2 w-2 rounded-full bg-pink-300"/>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects.length>0 && (
        <section id="projects" className="max-w-4xl mx-auto px-6 py-8 scroll-mt-24">
          <H2><Palette className="h-5 w-5 mr-2"/>Projects</H2>
          <div className="flex flex-col gap-4">
            {projects.map((p,i)=>(
              <Card key={i}>
                <h3 className="text-xl font-medium">{p.name?.trim() || `Project ${i+1}`}</h3>
                {p.description?.trim() && <p className="text-pink-100 mt-2 text-justify">{p.description}</p>}
                {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-pink-300 hover:underline mt-3"><LinkIcon size={16}/> View</a>}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* CERTS */}
      {certs.length>0 && (
        <section id="certifications" className="max-w-4xl mx-auto px-6 py-8 scroll-mt-24">
          <H2><Palette className="h-5 w-5 mr-2"/>Certifications</H2>
          <div className="flex flex-col gap-3">
            {certs.map((c,i)=>(
              <div key={i} className="flex items-center gap-3 rounded-lg bg-purple-950/40 p-3 ring-1 ring-white/10">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-pink-300/20 ring-1 ring-pink-300/40">
                  <Award className="h-6 w-6 text-pink-300"/>
                </span>
                <p className="text-pink-100">{c}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="max-w-4xl mx-auto px-6 py-8 scroll-mt-24">
        <H2><Mail className="h-5 w-5 mr-2"/>Contact</H2>
        <Card>
          <div className="space-y-2">
            {data?.email && <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:text-pink-300"><Mail size={16}/>{data.email}</a>}
            {data?.phone && <a href={`tel:${data.phone}`} className="flex items-center gap-2 hover:text-pink-300"><Phone size={16}/>{data.phone}</a>}
            {data?.linkedin && <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-pink-300 hover:underline"><Linkedin size={16}/>LinkedIn</a>}
          </div>
        </Card>
      </section>

      <footer className="bg-[#130a22] py-4 text-center text-pink-200/70">
        <p>© {new Date().getFullYear()} {data?.fullName || 'Your Name'} | Creative Portfolio</p>
      </footer>

      <style jsx global>{`
        @keyframes spin360{to{transform:rotate(360deg)}}
        .avatar-ring::before{
          content:'';position:absolute;inset:0;border-radius:inherit;opacity:.9;
          background:conic-gradient(from 0deg,rgba(255,0,204,0.00) 0deg,rgba(255,0,204,0.45) 80deg,rgba(0,207,255,0.70) 160deg,rgba(168,85,247,0.55) 240deg,rgba(255,0,204,0.00) 360deg);
          animation:spin360 18s linear infinite;
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0); mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
        }
        @media (prefers-reduced-motion: reduce){ .avatar-ring::before{ animation:none!important } }
      `}</style>
    </div>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-semibold text-pink-200 mb-3 flex items-center">{children}</h2>
  );
}
function Card({ children }: { children: React.ReactNode }) {
  return <section className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm hover:shadow-md transition">{children}</section>;
}

function useScrollSpy(on:(id:SectionId)=>void){
  const last=useRef<SectionId>('home');
  useEffect(()=>{
    const io=new IntersectionObserver((es)=>{
      const v=es.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      const id=(v?.target?.id||'') as SectionId; if(id&&id!==last.current){ last.current=id; on(id); }
    },{rootMargin:'-40% 0px -50% 0px',threshold:[0,.25,.5,.75,1]});
    const els=SECTIONS.map(s=>document.getElementById(s.id)).filter(Boolean) as Element[]; els.forEach(el=>io.observe(el));
    return ()=>io.disconnect();
  },[on]);
}
function usePrefersReducedMotion(){const[r,s]=useState(false);useEffect(()=>{const m=window.matchMedia('(prefers-reduced-motion: reduce)');s(m.matches);const f=(e:MediaQueryListEvent)=>s(e.matches);m.addEventListener?.('change',f);return()=>m.removeEventListener?.('change',f)},[]);return r;}
