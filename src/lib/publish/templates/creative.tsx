import * as React from 'react';
import type { PortfolioData } from '@/lib/portfolio-types';

/** Publish-safe Creative template */
export function PublishTemplateCreative({ data }: { data: PortfolioData }) {
  const fullName = data?.fullName || 'Your Name';
  const role = data?.role || 'Creative Professional';
  const tagline = data?.tagline || 'Creative Tagline';
  const location = data?.location || 'Location';

  const skills = Array.isArray(data?.skills) ? data.skills.filter(Boolean) : [];
  const projects = Array.isArray(data?.projects)
    ? data.projects.filter((p) => p && ((p.name && p.name.trim()) || (p.description && p.description.trim())))
    : [];
  const certifications = Array.isArray(data?.certifications) ? data.certifications.filter(Boolean) : [];
  const media = Array.isArray(data?.media)
    ? data.media.filter((m) => m && ((m.title && m.title.trim()) || (m.link && m.link.trim())))
    : [];
  const socials = Array.isArray(data?.socials) ? data.socials.filter((s) => s && s.label && s.url) : [];

  return (
    <div className="font-sans bg-gradient-to-r from-[#0d0b1e] via-[#1a0f2e] to-[#250e3a] text-white min-h-screen antialiased">
      {/* HERO */}
      <header className="relative overflow-hidden py-12 text-center">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_0%,rgba(255,0,204,0.18)_0%,transparent_60%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[repeating-linear-gradient(90deg,transparent_0,transparent_28px,rgba(255,255,255,0.16)_29px,transparent_30px)]" />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <figure className="group relative w-fit mx-auto mb-6">
            <span aria-hidden className="absolute -inset-10 -z-10 rounded-[36px] blur-3xl opacity-70 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(255,0,204,0.28)_0%,transparent_60%)]" />
            <div className="relative h-36 w-36 md:h-40 md:w-40 rounded-[28px] p-[3px] bg-gradient-to-b from-fuchsia-400 via-pink-400 to-[#00CFFF] shadow-2xl">
              <div className="h-full w-full overflow-hidden rounded-[24px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
                {data?.photoDataUrl ? (
                  <img src={data.photoDataUrl} alt={fullName} width="160" height="160" className="object-cover w-full h-full" />
                ) : (
                  <span className="grid place-items-center h-full text-pink-200/80">No Photo</span>
                )}
              </div>
            </div>
          </figure>

          <h1 className="text-4xl font-bold tracking-tight">{fullName}</h1>
          <p className="text-xl text-pink-200 mt-2">{role}</p>
          <p className="text-sm text-pink-100 mt-1 text-justify">{tagline}</p>
          <p className="text-xs text-pink-200/70 mt-1">{location}</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {data?.cvFileDataUrl && (
              <a href={data.cvFileDataUrl} download={data.cvFileName ?? 'cv.pdf'} className="inline-flex items-center gap-2 rounded-full bg-[#00CFFF] px-5 py-2 font-semibold text-gray-900 shadow-md transition hover:brightness-110">
                Download CV
              </a>
            )}
            {data?.linkedin && (
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-[#00CFFF] px-5 py-2 font-semibold text-[#00CFFF] transition hover:bg-[#00CFFF] hover:text-gray-900">
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* ABOUT */}
        {data?.about && (
          <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-pink-200 mb-4">About Me</h2>
            <p className="text-pink-100 leading-relaxed text-justify">{data.about}</p>
          </section>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-pink-200 mb-4">Skills</h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-3">
              {skills.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-fuchsia-900/20 p-3 ring-1 ring-white/10">
                  <span className="text-sm text-pink-100 text-justify">{s as string}</span>
                  <span className="h-2 w-2 rounded-full bg-[#00CFFF]/90" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-pink-200 mb-4">Projects</h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-4">
              {projects.map((p, i) => (
                <article key={i} className="rounded-lg border border-white/10 bg-purple-950/40 p-4 shadow-sm">
                  <h3 className="text-xl font-medium">{p.name?.trim() || `Project ${i + 1}`}</h3>
                  {p.description?.trim() && <p className="text-pink-100 mt-2 text-justify leading-relaxed">{p.description}</p>}
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-block text-[#00CFFF] hover:underline mt-3">
                      View
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-pink-200 mb-4">Certifications</h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-3">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg border border-white/10 bg-purple-950/40 p-3 ring-1 ring-white/5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#00CFFF]/15 ring-1 ring-[#00CFFF]/35" aria-hidden />
                  <p className="text-pink-100 text-justify">{cert as string}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MEDIA */}
        {media.length > 0 && (
          <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-pink-200 mb-4">Media</h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-4">
              {media.map((m, i) => {
                const label = (m.type ? String(m.type) : 'Media');
                const labelNice = label.charAt(0).toUpperCase() + label.slice(1);
                return (
                  <div key={i} className="rounded-lg border border-white/10 bg-purple-950/40 p-4">
                    <h3 className="text-xl font-medium">{m.title?.trim() || `Media ${i + 1}`}</h3>
                    <p className="text-pink-100 mt-1 text-justify">{labelNice}</p>
                    {m.link && (
                      <a href={m.link} target="_blank" rel="noopener noreferrer" className="inline-block text-[#00CFFF] hover:underline mt-2">
                        View
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* CONTACT */}
        {(data?.email || data?.phone || (socials.length > 0) || data?.cvFileDataUrl || data?.linkedin) && (
          <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-pink-200 mb-4">Contact</h2>
            <div className="text-pink-100 space-y-2">
              {data?.email && <a href={`mailto:${data.email}`} className="block hover:text-[#00CFFF]">Email: {data.email}</a>}
              {data?.phone && <a href={`tel:${data.phone}`} className="block hover:text-[#00CFFF]">Phone: {data.phone}</a>}
              {data?.linkedin && <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="block text-[#00CFFF] hover:underline">LinkedIn</a>}
              {socials.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-base font-medium text-pink-100/90">Social Links</h3>
                  <div className="mt-1 grid grid-cols-1 gap-1">
                    {socials.map((s, i) => (
                      <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="text-[#00CFFF] hover:underline">
                        {s.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
              {data?.cvFileDataUrl && (
                <a href={data.cvFileDataUrl} download={data.cvFileName ?? 'cv.pdf'} className="inline-block mt-3 text-[#00CFFF] hover:underline">
                  Download CV
                </a>
              )}
            </div>
          </section>
        )}
      </main>

      <footer className="bg-[#130a22] py-4 text-center text-pink-200/70">
        <p>© {new Date().getFullYear()} {fullName} | Creative Portfolio</p>
      </footer>
    </div>
  );
}
