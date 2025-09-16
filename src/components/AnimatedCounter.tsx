'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  label: string;
  durationMs?: number;
  compact?: boolean;       // 1.2K style
  prefix?: string;         // e.g., "$"
  suffix?: string;         // e.g., " coffees"
}

export default function AnimatedCounter({
  value,
  label,
  durationMs = 1200,
  compact = false,
  prefix = '',
  suffix = '',
}: AnimatedCounterProps) {
  const reduceMotion = useReducedMotion();
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const prevRef = useRef<number>(0);

  useEffect(() => {
    const end = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
    const start = prevRef.current;

    if (reduceMotion || end === start || durationMs <= 0) {
      setCount(end);
      prevRef.current = end;
      return;
    }

    const startTs = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - startTs) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(start + (end - start) * eased);
      setCount(current);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
      else prevRef.current = end;
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [value, durationMs, reduceMotion]);

  const formatted = compact
    ? new Intl.NumberFormat(undefined, { notation: 'compact' }).format(count)
    : count.toLocaleString();

  return (
    <div>
      <p className="text-3xl font-bold text-teal-600" aria-live="polite">
        {prefix}
        {formatted}
        {suffix}
      </p>
      <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
    </div>
  );
}
