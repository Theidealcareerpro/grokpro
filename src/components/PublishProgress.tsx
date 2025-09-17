// same component you have, with strong types and optional etaSec
// (pasting full file for clarity)
'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, X, Copy, Link as LinkIcon } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export type Step = {
  key: string;
  label: string;
  status: 'idle' | 'active' | 'done' | 'error';
};

function formatElapsed(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

export default function PublishProgress({
  open,
  logoSrc = '/favicon.ico',
  steps,
  activePercent,
  startedAt,
  resultUrl,
  error,
  etaSec,
  onClose,
  onCopyLink,
}: {
  open: boolean;
  logoSrc?: string;
  steps: Step[];
  activePercent: number;
  startedAt: number | null;
  resultUrl?: string | null;
  error?: string | null;
  etaSec?: number;
  onClose: () => void;
  onCopyLink: (url: string) => void;
}) {
  const [elapsed, setElapsed] = React.useState(0);

  React.useEffect(() => {
    if (!open || !startedAt) return;
    let raf = 0;
    const tick = () => {
      setElapsed(Date.now() - startedAt);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [open, startedAt]);

  const total = steps.length;
  const doneCount = steps.filter(s => s.status === 'done').length;
  const activeStepIndex = steps.findIndex(s => s.status === 'active');

  const overall =
    (doneCount / total) * 100 +
    (activeStepIndex >= 0 ? (activePercent / 100) * (1 / total) * 100 : 0);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/70 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-[min(92vw,720px)] rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-50 shadow-2xl"
            initial={{ y: 16, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Publishing portfolio"
          >
            <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-5 py-3">
              <div className="flex items-center gap-3">
                <div className="grid h-9 w-9 place-items-center overflow-hidden rounded-xl bg-zinc-800 ring-1 ring-black/30">
                  <Image src={logoSrc} alt="Brand" width={24} height={24} />
                </div>
                <div>
                  <div className="text-sm leading-tight text-zinc-400">Publishing</div>
                  <div className="text-base font-semibold leading-tight text-zinc-50">
                    Generating your GitHub Pages site…
                  </div>
                </div>
              </div>
              <div className="text-sm tabular-nums text-zinc-400">{formatElapsed(elapsed)}</div>
            </div>

            <div className="px-5 pt-4">
              <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                <motion.div
                  className="h-full bg-[hsl(var(--primary,200_98%_50%))]"
                  style={{ width: `${Math.min(100, overall)}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, overall)}%` }}
                  transition={{ type: 'tween', duration: 0.25 }}
                />
              </div>
              <div className="mt-2 flex justify-between text-xs text-zinc-500">
                <span>{Math.floor(overall)}%</span>
                <span>GitHub Pages</span>
              </div>
            </div>

            <ul className="mt-4 grid gap-2 px-5 pb-4">
              {steps.map((s) => (
                <li key={s.key} className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="grid h-6 w-6 place-items-center rounded-md bg-zinc-800">
                      {s.status === 'done' ? (
                        <Check className="h-4 w-4 text-emerald-400" />
                      ) : s.status === 'error' ? (
                        <X className="h-4 w-4 text-red-400" />
                      ) : s.status === 'active' ? (
                        <Loader2 className="h-4 w-4 animate-spin text-zinc-200" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                      )}
                    </div>
                    <div className="text-sm text-zinc-200">{s.label}</div>
                  </div>

                  {s.status === 'active' ? (
                    <div className="ml-4 hidden h-1 w-28 overflow-hidden rounded-full bg-zinc-800 sm:block">
                      <motion.div
                        className="h-full bg-zinc-300"
                        style={{ width: `${Math.max(10, activePercent)}%` }}
                        initial={{ width: 10 }}
                        animate={{ width: `${Math.max(10, activePercent)}%` }}
                        transition={{ type: 'tween', duration: 0.25 }}
                      />
                    </div>
                  ) : s.status === 'done' ? (
                    <div className="ml-4 hidden text-xs text-zinc-500 sm:block">Completed</div>
                  ) : null}
                </li>
              ))}
            </ul>

            {!resultUrl && !error && typeof etaSec === 'number' && (
              <div className="mx-5 mb-2 flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-2">
                <div className="text-sm text-zinc-400">Waiting for GitHub Pages to activate…</div>
                <div className="grid h-10 w-16 place-items-center rounded-md bg-zinc-800 text-xl font-extrabold tabular-nums">
                  {etaSec}s
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 border-t border-zinc-800 px-5 py-3">
              {error ? (
                <div className="text-sm text-red-400">{error}</div>
              ) : resultUrl ? (
                <div className="flex items-center gap-2 text-sm text-zinc-300">
                  <LinkIcon className="h-4 w-4" />
                  <a
                    href={resultUrl}
                    className="underline decoration-zinc-600 underline-offset-4 hover:text-zinc-50"
                    target="_blank"
                    rel="noreferrer"
                  >
                    {resultUrl}
                  </a>
                </div>
              ) : (
                <div className="text-sm text-zinc-500">This can take a short while.</div>
              )}

              <div className="flex gap-2">
                {resultUrl ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCopyLink(resultUrl)}
                      className="border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy link
                    </Button>
                    <Button size="sm" asChild className="bg-zinc-100 text-zinc-900 hover:bg-white">
                      <a href={resultUrl} target="_blank" rel="noreferrer">
                        Open
                      </a>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onClose} className="text-zinc-300 hover:bg-zinc-800">
                      Close
                    </Button>
                  </>
                ) : error ? (
                  <Button variant="ghost" size="sm" onClick={onClose} className="text-zinc-300 hover:bg-zinc-800">
                    Close
                  </Button>
                ) : (
                  <Button variant="ghost" size="sm" disabled className="text-zinc-400">
                    Working…
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
