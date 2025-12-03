export const STORAGE_KEY_CV = 'cvData';
  export type Theme = 'blue' | 'emerald' | 'rose' | 'black' | 'violet' | 'gold' | 'orange' | 'cyan'  | 'bronze' | 'forest' | 'teal';
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
    experience: ExperienceEntry[];
    skills: string[];
    certifications: string[];
    projects: string[];
    theme: Theme;
    font: FontChoice;
  };

  export const EMPTY_CV: CVData = {
    name: '',
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
    theme: 'blue',
    font: 'Helvetica',
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