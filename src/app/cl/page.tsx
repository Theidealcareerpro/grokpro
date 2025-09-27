'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
import dynamic from 'next/dynamic';
import CLForm from '@/components/CLForm';
import CLPreview from '@/components/CLPreview';
import SectionIntro from '@/components/SectionIntro';
import Section from '@/components/Section';
import Skeleton from '@/components/Skeleton';
import Counters  from '@/components/AnimatedCounters';
import { ArrowDownTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { CLData, STORAGE_KEY_CL, EMPTY_CL, sanitizeCLData } from '@/lib/types';

const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => ({ default: mod.PDFDownloadLink })),
  { ssr: false }
);

const SAMPLE_CL: CLData = {
  name: 'Jane Doe',
  address: 'London, UK',
  email: 'jane.doe@example.com',
  phone: '07812345678',
  linkedin: 'linkedin.com/in/janedoe',
  portfolio: 'janedoe.dev',
  date: 'September 03, 2025',
  hiringManagerName: 'Ms. Emily Carter',
  companyName: 'TechCorp Innovations',
  companyAddress: '123 Tech St',
  cityStateZip: 'London, UK, W1A 1AA',
  jobTitle: 'Senior Software Engineer',
  intro:
    'I am writing to express my strong interest in the Senior Software Engineer position at TechCorp Innovations. With a career focused on software engineering, I have consistently delivered solutions that combine innovation with measurable business results. I see this opportunity as the ideal next step to leverage my expertise in full-stack development while contributing to TechCorp Innovations’s mission of innovative tech solutions.',
  bodyParagraphs: [
    'In my previous role at SkyNet Technologies, I: Developed and deployed scalable web applications, improving performance by 28%. Implemented CI/CD pipelines, which cut delivery time by 40% and boosted efficiency across teams. Designed feature systems that enhanced user experience for thousands of users. Introduced testing and optimization, resulting in increased reliability.',
  ],
  excitement:
    'What excites me most about joining TechCorp Innovations is its commitment to innovation and customer value. I was particularly impressed by recent project, which demonstrates your dedication to industry goals. I am eager to contribute my expertise in relevant skill to help expand on such initiatives and support the company’s continued growth and leadership in the field.',
  thankYou:
    'Thank you for considering my application. I would welcome the opportunity to discuss how my background in core skills, combined with my proven track record of key achievements, can contribute to the success of the Senior Software Engineer role at TechCorp Innovations.',
  closing: 'Sincerely,\n\nJane Doe\njane.doe@example.com',
};

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: 'Helvetica', lineHeight: 1.5 },
  text: { fontSize: 10, marginBottom: 2, textAlign: 'justify' },
});

const CLPDFDocument = ({ clData }: { clData: CLData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={{ fontSize: 12, marginBottom: 10 }}>{clData.name}</Text>
      <Text style={{ fontSize: 12, marginBottom: 10 }}>{clData.address}</Text>
      <Text style={{ fontSize: 12, marginBottom: 10 }}>
        {clData.email} | {clData.phone || ''} | {clData.linkedin ? `LinkedIn: ${clData.linkedin}` : ''} |{' '}
        {clData.portfolio ? `Portfolio/Website: ${clData.portfolio}` : ''}
      </Text>
      <Text style={{ fontSize: 12, marginBottom: 10 }}>{clData.date}</Text>
      <Text style={{ fontSize: 12, marginBottom: 10 }}>{clData.hiringManagerName}</Text>
      <Text style={{ fontSize: 12, marginBottom: 10 }}>{clData.companyName}</Text>
      <Text style={{ fontSize: 12, marginBottom: 10 }}>{clData.companyAddress}</Text>
      <Text style={{ fontSize: 12, marginBottom: 10 }}>{clData.cityStateZip}</Text>
      <Text style={{ fontSize: 12, marginBottom: 10 }}>Re: Application for {clData.jobTitle} Position</Text>
      <Text style={{ fontSize: 12, marginBottom: 10 }}>Dear {clData.hiringManagerName},</Text>
      <Text style={styles.text}>{clData.intro}</Text>
      {clData.bodyParagraphs.map((paragraph, i) => (
        <Text key={i} style={styles.text}>
          {paragraph}
        </Text>
      ))}
      <Text style={styles.text}>{clData.excitement}</Text>
      <Text style={styles.text}>{clData.thankYou}</Text>
      <Text style={styles.text}>{clData.closing}</Text>
    </Page>
  </Document>
);

export default function CLPage() {
  const [clData, setCLData] = useState<CLData>(EMPTY_CL);
  const [loading, setLoading] = useState(true);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);

  useEffect(() => {
    const storedCL = localStorage.getItem(STORAGE_KEY_CL);
    if (storedCL) {
      try {
        setCLData(sanitizeCLData(JSON.parse(storedCL)));
      } catch {
        console.error('Invalid saved CL data');
      }
    }
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CL, JSON.stringify(clData));
  }, [clData]);

  const currentStep = clData.jobTitle && clData.companyName && clData.hiringManagerName ? 2 : 1;

  return (
    <div className="min-h-screen flex flex-col p-4 bg-gradient-to-b from-navy-900/10 to-white text-black dark:bg-zinc-900 dark:text-white">
      <header className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Cover Letter Builder</h1>

        <PDFDownloadLink
          document={<CLPDFDocument clData={SAMPLE_CL} />}
          fileName="sample-cover-letter.pdf"
          className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900 transition text-sm"
        >
          {({ loading }) => (loading ? 'Generating Sample Cover Letter...' : 'Download Sample Cover Letter')}
        </PDFDownloadLink>
      </header>

      {/* MOBILE SIZING FIXES */}
      <main className="mx-auto w-full max-w-none px-4 lg:max-w-[90vw] lg:px-6 flex flex-col lg:flex-row gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-zinc-800 p-4 sm:p-8 rounded-lg shadow-md h-fit w-full lg:w-[45vw] lg:max-w-[800px] transition-[width] duration-300 ease-in-out"
        >
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Build your professional cover letter. It updates live on the right.
          </div>

          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <CLForm clData={clData} setCLData={setCLData} />
          )}

          <div className="mt-4 flex items-center gap-2 flex-wrap">
            {currentStep < 2 ? (
              <Button
                type="button"
                disabled
                className="px-4 py-2 rounded bg-gray-800 text-white hover:bg-gray-900 transition text-sm flex items-center gap-2"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Complete Form to Download
              </Button>
            ) : (
              <Button type="button" className="px-0 py-0 h-9 overflow-hidden" variant="default" asChild aria-label="Download Cover Letter PDF">
                <PDFDownloadLink
                  document={<CLPDFDocument clData={clData} />}
                  fileName={`${clData.hiringManagerName}_CoverLetter.pdf`}
                  className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700 transition text-sm flex items-center gap-2"
                >
                  {({ loading }) => (
                    <>
                      <ArrowDownTrayIcon className="h-5 w-5" />
                      {loading ? 'Generating PDF...' : 'Download Cover Letter'}
                    </>
                  )}
                </PDFDownloadLink>
              </Button>
            )}

            <Button
              type="button"
              className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition text-sm flex items-center gap-2"
              onClick={() => setCLData(EMPTY_CL)}
            >
              <ArrowPathIcon className="h-5 w-5" />
              Reset
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`bg-gray-900 rounded-2xl shadow-xl h-fit w-full lg:w-[45vw] lg:max-w-[800px] transition-[width] duration-300 ease-in-out ${
            isPreviewExpanded ? 'fixed top-0 left-0 w-full h-screen z-40 overflow-y-auto' : ''
          }`}
        >
          <div className="flex justify-between items-center px-4 py-1 bg-gray-800 rounded-t-xl">
            <div className="flex gap-1">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIsPreviewExpanded((v) => !v)}
                className="bg-teal-600 text-white py-1 px-3 rounded hover:bg-teal-700 text-sm"
              >
                {isPreviewExpanded ? 'Collapse' : 'Expand'}
              </button>
              {isPreviewExpanded && (
                <button
                  type="button"
                  onClick={() => setIsPreviewExpanded(false)}
                  className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 text-sm"
                >
                  Close
                </button>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-800 rounded-b-xl p-2 sm:p-3 h-[calc(100%-2rem)] overflow-y-auto">
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ) : (
              <CLPreview data={clData} />
            )}
          </div>
        </motion.div>
      </main>

      <footer className="mt-20">
        <SectionIntro className="py-16" from="up" hue={192}>
          <div className="container-app">
            <h2 className="sr-only">Live platform stats</h2>
            <Counters />
          </div>
        </SectionIntro>
      </footer>
    </div>
  );
}
