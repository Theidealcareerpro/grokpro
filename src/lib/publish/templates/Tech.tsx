// publish: Classic template (no-JS safe reveals, sticky navbar, mobile drawer)
import * as React from 'react';
import {
  UserRound,
  Wand2,
  FolderGit2,
  BookOpen,
  Mail,
  Phone,
  Linkedin,
  Download,
  Award,
  Link as LinkIcon,
} from 'lucide-react';
import type { PortfolioData } from '@/lib/portfolio-types';

const SECTION_IDS = ['about', 'skills', 'projects', 'certifications', 'media', 'contact'] as const;

export default function ClassicPublish({ data }: { data: PortfolioData }) {
  // Guards
  const fullName = data?.fullName || 'Your Name';
  const role = data?.role || 'Classic Professional';
  const tagline = data?.tagline || 'Classic Tagline';
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
  const socials = Array.isArray(data?.socials) ? data!.socials.filter((s) => s && s.label && s.url) : [];

  const navItems: { id: (typeof SECTION_IDS)[number]; label: string; show: boolean }[] = [
    { id: 'about', label: 'About', show: !!data?.about },
    { id: 'skills', label: 'Skills', show: skills.length > 0 },
    { id: 'projects', label: 'Projects', show: projects.length > 0 },
    { id: 'certifications', label: 'Certifications', show: certifications.length > 0 },
    { id: 'media', label: 'Media', show: media.length > 0 },
    { id: 'contact', label: 'Contact', show: true },
  ];

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(120deg,#0d0b1e,#1a0f2e,#250e3a)' }}>
      {/* Top progress */}
      <div id="__progress" aria-hidden className="fixed inset-x-0 top-0 z-[60] h-1 bg-[var(--accent)] w-0 transition-[width]" />

      {/* Navbar */}
      <nav id="__nav" className="sticky top-0 z-50 bg-black/30 backdrop-blur border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            <a href="#about" className="flex items-baseline gap-3">
              <span className="text-lg font-semibold tracking-wide">{fullName}</span>
              <span className="hidden sm:inline text-xs text-[var(--muted)]">{role}</span>
            </a>

            <div className="hidden md:flex items-center gap-1">
              {navItems.filter(n => n.show).map(n => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  className="navlink px-3 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--accent)]"
                  aria-current="false"
                >
                  {n.label}
                </a>
              ))}
              {data?.cvFileDataUrl && (
                <a
                  href={data.cvFileDataUrl}
                  download={data.cvFileName ?? 'cv.pdf'}
                  className="ml-2 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-1.5 text-gray-900 font-semibold shadow-md hover:brightness-110"
                >
                  <Download className="h-4 w-4" /> CV
                </a>
              )}
            </div>

            <button
              id="__hamburger"
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/10 ring-1 ring-white/20"
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>

          {/* Mobile drawer */}
          <div id="__drawer" className="hidden md:hidden border-t border-white/10 py-2">
            <div className="flex flex-col">
              {navItems.filter(n => n.show).map(n => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  className="navlink px-3 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--accent)]"
                  aria-current="false"
                >
                  {n.label}
                </a>
              ))}
              {data?.cvFileDataUrl && (
                <a
                  href={data.cvFileDataUrl}
                  download={data.cvFileName ?? 'cv.pdf'}
                  className="mt-1 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2 text-gray-900 font-semibold shadow-md"
                >
                  <Download className="h-4 w-4" /> CV
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative overflow-hidden py-14 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(80%_50%_at_50%_0%,rgba(255,0,204,0.18)_0%,transparent_60%)]"
        />
        <div className="relative max-w-4xl mx-auto px-6">
          {/* Avatar ONLY if photo exists */}
          {photo && (
            <figure className="group relative w-fit mx-auto mb-7" data-reveal>
              <span aria-hidden className="absolute -inset-8 -z-10 rounded-[36px] blur-3xl opacity-70 bg-[radial-gradient(60%_60%_at_50%_50%,rgba(255,0,204,0.28)_0%,transparent_60%)]" />
              <span aria-hidden className="avatar-ring absolute inset-[-12px] rounded-[28px]" />
              <div className="relative h-40 w-40 md:h-44 md:w-44 rounded-[28px] p-[2px] classic-frame shadow-2xl">
                <div className="relative h-full w-full overflow-hidden rounded-[26px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
                  <img src={photo} alt={fullName} className="absolute inset-0 h-full w-full object-cover" />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.16),transparent)] transition-transform duration-[1200ms] ease-out group-hover:translate-x-[120%]"
                  />
                </div>
              </div>
            </figure>
          )}

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight" data-reveal>{fullName}</h1>
          <p className="text-lg text-[var(--subtle)] mt-2" data-reveal>{role}</p>
          <p className="text-sm text-[var(--muted)] mt-2 text-justify" data-reveal>{tagline}</p>
          <p className="text-xs text-[var(--muted)] mt-1" data-reveal>{location}</p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3" data-reveal>
            {data?.cvFileDataUrl && (
              <a
                href={data.cvFileDataUrl}
                download={data?.cvFileName ?? 'cv.pdf'}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 font-semibold text-gray-900 shadow-md"
              >
                <Download className="h-4 w-4" /> Download CV
              </a>
            )}
            {data?.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)] px-5 py-2 font-semibold text-[var(--accent)] hover:bg-[var(--accent)] hover:text-gray-900"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 pb-10 space-y-8">
        {/* About */}
        {data?.about && (
          <section id="about" className="card" data-entrance>
            <header className="mb-3 flex items-center gap-3" data-reveal>
              <span className="icon-badge"><UserRound className="h-5 w-5 text-[var(--accent)]" /></span>
              <h2 className="text-2xl font-semibold">About Me</h2>
            </header>
            <p className="text-[var(--text)] leading-relaxed text-justify" data-reveal>{data.about}</p>
          </section>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <section id="skills" className="card" data-entrance>
            <header className="mb-3 flex items-center gap-3" data-reveal>
              <span className="icon-badge"><Wand2 className="h-5 w-5 text-[var(--accent)]" /></span>
              <h2 className="text-2xl font-semibold">Skills</h2>
            </header>
            <div className="mx-auto max-w-3xl flex flex-col gap-3">
              {skills.map((s, i) => (
                <div key={i} className="row" data-reveal style={{ ['--stagger' as never]: String(i % 8) }}>
                  <span className="text-sm text-[var(--text)] text-justify">{String(s)}</span>
                  <span className="h-2 w-2 rounded-full bg-[var(--accent)]/90" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section id="projects" className="card" data-entrance>
            <header className="mb-3 flex items-center gap-3" data-reveal>
              <span className="icon-badge"><FolderGit2 className="h-5 w-5 text-[var(--accent)]" /></span>
              <h2 className="text-2xl font-semibold">Projects</h2>
            </header>
            <div className="mx-auto max-w-3xl flex flex-col gap-4">
              {projects.map((p, i) => (
                <article key={i} className="tile" data-reveal style={{ ['--stagger' as never]: String(i % 8) }}>
                  <h3 className="text-xl font-medium">{p.name?.trim() || `Project ${i + 1}`}</h3>
                  {p.description?.trim() && <p className="text-[var(--subtle)] mt-2 text-justify leading-relaxed">{p.description}</p>}
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline mt-3">
                      <LinkIcon size={16} /> View
                    </a>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section id="certifications" className="card" data-entrance>
            <header className="mb-3 flex items-center gap-3" data-reveal>
              <span className="icon-badge"><BookOpen className="h-5 w-5 text-[var(--accent)]" /></span>
              <h2 className="text-2xl font-semibold">Certifications</h2>
            </header>
            <div className="mx-auto max-w-3xl flex flex-col gap-3">
              {certifications.map((cert, index) => (
                <div key={index} className="tile flex items-center gap-3" data-reveal style={{ ['--stagger' as never]: String(index % 8) }}>
                  <span className="icon-badge"><Award className="h-5 w-5 text-[var(--accent)]" /></span>
                  <p className="text-[var(--text)] text-justify">{String(cert)}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Media */}
        {media.length > 0 && (
          <section id="media" className="card" data-entrance>
            <header className="mb-3 flex items-center gap-3" data-reveal>
              <span className="icon-badge"><UserRound className="h-5 w-5 text-[var(--accent)]" /></span>
              <h2 className="text-2xl font-semibold">Media</h2>
            </header>
            <div className="mx-auto max-w-3xl flex flex-col gap-4">
              {media.map((m, i) => {
                const t = m.type ? String(m.type) : 'Media';
                const label = t.charAt(0).toUpperCase() + t.slice(1);
                return (
                  <div key={i} className="tile" data-reveal style={{ ['--stagger' as never]: String(i % 8) }}>
                    <h3 className="text-xl font-medium">{m.title?.trim() || `Media ${i + 1}`}</h3>
                    <p className="text-[var(--subtle)] mt-1 text-justify">{label}</p>
                    {m.link && (
                      <a href={m.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline mt-2">
                        <LinkIcon size={16} /> View
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Contact */}
        <section id="contact" className="card" data-entrance>
          <header className="mb-3 flex items-center gap-3" data-reveal>
            <span className="icon-badge"><Mail className="h-5 w-5 text-[var(--accent)]" /></span>
            <h2 className="text-2xl font-semibold">Contact</h2>
          </header>
          <div className="space-y-2">
            {data?.email && (
              <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:text-[var(--accent)]" data-reveal>
                <Mail size={16} /> {data.email}
              </a>
            )}
            {data?.phone && (
              <a href={`tel:${data.phone}`} className="flex items-center gap-2 hover:text-[var(--accent)]" data-reveal>
                <Phone size={16} /> {data.phone}
              </a>
            )}
            {data?.linkedin && (
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--accent)] hover:underline" data-reveal>
                <Linkedin size={16} /> LinkedIn
              </a>
            )}
            {socials.length > 0 && (
              <div className="pt-2" data-reveal>
                <h3 className="text-base font-medium text-[var(--subtle)]">Social Links</h3>
                <div className="mt-1 grid grid-cols-1 gap-1">
                  {socials.map((s, i) => (
                    <a key={i} href={s.url!} target="_blank" rel="noopener noreferrer" className="text-[var(--accent)] hover:underline">
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {data?.cvFileDataUrl && (
              <a href={data.cvFileDataUrl} download={data.cvFileName ?? 'cv.pdf'} className="mt-3 inline-flex items-center gap-2 text-[var(--accent)] hover:underline" data-reveal>
                <Download size={16} /> Download CV
              </a>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-[var(--footer)] py-5 text-center text-[var(--subtle)]">
        <p>© {new Date().getFullYear()} {fullName} | Classic Portfolio</p>
      </footer>

      {/* Styles */}
      <style>{`
        /* Executive token set */
        :root {
          --accent:#e3b04b;
          --text:#ffeafe;
          --subtle:#ffd7fb;
          --muted:#f4c8f6cc;
          --card: rgba(76,29,149,.28);
          --cardRing: rgba(227,176,75,.35);
          --badgeBg: rgba(227,176,75,.10);
          --badgeRing: rgba(227,176,75,.35);
          --footer:#130a22;
        }

        .classic-frame{
          background:
            conic-gradient(from 210deg, rgba(255,255,255,.25), rgba(255,255,255,0) 30% 70%, rgba(255,255,255,.25)),
            linear-gradient(180deg, #f7e9c6, var(--accent) 35%, #c9982f 70%, #b88c14 100%);
          border-radius:28px;padding:2px;
        }
        .icon-badge{display:inline-flex;align-items:center;justify-content:center;height:36px;width:36px;border-radius:10px;background:var(--badgeBg);box-shadow:inset 0 0 0 1px var(--badgeRing);}

        .card{position:relative;border-radius:12px;border:1px solid rgba(255,255,255,.1);background:rgba(255,255,255,.05);padding:20px;box-shadow:0 1px 3px rgba(0,0,0,.2);}
        .row{display:flex;align-items:center;justify-content:space-between;border-radius:10px;background:rgba(0,0,0,.25);padding:12px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.1);}
        .tile{border-radius:10px;border:1px solid rgba(255,255,255,.1);background:rgba(0,0,0,.25);padding:16px;}

        /* Navbar underline */
        .navlink{position:relative}
        .navlink::after{
          content:'';position:absolute;left:0;right:0;bottom:4px;height:2px;
          background:linear-gradient(90deg,var(--accent),transparent);
          transform:scaleX(0);transform-origin:left;transition:transform .35s ease,opacity .35s ease;opacity:.7;
        }
        .navlink:hover::after,.navlink[aria-current="true"]::after{transform:scaleX(1);opacity:1}

        /* === No-JS safe reveals === */
        [data-reveal]{} /* visible by default */
        html.js [data-reveal]{opacity:0;transform:translateY(12px)}
        html.js .reveal-in{opacity:1;transform:translateY(0);transition:opacity .6s ease,transform .6s ease}
        html.js [data-reveal]{animation-delay:calc(var(--stagger,0)*18ms)}

        section[data-entrance]{}
        html.js section[data-entrance]{opacity:0;transform:translateY(18px) scale(.985);filter:blur(6px);will-change:opacity,transform,filter}
        html.js section[data-entrance].in{opacity:1;transform:none;filter:none;transition:opacity .65s cubic-bezier(.22,.75,.2,1),transform .65s cubic-bezier(.22,.75,.2,1),filter .65s ease}
        html.js section[data-entrance]::before{
          content:'';position:absolute;inset:0;pointer-events:none;
          background:radial-gradient(120% 120% at -20% 0%, rgba(255,255,255,.08), transparent 60%),linear-gradient(180deg,rgba(255,255,255,.03),rgba(255,255,255,.02));
          clip-path:inset(0 100% 0 0);opacity:0;transition:clip-path .9s cubic-bezier(.22,.75,.2,1),opacity .9s ease
        }
        html.js section[data-entrance].in::before{clip-path:inset(0 0 0 0);opacity:.06}

        @keyframes spin360{to{transform:rotate(360deg)}}
        .avatar-ring::before{
          content:'';position:absolute;inset:0;border-radius:inherit;
          background:conic-gradient(from 0deg, rgba(227,176,75,0) 0deg, rgba(227,176,75,.6) 120deg, rgba(255,255,255,.35) 220deg, rgba(227,176,75,0) 360deg);
          animation:spin360 16s linear infinite;opacity:.9;
          -webkit-mask:radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
                  mask:radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
        }

        @media (prefers-reduced-motion:reduce){
          .avatar-ring::before{animation:none!important}
          html.js [data-reveal]{opacity:1!important;transform:none!important}
          html.js section[data-entrance]{opacity:1!important;transform:none!important;filter:none!important}
          html.js section[data-entrance]::before{clip-path:none!important;opacity:.02!important;transition:none!important}
          .navlink::after{transition:none!important}
        }
      `}</style>

      {/* Runtime: add html.js, reveals, progress, nav, drawer, active link */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function(){
            var doc = document.documentElement;
            try{ doc.classList.add('js'); }catch(_){}

            var prog = document.getElementById('__progress');
            var nav = document.getElementById('__nav');
            var hamburger = document.getElementById('__hamburger');
            var drawer = document.getElementById('__drawer');
            var open = false;

            var MENU_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>';
            var X_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

            // Smooth scroll
            document.querySelectorAll('a[href^="#"]').forEach(function(a){
              a.addEventListener('click', function(ev){
                var href = a.getAttribute('href')||'';
                var id = href.slice(1);
                var target = document.getElementById(id);
                if (target){
                  ev.preventDefault();
                  target.scrollIntoView({ behavior:'smooth', block:'start' });
                  if (open && drawer){ drawer.classList.add('hidden'); open=false; if (hamburger) hamburger.innerHTML = MENU_SVG; }
                }
              });
            });

            // Progress + shadow
            function onScroll(){
              var h = doc.scrollHeight - doc.clientHeight;
              var pct = h>0 ? (doc.scrollTop/h)*100 : 0;
              if (prog) prog.style.width = pct + '%';
              if (nav){
                if (window.scrollY > 8) nav.classList.add('shadow-[0_8px_30px_rgba(0,0,0,0.35)]');
                else nav.classList.remove('shadow-[0_8px_30px_rgba(0,0,0,0.35)]');
              }
            }
            onScroll();
            window.addEventListener('scroll', onScroll, { passive:true });

            // Drawer
            if (hamburger && drawer){
              hamburger.addEventListener('click', function(){
                open = !open;
                drawer.classList.toggle('hidden', !open);
                hamburger.innerHTML = open ? X_SVG : MENU_SVG;
              });
            }

            // Reveals
            var reduce = false; try{ reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; }catch(_){}
            if (reduce || !('IntersectionObserver' in window)) {
              document.querySelectorAll('[data-reveal]').forEach(function(n){ n.classList.add('reveal-in'); });
              document.querySelectorAll('section[data-entrance]').forEach(function(s){ s.classList.add('in'); });
            } else {
              var io = new IntersectionObserver(function(entries){
                entries.forEach(function(e, i){
                  if (e.isIntersecting){
                    var el = e.target;
                    el.classList.add('reveal-in');
                    el.style.setProperty('--stagger', String(i % 8));
                    io.unobserve(el);
                  }
                });
              }, { rootMargin:'0px 0px -10% 0px', threshold:0.12 });
              document.querySelectorAll('[data-reveal]').forEach(function(n){ io.observe(n); });

              var sec = new IntersectionObserver(function(entries){
                entries.forEach(function(e){
                  if (e.isIntersecting){ e.target.classList.add('in'); sec.unobserve(e.target); }
                });
              }, { rootMargin:'0px 0px -10% 0px', threshold:0.12 });
              document.querySelectorAll('section[data-entrance]').forEach(function(s){ sec.observe(s); });
            }

            // Active link sync
            try{
              var spy = new IntersectionObserver(function(entries){
                var vis = entries.filter(function(e){return e.isIntersecting;}).sort(function(a,b){return b.intersectionRatio - a.intersectionRatio;})[0];
                if (!vis || !vis.target || !vis.target.id) return;
                var id = vis.target.id;
                document.querySelectorAll('.navlink').forEach(function(l){
                  var href = l.getAttribute('href')||'';
                  var match = href.replace('#','') === id;
                  if (match) l.setAttribute('aria-current','true'); else l.removeAttribute('aria-current');
                });
              }, { rootMargin:'-40% 0px -50% 0px', threshold:[0,.2,.5,.8,1] });
              ${SECTION_IDS.map(id => `var el_${id}=document.getElementById('${id}'); if (el_${id}) spy.observe(el_${id});`).join('\n')}
            }catch(_){}

            // Keyboard 1..N
            window.addEventListener('keydown', function(e){
              if (e.ctrlKey||e.metaKey||e.altKey) return;
              var ids=${JSON.stringify(SECTION_IDS)};
              var n=Number(e.key)-1;
              if (n>=0 && n<ids.length){
                var el=document.getElementById(ids[n]); if (el) el.scrollIntoView({behavior:'smooth',block:'start'});
              }
            });
          })();
        `,
        }}
      />
    </div>
  );
}
