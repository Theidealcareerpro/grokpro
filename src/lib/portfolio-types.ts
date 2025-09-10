export interface PortfolioProject {
  name: string;
  description: string;
  link?: string;
}

export interface PortfolioSocial {
  label: string;
  url: string;
}

export interface PortfolioData {
  fullName: string;
  role?: string;
  tagline?: string;
  location?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  photoDataUrl?: string;
  cvFileDataUrl?: string;
  cvFileName?: string;
  about?: string;
  skills: string[];
  projects: PortfolioProject[];
  certifications: string[];
  media: Media[];
  socials: PortfolioSocial[];
  templateId: 'modern' | 'classic' | 'minimal' | 'tech' | 'creative' | 'corporate';
  username?: string; // Added optional username field
}

export interface Media {
  title: string;
  type: 'video' | 'podcast' | 'article';
  link: string;
}

export interface Metadata {
  fingerprint: string;
  username: string;
  expiry: Date;
  donationStatus: { amount: number; extendedDays: number };
}

export const EMPTY_PORTFOLIO: PortfolioData = {
  fullName: '',
  role: '',
  tagline: '',
  location: '',
  email: '',
  phone: '',
  linkedin: '',
  photoDataUrl: '',
  cvFileDataUrl: '',
  cvFileName: '',
  about: '',
  skills: [''],
  projects: [{ name: '', description: '', link: '' }],
  certifications: [''],
  media: [{ title: '', type: 'video', link: '' }],
  socials: [{ label: '', url: '' }],
  templateId: 'modern',
  username: '', // Added default for username
};

export function sanitizePortfolioData(data: unknown): PortfolioData {
  if (!data || typeof data !== 'object') return EMPTY_PORTFOLIO;
  const d = data as Partial<PortfolioData>;
  const clean = (s?: string) => (s?.trim() ? s.trim() : '');
  return {
    fullName: clean(d.fullName),
    role: clean(d.role),
    tagline: clean(d.tagline),
    location: clean(d.location),
    email: clean(d.email),
    phone: clean(d.phone),
    linkedin: clean(d.linkedin),
    photoDataUrl: clean(d.photoDataUrl),
    cvFileDataUrl: clean(d.cvFileDataUrl),
    cvFileName: clean(d.cvFileName),
    about: clean(d.about),
    skills: (d.skills || []).map(clean).filter(Boolean),
    projects: (d.projects || []).map(p => ({
      name: clean(p?.name),
      description: clean(p?.description),
      link: clean(p?.link),
    })).filter(p => p.name),
    certifications: (d.certifications || []).map(clean).filter(Boolean),
    media: (d.media || []).map(m => ({
      title: clean(m?.title),
      type: m?.type || 'video',
      link: clean(m?.link),
    })).filter(m => m.title),
    socials: (d.socials || []).map(s => ({
      label: clean(s?.label),
      url: clean(s?.url),
    })).filter(s => s.label && s.url),
    templateId: d.templateId || 'modern',
    username: clean(d.username), // Added sanitization for username
  };
}