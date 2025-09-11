import * as React from 'react';
import type { PortfolioData } from '@/lib/portfolio-types';

/** Publish-safe Classic template (teal/dark) — no hooks, no next/image */
export function PublishTemplateClassic({ data }: { data: PortfolioData }) {
  const skills = Array.isArray(data?.skills) ? data.skills.filter(Boolean) : [];
  const projects = Array.isArray(data?.projects) ? data.projects : [];
  const certs = Array.isArray(data?.certifications) ? data.certifications.filter(Boolean) : [];

  return (
    <div className="font-serif bg-gradient-to-b from-[#0f1a1a] to-[#1b2b2b] text-gray-100 min-h-screen antialiased">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 backdrop-blur bg-[#0d1a1a]/90 shadow-lg border-b border-white/5">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between" aria-label="Primary">
          <div className="flex items-center gap-3">
            {data?.photoDataUrl ? (
              <span className="inline-flex items-center justify-center h-8 w-8 overflow-hidden rounded-full ring-2 ring-teal-400/80">
                <img
                  src={data.photoDataUrl}
                  alt={data.fullName || 'Avatar'}
                  width="32"
                  height="32"
                  className="object-cover h-full w-full"
                />
              </span>
            ) : (
              <span aria-hidden className="h-8 w-8 rounded-full bg-white/10 ring-2 ring-teal-400/40" />
            )}
            <div className="text-xl sm:text-2xl font-bold text-teal-400 tracking-tight">
              {data?.fullName || 'Your Name'}
            </div>
          </div>

          {/* Static anchors (no JS burger in publish) */}
          <div className="hidden md:flex items-center gap-6 font-medium">
            <a className="text-gray-200 hover:text-teal-300" href="#home">Home</a>
            <a className="text-gray-200 hover:text-teal-300" href="#about">About</a>
            <a className="text-gray-200 hover:text-teal-300" href="#skills">Skills</a>
            <a className="text-gray-200 hover:text-teal-300" href="#projects">Projects</a>
            <a className="text-gray-200 hover:text-teal-300" href="#certifications">Certifications</a>
            <a className="text-gray-200 hover:text-teal-300" href="#contact">Contact</a>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative flex min-h-[88vh] items-center justify-center overflow-hidden px-6 text-center"
        aria-label="Hero"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,#1a3a3a_0%,transparent_60%),radial-gradient(40%_40%_at_80%_10%,#14b8a633_0%,transparent_70%),linear-gradient(to_bottom,#0d1a1a,#1a2f2f)]"
        />

        <div className="mx-auto flex max-w-4xl flex-col items-center">
          {/* Photo */}
          <figure className="group relative mb-8">
            {/* soft aura */}
            <span
              aria-hidden
              className="absolute -inset-8 -z-10 rounded-full blur-2xl opacity-60 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(20,184,166,0.35)_0%,transparent_60%)]"
            />
            <div className="relative h-44 w-44 md:h-52 md:w-52 rounded-[28px] p-[3px] bg-gradient-to-b from-teal-300 via-cyan-300 to-emerald-400 shadow-2xl">
              <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
                {data?.photoDataUrl ? (
                  <img
                    src={data.photoDataUrl}
                    alt={data.fullName || 'Profile photo'}
                    width="208"
                    height="208"
                    className="object-cover h-full w-full"
                  />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-teal-300/70">No Photo</span>
                )}
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
                className="inline-flex items-center gap-2 rounded-full bg-teal-400 px-6 py-3 font-semibold text-[#0c1616] shadow-lg transition hover:bg-teal-300"
              >
                Download CV
              </a>
            )}
            {data?.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-teal-400 px-6 py-3 font-semibold text-teal-300 shadow-lg transition hover:bg-teal-400 hover:text-[#0c1616]"
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
          <p className="text-lg leading-relaxed text-justify text-gray-200/90">{data.about}</p>
        </section>
      )}

      {/* SKILLS (single-column) */}
      {skills.length > 0 && (
        <section id="skills" className="bg-[#1a2b2b] px-6 py-20" aria-label="Skills">
          <SectionTitle center>Expertise</SectionTitle>
          <div className="mx-auto max-w-3xl flex flex-col gap-6">
            {skills.map((s, i) =>
              s ? (
                <div
                  key={i}
                  className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl hover:border-teal-300/40"
                >
                  <span className="h-7 w-7 rounded-md bg-teal-300/20 ring-1 ring-teal-300/40" aria-hidden />
                  <p className="font-medium text-gray-100">{s}</p>
                </div>
              ) : null
            )}
          </div>
        </section>
      )}

      {/* PROJECTS (single-column) */}
      {projects.filter((p) => (p?.name?.trim?.() || p?.description?.trim?.())).length > 0 && (
        <section id="projects" className="mx-auto max-w-3xl px-6 py-20" aria-label="Projects">
          <SectionTitle center>Projects</SectionTitle>
          <div className="flex flex-col gap-6">
            {projects.map((p, i) => {
              const show = Boolean(p?.name?.trim?.() || p?.description?.trim?.());
              if (!show) return null;
              return (
                <article
                  key={i}
                  className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/5 p-5 shadow-md transition hover:-translate-y-1 hover:shadow-xl hover:border-teal-300/40"
                >
                  <span className="h-8 w-8 rounded-md bg-teal-300/25 ring-1 ring-teal-300/40" aria-hidden />
                  <div>
                    <h3 className="text-xl font-semibold text-white">{p?.name}</h3>
                    {p?.description && <p className="mt-1 text-justify text-gray-200/90">{p.description}</p>}
                    {p?.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-teal-300 underline underline-offset-4"
                      >
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

      {/* CERTIFICATIONS (cards) */}
      {certs.length > 0 && (
        <section id="certifications" className="bg-[#1a2b2b] px-6 py-20" aria-label="Certifications">
          <SectionTitle center>Certifications</SectionTitle>
          <div className="mx-auto max-w-3xl flex flex-col gap-4">
            {certs.map((cert, idx) => (
              <div
                key={idx}
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-4 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg hover:border-teal-300/35"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-300/15 ring-1 ring-teal-300/40" aria-hidden />
                <p className="text-lg text-gray-100/95">{cert}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      {(data?.email || data?.phone) && (
        <section id="contact" className="bg-[#1a2b2b] px-6 py-20" aria-label="Contact">
          <SectionTitle center>Contact</SectionTitle>
          <div className="flex flex-wrap justify-center gap-6 text-lg">
            {data?.email && (
              <a
                href={`mailto:${data.email}`}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-gray-100 transition hover:text-teal-300"
              >
                {data.email}
              </a>
            )}
            {data?.phone && (
              <a
                href={`tel:${data.phone}`}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-gray-100 transition hover:text-teal-300"
              >
                {data.phone}
              </a>
            )}
          </div>
        </section>
      )}

      <footer className="bg-[#0d1a1a] py-6 text-center text-gray-400">
        <p>© {new Date().getFullYear()} {data?.fullName || 'Your Name'} | Professional Portfolio</p>
      </footer>

      {/* Minimal global animations (CSS-only) */}
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>
    </div>
  );
}

function SectionTitle({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <h2
      className={
        'relative mb-10 text-3xl font-bold text-white ' +
        (center ? 'text-center mx-auto w-fit' : 'inline-block')
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
