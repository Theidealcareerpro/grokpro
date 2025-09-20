'use client';

import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import { Button } from '@/components/ui/button';

type Site = {
  id: string;
  fingerprint: string;
  repo: string;
  homepage_url: string;
  created_at: string;
  expiry: string;
  status: 'active' | 'expired' | 'deleted';
};

type Res =
  | { ok: true; admin: boolean; sites: Site[] }
  | { ok: false; error: string };

function daysLeft(expiryIso: string): number {
  const now = new Date();
  const exp = new Date(expiryIso);
  return Math.max(0, Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
}

export default function DeploymentsPage() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      const resp = await fetch('/api/deployments', { headers: { 'x-fingerprint': visitorId } });
      const json = (await resp.json()) as Res;
      if (json.ok) setSites(json.sites);
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center text-muted-foreground">Loading deployments…</div>;
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-8">
      <h1 className="mb-4 text-2xl font-bold">My Deployments</h1>
      {sites.length === 0 ? (
        <p className="text-muted-foreground">No deployments yet.</p>
      ) : (
        <ul className="grid gap-4">
          {sites.map((s) => {
            const dl = daysLeft(s.expiry);
            const live = s.status === 'active' && dl > 0;
            return (
              <li key={s.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm text-muted-foreground">{new Date(s.created_at).toLocaleString()}</div>
                    <div className="text-base font-semibold">{s.repo}</div>
                    <div className="text-xs text-muted-foreground">Expiry: {new Date(s.expiry).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-2 py-1 text-xs ${
                        live
                          ? 'border border-emerald-800 bg-emerald-900/30 text-emerald-200'
                          : s.status === 'deleted'
                          ? 'border border-zinc-700 bg-zinc-800 text-zinc-300'
                          : 'border border-yellow-800 bg-yellow-900/30 text-yellow-200'
                      }`}
                    >
                      {live ? `Live (${dl}d left)` : s.status === 'deleted' ? 'Deleted' : 'Expired'}
                    </span>
                    {live && (
                      <>
                        <Button asChild size="sm" className="h-8">
                          <a href={s.homepage_url} target="_blank" rel="noreferrer">
                            Open
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8"
                          onClick={() => void navigator.clipboard.writeText(s.homepage_url)}
                        >
                          Copy link
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div className="mt-6 text-sm text-muted-foreground">
        Need more time? A $5 donation extends all your deployments by 30 days.
      </div>
    </main>
  );
}
