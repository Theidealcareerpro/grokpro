'use client';

import * as React from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Button } from '@/components/ui/button';
import { Copy, Check, ExternalLink, RefreshCcw, Info } from 'lucide-react';

const BMC_URL = 'https://www.buymeacoffee.com/theidealcag'; // your public BMAC page
const MIN_USD = 5;
const MIN_GBP = 5;

export default function DonatePage() {
  // Community goal (optional UI)
  const goal = 100;  // coffees
  const raised = 25; // coffees
  const pct = Math.max(0, Math.min(100, Math.round((raised / goal) * 100)));

  const [fp, setFp] = React.useState<string | null>(null);
  const [copyOk, setCopyOk] = React.useState(false);
  const [copyErr, setCopyErr] = React.useState<string | null>(null);
  const [loadingId, setLoadingId] = React.useState(true);

  const tag = fp ? `fp:${fp}` : '';

  // Get fingerprint on mount (quietly)
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const agent = await FingerprintJS.load();
        const { visitorId } = await agent.get();
        if (mounted) setFp(visitorId);
      } catch {
        // fall back to manual fetch when user clicks
      } finally {
        if (mounted) setLoadingId(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  async function ensureId() {
    if (fp) return fp;
    const agent = await FingerprintJS.load();
    const { visitorId } = await agent.get();
    setFp(visitorId);
    return visitorId;
  }

  async function copyTag() {
    setCopyErr(null);
    try {
      const id = await ensureId();
      const text = `fp:${id}`;
      await navigator.clipboard.writeText(text);
      setCopyOk(true);
      setTimeout(() => setCopyOk(false), 2200);
    } catch {
      setCopyErr('Copy failed. Please select the code and copy manually.');
    }
  }

  function openBmac() {
    window.open(BMC_URL, '_blank', 'noopener');
  }

  function ManualCode() {
    return (
      <div className="group relative flex flex-wrap items-center gap-2">
        <code
          className="rounded-md border border-border bg-muted px-2 py-1 text-xs"
          title="Your anonymous extension ID"
        >
          {tag || 'fp:…'}
        </code>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="h-8"
          onClick={copyTag}
          disabled={loadingId}
        >
          {copyOk ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
          {copyOk ? 'Copied' : 'Copy'}
        </Button>
      </div>
    );
  }

  return (
    // MOBILE SIZING FIXES: make container full-width on mobile; restore clamp on lg+
    <main className="container-app w-full max-w-none px-4 sm:px-6 lg:max-w-3xl py-12">
      <section className="rounded-2xl border border-border bg-card p-4 sm:p-8">
        {/* Heading */}
        <header className="mb-6">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Support The Ideal Professional
          </p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
            Support Us & Extend Your Portfolio
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We keep the builder free for students and early-career pros. A small tip helps cover hosting
            and lets us keep shipping features.
          </p>

          {/* Currency rule pill */}
          <div className="mt-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
            <Info className="h-3.5 w-3.5" />
            We accept <strong className="mx-1 text-foreground">USD</strong> or{' '}
            <strong className="mx-1 text-foreground">GBP</strong>. Any amount{' '}
            <strong className="mx-1 text-foreground">≥ ${MIN_USD} / £{MIN_GBP}</strong> adds{' '}
            <strong className="mx-1 text-foreground">+30 days</strong> automatically.
          </div>
        </header>

        {/* 4-step visual guide */}
        <section>
          <ol className="relative ml-3 space-y-4 before:absolute before:left-[-1px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-border">
            {/* Step 1 */}
            <li className="relative rounded-xl border border-border bg-card/60 p-4">
              <span className="absolute -left-[21px] top-4 grid h-5 w-5 place-items-center rounded-full border border-border bg-background text-[10px]">
                1
              </span>
              <div className="text-sm font-medium">Get your extension ID</div>
              <p className="mt-1 text-sm text-muted-foreground">
                We use an anonymous ID to match your donation to your account. It never contains personal data.
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {loadingId ? (
                  <Button disabled size="sm" className="h-8">
                    Fetching ID…
                  </Button>
                ) : (
                  <>
                    <ManualCode />
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="h-8"
                      onClick={async () => {
                        setLoadingId(true);
                        try {
                          const agent = await FingerprintJS.load();
                          const { visitorId } = await agent.get();
                          setFp(visitorId);
                        } finally {
                          setLoadingId(false);
                        }
                      }}
                    >
                      <RefreshCcw className="mr-1.5 h-4 w-4" />
                      Refresh ID
                    </Button>
                  </>
                )}
              </div>
              {copyErr ? <p className="mt-2 text-xs text-red-400">{copyErr}</p> : null}
              {!copyOk && tag ? (
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Tip: Paste <code className="rounded bg-muted px-1">fp:…</code> into the BMAC message box.
                </p>
              ) : null}
            </li>

            {/* Step 2 */}
            <li className="relative rounded-xl border border-border bg-card/60 p-4">
              <span className="absolute -left-[21px] top-4 grid h-5 w-5 place-items-center rounded-full border border-border bg-background text-[10px]">
                2
              </span>
              <div className="text-sm font-medium">Open our Buy Me a Coffee page</div>
              <p className="mt-1 text-sm text-muted-foreground">
                We’ll open it in a new tab so you can paste your ID in the message field.
              </p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Button type="button" onClick={openBmac} className="h-9">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Buy Me a Coffee
                </Button>
                <a
                  href={BMC_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs underline underline-offset-4"
                  aria-label="Open the Buy Me a Coffee page"
                >
                  Or copy link
                </a>
              </div>
            </li>

            {/* Step 3 */}
            <li className="relative rounded-xl border border-border bg-card/60 p-4">
              <span className="absolute -left-[21px] top-4 grid h-5 w-5 place-items-center rounded-full border border-border bg-background text-[10px]">
                3
              </span>
              <div className="text-sm font-medium">Paste your ID in “Say something nice…”</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Paste the code that looks like <code className="rounded bg-muted px-1">fp:abc123…</code>.
                This lets our webhook extend the correct portfolio automatically.
              </p>

              {/* Faux message field illustration */}
              <div className="mt-3 rounded-lg border border-dashed border-border bg-muted/40 p-3 text-xs text-muted-foreground">
                <div className="mb-1 text-[11px] uppercase tracking-wide">Example</div>
                <div className="rounded-md border border-border bg-background px-3 py-2">
                  Say something nice… <span className="text-foreground">fp:abc123def456…</span>
                </div>
              </div>
            </li>

            {/* Step 4 */}
            <li className="relative rounded-xl border border-border bg-card/60 p-4">
              <span className="absolute -left-[21px] top-4 grid h-5 w-5 place-items-center rounded-full border border-border bg-background text-[10px]">
                4
              </span>
              <div className="text-sm font-medium">Complete your donation</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Any amount <strong>≥ ${MIN_USD} / £{MIN_GBP}</strong> adds <strong>+30 days</strong>.
                Larger amounts scale linearly (e.g., $10 → +60 days). We cap total extension to keep it fair.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                After payment, our webhook updates your expiry automatically. Give it a minute, then refresh
                your <span className="underline underline-offset-2">Deployments</span> page to see the new date.
              </p>
            </li>
          </ol>

          {/* Quick amount shortcuts (optional) */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            {['$5', '$10', '$25'].map((amt) => (
              <a
                key={amt}
                href={BMC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-9 items-center rounded-md border border-border bg-card px-3 text-sm hover:bg-muted/50"
                aria-label={`Donate ${amt} on Buy Me a Coffee`}
              >
                Give {amt}
              </a>
            ))}
          </div>

          {/* Trust / Help */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-sm font-semibold">Troubleshooting</div>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• Copy failed? Select the <code className="rounded bg-muted px-1">fp:…</code> code and copy manually.</li>
                <li>• No ID showing? Tap <em>Refresh ID</em> (Step 1) and try again.</li>
                <li>• Donated but time not extended? Wait a minute and refresh your Deployments page.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-sm font-semibold">Privacy & Security</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Your ID is anonymous and used only to match donations. Payments happen on Buy Me a Coffee;
                we don’t see or store your card details.
              </p>
            </div>
          </div>
        </section>

        {/* Community goal (optional visual) */}
        <div className="mt-10">
          <h2 className="text-base font-semibold text-foreground">Community Goal</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Goal: {goal} coffees • Raised: {raised} coffees
          </p>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[hsl(var(--border))]">
            <div
              className="h-full rounded-full bg-[hsl(var(--primary))] transition-[width] duration-700 ease-out"
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              aria-label="Donation progress"
            />
          </div>
        </div>

        <p className="mt-8 text-xs text-muted-foreground">
          We don’t store your payment details. External links open in a new tab.
        </p>
      </section>
    </main>
  );
}
