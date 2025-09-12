'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Palette,
  BookOpen,
  Link as LinkIcon,
  Mail,
  Phone,
  Linkedin,
  Download,
  Award,
  Check,
  Copy,
  ChevronUp,
} from 'lucide-react';
import type { PortfolioData } from '@/lib/portfolio-types';

export default function PortfolioTemplateClassic({ data }: { data: PortfolioData }) {
  // ===== Data guards =====
  const fullName = data?.fullName || 'Your Name';
  const role = data?.role || 'Classic Professional';
  const tagline = data?.tagline || 'Classic Tagline';
  const location = data?.location || 'Location';
  const photo = data?.photoDataUrl;

  const skills = useMemo(() => (Array.isArray(data?.skills) ? data!.skills.filter(Boolean) : []), [data]);
  const projects = useMemo(
    () =>
      Array.isArray(data?.projects)
        ? data!.projects.filter((p) => p && ((p.name && p.name.trim()) || (p.description && p.description.trim())))
        : [],
    [data]
  );
  const certifications = useMemo(
    () => (Array.isArray(data?.certifications) ? data!.certifications.filter(Boolean) : []),
    [data]
  );
  const media = useMemo(
    () =>
      Array.isArray(data?.media)
        ? data!.media.filter((m) => m && ((m.title && m.title.trim()) || (m.link && m.link.trim())))
        : [],
    [data]
  );
  const socials = useMemo(
    () => (Array.isArray(data?.socials) ? data!.socials.filter((s) => s && s.label && s.url) : []),
    [data]
  );

  // ===== UX niceties =====
  const [copied, setCopied] = useState<'email' | 'phone' | null>(null);
  const [scrollPct, setScrollPct] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll progress (top bar) - optimized with requestAnimationFrame
  useEffect(() => {
    let rafId: number;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const el = document.documentElement;
        const h = el.scrollHeight - el.clientHeight;
        setScrollPct(h > 0 ? (el.scrollTop / h) * 100 : 0);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Enhanced section reveal (reduced-motion aware, with staggered child animations)
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const sections = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal-section]'));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('reveal-in');
            // Stagger child elements
            const children = Array.from(e.target.querySelectorAll<HTMLElement>('[data-reveal-child]'));
            children.forEach((child, idx) => {
              child.style.transitionDelay = `${idx * 0.1}s`;
              child.classList.add('reveal-child-in');
            });
            obs.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0.15 }
    );
    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  // Clipboard helper - added haptic feedback if available
  const copy = async (label: 'email' | 'phone', value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      if ('vibrate' in navigator) navigator.vibrate(50);
      setTimeout(() => setCopied(null), 1400);
    } catch {}
  };

  return (
    <div
      ref={containerRef}
      className="font-sans bg-gradient-to-br from-[#0d0b1e] via-[#1a0f2e] to-[#250e3a] text-white min-h-screen antialiased"
    >
      {/* Skip link - improved focus styles */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] rounded-lg bg-white/15 px-4 py-2.5 ring-2 ring-white/25 backdrop-blur-md shadow-lg"
      >
        Skip to content
      </a>

      {/* Top scroll progress - smoother gradient */}
      <div
        aria-hidden
        className="fixed inset-x-0 top-0 z-50 h-1 bg-gradient-to-r from-[#00CFFF] via-fuchsia-500 to-violet-500 origin-left scale-x-0 transition-transform duration-300 ease-out"
        style={{ transform: `scaleX(${scrollPct / 100})` }}
      />

      {/* ===== HEADER / HERO ===== */}
      <header className="relative overflow-hidden py-16 text-center">
        {/* Enhanced ambient glow + parallax subtle grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(100%_60%_at_50%_10%,rgba(255,0,204,0.22)_0%,transparent_70%)] opacity-100"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-10 bg-[repeating-linear-gradient(45deg,transparent_0,transparent_24px,rgba(255,255,255,0.12)_25px,transparent_26px)] parallax-bg"
        />
        <div className="relative z-10 max-w-5xl mx-auto px-8">
          {/* Avatar: modern circular frame with 3D tilt effect, enhanced neon ring, and glow */}
          <figure className="group relative w-fit mx-auto mb-8 tilt-avatar" data-reveal-section>
            <span
              aria-hidden
              className="absolute -inset-12 -z-10 rounded-full blur-3xl opacity-75 bg-[radial-gradient(80%_80%_at_50%_50%,rgba(255,0,204,0.32)_0%,transparent_70%)]"
            />
            <span aria-hidden className="avatar-ring absolute inset-[-16px] rounded-full" />
            <div className="relative h-44 w-44 rounded-full p-[4px] bg-gradient-to-br from-fuchsia-500 via-pink-500 to-[color:var(--neon)] shadow-xl ring-1 ring-white/15">
              <div className="relative h-full w-full overflow-hidden rounded-full bg-white/8 backdrop-blur-md">
                {photo ? (
                  <Image src={photo} alt={fullName} fill sizes="176px" priority className="object-cover scale-105 group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-pink-200/80 text-lg">No Photo</span>
                )}
                {/* Enhanced sheen on hover */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 translate-x-[-150%] bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.18),transparent)] transition-transform duration-1000 ease-out group-hover:translate-x-[150%]"
                />
              </div>
            </div>
          </figure>

          <h1 className="text-5xl font-bold tracking-tight" data-reveal-child>
            {fullName}
          </h1>
          <p className="text-2xl text-pink-200 mt-3" data-reveal-child>
            {role}
          </p>
          <p className="text-base text-pink-100 mt-2 max-w-xl mx-auto leading-relaxed" data-reveal-child>
            {tagline}
          </p>
          <p className="text-sm text-pink-200/70 mt-2" data-reveal-child>
            {location}
          </p>

          {/* CTAs - with subtle lift on hover */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4" data-reveal-child>
            {data?.cvFileDataUrl && (
              <a
                href={data.cvFileDataUrl}
                download={data.cvFileName ?? 'cv.pdf'}
                className="inline-flex items-center gap-2 rounded-full bg-[color:var(--neon)] px-6 py-3 font-semibold text-gray-900 shadow-lg transition-transform hover:-translate-y-1 hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,207,255,0.5)]"
              >
                <Download className="h-5 w-5" /> Download CV
              </a>
            )}
            {data?.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[color:var(--neon)] px-6 py-3 font-semibold text-[color:var(--neon)] shadow-lg transition-transform hover:-translate-y-1 hover:bg-[color:var(--neon)] hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(0,207,255,0.5)]"
              >
                <Linkedin className="h-5 w-5" /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ===== MAIN ===== */}
      <main id="main" className="max-w-5xl mx-auto px-8 py-12 space-y-12">
        {/* ABOUT - intro effect: fade + slide up */}
        {data?.about && (
          <section className="rounded-2xl border border-white/12 bg-white/8 p-8 shadow-md hover:shadow-lg transition-all duration-300" data-reveal-section aria-label="About">
            <h2 className="text-3xl font-semibold text-pink-200 mb-6 flex items-center gap-3" data-reveal-child>
              <Palette size={24} className="text-[color:var(--neon)]" /> About Me
            </h2>
            <p className="text-pink-100 leading-relaxed text-justify" data-reveal-child>{data.about}</p>
          </section>
        )}

        {/* SKILLS - intro effect: staggered scale in */}
        {skills.length > 0 && (
          <section className="rounded-2xl border border-white/12 bg-white/8 p-8 shadow-md hover:shadow-lg transition-all duration-300" data-reveal-section aria-label="Skills">
            <h2 className="text-3xl font-semibold text-pink-200 mb-6 flex items-center gap-3" data-reveal-child>
              <Palette size={24} className="text-[color:var(--neon)]" /> Skills
            </h2>
            <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {skills.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-fuchsia-900/25 p-4 ring-1 ring-white/12 transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-[rgba(0,207,255,0.4)]"
                  data-reveal-child
                >
                  <span className="text-base text-pink-100">{String(s)}</span>
                  <span className="h-3 w-3 rounded-full bg-[color:var(--neon)] shadow-md" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS - intro effect: fade + expand */}
        {projects.length > 0 && (
          <section className="rounded-2xl border border-white/12 bg-white/8 p-8 shadow-md hover:shadow-lg transition-all duration-300" data-reveal-section aria-label="Projects">
            <h2 className="text-3xl font-semibold text-pink-200 mb-6 flex items-center gap-3" data-reveal-child>
              <Palette size={24} className="text-[color:var(--neon)]" /> Projects
            </h2>
            <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((p, i) => (
                <article
                  key={i}
                  className="rounded-lg border border-white/12 bg-purple-950/50 p-6 shadow-sm transition-all hover:-translate-y-2 hover:shadow-xl hover:border-[rgba(0,207,255,0.4)]"
                  data-reveal-child
                >
                  <h3 className="text-2xl font-medium text-pink-200">{p.name?.trim() || `Project ${i + 1}`}</h3>
                  {p.description?.trim() && (
                    <p className="text-pink-100 mt-3 leading-relaxed">{p.description}</p>
                  )}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-[color:var(--neon)] hover:underline mt-4 font-medium"
                    >
                      <LinkIcon size={18} /> View Project
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS - intro effect: staggered flip in */}
        {certifications.length > 0 && (
          <section className="rounded-2xl border border-white/12 bg-white/8 p-8 shadow-md hover:shadow-lg transition-all duration-300" data-reveal-section aria-label="Certifications">
            <h2 className="text-3xl font-semibold text-pink-200 mb-6 flex items-center gap-3" data-reveal-child>
              <BookOpen size={24} className="text-[color:var(--neon)]" /> Certifications
            </h2>
            <div className="mx-auto max-w-4xl grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 rounded-lg border border-white/12 bg-purple-950/50 p-4 ring-1 ring-white/8 transition-all hover:-translate-y-1 hover:shadow-xl hover:ring-[rgba(0,207,255,0.4)]"
                  data-reveal-child
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[rgba(0,207,255,0.2)] ring-2 ring-[rgba(0,207,255,0.4)]">
                    <Award className="h-7 w-7 text-[color:var(--neon)]" />
                  </span>
                  <p className="text-pink-100 font-medium">{String(cert)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MEDIA - intro effect: slide from left */}
        {media.length > 0 && (
          <section className="rounded-2xl border border-white/12 bg-white/8 p-8 shadow-md hover:shadow-lg transition-all duration-300" data-reveal-section aria-label="Media">
            <h2 className="text-3xl font-semibold text-pink-200 mb-6 flex items-center gap-3" data-reveal-child>
              <Palette size={24} className="text-[color:var(--neon)]" /> Media
            </h2>
            <div className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
              {media.map((m, i) => {
                const label = m.type ? String(m.type) : 'Media';
                const labelNice = label.charAt(0).toUpperCase() + label.slice(1);
                return (
                  <div
                    key={i}
                    className="rounded-lg border border-white/12 bg-purple-950/50 p-6 transition-all hover:-translate-y-2 hover:shadow-xl hover:border-[rgba(0,207,255,0.4)]"
                    data-reveal-child
                  >
                    <h3 className="text-2xl font-medium text-pink-200">{m.title?.trim() || `Media ${i + 1}`}</h3>
                    <p className="text-pink-100 mt-2 font-medium">{labelNice}</p>
                    {m.link && (
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[color:var(--neon)] hover:underline mt-4 font-medium"
                      >
                        <LinkIcon size={18} /> View Media
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* CONTACT - intro effect: fade + scale */}
        <section className="rounded-2xl border border-white/12 bg-white/8 p-8 shadow-md hover:shadow-lg transition-all duration-300" data-reveal-section aria-label="Contact">
          <h2 className="text-3xl font-semibold text-pink-200 mb-6 flex items-center gap-3" data-reveal-child>
            <Mail size={24} className="text-[color:var(--neon)]" /> Contact
          </h2>
          <div className="text-pink-100 space-y-4" data-reveal-child>
            {data?.email && (
              <div className="flex items-center gap-3">
                <a href={`mailto:${data.email}`} className="flex items-center gap-3 hover:text-[color:var(--neon)] transition-colors">
                  <Mail size={18} /> {data.email}
                </a>
                <button
                  onClick={() => copy('email', data.email!)}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 ring-white/20 hover:bg-white/10 transition-all"
                  aria-label="Copy email"
                >
                  {copied === 'email' ? <Check size={16} /> : <Copy size={16} />} {copied === 'email' ? 'Copied' : 'Copy'}
                </button>
              </div>
            )}
            {data?.phone && (
              <div className="flex items-center gap-3">
                <a href={`tel:${data.phone}`} className="flex items-center gap-3 hover:text-[color:var(--neon)] transition-colors">
                  <Phone size={18} /> {data.phone}
                </a>
                <button
                  onClick={() => copy('phone', data.phone!)}
                  className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm ring-1 ring-white/20 hover:bg-white/10 transition-all"
                  aria-label="Copy phone"
                >
                  {copied === 'phone' ? <Check size={16} /> : <Copy size={16} />} {copied === 'phone' ? 'Copied' : 'Copy'}
                </button>
              </div>
            )}
            {data?.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-[color:var(--neon)] hover:underline transition-colors"
              >
                <Linkedin size={18} /> LinkedIn
              </a>
            )}

            {socials.length > 0 && (
              <div className="pt-4">
                <h3 className="text-lg font-medium text-pink-100/90">Social Links</h3>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {socials.map((s, i) => (
                    <a key={i} href={s.url!} target="_blank" rel="noopener noreferrer" className="text-[color:var(--neon)] hover:underline transition-colors">
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
                className="mt-4 inline-flex items-center gap-3 text-[color:var(--neon)] hover:underline transition-colors"
              >
                <Download size={18} /> Download CV
              </a>
            )}
          </div>
        </section>
      </main>

      {/* Back to top FAB - with visibility based on scroll */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 right-6 z-40 inline-flex h-12 w-12 items-center justify-center rounded-full bg-white/12 ring-2 ring-white/25 backdrop-blur-md hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--neon)] transition-all duration-300 ${scrollPct > 20 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        aria-label="Back to top"
      >
        <ChevronUp className="h-6 w-6" />
      </button>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#130a22] py-6 text-center text-pink-200/70 text-sm">
        <p>© {new Date().getFullYear()} {fullName} | Enhanced Classic Portfolio</p>
      </footer>

      {/* Global helpers - enhanced animations and tilt */}
      <style jsx global>{`
        :root { --neon: #00CFFF; }

        /* Reveal section */
        [data-reveal-section] { opacity: 0; transform: translateY(20px); transition: opacity 0.8s ease-out, transform 0.8s ease-out; }
        .reveal-in { opacity: 1; transform: translateY(0); }

        /* Staggered child reveal */
        [data-reveal-child] { opacity: 0; transform: translateY(12px) scale(0.98); transition: opacity 0.6s ease-out, transform 0.6s ease-out; }
        .reveal-child-in { opacity: 1; transform: translateY(0) scale(1); }

        /* Parallax bg */
        .parallax-bg { transform: translateY(calc(var(--scroll-pct, 0) * -0.2)); }

        /* Avatar tilt (CSS 3D) */
        .tilt-avatar { perspective: 1000px; transition: transform 0.3s ease-out; }
        .tilt-avatar:hover { transform: rotateY(8deg) rotateX(8deg); }

        /* Enhanced avatar ring */
        @keyframes spin360 { to { transform: rotate(360deg); } }
        .avatar-ring::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: conic-gradient(
            from 0deg,
            rgba(0,207,255,0.1) 0deg,
            rgba(255,0,204,0.5) 90deg,
            rgba(0,207,255,0.8) 180deg,
            rgba(168,85,247,0.6) 270deg,
            rgba(0,207,255,0.1) 360deg
          );
          animation: spin360 12s linear infinite;
          opacity: 0.95;
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 10px), #000 0);
                  mask: radial-gradient(farthest-side, transparent calc(100% - 10px), #000 0);
        }

        @media (prefers-reduced-motion: reduce) {
          .avatar-ring::before, .tilt-avatar:hover, [data-reveal-section], [data-reveal-child] { animation: none !important; transition: none !important; opacity: 1 !important; transform: none !important; }
        }

        /* Print-friendly - enhanced */
        @media print {
          .bg-[radial-gradient], .bg-[repeating-linear-gradient], button, a[href^="#"], .fixed { display: none !important; }
          body { background: #fff !important; color: #000 !important; -webkit-print-color-adjust: exact; }
          section { page-break-inside: avoid; border: none !important; box-shadow: none !important; }
          h2 { color: #333 !important; }
          p, a { color: #555 !important; }
        }
      `}</style>
    </div>
  );
}