import * as React from 'react';
import type { PortfolioData } from '@/lib/portfolio-types';

export default function ClassicProLeft({ data }: { data: PortfolioData }) {
  const skills = Array.isArray(data?.skills) ? data!.skills.filter(Boolean) : [];
  const projs  = Array.isArray(data?.projects) ? data!.projects.filter(p => p && (p.name?.trim() || p.description?.trim())) : [];
  const certs  = Array.isArray(data?.certifications) ? data!.certifications.filter(Boolean) : [];

  return (
    <main>
      {/* Top bar */}
      <div className="nav">
        <div className="nav-inner">
          <div className="brand">
            {data?.photoDataUrl ? (
              <img src={data.photoDataUrl} alt={data.fullName || 'Avatar'} width={36} height={36}
                   style={{borderRadius: '999px', border: '1px solid #e2e8f0', objectFit: 'cover'}} />
            ) : <span style={{width:36,height:36,borderRadius:'999px',background:'#e2e8f0',display:'inline-block'}} aria-hidden/>}
            <span>{data?.fullName || 'Your Name'}</span>
          </div>
          <div className="link-row muted">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#certifications">Certifications</a>
            <a href="#contact">Contact</a>
          </div>
        </div>
      </div>

      <div className="container" style={{display:'grid', gridTemplateColumns:'1fr', gap:24}}>
        {/* Sidebar-like header */}
        <section id="home" className="section" style={{paddingTop:24}}>
          <div className="card" style={{textAlign:'center'}}>
            {data?.photoDataUrl && <img className="avatar" src={data.photoDataUrl} alt={data.fullName || 'Profile'}/>}
            <h1 className="h1">{data?.fullName || 'Your Name'}{data?.role ? ` | ${data.role}` : ''}</h1>
            {data?.tagline && <p className="lead">{data.tagline}</p>}
            <div className="vspace" />
            <div className="row">
              {data?.cvFileDataUrl && (
                <a className="pill pill-solid" href={data.cvFileDataUrl} download={data.cvFileName ?? 'cv.pdf'}>CV</a>
              )}
              {data?.linkedin && (
                <a className="pill pill-ghost" href={data.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              )}
            </div>
          </div>
        </section>

        {/* ABOUT */}
        {data?.about && (
          <section id="about" className="section">
            <div className="kicker">About Me</div>
            <div className="card"><p className="muted" style={{textAlign:'justify'}}>{data.about}</p></div>
          </section>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <section id="skills" className="section">
            <div className="kicker">Expertise</div>
            <div className="grid">
              {skills.map((s, i) => <div className="card" key={i}><div className="subtitle">{s}</div></div>)}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {projs.length > 0 && (
          <section id="projects" className="section">
            <div className="kicker">Projects</div>
            <div className="grid">
              {projs.map((p, i) => (
                <article className="card" key={i}>
                  <div className="subtitle">{p.name?.trim() || `Project ${i+1}`}</div>
                  {p.description?.trim() && <p className="muted" style={{textAlign:'justify'}}>{p.description}</p>}
                  {p.link && <p style={{marginTop:12}}><a href={p.link} target="_blank" rel="noopener noreferrer">Visit</a></p>}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS */}
        {certs.length > 0 && (
          <section id="certifications" className="section">
            <div className="kicker">Certifications</div>
            <div className="grid">
              {certs.map((c, i) => <div className="card" key={i}>{c}</div>)}
            </div>
          </section>
        )}

        {/* CONTACT */}
        <section id="contact" className="section">
          <div className="kicker">Contact</div>
          <div className="row">
            {data?.email && <a href={`mailto:${data.email}`}>{data.email}</a>}
            {data?.phone && <a href={`tel:${data.phone}`}>{data.phone}</a>}
            {data?.linkedin && <a href={data.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
          </div>
        </section>
      </div>

      <footer className="footer">© {new Date().getFullYear()} {data?.fullName || 'Your Name'} · Classic Portfolio</footer>
    </main>
  );
}
