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
  date: new Date().toLocaleDateString('en-GB'), // Dynamic date, consider persisting if needed
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

// Refine sanitizeCLData to accept partial CLData for better type safety
export const sanitizeCLData = (data: Partial<CLData> = {}): CLData => ({
  name: data.name || '',
  address: data.address || '',
  email: data.email || '',
  phone: data.phone || '',
  linkedin: data.linkedin || '',
  portfolio: data.portfolio || '',
  date: data.date || new Date().toLocaleDateString('en-GB'),
  hiringManagerName: data.hiringManagerName || '',
  companyName: data.companyName || '',
  companyAddress: data.companyAddress || '',
  cityStateZip: data.cityStateZip || '',
  jobTitle: data.jobTitle || '',
  intro: data.intro || '',
  bodyParagraphs: data.bodyParagraphs || [],
  excitement: data.excitement || '',
  thankYou: data.thankYou || '',
  closing: data.closing || '',
});