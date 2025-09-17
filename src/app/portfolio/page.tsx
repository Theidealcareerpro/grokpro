'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
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

/* ----------------------------- Types ----------------------------- */

type PublishApiResponse = {
  ok?: boolean;
  url?: string;
  repo?: string;
  portfolio?: unknown;
  error?: string;
};

type PublishStep =
  | 'preparing'
  | 'uploading'
  | 'configuring'
  | 'saving'
  | 'finalizing';

type PublishState = {
  step: PublishStep;
  percent: number; // 0..100
  message: string;
};

/* ----------------------- Polished overlay UI ---------------------- */

function PublishOverlay({
  state,
  onCancel,
  logoSrc,
}: {
  state: PublishState;
  onCancel?: () => void;
  logoSrc?: string;
}) {
  // soft trail progress animation via inline style; percent is controlled by parent
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-black/60 backdrop-blur-sm">
      <div className="w-[min(92vw,520px)] rounded-2xl border border-border bg-card text-card-foreground shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border p-4">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt="Logo"
              width={28}
              height={28}
              className="rounded-md"
            />
          ) : (
            <div className="h-7 w-7 animate-pulse rounded-md bg-[hsl(var(--primary))/0.3]" />
          )}
          <div className="text-lg font-semibold">Publishing portfolio…</div>
        </div>

        <div className="space-y-4 p-5">
          <div className="text-sm text-muted-foreground">{state.message}</div>

          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="absolute inset-y-0 left-0 will-change-transform rounded-full bg-[hsl(var(--primary))]"
              style={{ width: `${Math.min(100, Math.max(0, state.percent))}%` }}
            />
            {/* glossy sweep */}
            <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-6 bg-[linear-gradient(to_right,white_0%,transparent_60%)] opacity-20 animate-[pulse_1.8s_ease-in-out_infinite]" />
          </div>

          <ul className="space-y-2 text-sm">
            <li className={state.step === 'preparing' ? 'font-medium' : 'text-muted-foreground'}>
              1. Preparing files
            </li>
            <li className={state.step === 'uploading' ? 'font-medium' : 'text-muted-foreground'}>
              2. Uploading to GitHub
            </li>
            <li className={state.step === 'configuring' ? 'font-medium' : 'text-muted-foreground'}>
              3. Configuring GitHub Pages
            </li>
            <li className={state.step === 'saving' ? 'font-medium' : 'text-muted-foreground'}>
              4. Saving deployment
            </li>
            <li className={state.step === 'finalizing' ? 'font-medium' : 'text-muted-foreground'}>
              5. Finalizing
            </li>
          </ul>

          {onCancel ? (
            <div className="pt-2 text-right">
              <Button variant="ghost" size="sm" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Page ------------------------------ */

export default function PortfolioPage() {
  // dark-only page wrapper—assumes your app root sets `.dark` on <html>
  // If not, you can add `className="dark"` to <html> in your root layout.

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

  const [publishLoading, setPublishLoading] = useState(false);
  const [publishState, setPublishState] = useState<PublishState>({
    step: 'preparing',
    percent: 8,
    message: 'Preparing your files…',
  });

  const [liveUrl, setLiveUrl] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const hasErrors = useMemo(() => Object.values(errors).some(Boolean), [errors]);

  useEffect(() => {
    (async () => {
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

        if (error) {
          console.error('Supabase read error:', error);
          setDonationError(error.message || 'Failed to check portfolio status.');
        }

        if (data) {
          const expiryDate = new Date(data.expiry as string);
          if (Number.isFinite(expiryDate.getTime()) && new Date() > expiryDate) {
            setShowDonationPrompt(true);
          }
          if ((data as { github_repo?: string })?.github_repo) {
            const [owner, repo] = String((data as { github_repo?: string }).github_repo).split('/');
            if (owner && repo) setLiveUrl(`https://${owner}.github.io/${repo}/`);
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

  const handlePublish = async () => {
    if (hasErrors) {
      alert('Please fix all form errors before publishing.');
      return;
    }
    if (!fingerprint) {
      alert('Unable to determine fingerprint. Please reload the page and try again.');
      return;
    }

    setPublishLoading(true);
    setPublishState({ step: 'preparing', percent: 12, message: 'Preparing your files…' });
    setLiveUrl(null);

    try {
      // small UX ramp
      setTimeout(() => setPublishState((s) => ({ ...s, percent: Math.max(s.percent, 22) })), 180);

      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioData, fingerprint }),
      });

      // progress bump while GitHub operations run
      setPublishState({ step: 'uploading', percent: 48, message: 'Uploading to GitHub…' });

      const data: PublishApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Publish failed');
      }

      setPublishState({ step: 'configuring', percent: 72, message: 'Configuring GitHub Pages…' });

      // Simulate a brief config time for nicer UX
      await new Promise((r) => setTimeout(r, 500));

      setPublishState({ step: 'saving', percent: 86, message: 'Saving deployment…' });

      // one more brief pause
      await new Promise((r) => setTimeout(r, 350));

      setPublishState({ step: 'finalizing', percent: 100, message: 'Finalizing…' });

      setLiveUrl(data.url ?? null);
      alert('Portfolio published successfully! Check the live URL below.');
    } catch (err) {
      console.error('Publish error:', err);
      setDonationError(err instanceof Error ? err.message : 'Failed to publish portfolio.');
      alert('Failed to publish portfolio. Check console for details.');
    } finally {
      setPublishLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-foreground">
        Loading…
      </div>
    );
  }

  const previewMaxWidth = viewSize === 'mobile' ? 375 : viewSize === 'tablet' ? 768 : 1280;

  const PreviewBody = (
    <div className="rounded-b-2xl bg-card p-6">
      <div ref={previewRef} style={{ maxWidth: previewMaxWidth, marginLeft: 'auto', marginRight: 'auto' }}>
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

      {/* Main — same sizes as CV page (45vw / 300–800px) */}
      <main className="mx-auto max-w-[90vw] px-6">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Left: Form panel */}
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
                    setLiveUrl(null);
                  }}
                >
                  Reset
                </Button>
                <Button onClick={handlePublish} disabled={publishLoading}>
                  {publishLoading ? 'Publishing…' : 'Publish'}
                </Button>
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
            </div>
          </motion.section>

          {/* Right: Preview panel */}
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

      {/* Expanded modal */}
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

      {/* Publishing overlay */}
      {publishLoading && (
        <PublishOverlay
          state={publishState}
          logoSrc="/logo.png" // replace with your path or remove
          onCancel={undefined}
        />
      )}
    </div>
  );
}
