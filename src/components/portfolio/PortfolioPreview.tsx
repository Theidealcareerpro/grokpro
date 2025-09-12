// src/components/preview/PortfolioPreview.tsx
'use client';

import { useMemo, useState } from 'react';
import type { PortfolioData } from '@/lib/portfolio-types';
import { PUBLISH_REGISTRY } from '@/lib/publish/registry';

type View = 'mobile' | 'tablet' | 'desktop';

const VIEW_WIDTH: Record<View, number> = {
  mobile: 390,   // iPhone 12-ish
  tablet: 768,   // iPad portrait
  desktop: 1024, // small desktop
};

export default function PortfolioPreview({ data }: { data: PortfolioData }) {
  const [view, setView] = useState<View>('desktop');

  // Pick the interactive (client) template
  const Template = useMemo(() => {
    const id = data?.templateId ?? 'modern';
    return PUBLISH_REGISTRY[id] ?? PUBLISH_REGISTRY.modern;
  }, [data?.templateId]);

  return (
    <div className="w-full">
      {/* Toolbar */}
      <div className="mb-3 flex items-center gap-2">
        <DeviceBtn label="Mobile"   active={view === 'mobile'}   onClick={() => setView('mobile')} />
        <DeviceBtn label="Tablet"   active={view === 'tablet'}   onClick={() => setView('tablet')} />
        <DeviceBtn label="Desktop"  active={view === 'desktop'}  onClick={() => setView('desktop')} />
      </div>

      {/* Sized preview frame (no iframe, Tailwind works out of the box) */}
      <div
        className="mx-auto overflow-hidden rounded-lg border border-slate-200 shadow-sm dark:border-slate-800"
        style={{ width: VIEW_WIDTH[view] }}
      >
        <Template data={data} />
      </div>
    </div>
  );
}

function DeviceBtn({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={
        'rounded-md px-3 py-1 text-sm transition ' +
        (active
          ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700')
      }
    >
      {label}
    </button>
  );
}
