import { useEffect, useState } from 'react';

interface AnimatedCounterProps {
  value: number;
  label: string;
  durationMs?: number; // optional override
}

export default function AnimatedCounter({ value, label, durationMs = 1200 }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Guard: zero/negative -> just show 0 and bail
    const end = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
    if (end === 0) {
      setCount(0);
      return;
    }

    let rafId = 0;
    const startTs = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTs;
      const t = Math.min(1, elapsed / durationMs);
      // ease-out (optional): t' = 1 - (1 - t)^3
      const eased = 1 - Math.pow(1 - t, 3);
      setCount(Math.floor(eased * end));
      if (t < 1) rafId = requestAnimationFrame(animate);
    };

    setCount(0);
    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [value, durationMs]);

  return (
    <div>
      <p className="text-3xl font-bold text-teal-600">{count.toLocaleString()}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300">{label}</p>
    </div>
  );
}
