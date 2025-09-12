import * as React from 'react';
import { Palette, BookOpen, Link as LinkIcon, Mail, Phone, Linkedin, Download, Award, Circle, Sparkles, SunMedium, MoonStar } from 'lucide-react';
import type { PortfolioData } from '@/lib/portfolio-types';

const SECTION_IDS = ['about', 'skills', 'projects', 'certifications', 'media', 'contact'] as const;

export default function Classic({ data }: { data: PortfolioData }) {
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
  const socials = Array.isArray(data?.socials)
    ? data!.socials.filter((s) => s && s.label && s.url)
    : [];

  return (
    <div className="classic-surface text-white min-h-screen antialiased">
      {/* Skip link */}
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] rounded-md bg-white/10 px-3 py-2 ring-1 ring-white/20 backdrop-blur">
        Skip to content
      </a>

      {/* Spotlight + progress */}
      <div aria-hidden className="fixed inset-0 pointer-events-none z-[1]" id="__spotlight" />
      <div aria-hidden id="__progress" className="fixed inset-x-0 top-0 z-50 h-1 bg-gradient-to-r from-[var(--c-accent)] via-fuchsia-400 to-violet-400 w-0" />

      {/* Theme switcher */}
      <div className="fixed right-4 top-3 z-50 flex items-center gap-2">
        <button id="__theme" className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs ring-1 ring-white/20 hover:bg-white/15 backdrop-blur">
          <Sparkles size={14} /><span>Theme</span>
        </button>
      </div>

      {/* Background */}
      <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
        <div data-parallax="0.5" className="absolute -inset-[20%] opacity-80 classic-aurora" />
        <div data-parallax="0.18" className="absolute -inset-[40%] opacity-40 classic-aurora alt" />
        <div className="absolute inset-0 noise" />
      </div>

      {/* HERO */}
      <header className="relative overflow-hidden py-16 text-center z-10">
        <div className="relative z-10 max-w-4xl mx-auto px-6">
          <figure className="group relative w-fit mx-auto mb-7 [transform-style:preserve-3d] will-change-transform" data-reveal>
            <span aria-hidden className="absolute -inset-8 -z-10 rounded-[36px] blur-3xl opacity-70 classic-glow" />
            <span aria-hidden className="avatar-ring absolute inset-[-12px] rounded-[28px]" />
            <div className="relative h-40 w-40 md:h-44 md:w-44 rounded-[28px] p-[2px] classic-frame shadow-2xl">
              <div className="relative h-full w-full overflow-hidden rounded-[26px] bg-white/5 backdrop-blur-sm ring-1 ring-white/10">
                {photo ? (
                  <img src={photo} alt={fullName} className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <span className="absolute inset-0 grid place-items-center text-pink-200/80">No Photo</span>
                )}
                <span aria-hidden className="pointer-events-none absolute inset-0 translate-x-[-120%] bg-[linear-gradient(100deg,transparent,rgba(255,255,255,0.16),transparent)] transition-transform duration-[1200ms] ease-out group-hover:translate-x-[120%]" />
              </div>
            </div>
          </figure>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight drop-shadow reveal" data-reveal>{fullName}</h1>
          <p className="text-xl md:text-2xl text-[var(--c-subtle)] mt-2 reveal" data-reveal>{role}</p>
          <p className="mt-3 text-sm md:text-base text-[var(--c-muted)] text-justify max-w-2xl mx-auto reveal" data-reveal>{tagline}</p>
          <p className="text-xs text-[var(--c-muted)] mt-1 reveal" data-reveal>{location}</p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-3 reveal" data-reveal>
            {data?.cvFileDataUrl && (
              <a
                data-magnet
                href={data.cvFileDataUrl}
                download={data.cvFileName ?? 'cv.pdf'}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--c-accent)] px-5 py-2 font-semibold text-gray-900 shadow-md transition will-change-transform"
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
                className="inline-flex items-center gap-2 rounded-full border border-[var(--c-accent)] px-5 py-2 font-semibold text-[var(--c-accent)] shadow-md transition will-change-transform hover:bg-[var(--c-accent)] hover:text-gray-900"
              >
                <Linkedin className="h-4 w-4" /> LinkedIn
              </a>
            )}
          </div>
        </div>
      </header>

      {/* RIGHT DOT NAV */}
      <aside aria-label="Sections" className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3">
        {SECTION_IDS.map((id) => (
          <a
            key={id}
            href={`#${id}`}
            className="grid place-items-center h-6 w-6 rounded-full ring-1 ring-white/30 transition hover:ring-[var(--c-accent)] bg-white/10"
            data-dot={id}
          >
            <Circle className="h-3 w-3" />
          </a>
        ))}
      </aside>

      {/* MAIN */}
      <main id="main" className="relative z-10 max-w-4xl mx-auto px-6 py-10 space-y-10">
        {data?.about && (
          <Section id="about" icon={<Palette size={20} />} title="About Me">
            <p className="text-[var(--c-text)] leading-relaxed text-justify">{data.about}</p>
          </Section>
        )}

        {skills.length > 0 && (
          <Section id="skills" icon={<Palette size={20} />} title="Skills">
            <div className="mx-auto max-w-3xl flex flex-col gap-3">
              {skills.map((s, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg bg-[var(--chip-bg)] p-3 ring-1 ring-white/10 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[var(--chip-ring)]" data-reveal>
                  <span className="text-sm text-[var(--c-text)] text-justify">{String(s)}</span>
                  <span className="h-2 w-2 rounded-full bg-[var(--c-accent)]/90" />
                </div>
              ))}
            </div>
          </Section>
        )}

        {projects.length > 0 && (
          <Section id="projects" icon={<Palette size={20} />} title="Projects">
            <div className="mx-auto max-w-3xl flex flex-col gap-4">
              {projects.map((p, i) => (
                <article key={i} className="rounded-lg border border-white/10 bg-[var(--card-bg)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md hover:border-[var(--card-ring)]" data-reveal>
                  <h3 className="text-xl font-medium">{p.name?.trim() || `Project ${i + 1}`}</h3>
                  {p.description?.trim() && <p className="text-[var(--c-subtle)] mt-2 text-justify leading-relaxed">{p.description}</p>}
                  {p.link && (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[var(--c-accent)] hover:underline mt-3">
                      <LinkIcon size={16} /> View
                    </a>
                  )}
                </article>
              ))}
            </div>
          </Section>
        )}

        {certifications.length > 0 && (
          <Section id="certifications" icon={<BookOpen size={20} />} title="Certifications">
            <div className="mx-auto max-w-3xl flex flex-col gap-3">
              {certifications.map((cert, index) => (
                <div key={index} className="flex items-center gap-3 rounded-lg border border-white/10 bg-[var(--card-bg)] p-3 ring-1 ring-white/5 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-[var(--card-ring)]" data-reveal>
                  <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--badge-bg)] ring-1 ring-[var(--badge-ring)]">
                    <Award className="h-6 w-6 text-[var(--c-accent)]" />
                  </span>
                  <p className="text-[var(--c-text)] text-justify">{String(cert)}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {media.length > 0 && (
          <Section id="media" icon={<Palette size={20} />} title="Media">
            <div className="mx-auto max-w-3xl flex flex-col gap-4">
              {media.map((m, i) => {
                const label = m.type ? String(m.type) : 'Media';
                const labelNice = label.charAt(0).toUpperCase() + label.slice(1);
                return (
                  <div key={i} className="rounded-lg border border-white/10 bg-[var(--card-bg)] p-4 transition hover:border-[var(--card-ring)]" data-reveal>
                    <h3 className="text-xl font-medium">{m.title?.trim() || `Media ${i + 1}`}</h3>
                    <p className="text-[var(--c-subtle)] mt-1 text-justify">{labelNice}</p>
                    {m.link && (
                      <a href={m.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[var(--c-accent)] hover:underline mt-2">
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
        <Section id="contact" icon={<Mail size={20} />} title="Contact">
          <div className="text-[var(--c-text)] space-y-2">
            {data?.email && (
              <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:text-[var(--c-accent)]" data-reveal>
                <Mail size={16} /> {data.email}
              </a>
            )}
            {data?.phone && (
              <a href={`tel:${data.phone}`} className="flex items-center gap-2 hover:text-[var(--c-accent)]" data-reveal>
                <Phone size={16} /> {data.phone}
              </a>
            )}
            {data?.linkedin && (
              <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[var(--c-accent)] hover:underline" data-reveal>
                <Linkedin size={16} /> LinkedIn
              </a>
            )}
            {socials.length > 0 && (
              <div className="pt-2" data-reveal>
                <h3 className="text-base font-medium text-[var(--c-subtle)]">Social Links</h3>
                <div className="mt-1 grid grid-cols-1 gap-1">
                  {socials.map((s, i) => (
                    <a key={i} href={s.url!} target="_blank" rel="noopener noreferrer" className="text-[var(--c-accent)] hover:underline">
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            )}
            {data?.cvFileDataUrl && (
              <a href={data.cvFileDataUrl} download={data.cvFileName ?? 'cv.pdf'} className="mt-3 inline-flex items-center gap-2 text-[var(--c-accent)] hover:underline" data-reveal>
                <Download size={16} /> Download CV
              </a>
            )}
          </div>
        </Section>
      </main>

      <footer className="bg-[var(--footer-bg)] py-5 text-center text-[var(--c-subtle)]">
        <p>© {new Date().getFullYear()} {fullName} | Classic Portfolio</p>
      </footer>

      {/* Styles and tiny runtime */}
      <style>{`
        :root { --mx: 50vw; --my: 50vh; }
        :root[data-classic-theme='classic'] {
          --c-accent:#00CFFF; --c-text:#ffeafe; --c-subtle:#ffd7fb; --c-muted:#f4c8f6cc;
          --bg1:#0d0b1e; --bg2:#1a0f2e; --bg3:#250e3a;
          --chip-bg: rgba(236, 72, 153, 0.18); --chip-ring: rgba(0,207,255,0.35);
          --card-bg: rgba(76, 29, 149, 0.28); --card-ring: rgba(0,207,255,0.35);
          --badge-bg: rgba(0,207,255,0.15); --badge-ring: rgba(0,207,255,0.35);
          --footer-bg:#130a22;
        }
        :root[data-classic-theme='noir'] {
          --c-accent:#26f0d7; --c-text:#e8fffb; --c-subtle:#a7ffef; --c-muted:#a7ffefcc;
          --bg1:#041016; --bg2:#071b22; --bg3:#0b2830;
          --chip-bg: rgba(38, 240, 215, 0.1); --chip-ring: rgba(38, 240, 215, 0.35);
          --card-bg: rgba(8, 145, 178, 0.18); --card-ring: rgba(38, 240, 215, 0.35);
          --badge-bg: rgba(38, 240, 215, 0.15); --badge-ring: rgba(38, 240, 215, 0.35);
          --footer-bg:#06141a;
        }
        :root[data-classic-theme='porcelain'] {
          --c-accent:#ff7ad9; --c-text:#1f1b24; --c-subtle:#3c2b46; --c-muted:#4b3a56cc;
          --bg1:#fff8ff; --bg2:#fdf3ff; --bg3:#faeaff;
          --chip-bg: rgba(255, 122, 217, 0.12); --chip-ring: rgba(255,122,217,0.35);
          --card-bg: rgba(255,255,255,0.75); --card-ring: rgba(255,122,217,0.35);
          --badge-bg: rgba(255, 122, 217, 0.15); --badge-ring: rgba(255,122,217,0.35);
          --footer-bg:#efe3f7;
        }

        .classic-surface { background: linear-gradient(120deg, var(--bg1), var(--bg2), var(--bg3)); }
        .classic-aurora {
          background: radial-gradient(60% 50% at 50% 0%, rgba(255,0,204,0.18) 0%, transparent 60%),
                      radial-gradient(40% 40% at 80% 10%, rgba(0,207,255,0.22) 0%, transparent 70%),
                      radial-gradient(40% 40% at 20% 20%, rgba(168,85,247,0.22) 0%, transparent 70%),
                      linear-gradient(to bottom, var(--bg1), var(--bg2));
          filter: saturate(120%);
        }
        .classic-aurora.alt {
          background: radial-gradient(45% 50% at 20% 10%, rgba(255,122,245,0.18) 0%, transparent 70%),
                      radial-gradient(40% 40% at 80% 10%, rgba(0,207,255,0.18) 0%, transparent 70%),
                      linear-gradient(to bottom, transparent, var(--bg3));
          mix-blend-mode: screen;
        }
        .noise {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.04'/%3E%3C/svg%3E");
          background-size: 220px 220px; opacity: .6; mix-blend-mode: overlay;
        }
        .classic-glow { background: radial-gradient(60% 60% at 50% 50%, rgba(255,0,204,0.28) 0%, transparent 60%); }
        .classic-frame {
          background:
            conic-gradient(from 210deg, rgba(255,255,255,.4), rgba(255,255,255,0) 30% 70%, rgba(255,255,255,.4)),
            linear-gradient(180deg, #ffedd5, #facc15 30%, #f59e0b 60%, #eab308 100%);
          border-radius: 28px; padding: 2px;
        }
        .reveal { opacity: 0; transform: translateY(12px); }
        .reveal-in { opacity: 1; transform: translateY(0); transition: opacity .6s ease, transform .6s ease; }
        [data-reveal] { animation-delay: calc(var(--stagger) * 18ms); }
        @keyframes spin360 { to { transform: rotate(360deg); } }
        .avatar-ring::before {
          content: ''; position: absolute; inset: 0; border-radius: inherit;
          background: conic-gradient(from 0deg, rgba(0,207,255,0.00) 0deg, rgba(255,0,204,0.45) 80deg, rgba(0,207,255,0.70) 160deg, rgba(168,85,247,0.55) 240deg, rgba(0,207,255,0.00) 360deg);
          animation: spin360 16s linear infinite; opacity: 0.9;
          -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0); mask: radial-gradient(farthest-side, transparent calc(100% - 8px), #000 0);
        }
        #__spotlight { background: radial-gradient(350px 350px at var(--mx) var(--my), rgba(255,255,255,.08), transparent 60%); }
        @media (prefers-reduced-motion: reduce) {
          .avatar-ring::before { animation: none !important; }
          .reveal { opacity: 1 !important; transform: none !important; }
        }
        @media print {
          #__spotlight, aside, .noise { display:none !important; }
          button, a[href^="#"] { display:none !important; }
          body { background:#fff !important; color:#111 !important; }
        }
      `}</style>

      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function () {
            var doc = document.documentElement;
            var bar = document.getElementById('__progress');
            var themeBtn = document.getElementById('__theme');
            // Theme init & toggle
            try {
              var t = localStorage.getItem('__classic_theme') || 'classic';
              doc.setAttribute('data-classic-theme', t);
              themeBtn && themeBtn.addEventListener('click', function () {
                var order = ['classic','noir','porcelain'];
                var cur = doc.getAttribute('data-classic-theme') || 'classic';
                var next = order[(order.indexOf(cur) + 1) % order.length];
                doc.setAttribute('data-classic-theme', next);
                localStorage.setItem('__classic_theme', next);
                try { themeBtn.querySelector('span').textContent = next[0].toUpperCase()+next.slice(1); } catch(_){}
              });
            } catch (_){}

            function onScroll() {
              var h = doc.scrollHeight - doc.clientHeight;
              var pct = h > 0 ? (doc.scrollTop / h) * 100 : 0;
              if (bar) bar.style.width = pct + '%';
            }
            onScroll();
            window.addEventListener('scroll', onScroll, { passive: true });

            // Spotlight / parallax / magnetic
            var prefersReduced = false;
            try { prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch(_){}
            window.addEventListener('mousemove', function (e) {
              var x = e.clientX, y = e.clientY;
              doc.style.setProperty('--mx', x + 'px');
              doc.style.setProperty('--my', y + 'px');

              if (prefersReduced) return;

              document.querySelectorAll('[data-parallax]').forEach(function (l) {
                var depth = parseFloat(l.getAttribute('data-parallax') || '0');
                var dx = (x / window.innerWidth - 0.5) * depth * 12;
                var dy = (y / window.innerHeight - 0.5) * depth * 12;
                l.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
              });

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

            // Reveal + active dot
            try {
              var reduce = prefersReduced;
              if (!reduce && 'IntersectionObserver' in window) {
                var obs = new IntersectionObserver(function (entries) {
                  entries.forEach(function (e, idx) {
                    if (e.isIntersecting) {
                      e.target.classList.add('reveal-in');
                      e.target.style.setProperty('--stagger', String(idx % 8));
                      obs.unobserve(e.target);
                    }
                  });
                }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });
                document.querySelectorAll('[data-reveal]').forEach(function (n) { obs.observe(n); });
              } else {
                document.querySelectorAll('.reveal, [data-reveal]').forEach(function (n) { n.classList.add('reveal-in'); });
              }

              var spy = new IntersectionObserver(function (entries) {
                var visible = entries.filter(function(e){return e.isIntersecting;}).sort(function(a,b){return b.intersectionRatio - a.intersectionRatio;})[0];
                if (visible && visible.target && visible.target.id) {
                  var id = visible.target.id;
                  document.querySelectorAll('[data-dot]').forEach(function(d){
                    d.classList.toggle('bg-[var(--c-accent)]', d.getAttribute('data-dot') === id);
                    d.classList.toggle('text-black', d.getAttribute('data-dot') === id);
                  });
                }
              }, { rootMargin: '-40% 0px -50% 0px', threshold: [0, .2, .5, .8, 1] });
              ${SECTION_IDS.map((id) => `var el_${id} = document.getElementById('${id}'); if (el_${id}) spy.observe(el_${id});`).join('\n')}
            } catch(_){}

            // Keyboard jumps
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
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="rounded-xl border border-white/10 bg-white/5 p-6 shadow-sm hover:shadow-md transition" data-reveal>
      <header className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--badge-bg)] ring-1 ring-[var(--badge-ring)]">
          {icon}
        </span>
        <h2 className="text-2xl font-semibold">{title}</h2>
      </header>
      {children}
    </section>
  );
}
