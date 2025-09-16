"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "framer-motion";

/* ----------------------------------------
   Small, safe UX hooks
----------------------------------------- */

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

/* ----------------------------------------
   Shared bits (kept from your style)
----------------------------------------- */

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
      <h2 className="mt-1 text-balance text-3xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-4xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="mt-3 text-pretty text-neutral-700 dark:text-neutral-300">
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
      className={`btn btn-primary !text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${className}`}
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
      className={`btn btn-secondary !text-neutral-900 dark:!text-neutral-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${className}`}
    >
      {children}
    </Link>
  );
}

/* ----------------------------------------
   “Mind-blowing” but safe intro effects
   - AuroraGlow: background light sweep
   - SectionIntro: staggered reveal & parallax
   - RevealItem: child stagger
----------------------------------------- */

function AuroraGlow({
  active,
  hue = 200, // 200–260: teal/indigo zone
  className = "",
}: {
  active: boolean;
  hue?: number;
  className?: string;
}) {
  // Pure CSS + motion opacity/scale. Works in light/dark.
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 0.9 }}
      animate={active ? { opacity: 0.8, scale: 1 } : { opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-none absolute inset-0 -z-10 blur-3xl ${className}`}
      style={{
        background: `radial-gradient(800px 360px at 50% 0%, hsl(${hue} 90% 55% / 0.28), transparent 60%),
                     conic-gradient(from 180deg at 50% -20%, hsl(${hue + 30} 92% 62% / 0.18), transparent 25% 75%, hsl(${hue - 20} 82% 60% / 0.18))`,
        maskImage:
          "linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.2) 70%, transparent)",
      }}
    />
  );
}

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

const childVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
} as const;

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
  parallax?: number; // px of subtle translate on entry
  hue?: number; // pass to AuroraGlow for per-section color
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
        style={
          prefersReduced
            ? undefined
            : {
                transformStyle: "preserve-3d",
                willChange: "transform, opacity",
              }
        }
      >
        {/* Slight parallax container */}
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

function RevealItem({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      variants={childVariants}
      transition={{
        duration: prefersReduced ? 0 : 0.5,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------------------
   Counters (pause offscreen/hidden tab)
----------------------------------------- */

function useTicker(
  start: number,
  stepRange: [number, number] = [2, 7],
  everyMs = 1500,
  enabled = true
) {
  const [val, setVal] = React.useState(start);
  const prefersReduced = useReducedMotion();
  const visible = usePageVisible();
  React.useEffect(() => {
    if (!enabled || !visible || prefersReduced || everyMs <= 0) return;
    let cancelled = false;
    const id = window.setInterval(() => {
      const inc =
        Math.floor(Math.random() * (stepRange[1] - stepRange[0] + 1)) +
        stepRange[0];
      if (!cancelled) setVal((v) => v + inc);
    }, everyMs);
    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [enabled, visible, prefersReduced, everyMs, stepRange]);
  return val;
}

function Counters() {
  const [ref, inView] = useInViewport<HTMLDivElement>("-10% 0px");
  const c1 = useTicker(12840, [3, 8], 1200, inView);
  const c2 = useTicker(9420, [2, 6], 1700, inView);
  const c3 = useTicker(5120, [1, 5], 2200, inView);

  const items = [
    { label: "CVs generated", val: c1 },
    { label: "Cover letters crafted", val: c2 },
    { label: "Interviews landed", val: c3 },
  ];

  return (
    <div ref={ref} className="mx-auto grid max-w-5xl gap-4 sm:grid-cols-3">
      {items.map((it, i) => (
        <RevealItem key={it.label} delay={i * 0.05}>
          <article className="card p-6 text-center shadow-sm">
            <div className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">
              {it.val.toLocaleString()}
            </div>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              {it.label}
            </p>
          </article>
        </RevealItem>
      ))}
    </div>
  );
}

/* ----------------------------------------
   Testimonials (auto-rotate + pause)
----------------------------------------- */

type Testimonial = {
  quote: string;
  name: string;
  role: string;
  initial: string;
};

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
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-white"
            style={{ background: "var(--brand-safe)" }}
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
          className="mt-2 text-balance text-lg text-neutral-800 dark:text-neutral-100"
        >
          “{current.quote}”
        </motion.blockquote>

        <div className="mt-3 pl-0 text-sm text-neutral-600 dark:text-neutral-400">
          <span className="font-semibold text-neutral-800 dark:text-neutral-200">
            {current.name}
          </span>{" "}
          • {current.role}
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
                  i === index ? "bg-indigo-600" : "bg-neutral-300 dark:bg-neutral-700"
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

/* ----------------------------------------
   Page with intro FX per section
----------------------------------------- */

export default function HomePage() {
  return (
    <main id="main">
      {/* HERO with glow + stagger */}
      <SectionIntro className="relative isolate" from="scale" parallax={18} hue={208}>
        <div className="container-app pb-16 pt-10 lg:pb-20 lg:pt-16 text-center">
          <RevealItem>
            <h1 className="mx-auto max-w-3xl text-balance text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 sm:text-5xl">
              Ship a standout Portfolio in minutes.
            </h1>
          </RevealItem>
          <RevealItem delay={0.05}>
            <p className="mx-auto mt-3 max-w-3xl text-pretty text-lg text-neutral-700 dark:text-neutral-300">
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

      {/* COUNTERS with slide-up intro */}
      <SectionIntro className="py-12" from="up" hue={192}>
        <div className="container-app">
          <RevealItem>
            <h2 className="sr-only">Live platform stats</h2>
          </RevealItem>
          <Counters />
        </div>
      </SectionIntro>

      {/* FEATURES with cascade + left sweep */}
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
                <div className="card p-6 transition hover:shadow-md">
                  <div className="text-base font-semibold text-neutral-900 dark:text-neutral-100">
                    {f.title}
                  </div>
                  <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{f.desc}</p>
                </div>
              </RevealItem>
            ))}
          </div>
        </div>
      </SectionIntro>

      {/* HOW IT WORKS with numbered swoop */}
      <SectionIntro
        className="border-y border-neutral-200 bg-neutral-50 py-16 dark:border-neutral-800 dark:bg-neutral-950/40"
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
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                    {s.k}
                  </div>
                  <div className="mt-3 text-base font-semibold text-neutral-900 dark:text-neutral-100">{s.t}</div>
                  <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{s.d}</p>
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

      {/* TESTIMONIALS with fade-in card & rotating quotes */}
      <SectionIntro className="py-16" from="scale" parallax={10} hue={204}>
        <div className="container-app">
          <SectionTitle eyebrow="Loved by professionals" title="What people are saying" />
          <div className="mt-10">
            <Testimonials />
          </div>
        </div>
      </SectionIntro>

      {/* PRICING with sequential pop */}
      <SectionIntro className="py-16" from="up" parallax={14} hue={216}>
        <div className="container-app">
          <SectionTitle
            eyebrow="Simple pricing"
            title="Free to use — upgrade only if you need longer hosting"
          />
          <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-3">
            {[
              {
                name: "Free",
                price: "$0",
                desc: "All builders. PDF export. 21-day hosting.",
                cta: { href: "/portfolio", label: "Create Portfolio" },
                primary: true,
              },
              {
                name: "Supporter",
                price: "$5",
                desc: "Thank-you tier. 45-day hosting. Early features.",
                cta: { href: "/donate", label: "Support us" },
              },
              {
                name: "Business",
                price: "$15",
                desc: "90-day hosting + premium templates.",
                cta: { href: "/donate", label: "Upgrade" },
              },
            ].map((p, i) => (
              <RevealItem key={p.name} delay={i * 0.06}>
                <article className="card relative p-6">
                  {p.name === "Supporter" ? (
                    <span className="absolute right-4 top-4 rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
                      Popular
                    </span>
                  ) : null}
                  <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{p.name}</h3>
                  <div className="mt-1 text-3xl font-extrabold text-neutral-900 dark:text-neutral-100">{p.price}</div>
                  <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">{p.desc}</p>
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

      {/* CTA with dramatic glow sweep */}
      <SectionIntro className="pb-20 pt-4" from="scale" parallax={8} hue={200}>
        <div className="container-app">
          <div className="relative card overflow-hidden p-8 text-center">
            {/* subtle sweep bar */}
            <motion.div
              aria-hidden
              initial={{ x: "-20%" }}
              whileInView={{ x: "120%" }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-6 bg-gradient-to-r from-white/10 to-white/0"
            />
            <h3 className="text-balance text-2xl font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100">
              Ready to publish?
            </h3>
            <p className="mx-auto mt-2 max-w-2xl text-pretty text-neutral-700 dark:text-neutral-300">
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
