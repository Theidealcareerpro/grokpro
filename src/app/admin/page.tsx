'use client';

import { useEffect, useState } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

type Site = {
  id: string;
  fingerprint: string;
  repo: string;
  homepage_url: string;
  created_at: string;
  expiry: string;
  status: 'active' | 'expired' | 'deleted';
};
type DeploymentsRes =
  | { ok: true; admin: boolean; sites: Site[] }
  | { ok: false; error: string };
type UsageRes =
  | {
      ok: true;
      admin: boolean;
      fingerprint: string;
      counts: { publishesToday: number; publishedThisMonth: number; liveSites: number };
      limits: { daily: number; monthly: number; live: number };
      nextResetAt: string;
      expirySoon: boolean;
    }
  | { ok: false; error: string };

export default function AdminPage() {
  const [admin, setAdmin] = useState(false);
  const [sites, setSites] = useState<Site[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();

      // Quick admin check using /api/usage (it returns admin flag)
      const usageResp = await fetch('/api/usage', { headers: { 'x-fingerprint': visitorId } });
      const usageJson = (await usageResp.json()) as UsageRes;
      if (!usageJson.ok || !usageJson.admin) {
        setError('Not authorized.');
        return;
      }
      setAdmin(true);

      // Fetch ALL deployments (admin + all=1)
      const depResp = await fetch('/api/deployments?all=1', { headers: { 'x-fingerprint': visitorId } });
      const depJson = (await depResp.json()) as DeploymentsRes;
      if (depJson.ok) setSites(depJson.sites);
      else setError(depJson.error);
    })();
  }, []);

  if (!admin) return <div className="p-6 text-sm text-muted-foreground">{error || 'Checking admin…'}</div>;

  return (
    <main className="mx-auto max-w-6xl px-6 py-8">
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">Total deployments</div>
          <div className="text-2xl font-semibold">{sites.length}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">Active</div>
          <div className="text-2xl font-semibold">{sites.filter((s) => s.status === 'active').length}</div>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="text-sm text-muted-foreground">Expiring ≤ 7d</div>
          <div className="text-2xl font-semibold">
            {
              sites.filter((s) => {
                const d = new Date(s.expiry).getTime() - Date.now();
                return s.status === 'active' && d <= 7 * 24 * 60 * 60 * 1000 && d > 0;
              }).length
            }
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="p-2 text-left">Created</th>
              <th className="p-2 text-left">Fingerprint</th>
              <th className="p-2 text-left">Repo</th>
              <th className="p-2 text-left">URL</th>
              <th className="p-2 text-left">Expiry</th>
              <th className="p-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {sites.map((s) => (
              <tr key={s.id} className="border-t border-border">
                <td className="p-2">{new Date(s.created_at).toLocaleString()}</td>
                <td className="p-2">{s.fingerprint}</td>
                <td className="p-2">{s.repo}</td>
                <td className="p-2">
                  <a className="underline" href={s.homepage_url} target="_blank" rel="noreferrer">
                    Open
                  </a>
                </td>
                <td className="p-2">{new Date(s.expiry).toLocaleDateString()}</td>
                <td className="p-2 capitalize">{s.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
