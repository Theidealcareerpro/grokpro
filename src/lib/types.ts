export const STORAGE_KEY = 'cvData';
export const EMPTY_CV = {
  name: 'Your Name',
  location: '',
  email: '',
  phone: '',
  linkedin: '',
  portfolio: '',
  summary: '',
  education: [{ school: '', degree: '', location: '', date: '', details: '' }],
  experience: [{ company: '', location: '', date: '', role: '', description: '', achievements: [''] }],
  skills: [''],
  certifications: [''],
  projects: [''],
  theme: 'blue' as Theme,
  font: 'Helvetica' as FontChoice,
};

export type Theme = 'blue' | 'emerald' | 'rose' | 'black' | 'teal';
export type FontChoice = 'Helvetica' | 'Roboto' | 'Times';
export type ExperienceEntry = {
  company: string;
  location: string;
  date: string;
  role: string;
  description: string;
  achievements: string[];
};
export type EducationEntry = {
  school: string;
  degree: string;
  location: string;
  date: string;
  details: string;
};
export type CVData = {
  name: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolio: string;
  summary: string;
  education: EducationEntry[];
  skills: string[];
  certifications: string[];
  projects: string[];
  experience: ExperienceEntry[];
  theme: Theme;
  font: FontChoice;
};

export function sanitizeCVData(raw: unknown): CVData {
  if (typeof raw !== 'object' || raw === null) return EMPTY_CV;
  const data = raw as Partial<CVData>;
  const clean = (s?: string) => (s && s.trim() ? s.trim() : '');
  return {
    ...EMPTY_CV,
    ...data,
    name: clean(data.name),
    location: clean(data.location),
    email: clean(data.email),
    phone: clean(data.phone),
    linkedin: clean(data.linkedin),
    portfolio: clean(data.portfolio),
    summary: clean(data.summary),
    education: (data.education || []).map((e) => ({
      school: clean(e?.school),
      degree: clean(e?.degree),
      location: clean(e?.location),
      date: clean(e?.date),
      details: clean(e?.details),
    })).filter((e) => e.school || e.degree),
    experience: (data.experience || []).map((e) => ({
      company: clean(e?.company),
      location: clean(e?.location),
      date: clean(e?.date),
      role: clean(e?.role),
      description: clean(e?.description),
      achievements: (e?.achievements || []).map(clean).filter(Boolean),
    })).filter((e) => e.company || e.role),
    skills: (data.skills || []).map(clean).filter(Boolean),
    certifications: (data.certifications || []).map(clean).filter(Boolean),
    projects: (data.projects || []).map(clean).filter(Boolean),
    theme: (data.theme || 'blue') as Theme,
    font: (data.font || 'Helvetica') as FontChoice,
  };
}

export interface CLData {
  name: string;
  address: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolio: string;
  date: string;
  hiringManagerName: string;
  companyName: string;
  companyAddress: string;
  cityStateZip: string;
  jobTitle: string;
  intro: string;
  bodyParagraphs: string[];
  excitement: string;
  thankYou: string;
  closing: string;
}

export const EMPTY_CL: CLData = {
  name: '',
  address: '',
  email: '',
  phone: '',
  linkedin: '',
  portfolio: '',
  date: new Date().toLocaleDateString('en-GB'),
  hiringManagerName: '',
  companyName: '',
  companyAddress: '',
  cityStateZip: '',
  jobTitle: '',
  intro: '',
  bodyParagraphs: [],
  excitement: '',
  thankYou: '',
  closing: '',
};

export const STORAGE_KEY_CL = 'clData';

export function sanitizeCLData(data: unknown): CLData {
  if (typeof data !== 'object' || data === null) return EMPTY_CL;
  const d = data as Partial<CLData>;
  return {
    name: d.name || '',
    address: d.address || '',
    email: d.email || '',
    phone: d.phone || '',
    linkedin: d.linkedin || '',
    portfolio: d.portfolio || '',
    date: d.date || new Date().toLocaleDateString('en-GB'),
    hiringManagerName: d.hiringManagerName || '',
    companyName: d.companyName || '',
    companyAddress: d.companyAddress || '',
    cityStateZip: d.cityStateZip || '',
    jobTitle: d.jobTitle || '',
    intro: d.intro || '',
    bodyParagraphs: d.bodyParagraphs || [],
    excitement: d.excitement || '',
    thankYou: d.thankYou || '',
    closing: d.closing || '',
  };
}

export interface Project {
  title: string;
  description: string;
  link: string;
  thumbnail: string;
}

export interface Media {
  title: string;
  type: 'video' | 'podcast' | 'article';
  link: string;
}

export interface Portfolio {
  name: string;
  summary: string;
  headshot?: string;
  expertise: string[];
  projects: Project[];
  media: Media[];
}

export interface Metadata {
  fingerprint: string;
  username: string;
  expiry: Date;
  donationStatus: { amount: number; extendedDays: number };
}

export const EMPTY_PORTFOLIO: Portfolio = {
  name: '',
  summary: '',
  headshot: '',
  expertise: [''],
  projects: [{ title: '', description: '', link: '', thumbnail: '' }],
  media: [{ title: '', type: 'video', link: '' }],
};

export function sanitizeData(data: unknown): Portfolio {
  if (!data || typeof data !== 'object') return EMPTY_PORTFOLIO;
  const d = data as Partial<Portfolio>;
  const clean = (s?: string) => (s?.trim() ? s.trim() : '');
  return {
    name: clean(d.name),
    summary: clean(d.summary),
    headshot: clean(d.headshot),
    expertise: (d.expertise || []).map(clean).filter(Boolean),
    projects: (d.projects || []).map((p) => ({
      title: clean(p?.title),
      description: clean(p?.description),
      link: clean(p?.link),
      thumbnail: clean(p?.thumbnail),
    })).filter((p) => p.title),
    media: (d.media || []).map((m) => ({
      title: clean(m?.title),
      type: m?.type || 'video',
      link: clean(m?.link),
    })).filter((m) => m.title),
  };
}