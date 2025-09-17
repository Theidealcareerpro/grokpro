'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import PortfolioPreview from '@/components/portfolio/PortfolioPreview';
import SectionIntro from '@/components/SectionIntro';
import Counters from '@/components/AnimatedCounters';
import PortfolioForm from '@/components/portfolio/PortfolioForm';
import { supabase } from '@/lib/supabase';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import type { PortfolioData } from '@/lib/portfolio-types';
import Image from 'next/image';

/* ------------------------------------------------------------------ */
/* Publishing Overlay (brand, steps, timer, progress)                  */
/* ------------------------------------------------------------------ */

type Step = { key: string; label: string; status: 'idle' | 'active' | 'done' | 'error' };

function PublishingOverlay({
  open,
  error,
  url,
  onClose,
  brand = 'TheIdealProGen',
  logoSrc, // optional, e.g. '/logo.svg'
  steps,
  elapsedMs,
  progressPct,
}: {
  open: boolean;
  error: string | null;
  url: string | null;
  onClose: () => void;
  brand?: string;
  logoSrc?: string;
  steps: Step[];
  elapsedMs: number;
  progressPct: number;
}) {
  if (!open) return null;

  const mm = Math.floor(elapsedMs / 60000)
    .toString()
    .padStart(2, '0');
  const ss = Math.floor((elapsedMs % 60000) / 1000)
    .toString()
    .padStart(2, '0');

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/60 backdrop-blur-sm p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Publishing portfolio"
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="w-[min(720px,94vw)] rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))/0.6] px-5 py-3">
          {logoSrc ? (
            <Image src={logoSrc} alt={`${brand} logo`} width={28} height={28} className="rounded-sm" />
          ) : (
            <div className="grid h-7 w-7 place-items-center rounded bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] text-xs font-bold">
              {brand.slice(0, 2).toUpperCase()}
            </div>
          )}
          <div className="text-sm">
            <div className="font-semibold">Publishing your portfolio…</div>
            <div className="text-[hsl(var(--muted-foreground))]">This takes ~10–20 seconds.</div>
          </div>
          <div className="ml-auto rounded-full bg-[hsl(var(--muted))] px-2 py-0.5 text-xs tabular-nums">
            {mm}:{ss}
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Progress bar */}
          <div className="mb-4 h-2 w-full overflow-hidden rounded-full bg-[hsl(var(--muted))]">
            <motion.div
              className="h-full bg-[hsl(var(--primary))]"
              style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Steps */}
          <ol className="space-y-2">
            {steps.map((s) => (
              <li
                key={s.key}
                className="flex items-center justify-between rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={[
                      'inline-flex h-2.5 w-2.5 rounded-full',
                      s.status === 'done' && 'bg-[hsl(var(--success))]',
                      s.status === 'active' && 'bg-[hsl(var(--warning))] animate-pulse',
                      s.status === 'error' && 'bg-[hsl(var(--destructive))]',
                      s.status === 'idle' && 'bg-[hsl(var(--muted-foreground))]/40',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    aria-hidden
                  />
                  <span className="text-sm">{s.label}</span>
                </div>
                <span className="text-xs text-[hsl(var(--muted-foreground))]">
                  {s.status === 'done' ? '✓ Done' : s.status === 'active' ? 'Working…' : s.status === 'error' ? 'Failed' : ''}
                </span>
              </li>
            ))}
          </ol>

          {/* Result */}
          <div className="mt-5 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
            {error ? (
              <div className="text-[hsl(var(--destructive))]">
                <div className="text-sm font-semibold">Publish failed</div>
                <div className="mt-1 text-xs opacity-90">{error}</div>
              </div>
            ) : url ? (
              <div>
                <div className="text-sm font-semibold text-[hsl(var(--success))]">Published successfully</div>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-2 text-[hsl(var(--secondary))] underline"
                >
                  View live site
                </a>
                <div className="mt-1 text-xs text-[hsl(var(--muted-foreground))]">
                  Pages can take a few seconds to propagate.
                </div>
              </div>
            ) : (
              <div className="text-sm text-[hsl(var(--muted-foreground))]">Preparing your link…</div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={!error && !url}>
              {error ? 'Close' : url ? 'Done' : 'Cancel'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function PortfolioPage() {
  // force dark mode (page-level, in case global layout isn’t enforcing it)
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('dark')) root.classList.add('dark');
  }, []);

  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
    fullName: '',
    role: '',
    tagline: '',
    location: '',
    email: '',
    phone: '',
    linkedin: '',
    photoDataUrl: '',
    cvFileDataUrl: '',
    cvFileName: '',
    about: '',
    skills: [''],
    projects: [{ name: '', description: '', link: '' }],
    certifications: [''],
    media: [{ title: '', type: 'video', link: '' }],
    socials: [{ label: '', url: '' }],
    templateId: 'modern',
    username: '',
  });

  const [viewSize, setViewSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDonationPrompt, setShowDonationPrompt] = useState(false);
  const [donationError, setDonationError] = useState<string | null>(null);
  const [publishLoading, setPublishLoading] = useState(false); // button disabled state
  const [liveUrl, setLiveUrl] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  // overlay state
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [overlayError, setOverlayError] = useState<string | null>(null);
  const [overlayUrl, setOverlayUrl] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [progress, setProgress] = useState(0);
  const [steps, setSteps] = useState<Step[]>([
    { key: 'repo', label: 'Creating GitHub repository', status: 'idle' },
    { key: 'files', label: 'Uploading portfolio files', status: 'idle' },
    { key: 'pages', label: 'Enabling GitHub Pages', status: 'idle' },
    { key: 'db', label: 'Saving record', status: 'idle' },
    { key: 'final', label: 'Finalizing & generating link', status: 'idle' },
  ]);

  const hasErrors = useMemo(() => Object.values(errors).some(Boolean), [errors]);

  useEffect(() => {
    void loadFingerprintAndMetadata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadFingerprintAndMetadata() {
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const visitorId = result.visitorId;
      setFingerprint(visitorId);

      const { data, error } = await supabase
        .from('portfolios')
        .select('expiry, donation_status, github_repo')
        .eq('fingerprint', visitorId)
        .limit(1)
        .maybeSingle();

      if (error) console.error('Supabase read error:', error);

      if (data) {
        const expiryDate = new Date(data.expiry);
        if (Number.isFinite(expiryDate.getTime()) && new Date() > expiryDate) {
          setShowDonationPrompt(true);
        }
        if (data.github_repo) {
          const [owner, repo] = String(data.github_repo).split('/');
          if (owner && repo) setLiveUrl(`https://${owner}.github.io/${repo}/`);
        }
      }
    } catch (err) {
      console.error('Error loading fingerprint:', err);
    } finally {
      setIsLoading(false);
    }
  }

  // Simulated stepper while the single publish request runs
  function startOverlay() {
    setOverlayOpen(true);
    setOverlayError(null);
    setOverlayUrl(null);
    setElapsedMs(0);
    setProgress(0);
    setSteps((prev) =>
      prev.map((s, i) => ({ ...s, status: i === 0 ? 'active' : 'idle' }))
    );

    // timer
    const t0 = Date.now();
    const timer = window.setInterval(() => setElapsedMs(Date.now() - t0), 250);

    // step ticker (visual only, doesn’t change server logic)
    let i = 0;
    const schedule = [1200, 1300, 1400, 1100]; // timings between step bumps
    let bumpTo = window.setTimeout(function next() {
      i = Math.min(i + 1, steps.length - 2); // keep last step for success
      setSteps((prev) =>
        prev.map((s, idx) =>
          idx < i ? { ...s, status: 'done' } : idx === i ? { ...s, status: 'active' } : s
        )
      );
      setProgress(Math.min(92, 18 + i * 18)); // creep to ~92% while waiting
      if (i < steps.length - 2) bumpTo = window.setTimeout(next, schedule[i % schedule.length]);
    }, schedule[0]);

    return () => {
      window.clearInterval(timer);
      window.clearTimeout(bumpTo);
    };
  }

  async function handlePublish() {
    if (hasErrors) {
      alert('Please fix all errors before publishing.');
      return;
    }
    if (!fingerprint) {
      alert('Unable to determine fingerprint. Please reload the page and try again.');
      return;
    }

    setPublishLoading(true);
    setLiveUrl(null);
    const stopOverlay = startOverlay();

    try {
      const res = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioData, fingerprint }),
      });

      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) throw new Error(data?.error || 'Publish failed');

      // mark all steps done + finish bar
      setSteps((prev) => prev.map((s) => ({ ...s, status: 'done' })));
      setProgress(100);
      setOverlayUrl(data.url ?? null);
      setLiveUrl(data.url ?? null);
    } catch (err: any) {
      console.error('Publish error:', err);
      setOverlayError(err?.message || 'Failed to publish portfolio');
      // Find the first active step and mark it error
      setSteps((prev) => {
        const idx = prev.findIndex((s) => s.status === 'active') || prev.length - 1;
        return prev.map((s, i) =>
          i < idx ? { ...s, status: 'done' } : i === idx ? { ...s, status: 'error' } : s
        );
      });
    } finally {
      setPublishLoading(false);
      // keep overlay open; user closes with button
      // stop timers after a short grace so the final state feels snappy
      setTimeout(() => stopOverlay(), 300);
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        Loading...
      </div>
    );
  }

  // preview width caps
  const previewMaxWidth = viewSize === 'mobile' ? 375 : viewSize === 'tablet' ? 768 : 1280;

  const PreviewBody = (
    <div className="rounded-b-2xl bg-card p-6">
      <div style={{ maxWidth: previewMaxWidth, marginLeft: 'auto', marginRight: 'auto' }}>
        <PortfolioPreview data={portfolioData} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="mx-auto mb-6 flex max-w-7xl items-center justify-between px-4 pt-6">
        <h1 className="text-2xl font-bold">Portfolio Builder</h1>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPortfolioData({
                fullName: '',
                role: '',
                tagline: '',
                location: '',
                email: '',
                phone: '',
                linkedin: '',
                photoDataUrl: '',
                cvFileDataUrl: '',
                cvFileName: '',
                about: '',
                skills: [''],
                projects: [{ name: '', description: '', link: '' }],
                certifications: [''],
                media: [{ title: '', type: 'video', link: '' }],
                socials: [{ label: '', url: '' }],
                templateId: 'modern',
                username: '',
              });
              setErrors({});
              setLiveUrl(null);
            }}
          >
            Reset
          </Button>
          <Button onClick={handlePublish} disabled={publishLoading}>
            {publishLoading ? 'Publishing…' : 'Publish'}
          </Button>
        </div>
      </header>

      {/* Main (same sizes as CV page) */}
      <main className="mx-auto max-w-[90vw] px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left: Form */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-lg border border-border bg-card text-card-foreground shadow-card"
            style={{
              width: '45vw',
              minWidth: '300px',
              maxWidth: '800px',
              transition: 'width 0.3s ease-in-out',
            }}
          >
            <div className="p-6">
              <PortfolioForm
                portfolioData={portfolioData}
                setPortfolioData={setPortfolioData}
                errors={errors}
                setErrors={setErrors}
              />

              {liveUrl && (
                <div className="mt-4 rounded-lg border border-[hsl(var(--success))] bg-[hsl(var(--success))/0.12] p-4">
                  <h3 className="text-lg font-semibold">Live Portfolio</h3>
                  <p className="text-sm">
                    Your portfolio is live at{' '}
                    <a className="underline" href={liveUrl} target="_blank" rel="noopener noreferrer">
                      {liveUrl}
                    </a>
                  </p>
                </div>
              )}

              {showDonationPrompt && (
                <div className="mt-4 rounded-lg border border-[hsl(var(--warning))] bg-[hsl(var(--warning))/0.12] p-4">
                  <h3 className="text-lg font-semibold">Portfolio Expired</h3>
                  <p className="text-sm text-muted-foreground">Support us to extend your portfolio!</p>
                  <div className="mt-2">
                    <a
                      href="https://www.buymeacoffee.com/theidealprogen"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Buy me a coffee"
                    >
                      <Image
                        src="https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=☕&slug=theidealprogen&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=FF0000"
                        alt="Buy Me a Coffee"
                        width={200}
                        height={50}
                      />
                    </a>
                  </div>
                  {donationError ? (
                    <p className="mt-2 text-xs text-[hsl(var(--destructive))]">{donationError}</p>
                  ) : (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Each $5 donation extends your portfolio by 30 days (max 6 months).
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.section>

          {/* Right: Preview */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="rounded-2xl border border-border bg-card text-card-foreground shadow-card"
            style={{
              width: '45vw',
              minWidth: '300px',
              maxWidth: '800px',
              transition: 'width 0.3s ease-in-out',
            }}
          >
            {/* Faux window chrome */}
            <div className="flex items-center justify-between rounded-t-2xl border-b border-border bg-muted/60 px-4 py-2">
              <div className="flex gap-1.5" aria-hidden>
                <span className="h-3 w-3 rounded-full bg-[hsl(var(--destructive))]" />
                <span className="h-3 w-3 rounded-full bg-[hsl(var(--warning))]" />
                <span className="h-3 w-3 rounded-full bg-[hsl(var(--success))]" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setViewSize('mobile')} aria-label="Mobile view">
                  Mobile
                </Button>
                <Button variant="outline" size="sm" onClick={() => setViewSize('tablet')} aria-label="Tablet view">
                  Tablet
                </Button>
                <Button variant="outline" size="sm" onClick={() => setViewSize('desktop')} aria-label="Desktop view">
                  Desktop
                </Button>
                <Button size="sm" onClick={() => setIsPreviewExpanded(true)} aria-label="Expand preview">
                  Expand
                </Button>
              </div>
            </div>

            {PreviewBody}
          </motion.section>
        </div>
      </main>

      <footer className="mt-20">
        <SectionIntro className="py-16" from="up" hue={192}>
          <div className="container-app">
            <h2 className="sr-only">Live platform stats</h2>
            <Counters />
          </div>
        </SectionIntro>
      </footer>

      {/* Expanded Preview Modal */}
      {isPreviewExpanded && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded portfolio preview"
        >
          <div className="w-[min(92vw,1400px)] max-h-[85vh] overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-card">
            <div className="flex items-center justify-between border-b border-border bg-muted/70 px-4 py-2">
              <div className="flex gap-1.5" aria-hidden>
                <span className="h-3 w-3 rounded-full bg-[hsl(var(--destructive))]" />
                <span className="h-3 w-3 rounded-full bg-[hsl(var(--warning))]" />
                <span className="h-3 w-3 rounded-full bg-[hsl(var(--success))]" />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setViewSize('mobile')}>
                  Mobile
                </Button>
                <Button variant="outline" size="sm" onClick={() => setViewSize('tablet')}>
                  Tablet
                </Button>
                <Button variant="outline" size="sm" onClick={() => setViewSize('desktop')}>
                  Desktop
                </Button>
                <Button size="sm" onClick={() => setIsPreviewExpanded(false)}>
                  Close
                </Button>
              </div>
            </div>
            <div className="max-h-[calc(85vh-44px)] overflow-y-auto">{PreviewBody}</div>
          </div>
        </div>
      )}

      {/* Publish overlay */}
      <PublishingOverlay
        open={overlayOpen}
        error={overlayError}
        url={overlayUrl}
        onClose={() => {
          setOverlayOpen(false);
          setOverlayError(null);
          setOverlayUrl(null);
          setElapsedMs(0);
          setProgress(0);
          setSteps((prev) => prev.map((s) => ({ ...s, status: 'idle' })));
        }}
        brand="TheIdealProGen"
        // logoSrc="/logo.svg" // <- optional if you have a logo file
        steps={steps}
        elapsedMs={elapsedMs}
        progressPct={progress}
      />
    </div>
  );
}
