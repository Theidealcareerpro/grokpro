'use client';
import { motion } from 'framer-motion';
import { Coffee, Menu, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Dynamic import for ThemeToggle to prevent hydration issues
const ThemeToggle = dynamic(
  () => import('next-themes').then((mod) => {
    const { useTheme } = mod;
    return function ThemeToggle() {
      const { setTheme, theme } = useTheme();
      return (
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          aria-label="Toggle dark mode"
        >
          {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      );
    };
  }),
  { ssr: false }
);

// Correctly typed motion.img
const MotionImg = motion.img as React.ComponentType<{
  src: string;
  alt: string;
  initial?: { opacity: number; y?: number };
  animate?: { opacity: number; y?: number };
  transition?: { duration: number; delay?: number };
  className?: string;
}>;

// Augment motion.header type to include className
const MotionHeader = motion.header as React.ComponentType<{
  children: React.ReactNode;
  initial?: { y: number };
  animate?: { y: number };
  transition?: { duration: number };
  className?: string; // Add className to resolve the error
}>;

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/cv', label: 'CV' },
    { href: '/cl', label: 'Cover Letter' },
    { href: '/donate', label: 'Donate' },
  ];

  return (
    <MotionHeader
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border" // Error fixed here
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Text */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary transition-colors">
          <MotionImg
            src="/favicon.ico" // Path to the SVG in public folder
            alt="Logo"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 8, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-8 w-auto" // Adjusted height for better fit
          />
          TheIdealProGen
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <Button variant="outline" className="flex items-center gap-2" asChild>
            <a href="https://buymeacoffee.com/placeholder">
              <Coffee className="h-5 w-5" />
              Donate $5
            </a>
          </Button>
          <ThemeToggle />
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden h-10 w-10" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px]">
            <nav className="flex flex-col gap-4 mt-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-foreground hover:text-primary transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Button variant="outline" className="flex items-center gap-2" asChild>
                <a href="https://buymeacoffee.com/placeholder" onClick={() => setIsOpen(false)}>
                  <Coffee className="h-5 w-5" />
                  Donate $5
                </a>
              </Button>
              <ThemeToggle />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </MotionHeader>
  );
}