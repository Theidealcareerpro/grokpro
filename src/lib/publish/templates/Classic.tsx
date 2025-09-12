// src/lib/publish/templates/Classic.tsx
import * as React from 'react';
import {
  Palette,
  BookOpen,
  Link as LinkIcon,
  Mail,
  Phone,
  Linkedin,
  Download,
  Award,
  Circle,
} from 'lucide-react';
import type { PortfolioData } from '@/lib/portfolio-types';

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'certifications', 'media', 'contact'] as const;

export default function Classic({ data }: { data: PortfolioData }) {
  const fullName = data?.fullName || 'Your Name';
  const role = data?.role || 'Professional';
  const tagline = data?.tagline || 'Executive profile & selected work.';
  const location = data?.location || '';
  const photo = data?.photoDataUrl;

  const skills = Array.isArray(data?.skills) ? data!.skills.filter(Boolean) : [];
  const projects = Array.isArray(data?.projects)
    ? data!.projects.filter(
        (p) => p && ((p.name && p.name.trim()) || (p.description && p.description.trim()) || (p.link && p.link.trim()))
      )
    : [];
  const certifications = Array.isArray(data?.certifications) ? data!.certifications.filter(Boolean) : [];
  const media = Array.isArray(data?.media)
    ? data!.media.filter((m) => m && ((m.title && m.title.trim()) || (m.link && m.link.trim())))
    : [];
  const socials = Array.isArray(data?.socials) ? data!.socials.filter((s) => s && s.label && s.url) : [];

  return (
    <div className="noir-surface text-white min-h-screen antialiased">
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] rounded-md bg-white/10 px-3 py-2 ring-1 ring-white/20 backdrop-blur"
      >
        Skip to content
      </a>

      {/* Spotlight + progress */}
      <div aria-hidden className="fixed inset-0 pointer-events-none z-[1]" id="__spotlight" />
      <div
        aria-hidden
        id="__progress"
        className="fixed inset-x-0 top-0 z-50 h-1 bg-gradient-to-r from-[var(--accent)] via-[var(--accent-2)] to-[var(--accent)] w-0"
      />

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 backdrop-blur bg-[color:var(--nav)]/70 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex h-14 items-center justify-between">
            <a href="#home" className="flex items-baseline gap-3" data-navlink>
              <span className="text-lg font-semibold tracking-wide text-[var(--ink)]">{fullName}</span>
              <span className="hidden md:inline text-xs text-[var(--muted)]">{role}</span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              <a className="navlink" href="#about" data-navlink>About</a>
              <a className="navlink" href="#skills" data-navlink>Skills</a>
              <a className="navlink" href="#projects" data-navlink>Projects</a>
              {certifications.length > 0 && (
                <a className="navlink" href="#certifications" data-navlink>Certifications</a>
              )}
              {media.length > 0 && (
                <a className="navlink" href="#media" data-navlink>Media</a>
              )}
              <a className="navlink" href="#contact" data-navlink>Contact</a>
              {data?.cvFileDataUrl && (
                <a
                  data-magnet
                  href={data.cvFileDataUrl}
                  download={data.cvFileName ?? 'cv.pdf'}
                  className="ml-2 inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-1.5 text-[var(--ink-deep)] font-semibold shadow-md hover:brightness-110"
                >
                  <Download className="h-4 w-4" /> CV
                </a>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              id="__menu"
              aria-label="Toggle menu"
              className="md:hidden inline-flex h-9 w-9 items-center justify-center rounded-md bg-white/5 ring-1 ring-white/10"
            >
              {/* simple icon bars via CSS */}
              <span className="block h-0.5 w-5 bg-white mb-1.5" />
              <span className="block h-0.5 w-5 bg-white mb-1.5" />
              <span className="block h-0.5 w-5 bg-white" />
            </button>
          </div>

          {/* Mobile drawer */}
          <div id="__drawer" className="hidden md:!hidden border-t border-white/10 py-2">
            <div className="flex flex-col">
              <a className="navlink py-2" href="#about" data-navlink>About</a>
              <a className="navlink py-2" href="#skills" data-navlink>Skills</a>
              <a className="navlink py-2" href="#projects" data-navlink>Projects</a>
              {certifications.length > 0 && (
                <a className="navlink py-2" href="#certifications" data-navlink>Certifications</a>
              )}
              {media.length > 0 && (
                <a className="navlink py-2" href="#media" data-navlink>Media</a>
              )}
              <a className="navlink py-2" href="#contact" data-navlink>Contact</a>
              {data?.cvFileDataUrl && (
                <a
                  data-magnet
                  href={data.cvFileDataUrl}
                  download={data.cvFileName ?? 'cv.pdf'}
                  className="mt-2 inline-flex w-max items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-1.5 text-[var(--ink-deep)] font-semibold shadow-md hover:brightness-110"
                >
                  <Download className="h-4 w-4" /> CV
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <header id="home" className="relative overflow-hidden z-10">
        <div className="relative pt-16 pb-12 md:pt-20 md:pb-16">
          <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-[auto,1fr] gap-8 items-center">
            {/* Photo frame (bigger) */}
            <figure className="group relative w-fit mx-auto md:mx-0 will-change-transform" data-reveal="up">
              <span aria-hidden className="absolute -inset-8 -z-10 rounded-3xl blur-3xl opacity-60 noir-glow" />
              <div className="relative h-56 w-56 md:h-64 md:w-64 rounded-3xl p-[2px] noir-frame shadow-2xl">
                <div className="relative h-full w-full overflow-hidden rounded-[22px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
                  {photo ? (
                    <img src={photo} alt={fullName} className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <span className="absolute inset-0 grid place-items-center text-slate-300/80">No Photo</span>
                  )}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.14),transparent)] animate-[shine_1.2s_ease-out_1]"
                  />
                </div>
              </div>
            </figure>

            <div className="text-center md:text-left" data-reveal="right">
              <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[var(--ink)]">{fullName}</h1>
              <p className="text-xl md:text-2xl text-[var(--muted)] mt-2">{role}</p>
              <p className="mt-3 text-sm md:text-base text-[var(--subtle)] max-w-2xl">{tagline}</p>
              {location && <p className="text-xs text-[var(--subtle)] mt-1">{location}</p>}

              <div className="mt-7 flex flex-wrap items-center gap-3" data-reveal="up">
                {data?.cvFileDataUrl && (
                  <a
                    data-magnet
                    href={data.cvFileDataUrl}
                    download={data.cvFileName ?? 'cv.pdf'}
                    className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2 font-semibold text-[var(--ink-deep)] shadow-md transition will-change-transform"
                  >
                    <Download className="h-4 w-4" /> Download CV
                  </a>
                )}
                {data?.linkedin && (
                  <a
                    data-magnet
                    href={data.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)] px-5 py-2 font-semibold text-[var(--accent)] shadow-md transition will-change-transform hover:bg-[var(--accent)] hover:text-[var(--ink-deep)]"
                  >
                    <Linkedin className="h-4 w-4" /> LinkedIn
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* RIGHT DOT NAV (desktop) */}
      <aside aria-label="Sections" className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
        {SECTION_IDS.slice(1).map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className="grid place-items-center h-6 w-6 rounded-full ring-1 ring-white/30 transition hover:ring-[var(--accent)] bg-white/10"
            data-dot={id}
          >
            <Circle className="h-3 w-3" />
          </a>
        ))}
      </aside>

      {/* MAIN */}
      <main id="main" className="relative z-10 max-w-5xl mx-auto px-6 py-10 space-y-10">
        {data?.about && (
          <Section id="about" icon={<Palette size={20} />} title="About" reveal="left">
            <p className="text-[var(--ink-soft)] leading-relaxed text-justify">{data.about}</p>
          </Section>
        )}

        {skills.length > 0 && (
          <Section id="skills" icon={<Palette size={20} />} title="Skills" reveal="up">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {skills.map((s, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-white/10 bg-[var(--card)] p-3 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition"
                  data-reveal="up"
                  style={{ animationDelay: `${(i % 6) * 50}ms` as React.CSSProperties['animationDelay'] }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--ink-soft)]">{String(s)}</span>
                    <span className="h-2 w-2 rounded-full bg-[var(--accent)]/90" />
                  </div>
                  <div className="mt-2 h-1.5 rounded bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-[var(--accent)]/70"
                      style={{ width: `${70 + (i % 4) * 6}%` }}
                      aria-hidden
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {projects.length > 0 && (
          <Section id="projects" icon={<Palette size={20} />} title="Projects" reveal="right">
            <div className="flex flex-col gap-4">
              {projects.map((p, i) => (
                <article
                  key={i}
                  className="rounded-xl border border-white/10 bg-[var(--card)] p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--accent-soft)] transition"
                  data-reveal="up"
                  style={{ animationDelay: `${(i % 6) * 60}ms` as React.CSSProperties['animationDelay'] }}
                >
                  <h3 className="text-lg font-medium text-[var(--ink)]">{p.name?.trim() || `Project ${i + 1}`}</h3>
                  {p.description?.trim() && (
                    <p className="text-[var(--subtle)] mt-2 text-justify leading-relaxed">{p.description}</p>
                  )}
                  {p.link && (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline mt-3"
                    >
                      <LinkIcon size={16} /> View
                    </a>
                  )}
                </article>
              ))}
            </div>
          </Section>
        )}

        {certifications.length > 0 && (
          <Section id="certifications" icon={<BookOpen size={20} />} title="Certifications" reveal="left">
            <div className="flex flex-col gap-3">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border border-white/10 bg-[var(--card)] p-3 ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[var(--accent-soft)]"
                  data-reveal="up"
                  style={{ animationDelay: `${(index % 6) * 55}ms` as React.CSSProperties['animationDelay'] }}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--badge-bg)] ring-1 ring-[var(--badge-ring)]">
                    <Award className="h-6 w-6 text-[var(--accent)]" />
                  </span>
                  <p className="text-[var(--ink-soft)] text-justify">{String(cert)}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {media.length > 0 && (
          <Section id="media" icon={<Palette size={20} />} title="Media" reveal="right">
            <div className="flex flex-col gap-4">
              {media.map((m, i) => {
                const title = m.title?.trim() || `Media ${i + 1}`;
                const label = m.type ? String(m.type) : 'Media';
                return (
                  <div
                    key={i}
                    className="rounded-lg border border-white/10 bg-[var(--card)] p-4 transition hover:border-[var(--accent-soft)]"
                    data-reveal="up"
                    style={{ animationDelay: `${(i % 6) * 60}ms` as React.CSSProperties['animationDelay'] }}
                  >
                    <h3 className="text-lg font-medium text-[var(--ink)]">{title}</h3>
                    <p className="text-[var(--subtle)] mt-1 text-justify">{label}</p>
                    {m.link && (
                      <a
                        href={m.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[var(--accent)] hover:underline mt-2"
                      >
                        <LinkIcon size={16} /> View
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </Section>
        )}

        {/* CONTACT */}
        <Section id="contact" icon={<Mail size={20} />} title="Contact" reveal="up">
          <div className="text-[var(--ink-soft)] space-y-2">
            {data?.email && (
              <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:text-[var(--accent)]" data-reveal="up">
                <Mail size={16} /> {data.email}
              </a>
            )}
            {data?.phone && (
              <a href={`tel:${data.phone}`} className="flex items-center gap-2 hover:text-[var(--accent)]" data-reveal="up">
                <Phone size={16} /> {data.phone}
              </a>
            )}
            {data?.linkedin && (
              <a
                href={data.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[var(--accent)] hover:underline"
                data-reveal="up"
              >
                <Linkedin size={16} /> LinkedIn
              </a>
            )}
            {socials.length > 0 && (
              <div className="pt-2" data-reveal="up">
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
              <a
                href={data.cvFileDataUrl}
                download={data.cvFileName ?? 'cv.pdf'}
                className="mt-3 inline-flex items-center gap-2 text-[var(--accent)] hover:underline"
                data-reveal="up"
              >
                <Download size={16} /> Download CV
              </a>
            )}
          </div>
        </Section>
      </main>

      {/* Back to top FAB */}
      <button
        id="__top"
        aria-label="Back to top"
        className="fixed bottom-5 right-5 z-40 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/10 backdrop-blur hover:bg-white/10"
      >
        ↑
      </button>

      {/* FOOTER */}
      <footer className="bg-[var(--footer)] py-6 text-center text-[var(--subtle)]">
        <p>© {new Date().getFullYear()} {fullName} — {role}</p>
      </footer>

      {/* Styles + runtime */}
      <style>{`
        :root { --mx: 50vw; --my: 50vh; }
        .noir-surface {
          --nav: #0b1720;
          --bg1:#0b1720; --bg2:#0e1e29; --bg3:#102735;
          --ink:#e9f3f7; --ink-soft:#d7e6ec;
          --muted:#b6c6cf; --subtle:#9cb2bd;
          --accent:#e3b04b; --accent-2:#c9982f; --accent-soft: rgba(227,176,75,0.35);
          --ink-deep:#0a1320;
          --card: rgba(12, 21, 31, 0.6);
          --badge-bg: rgba(227,176,75,0.10);
          --badge-ring: rgba(227,176,75,0.35);
          --footer:#081018;
          background: linear-gradient(120deg, var(--bg1), var(--bg2), var(--bg3));
        }
        .navlink { padding: .5rem .75rem; font-size:.875rem; font-weight:600; color:var(--muted); }
        .navlink:hover, .navlink.active { color: var(--accent); }

        #__spotlight {
          background: radial-gradient(360px 360px at var(--mx) var(--my), rgba(255,255,255,.06), transparent 60%);
        }
        .noir-glow { background: radial-gradient(60% 60% at 50% 50%, rgba(227,176,75,0.24) 0%, transparent 60%); }
        .noir-frame {
          background:
            conic-gradient(from 210deg, rgba(255,255,255,.25), rgba(255,255,255,0) 30% 70%, rgba(255,255,255,.25)),
            linear-gradient(180deg, #f7e9c6, #e3b04b 35%, #c9982f 70%, #b88c14 100%);
          border-radius: 22px; padding: 2px;
        }
        @keyframes shine { to { transform: translateX(120%); } }

        .section-shell {
          border-radius: 16px;
          border: 1px solid rgba(255,255,255,0.08);
          background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.02));
          padding: 1.25rem;
          box-shadow: 0 10px 30px rgba(0,0,0,.18);
        }

        /* Reveal motions */
        [data-reveal] { opacity: 0; transform: translateY(14px); transition: opacity .6s ease, transform .6s ease; }
        [data-reveal].in { opacity: 1; transform: translateY(0); }
        [data-reveal="left"] { transform: translateX(-18px); }
        [data-reveal="right"] { transform: translateX(18px); }
        [data-reveal="up"] { transform: translateY(16px); }
        [data-reveal="left"].in, [data-reveal="right"].in, [data-reveal="up"].in { transform: none; }

        @media (prefers-reduced-motion: reduce) {
          [data-reveal] { opacity: 1 !important; transform: none !important; }
        }
      `}</style>

      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function () {
            var doc = document.documentElement;
            var progress = document.getElementById('__progress');
            var drawer = document.getElementById('__drawer');
            var menuBtn = document.getElementById('__menu');
            var backTop = document.getElementById('__top');

            // progress bar
            function onScroll() {
              var h = doc.scrollHeight - doc.clientHeight;
              var pct = h > 0 ? (doc.scrollTop / h) * 100 : 0;
              if (progress) progress.style.width = pct + '%';
            }
            onScroll();
            window.addEventListener('scroll', onScroll, { passive: true });

            // spotlight + magnetic
            var reduce = false;
            try { reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(_){}
            window.addEventListener('mousemove', function (e) {
              var x = e.clientX, y = e.clientY;
              doc.style.setProperty('--mx', x + 'px');
              doc.style.setProperty('--my', y + 'px');
              if (reduce) return;
              document.querySelectorAll('[data-magnet]').forEach(function (m) {
                var r = m.getBoundingClientRect();
                var cx = r.left + r.width / 2;
                var cy = r.top + r.height / 2;
                var dist = Math.hypot(x - cx, y - cy);
                var pull = Math.max(0, 1 - dist / 260);
                var tx = (x - cx) * 0.08 * pull;
                var ty = (y - cy) * 0.08 * pull;
                m.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
              });
            }, { passive: true });

            // mobile drawer
            if (menuBtn && drawer) {
              menuBtn.addEventListener('click', function(){
                drawer.classList.toggle('hidden');
              });
            }

            // smooth scroll for nav links (+ set active)
            var links = Array.from(document.querySelectorAll('[data-navlink]'));
            links.forEach(function(a){
              a.addEventListener('click', function(e){
                var href = a.getAttribute('href') || '';
                if (href.startsWith('#')) {
                  e.preventDefault();
                  var id = href.slice(1);
                  var el = document.getElementById(id);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  if (drawer && !drawer.classList.contains('hidden')) drawer.classList.add('hidden');
                }
              });
            });

            // reveal observer
            try {
              if (!reduce && 'IntersectionObserver' in window) {
                var obs = new IntersectionObserver(function (entries) {
                  entries.forEach(function (e) {
                    if (e.isIntersecting) {
                      (e.target).classList.add('in'); obs.unobserve(e.target);
                    }
                  });
                }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
                document.querySelectorAll('[data-reveal]').forEach(function (n) { obs.observe(n); });
              } else {
                document.querySelectorAll('[data-reveal]').forEach(function (n) { n.classList.add('in'); });
              }
            } catch(_){}

            // scroll-spy for right dots + navbar active state
            try {
              var spy = new IntersectionObserver(function (entries) {
                var visible = entries.filter(function(e){return e.isIntersecting;})
                                     .sort(function(a,b){return b.intersectionRatio - a.intersectionRatio;})[0];
                if (visible && visible.target && visible.target.id) {
                  var id = visible.target.id;
                  document.querySelectorAll('[data-dot]').forEach(function(d){
                    var on = d.getAttribute('data-dot') === id;
                    d.classList.toggle('bg-[var(--accent)]', on);
                    d.classList.toggle('text-black', on);
                  });
                  document.querySelectorAll('.navlink').forEach(function(n){
                    n.classList.toggle('active', (n.getAttribute('href')||'').slice(1) === id);
                  });
                }
              }, { rootMargin: '-40% 0px -50% 0px', threshold: [0, .2, .5, .8, 1] });
              ${SECTION_IDS.slice(1).map(id => `var el_${id} = document.getElementById('${id}'); if (el_${id}) spy.observe(el_${id});`).join('\n')}
            } catch(_){}

            // back to top
            if (backTop) backTop.addEventListener('click', function(){ window.scrollTo({ top: 0, behavior: 'smooth' }); });

            // keyboard jumps 1..n
            window.addEventListener('keydown', function(e){
              if (e.ctrlKey || e.metaKey || e.altKey) return;
              var n = Number(e.key) - 1;
              var ids = ${JSON.stringify(SECTION_IDS)};
              if (n >= 0 && n < ids.length) {
                var el = document.getElementById(ids[n]);
                if (el) el.scrollIntoView({ behavior:'smooth', block:'start' });
              }
            });
          })();
        `,
        }}
      />
    </div>
  );
}

function Section({
  id,
  title,
  icon,
  children,
  reveal = 'up',
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  reveal?: 'left' | 'right' | 'up';
}) {
  return (
    <section id={id} className="section-shell" data-reveal={reveal}>
      <header className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--badge-bg)] ring-1 ring-[var(--badge-ring)]">
          {icon}
        </span>
        <h2 className="text-2xl font-semibold text-[var(--ink)]">{title}</h2>
      </header>
      {children}
    </section>
  );
}
