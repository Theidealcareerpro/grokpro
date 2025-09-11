'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { Download, Linkedin, Link as LinkIcon, Mail, Phone, Menu, X, Award, Briefcase, BarChart3, PieChart } from 'lucide-react';
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

export default function CorporatePro({ data }: { data: PortfolioData }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<SectionId>('home');
  useScrollSpy(setActive);

  const skills = useMemo(()=>Array.isArray(data?.skills)?data!.skills.filter(Boolean):[],[data]);
  const projects = useMemo(()=>Array.isArray(data?.projects)?data!.projects.filter(p=>p && ((p.name && p.name.trim()) || (p.description && p.description.trim()))):[],[data]);
  const certs = useMemo(()=>Array.isArray(data?.certifications)?data!.certifications.filter(Boolean):[],[data]);

  const go=(e:React.MouseEvent<HTMLAnchorElement>, id:string)=>{ e.preventDefault(); document.getElementById(id)?.scrollIntoView({behavior:'smooth'}); history.replaceState(null,'',`#${id}`); };

  return (
    <div className="font-serif bg-gradient-to-b from-[#0a1c3a] to-[#12294f] text-[#f9f7f2] min-h-screen">
      {/* NAV */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-[#0a1c3a] to-[#4a6fa5] shadow-xl">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {data?.photoDataUrl ? (
              <span className="relative inline-block h-9 w-9 overflow-hidden rounded-full ring-2 ring-[#e3b04b]">
                <Image src={data.photoDataUrl} alt={data.fullName || 'Avatar'} fill sizes="36px" className="object-cover"/>
              </span>
            ) : <span aria-hidden className="h-9 w-9 rounded-full bg-white/10 ring-2 ring-[#e3b04b]/50" />}
            <div className="text-2xl font-bold tracking-wide text-[#e3b04b]">{data?.fullName || 'Your Name'}</div>
          </div>

          <div className="hidden md:flex items-center gap-8 font-medium">
            {SECTIONS.map(({id,label})=>(
              <a key={id} href={`#${id}`} onClick={(e)=>go(e,id)}
                 className={'transition ' + (active===id ? 'text-[#e3b04b]' : 'text-[#f9f7f2]/90 hover:text-[#e3b04b]')}>{label}</a>
            ))}
          </div>

          <button onClick={()=>setMobileOpen(v=>!v)} className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-lg ring-1 ring-white/20 hover:bg-white/10">
            {mobileOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
          </button>
        </nav>
        {mobileOpen && (
          <div className="md:hidden border-t border-white/10 bg-[#0a1c3a]">
            <div className="max-w-7xl mx-auto px-6 py-3 grid grid-cols-2 gap-3">
              {SECTIONS.map(({id,label})=>(
                <a key={id} href={`#${id}`} onClick={(e)=>go(e,id)}
                   className={'rounded-md px-3 py-2 text-sm font-medium hover:bg-white/10 ' + (active===id?'text-[#e3b04b]':'text-white')}>{label}</a>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="home" className="relative min-h-[80vh] flex items-center justify-center text-center overflow-hidden px-6">
        <div aria-hidden className="absolute inset-0 -z-10 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22200%22 viewBox=%220 0 200 200%22 opacity=%220.06%22><path d=%22M50,150 L150,50%22 stroke=%22%23e3b04b%22 stroke-width=%222%22/></svg>')]"/>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold drop-shadow-sm">{data?.fullName || 'Your Name'} {data?.role ? `| ${data.role}` : ''}</h1>
          <p className="text-xl text-[#e3b04b] mt-3">{data?.tagline || 'Strategic. Credible. Impactful.'}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {data?.cvFileDataUrl && (
              <a href={data.cvFileDataUrl} download={data.cvFileName ?? 'cv.pdf'}
                 className="inline-flex items-center gap-2 rounded-full bg-[#e3b04b] px-6 py-3 font-semibold text-[#0a1c3a] shadow-lg hover:brightness-110">
                <Download className="h-4 w-4"/> Download CV
              </a>
            )}
            {data?.linkedin && (
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer"
                 className="inline-flex items-center gap-2 rounded-full ring-1 ring-[#e3b04b] px-6 py-3 font-semibold text-[#e3b04b] hover:bg-[#e3b04b] hover:text-[#0a1c3a]">
                <Linkedin className="h-4 w-4"/> LinkedIn
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      {data?.about && (
        <section id="about" className="max-w-5xl mx-auto px-6 py-16">
          <H2>About Me</H2>
          <div className="rounded-2xl bg-white/5 backdrop-blur p-6 ring-1 ring-white/10">
            <p className="text-[#f9f7f2]/95 text-justify leading-relaxed">{data.about}</p>
          </div>
        </section>
      )}

      {/* SKILLS */}
      {skills.length>0 && (
        <section id="skills" className="bg-[#0f2448] py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <H2 center>Expertise</H2>
            <div className="grid grid-cols-1 gap-4">
              {skills.map((s,i)=>{
                const Icon = [Briefcase, BarChart3, PieChart][i % 3];
                return (
                  <div key={i} className="flex items-center gap-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10 hover:ring-[#e3b04b]/40 transition">
                    <Icon className="h-6 w-6 text-[#e3b04b]"/><p className="text-[#f9f7f2]">{s}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects.length>0 && (
        <section id="projects" className="max-w-4xl mx-auto px-6 py-16">
          <H2 center>Projects</H2>
          <div className="flex flex-col gap-6">
            {projects.map((p,i)=>(
              <article key={i} className="rounded-xl bg-white/5 p-6 ring-1 ring-white/10 hover:ring-[#e3b04b]/40 transition">
                <h3 className="text-2xl font-semibold">{p.name?.trim() || `Project ${i+1}`}</h3>
                {p.description?.trim() && <p className="text-white/80 mt-2 text-justify">{p.description}</p>}
                {p.link && <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[#e3b04b] hover:underline mt-3"><LinkIcon size={16}/>Visit</a>}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CERTS */}
      {certs.length>0 && (
        <section id="certifications" className="bg-[#0f2448] py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <H2 center>Certifications</H2>
            <div className="flex flex-col gap-3">
              {certs.map((c,i)=>(
                <div key={i} className="flex items-center gap-3 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e3b04b]/15 ring-1 ring-[#e3b04b]/40">
                    <Award className="h-6 w-6 text-[#e3b04b]"/>
                  </span>
                  <p className="text-white/95">{c}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="bg-[#0f2448] py-14 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <H2 center>Contact</H2>
          <div className="flex justify-center gap-6 flex-wrap text-lg">
            {data?.email && <a href={`mailto:${data.email}`} className="hover:text-[#e3b04b] inline-flex items-center gap-2"><Mail className="h-5 w-5"/>{data.email}</a>}
            {data?.phone && <a href={`tel:${data.phone}`} className="hover:text-[#e3b04b] inline-flex items-center gap-2"><Phone className="h-5 w-5"/>{data.phone}</a>}
          </div>
        </div>
      </section>

      <footer className="bg-[#0a1c3a] text-[#f9f7f2] text-center py-6">
        <p>© {new Date().getFullYear()} {data?.fullName || 'Your Name'} | Corporate Portfolio</p>
      </footer>
    </div>
  );
}

function H2({ children, center=false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <h2 className={(center?'text-center ':'')+'text-3xl font-bold mb-6 relative inline-block after:absolute after:-bottom-2 after:left-1/2 ' + (center?'after:-translate-x-1/2 ':'after:-translate-x-1/2') + ' after:w-24 after:h-1 after:bg-gradient-to-r from-[#e3b04b] to-[#c9982f]'}>
      {children}
    </h2>
  );
}
function useScrollSpy(on:(id:SectionId)=>void){
  const last=useRef<SectionId>('home');
  useEffect(()=>{
    const io=new IntersectionObserver((es)=>{
      const v=es.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      const id=(v?.target?.id||'') as SectionId; if(id&&id!==last.current){ last.current=id; on(id); }
    },{ rootMargin:'-40% 0px -50% 0px', threshold:[0,.25,.5,.75,1]});
    const els=SECTIONS.map(s=>document.getElementById(s.id)).filter(Boolean) as Element[]; els.forEach(el=>io.observe(el));
    return ()=>io.disconnect();
  },[on]);
}
