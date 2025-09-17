'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const parentVariants = {
  hidden: (dir: 'up' | 'down' | 'left' | 'right' | 'scale') => {
    switch (dir) {
      case 'down':  return { opacity: 0, y: -24 };
      case 'left':  return { opacity: 0, x: 24 };
      case 'right': return { opacity: 0, x: -24 };
      case 'scale': return { opacity: 0, scale: 0.96 };
      case 'up':
      default:      return { opacity: 0, y: 24 };
    }
  },
  show: { opacity: 1, x: 0, y: 0, scale: 1 },
} as const;

function AuroraGlow({ active, hue = 208, className = '' }: { active: boolean; hue?: number; className?: string }) {
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
        maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0.2) 70%, transparent)',
      }}
    />
  );
}

function useInViewport<T extends Element>(margin = '-15% 0px'): [React.RefObject<T>, boolean] {
  const ref = React.useRef<T>(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { root: null, rootMargin: margin, threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);
  return [ref, inView];
}

export default function SectionIntro({
  children,
  className = '',
  from = 'up',
  parallax = 16,
  hue = 208,
}: {
  children: React.ReactNode;
  className?: string;
  from?: 'up' | 'down' | 'left' | 'right' | 'scale';
  parallax?: number;
  hue?: number;
}) {
  const prefersReduced = useReducedMotion();
  const [ref, inView] = useInViewport<HTMLDivElement>();
  const visible = inView;

  return (
    <section className={`relative ${className}`}>
      <AuroraGlow active={visible} hue={hue} />
      <motion.div
        ref={ref}
        initial="hidden"
        animate={visible ? 'show' : 'hidden'}
        custom={from}
        variants={parentVariants}
        transition={{
          duration: prefersReduced ? 0 : 0.7,
          ease: [0.22, 1, 0.36, 1],
          when: 'beforeChildren',
          staggerChildren: prefersReduced ? 0 : 0.06,
        }}
      >
        <motion.div
          initial={{ y: from === 'up' ? parallax : from === 'down' ? -parallax : 0 }}
          animate={{ y: 0 }}
          transition={{ duration: prefersReduced ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {children}
        </motion.div>
      </motion.div>
    </section>
  );
}
