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
      className="glass-footer relative py-4 sm:py-5"
    >
      {/* Top separators */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[hsl(var(--border))]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[1px] h-px bg-gradient-to-r from-[hsl(var(--primary)/0)] via-[hsl(var(--primary)/0.35)] to-[hsl(var(--primary)/0)]"
      />

      {/* Top row (2 columns now) */}
      <div className="container-app px-4 sm:px-6">
        <div className="grid items-start gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
          {/* Brand + socials */}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[13px] sm:text-sm font-semibold tracking-tight text-[hsl(var(--foreground))]">
                TheIdealProGen
              </span>
            </div>
            <p className="mt-1 text-[11px] sm:text-xs text-[hsl(var(--muted-foreground))]">
              Free, beautiful documents for students and Professionals — powered by $5 coffees.
            </p>
            <div className="mt-3 flex flex-wrap gap-3">
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

          {/* Quick links */}
          <nav aria-label="Quick links">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-[hsl(var(--muted-foreground))]">
              Quick Links
            </div>
            <ul className="mt-2 grid grid-cols-2 gap-2">
              {NAV.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block py-1.5 text-[13px] text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="container-app px-4 sm:px-6 mt-4 sm:mt-5 flex flex-col sm:flex-row gap-2 sm:gap-4 items-center justify-between">
        <p className="text-[11px] sm:text-xs leading-none text-[hsl(var(--muted-foreground))] text-center sm:text-left">
          © {year} TheIdealProGen. All rights reserved.
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={backToTop}
          aria-label="Back to top"
          className="gap-1 px-2 py-1.5 text-xs"
        >
          <ArrowUp className="h-4 w-4" />
          Top
        </Button>
      </div>
    </motion.footer>
  );
}
