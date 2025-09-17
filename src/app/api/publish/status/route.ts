import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
  const urlObj = new URL(req.url);
  const target = urlObj.searchParams.get('url');

  if (!target) {
    return NextResponse.json({ error: 'Missing url param' }, { status: 400 });
  }

  // Basic allowlist: only https GitHub Pages hosts (avoid SSRF).
  try {
    const parsed = new URL(target);
    if (parsed.protocol !== 'https:') {
      return NextResponse.json({ error: 'Only https scheme allowed' }, { status: 400 });
    }
    if (!parsed.hostname.endsWith('.github.io')) {
      return NextResponse.json({ error: 'Host not allowed' }, { status: 400 });
    }
  } catch {
    return NextResponse.json({ error: 'Invalid url param' }, { status: 400 });
  }

  try {
    // Cache-bust & disable caching both by Next and the upstream
    const bust = `_=${Date.now()}`;
    const sep = target.includes('?') ? '&' : '?';
    const resp = await fetch(`${target}${sep}${bust}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, max-age=0, must-revalidate',
        Pragma: 'no-cache',
      },
      // In App Router, this also helps ensure no caching:
      next: { revalidate: 0 },
    });

    const live = resp.ok;
    return NextResponse.json(
      { live, status: resp.status },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (err) {
    return NextResponse.json({ live: false, status: 0 }, { status: 200 });
  }
}
