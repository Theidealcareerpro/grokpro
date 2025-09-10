'use client';
import type { PortfolioData } from '@/lib/portfolio-types';
import PortfolioTemplateModern from './PortfolioTemplateModern';
import PortfolioTemplateClassic from './PortfolioTemplateClassic';
import PortfolioTemplateMinimal from './PortfolioTemplateMinimal';
import PortfolioTemplateTech from './PortfolioTemplateTech';
import PortfolioTemplateCreative from './PortfolioTemplateCreative';
import PortfolioTemplateCorporate from './PortfolioTemplateCorporate';

export default function PortfolioPreview({ data }: { data: PortfolioData }) {
  switch (data.templateId) {
    case 'classic':
      return <PortfolioTemplateClassic data={data} />;
    case 'minimal':
      return <PortfolioTemplateMinimal data={data} />;
    case 'tech':
      return <PortfolioTemplateTech data={data} />;
    case 'creative':
      return <PortfolioTemplateCreative data={data} />;
    case 'corporate':
      return <PortfolioTemplateCorporate data={data} />;
    case 'modern':
    default:
      return <PortfolioTemplateModern data={data} />;
  }
}