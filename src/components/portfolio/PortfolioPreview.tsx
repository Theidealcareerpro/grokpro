'use client';

import type { FC } from 'react';
import type { PortfolioData } from '@/lib/portfolio-types';

import Modern from '@/lib/publish/templates/Modern';
import Classic from '@/lib/publish/templates/Classic';
import Minimal from '@/lib/publish/templates/Minimal';
import Tech from '@/lib/publish/templates/Tech';
import Creative from '@/lib/publish/templates/Creative';
import Corporate from '@/lib/publish/templates/Corporate';

type TemplateComponent = FC<{ data: PortfolioData }>;

const PUBLISH_REGISTRY: Record<PortfolioData['templateId'], TemplateComponent> = {
  modern: Modern,
  classic: Classic,
  minimal: Minimal,
  tech:    Tech,
  creative: Creative,
  corporate: Corporate,
};

export default function PortfolioPreview({ data }: { data: PortfolioData }) {
  const Comp = PUBLISH_REGISTRY[data.templateId] ?? Modern;
  return <Comp data={data} />;
}


