// src/app/portfolio/page.tsx
'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import PortfolioPreview from '@/components/portfolio/PortfolioPreview';
import SectionIntro from '@/components/SectionIntro';
import brandLogo from '@/components/logo.png';
import Counters from '@/components/AnimatedCounters';
import PortfolioForm from '@/components/portfolio/PortfolioForm';
import { supabase } from '@/lib/supabase';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import type { PortfolioData } from '@/lib/portfolio-types';
import Image from 'next/image';
import PublishProgress from '@/components/PublishProgress';

/* ----------------------------- Types ----------------------------- */

type PublishApiResponse = {
  ok?: boolean;
  url?: string;
  repo?: string;
  portfolio?: unknown;
  error?: string;
};

type StepStatus = 'idle' | 'active' | 'done' | 'error';
type Step = {
  key: 'prepare' | 'upload' | 'configure' | 'save' | 'activate';
  label: string;
  status: StepStatus;
};

type UsageOk = {
  ok: true;
  admin: boolean;
  fingerprint: string;
  counts: { publishesToday: number; publishedThisMonth: number; liveSites: number };
  limits: { daily: number; monthly: number; live: number };
  nextResetAt: string;
  expirySoon: boolean;
};
type UsageRes = UsageOk | { ok: false; error: string };

/* ----------------------------- Page ------------------------------ */

export default function PortfolioPage() {
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

  const [usage, setUsage] = useState<UsageOk | null>(null);

  const [progressOpen, setProgressOpen] = useState(false);
  const [steps, setSteps] = useState<Step[]>([
    { key: 'prepare', label: 'Prepare files', status: 'idle' },
    { key: 'upload', label: 'Upload to GitHub', status: 'idle' },
    { key: 'configure', label: 'Configure GitHub Pages', status: 'idle' },
    { key: 'save', label: 'Save deployment', status: 'idle' },
    { key: 'activate', label: 'Activate & verify', status: 'idle' },
  ]);
  const [activePercent, setActivePercent] = useState(0);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [publishError, setPublishError] = useState<string | null>(null);

  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const hasErrors = useMemo(() => Object.values(errors).some(Boolean), [errors]);

  /* ✅ NEW: instructional video toggle */
  const [videoOpen, setVideoOpen] = useState(false);

  /* ----------------------- Init & usage fetch ---------------------- */
  // (UNCHANGED — omitted here for brevity but INCLUDED EXACTLY as you provided)

  useEffect(() => {
    (async () => {
      try {
        const fp = await FingerprintJS.load();
        const { visitorId } = await fp.get();
        setFingerprint(visitorId);

        // legacy meta read (unchanged)
        const { data, error } = await supabase
          .from('portfolios')
          .select('expiry, donation_status, github_repo')
          .eq('fingerprint', visitorId)
          .limit(1)
          .maybeSingle();

        if (error) {
          console.error('Supabase read error:', error);
          setDonationError(error.message || 'Failed to check portfolio status.');
        }

        if (data) {
          const expiryDate = new Date((data as { expiry: string }).expiry);
          if (Number.isFinite(expiryDate.getTime()) && new Date() > expiryDate) {
            setShowDonationPrompt(true);
          }
          const repo = (data as { github_repo?: string }).github_repo;
          if (repo) {
            const [owner, name] = String(repo).split('/');
            if (owner && name) {
              setResultUrl(`https://${owner}.github.io/${name}/`);
            }
          }
        }
      } catch (err) {
        console.error('Fingerprint/init error:', err);
        setDonationError('Unable to initialize. Please refresh and try again.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  // Fetch usage once we have the fingerprint
  useEffect(() => {
    const run = async () => {
      if (!fingerprint) return;
      const resp = await fetch('/api/usage', { headers: { 'x-fingerprint': fingerprint } });
      const json = (await resp.json()) as UsageRes;
      if (json.ok) setUsage(json);
    };
    void run();
  }, [fingerprint]);

  const refreshUsage = async () => {
    if (!fingerprint) return;
    const resp = await fetch('/api/usage', { headers: { 'x-fingerprint': fingerprint } });
    const json = (await resp.json()) as UsageRes;
    if (json.ok) setUsage(json);
  };

  /* ---------------------- Progress helpers ------------------------ */

  const setStepStatus = (key: Step['key'], status: StepStatus) =>
    setSteps((prev) => prev.map((s) => (s.key === key ? { ...s, status } : s)));

  const setStepLabel = (key: Step['key'], label: string) =>
    setSteps((prev) => prev.map((s) => (s.key === key ? { ...s, label } : s)));

  const resetProgress = () => {
    setSteps([
      { key: 'prepare',   label: 'Prepare files',           status: 'idle' },
      { key: 'upload',    label: 'Upload to GitHub',        status: 'idle' },
      { key: 'configure', label: 'Configure GitHub Pages',  status: 'idle' },
      { key: 'save',      label: 'Save deployment',         status: 'idle' },
      { key: 'activate',  label: 'Activate & verify',       status: 'idle' },
    ]);
    setActivePercent(0);
    setPublishError(null);
    setResultUrl(null);
  };

  /* -------------------------- Publish ----------------------------- */

  const handlePublish = async () => {
    if (hasErrors) {
      alert('Please fix all form errors before publishing.');
      return;
    }
    if (!fingerprint) {
      alert('Unable to determine fingerprint. Please reload the page and try again.');
      return;
    }

    // Open overlay and initialize steps
    resetProgress();
    setProgressOpen(true);
    setStartedAt(Date.now());
    setStepStatus('prepare', 'active');
    setActivePercent(15);

    try {
      // small visual ramp
      setTimeout(() => setActivePercent(30), 180);

      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioData, fingerprint }),
      });

      // flip through the “server work” steps
      setStepStatus('prepare', 'done');
      setStepStatus('upload', 'active');
      setActivePercent(55);

      const data = (await response.json()) as PublishApiResponse;

      if (!response.ok) {
        throw new Error(data?.error || 'Publish failed');
      }

      // Configure + Save (brief UX bumps)
      setStepStatus('upload', 'done');
      setStepStatus('configure', 'active');
      setActivePercent(72);
      await new Promise((r) => setTimeout(r, 400));

      setStepStatus('configure', 'done');
      setStepStatus('save', 'active');
      setActivePercent(86);
      await new Promise((r) => setTimeout(r, 300));
      setStepStatus('save', 'done');

      // ---- Activate & verify (countdown + polling) ----
      const url = data.url ?? null;
      if (!url) throw new Error('No Pages URL returned.');

      setStepStatus('activate', 'active');

      const TIMEOUT_MS = 90_000; // 90s budget
      const POLL_MS = 3_000;     // check every 3s
      const start = Date.now();

      let live = false;
      while (Date.now() - start < TIMEOUT_MS) {
        // update micro progress + dynamic label countdown
        const elapsed = Date.now() - start;
        const remaining = Math.max(0, TIMEOUT_MS - elapsed);
        const pct = Math.min(100, Math.round((elapsed / TIMEOUT_MS) * 100));
        setActivePercent(Math.max(10, pct));
        setStepLabel('activate', `Activate & verify (~${Math.ceil(remaining / 1000)}s)`);

        // server-side liveness check (no CORS/cache issues)
        const statusResp = await fetch(`/api/publish/status?url=${encodeURIComponent(url)}`, {
          method: 'GET',
          cache: 'no-store',
        });
        if (statusResp.ok) {
          const j = (await statusResp.json()) as { live: boolean };
          if (j.live) {
            live = true;
            break;
          }
        }

        await new Promise((r) => setTimeout(r, POLL_MS));
      }

      if (live) {
        setActivePercent(100);
        setStepLabel('activate', 'Activate & verify');
        setStepStatus('activate', 'done');
        setResultUrl(url);
      } else {
        // Not live within budget — show the URL but warn via label
        setStepLabel('activate', 'Activate & verify (still propagating)');
        setStepStatus('activate', 'done');
        setResultUrl(url);
      }

      // Refresh usage chips after a successful publish
      await refreshUsage();
    } catch (err) {
      console.error('Publish error:', err);
      setPublishError(err instanceof Error ? err.message : 'Failed to publish portfolio.');
      // Mark current active step as error for clarity
      setSteps((prev) =>
        prev.map((s) => (s.status === 'active' ? { ...s, status: 'error' } : s))
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground text-[var(--font-body)]">
        Loading…
      </div>
    );
  }

  const previewMaxWidth = viewSize === 'mobile' ? 375 : viewSize === 'tablet' ? 768 : 1280;

  // NEW: mobile-specific preview style (tablet/desktop use original maxWidth)
  const previewStyle =
    viewSize === 'mobile'
      ? { width: 'min(calc(100vw - 2rem), 390px)', marginLeft: 'auto', marginRight: 'auto' }
      : { maxWidth: previewMaxWidth, marginLeft: 'auto', marginRight: 'auto' };

  const PreviewBody = (
    <div className="rounded-b-2xl bg-card p-4 sm:p-6">
      <div ref={previewRef} style={previewStyle}>
        <PortfolioPreview data={portfolioData} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground text-[var(--font-body)] leading-relaxed">
      {/* Header */}
      <header className="mx-auto mb-6 flex max-w-7xl flex-col gap-3 px-4 pt-6">
        <div className="flex items-center justify-between min-w-0">
          <h1 className="text-[clamp(20px,5vw,28px)] font-bold">Portfolio Builder</h1>
          <div className="hidden md:flex gap-2">
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
                setResultUrl(null);
              }}
            >
              Reset
            </Button>
            <Button onClick={handlePublish}>Publish</Button>
          </div>
        </div>

        {/* Usage chips */}
        {usage && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full border border-border bg-muted/40 px-2 py-1">
              Publishes today: {usage.counts.publishesToday}/{usage.limits.daily}
            </span>
            <span className="rounded-full border border-border bg-muted/40 px-2 py-1">
              This month: {usage.counts.publishedThisMonth}/{usage.limits.monthly}
            </span>
            <span className="rounded-full border border-border bg-muted/40 px-2 py-1">
              Live sites: {usage.counts.liveSites}/{usage.limits.live}
            </span>
            {usage.expirySoon && (
              <span className="rounded-full border border-yellow-800 bg-yellow-900/30 px-2 py-1 text-yellow-200">
                Expiring soon
              </span>
            )}
            {usage.admin && (
              <span className="rounded-full border border-emerald-800 bg-emerald-900/30 px-2 py-1 text-emerald-200">
                Admin
              </span>
            )}
          </div>
        )}
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-none px-4 md:max-w-[90vw] md:px-6">
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Left: Form */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="min-w-0 w-full md:w-[45vw] md:max-w-[800px] rounded-lg border border-border bg-card text-card-foreground shadow-card transition-[width] duration-300 ease-in-out"
          >
            <div className="p-4 sm:p-6">
              <PortfolioForm
                portfolioData={portfolioData}
                setPortfolioData={setPortfolioData}
                errors={errors}
                setErrors={setErrors}
              />

              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  variant="ghost"
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
                    setResultUrl(null);
                  }}
                >
                  Reset
                </Button>
                <Button onClick={handlePublish}>Publish</Button>
              </div>

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
                  <p className="mt-2 text-xs text-muted-foreground">
                    Each $5 donation extends your portfolio by 30 days (max 6 months).
                    Extension applies automatically after confirmation.
                  </p>
                  {donationError ? (
                    <p className="mt-2 text-xs text-[hsl(var(--destructive))]">{donationError}</p>
                  ) : null}
                </div>
              )}

              {resultUrl && (
                <div className="mt-4 rounded-lg border border-[hsl(var(--success))] bg-[hsl(var(--success))/0.12] p-4">
                  <h3 className="text-lg font-semibold">Live Portfolio</h3>
                  <p className="text-sm">
                    Your portfolio is live at{' '}
                    <a className="underline" href={resultUrl} target="_blank" rel="noopener noreferrer">
                      {resultUrl}
                    </a>
                  </p>
                </div>
              )}
            </div>
          </motion.section>

          {/* Right: Preview */}
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            className="min-w-0 w-full md:w-[45vw] md:max-w-[800px] rounded-2xl border border-border bg-card text-card-foreground shadow-card transition-[width] duration-300 ease-in-out"
          >
            <div className="flex items-center justify-between rounded-t-2xl border-b border-border bg-muted/60 px-4 py-2">
              <div className="flex gap-1.5" aria-hidden>
                <span className="h-3 w-3 rounded-full bg-[hsl(var(--destructive))]" />
                <span className="h-3 w-3 rounded-full bg-[hsl(var(--warning))]" />
                <span className="h-3 w-3 rounded-full bg-[hsl(var(--success))]" />
              </div>

              {/* Desktop controls (unchanged) */}
              <div className="hidden md:flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setViewSize('mobile')} aria-label="Mobile view">Mobile</Button>
                <Button variant="outline" size="sm" onClick={() => setViewSize('tablet')} aria-label="Tablet view">Tablet</Button>
                <Button variant="outline" size="sm" onClick={() => setViewSize('desktop')} aria-label="Desktop view">Desktop</Button>
                <Button size="sm" onClick={() => setIsPreviewExpanded(true)} aria-label="Expand preview">Expand</Button>
              </div>

              {/* Mobile controls (NEW) */}
              <div className="md:hidden flex items-center gap-2">
                <select
                  aria-label="Preview size"
                  value={viewSize}
                  onChange={(e) => setViewSize(e.target.value as typeof viewSize)}
                  className="h-9 rounded-md border border-border bg-card px-2 text-xs"
                >
                  <option value="mobile">Mobile</option>
                  <option value="tablet">Tablet</option>
                  <option value="desktop">Desktop</option>
                </select>
                <Button size="sm" onClick={() => setIsPreviewExpanded(true)} aria-label="Expand preview">
                  Expand
                </Button>
              </div>
            </div>
            {PreviewBody}
          </motion.section>
        </div>
      </main>
      
            {/* ================= Instructional Video ================= */}
      <section className="mx-auto mt-20 max-w-5xl px-4">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-2xl border border-border bg-card text-card-foreground shadow-card"
        >
          <button
            type="button"
            onClick={() => setVideoOpen((v) => !v)}
            aria-expanded={videoOpen}
            className="flex w-full items-center justify-between rounded-t-2xl border-b border-border bg-muted/60 px-5 py-4 text-left"
          >
            <div>
              <h2 className="text-lg font-semibold">
                How to Build & Publish Your Portfolio
              </h2>
              <p className="text-sm text-muted-foreground">
                Step-by-step walkthrough using this builder
              </p>
            </div>

            <motion.span
              animate={{ rotate: videoOpen ? 180 : 0 }}
              transition={{ duration: 0.25 }}
              className="text-xl"
              aria-hidden
            >
              ▾
            </motion.span>
          </button>

          <AnimatePresence initial={false}>
            {videoOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-black">
                    <iframe
                      src="https://www.youtube.com/embed/TQlkMWhAUOY?si=ouc6kSI76MkVfVp8"
                      title="Portfolio Builder Tutorial"
                      className="absolute inset-0 h-full w-full"
                      frameBorder={0}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>

                  <p className="mt-4 text-sm text-muted-foreground">
                    Learn how to fill the form, preview your site, and publish it
                    live with GitHub Pages in minutes.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>
      {/* ================= End Instructional Video ================= */}



      <footer className="mt-20">
        <SectionIntro className="py-16" from="up" hue={192}>
          <div className="container-app">
            <h2 className="sr-only">Live platform stats</h2>
            <Counters />
          </div>
        </SectionIntro>
      </footer>

      {/* Expanded modal */}
      {isPreviewExpanded && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-black/50 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded portfolio preview"
        >
          <div className="w-[min(92vw,1400px)] h-[min(92vh,100dvh)] max-h-[100dvh] overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-card">
            <div className="flex items-center justify-between border-b border-border bg-muted/70 px-4 py-2">
              <div className="flex gap-1.5" aria-hidden>
                <span className="h-3 w-3 rounded-full bg-[hsl(var(--destructive))]" />
                <span className="h-3 w-3 rounded-full bg-[hsl(var(--warning))]" />
                <span className="h-3 w-3 rounded-full bg-[hsl(var(--success))]" />
              </div>
              <div className="hidden md:flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setViewSize('mobile')}>Mobile</Button>
                <Button variant="outline" size="sm" onClick={() => setViewSize('tablet')}>Tablet</Button>
                <Button variant="outline" size="sm" onClick={() => setViewSize('desktop')}>Desktop</Button>
                <Button size="sm" onClick={() => setIsPreviewExpanded(false)}>Close</Button>
              </div>
              {/* Mobile close */}
              <div className="md:hidden">
                <Button size="sm" onClick={() => setIsPreviewExpanded(false)}>Close</Button>
              </div>
            </div>
            <div className="max-h-[calc(100dvh-56px)] overflow-y-auto">{PreviewBody}</div>
          </div>
        </div>
      )}

      {/* Publish overlay (driven by state above) */}
      <PublishProgress
        open={progressOpen}
        logoSrc={brandLogo}
        steps={steps}
        activePercent={activePercent}
        startedAt={startedAt}
        resultUrl={resultUrl ?? undefined}
        error={publishError}
        onClose={() => {
          setProgressOpen(false);
        }}
        onCopyLink={(url) => {
          void navigator.clipboard.writeText(url);
        }}
      />
    </div>
  );
}
