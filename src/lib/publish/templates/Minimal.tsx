// src/lib/publish/templates/MinimalPublish.tsx
import 'server-only';
import type { PortfolioData } from '@/lib/portfolio-types';

export default function Minimal({ data }: { data: PortfolioData }) {
  const fullName = data?.fullName || 'Your Name';
  const role = data?.role ? ` | ${data.role}` : '';
  const tagline = data?.tagline || 'Delivering expertise with precision and insight';

  const skills = Array.isArray(data?.skills) ? data.skills.filter(Boolean) : [];
  const projects = Array.isArray(data?.projects)
    ? data.projects.filter((p) => p && ((p.name && p.name.trim()) || (p.description && p.description.trim())))
    : [];
  const certs = Array.isArray(data?.certifications) ? data.certifications.filter(Boolean) : [];

  return (
    <div className="font-serif bg-gradient-to-b from-slate-50 to-slate-100 text-slate-800 min-h-screen antialiased">
      {/* NAVIGATION */}
      <header className="sticky top-0 z-50 backdrop-blur bg-white/85 shadow-sm border-b border-slate-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between" aria-label="Primary">
          <div className="flex items-center gap-3">
            {data?.photoDataUrl ? (
              <span className="relative inline-block h-8 w-8 overflow-hidden rounded-full ring-2 ring-[var(--brand-300)]">
                <img src={data.photoDataUrl} alt={fullName} className="object-cover h-full w-full" />
              </span>
            ) : (
              <span aria-hidden className="h-8 w-8 rounded-full bg-slate-200" />
            )}
            <div className="text-xl sm:text-2xl font-bold text-[var(--brand-700)] tracking-tight">{fullName}</div>
          </div>

          {/* desktop links (static for publish) */}
          <div className="hidden md:flex items-center gap-6 font-medium">
            {['home', 'about', 'skills', 'projects', 'certifications', 'contact'].map((id) => (
              <a
                key={id}
                href={`#${id}`}
                className="relative px-1 py-2 outline-none transition text-slate-600 hover:text-[var(--brand-700)] focus-visible:text-[var(--brand-700)]"
              >
                {id[0].toUpperCase() + id.slice(1)}
              </a>
            ))}
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-6 text-center scroll-mt-24"
        aria-label="Hero"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_50%_at_50%_0%,#cbd5e1_0%,transparent_60%),radial-gradient(40%_40%_at_80%_10%,#2563eb33_0%,transparent_70%),radial-gradient(45%_45%_at_20%_5%,#22d3ee33_0%,transparent_70%),linear-gradient(to_bottom,#ffffff,#f1f5f9)] animate-[gradientShift_14s_ease_in_out_infinite] bg-[length:160%_160%]"
        />
        <div className="mx-auto flex max-w-4xl flex-col items-center">
          {data?.photoDataUrl ? (
            <figure className="relative mb-6 inline-block rounded-2xl bg-white p-2 shadow-xl ring-1 ring-slate-200">
              <div className="relative h-48 w-48 overflow-hidden rounded-xl">
                <img src={data.photoDataUrl} alt={fullName} className="object-cover h-full w-full" />
              </div>
              <figcaption className="mt-2 text-sm text-slate-500">{fullName}</figcaption>
            </figure>
          ) : (
            <span className="mb-6 inline-block h-48 w-48 rounded-xl bg-slate-200" />
          )}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-[var(--brand-700)]">
            {fullName} {role}
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-2xl text-slate-600">{tagline}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {data?.cvFileDataUrl && (
              <a
                href={data.cvFileDataUrl}
                download={data.cvFileName ?? 'cv.pdf'}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--brand-600)] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-[var(--brand-700)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-300)]"
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
                className="inline-flex items-center gap-2 rounded-full border border-[var(--brand-600)] px-6 py-3 font-semibold text-[var(--brand-700)] shadow-lg transition hover:bg-[var(--brand-600)] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-300)]"
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
      </section>

      {/* ABOUT */}
      {data?.about && (
        <section id="about" className="mx-auto max-w-5xl scroll-mt-24 px-6 py-20" aria-label="About">
          <SectionTitle>About Me</SectionTitle>
          <p className="text-lg leading-relaxed text-justify text-slate-600/90">{data.about}</p>
        </section>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <section id="skills" className="scroll-mt-24 bg-white px-6 py-20" aria-label="Skills">
          <SectionTitle center>Expertise</SectionTitle>
          <div className="mx-auto max-w-3xl flex flex-col gap-6">
            {skills.map((s, i) => (
              <div
                key={i}
                className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:ring-1 hover:ring-[var(--brand-300)]"
              >
                {/* generic skill icon */}
                <svg className="h-7 w-7 text-[var(--brand-600)]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 3l2.5 2.5M12 3L9.5 5.5M12 3v6M4 13l2.5-2.5M4 13l2.5 2.5M4 13h6M20 13l-2.5-2.5M20 13l-2.5 2.5M20 13h-6" />
                </svg>
                <p className="font-medium text-slate-800">{String(s)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section id="projects" className="mx-auto max-w-3xl scroll-mt-24 px-6 py-20" aria-label="Projects">
          <SectionTitle center>Projects</SectionTitle>
          <div className="flex flex-col gap-6">
            {projects.map((p, i) => (
              <article
                key={i}
                className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md hover:ring-1 hover:ring-[var(--brand-200)]"
              >
                {/* list icon */}
                <svg className="h-8 w-8 flex-shrink-0 text-[var(--brand-600)]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--brand-700)]">{p?.name?.trim() || `Project ${i + 1}`}</h3>
                  {p?.description?.trim() && <p className="mt-1 text-justify text-slate-600">{p.description}</p>}
                  {p?.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-[var(--brand-700)] underline-offset-4 hover:underline"
                    >
                      {/* link icon */}
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                        <path d="M10 13a5 5 0 0 1 7 7l-2 2" />
                        <path d="M14 17a5 5 0 0 1-7-7l2-2" />
                      </svg>
                      Visit
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CERTIFICATIONS */}
      {certs.length > 0 && (
        <section id="certifications" className="scroll-mt-24 bg-white px-6 py-20" aria-label="Certifications">
          <SectionTitle center>Certifications</SectionTitle>
          <div className="mx-auto max-w-3xl flex flex-col gap-4">
            {certs.map((c, idx) => (
              <div
                key={idx}
                className="group flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--brand-50)] ring-1 ring-[var(--brand-200)]">
                  {/* award icon */}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-6 w-6 text-[var(--brand-800)]"
                  >
                    <circle cx="12" cy="10" r="5" />
                    <path d="M8 21v-3.5a6.97 6.97 0 0 0 8 0V21l-4-2Z" />
                  </svg>
                </span>
                <p className="pt-1 text-lg text-slate-800">{String(c)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="scroll-mt-24 bg-white px-6 py-20" aria-label="Contact">
        <SectionTitle center>Contact</SectionTitle>
        <div className="flex flex-wrap justify-center gap-6 text-lg">
          {data?.email && (
            <a
              href={`mailto:${data.email}`}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-[var(--brand-700)] transition hover:text-[var(--brand-800)]"
            >
              {/* mail icon */}
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path d="M4 6h16v12H4z" />
                <path d="m22 6-10 7L2 6" />
              </svg>
              {data.email}
            </a>
          )}
          {data?.phone && (
            <a
              href={`tel:${data.phone}`}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-[var(--brand-700)] transition hover:text-[var(--brand-800)]"
            >
              {/* phone icon */}
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.15 11 19.79 19.79 0 0 1 .08 2.37 2 2 0 0 1 2.05.19h3a2 2 0 0 1 2 1.72A12.66 12.66 0 0 0 7.1 5.7a2 2 0 0 1-.45 2L5.6 8.75a16 16 0 0 0 6.65 6.65l1.05-1.05a2 2 0 0 1 2-.45 12.66 12.66 0 0 0 3.79.07A2 2 0 0 1 22 16.92z" />
              </svg>
              {data.phone}
            </a>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white py-6 text-center text-slate-500 border-t border-slate-200">
        <p>
          © {new Date().getFullYear()} {fullName} | Professional Portfolio
        </p>
      </footer>

      {/* Global brand variables & motion helpers */}
      <style>{`
        :root{
          --brand-50:#eff6ff; --brand-100:#dbeafe; --brand-200:#bfdbfe; --brand-300:#93c5fd; --brand-400:#60a5fa;
          --brand-500:#3b82f6; --brand-600:#2563eb; --brand-700:#1d4ed8; --brand-800:#1e40af; --brand-900:#1e3a8a;
          --accent-1:#22d3ee;
        }
        @keyframes gradientShift {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 0%; }
        }
        /* Optional subtle brand glow helpers (kept tasteful) */
        .neon {
          text-shadow: 0 0 10px rgba(37,99,235,.35), 0 0 22px rgba(34,211,238,.25);
          filter: drop-shadow(0 0 .2rem rgba(37,99,235,.35));
        }
        .neon-ring {
          box-shadow: 0 0 12px rgba(37,99,235,.25), 0 0 28px rgba(34,211,238,.2);
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-[gradientShift_14s_ease_in_out_infinite]{ animation: none !important; }
          .neon{ text-shadow: none !important; filter: none !important; }
        }
      `}</style>
    </div>
  );
}

function SectionTitle({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <h2
      className={
        'relative mb-10 text-3xl font-bold text-[var(--brand-700)] ' +
        (center ? 'text-center mx-auto w-fit' : 'inline-block')
      }
    >
      {children}
      <span
        aria-hidden
        className={
          (center ? 'left-1/2 -translate-x-1/2 ' : 'left-0 ') +
          'absolute -bottom-2 h-1 w-28 bg-gradient-to-r from-[var(--brand-500)] to-[var(--accent-1)]'
        }
      />
    </h2>
  );
}
