'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import CVForm from '@/components/CVForm';
import CVPreview from '@/components/CVPreview';
import Skeleton from '@/components/Skeleton';
import SectionIntro from '@/components/SectionIntro';
import Counters from '@/components/AnimatedCounters';
import { ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { CVData, STORAGE_KEY, EMPTY_CV, sanitizeCVData } from '@/lib/types';

// ────────────────────────────────────────────────────────────────
// Themes & styles
// ────────────────────────────────────────────────────────────────
const themes: Record<string, string> = {
  blue: '#1d4ed8',
  emerald: '#047857',
  violet: '#7c3aed',
  orange: '#ea580c',
  cyan: '#0891b2',            // clean business cyan
  bronze: '#b45309',          // premium resume tone
  forest: '#065f46',          // muted professional green
  teal: '#0d9488',            // refined teal
  gold: '#ca8a04',            // soft gold accent (print-friendly)
  black: '#000000'
};

const pdfStyles = StyleSheet.create({
  page: {
    paddingTop: 44,
    paddingBottom: 44,
    paddingHorizontal: 40,
    fontFamily: 'Helvetica',
    fontSize: 10.75,
    lineHeight: 1.34,
    color: '#111827',
  },

  name: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  contact: { fontSize: 10, color: '#4b5563', textAlign: 'center', marginBottom: 6, fontWeight: 500 },

  dividerThin: { borderBottomWidth: 0.6, marginBottom: 10, marginTop: 6 },
  // restore left alignment for section titles (preserve original design)
  sectionTitle: { fontSize: 13, fontWeight: 'bold', textAlign: 'center', textTransform: 'uppercase', marginBottom: 4 },
  sectionDivider: { borderBottomWidth: 1.2, marginBottom: 10, marginTop: -4 },

  companyLine: { fontSize: 12, fontWeight: 'bold', marginBottom: 2 },
  role: { fontSize: 10.25, fontWeight: 'bold', fontStyle: 'italic', textDecoration: 'underline', marginBottom: 4 },
  eduLine: { fontSize: 10.25, fontWeight: 'bold', marginBottom: 2 },

  body: { fontSize: 10, marginBottom: 4, textAlign: 'justify' },

  bullet: { flexDirection: 'row', marginBottom: 2, alignItems: 'flex-start' },
  bulletPoint: { width: 12, fontSize: 10, lineHeight: 1 },

  sectionGap: { height: 8 },
  entryGap: { height: 6 },
});

// ────────────────────────────────────────────────────────────────
// CVPDFDocument — compact + robust pagination (with sanitization)
// ────────────────────────────────────────────────────────────────
const CVPDFDocument = ({ cvData }: { cvData: CVData }) => {
  const themeColor = themes[cvData.theme] || themes.blue;

  // sanitize helper: removes falsy, empty, or whitespace-only items
  const cleanArray = (arr?: string[]) =>
    (arr || []).filter((s) => typeof s === 'string' && s.trim() !== '');

  // sanitize experience achievements
  const cleanExperience = (exps = cvData.experience) =>
    (exps || []).map((e) => ({
      ...e,
      achievements: (e.achievements || []).filter((a) => typeof a === 'string' && a.trim() !== ''),
      description: typeof e.description === 'string' ? e.description : '',
    }));

  // cleaned lists for rendering
  const contact = [
    cvData.location,
    cvData.phone,
    cvData.email,
    cvData.linkedin?.replace(/^https?:\/\//i, ''),
    cvData.portfolio?.replace(/^https?:\/\//i, ''),
  ]
    .filter(Boolean)
    .join(' • ');

  const education = (cvData.education || []).map((edu) => ({
    ...edu,
    details: typeof edu.details === 'string' ? edu.details : '',
  }));

  const experiences = cleanExperience();
  const skills = cleanArray(cvData.skills);
  const certifications = cleanArray(cvData.certifications);
  const projects = cleanArray(cvData.projects);
  const summary = typeof cvData.summary === 'string' ? cvData.summary.trim() : '';

  return (
    <Document title={`${cvData.name || 'CV'} - CV`} author={cvData.name || ''}>
      <Page size="A4" style={pdfStyles.page} wrap>
        {/* Header: keep together (do not split) */}
        <View wrap={false}>
          <Text style={[pdfStyles.name, { color: themeColor }]}>{cvData.name || 'Your Name'}</Text>
          {contact && <Text style={pdfStyles.contact}>{contact}</Text>}
          <View style={[pdfStyles.dividerThin, { borderColor: themeColor }]} />
        </View>

        {/* Summary — allow natural breaking (no wrap) */}
        {summary && (
          <>
            <Text style={[pdfStyles.sectionTitle, { color: themeColor }]}>Professional Summary</Text>
            <View style={[pdfStyles.sectionDivider, { borderColor: themeColor }]} />
            <Text style={pdfStyles.body}>{summary}</Text>
            <View style={pdfStyles.sectionGap} />
          </>
        )}

        {/* Education — keep each entry together to avoid awkward splits */}
        {education.length > 0 && (
          <>
            <Text style={[pdfStyles.sectionTitle, { color: themeColor }]}>Education</Text>
            <View style={[pdfStyles.sectionDivider, { borderColor: themeColor }]} />

            {education.map((edu, i) => (
              <View key={i} wrap={false} style={i > 0 ? pdfStyles.entryGap : undefined}>
                <Text style={pdfStyles.eduLine}>
                  {edu.degree}
                  {edu.school ? ` • ${edu.school}` : ''}
                  {edu.location ? ` • ${edu.location}` : ''}
                  {edu.date ? ` • ${edu.date}` : ''}
                </Text>
                {edu.details?.trim() && <Text style={pdfStyles.body}>{edu.details.trim()}</Text>}
              </View>
            ))}

            <View style={pdfStyles.sectionGap} />
          </>
        )}

        {/* Experience — keep company/role/description together, allow bullets to break */}
        {experiences.length > 0 && (
          <>
            <Text style={[pdfStyles.sectionTitle, { color: themeColor }]}>Professional Experience</Text>
            <View style={[pdfStyles.sectionDivider, { borderColor: themeColor }]} />

            {experiences.map((exp, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                {/* Company + Role + short description block kept together */}
                <View wrap={false}>
                  <Text style={pdfStyles.companyLine}>
                    {exp.company}
                    {exp.location ? ` • ${exp.location}` : ''}
                    {exp.date ? ` • ${exp.date}` : ''}
                  </Text>

                  <Text style={[pdfStyles.role, { color: themeColor }]}>{exp.role}</Text>

                  {exp.description?.trim() && <Text style={pdfStyles.body}>{exp.description.trim()}</Text>}
                </View>

                {/* Achievements header kept with first bullet (if any) — bullets break naturally */}
                {exp.achievements?.length > 0 && (
                  <>
                    {/* keep heading with first bullet where possible */}
                    <View wrap={false}>
                      <Text style={[pdfStyles.role, { color: themeColor, marginTop: 6 }]}>Key Achievements</Text>
                    </View>

                    {exp.achievements.map((ach, j) => (
                      <View key={j} style={pdfStyles.bullet}>
                        <Text style={[pdfStyles.bulletPoint, { color: themeColor }]}>•</Text>
                        <Text style={pdfStyles.body}>{ach}</Text>
                      </View>
                    ))}
                  </>
                )}

                {i < experiences.length - 1 && <View style={pdfStyles.entryGap} />}
              </View>
            ))}

            <View style={pdfStyles.sectionGap} />
          </>
        )}

        {/* Skills — break naturally, compact bullets */}
        {skills.length > 0 && (
          <>
            <Text style={[pdfStyles.sectionTitle, { color: themeColor }]}>Skills</Text>
            <View style={[pdfStyles.sectionDivider, { borderColor: themeColor }]} />

            {skills.map((skill, i) => (
              <View key={i} style={pdfStyles.bullet}>
                <Text style={[pdfStyles.bulletPoint, { color: themeColor }]}>•</Text>
                <Text style={pdfStyles.body}>{skill}</Text>
              </View>
            ))}

            <View style={pdfStyles.sectionGap} />
          </>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <>
            <Text style={[pdfStyles.sectionTitle, { color: themeColor }]}>Certifications</Text>
            <View style={[pdfStyles.sectionDivider, { borderColor: themeColor }]} />

            {certifications.map((cert, i) => (
              <View key={i} style={pdfStyles.bullet}>
                <Text style={[pdfStyles.bulletPoint, { color: themeColor }]}>•</Text>
                <Text style={pdfStyles.body}>{cert}</Text>
              </View>
            ))}

            <View style={pdfStyles.sectionGap} />
          </>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <>
            <Text style={[pdfStyles.sectionTitle, { color: themeColor }]}>Projects</Text>
            <View style={[pdfStyles.sectionDivider, { borderColor: themeColor }]} />

            {projects.map((proj, i) => (
              <View key={i} style={pdfStyles.bullet}>
                <Text style={[pdfStyles.bulletPoint, { color: themeColor }]}>•</Text>
                <Text style={pdfStyles.body}>{proj}</Text>
              </View>
            ))}
          </>
        )}
      </Page>
    </Document>
  );
};

// ────────────────────────────────────────────────────────────────
// 2. SAMPLE CV (unchanged)
// ────────────────────────────────────────────────────────────────
const SAMPLE_CV: CVData = {
  name: 'Jane Doe',
  location: 'London, UK',
  email: 'jane.doe@example.com',
  phone: '07812345678',
  linkedin: 'linkedin.com/in/janedoe',
  portfolio: 'janedoe.dev',
  summary:
    'Results-driven software engineer with extensive experience in crafting scalable web applications and optimizing cloud infrastructure. Proficient in leading agile teams to deliver innovative solutions that enhance user experience and operational efficiency.',
  education: [
    {
      school: 'Imperial College London',
      degree: 'BSc Computer Science',
      location: 'London, UK',
      date: '2017 - 2020',
      details:
        'Graduated with First Class Honours, specializing in cloud computing and software architecture. Developed a distributed task scheduler for final-year project.',
    },
  ],
  experience: [
    {
      company: 'SkyNet Technologies',
      location: 'London, UK',
      date: '2021 - Present',
      role: 'Full-Stack Software Engineer',
      description:
        'At SkyNet Technologies, architected and delivered high-performance, cloud-native web applications using React, TypeScript, Node.js, and AWS, serving over 50,000 monthly active users. Designed scalable microservices architectures, integrating GraphQL APIs and PostgreSQL databases to ensure robust data handling.',
      achievements: [
        'Enhanced application performance by 28% via optimized GraphQL queries and caching strategies.',
        'Led a team of 4 developers to deliver a client portal, increasing customer retention by 35%.',
      ],
    },
  ],
  skills: [
    'Proficient in JavaScript, building dynamic, interactive web applications with optimized performance.',
    'Expert in TypeScript, enhancing code reliability with static typing in large-scale projects.',
    'Skilled in React, crafting responsive, component-based UIs for seamless user experiences.',
    'Experienced with Node.js, developing scalable backend services and RESTful APIs.',
    'Adept at AWS, deploying and managing cloud infrastructure with EC2, Lambda, and S3.',
  ],
  certifications: ['AWS Certified Solutions Architect – Associate', 'Certified Kubernetes Application Developer'],
  projects: ['Built a real-time analytics dashboard with React, Node.js, and MongoDB.'],
  theme: 'blue',
  font: 'Helvetica',
};

// ────────────────────────────────────────────────────────────────
// 3. Main Page Component (unchanged behavior)
// ────────────────────────────────────────────────────────────────
export default function CVPage() {
  const [cvData, setCVData] = useState<CVData>(EMPTY_CV);
  const [loading, setLoading] = useState(true);
  const [isDownloadingSample, setIsDownloadingSample] = useState(false);
  const [isDownloadingCV, setIsDownloadingCV] = useState(false);
  const [isDownloadingDocx, setIsDownloadingDocx] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setCVData(sanitizeCVData(JSON.parse(stored)));
      } catch (e) {
        console.error('Failed to load saved CV', e);
      }
    }
    setTimeout(() => setLoading(false), 600);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData));
  }, [cvData]);

  const currentStep = cvData.name
    ? cvData.education.length > 0 && cvData.education[0].school
      ? 2
      : 1
    : 0;

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownloadSample = async () => {
    setIsDownloadingSample(true);
    try {
      const blob = await pdf(<CVPDFDocument cvData={SAMPLE_CV} />).toBlob();
      triggerDownload(blob, 'sample-cv.pdf');
    } catch (err) {
      alert('Failed to generate sample PDF');
    } finally {
      setIsDownloadingSample(false);
    }
  };

  const handleDownloadCV = async () => {
    setIsDownloadingCV(true);
    try {
      const filenameSafe = (cvData.name || 'my-cv').replace(/\s+/g, '_');
      const blob = await pdf(<CVPDFDocument cvData={cvData} />).toBlob();
      triggerDownload(blob, `${filenameSafe}_CV.pdf`);
    } catch (err) {
      alert('Failed to generate PDF');
    } finally {
      setIsDownloadingCV(false);
    }
  };

  const handleDownloadDocx = async () => {
    if (currentStep < 2) return;
    setIsDownloadingDocx(true);
    try {
      const { generateDocx } = await import('@/lib/generateDocx');
      await generateDocx(cvData);
    } catch (err) {
      alert('Failed to generate Word document');
    } finally {
      setIsDownloadingDocx(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-navy-900/10 to-white text-black dark:bg-zinc-900 dark:text-white">
      <header className="mb-4 sm:mb-6 flex justify-between items-center px-3 sm:px-6 pt-4">
        <h1 className="text-2xl font-bold text-white">CV Builder</h1>
        <button
          onClick={handleDownloadSample}
          disabled={isDownloadingSample}
          className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900 transition text-sm flex items-center gap-2"
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          {isDownloadingSample ? 'Generating...' : 'Download Sample CV'}
        </button>
      </header>

      <main className="mx-auto w-full max-w-none px-3 sm:px-6 flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-zinc-800 p-4 sm:p-6 rounded-lg shadow-md h-fit w-full lg:w-[45vw] lg:max-w-[800px]"
        >
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Build your professional CV. It updates live on the right.
          </div>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ) : (
            <CVForm cvData={cvData} setCVData={setCVData} />
          )}

          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={handleDownloadCV}
              disabled={currentStep < 2 || isDownloadingCV}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2.5 font-medium shadow-md"
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              {isDownloadingCV ? 'Generating PDF...' : 'Download PDF'}
            </button>

            <button
              onClick={handleDownloadDocx}
              disabled={currentStep < 2 || isDownloadingDocx}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition flex items-center gap-2.5 font-medium shadow-md"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                <path d="M14 2v6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <text x="7" y="15.5" fontSize="7" fill="white" fontWeight="bold">
                  W
                </text>
              </svg>
              {isDownloadingDocx ? 'Generating Word...' : 'Download Word'}
            </button>

            <button
              onClick={() => setCVData(EMPTY_CV)}
              className="px-5 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2 text-sm shadow-md"
            >
              <ArrowPathIcon className="h-5 w-5" />
              Reset Form
            </button>
          </div>
        </motion.div>

        {/* Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-900 rounded-2xl shadow-xl h-fit w-full lg:w-[45vw] lg:max-w-[800px]"
        >
          <div className="flex justify-between items-center px-3 py-1.5 bg-gray-800 rounded-t-rounded-t-xl">
            <div className="flex gap-1">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-b-xl p-3 sm:p-5 h-[calc(100%-2rem)] overflow-y-auto">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-5/6" />
              </div>
            ) : (
              <CVPreview data={cvData} />
            )}
          </div>
        </motion.div>
      </main>

      <footer className="mt-16">
        <SectionIntro className="py-12" from="up" hue={192}>
          <div className="container-app">
            <h2 className="sr-only">Live platform stats</h2>
            <Counters />
          </div>
        </SectionIntro>
      </footer>
    </div>
  );
}
