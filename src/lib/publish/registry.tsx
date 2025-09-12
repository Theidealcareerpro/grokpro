import type { FC } from 'react';
import type { PortfolioData } from '@/lib/portfolio-types';
import Modern  from '@/lib/publish/templates/Modern';
import Creative from '@/lib/publish/templates/Creative';
import Tech from '@/lib/publish/templates/Tech';
import Corporate from '@/lib/publish/templates/Corporate';
import Minimal from '@/lib/publish/templates/Minimal';
import Classic from '@/lib/publish/templates/Classic'; // ⟵ add this

type TemplateId = PortfolioData['templateId'];
type Publisher = FC<{ data: PortfolioData }>;

export const PUBLISH_REGISTRY: Record<TemplateId, React.FC<{ data: PortfolioData }>> = {
  modern: Modern,
  creative: Creative,
  tech: Tech,
  corporate: Corporate,
  classic: Classic,  // ⟵ now real classic
  minimal: Minimal,   // (optional) keep fallback until you add a minimal clone
};

// Helper in case an unexpected id sneaks in at runtime
export function getPublishComponent(id: TemplateId): Publisher {
  return (PUBLISH_REGISTRY as Record<string, Publisher>)[id] ?? PUBLISH_REGISTRY.modern;
}

// Useful for pickers/menus
export const AVAILABLE_TEMPLATES = Object.keys(PUBLISH_REGISTRY) as TemplateId[];

// Optional default export
export default PUBLISH_REGISTRY;

