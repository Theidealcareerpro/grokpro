// publish: Tech template (no-JS safe reveals)
import * as React from 'react';
import {
  Code,
  BookOpen,
  Link as LinkIcon,
  Mail,
  Phone,
  Linkedin,
  Download,
  Award,
} from 'lucide-react';
import type { PortfolioData } from '@/lib/portfolio-types';

const SECTION_IDS = ['about', 'skills', 'projects', 'certifications', 'media', 'contact'] as const;

export default function TechPublish({ data }: { data: PortfolioData }) {
  // Safe guards for optional arrays/strings
  const fullName = data?.fullName || 'Your Name';
  const role = data?.role || 'Tech Professional';
  const tagline = data?.tagline || 'Tech Tagline';
  const location = data?.location || 'Location';
  const photo = data?.photoDataUrl;

  const skills = Array.isArray(data?.skills) ? data!.skills.filter(Boolean) : [];
  const projects = Array.isArray(data?.projects)
    ? data!.projects.filter((p) => p && ((p.name && p.name.trim()) || (p.description && p.description.trim())))
    : [];
  const certifications = Array.isArray(data?.certifications) ? data!.certifications.filter(Boolean) : [];
  const media = Array.isArray(data?.media)
    ? data!.media.filter((m) => m && ((m.title && m.title.trim()) || (m.link && m.link.trim())))
    : [];
  const socials = Array.isArray(data?.socials)
    ? data!.socials.filter((s) => s && s.label && s.url)
    : [];

  const navItems: { id: (typeof SECTION_IDS)[number]; label: string; show: boolean }[] = [
    { id: 'about', label: 'About', show: !!data?.about },
    { id: 'skills', label: 'Skills', show: skills.length > 0 },
    { id: 'projects', label: 'Projects', show: projects.length > 0 },
    { id: 'certifications', label: 'Certifications', show: certifications.length > 0 },
    { id: 'media', label: 'Media', show: media.length > 0 },
    { id: 'contact', label: 'Contact', show: true },
  ];

  return (
    <div className="bg-gray-950 text-gray-100 min-h-screen antialiased">
      {/* ===== Top progress bar ===== */}
      <div id="__progress" aria-hidden className="fixed inset-x-0 top-0 z-[60] h-1 bg-[color:var(--neon)] w-0 transition-[width]" />

      {/* ===== NAVBAR ===== */}
      <nav id="__nav" className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            {/* Brand */}
            <a href="#about" className="flex items-baseline gap-3">
              <span className="text-lg font-semibold tracking-wide text-white">{fullName}</span>
              <span className="hidden sm:inline text-xs text-gray-400">{role}</span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.filter((n) => n.show).map((n) => (
                <a key={n.id} href={`#${n.id}`} className="navlink px-3 py-2 text-sm font-medium text-gray-400 hover:text-[color:var(--neon)]" aria-current="false">
                  {n.label}
                </a>
              ))}
              {data?.cvFileDataUrl && (
                <a
                  href={data.cvFileDataUrl}
                  download={data.cvFileName ?? 'cv.pdf'}
                  className="ml-2 inline-flex items-center gap-2 rounded-full bg-[color:var(--neon)] px-4 py-1.5 text-gray-900 font-semibold shadow-md hover:brightness-110"
                >
                  <Download className="h-4 w-4" /> CV
                </a>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              id="__hamburger"
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/20"
              aria-label="Toggle menu"
            >
              {/* default is menu icon; replaced in script */}
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            </button>
          </div>

          {/* Mobile drawer */}
          <div id="__drawer" className="hidden md:hidden border-t border-white/10 py-2">
            <div className="flex flex-col">
              {navItems.filter((n) => n.show).map((n) => (
                <a key={n.id} href={`#${n.id}`} className="navlink px-3 py-2 text-sm font-medium text-gray-400 hover:text-[color:var(--neon)]" aria-current="false">
                  {n.label}
                </a>
              ))}
              {data?.cvFileDataUrl && (
                <a
                  href={data.cvFileDataUrl}
                  download={data.cvFileName ?? 'cv.pdf'}
                  className="mt-1 inline-flex items-center gap-2 rounded-full bg-[color:var(--neon)] px-4 py-2 text-gray-900 font-semibold shadow-md"
                >
                  <Download className="h-4 w-4" /> CV
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <header className="relative overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950">
        {/* subtle neon background glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_0%,rgba(0,207,255,0.22)_0%,transparent_60%)]"
        />
        <div className="max-w-4xl mx-auto px-6 py-12 text-center relative">
          {/* Avatar only if photo exists */}
          {photo && (
            <figure className="group relative w-fit mx-auto mb-6" data-reveal>
              <span
                aria-hidden
                className="absolute -inset-8 -z-10 rounded-full blur-2xl opacity-60 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(0,207,255,0.26)_0%,transparent_60%)]"
              />
              <span aria-hidden className="avatar-ring absolute inset-[-10px] rounded-[28px]" />
              <div className="relative h-36 w-36 md:h-40 md:w-40 rounded-[28px] p-[3px] bg-gradient-to-b from-[#7dd3fc] via-[#38bdf8] to-[#00cfff] shadow-2xl">
                <div className="relative h-full w-full overflow-hidden rounded-[24px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
                  <img src={photo} alt={fullName} className="absolute inset-0 h-full w-full object-cover" />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.12),transparent)] transition-transform duration-[1200ms] ease-out group-hover:translate-x-[120%]"
                  />
                </div>
              </div>
            </figure>
          )}

          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight" data-reveal>{fullName}</h1>
          <p className="text-lg text-gray-400 mt-1" data-reveal>{role}</p>
          <p className="text-sm text-gray-500 mt-1 text-justify" data-reveal>{tagline}</p>
          <p className="text-xs text-gray-600 mt-1" data-reveal>{location}</p>

          {/* CTAs */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3" data-reveal>
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
          <section id="about" className="relative rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm hover:shadow-md transition" data-entrance>
            <h2 className="text-xl font-semibold text-[color:var(--neon)] mb-2 flex items-center" data-reveal>
              <Code size={20} className="mr-2" /> About Me
            </h2>
            <p className="text-gray-300 leading-relaxed text-justify" data-reveal>{data.about}</p>
          </section>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <section id="skills" className="relative rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm" data-entrance>
            <h2 className="text-xl font-semibold text-[color:var(--neon)] mb-3 flex items-center" data-reveal>
              <Code size={20} className="mr-2" /> Skills
            </h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-3">
              {skills.map((s, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg bg-gray-900/40 p-3 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[rgba(0,207,255,0.35)]"
                  data-reveal
                  style={{ ['--stagger' as never]: String(i % 8) }}
                >
                  <span className="text-sm text-gray-200 text-justify">{String(s)}</span>
                  <span className="h-2 w-2 rounded-full bg-[color:var(--neon)]/80" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <section id="projects" className="relative rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm" data-entrance>
            <h2 className="text-xl font-semibold text-[color:var(--neon)] mb-3 flex items-center" data-reveal>
              <Code size={20} className="mr-2" /> Projects
            </h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-4">
              {projects.map((p, i) => (
                <article
                  key={i}
                  className="rounded-lg border border-white/10 bg-gray-900/40 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-[rgba(0,207,255,0.35)]"
                  data-reveal
                  style={{ ['--stagger' as never]: String(i % 8) }}
                >
                  <h3 className="text-lg font-medium text-white">{p.name?.trim() || `Project ${i + 1}`}</h3>
                  {p.description?.trim() && (
                    <p className="text-gray-400 mt-2 text-justify leading-relaxed">{p.description}</p>
                  )}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[color:var(--neon)] hover:underline mt-3"
                    >
                      <LinkIcon size={16} /> View
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* CERTIFICATIONS */}
        {certifications.length > 0 && (
          <section id="certifications" className="relative rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm" data-entrance>
            <h2 className="text-xl font-semibold text-[color:var(--neon)] mb-3 flex items-center" data-reveal>
              <BookOpen size={20} className="mr-2" /> Certifications
            </h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-3">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-gray-900/40 p-3 ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[rgba(0,207,255,0.3)]"
                  data-reveal
                  style={{ ['--stagger' as never]: String(index % 8) }}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[rgba(0,207,255,0.15)] ring-1 ring-[rgba(0,207,255,0.35)]">
                    <Award className="h-6 w-6 text-[color:var(--neon)]" />
                  </span>
                  <p className="text-gray-200 text-justify">{String(cert)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* MEDIA */}
        {media.length > 0 && (
          <section id="media" className="relative rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm" data-entrance>
            <h2 className="text-xl font-semibold text-[color:var(--neon)] mb-3 flex items-center" data-reveal>
              <Code size={20} className="mr-2" /> Media
            </h2>
            <div className="mx-auto max-w-3xl flex flex-col gap-4">
              {media.map((m, i) => {
                const labelRaw = m.type ? String(m.type) : 'Media';
                const label = labelRaw.charAt(0).toUpperCase() + labelRaw.slice(1);
                return (
                  <div
                    key={i}
                    className="rounded-lg border border-white/10 bg-gray-900/40 p-4 transition hover:border-[rgba(0,207,255,0.35)]"
                    data-reveal
                    style={{ ['--stagger' as never]: String(i % 8) }}
                  >
                    <h3 className="text-lg font-medium">{m.title?.trim() || `Media ${i + 1}`}</h3>
                    <p className="text-gray-400 mt-1 text-justify">{label}</p>
                    {m.link && (
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[color:var(--neon)] hover:underline mt-2"
                      >
                        <LinkIcon size={16} /> View
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* CONTACT */}
        <section id="contact" className="relative rounded-xl border border-white/10 bg-white/5 p-5 shadow-sm" data-entrance>
          <h2 className="text-xl font-semibold text-[color:var(--neon)] mb-2 flex items-center" data-reveal>
            <Mail size={20} className="mr-2" /> Contact
          </h2>
          <div className="text-gray-300 space-y-2">
            {data?.email && (
              <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:text-[color:var(--neon)]" data-reveal>
                <Mail size={16} /> {data.email}
              </a>
            )}
            {data?.phone && (
              <a href={`tel:${data.phone}`} className="flex items-center gap-2 hover:text-[color:var(--neon)]" data-reveal>
                <Phone size={16} /> {data.phone}
              </a>
            )}
            {data?.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[color:var(--neon)] hover:underline"
                data-reveal
              >
                <Linkedin size={16} /> LinkedIn
              </a>
            )}

            {socials.length > 0 && (
              <div className="pt-2" data-reveal>
                <h3 className="text-base font-medium text-gray-200/90">Social Links</h3>
                <div className="mt-1 grid grid-cols-1 gap-1">
                  {socials.map((s, i) => (
                    <a key={i} href={s.url!} target="_blank" rel="noopener noreferrer" className="text-[color:var(--neon)] hover:underline">
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
                data-reveal
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

      {/* Global styles */}
      <style>{`
        :root { --neon:#00CFFF; }

        /* Navbar underline animation */
        .navlink { position: relative; }
        .navlink::after {
          content: '';
          position: absolute; left: 0; right: 0; bottom: 4px; height: 2px;
          background: linear-gradient(90deg, var(--neon), transparent);
          transform: scaleX(0); transform-origin: left;
          transition: transform .35s ease, opacity .35s ease;
          opacity: .7;
        }
        .navlink:hover::after, .navlink[aria-current="true"]::after { transform: scaleX(1); opacity: 1; }

        /* === No-JS safe reveals ===
           Default: visible. When JS runs, it adds 'js' to <html>. Only then do we apply hidden -> in animation.
        */
        /* per-item reveal */
        [data-reveal] { /* visible by default */ }
        html.js [data-reveal] { opacity: 0; transform: translateY(12px); }
        html.js .reveal-in { opacity: 1; transform: translateY(0); transition: opacity .6s ease, transform .6s ease; }
        html.js [data-reveal] { animation-delay: calc(var(--stagger, 0) * 18ms); }

        /* strong section box reveal */
        section[data-entrance] { /* visible by default */ }
        html.js section[data-entrance] {
          opacity: 0;
          transform: translateY(18px) scale(.985);
          filter: blur(6px);
          will-change: opacity, transform, filter;
        }
        html.js section[data-entrance].in {
          opacity: 1;
          transform: none;
          filter: none;
          transition: opacity .65s cubic-bezier(.22,.75,.2,1),
                      transform .65s cubic-bezier(.22,.75,.2,1),
                      filter .65s ease;
        }
        html.js section[data-entrance]::before {
          content: '';
          position: absolute; inset: 0; pointer-events: none;
          background:
            radial-gradient(120% 120% at -20% 0%, rgba(255,255,255,.08), transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,.03), rgba(255,255,255,.02));
          clip-path: inset(0 100% 0 0);
          opacity: 0;
          transition: clip-path .9s cubic-bezier(.22,.75,.2,1), opacity .9s ease;
        }
        html.js section[data-entrance].in::before { clip-path: inset(0 0 0 0); opacity: .06; }

        /* Avatar neon ring */
        @keyframes spin360 { to { transform: rotate(360deg); } }
        .avatar-ring::before {
          content: '';
          position: absolute; inset: 0; border-radius: inherit;
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
          html.js [data-reveal] { opacity: 1 !important; transform: none !important; }
          html.js section[data-entrance] { opacity: 1 !important; transform: none !important; filter: none !important; }
          html.js section[data-entrance]::before { clip-path: none !important; opacity: .02 !important; transition: none !important; }
          .navlink::after { transition: none !important; }
        }
      `}</style>

      {/* Tiny runtime (adds 'js' class; safe fallbacks if JS blocked) */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function () {
            var doc = document.documentElement;
            // mark that JS is available (enables animated states, otherwise content stays visible)
            try { doc.classList.add('js'); } catch(_){}

            var prog = document.getElementById('__progress');
            var nav = document.getElementById('__nav');
            var hamburger = document.getElementById('__hamburger');
            var drawer = document.getElementById('__drawer');
            var isOpen = false;

            // Icons
            var MENU_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
            var X_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

            // Smooth scroll for in-page links
            function enhanceAnchor(a){
              a.addEventListener('click', function(ev){
                var href = a.getAttribute('href') || '';
                if (href.startsWith('#')) {
                  var target = document.getElementById(href.slice(1));
                  if (target) {
                    ev.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    if (isOpen && drawer) { drawer.classList.add('hidden'); isOpen = false; if (hamburger) hamburger.innerHTML = MENU_SVG; }
                  }
                }
              });
            }
            document.querySelectorAll('a[href^="#"]').forEach(enhanceAnchor);

            // Scroll progress + navbar shadow
            function onScroll() {
              var h = doc.scrollHeight - doc.clientHeight;
              var pct = h > 0 ? (doc.scrollTop / h) * 100 : 0;
              if (prog) prog.style.width = pct + '%';
              if (nav) {
                if (window.scrollY > 8) nav.classList.add('shadow-[0_8px_30px_rgba(0,0,0,0.35)]');
                else nav.classList.remove('shadow-[0_8px_30px_rgba(0,0,0,0.35)]');
              }
            }
            onScroll();
            window.addEventListener('scroll', onScroll, { passive: true });

            // Mobile drawer toggle
            if (hamburger && drawer) {
              hamburger.addEventListener('click', function(){
                isOpen = !isOpen;
                drawer.classList.toggle('hidden', !isOpen);
                hamburger.innerHTML = isOpen ? X_SVG : MENU_SVG;
              });
            }

            // Per-item reveal + Section entrance (with fallbacks)
            var prefersReduced = false;
            try { prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (_){}
            if (prefersReduced || !('IntersectionObserver' in window)) {
              document.querySelectorAll('[data-reveal]').forEach(function(n){ n.classList.add('reveal-in'); });
              document.querySelectorAll('section[data-entrance]').forEach(function(s){ s.classList.add('in'); });
            } else {
              var obs = new IntersectionObserver(function(entries){
                entries.forEach(function(e, idx){
                  if (e.isIntersecting) {
                    var el = e.target;
                    el.classList.add('reveal-in');
                    el.style.setProperty('--stagger', String(idx % 8));
                    obs.unobserve(el);
                  }
                });
              }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
              document.querySelectorAll('[data-reveal]').forEach(function(n){ obs.observe(n); });

              var sec = new IntersectionObserver(function(entries){
                entries.forEach(function(e){
                  if (e.isIntersecting) {
                    e.target.classList.add('in');
                    sec.unobserve(e.target);
                  }
                });
              }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
              document.querySelectorAll('section[data-entrance]').forEach(function(s){ sec.observe(s); });
            }

            // Active link sync
            try {
              var spy = new IntersectionObserver(function(entries){
                var visible = entries.filter(function(e){ return e.isIntersecting; }).sort(function(a,b){ return b.intersectionRatio - a.intersectionRatio; })[0];
                if (!visible || !visible.target || !visible.target.id) return;
                var id = visible.target.id;
                document.querySelectorAll('.navlink').forEach(function(l){
                  var href = l.getAttribute('href') || '';
                  var match = href.replace('#','') === id;
                  if (match) l.setAttribute('aria-current','true'); else l.removeAttribute('aria-current');
                });
              }, { rootMargin: '-40% 0px -50% 0px', threshold: [0, .2, .5, .8, 1] });
              ${SECTION_IDS.map((id) => `var el_${id} = document.getElementById('${id}'); if (el_${id}) spy.observe(el_${id});`).join('\n')}
            } catch (_){}

            // Keyboard jumps (1..N)
            window.addEventListener('keydown', function(e){
              if (e.ctrlKey || e.metaKey || e.altKey) return;
              var ids = ${JSON.stringify(SECTION_IDS)};
              var idx = Number(e.key) - 1;
              if (idx >= 0 && idx < ids.length) {
                var el = document.getElementById(ids[idx]);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            });
          })();
        `,
        }}
      />
    </div>
  );
}
