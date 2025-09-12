// src/lib/publish/templates/ModernPublish.tsx
import 'server-only';
import type { PortfolioData } from '@/lib/portfolio-types';

export default function Modern({ data }: { data: PortfolioData }) {
  const fullName = data?.fullName || 'Your Name';
  const role = data?.role ? ` | ${data.role}` : '';
  const tagline = data?.tagline || 'Delivering expertise with precision and insight';

  const skills = Array.isArray(data?.skills) ? data.skills.filter(Boolean) : [];
  const projects = Array.isArray(data?.projects)
    ? data.projects.filter((p) => p && ((p.name && p.name.trim()) || (p.description && p.description.trim())))
    : [];
  const certs = Array.isArray(data?.certifications) ? data.certifications.filter(Boolean) : [];

  return (
    <div className="font-serif bg-gradient-to-b from-[#1c2526] to-[#2e3b3e] text-gray-100 min-h-screen">
      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#0a1c3a] to-[#2b3a5c] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-yellow-400">{fullName}</div>
          <div className="hidden md:flex gap-8 font-medium">
            {['home','about','skills','projects','certifications','contact'].map((id) => (
              <a key={id} href={`#${id}`} className="hover:text-yellow-400">
                {id[0].toUpperCase() + id.slice(1)}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        id="home"
        className="h-[90vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden
                   bg-gradient-to-r from-[#0a1c3a] via-[#2b3a5c] to-[#c9982f] bg-[length:400%_400%] animate-[gradientShift_12s_ease_infinite]"
      >
        {data?.photoDataUrl ? (
          <img
            src={data.photoDataUrl}
            alt={fullName}
            className="w-48 h-48 rounded-full object-cover mb-6
                       ring-4 ring-yellow-400 ring-offset-4 ring-offset-[#1c2526]
                       hover:ring-[#c9982f] transition duration-500 shadow-2xl"
          />
        ) : (
          <div className="w-48 h-48 mb-6 rounded-full bg-gray-600 ring-4 ring-yellow-400 ring-offset-4 ring-offset-[#1c2526]" />
        )}
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
          {fullName} {role}
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl text-gray-200">{tagline}</p>

        <div className="mt-8 flex gap-4 flex-wrap justify-center">
          {data?.cvFileDataUrl && (
            <a
              href={data.cvFileDataUrl}
              download={data.cvFileName ?? 'cv.pdf'}
              className="px-6 py-3 rounded-full bg-yellow-400 text-[#0a1c3a] font-semibold shadow-lg
                         hover:bg-[#c9982f] hover:text-white transition"
            >
              <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 3v12"/><path d="m7 12 5 5 5-5"/><path d="M5 21h14"/>
              </svg>
              Download CV
            </a>
          )}
          {data?.linkedin && (
            <a
              href={data.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full border border-yellow-400 text-yellow-400 font-semibold shadow-lg
                         hover:bg-yellow-400 hover:text-[#0a1c3a] transition"
            >
              <svg className="inline w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8h4V24h-4zM8.5 8h3.8v2.3h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V24h-4v-7.6c0-1.8-.03-4.1-2.5-4.1-2.5 0-2.88 1.95-2.88 4V24h-4z"/>
              </svg>
              LinkedIn
            </a>
          )}
        </div>
      </section>

      {/* ABOUT */}
      {data?.about && (
        <section id="about" className="max-w-5xl mx-auto py-20 px-6">
          <h2 className="text-3xl font-bold mb-6 relative inline-block after:absolute after:-bottom-2 after:left-0 after:w-24 after:h-1 after:bg-gradient-to-r from-yellow-400 to-[#c9982f]">
            About Me
          </h2>
          <p className="text-lg leading-relaxed text-justify">{data.about}</p>
        </section>
      )}

      {/* SKILLS */}
      {skills.length > 0 && (
        <section id="skills" className="bg-[#2e3b3e] py-20 px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Expertise</h2>
          <div className="mx-auto max-w-3xl flex flex-col gap-4">
            {skills.map((s, i) => (
              <div
                key={i}
                className="group flex items-center gap-4 rounded-xl bg-[#4a5568] p-5
                           ring-1 ring-white/10 shadow-sm transition
                           hover:-translate-y-1 hover:shadow-xl hover:ring-yellow-400/40"
              >
                {/* generic skill icon */}
                <svg className="w-7 h-7 text-yellow-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M12 3l2.5 2.5M12 3L9.5 5.5M12 3v6M4 13l2.5-2.5M4 13l2.5 2.5M4 13h6M20 13l-2.5-2.5M20 13l-2.5 2.5M20 13h-6"/>
                </svg>
                <p className="font-medium">{String(s)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PROJECTS */}
      {projects.length > 0 && (
        <section id="projects" className="mx-auto max-w-3xl py-20 px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Projects</h2>
          <div className="flex flex-col gap-6">
            {projects.map((p, i) => (
              <article
                key={i}
                className="group rounded-xl bg-[#4a5568] p-6 ring-1 ring-white/10 shadow-md transition
                           hover:-translate-y-1 hover:shadow-xl hover:ring-yellow-400/30"
              >
                <div className="flex items-start gap-4">
                  <svg className="w-9 h-9 text-yellow-400 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M4 7h16M4 12h16M4 17h16"/>
                  </svg>
                  <div>
                    <h3 className="text-xl font-semibold">{p?.name?.trim() || `Project ${i + 1}`}</h3>
                    {p?.description?.trim() && <p className="mt-2 text-justify text-gray-200">{p.description}</p>}
                    {p?.link && (
                      <a
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-yellow-400 hover:underline mt-3"
                      >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                          <path d="M10 13a5 5 0 0 1 7 7l-2 2"/><path d="M14 17a5 5 0 0 1-7-7l2-2"/>
                        </svg>
                        Visit
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* CERTIFICATIONS */}
      {certs.length > 0 && (
        <section id="certifications" className="bg-[#2e3b3e] py-20 px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Certifications</h2>
          <div className="mx-auto max-w-3xl flex flex-col gap-4">
            {certs.map((c, index) => (
              <div
                key={index}
                className="group flex items-center gap-3 rounded-xl bg-[#4a5568] p-4
                           ring-1 ring-white/10 shadow-sm transition
                           hover:-translate-y-0.5 hover:shadow-lg hover:ring-yellow-400/30"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400/15 ring-1 ring-yellow-400/40">
                  <svg className="h-6 w-6 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="12" cy="10" r="5"/><path d="M8 21v-3.5a6.97 6.97 0 0 0 8 0V21l-4-2Z"/>
                  </svg>
                </span>
                <p className="text-lg">{String(c)}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CONTACT */}
      <section id="contact" className="bg-[#2e3b3e] py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Contact</h2>
        <div className="flex justify-center gap-6 flex-wrap text-lg">
          {data?.email && (
            <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:text-yellow-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path d="M4 6h16v12H4z"/><path d="m22 6-10 7L2 6"/>
              </svg>
              {data.email}
            </a>
          )}
          {data?.phone && (
            <a href={`tel:${data.phone}`} className="flex items-center gap-2 hover:text-yellow-400">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 3.15 11 19.79 19.79 0 0 1 .08 2.37 2 2 0 0 1 2.05.19h3a2 2 0 0 1 2 1.72A12.66 12.66 0 0 0 7.1 5.7a2 2 0 0 1-.45 2L5.6 8.75a16 16 0 0 0 6.65 6.65l1.05-1.05a2 2 0 0 1 2-.45 12.66 12.66 0 0 0 3.79.07A2 2 0 0 1 22 16.92z"/>
              </svg>
              {data.phone}
            </a>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0a1c3a] text-gray-400 text-center py-6">
        <p>© {new Date().getFullYear()} {fullName} | Professional Portfolio</p>
      </footer>

      {/* Animations */}
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
