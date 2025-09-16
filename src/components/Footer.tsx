'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';

type Nav = { href: `/${string}` | '/'; label: string };
type Social = { href: `https://${string}`; label: 'Twitter' | 'LinkedIn' | 'GitHub'; icon: React.ComponentType<{ className?: string }> };

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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background border-t border-border py-10"
      aria-label="Footer"
    >
      <div className="container mx-auto px-4 grid gap-8 md:grid-cols-4">
        {/* Brand + intro */}
        <div>
          <h3 className="text-lg font-semibold text-foreground">TheIdealProGen</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Free, beautiful documents for students—powered by $5 coffees.
          </p>
          <div className="mt-4 flex gap-3">
            {SOCIAL.map((s) => (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-foreground hover:text-primary transition-colors"
              >
                <s.icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <nav className="md:col-span-2" aria-label="Quick links">
          <h3 className="text-lg font-semibold text-foreground">Quick Links</h3>
          <ul className="mt-3 grid grid-cols-2 gap-2">
            {NAV.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-foreground hover:text-primary transition-colors">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Newsletter (UI only) */}
        <div>
          <h3 className="text-lg font-semibold text-foreground">Stay in the loop</h3>
          <form className="mt-3 space-y-2" onSubmit={(e) => e.preventDefault()}>
            <label htmlFor="newsletter-email" className="sr-only">
              Email
            </label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <Button className="w-full">Subscribe</Button>
          </form>
        </div>
      </div>

      <div className="container mx-auto mt-8 flex items-center justify-between px-4">
        <p className="text-xs text-muted-foreground">© {year} TheIdealProGen. All rights reserved.</p>
        <Button variant="ghost" size="sm" onClick={backToTop} aria-label="Back to top" className="gap-1">
          <ArrowUp className="h-4 w-4" />
          Top
        </Button>
      </div>
    </motion.footer>
  );
}
