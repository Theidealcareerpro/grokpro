// src/lib/publish/renderPortfolioHtml.ts
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { PortfolioData } from '@/lib/portfolio-types';
import { PUBLISH_REGISTRY } from './registry';

// 👇 add these 6 lines
type TemplateKey = keyof typeof PUBLISH_REGISTRY;
function toTemplateKey(val: unknown): TemplateKey {
  return (typeof val === 'string' && val in PUBLISH_REGISTRY)
    ? (val as TemplateKey)
    : 'modern';
}

const TAILWIND_HEAD = `
<script>
  window.tailwind = window.tailwind || {};
  window.tailwind.config = {
    darkMode: 'class',
    theme: {
      screens: { sm:'640px', md:'768px', lg:'1024px', xl:'1280px' },
      extend: {
        colors: {
          navy:{ 700:'#1E3A8A' },
          slate:{ 200:'#E2E8F0' },
          teal:{ 500:'#14B8A6', 600:'#0F766E', 700:'#0F766E' },
          gray:{ 50:'#F9FAFB', 600:'#4B5563', 800:'#1F2937' },
        }
      }
    }
  }
</script>
<script src="https://cdn.tailwindcss.com/3.4.10"></script>
`.trim();

export function renderPortfolioHtml(data: PortfolioData): string {
  // 👇 use the typed key here (fixes TS7053)
  const key = toTemplateKey((data as any)?.templateId);
  const Template = PUBLISH_REGISTRY[key];

  const app = renderToStaticMarkup(React.createElement(Template, { data }));

  const title = `${data.fullName || 'Portfolio'}${data.role ? ' | ' + data.role : ''}`;
  const desc = (data.tagline || 'Personal portfolio').slice(0, 300).replace(/\s+/g, ' ').trim();
  const lang = (data as any)?.lang || 'en';

  return [
    '<!DOCTYPE html>',
    `<html lang="${escapeHtml(lang)}">`,
    '<head>',
    `<meta charset="utf-8" />`,
    `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(desc)}" />`,
    TAILWIND_HEAD,
    '</head>',
    `<body class="min-h-screen">`,
    app,
    '</body>',
    '</html>',
  ].join('');
}

function escapeHtml(s: string) {
  return (s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
