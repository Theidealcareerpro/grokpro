'use client';

import type { FC } from 'react';
import type { PortfolioData } from '@/lib/portfolio-types';

// ===== CLIENT templates (interactive) =====
import ModernPro from '../portfolio/templates/ModernPro';
import ClassicProLeft from '../portfolio/templates/ClassicProLeft';
import CreativePro from '../portfolio/templates/CreativePro';
import MinimalPro from '../portfolio/templates/MinimalPro';
import CorporatePro from '../portfolio/templates/CorporatePro';
import TechPro from '../portfolio/templates/TechPro';

export type TemplateComponent = FC<{ data: PortfolioData }>;

export const PREVIEW_REGISTRY: Record<PortfolioData['templateId'], TemplateComponent> = {
  modern: ModernPro,
  classic: ClassicProLeft,
  minimal: MinimalPro,
  tech: TechPro,
  creative: CreativePro,
  corporate: CorporatePro,
};
