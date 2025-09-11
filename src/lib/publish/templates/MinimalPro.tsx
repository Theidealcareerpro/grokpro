'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Download, Linkedin, Link as LinkIcon, Mail, Phone, Menu, X, Award } from 'lucide-react';
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

export default function MinimalPro({ data }: { data: PortfolioData }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<SectionId>('home');

  const skills = useMemo(()=>Array.isArray(data?.skills)?data!.skills.filter(Boolean):[],[data]);
  const projects = useMemo(()=>Array.isArray(data?.projects)?data!.projects.filter(p=>p && ((p.name && p.name.trim()) || (p.description && p.description.trim()))):[],[data]);
  const certs = useMemo(()=>Array.isArray(data?.certifications)?data!.certifications.filter(Boolean):[],[data]);

  useScrollSpy(setActive);
  const go=(e:React.MouseEvent<HTMLAnchorElement>, id:string)=>{ e.preventDefault(); document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); history.replaceState(null,'',`#${id}`); };

  return (
    <div className="font-serif bg-white text-gray-800 min-h-screen">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {data?.photoDataUrl ? (
              <span className="relative inline-block h-8 w-8 overflow-hidden rounded-full ring-2 ring-slate-200">
                <Image src={data.photoDataUrl} alt={data.fullName || 'Avatar'} fill sizes="32px" className="object-cover"/>
              </span>
            ) : <span aria-hidden className="h-8 w-8 rounded-full bg-slate-200" />}
            <div className="text-xl sm:text-2xl font-bold tracking-tight">{data?.fullName || 'Your Name'}</div>
          </div>

          <div className="hidden md:flex items-center gap-6 font-medium">
            {SECTIONS.map(({id,label})=>(
              <a key={id} href={`#${id}`} onClick={(e)=>go(e,id)}
                 className={'px-1 py-2 ' + (active===id?'text-gray-900':'text-gray-500 hover:text-gray-900')}>{label}</a>
            ))}
          </div>

          <button onClick={()=>setMobileOpen(v=>!v)} className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 hover:bg-slate-50">
            {mobileOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
          </button>
        </nav>
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 grid grid-cols-2 gap-3">
              {SECTIONS.map(({id,label})=>(
                <a key={id} href={`#${id}`} onClick={(e)=>go(e,id)}
                   className={'rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-50 ' + (active===id?'text-gray-900':'text-gray-600')}>{label}</a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="min-h-[64vh] flex items-center justify-center px-6 text-center">
        <div className="mx-auto max-w-3xl">
          <figure className="mb-6">
            <div className="relative h-40 w-40 mx-auto overflow-hidden rounded-2xl ring-1 ring-slate-200">
              {data?.photoDataUrl
                ? <Image src={data.photoDataUrl} alt={data.fullName || 'Profile photo'} fill sizes="160px" className="object-cover"/>
                : <span className="absolute inset-0 grid place-items-center text-slate-400">No Photo</span>}
            </div>
          </figure>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{data?.fullName || 'Your Name'} {data?.role ? `| ${data.role}` : ''}</h1>
          <p className="mt-4 text-lg text-slate-600">{data?.tagline || 'Focused. Minimal. Effective.'}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {data?.cvFileDataUrl && (
              <a href={data.cvFileDataUrl} download={data.cvFileName ?? 'cv.pdf'}
                 className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-800">
                <Download className="h-4 w-4"/> Download CV
              </a>
            )}
            {data?.linkedin && (
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 rounded-full border border-gray-900 px-6 py-3 font-semibold text-gray-900 hover:bg-gray-900 hover:text-white">
                <Linkedin className="h-4 w-4"/> LinkedIn
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      {data?.about && (
        <section id="about" className="max-w-4xl mx-auto px-6 py-14">
          <H2>About</H2>
          <p className="text-lg leading-relaxed text-justify text-slate-700">{data.about}</p>
        </section>
      )}

      {/* SKILLS */}
      {skills.length>0 && (
        <section id="skills" className="bg-slate-50 px-6 py-14">
          <div className="max-w-3xl mx-auto">
            <H2 center>Skills</H2>
            <div className="flex flex-col gap-4">
              {skills.map((s,i)=>(
                <div key={i} className="flex items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200 hover:-translate-y-0.5 hover:shadow-sm transition">
                  <span className="h-2 w-2 rounded-full bg-gray-900" aria-hidden/>
                  <p className="text-slate-800">{s}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects.length>0 && (
        <section id="projects" className="max-w-3xl mx-auto px-6 py-14">
          <H2 center>Projects</H2>
          <div className="flex flex-col gap-5">
            {projects.map((p,i)=>(
              <article key={i} className="rounded-xl bg-white p-5 ring-1 ring-slate-200 hover:shadow-sm transition">
                <h3 className="text-xl font-semibold text-gray-900">{p.name?.trim() || `Project ${i+1}`}</h3>
                {p.description?.trim() && <p className="mt-1 text-justify text-slate-600">{p.description}</p>}
                {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-gray-900 underline-offset-4 hover:underline"><LinkIcon size={16}/>Visit</a>}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CERTS */}
      {certs.length>0 && (
        <section id="certifications" className="bg-slate-50 px-6 py-14">
          <div className="max-w-3xl mx-auto">
            <H2 center>Certifications</H2>
            <div className="flex flex-col gap-3">
              {certs.map((c,i)=>(
                <div key={i} className="flex items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200">
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-100 ring-1 ring-slate-200">
                    <Award className="h-5 w-5 text-gray-900"/>
                  </span>
                  <p className="text-slate-800">{c}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="bg-slate-50 px-6 py-14">
        <div className="max-w-3xl mx-auto text-center">
          <H2 center>Contact</H2>
          <div className="flex flex-wrap justify-center gap-6 text-lg">
            {data?.email && <a href={`mailto:${data.email}`} className="inline-flex items-center gap-2 text-gray-900 hover:opacity-80"><Mail className="h-5 w-5"/>{data.email}</a>}
            {data?.phone && <a href={`tel:${data.phone}`} className="inline-flex items-center gap-2 text-gray-900 hover:opacity-80"><Phone className="h-5 w-5"/>{data.phone}</a>}
          </div>
        </div>
      </section>

      <footer className="bg-white py-6 text-center text-slate-500 border-t border-slate-200">
        <p>© {new Date().getFullYear()} {data?.fullName || 'Your Name'} | Minimal Portfolio</p>
      </footer>
    </div>
  );
}

function H2({ children, center=false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <h2 className={(center?'text-center mx-auto w-fit ':'')+'relative mb-8 text-2xl font-semibold text-gray-900'}>
      {children}
      <span className={(center?'left-1/2 -translate-x-1/2 ':'left-0 ')+'absolute -bottom-2 h-[2px] w-24 bg-gray-900'} aria-hidden/>
    </h2>
  );
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
