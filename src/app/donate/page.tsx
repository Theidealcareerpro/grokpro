'use client';

import * as React from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Button } from '@/components/ui/button';

const BMC_URL = 'https://www.buymeacoffee.com/theidealcag'; // 👈 your BMAC page
const MIN_USD = 5;
const MIN_GBP = 5;

export default function DonatePage() {
  // Optional community goal UI — tweak or remove
  const goal = 100;   // coffees
  const raised = 25;  // coffees
  const pct = Math.max(0, Math.min(100, Math.round((raised / goal) * 100)));

  const [fp, setFp] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const tag = fp ? `fp:${fp}` : '';

  async function getIdAndCopy() {
    setErrorMsg(null);
    try {
      let id = fp;
      if (!id) {
        const agent = await FingerprintJS.load();
        const { visitorId } = await agent.get();
        id = visitorId;
        setFp(visitorId);
      }
      const toCopy = `fp:${id}`;
      await navigator.clipboard.writeText(toCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setErrorMsg("Couldn't copy automatically — we’ll show your ID so you can copy it manually.");
    }
  }

  function openBmac() {
    window.open(BMC_URL, '_blank', 'noopener');
  }

  return (
    <main className="container-app max-w-3xl py-12">
      <section className="card p-8">
        <header className="mb-4">
          <p className="section-title">Support The Ideal Professional</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-foreground">
            Support Us
          </h1>
          <p className="mt-2 text-muted-foreground">
            Your coffee keeps this platform free for students and early-career professionals. Thank you!
          </p>
        </header>

        {/* --- How to donate (folded inline) --- */}
        <section>
          <h2 className="text-xl font-semibold">How to donate (and extend your time)</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We accept <strong>USD</strong> or <strong>GBP</strong>. Any amount <strong>≥ ${MIN_USD} / £{MIN_GBP}</strong> automatically extends your portfolio by <strong>30 days</strong> via our webhook.
          </p>

          <ol className="mt-4 space-y-3">
            {/* Step 1 */}
            <li className="rounded-lg border border-border bg-card p-4">
              <div className="text-sm font-medium">1) Get your extension ID</div>
              <p className="mt-1 text-sm text-muted-foreground">
                We use an anonymous ID to match your donation to your account.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Button onClick={getIdAndCopy} className="h-9">
                  {copied ? 'Copied!' : 'Get my ID (copies)'}
                </Button>
                {tag ? (
                  <code className="rounded bg-muted px-2 py-1 text-xs">{tag}</code>
                ) : (
                  <span className="text-xs text-muted-foreground">Your ID will appear here after fetching.</span>
                )}
              </div>
              {errorMsg ? <p className="mt-2 text-xs text-red-400">{errorMsg}</p> : null}
              {!copied && tag ? (
                <button
                  className="mt-2 text-xs underline underline-offset-4 opacity-80 hover:opacity-100"
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(tag);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2500);
                    } catch {
                      setErrorMsg('Copy failed — please select and copy the code above.');
                    }
                  }}
                >
                  Copy again
                </button>
              ) : null}
            </li>

            {/* Step 2 */}
            <li className="rounded-lg border border-border bg-card p-4">
              <div className="text-sm font-medium">2) Open our Buy Me a Coffee page</div>
              <p className="mt-1 text-sm text-muted-foreground">
                We’ll open it in a new tab so you can paste your ID.
              </p>
              <div className="mt-2">
                <Button onClick={openBmac} variant="secondary" className="h-9">
                  Open Buy Me a Coffee
                </Button>
              </div>
            </li>

            {/* Step 3 */}
            <li className="rounded-lg border border-border bg-card p-4">
              <div className="text-sm font-medium">3) Paste your ID in “Say something nice…”</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Paste the code that looks like <code>fp:abc123…</code> into the message box on the BMAC checkout.
              </p>
            </li>

            {/* Step 4 */}
            <li className="rounded-lg border border-border bg-card p-4">
              <div className="text-sm font-medium">4) Complete your donation</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Any amount <strong>≥ ${MIN_USD} / £{MIN_GBP}</strong> adds <strong>30 days</strong>. Larger amounts scale linearly (e.g., $10 ⇒ 60 days). We cap total extensions to keep things fair.
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                After payment, our system updates your expiry automatically via a secure webhook. Refresh your deployments page to see the new date.
              </p>
            </li>
          </ol>

          {/* Optional quick links */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {['$5', '$10', '$25'].map((amt) => (
              <a
                key={amt}
                href={BMC_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
                aria-label={`Donate ${amt} on Buy Me a Coffee`}
              >
                Give {amt}
              </a>
            ))}
          </div>

          {/* Help & privacy */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-sm font-semibold">Troubleshooting</div>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>• Copy failed? Select the <code>fp:…</code> code and copy manually.</li>
                <li>• Don’t see an ID? Click “Get my ID (copies)” again.</li>
                <li>• Donation done but time not extended? Give it a moment, then refresh your deployments page.</li>
              </ul>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <div className="text-sm font-semibold">Privacy & security</div>
              <p className="mt-2 text-sm text-muted-foreground">
                Your ID is anonymous and used only to match donations. Payments happen on Buy Me a Coffee; we don’t see or store your card details.
              </p>
            </div>
          </div>
        </section>

        {/* Community goal (optional) */}
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
