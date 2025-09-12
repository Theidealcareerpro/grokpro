import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { PortfolioData } from '@/lib/portfolio-types';
import { PUBLISH_REGISTRY } from './registry';

// Tailwind runtime config to mirror your tailwind.config.ts (must be BEFORE the CDN script)
const TAILWIND_HEAD = `
<script>
  tailwind = window.tailwind || {};
  tailwind.config = {
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
  };
</script>
<script src="https://cdn.tailwindcss.com"></script>
`.trim();

export function renderPortfolioHtml(data: PortfolioData): string {
  const Template = PUBLISH_REGISTRY[data.templateId] ?? PUBLISH_REGISTRY.modern;

  // Render the chosen publish template to static markup
  const app = renderToStaticMarkup(React.createElement(Template, { data }));

  // Simple SEO fallbacks
  const title = `${data.fullName || 'Portfolio'}${data.role ? ' | ' + data.role : ''}`;
  const desc =
    data.tagline ||
    'Personal portfolio';

  // Wrap in a full HTML document and inject Tailwind runtime config so GitHub Pages matches preview
  return [
    '<!DOCTYPE html>',
    `<html lang="en">`,
    '<head>',
    `<meta charset="utf-8" />`,
    `<meta name="viewport" content="width=device-width, initial-scale=1" />`,
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(desc)}" />`,
    TAILWIND_HEAD,
    '</head>',
    // You can toggle dark mode here if you add a setting later: <html class="dark"> …
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
    .replace(/"/g, '&quot;');
}
