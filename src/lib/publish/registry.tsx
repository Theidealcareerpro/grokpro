import 'server-only';
import type { ComponentType } from 'react';
import type { PortfolioData } from '@/lib/portfolio-types';

import Classic from './templates/Classic';
import Corporate from './templates/Corporate';
import Minimal from './templates/Minimal';
import Modern from './templates/Modern';
import Tech from './templates/Tech';
import Creative from './templates/Creative';

export const TEMPLATE_IDS = ['classic', 'corporate', 'minimal', 'modern', 'tech', 'creative'] as const;
export type TemplateKey = (typeof TEMPLATE_IDS)[number];

export const PUBLISH_REGISTRY: Record<TemplateKey, ComponentType<{ data: PortfolioData }>> = {
  classic: Classic,
  corporate: Corporate,
  minimal: Minimal,
  modern: Modern,
  tech: Tech,
  creative: Creative,
} as const;
