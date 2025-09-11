import * as React from 'react';
import type { PortfolioData } from '@/lib/portfolio-types';

/** Publish-safe Modern (light) template – no hooks, no next/image */
export function PublishTemplateModern({ data }: { data: PortfolioData }) {
  const skills = Array.isArray(data?.skills) ? data.skills.filter(Boolean) : [];
  const certifications = Array.isArray(data?.certifications) ? data.certifications.filter(Boolean) : [];
  const projects = Array.isArray(data?.projects) ? data.projects : [];

  return (
    <div className="font-serif bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800 min-h-screen antialiased">
      {/* NAV */}
      <header className="sticky top-0 z-10 backdrop-blur bg-white/85 shadow-sm border-b border-slate-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between" aria-label="Primary">
          <div className="flex items-center gap-3">
            {data?.photoDataUrl ? (
              <span className="inline-flex items-center justify-center h-8 w-8 overflow-hidden rounded-full ring-2 ring-[#0A1E4F]/20">
                <img src={data.photoDataUrl} alt={data.fullName || 'Avatar'} width="32" height="32" className="object-cover" />
              </span>
            ) : (
              <span aria-hidden className="h-8 w-8 rounded-full bg-slate-200" />
            )}
            <div className="text-xl sm:text-2xl font-bold text-[#0A1E4F] tracking-tight">
              {data?.fullName || 'Your Name'}
            </div>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section id="home" className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,#cbd5e1_0%,transparent_60%),radial-gradient(40%_40%_at_80%_10%,#00CFFF33_0%,transparent_70%),radial-gradient(45%_45%_at_20%_5%,#FF7AF533_0%,transparent_70%),linear-gradient(to_bottom,#ffffff,#f1f5f9)]"
        />
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          {data?.photoDataUrl ? (
            <figure className="relative mb-6 inline-block rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200">
              <div className="h-48 w-48 overflow-hidden rounded-xl">
                <img src={data.photoDataUrl} alt={data.fullName || 'Profile photo'} width="192" height="192" className="object-cover w-48 h-48" />
              </div>
              {data?.fullName && <figcaption className="mt-2 text-sm text-slate-500">{data.fullName}</figcaption>}
            </figure>
          ) : (
            <span className="mb-6 inline-block h-48 w-48 rounded-xl bg-slate-200" />
          )}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[#0A1E4F]">
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
                className="inline-flex items-center gap-2 rounded-full bg-[#FFD700] px-6 py-3 font-semibold text-[#0A1E4F] shadow-lg transition hover:bg-[#e6c200]"
              >
                Download CV
              </a>
            )}
            {data?.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[#00CFFF] px-6 py-3 font-semibold text-[#0A1E4F] shadow-lg transition hover:bg-[#00CFFF] hover:text-white"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      {data?.about && (
        <section id="about" className="mx-auto max-w-5xl px-6 py-20" aria-label="About">
          <SectionTitle>About Me</SectionTitle>
          <p className="text-lg leading-relaxed text-justify text-slate-600/90">{data.about}</p>
        </section>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <section id="skills" className="bg-white px-6 py-20" aria-label="Skills">
          <SectionTitle center>Expertise</SectionTitle>
          <div className="mx-auto max-w-3xl flex flex-col gap-6">
            {skills.map((s, i) =>
              s ? (
                <div key={i} className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="h-7 w-7 rounded-md bg-[#0A1E4F]/10" aria-hidden />
                  <p className="font-medium text-slate-800">{s}</p>
                </div>
              ) : null
            )}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects.filter(p => (p?.name?.trim?.() || p?.description?.trim?.())).length > 0 && (
        <section id="projects" className="mx-auto max-w-3xl px-6 py-20" aria-label="Projects">
          <SectionTitle center>Projects</SectionTitle>
          <div className="flex flex-col gap-6">
            {projects.map((p, i) => {
              const show = Boolean(p?.name?.trim?.() || p?.description?.trim?.());
              if (!show) return null;
              return (
                <article key={i} className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="h-8 w-8 rounded-md bg-[#FF7AF5]/15" aria-hidden />
                  <div>
                    <h3 className="text-xl font-semibold text-[#0A1E4F]">{p?.name}</h3>
                    {p?.description && <p className="mt-1 text-justify text-slate-600">{p.description}</p>}
                    {p?.link && (
                      <a href={p.link} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[#00CFFF] underline underline-offset-4">
                        Visit
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
        <section id="certifications" className="bg-white px-6 py-20" aria-label="Certifications">
          <SectionTitle center>Certifications</SectionTitle>
          <div className="mx-auto max-w-3xl flex flex-col gap-4">
            {certifications.map((cert, idx) => (
              <div key={idx} className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#FFD700]/20 ring-1 ring-[#FFD700]/60" aria-hidden />
                <p className="pt-1 text-lg text-slate-800">{cert}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      {(data?.email || data?.phone) && (
        <section id="contact" className="bg-white px-6 py-20" aria-label="Contact">
          <SectionTitle center>Contact</SectionTitle>
          <div className="flex flex-wrap justify-center gap-6 text-lg">
            {data?.email && <a href={`mailto:${data.email}`} className="inline-flex items-center gap-2 px-3 py-2 text-[#0A1E4F]">{data.email}</a>}
            {data?.phone && <a href={`tel:${data.phone}`} className="inline-flex items-center gap-2 px-3 py-2 text-[#0A1E4F]">{data.phone}</a>}
          </div>
        </section>
      )}

      <footer className="bg-white py-6 text-center text-slate-500 border-t border-slate-200">
        <p>© {new Date().getFullYear()} {data?.fullName || 'Your Name'} | Professional Portfolio</p>
      </footer>
    </div>
  );
}

function SectionTitle({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <h2 className={'relative mb-10 text-3xl font-bold text-[#0A1E4F] ' + (center ? 'text-center mx-auto w-fit' : 'inline-block')}>
      {children}
      <span className={(center ? 'left-1/2 -translate-x-1/2 ' : 'left-0 ') + 'absolute -bottom-2 h-1 w-28 bg-gradient-to-r from-[#00CFFF] to-[#FF7AF5]'} aria-hidden />
    </h2>
  );
}
