'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import PortfolioPreview from '@/components/portfolio/PortfolioPreview';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PortfolioForm from '@/components/portfolio/PortfolioForm';
import { supabase } from '@/lib/supabase';
import FingerprintJS from '@fingerprintjs/fingerprintjs';
import type { PortfolioData } from '@/lib/portfolio-types';

export default function PortfolioBuilder() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData>({
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
    username: '',
  });
  const { theme, setTheme } = useTheme();
  const [viewSize, setViewSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expiry, setExpiry] = useState<Date | null>(null);
  const [showDonationPrompt, setShowDonationPrompt] = useState(false);
  const [donationError, setDonationError] = useState<string | null>(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const [liveUrl, setLiveUrl] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadFingerprintAndMetadata();
  }, []);

  const loadFingerprintAndMetadata = async () => {
    try {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      const visitorId = result.visitorId;
      setFingerprint(visitorId);

      const { data, error } = await supabase
        .from('portfolios')
        .select('expiry, donation_status, github_repo')
        .eq('fingerprint', visitorId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching metadata:', error);
      }

      if (data) {
        setExpiry(new Date(data.expiry));
        if (data.github_repo) {
          setLiveUrl(`https://your-org.github.io/${data.github_repo.split('/')[1]}/`);
        }
        if (new Date() > new Date(data.expiry)) {
          setShowDonationPrompt(true);
        }
      } else {
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        const { data: recentData } = await supabase
          .from('portfolios')
          .select('created_at')
          .eq('fingerprint', visitorId)
          .gte('created_at', threeMonthsAgo.toISOString())
          .limit(1);

        if (recentData && recentData.length > 0) {
          alert('You can only create one portfolio every 3 months. Please wait or donate to extend.');
          setIsLoading(false);
          return;
        }

        const newExpiry = new Date();
        newExpiry.setDate(newExpiry.getDate() + 21);
        await supabase
          .from('portfolios')
          .insert({
            fingerprint: visitorId,
            expiry: newExpiry.toISOString(),
            donation_status: { amount: 0, extendedDays: 0 },
          });
        setExpiry(newExpiry);
      }
    } catch (error) {
      console.error('Error loading fingerprint:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (Object.values(errors).some(e => e)) {
      alert('Please fix all errors before publishing.');
      return;
    }

    setPublishLoading(true);
    setLiveUrl(null);

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioData }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Publish failed');

      setLiveUrl(data.url);
      alert('Portfolio published successfully! Check the live URL below.');
    } catch (error) {
      console.error('Publish error:', error);
      alert('Failed to publish portfolio. Check console for details.');
    } finally {
      setPublishLoading(false);
    }
  };

  const exportToPDF = () => {
    if (previewRef.current && !Object.values(errors).some(e => e)) {
      html2canvas(previewRef.current, { scale: 2 }).then((canvas: HTMLCanvasElement) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = 210;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${portfolioData.fullName || 'portfolio'}_portfolio.pdf`);
      });
    } else {
      alert('Please fix all errors before exporting.');
    }
  };

  const exportToHTML = () => {
    if (!Object.values(errors).some(e => e)) {
      const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${portfolioData.fullName || 'Portfolio'} Portfolio</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .portfolio-content { max-width: 800px; margin: 0 auto; }
            h1 { font-size: 2em; }
            h2 { font-size: 1.5em; margin-top: 20px; }
            p, ul { line-height: 1.6; }
            img { max-width: 100%; height: auto; }
            a { color: #007bff; text-decoration: none; }
            a:hover { text-decoration: underline; }
          </style>
        </head>
        <body>
          <div class="portfolio-content">
            <h1>${portfolioData.fullName || 'Your Name'}</h1>
            ${portfolioData.photoDataUrl ? `<img src="${portfolioData.photoDataUrl}" alt="Headshot" style="width: 150px; border-radius: 50%;">` : ''}
            ${portfolioData.about ? `<h2>About</h2><p>${portfolioData.about}</p>` : ''}
            ${portfolioData.skills?.filter((s: string) => s).length > 0 ? `<h2>Skills</h2><ul>${portfolioData.skills.map((s: string) => s ? `<li>${s}</li>` : '').join('')}</ul>` : ''}
            ${portfolioData.projects?.filter((p: { name?: string; description?: string }) => p.name || p.description).length > 0 ? `<h2>Projects</h2>${portfolioData.projects.map((p: { name?: string; description?: string; link?: string }) => `<div><h3>${p.name || 'Project'}</h3><p>${p.description}</p>${p.link ? `<a href="${p.link}" target="_blank">Visit</a>` : ''}</div>`).join('')}` : ''}
            ${portfolioData.certifications?.filter((c: string) => c).length > 0 ? `<h2>Certifications</h2><ul>${portfolioData.certifications.map((c: string) => c ? `<li>${c}</li>` : '').join('')}</ul>` : ''}
            ${portfolioData.media?.filter((m: { title?: string; link?: string }) => m.title || m.link).length > 0 ? `<h2>Media</h2>${portfolioData.media.map((m: { title?: string; type?: string; link?: string }) => `<div><h3>${m.title || 'Media'}</h3><p>${m.type}</p>${m.link ? `<a href="${m.link}" target="_blank">View</a>` : ''}</div>`).join('')}` : ''}
            <h2>Contact</h2>
            <p>${portfolioData.email ? `Email: <a href="mailto:${portfolioData.email}">${portfolioData.email}</a>` : ''}</p>
            <p>${portfolioData.phone ? `Phone: ${portfolioData.phone}` : ''}</p>
            <p>${portfolioData.linkedin ? `LinkedIn: <a href="${portfolioData.linkedin}" target="_blank">LinkedIn</a>` : ''}</p>
            ${portfolioData.socials?.filter((s: { label?: string; url?: string }) => s.label && s.url).length > 0 ? `<h3>Social Links</h3>${portfolioData.socials.map((s: { label?: string; url?: string }) => s.label && s.url ? `<a href="${s.url}" target="_blank">${s.label}</a><br>` : '').join('')}` : ''}
            ${portfolioData.cvFileDataUrl ? `<a href="${portfolioData.cvFileDataUrl}" download="${portfolioData.cvFileName || 'cv.pdf'}">Download CV</a>` : ''}
          </div>
        </body>
        </html>
      `;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${portfolioData.fullName || 'portfolio'}_portfolio.html`;
      a.click();
      window.URL.revokeObjectURL(url);
    } else {
      alert('Please fix all errors before exporting.');
    }
  };

  const resetForm = () => {
    setPortfolioData({
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
      username: '',
    });
    setErrors({});
    setLiveUrl(null);
  };

  if (isLoading) return <div className="flex justify-center items-center h-screen">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-900/10 to-white text-black dark:bg-zinc-900 dark:text-white p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-teal-700">Portfolio Builder</h1>
        <Button variant="outline" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
          Toggle Theme
        </Button>
      </header>
      <main className="max-w-[90vw] mx-auto flex flex-col lg:flex-row gap-8 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-md order-1 min-h-[400px]"
          style={{
            width: '45vw',
            minWidth: '300px',
            maxWidth: '800px',
            transition: 'width 0.3s ease-in-out',
          }}
        >
          <PortfolioForm 
            portfolioData={portfolioData} 
            setPortfolioData={setPortfolioData} 
            errors={errors} 
            setErrors={setErrors}
          />
          <div className="mt-4 flex gap-2">
            <Button
              className="px-4 py-2 rounded bg-gray-600 text-white hover:bg-gray-700 transition text-sm flex items-center gap-2"
              onClick={resetForm}
            >
              Reset
            </Button>
            <Button
              className="px-4 py-2 rounded bg-teal-600 text-white hover:bg-teal-700 transition text-sm flex items-center gap-2"
              onClick={handlePublish}
              disabled={publishLoading}
            >
              {publishLoading ? 'Publishing...' : 'Publish'}
            </Button>
          </div>
          {showDonationPrompt && (
            <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
              <h3 className="text-lg font-semibold text-black dark:text-white">Portfolio Expired</h3>
              <p className="text-black dark:text-white">Support us to extend your portfolio!</p>
              <div className="mt-2">
                <a href="https://www.buymeacoffee.com/theidealprogen" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=☕&slug=theidealprogen&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=FF0000" alt="Buy Me a Coffee" />
                </a>
              </div>
              <p className="mt-2 text-sm text-black dark:text-white">Each $5 donation extends your portfolio by 30 days (max 6 months). Extension applies automatically after confirmation.</p>
              {donationError && <p className="mt-2 text-red-500 dark:text-red-400">{donationError}</p>}
            </div>
          )}
          {liveUrl && (
            <div className="mt-4 p-4 bg-green-100 dark:bg-green-800 rounded-lg">
              <h3 className="text-lg font-semibold text-black dark:text-white">Live Portfolio</h3>
              <p className="text-black dark:text-white">Your portfolio is live at: <a href={liveUrl} target="_blank" rel="noopener noreferrer">{liveUrl}</a></p>
            </div>
          )}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-gray-900 rounded-2xl shadow-xl order-2 min-h-[400px] ${isPreviewExpanded ? 'fixed top-0 left-0 w-full h-screen z-50 overflow-y-auto' : ''}`}
          style={{
            width: '45vw',
            minWidth: '300px',
            maxWidth: '800px',
            transition: 'width 0.3s ease-in-out',
          }}
        >
          <div className="flex justify-between items-center px-4 py-1 bg-gray-800 rounded-t-xl">
            <div className="flex gap-1">
              <span className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span className="w-3 h-3 bg-green-500 rounded-full" />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
                className="bg-teal-600 text-white py-1 px-3 rounded hover:bg-teal-700 text-sm"
              >
                {isPreviewExpanded ? 'Collapse' : 'Expand'}
              </button>
              {isPreviewExpanded && (
                <button
                  onClick={() => setIsPreviewExpanded(false)}
                  className="bg-red-600 text-white py-1 px-3 rounded hover:bg-red-700 text-sm"
                >
                  Close
                </button>
              )}
            </div>
          </div>
          <div className="p-8 bg-white dark:bg-zinc-800 rounded-b-xl h-[calc(100%-2rem)] overflow-y-auto text-black dark:text-white">
            <div className="preview-section">
              <div className="flex justify-end space-x-2 mb-4">
                <Button variant="outline" size="sm" onClick={() => setViewSize('mobile')}>Mobile</Button>
                <Button variant="outline" size="sm" onClick={() => setViewSize('tablet')}>Tablet</Button>
                <Button variant="outline" size="sm" onClick={() => setViewSize('desktop')}>Desktop</Button>
              </div>
              <div ref={previewRef} className={`max-w-[${viewSize === 'mobile' ? '375' : viewSize === 'tablet' ? '768' : '1280'}px] mx-auto`}>
                <PortfolioPreview data={portfolioData} />
                <div className="mt-4 flex gap-2 justify-center">
                  <Button onClick={exportToPDF} disabled={Object.values(errors).some(e => e)}>Export to PDF</Button>
                  <Button onClick={exportToHTML} disabled={Object.values(errors).some(e => e)}>Export to HTML</Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}