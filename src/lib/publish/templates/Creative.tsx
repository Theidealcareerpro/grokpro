// src/lib/publish/templates/CreativePublish.tsx
import 'server-only';
import type { PortfolioData } from '@/lib/portfolio-types';

export default function Creative({ data }: { data: PortfolioData }) {
  const fullName = data?.fullName || 'Your Name';
  const role = data?.role || 'Creative Professional';
  const tagline = data?.tagline || 'Creative Tagline';
  const location = data?.location || 'Location';
  const photo = data?.photoDataUrl;

  const skills = Array.isArray(data?.skills) ? data.skills.filter(Boolean) : [];
  const projects = Array.isArray(data?.projects)
    ? data.projects.filter(
        (p) => p && ((p.name && p.name.trim()) || (p.description && p.description.trim()))
      )
    : [];
  const certifications = Array.isArray(data?.certifications) ? data.certifications.filter(Boolean) : [];
  const media = Array.isArray(data?.media)
    ? data.media.filter((m) => m && ((m.title && m.title.trim()) || (m.link && m.link.trim())))
    : [];
  const socials = Array.isArray(data?.socials) ? data.socials.filter((s) => s && s.label && s.url) : [];

  return (
    <div className="font-sans bg-gradient-to-r from-[#0d0b1e] via-[#1a0f2e] to-[#250e3a] text-white min-h-screen antialiased">
      {/* ===== HEADER / HERO ===== */}
      <header className="relative overflow-hidden py-12 text-center">
        {/* ambient creative glow + subtle grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_0%,rgba(255,0,204,0.18)_0%,transparent_60%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.08] bg-[repeating-linear-gradient(90deg,transparent_0,transparent_28px,rgba(255,255,255,0.16)_29px,transparent_30px)]"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          {/* Avatar: vibrant glass + conic neon ring */}
          <figure className="group relative w-fit mx-auto mb-6">
            <span
              aria-hidden
              className="absolute -inset-10 -z-10 rounded-[36px] blur-3xl opacity-70 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(255,0,204,0.28)_0%,transparent_60%)]"
            />
            <span aria-hidden className="avatar-ring absolute inset-[-12px] rounded-[28px]" />
            <div className="relative h-36 w-36 md:h-40 md:w-40 rounded-[28px] p-[3px] bg-gradient-to-b from-fuchsia-400 via-pink-400 to-[color:var(--neon)] shadow-2xl">
              <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
                {photo ? (
                  <img src={photo} alt={fullName} className="object-cover h-full w-full" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-pink-200/80">No Photo</span>
                )}
                {/* sheen on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.14),transparent)] transition-transform duration-[1200ms] ease-out group-hover:translate-x-[120%]"
                />
              </div>
            </div>
          </figure>

          <h1 className="text-4xl font-bold tracking-tight">{fullName}</h1>
          <p className="text-xl text-pink-200 mt-2">{role}</p>
          <p className="text-sm text-pink-100 mt-1 text-justify">{tagline}</p>
          <p className="text-xs text-pink-200/70 mt-1">{location}</p>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {data?.cvFileDataUrl && (
              <a
                href={data.cvFileDataUrl}
                download={data.cvFileName ?? 'cv.pdf'}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--neon)] px-5 py-2 font-semibold text-gray-900 shadow-md transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,207,255,0.45)]"
              >
                {/* Download icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 3v12" />
                  <path d="m7 12 5 5 5-5" />
                  <path d="M5 21h14" />
                </svg>
                Download CV
              </a>
            )}
            {data?.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--neon)] px-5 py-2 font-semibold text-[color:var(--neon)] shadow-md transition hover:bg-[color:var(--neon)] hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,207,255,0.45)]"
              >
                {/* LinkedIn icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4zM8.5 8h3.8v2.3h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V24h-4v-7.6c0-1.8-.03-4.1-2.5-4.1-2.5 0-2.88 1.95-2.88 4V24h-4z" />
                </svg>
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* ABOUT */}
        {data?.about && (
          <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm hover:shadow-md transition">
            <h2 className="text-2xl font-semibold text-pink-200 mb-4 flex items-center">
              {/* Palette icon */}
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 22a9 9 0 1 0-9-9 4 4 0 0 0 4 4h1a2 2 0 0 1 2 2 3 3 0 0 0 3 3Z" />
                <circle cx="7.5" cy="10.5" r="1.5" />
                <circle cx="12" cy="7.5" r="1.5" />
                <circle cx="16.5" cy="10.5" r="1.5" />
              </svg>
              About Me
            </h2>
            <p className="text-pink-100 leading-relaxed text-justify">{data.about}</p>
          </section>
        )}

        {/* SKILLS — single column with clean rows */}
        {skills.length > 0 && (
          <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-pink-200 mb-4 flex items-center">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 22s8-4 8-10a8 8 0 1 0-16 0c0 6 8 10 8 10Z" />
              </svg>
              Skills
            </h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-3">
              {skills.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-fuchsia-900/20 p-3 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[rgba(0,207,255,0.35)]"
                >
                  <span className="text-sm text-pink-100 text-justify">{String(s)}</span>
                  <span className="h-2 w-2 rounded-full bg-[color:var(--neon)]/90" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS — single column cards */}
        {projects.length > 0 && (
          <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-pink-200 mb-4 flex items-center">
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M4 7h16M4 12h16M4 17h16" />
              </svg>
              Projects
            </h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-4">
              {projects.map((p, i) => (
                <article
                  key={i}
                  className="rounded-lg border border-white/10 bg-purple-950/40 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-[rgba(0,207,255,0.35)]"
                >
                  <h3 className="text-xl font-medium">{p.name?.trim() || `Project ${i + 1}`}</h3>
                  {p.description?.trim() && (
                    <p className="text-pink-100 mt-2 text-justify leading-relaxed">{p.description}</p>
                  )}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[color:var(--neon)] hover:underline mt-3"
                    >
                      {/* link icon */}
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                        <path d="M10 13a5 5 0 0 1 7 7l-2 2" />
                        <path d="M14 17a5 5 0 0 1-7-7l2-2" />
                      </svg>
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
            <h2 className="text-2xl font-semibold text-pink-200 mb-4 flex items-center">
              {/* BookOpen icon */}
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M2 4h8a2 2 0 0 1 2 2v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 4h-8a2 2 0 0 0-2 2v14a3 3 0 0 1 3-3h7z" />
              </svg>
              Certifications
            </h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-3">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-purple-950/40 p-3 ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[rgba(0,207,255,0.3)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[rgba(0,207,255,0.15)] ring-1 ring-[rgba(0,207,255,0.35)]">
                    {/* Award icon */}
                    <svg className="h-6 w-6 text-[color:var(--neon)]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="10" r="5" />
                      <path d="M8 21v-3.5a6.97 6.97 0 0 0 8 0V21l-4-2Z" />
                    </svg>
                  </span>
                  <p className="text-pink-100 text-justify">{String(cert)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MEDIA — single column */}
        {media.length > 0 && (
          <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm">
            <h2 className="text-2xl font-semibold text-pink-200 mb-4 flex items-center">
              {/* generic media icon */}
              <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="4" width="18" height="14" rx="2" />
                <path d="m10 9 5 3-5 3z" />
              </svg>
              Media
            </h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-4">
              {media.map((m, i) => {
                const label = m.type ? String(m.type) : 'Media';
                const labelNice = label.charAt(0).toUpperCase() + label.slice(1);
                return (
                  <div
                    key={i}
                    className="rounded-lg border border-white/10 bg-purple-950/40 p-4 transition hover:border-[rgba(0,207,255,0.35)]"
                  >
                    <h3 className="text-xl font-medium">{m.title?.trim() || `Media ${i + 1}`}</h3>
                    <p className="text-pink-100 mt-1 text-justify">{labelNice}</p>
                    {m.link && (
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[color:var(--neon)] hover:underline mt-2"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                          <path d="M10 13a5 5 0 0 1 7 7l-2 2" />
                          <path d="M14 17a5 5 0 0 1-7-7l2-2" />
                        </svg>
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
        <section className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-pink-200 mb-4 flex items-center">
            {/* Mail icon */}
            <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M4 6h16v12H4z" />
              <path d="m22 6-10 7L2 6" />
            </svg>
            Contact
          </h2>
          <div className="text-pink-100 space-y-2">
            {data?.email && (
              <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:text-[color:var(--neon)]">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path d="M4 6h16v12H4z" />
                  <path d="m22 6-10 7L2 6" />
                </svg>
                {data.email}
              </a>
            )}
            {data?.phone && (
              <a href={`tel:${data.phone}`} className="flex items-center gap-2 hover:text-[color:var(--neon)]">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.15 11 19.79 19.79 0 0 1 .08 2.37 2 2 0 0 1 2.05.19h3a2 2 0 0 1 2 1.72A12.66 12.66 0 0 0 7.1 5.7a2 2 0 0 1-.45 2L5.6 8.75a16 16 0 0 0 6.65 6.65l1.05-1.05a2 2 0 0 1 2-.45 12.66 12.66 0 0 0 3.79.07A2 2 0 0 1 22 16.92z" />
                </svg>
                {data.phone}
              </a>
            )}
            {data?.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[color:var(--neon)] hover:underline"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4zM8.5 8h3.8v2.3h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V24h-4v-7.6c0-1.8-.03-4.1-2.5-4.1-2.5 0-2.88 1.95-2.88 4V24h-4z" />
                </svg>
                LinkedIn
              </a>
            )}

            {socials.length > 0 && (
              <div className="pt-2">
                <h3 className="text-base font-medium text-pink-100/90">Social Links</h3>
                <div className="mt-1 grid grid-cols-1 gap-1">
                  {socials.map((s, i) => (
                    <a
                      key={i}
                      href={s.url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[color:var(--neon)] hover:underline"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {data?.cvFileDataUrl && (
              <a
                href={data.cvFileDataUrl}
                download={data.cvFileName ?? 'cv.pdf'}
                className="mt-3 inline-flex items-center gap-2 text-[color:var(--neon)] hover:underline"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 3v12" />
                  <path d="m7 12 5 5 5-5" />
                  <path d="M5 21h14" />
                </svg>
                Download CV
              </a>
            )}
          </div>
        </section>
      </main>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#130a22] py-4 text-center text-pink-200/70">
        <p>© {new Date().getFullYear()} {fullName} | Creative Portfolio</p>
      </footer>

      {/* Global helpers */}
      <style>{`
        :root { --neon:#00CFFF; }
        @keyframes spin360 { to { transform: rotate(360deg); } }
        .avatar-ring::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: conic-gradient(
            from 0deg,
            rgba(0,207,255,0.00) 0deg,
            rgba(255,0,204,0.45) 80deg,
            rgba(0,207,255,0.70) 160deg,
            rgba(168,85,247,0.55) 240deg,
            rgba(0,207,255,0.00) 360deg
          );
          animation: spin360 16s linear infinite;
          opacity: 0.9;
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
                  mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
        }
        @media (prefers-reduced-motion: reduce) {
          .avatar-ring::before { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
