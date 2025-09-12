import 'server-only';
import type { FC } from 'react';
import type { PortfolioData } from '@/lib/portfolio-types';

// ====== SERVER-SAFE templates (NO "use client", NO hooks, NO next/image) ======
import ModernPro from './templates/ModernPro';
import ClassicProLeft from './templates/ClassicProLeft';
import CreativePro from './templates/CreativePro';
import MinimalPro from './templates/MinimalPro';
import CorporatePro from './templates/CorporatePro';
import TechPro from './templates/TechPro';

export type ServerTemplate = FC<{ data: PortfolioData }>;

export const PUBLISH_REGISTRY: Record<PortfolioData['templateId'], ServerTemplate> = {
  modern: ModernPro,
  classic: ClassicProLeft,
  minimal: MinimalPro,
  tech:    TechPro,
  creative: CreativePro,
  corporate: CorporatePro,
};
