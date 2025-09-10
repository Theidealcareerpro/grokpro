'use client'; // Mark as client component to avoid RSC issues
import { Github, Linkedin, Twitter } from 'lucide-react';
import { motion } from 'framer-motion'; // Version 10.18.0
import Link from 'next/link';

// Explicitly type the motion component props
const MotionFooter = motion.footer as React.ComponentType<{
  initial?: { opacity: number; y: number };
  animate?: { opacity: number; y: number };
  transition?: { duration: number };
  className?: string;
  children: React.ReactNode;
}>;

export default function Footer() {
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/cv', label: 'CV' },
    { href: '/donate', label: 'Donate' },
    { href: '/faq', label: 'FAQ' },
  ];

  const socialLinks = [
    { href: 'https://twitter.com/theidealprogen', label: 'Twitter', icon: Twitter },
    { href: 'https://linkedin.com/company/theidealprogen', label: 'LinkedIn', icon: Linkedin },
    { href: 'https://github.com/theidealprogen', label: 'GitHub', icon: Github },
  ];

  return (
    <MotionFooter
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background border-t border-border py-4"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Connect With Us</h3>
            <div className="flex justify-center md:justify-start gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-primary transition-colors"
                  aria-label={link.label}
                >
                  <link.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">TheIdealProGen</h3>
            <p className="text-sm text-foreground">
              © 2025 TheIdealProGen. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </MotionFooter>
  );
}