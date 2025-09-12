// components/portfolio/PortfolioPreview.tsx
'use client';

import type { FC } from 'react';
import type { PortfolioData } from '@/lib/portfolio-types';

import ModernPro from '@/lib/publish/templates/ModernPro';
import ClassicProLeft from '@/lib/publish/templates/ClassicProLeft';
import MinimalPro from '@/lib/publish/templates/MinimalPro';
import TechPro from '@/lib/publish/templates/TechPro';
import CreativePro from '@/lib/publish/templates/CreativePro';
import CorporatePro from '@/lib/publish/templates/CorporatePro';

type TemplateComponent = FC<{ data: PortfolioData }>;

const PREVIEW_REGISTRY: Record<PortfolioData['templateId'], TemplateComponent> = {
  modern: ModernPro,
  classic: ClassicProLeft,
  minimal: MinimalPro,
  tech:    TechPro,
  creative: CreativePro,
  corporate: CorporatePro,
};

export default function PortfolioPreview({ data }: { data: PortfolioData }) {
  const Comp = PREVIEW_REGISTRY[data.templateId] ?? ModernPro;
  return <Comp data={data} />;
}
