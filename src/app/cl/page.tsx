'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Document, Page, Text, StyleSheet } from '@react-pdf/renderer';
import dynamic from 'next/dynamic';
import CLForm from '@/components/CLForm';
import CLPreview from '@/components/CLPreview';
import SectionIntro from '@/components/SectionIntro';
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
  intro: 'I am writing to express my strong interest...',
  bodyParagraphs: ['In my previous role at SkyNet Technologies, I ...'],
  excitement: 'What excites me most about joining TechCorp Innovations is...',
  thankYou: 'Thank you for considering my application...',
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
        <Text key={i} style={styles.text}>{paragraph}</Text>
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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-navy-900/10 to-white text-black dark:bg-zinc-900 dark:text-white">
      <header className="mb-4 sm:mb-6 flex justify-between items-center px-3 sm:px-6 pt-4">
        <h1 className="text-2xl font-bold text-white">Cover Letter Builder</h1>

        <PDFDownloadLink
          document={<CLPDFDocument clData={SAMPLE_CL} />}
          fileName="sample-cover-letter.pdf"
          className="px-3 py-2 rounded bg-gray-800 text-white hover:bg-gray-900 transition text-sm"
        >
          {({ loading }) => (loading ? 'Generating Sample Cover Letter...' : 'Download Sample Cover Letter')}
        </PDFDownloadLink>
      </header>

      <main className="mx-auto w-full max-w-none px-3 sm:px-6 flex flex-col lg:flex-row gap-6 lg:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-zinc-800 p-3 sm:p-5 rounded-lg shadow-md h-fit w-full lg:w-[45vw] lg:max-w-[800px] transition-[width] duration-300 ease-in-out"
        >
          <div className="mb-3 text-sm text-gray-600 dark:text-gray-300">
            Build your professional cover letter. It updates live on the right.
          </div>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <CLForm clData={clData} setCLData={setCLData} />
          )}

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            {currentStep < 2 ? (
              <Button
                type="button"
                disabled
                className="px-3 py-2 rounded bg-gray-800 text-white hover:bg-gray-900 transition text-sm flex items-center gap-2"
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
              className="px-3 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition text-sm flex items-center gap-2"
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
            isPreviewExpanded ? 'fixed top-0 left-0 w-full h-[100dvh] z-40 overflow-y-auto' : ''
          }`}
        >
          <div className="flex justify-between items-center px-3 py-1.5 bg-gray-800 rounded-t-xl">
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
              <div className="space-y-3">
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
