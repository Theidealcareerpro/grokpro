import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { PortfolioData } from '@/lib/portfolio-types';
import { PUBLISH_REGISTRY } from './registry';

export function renderPortfolioHtml(data: PortfolioData) {
  const Template = PUBLISH_REGISTRY[data.templateId] ?? PUBLISH_REGISTRY.modern;
  const body = renderToStaticMarkup(<Template data={data} />);

  // Tailwind CDN for styles used by the templates
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${escapeHtml(data.fullName || 'Portfolio')} | Portfolio</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
${body}
</body>
</html>`;
}

function escapeHtml(s: string) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
