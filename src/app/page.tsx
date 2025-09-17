"use client";

import * as React from "react";
import Link from "next/link";

import { motion, useReducedMotion } from "framer-motion";

/* ------------------- small UX hooks ------------------- */

function usePageVisible(): boolean {
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === "visible");
    onVis();
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);
  return visible;
}

function useInViewport<T extends Element>(margin = "-15% 0px"): [React.RefObject<T>, boolean] {
  const ref = React.useRef<T>(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { root: null, rootMargin: margin, threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, inView];
}

/* ------------------- shared bits (tokenized) ------------------- */

function SectionTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="mx-auto max-w-3xl text-center">
      {eyebrow ? <p className="section-title">{eyebrow}</p> : null}
      <h2 className="mt-1 text-balance text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-pretty text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
    </header>
  );
}

function PrimaryButton({
  href,
  children,
  ariaLabel,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`btn btn-primary !text-[hsl(var(--primary-foreground))] ${className}`}
    >
      {children}
    </Link>
  );
}

function SecondaryButton({
  href,
  children,
  ariaLabel,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`btn btn-ghost ${className}`}
    >
      {children}
    </Link>
  );
}

/* ------------------- section intros (token-safe) ------------------- */

const parentVariants = {
  hidden: (dir: "up" | "down" | "left" | "right" | "scale") => {
    switch (dir) {
      case "down":
        return { opacity: 0, y: -24 };
      case "left":
        return { opacity: 0, x: 24 };
      case "right":
        return { opacity: 0, x: -24 };
      case "scale":
        return { opacity: 0, scale: 0.96 };
      case "up":
      default:
        return { opacity: 0, y: 24 };
    }
  },
  show: { opacity: 1, x: 0, y: 0, scale: 1 },
} as const;

const childVariants = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } } as const;

function AuroraGlow({
  active,
  hue = 208,
  className = "",
}: { active: boolean; hue?: number; className?: string }) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 0.9 }}
      animate={active ? { opacity: 0.8, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-none absolute inset-0 -z-10 blur-3xl ${className}`}
      style={{
        background: `radial-gradient(800px 360px at 50% 0%, hsl(${hue} 90% 55% / 0.25), transparent 60%),
                     conic-gradient(from 180deg at 50% -20%, hsl(${hue + 30} 92% 62% / 0.16), transparent 25% 75%, hsl(${hue - 20} 82% 60% / 0.16))`,
        maskImage: "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.2) 70%, transparent)",
      }}
    />
  );
}

function SectionIntro({
  children,
  className = "",
  from = "up",
  parallax = 16,
  hue,
}: {
  children: React.ReactNode;
  className?: string;
  from?: "up" | "down" | "left" | "right" | "scale";
  parallax?: number;
  hue?: number;
}) {
  const prefersReduced = useReducedMotion();
  const [ref, inView] = useInViewport<HTMLDivElement>();
  const visible = inView;

  return (
    <section className={`relative ${className}`}>
      <AuroraGlow active={visible} hue={hue ?? 208} />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={visible ? "show" : "hidden"}
        custom={from}
        variants={parentVariants}
        transition={{
          duration: prefersReduced ? 0 : 0.7,
          ease: [0.22, 1, 0.36, 1],
          when: "beforeChildren",
          staggerChildren: prefersReduced ? 0 : 0.06,
        }}
      >
        <motion.div
          initial={{ y: from === "up" ? parallax : from === "down" ? -parallax : 0 }}
          animate={{ y: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </motion.div>
    </section>
  );
}

function RevealItem({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      variants={childVariants}
      transition={{ duration: prefersReduced ? 0 : 0.5, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------- counters (global-behavior inline) ------------------- */

const STORAGE_KEY = 'tipg_counters';

function Counters() {
  const prefersReduced = useReducedMotion();
  const pageVisible = usePageVisible();
  const [ref, inView] = useInViewport<HTMLDivElement>('-10% 0px'); // keeps ticking only when the section is on-screen

  // seeds (same as landing)
  const seeds = React.useMemo(() => ({ cv: 12840, cl: 9420, pf: 5120 }), []);
  const restored = React.useRef(false);

  const [cv, setCv] = React.useState(seeds.cv);
  const [cl, setCl] = React.useState(seeds.cl);
  const [pf, setPf] = React.useState(seeds.pf);

  // restore once per session
  React.useEffect(() => {
    if (restored.current) return;
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const obj = JSON.parse(raw) as { cv?: number; cl?: number; portfolio?: number };
        if (typeof obj.cv === 'number') setCv(obj.cv);
        if (typeof obj.cl === 'number') setCl(obj.cl);
        if (typeof obj.portfolio === 'number') setPf(obj.portfolio);
      }
    } catch {/* ignore */}
    restored.current = true;
  }, []);

  // persist on tab hide + unmount
  const persist = React.useCallback(() => {
    try {
      sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ cv, cl, portfolio: pf })
      );
    } catch {/* ignore */}
  }, [cv, cl, pf]);

  React.useEffect(() => {
    const onVis = () => {
      if (document.visibilityState === 'hidden') persist();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      persist();
    };
  }, [persist]);

  // tick when: section in view + tab visible + not reduced motion
  React.useEffect(() => {
    if (prefersReduced || !pageVisible || !inView) return;
    const i1 = window.setInterval(() => setCv((v) => v + (Math.floor(Math.random() * (8 - 3 + 1)) + 3)), 1200);
    const i2 = window.setInterval(() => setCl((v) => v + (Math.floor(Math.random() * (6 - 2 + 1)) + 2)), 1700);
    const i3 = window.setInterval(() => setPf((v) => v + (Math.floor(Math.random() * (5 - 1 + 1)) + 1)), 2200);
    return () => { clearInterval(i1); clearInterval(i2); clearInterval(i3); };
  }, [prefersReduced, pageVisible, inView]);

  const items = [
    { label: 'CVs generated', val: cv },
    { label: 'Cover letters crafted', val: cl },
    { label: 'Published Portfolios', val: pf },
  ];

  return (
    <div ref={ref} className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
      {items.map((it, i) => (
        <RevealItem key={it.label} delay={i * 0.05}>
          <article className="card p-6 text-center">
            <div className="text-3xl font-extrabold text-foreground">
              {it.val.toLocaleString()}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{it.label}</p>
          </article>
        </RevealItem>
      ))}
    </div>
  );
}

/* ------------------- testimonials (auto-rotate) ------------------- */

type Testimonial = { quote: string; name: string; role: string; initial: string };

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Clean, fast, and private. I shipped my portfolio in an evening and landed two interviews the next week.",
    name: "Ada O.",
    role: "Frontend Engineer",
    initial: "A",
  },
  {
    quote:
      "The CV builder is ATS-friendly and the PDF export looks exactly like the preview. Huge time saver.",
    name: "Marcus T.",
    role: "Product Designer",
    initial: "M",
  },
  {
    quote:
      "Deploying to GitHub Pages with one click is brilliant. The upgrade path for longer hosting is fair.",
    name: "Zara L.",
    role: "Data Analyst",
    initial: "Z",
  },
  {
    quote:
      "I love that my content never leaves the browser. The dark mode and templates are top-notch.",
    name: "Ken I.",
    role: "Full-stack Developer",
    initial: "K",
  },
];

function Testimonials() {
  const prefersReduced = useReducedMotion();
  const visible = usePageVisible();
  const [index, setIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);

  React.useEffect(() => {
    if (prefersReduced || paused || !visible) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % TESTIMONIALS.length),
      4800
    );
    return () => window.clearInterval(id);
  }, [prefersReduced, paused, visible]);

  const go = (dir: -1 | 1) =>
    setIndex((i) => (i + dir + TESTIMONIALS.length) % TESTIMONIALS.length);

  const current = TESTIMONIALS[index];

  return (
    <div className="mx-auto max-w-3xl">
      <motion.div
        className="card p-6 sm:p-8"
        role="region"
        aria-label="Testimonials carousel"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-start gap-4">
          <div
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-[hsl(var(--accent-foreground))]"
            style={{ background: "hsl(var(--accent))" }}
            aria-hidden
          >
            <span className="text-lg font-bold">{current.initial}</span>
          </div>
        </div>

        <motion.blockquote
          key={current.name}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-2 text-balance text-lg text-foreground"
        >
          “{current.quote}”
        </motion.blockquote>

        <div className="mt-3 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{current.name}</span> • {current.role}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-1.5" role="tablist" aria-label="Testimonial slide indicators">
            {TESTIMONIALS.map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === index}
                aria-label={`Show testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 w-6 rounded-full transition ${
                  i === index ? "bg-[hsl(var(--secondary))]" : "bg-[hsl(var(--border))]"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost btn-sm" onClick={() => go(-1)} aria-label="Previous testimonial">
              ←
            </button>
            <button className="btn btn-ghost btn-sm" onClick={() => go(1)} aria-label="Next testimonial">
              →
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------- page ------------------- */

export default function HomePage() {
  return (
    <main id="main" className="bg-background text-foreground">
      {/* HERO */}
      <SectionIntro className="relative isolate" from="scale" parallax={18} hue={208}>
        <div className="container-app pb-16 pt-10 lg:pb-20 lg:pt-16 text-center">
          <RevealItem>
            <h1 className="mx-auto max-w-3xl text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
              Ship a standout Portfolio in minutes.
            </h1>
          </RevealItem>
          <RevealItem delay={0.05}>
            <p className="mx-auto mt-3 max-w-3xl text-pretty text-lg text-muted-foreground">
              Live preview, beautiful templates, dark mode, and one-click deploy to GitHub Pages.
              CV & Cover Letter tools included — PDF export only, never stored.
            </p>
          </RevealItem>
          <RevealItem delay={0.1}>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <PrimaryButton href="/portfolio" ariaLabel="Create your portfolio now">
                Create Portfolio
              </PrimaryButton>
              <SecondaryButton href="/cv">Build CV</SecondaryButton>
              <SecondaryButton href="/cl">Cover Letter</SecondaryButton>
            </div>
          </RevealItem>
        </div>
      </SectionIntro>

      {/* COUNTERS */}
      <SectionIntro className="py-12" from="up" hue={192}>
        <div className="container-app">
          <h2 className="sr-only">Live platform stats</h2>
          <Counters />
        </div>
      </SectionIntro>

      {/* FEATURES */}
      <SectionIntro className="py-16" from="left" parallax={12} hue={210}>
        <div className="container-app">
          <SectionTitle
            eyebrow="Why TheIdealProGen"
            title="Modern UX, privacy-first, and production-ready"
            subtitle="Everything you need to look professional online, without accounts or lock-in."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "In-browser, privacy-first", desc: "Your data stays on your device. Export PDF/JSON when you choose." },
              { title: "GitHub Pages deploy", desc: "Clean URLs on your org or username site. Upgrade to extend hosting." },
              { title: "Live preview", desc: "Edit and see changes immediately. No guessing." },
              { title: "Dark mode & themes", desc: "Accessible color system with AA contrast and brand tinting." },
              { title: "ATS-friendly CVs", desc: "Templates that avoid images/columns in the core content." },
              { title: "Zero setup", desc: "Open in your browser and start creating. That’s it." },
            ].map((f, i) => (
              <RevealItem key={f.title} delay={i * 0.04}>
                <div className="card p-6 transition hover:shadow-card">
                  <div className="text-base font-semibold text-foreground">{f.title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </RevealItem>
            ))}
          </div>
        </div>
      </SectionIntro>

      {/* HOW IT WORKS */}
      <SectionIntro
        className="border-y border-border bg-[hsl(var(--muted))/0.4] py-16"
        from="right"
        parallax={16}
        hue={226}
      >
        <div className="container-app">
          <SectionTitle eyebrow="Three steps" title="Pick a template, edit with live preview, deploy to GitHub Pages" />
          <ol className="mx-auto mt-10 grid max-w-4xl gap-4 sm:grid-cols-3">
            {[
              { k: "1", t: "Pick a template", d: "Modern, Classic, or Minimal." },
              { k: "2", t: "Edit live", d: "Update content and theme instantly." },
              { k: "3", t: "Deploy", d: "One-click GitHub Pages publish." },
            ].map((s, i) => (
              <RevealItem key={s.k} delay={i * 0.06}>
                <li className="card p-6 text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[hsl(var(--secondary))] text-sm font-bold text-[hsl(var(--secondary-foreground))]">
                    {s.k}
                  </div>
                  <div className="mt-3 text-base font-semibold text-foreground">{s.t}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                </li>
              </RevealItem>
            ))}
          </ol>
          <RevealItem delay={0.24}>
            <div className="mt-8 text-center">
              <PrimaryButton href="/portfolio">Start now</PrimaryButton>
            </div>
          </RevealItem>
        </div>
      </SectionIntro>

      {/* TESTIMONIALS */}
      <SectionIntro className="py-16" from="scale" parallax={10} hue={204}>
        <div className="container-app">
          <SectionTitle eyebrow="Loved by professionals" title="What people are saying" />
          <div className="mt-10">
            <Testimonials />
          </div>
        </div>
      </SectionIntro>

      {/* PRICING */}
      <SectionIntro className="py-16" from="up" parallax={14} hue={216}>
        <div className="container-app">
          <SectionTitle
            eyebrow="Simple pricing"
            title="Free to use — upgrade only if you need longer hosting"
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-3">
            {[
              { name: "Free", price: "$0", desc: "All builders. PDF export. 21-day hosting.", cta: { href: "/portfolio", label: "Create Portfolio" }, primary: true },
              { name: "Supporter", price: "$5", desc: "Thank-you tier. 45-day hosting. Early features.", cta: { href: "/donate", label: "Support us" } },
              { name: "Business", price: "$15", desc: "90-day hosting + premium templates.", cta: { href: "/donate", label: "Upgrade" } },
            ].map((p, i) => (
              <RevealItem key={p.name} delay={i * 0.06}>
                <article className="card relative p-6">
                  {p.name === "Supporter" ? (
                    <span className="absolute right-4 top-4 rounded-full bg-[hsl(var(--accent))] px-2 py-0.5 text-xs font-semibold text-[hsl(var(--accent-foreground))]">
                      Popular
                    </span>
                  ) : null}
                  <h3 className="text-base font-semibold text-foreground">{p.name}</h3>
                  <div className="mt-1 text-3xl font-extrabold text-foreground">{p.price}</div>
                  <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
                  <div className="mt-4">
                    {p.primary ? (
                      <PrimaryButton href={p.cta.href}>{p.cta.label}</PrimaryButton>
                    ) : (
                      <SecondaryButton href={p.cta.href}>{p.cta.label}</SecondaryButton>
                    )}
                  </div>
                </article>
              </RevealItem>
            ))}
          </div>
        </div>
      </SectionIntro>

      {/* CTA */}
      <SectionIntro className="pb-20 pt-4" from="scale" parallax={8} hue={200}>
        <div className="container-app">
          <div className="relative card overflow-hidden p-8 text-center">
            <motion.div
              aria-hidden
              initial={{ x: "-20%" }}
              whileInView={{ x: "300%" }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-6 bg-[linear-gradient(to_right,white_0%,transparent_40%)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.2)_0%,transparent_40%)]"
            />
            <h3 className="text-balance text-2xl font-extrabold tracking-tight">
              Ready to publish?
            </h3>
            <p className="mx-auto mt-2 max-w-2xl text-pretty text-muted-foreground">
              Start with a portfolio — it’s the heart of the platform.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <PrimaryButton href="/portfolio">Open Portfolio Builder</PrimaryButton>
              <SecondaryButton href="/portfolio">My Deployments</SecondaryButton>
            </div>
          </div>
        </div>
      </SectionIntro>
    </main>
  );
}
