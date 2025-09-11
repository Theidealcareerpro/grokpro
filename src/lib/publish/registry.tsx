import * as React from 'react';
import type { PortfolioData } from '@/lib/portfolio-types';
import { PublishTemplateModern } from './templates/modern';
import { PublishTemplateCreative } from './templates/creative';
import { PublishTemplateTech } from './templates/tech';
import { PublishTemplateCorporate } from './templates/corporate';
import { PublishTemplateClassic } from './templates/classic'; // ⟵ add this

type TemplateId = PortfolioData['templateId'];

export const PUBLISH_REGISTRY: Record<TemplateId, React.FC<{ data: PortfolioData }>> = {
  modern: PublishTemplateModern,
  creative: PublishTemplateCreative,
  tech: PublishTemplateTech,
  corporate: PublishTemplateCorporate,
  classic: PublishTemplateClassic,  // ⟵ now real classic
  minimal: PublishTemplateModern,   // (optional) keep fallback until you add a minimal clone
};
