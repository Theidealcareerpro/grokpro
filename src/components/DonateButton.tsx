'use client';

import * as React from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Button } from '@/components/ui/button';

type Props = {
  /** Your public BMAC profile URL, e.g. "https://buymeacoffee.com/theidealcag" */
  bmcUrl: string;
  label?: string;
  className?: string;
};

export default function DonateButton({ bmcUrl, label = 'Support on Buy Me a Coffee', className }: Props) {
  const [fp, setFp] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  // Eagerly fetch the fingerprint to make the click snappier
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const fpAgent = await FingerprintJS.load();
        const { visitorId } = await fpAgent.get();
        if (mounted) setFp(visitorId);
      } catch {
        // we’ll fetch lazily on click if this fails
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const handleClick = async () => {
    setErrorMsg(null);
    setLoading(true);
    try {
      let id = fp;
      if (!id) {
        const fpAgent = await FingerprintJS.load();
        const { visitorId } = await fpAgent.get();
        id = visitorId;
        setFp(visitorId);
      }

      const tag = `fp:${id}`;
      try {
        await navigator.clipboard.writeText(tag);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch {
        // Clipboard might be blocked; we’ll just show the fp and ask the user to paste manually.
        setErrorMsg('Couldn’t copy automatically—please copy the ID shown and paste it into the message.');
      }

      // Open your BMAC page in a new tab (user will paste the fp:<id> in “Say something nice…”)
      window.open(bmcUrl, '_blank', 'noopener');

    } catch (err) {
      setErrorMsg('Something went wrong—please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <Button onClick={handleClick} disabled={loading} className="gap-2">
        {loading ? 'Preparing…' : label}
      </Button>

      {/* Helper line: show the fp and guidance */}
      <div className="mt-2 text-xs text-muted-foreground">
        {fp ? (
          <>
            {copied ? (
              <span className="text-emerald-400">Copied <code>fp:{fp}</code>. Paste it in “Say something nice…”.</span>
            ) : (
              <>
                We’ll copy <code>fp:{fp}</code> for you—paste it in “Say something nice…”.
                <button
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(`fp:${fp}`);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 3000);
                    } catch {
                      setErrorMsg('Copy failed—please select and copy manually.');
                    }
                  }}
                  className="ml-2 underline hover:opacity-80"
                >
                  Copy again
                </button>
              </>
            )}
          </>
        ) : (
          'Click the button and we’ll copy your ID for the message box.'
        )}
      </div>

      {/* Multi-currency hint */}
      <div className="mt-1 text-[11px] text-muted-foreground">
        Min donation: <strong>$5</strong> or <strong>£5</strong>. Your time gets extended automatically.
      </div>

      {errorMsg ? <div className="mt-2 text-xs text-red-400">{errorMsg}</div> : null}
    </div>
  );
}
