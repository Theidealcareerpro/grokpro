'use client';

import type { FC } from 'react';
import type { PortfolioData } from '@/lib/portfolio-types';

import PortfolioTemplateModern from './PortfolioTemplateModern';
import PortfolioTemplateClassic from './PortfolioTemplateClassic';
import PortfolioTemplateMinimal from './PortfolioTemplateMinimal';
import PortfolioTemplateTech from './PortfolioTemplateTech';
import PortfolioTemplateCreative from './PortfolioTemplateCreative';
import PortfolioTemplateCorporate from './PortfolioTemplateCorporate';

type TemplateComponent = FC<{ data: PortfolioData }>;

const PREVIEW_REGISTRY: Record<PortfolioData['templateId'], TemplateComponent> = {
  modern: PortfolioTemplateModern,
  classic: PortfolioTemplateClassic,
  minimal: PortfolioTemplateMinimal,
  tech:    PortfolioTemplateTech,
  creative: PortfolioTemplateCreative,
  corporate: PortfolioTemplateCorporate,
};

export default function PortfolioPreview({ data }: { data: PortfolioData }) {
  const Comp = PREVIEW_REGISTRY[data.templateId] ?? PortfolioTemplateModern;
  return <Comp data={data} />;
}
