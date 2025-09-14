'use client';
import Image from 'next/image';
import {
  BookOpen,
  Link as LinkIcon,
  Mail,
  Phone,
  Linkedin,
  Download,
  Award,
  Check,
  Image as ImageIcon,
  Copy,
  ChevronUp,
  UserRound,
  Wand2,
  FolderGit2,
  Sparkles,
  SunMedium,
  MoonStar,
  Circle,
  Menu,
  Code,
  X,
} from 'lucide-react';
import * as React from 'react';
import type { PortfolioData } from '@/lib/portfolio-types';

type ProjectNorm = { name: string; desc: string; link: string };
type MediaNorm = { title: string; type: string; link: string };
type CertNorm = string;

// Safe getter for string fields without using `any`
function getStr(obj: unknown, keys: string[]): string {
  if (typeof obj !== 'object' || obj === null) return '';
  const rec = obj as Record<string, unknown>;
  for (const k of keys) {
    const v = rec[k];
    if (typeof v === 'string') return v;
  }
  return '';
}

export default function PortfolioTemplateTech({ data }: { data: PortfolioData }) {
  // Safe guards for optional arrays/strings
  const fullName = data?.fullName || 'Your Name';
  const role = data?.role || 'Tech Professional';
  const tagline = data?.tagline || 'Tech Tagline';
  const location = data?.location || 'Location';
  const photo = data?.photoDataUrl;

  // Normalize Projects (accept name|title, description|summary, link|url)
  const projects: ProjectNorm[] = React.useMemo(() => {
    const src = Array.isArray(data?.projects) ? data!.projects : [];
    return src
      .map((p) => {
        const name = getStr(p, ['name', 'title']);
        const desc = getStr(p, ['description', 'summary']);
        const link = getStr(p, ['link', 'url']);
        return { name, desc, link };
      })
      .filter((x) => (x.name || x.desc || x.link).trim() !== '');
  }, [data]);

  // Normalize Media (accept title|name, type, link|url)
  const media: MediaNorm[] = React.useMemo(() => {
    const src = Array.isArray(data?.media) ? data!.media : [];
    return src
      .map((m) => {
        const title = getStr(m, ['title', 'name']);
        const type = getStr(m, ['type']) || 'Media';
        const link = getStr(m, ['link', 'url']);
        return { title, type, link };
      })
      .filter((x) => (x.title || x.link).trim() !== '');
  }, [data]);

  // Normalize Certifications (string or {name|title})
  const certifications: CertNorm[] = React.useMemo(() => {
    const src = Array.isArray(data?.certifications) ? data!.certifications : [];
    return src
      .map((c) => {
        if (typeof c === 'string') return c;
        return getStr(c, ['name', 'title']);
      })
      .filter((s) => s.trim() !== '');
  }, [data]);

  const skills: string[] = React.useMemo(() => {
    const src = Array.isArray(data?.skills) ? data!.skills : [];
    return src
      .map((s) => (typeof s === 'string' ? s : String(s ?? '')))
      .filter((s) => s.trim() !== '');
  }, [data]);

  const socials =
    Array.isArray(data?.socials) ? data!.socials.filter((s) => s && s.label && s.url) : [];

  // Navbar items (show based on normalized content)
  const navItems = [
    { id: 'about', label: 'About', show: !!data?.about },
    { id: 'skills', label: 'Skills', show: skills.length > 0 },
    { id: 'projects', label: 'Projects', show: projects.length > 0 },
    { id: 'certifications', label: 'Certifications', show: certifications.length > 0 },
    { id: 'media', label: 'Media', show: media.length > 0 },
    { id: 'contact', label: 'Contact', show: true },
  ] as const;

  return (
    <div className="font-mono bg-gray-950 text-gray-100 min-h-screen antialiased">
      {/* ===== NAVBAR (simple sticky) ===== */}
      <nav className="sticky top-0 z-50 bg-gray-900/70 backdrop-blur border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 h-12 flex items-center justify-between">
          <a href="#about" className="text-sm font-semibold tracking-wide">
            {fullName}
          </a>
          <div className="hidden md:flex items-center gap-2">
            {navItems
              .filter((n) => n.show)
              .map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  className="px-3 py-2 text-xs font-medium text-gray-400 hover:text-[color:var(--neon)] relative"
                >
                  {n.label}
                </a>
              ))}
          </div>
        </div>
      </nav>

      {/* ===== HEADER / HERO ===== */}
      <header className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950">
        {/* subtle neon background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_0%,rgba(0,207,255,0.22)_0%,transparent_60%)]"
        />
        <div className="max-w-4xl mx-auto px-6 py-12 text-center relative">
          {/* Avatar only if provided */}
          {photo && (
            <figure className="group relative w-fit mx-auto mb-6">
              <span
                aria-hidden
                className="absolute -inset-8 -z-10 rounded-full blur-2xl opacity-60 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(0,207,255,0.26)_0%,transparent_60%)]"
              />
              <span aria-hidden className="avatar-ring absolute inset-[-10px] rounded-[28px]" />
              <div className="relative h-36 w-36 md:h-40 md:w-40 rounded-[28px] p-[3px] bg-gradient-to-b from-[#7dd3fc] via-[#38bdf8] to-[#00cfff] shadow-2xl">
                <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
                  <Image src={photo} alt={fullName} fill sizes="160px" priority className="object-cover" />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.12),transparent)] transition-transform duration-[1200ms] ease-out"
                  />
                </div>
              </div>
            </figure>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{fullName}</h1>
          <p className="text-lg text-gray-400 mt-1">{role}</p>
          <p className="text-sm text-gray-500 mt-1 text-justify">{tagline}</p>
          <p className="text-xs text-gray-600 mt-1">{location}</p>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {data?.cvFileDataUrl && (
              <a
                href={data.cvFileDataUrl}
                download={data.cvFileName ?? 'cv.pdf'}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--neon)] px-5 py-2 font-semibold text-gray-900 shadow-md transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,207,255,0.5)]"
              >
                <Download className="h-4 w-4" /> Download CV
              </a>
            )}
            {data?.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[color:var(--neon)] px-5 py-2 font-semibold text-[color:var(--neon)] shadow-md transition hover:bg-[color:var(--neon)] hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,207,255,0.5)]"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main className="max-w-4xl mx-auto px-6 py-8 space-y-6">
        {/* ABOUT */}
        {data?.about && (
          <section id="about" className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm hover:shadow-md transition">
            <h2 className="text-xl font-semibold text-[color:var(--neon)] mb-2 flex items-center">
              <UserRound size={20} className="mr-2" /> About Me
            </h2>
            <p className="text-gray-300 leading-relaxed text-justify">{data.about}</p>
          </section>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <section id="skills" className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-[color:var(--neon)] mb-3 flex items-center">
              <Wand2 size={20} className="mr-2" /> Skills
            </h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-3">
              {skills.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-gray-900/40 p-3 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[rgba(0,207,255,0.35)]"
                >
                  <span className="text-sm text-gray-200 text-justify">{s}</span>
                  <span className="h-2 w-2 rounded-full bg-[color:var(--neon)]/80" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <section id="projects" className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-[color:var(--neon)] mb-3 flex items-center">
              <FolderGit2 size={20} className="mr-2" /> Projects
            </h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-4">
              {projects.map((p, i) => (
                <article
                  key={`${p.name || p.link}-${i}`}
                  className="rounded-lg border border-white/10 bg-gray-900/40 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-[rgba(0,207,255,0.35)]"
                >
                  <h3 className="text-lg font-medium text-white">{p.name.trim() || `Project ${i + 1}`}</h3>
                  {p.desc.trim() && <p className="text-gray-400 mt-2 text-justify leading-relaxed">{p.desc}</p>}
                  {p.link.trim() && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[color:var(--neon)] hover:underline mt-3"
                    >
                      <Code size={16} /> View
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <section id="certifications" className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-[color:var(--neon)] mb-3 flex items-center">
              <Award size={20} className="mr-2" /> Certifications
            </h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-3">
              {certifications.map((cert, index) => (
                <div
                  key={`${cert}-${index}`}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-gray-900/40 p-3 ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[rgba(0,207,255,0.3)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[rgba(0,207,255,0.15)] ring-1 ring-[rgba(0,207,255,0.35)]">
                    <BookOpen className="h-6 w-6 text-[color:var(--neon)]" />
                  </span>
                  <p className="text-gray-200 text-justify">{cert}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MEDIA */}
        {media.length > 0 && (
          <section id="media" className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-[color:var(--neon)] mb-3 flex items-center">
              <ImageIcon size={20} className="mr-2" /> Media
            </h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-4">
              {media.map((m, i) => {
                const label = m.type.charAt(0).toUpperCase() + m.type.slice(1);
                return (
                  <div
                    key={`${m.title || m.link}-${i}`}
                    className="rounded-lg border border-white/10 bg-gray-900/40 p-4 transition hover:border-[rgba(0,207,255,0.35)]"
                  >
                    <h3 className="text-lg font-medium">{m.title.trim() || `Media ${i + 1}`}</h3>
                    <p className="text-gray-400 mt-1 text-justify">{label}</p>
                    {m.link.trim() && (
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[color:var(--neon)] hover:underline mt-2"
                      >
                        <Code size={16} /> View
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* CONTACT */}
        <section id="contact" className="rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm">
          <h2 className="text-xl font-semibold text-[color:var(--neon)] mb-2 flex items-center">
            <Mail size={20} className="mr-2" /> Contact
          </h2>
          <div className="text-gray-300 space-y-2">
            {data?.email && (
              <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:text-[color:var(--neon)]">
                <UserRound size={16} /> {data.email}
              </a>
            )}
            {data?.phone && (
              <a href={`tel:${data.phone}`} className="flex items-center gap-2 hover:text-[color:var(--neon)]">
                <Phone size={16} /> {data.phone}
              </a>
            )}
            {data?.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[color:var(--neon)] hover:underline"
              >
                <Linkedin size={16} /> LinkedIn
              </a>
            )}

            {socials.length > 0 && (
              <div className="pt-2">
                <h3 className="text-base font-medium text-gray-200/90">Social Links</h3>
                <div className="mt-1 grid grid-cols-1 gap-1">
                  {socials.map((s, i) => (
                    <a
                      key={`${s.label}-${i}`}
                      href={s.url}
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
                <Download size={16} /> Download CV
              </a>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 py-3 text-center text-gray-500">
        <p>© {new Date().getFullYear()} {fullName} | Tech Portfolio</p>
      </footer>

      {/* Global helpers (reduced-motion friendly) */}
      <style jsx global>{`
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
            rgba(0,207,255,0.55) 90deg,
            rgba(14,165,233,0.65) 160deg,
            rgba(99,102,241,0.50) 220deg,
            rgba(0,207,255,0.00) 360deg
          );
          animation: spin360 14s linear infinite;
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
