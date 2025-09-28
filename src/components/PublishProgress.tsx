// same component you have, with strong types and optional etaSec
'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2, X, Copy, Link as LinkIcon } from 'lucide-react';
import Image, { StaticImageData } from 'next/image';
import { Button } from '@/components/ui/button';

export type Step = {
  key: string;
  label: string;
  status: 'idle' | 'active' | 'done' | 'error';
};

function SafeLogo({
  src,
  fallback = '/favicon.ico',
  size = 28, // was 34 → tighter
}: {
  src: string | StaticImageData;
  fallback?: string;
  size?: number;
}) {
  const [imgSrc, setImgSrc] = React.useState<string | StaticImageData>(src);
  const useIco = typeof imgSrc === 'string' && imgSrc.endsWith('.ico');

  return (
    <Image
      src={imgSrc}
      alt="Brand"
      width={size}
      height={size}
      priority
      sizes={`${size}px`}
      unoptimized={useIco}
      onError={() => setImgSrc(fallback)}
      className="object-contain"
    />
  );
}

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
  logoSrc?: string | StaticImageData;
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
  const doneCount = steps.filter((s) => s.status === 'done').length;
  const activeStepIndex = steps.findIndex((s) => s.status === 'active');

  const overall =
    (doneCount / total) * 100 +
    (activeStepIndex >= 0 ? (activePercent / 100) * (1 / total) * 100 : 0);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-[min(92vw,680px)] rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-50 shadow-2xl"
            initial={{ y: 14, scale: 0.985, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 8, scale: 0.985, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label="Publishing portfolio"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-3 border-b border-zinc-800 px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <div className="grid h-8 w-8 place-items-center overflow-hidden rounded-xl bg-zinc-800 ring-1 ring-black/30">
                  <SafeLogo src={logoSrc} fallback="/favicon.ico" size={26} />
                </div>
                <div className="leading-tight">
                  <div className="text-[12px] text-zinc-400">Publishing</div>
                  <div className="text-[14px] font-semibold text-zinc-50">
                    Generating your Portfolio…
                  </div>
                </div>
              </div>
              <div className="text-[12px] tabular-nums text-zinc-400">{formatElapsed(elapsed)}</div>
            </div>

            {/* Progress */}
            <div className="px-4 pt-3">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-800">
                <motion.div
                  className="h-full bg-[hsl(var(--primary,200_98%_50%))]"
                  style={{ width: `${Math.min(100, overall)}%` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, overall)}%` }}
                  transition={{ type: 'tween', duration: 0.25 }}
                />
              </div>
              <div className="mt-1.5 flex justify-between text-[11px] text-zinc-500">
                <span>{Math.floor(overall)}%</span>
                <span>Portfolio Pages</span>
              </div>
            </div>

            {/* Steps */}
            <ul className="mt-3 grid gap-1.5 px-4 pb-3">
              {steps.map((s) => (
                <li
                  key={s.key}
                  className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5"
                >
                  <div className="flex items-center gap-2">
                    <div className="grid h-5 w-5 place-items-center rounded-md bg-zinc-800">
                      {s.status === 'done' ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : s.status === 'error' ? (
                        <X className="h-3.5 w-3.5 text-red-400" />
                      ) : s.status === 'active' ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-200" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-600" />
                      )}
                    </div>
                    <div className="text-[13px] text-zinc-200">{s.label}</div>
                  </div>

                  {s.status === 'active' ? (
                    <div className="ml-3 hidden h-1 w-24 overflow-hidden rounded-full bg-zinc-800 sm:block">
                      <motion.div
                        className="h-full bg-zinc-300"
                        style={{ width: `${Math.max(10, activePercent)}%` }}
                        initial={{ width: 10 }}
                        animate={{ width: `${Math.max(10, activePercent)}%` }}
                        transition={{ type: 'tween', duration: 0.25 }}
                      />
                    </div>
                  ) : s.status === 'done' ? (
                    <div className="ml-3 hidden text-[11px] text-zinc-500 sm:block">Completed</div>
                  ) : null}
                </li>
              ))}
            </ul>

            {/* ETA (optional) */}
            {!resultUrl && !error && typeof etaSec === 'number' && (
              <div className="mx-4 mb-2 flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/60 px-2.5 py-1.5">
                <div className="text-[13px] text-zinc-400">Waiting for Portfolio Pages to activate…</div>
                <div className="grid h-8 w-14 place-items-center rounded-md bg-zinc-800 text-base font-extrabold tabular-nums">
                  {etaSec}s
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-zinc-800 px-4 py-2.5">
              {error ? (
                <div className="text-[13px] text-red-400">{error}</div>
              ) : resultUrl ? (
                <div className="flex items-center gap-2 text-[13px] text-zinc-300">
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
                <div className="text-[12px] text-zinc-500">This can take a short while.</div>
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
                      <Copy className="mr-1.5 h-4 w-4" />
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
