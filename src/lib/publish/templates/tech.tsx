import * as React from 'react';
import type { PortfolioData } from '@/lib/portfolio-types';

/** Publish-safe Tech template */
export function PublishTemplateTech({ data }: { data: PortfolioData }) {
  const fullName = data?.fullName || 'Your Name';
  const role = data?.role || 'Tech Professional';
  const tagline = data?.tagline || 'Tech Tagline';
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
    <div className="font-mono bg-gray-950 text-gray-100 min-h-screen antialiased">
      {/* HERO */}
      <header className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_0%,rgba(0,207,255,0.22)_0%,transparent_60%)]" />
        <div className="max-w-4xl mx-auto px-6 py-12 text-center relative">
          <figure className="group relative w-fit mx-auto mb-6">
            <span aria-hidden className="absolute -inset-8 -z-10 rounded-full blur-2xl opacity-60 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(0,207,255,0.26)_0%,transparent_60%)]" />
            <div className="relative h-36 w-36 md:h-40 md:w-40 rounded-[28px] p-[3px] bg-gradient-to-b from-[#7dd3fc] via-[#38bdf8] to-[#00cfff] shadow-2xl">
              <div className="h-full w-full overflow-hidden rounded-[24px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
                {data?.photoDataUrl ? (
                  <img src={data.photoDataUrl} alt={fullName} width="160" height="160" className="object-cover w-full h-full" />
                ) : (
                  <span className="grid place-items-center h-full text-[#00CFFF]/70">No Photo</span>
                )}
              </div>
            </div>
          </figure>

          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{fullName}</h1>
          <p className="text-lg text-gray-400 mt-1">{role}</p>
          <p className="text-sm text-gray-500 mt-1 text-justify">{tagline}</p>
          <p className="text-xs text-gray-600 mt-1">{location}</p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {data?.cvFileDataUrl && (
              <a href={data.cvFileDataUrl} download={data.cvFileName ?? 'cv.pdf'} className="inline-flex items-center gap-2 rounded-full bg-[#00CFFF] px-5 py-2 font-semibold text-gray-900 transition hover:brightness-110">
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

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* ABOUT */}
        {data?.about && (
          <section className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold text-[#00CFFF] mb-2">About Me</h2>
            <p className="text-gray-300 leading-relaxed text-justify">{data.about}</p>
          </section>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <section className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold text-[#00CFFF] mb-3">Skills</h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-3">
              {skills.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-gray-900/40 p-3 ring-1 ring-white/10">
                  <span className="text-sm text-gray-200 text-justify">{s as string}</span>
                  <span className="h-2 w-2 rounded-full bg-[#00CFFF]/80" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <section className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold text-[#00CFFF] mb-3">Projects</h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-4">
              {projects.map((p, i) => (
                <article key={i} className="rounded-lg border border-white/10 bg-gray-900/40 p-4">
                  <h3 className="text-lg font-medium text-white">{p.name?.trim() || `Project ${i + 1}`}</h3>
                  {p.description?.trim() && <p className="text-gray-400 mt-2 text-justify leading-relaxed">{p.description}</p>}
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
          <section className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold text-[#00CFFF] mb-3">Certifications</h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-3">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg border border-white/10 bg-gray-900/40 p-3 ring-1 ring-white/5">
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#00CFFF]/15 ring-1 ring-[#00CFFF]/35" aria-hidden />
                  <p className="text-gray-200 text-justify">{cert as string}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MEDIA */}
        {media.length > 0 && (
          <section className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold text-[#00CFFF] mb-3">Media</h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-4">
              {media.map((m, i) => {
                const label = (m.type ? String(m.type) : 'Media');
                const labelNice = label.charAt(0).toUpperCase() + label.slice(1);
                return (
                  <div key={i} className="rounded-lg border border-white/10 bg-gray-900/40 p-4">
                    <h3 className="text-lg font-medium">{m.title?.trim() || `Media ${i + 1}`}</h3>
                    <p className="text-gray-400 mt-1 text-justify">{labelNice}</p>
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
          <section className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h2 className="text-xl font-semibold text-[#00CFFF] mb-2">Contact</h2>
            <div className="text-gray-300 space-y-2">
              {data?.email && <a href={`mailto:${data.email}`} className="block hover:text-[#00CFFF]">Email: {data.email}</a>}
              {data?.phone && <a href={`tel:${data.phone}`} className="block hover:text-[#00CFFF]">Phone: {data.phone}</a>}
              {data?.linkedin && <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="block text-[#00CFFF] hover:underline">LinkedIn</a>}
              {socials.length > 0 && (
                <div className="pt-2">
                  <h3 className="text-base font-medium text-gray-200/90">Social Links</h3>
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

      <footer className="bg-gray-900 py-3 text-center text-gray-500">
        <p>© {new Date().getFullYear()} {fullName} | Tech Portfolio</p>
      </footer>
    </div>
  );
}
