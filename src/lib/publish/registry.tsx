import * as React from 'react';
import type { PortfolioData } from '@/lib/portfolio-types';
import Modern  from '@/lib/publish/templates/Modern';
import Creative from '@/lib/publish/templates/Creative';
import Tech from '@/lib/publish/templates/Tech';
import Corporate from '@/lib/publish/templates/Corporate';
import Minimal from '@/lib/publish/templates/Minimal';
import Classic from '@/lib/publish/templates/Classic'; // ⟵ add this

type TemplateId = PortfolioData['templateId'];

export const PUBLISH_REGISTRY: Record<TemplateId, React.FC<{ data: PortfolioData }>> = {
  modern: Modern,
  creative: Creative,
  tech: Tech,
  corporate: Corporate,
  classic: Classic,  // ⟵ now real classic
  minimal: Minimal,   // (optional) keep fallback until you add a minimal clone
};
