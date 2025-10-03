'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import dynamic from 'next/dynamic'; // NOTE: left in case other code needs dynamic, but we do not use it for PDFDownloadLink now
import CVForm from '@/components/CVForm';
import CVPreview from '@/components/CVPreview';
import Skeleton from '@/components/Skeleton';
import SectionIntro from '@/components/SectionIntro';
import Counters  from '@/components/AnimatedCounters';
import { ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { CVData, STORAGE_KEY, EMPTY_CV, sanitizeCVData } from '@/lib/types';

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
        'At SkyNet Technologies, architected and delivered high-performance, cloud-native web applications using React, TypeScript, Node.js, and AWS, serving over 50,000 monthly active users. Designed scalable microservices architectures, integrating GraphQL APIs and PostgreSQL databases to ensure robust data handling. Spearheaded the adoption of CI/CD pipelines using Jenkins and GitHub Actions, reducing deployment times by 40%. Collaborated with product managers and UX designers to refine application features, achieving a 30% increase in user satisfaction. Led code reviews and implemented automated testing with Jest, improving code coverage to 95%.',
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
    'Proficient in GraphQL, designing efficient APIs for flexible data querying.',
    'Fluent in Git, managing version control and collaborative workflows with GitHub.',
  ],
  certifications: ['AWS Certified Solutions Architect – Associate', 'Certified Kubernetes Application Developer'],
  projects: [
    'Built a real-time analytics dashboard with React, Node.js, and MongoDB, improving data processing speed by 20%. Kindly visit E-Portfolio Url for more: https://janedoe.dev',
  ],
  theme: 'blue',
  font: 'Helvetica',
};

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 11, fontFamily: 'Helvetica', lineHeight: 1.5 },
  section: { marginBottom: 7 },
  header: { fontSize: 21, fontWeight: 'bold', textAlign: 'center', marginBottom: 3, textTransform: 'uppercase' },
  subHeader: { fontSize: 12, fontWeight: 'bold', marginBottom: 3, textTransform: 'uppercase' },
  text: { fontSize: 10, marginBottom: 2, textAlign: 'justify' },
  listItem: { fontSize: 10, marginLeft: 12, marginBottom: 2 },
  grid: { flexDirection: 'row' },
  gridColumn: { flex: 1, paddingRight: 8 },
  separator: { borderBottomWidth: 1, borderColor: '#d1d5db', marginVertical: 5 },
  role: { fontWeight: 'bold', textDecoration: 'underline', fontStyle: 'italic' },
});

const CVPDFDocument = ({ cvData }: { cvData: CVData }) => {
  const themeColors: Record<string, string> = {
    blue: '#2563eb',
    emerald: '#059669',
    rose: '#e11d48',
    black: '#000000',
    teal: '#008080',
  };
  const themeColor = themeColors[cvData.theme] || themeColors.blue;
  const contactItems = [
    cvData.location,
    cvData.phone,
    cvData.email,
    cvData.linkedin && `LinkedIn: ${cvData.linkedin.replace(/^https?:\/\//, '')}`,
    cvData.portfolio && `Portfolio: ${cvData.portfolio.replace(/^https?:\/\//, '')}`,
  ]
    .filter(Boolean)
    .join(' | ');
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={[styles.header, { color: themeColor }]}>{cvData.name}</Text>
          <Text style={{ fontSize: 9, color: '#374151', textAlign: 'center', marginVertical: 6 }}>{contactItems}</Text>
          <View style={styles.separator} />
        </View>
        {cvData.summary && (
          <View style={styles.section}>
            <Text style={[styles.subHeader, { color: themeColor }]}>Summary</Text>
            <Text style={styles.text}>{cvData.summary}</Text>
            <View style={styles.separator} />
          </View>
        )}
        {cvData.education.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.subHeader, { color: themeColor }]}>Education</Text>
            {cvData.education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 6 }}>
                <Text style={{ fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase', marginBottom: 2 }}>
                  {edu.school} — {edu.location} — {edu.date}
                </Text>
                <Text style={styles.text}>{edu.degree}</Text>
                <Text style={styles.text}>{edu.details}</Text>
              </View>
            ))}
            <View style={styles.separator} />
          </View>
        )}
        {cvData.experience.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.subHeader, { color: themeColor }]}>Professional Experience</Text>
            {cvData.experience.map((exp, i) => (
              <View key={i} style={{ marginBottom: 8 }}>
                <Text style={{ fontSize: 11, fontWeight: 'bold', marginBottom: 2 }}>
                  <Text style={{ textTransform: 'uppercase' }}>{exp.company}</Text>
                  {exp.location ? ` — ${exp.location}` : ''} {exp.date && `(${exp.date})`}
                </Text>
                <Text style={[styles.text, styles.role]}>{exp.role}</Text>
                <Text style={styles.text}>{exp.description}</Text>
                {exp.achievements.filter((a) => a.trim()).length > 0 && (
                  <View style={{ marginTop: 4 }}>
                    <Text style={[styles.text, { fontWeight: 'bold', color: themeColor }]}>Key Achievements</Text>
                    {exp.achievements.map(
                      (ach, j) => ach.trim() && <Text key={j} style={styles.listItem}>• {ach}</Text>
                    )}
                  </View>
                )}
              </View>
            ))}
            <View style={styles.separator} />
          </View>
        )}
        {cvData.skills.filter((s) => s.trim()).length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.subHeader, { color: themeColor }]}>Skills</Text>
            <View style={styles.grid}>
              <View style={styles.gridColumn}>
                {cvData.skills
                  .filter((s) => s.trim())
                  .slice(0, Math.ceil(cvData.skills.length / 2))
                  .map((skill, i) => (
                    <Text key={i} style={styles.listItem}>
                      • {skill}
                    </Text>
                  ))}
              </View>
              <View style={styles.gridColumn}>
                {cvData.skills
                  .filter((s) => s.trim())
                  .slice(Math.ceil(cvData.skills.length / 2))
                  .map((skill, i) => (
                    <Text key={i} style={styles.listItem}>
                      • {skill}
                    </Text>
                  ))}
              </View>
            </View>
            <View style={styles.separator} />
          </View>
        )}
        {cvData.certifications.filter((c) => c.trim()).length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.subHeader, { color: themeColor }]}>Certifications</Text>
            <View style={styles.grid}>
              <View style={styles.gridColumn}>
                {cvData.certifications
                  .filter((c) => c.trim())
                  .slice(0, Math.ceil(cvData.certifications.length / 2))
                  .map((cert, i) => (
                    <Text key={i} style={styles.listItem}>
                      • {cert}
                    </Text>
                  ))}
              </View>
              <View style={styles.gridColumn}>
                {cvData.certifications
                  .filter((c) => c.trim())
                  .slice(Math.ceil(cvData.certifications.length / 2))
                  .map((cert, i) => (
                    <Text key={i} style={styles.listItem}>
                      • {cert}
                    </Text>
                  ))}
              </View>
            </View>
            <View style={styles.separator} />
          </View>
        )}
        {cvData.projects.filter((p) => p.trim()).length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.subHeader, { color: themeColor }]}>Projects</Text>
            {cvData.projects
              .filter((p) => p.trim())
              .map((proj, i) => (
                <Text key={i} style={styles.listItem}>
                  • {proj}
                </Text>
              ))}
          </View>
        )}
      </Page>
    </Document>
  );
};

export default function CVPage() {
  const [cvData, setCVData] = useState<CVData>(EMPTY_CV);
  const [loading, setLoading] = useState(true);

  // new: client-side download state
  const [isDownloadingSample, setIsDownloadingSample] = useState(false);
  const [isDownloadingCV, setIsDownloadingCV] = useState(false);

  useEffect(() => {
    const storedCV = localStorage.getItem(STORAGE_KEY);
    if (storedCV) {
      try {
        setCVData(sanitizeCVData(JSON.parse(storedCV)));
      } catch {
        console.error('Invalid saved CV data');
      }
    }
    setTimeout(() => setLoading(false), 600);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cvData));
  }, [cvData]);

  const currentStep = cvData.name ? (cvData.education.length > 0 && cvData.education[0].school ? 2 : 1) : 0;

  // Utility: trigger download of a Blob with filename
  const triggerBlobDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  // Handler: download the SAMPLE_CV
  const handleDownloadSample = async () => {
    try {
      setIsDownloadingSample(true);
      // Dynamically import pdf builder on demand (client only)
      const { pdf } = await import('@react-pdf/renderer');
      const blob = await pdf(<CVPDFDocument cvData={SAMPLE_CV} />).toBlob();
      triggerBlobDownload(blob, 'sample-cv.pdf');
    } catch (err) {
      console.error('Download sample CV error:', err);
      alert('Failed to generate sample PDF. Please try again.');
    } finally {
      setIsDownloadingSample(false);
    }
  };

  // Handler: download the user's CV (uses current cvData)
  const handleDownloadCV = async () => {
    try {
      setIsDownloadingCV(true);
      const { pdf } = await import('@react-pdf/renderer');
      const filenameSafe = (cvData.name || 'my-cv').replace(/\s+/g, '_');
      const blob = await pdf(<CVPDFDocument cvData={cvData} />).toBlob();
      triggerBlobDownload(blob, `${filenameSafe}_CV.pdf`);
    } catch (err) {
      console.error('Download CV error:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloadingCV(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-navy-900/10 to-white text-black dark:bg-zinc-900 dark:text-white">
      <header className="mb-4 sm:mb-6 flex justify-between items-center px-3 sm:px-6 pt-4">
        <h1 className="text-2xl font-bold text-white">CV Builder</h1>

        {/* Sample download - replaced dynamic PDFDownloadLink with explicit handler */}
        <button
          onClick={handleDownloadSample}
          className="px-3 py-2 rounded bg-gray-800 text-white hover:bg-gray-900 transition text-sm flex items-center gap-2"
          disabled={isDownloadingSample}
        >
          <ArrowDownTrayIcon className="h-5 w-5" />
          {isDownloadingSample ? 'Generating Sample CV...' : 'Download Sample CV'}
        </button>
      </header>

      <main className="mx-auto w-full max-w-none px-3 sm:px-6 flex flex-col lg:flex-row gap-6 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-zinc-800 p-3 sm:p-5 rounded-lg shadow-md h-fit w-full lg:w-[45vw] lg:max-w-[800px] transition-[width] duration-300 ease-in-out"
        >
          <div className="mb-3 text-sm text-gray-600 dark:text-gray-300">
            Build your professional CV. It updates live on the right.
          </div>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <CVForm cvData={cvData} setCVData={setCVData} />
          )}
          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <button
              className="px-3 py-2 rounded bg-gray-800 text-white hover:bg-gray-900 transition text-sm flex items-center gap-2"
              disabled={currentStep < 2 || isDownloadingCV}
              onClick={currentStep < 2 ? undefined : handleDownloadCV}
            >
              <ArrowDownTrayIcon className="h-5 w-5" />
              {currentStep < 2 ? (
                'Complete Form to Download'
              ) : isDownloadingCV ? (
                'Generating PDF...'
              ) : (
                'Download CV'
              )}
            </button>
            <button
              className="px-3 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition text-sm flex items-center gap-2"
              onClick={() => setCVData(EMPTY_CV)}
            >
              <ArrowPathIcon className="h-5 w-5" />
              Reset
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-900 rounded-2xl shadow-xl h-fit w-full lg:w-[45vw] lg:max-w-[800px] transition-[width] duration-300 ease-in-out"
        >
          <div className="flex justify-between items-center px-3 py-1.5 bg-gray-800 rounded-t-xl">
            <div className="flex gap-1">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="w-3 h-3 bg-green-500 rounded-full" />
            </div>

          </div>
          <div className="bg-white dark:bg-zinc-800 rounded-b-xl p-2 sm:p-3 h-[calc(100%-2rem)] overflow-y-auto">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
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
