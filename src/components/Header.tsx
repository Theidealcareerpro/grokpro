'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, useScroll, useSpring, useMotionValueEvent } from 'framer-motion';
import { Coffee, Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

type NavLink = { href: `/${string}` | '/'; label: string };

const ThemeToggle = dynamic(
  () =>
    import('next-themes').then((mod) => {
      const { useTheme } = mod;
      return function ThemeToggleInner() {
        const { setTheme, theme } = useTheme();
        const isDark = theme === 'dark';
        return (
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10"
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            aria-label="Toggle dark mode"
            aria-pressed={isDark}
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        );
      };
    }),
  { ssr: false }
);

const NAV_LINKS: readonly NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/cv', label: 'CV' },
  { href: '/cl', label: 'Cover Letter' },
  { href: '/donate', label: 'Donate' },
] as const;

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const pathname = usePathname();

  const { scrollYProgress, scrollY } = useScroll();
  const width = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.2 });

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const prev = scrollY.getPrevious() ?? 0;
    const goingDown = latest > prev;
    setHidden(goingDown && latest > 24); // hide only after slight scroll
  });

  useEffect(() => {
    // close sheet when route changes
    setIsOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Skip link */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-3 focus:py-2 focus:rounded-lg focus:bg-primary focus:text-primary-foreground"
      >
        Skip to content
      </a>

      {/* Scroll progress bar */}
      <motion.div
        style={{ scaleX: width, transformOrigin: '0% 50%' }}
        className="fixed left-0 top-0 h-0.5 w-full bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 z-[60]"
        aria-hidden
      />

      <motion.header
        variants={{
          visible: { y: 0 },
          hidden: { y: -88 },
        }}
        initial="visible"
        animate={hidden ? 'hidden' : 'visible'}
        transition={{ type: 'spring', stiffness: 380, damping: 34 }}
        className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/50"
        role="banner"
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          {/* Brand */}
          <Link
            href="/"
            aria-label="TheIdealProGen home"
            className="group inline-flex items-center gap-2 text-xl font-bold text-foreground"
          >
            <motion.img
              src="/favicon.ico"
              alt="TheIdealProGen logo"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="h-8 w-auto"
              loading="eager"
              decoding="async"
            />
            <span className="bg-clip-text text-transparent bg-[linear-gradient(90deg,#14b8a6,40%,#06b6d4,70%,#3b82f6)] group-hover:brightness-110 transition">
              TheIdealProGen
            </span>
          </Link>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'relative rounded-md px-3 py-2 text-sm transition',
                    active ? 'text-primary' : 'text-foreground hover:text-primary',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                  ].join(' ')}
                >
                  <span className="relative">
                    {link.label}
                    <span
                      className={[
                        'absolute left-0 -bottom-1 h-0.5 w-full rounded-full',
                        active ? 'bg-primary' : 'bg-transparent group-hover:bg-primary/70',
                      ].join(' ')}
                    />
                  </span>
                </Link>
              );
            })}
            <Button variant="outline" className="ml-1 mr-1" asChild>
              <a
                href="https://buymeacoffee.com/placeholder"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Donate 5 dollars"
                className="inline-flex items-center gap-2"
              >
                <Coffee className="h-5 w-5" />
                Donate $5
              </a>
            </Button>
            <ThemeToggle />
          </nav>

          {/* Mobile */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="md:hidden h-10 w-10"
                aria-label="Open menu"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent id="mobile-menu" side="right" className="w-[240px] sm:w-[300px]">
              <nav className="mt-6 flex flex-col gap-1" aria-label="Mobile">
                {NAV_LINKS.map((link) => {
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? 'page' : undefined}
                      onClick={() => setIsOpen(false)}
                      className={[
                        'rounded-md px-3 py-2 transition',
                        active ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted',
                      ].join(' ')}
                    >
                      {link.label}
                    </Link>
                  );
                })}
                <Button variant="outline" className="mt-2" asChild>
                  <a
                    href="https://buymeacoffee.com/placeholder"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    aria-label="Donate 5 dollars"
                  >
                    <Coffee className="mr-2 h-5 w-5" />
                    Donate $5
                  </a>
                </Button>
                <div className="pt-2">
                  <ThemeToggle />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </motion.header>
    </>
  );
}
