'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';

type Nav = { href: `/${string}` | '/'; label: string };
type Social = {
  href: `https://${string}`;
  label: 'Twitter' | 'LinkedIn' | 'GitHub';
  icon: React.ComponentType<{ className?: string }>;
};

const NAV: readonly Nav[] = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/cv', label: 'CV' },
  { href: '/donate', label: 'Donate' },
  { href: '/faq', label: 'FAQ' },
] as const;

const SOCIAL: readonly Social[] = [
  { href: 'https://twitter.com/theidealprogen', label: 'Twitter', icon: Twitter },
  { href: 'https://linkedin.com/company/theidealprogen', label: 'LinkedIn', icon: Linkedin },
  { href: 'https://github.com/theidealprogen', label: 'GitHub', icon: Github },
] as const;

export default function Footer() {
  const year = new Date().getFullYear();
  const backToTop = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), []);

  return (
    <motion.footer
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      aria-label="Footer"
      // Slim height + glass, aligned with header
      className="glass-footer relative py-4"
    >
      {/* Top separators (hairline + soft brand accent) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[hsl(var(--border))]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[1px] h-px bg-gradient-to-r from-[hsl(var(--primary)/0)] via-[hsl(var(--primary)/0.35)] to-[hsl(var(--primary)/0)]"
      />

      {/* Top row */}
      <div className="container-app">
        <div className="grid items-start gap-6 md:grid-cols-3">
          {/* Brand + socials (compact) */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-[hsl(var(--foreground))]">
                TheIdealProGen
              </span>
            </div>
            <p className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
              Free, beautiful documents for students — powered by $5 coffees.
            </p>
            <div className="mt-3 flex gap-3">
              {SOCIAL.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links (2 columns, tight) */}
          <nav aria-label="Quick links">
            <div className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
              Quick Links
            </div>
            <ul className="mt-2 grid grid-cols-2 gap-1.5">
              {NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Newsletter (inline, compact) */}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
              Stay in the loop
            </div>
            <form className="mt-2 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="newsletter-email" className="sr-only">
                Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                placeholder="you@example.com"
                className="
                  w-full rounded-md border border-[hsl(var(--border))]
                  bg-[hsl(var(--card))] px-3 py-2 text-sm
                  text-[hsl(var(--foreground))]
                  outline-none ring-offset-[hsl(var(--background))]
                  focus:ring-2 focus:ring-[hsl(var(--ring))]
                "
              />
              <Button className="px-3 py-2 text-sm">Subscribe</Button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar (very slim) */}
      <div className="container-app mt-3 flex items-center justify-between">
        <p className="text-[11px] leading-none text-[hsl(var(--muted-foreground))]">
          © {year} TheIdealProGen. All rights reserved.
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={backToTop}
          aria-label="Back to top"
          className="gap-1 px-2 py-1 text-xs"
        >
          <ArrowUp className="h-3.5 w-3.5" />
          Top
        </Button>
      </div>
    </motion.footer>
  );
}
