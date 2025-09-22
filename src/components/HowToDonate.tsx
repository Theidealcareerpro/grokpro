'use client';

import * as React from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Button } from '@/components/ui/button';

type Props = {
  /** Your public BMAC profile URL, e.g. "https://buymeacoffee.com/theidealcag" */
  bmcUrl: string;
  /** Minimum donations (display + validation hint only) */
  minUsd?: number; // default 5
  minGbp?: number; // default 5
  className?: string;
};

export default function HowToDonate({
  bmcUrl,
  minUsd = 5,
  minGbp = 5,
  className,
}: Props) {
  const [fp, setFp] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);
  const tag = fp ? `fp:${fp}` : '';

  async function getIdAndCopy() {
    setErrorMsg(null);
    try {
      if (!fp) {
        const agent = await FingerprintJS.load();
        const { visitorId } = await agent.get();
        setFp(visitorId);
      }
      const toCopy = `fp:${fp ?? (await FingerprintJS.load().then(a => a.get().then(r => r.visitorId)))}`;
      await navigator.clipboard.writeText(toCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setErrorMsg('Couldn’t copy automatically — we’ll show your ID to copy manually.');
    }
  }

  function openBmac() {
    window.open(bmcUrl, '_blank', 'noopener');
  }

  return (
    <section className={className}>
      <h2 className="text-xl font-semibold">How to donate (and extend your time)</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Donations in <strong>USD</strong> or <strong>GBP</strong> work. Any amount <strong>≥ ${minUsd} / £{minGbp}</strong> extends your portfolio automatically.
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
              <span className="text-xs text-muted-foreground">We’ll show it here after fetching.</span>
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
            We accept <strong>USD</strong> or <strong>GBP</strong>. Any amount <strong>≥ ${minUsd} / £{minGbp}</strong> extends your time by <strong>30 days</strong>.
            Larger amounts scale linearly (e.g., $10 ⇒ 60 days). We cap total extensions to keep things fair.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            After payment, our system updates your expiry automatically via a secure webhook.
          </p>
        </li>
      </ol>

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
  );
}
