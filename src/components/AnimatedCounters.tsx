'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/* ---------- tiny helpers ---------- */
function usePageVisible(): boolean {
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    const onVis = () => setVisible(document.visibilityState === 'visible');
    onVis();
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);
  return visible;
}
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

/* ---------- component ---------- */
type AnimatedCountersProps = {
  className?: string;
  /** override starting seeds (optional) */
  initial?: { cv?: number; cl?: number; portfolio?: number };
  /** set to null to disable persistence */
  persistKey?: string | null;
};

export default function AnimatedCounters({
  className = '',
  initial,
  persistKey = 'tipg_counters',
}: AnimatedCountersProps) {
  const prefersReduced = useReducedMotion();
  const visible = usePageVisible();

  // seeds (same as your landing page)
  const seeds = React.useMemo(
    () => ({
      cv: initial?.cv ?? 12840,
      cl: initial?.cl ?? 9420,
      portfolio: initial?.portfolio ?? 5120,
    }),
    [initial]
  );

  // restore persisted values once (per session)
  const restored = React.useRef(false);
  const [cv, setCv] = React.useState(seeds.cv);
  const [cl, setCl] = React.useState(seeds.cl);
  const [pf, setPf] = React.useState(seeds.portfolio);

  React.useEffect(() => {
    if (restored.current || !persistKey) return;
    try {
      const raw = sessionStorage.getItem(persistKey);
      if (raw) {
        const obj = JSON.parse(raw) as { cv?: number; cl?: number; portfolio?: number };
        if (typeof obj.cv === 'number') setCv(obj.cv);
        if (typeof obj.cl === 'number') setCl(obj.cl);
        if (typeof obj.portfolio === 'number') setPf(obj.portfolio);
      }
    } catch {
      /* ignore corrupt storage */
    } finally {
      restored.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [persistKey]);

  // save to session storage whenever tab goes hidden or on unmount
  const save = React.useCallback(() => {
    if (!persistKey) return;
    try {
      sessionStorage.setItem(
        persistKey,
        JSON.stringify({ cv, cl, portfolio: pf })
      );
    } catch {
      /* ignore quota */
    }
  }, [cv, cl, pf, persistKey]);

  React.useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') save();
    };
    document.addEventListener('visibilitychange', onHide);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      save();
    };
  }, [save]);

  // tickers — always run when visible (or immediately if the section is already on screen)
  React.useEffect(() => {
    if (prefersReduced) return; // honor reduce motion
    if (!visible) return;       // pause when tab not visible

    const i1 = window.setInterval(() => setCv(v => v + randInt(3, 8)), 1200);
    const i2 = window.setInterval(() => setCl(v => v + randInt(2, 6)), 1700);
    const i3 = window.setInterval(() => setPf(v => v + randInt(1, 5)), 2200);

    return () => {
      window.clearInterval(i1);
      window.clearInterval(i2);
      window.clearInterval(i3);
    };
  }, [visible, prefersReduced]);

  const items = [
    { label: 'CVs generated', val: cv },
    { label: 'Cover letters crafted', val: cl },
    { label: 'Published Portfolios', val: pf },
  ];

  return (
    <div className={`mx-auto grid max-w-5xl gap-4 sm:grid-cols-3 ${className}`}>
      {items.map((it, i) => (
        <motion.article
          key={it.label}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: i * 0.05 }}
          className="card p-6 text-center"
        >
          <div className="text-3xl font-extrabold text-foreground">
            {it.val.toLocaleString()}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{it.label}</p>
        </motion.article>
      ))}
    </div>
  );
}
