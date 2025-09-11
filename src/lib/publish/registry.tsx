// src/lib/publish/registry.tsx
import type { FC } from 'react';
import type { PortfolioData } from '@/lib/portfolio-types';

// NOTE: These files should each default-export a publish-safe (no "use client") component.
import PublishTemplateModern from './templates/ModernPro';
import PublishTemplateCreative from './templates/CreativePro';
import PublishTemplateTech from './templates/TechPro';
import PublishTemplateCorporate from './templates/CorporatePro';
import PublishTemplateClassic from './templates/ClassicProLeft';

type TemplateId = PortfolioData['templateId'];
type Publisher = FC<{ data: PortfolioData }>;

// Map each template id to its publish component
export const PUBLISH_REGISTRY = {
  modern: PublishTemplateModern,
  creative: PublishTemplateCreative,
  tech: PublishTemplateTech,
  corporate: PublishTemplateCorporate,
  classic: PublishTemplateClassic,
  // Until you add a dedicated Minimal publish component, reuse Modern for parity
  minimal: PublishTemplateModern,
} as const satisfies Record<TemplateId, Publisher>;

// Helper in case an unexpected id sneaks in at runtime
export function getPublishComponent(id: TemplateId): Publisher {
  return (PUBLISH_REGISTRY as Record<string, Publisher>)[id] ?? PUBLISH_REGISTRY.modern;
}

// Useful for pickers/menus
export const AVAILABLE_TEMPLATES = Object.keys(PUBLISH_REGISTRY) as TemplateId[];

// Optional default export
export default PUBLISH_REGISTRY;
