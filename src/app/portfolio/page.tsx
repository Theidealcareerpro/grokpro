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
import Image from 'next/image';

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
  const [isLoading, setIsLoading] = useState(true);
  const [showDonationPrompt, setShowDonationPrompt] = useState(false);
  const [donationError, setDonationError] = useState<string | null>(null);
  const [publishLoading, setPublishLoading] = useState(false);
  const [liveUrl, setLiveUrl] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadFingerprintAndMetadata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Supabase read error:', error);
      }

      if (data) {
        const expiryDate = new Date(data.expiry);
        if (new Date() > expiryDate) setShowDonationPrompt(true);

        if (data.github_repo) {
          const [owner, repo] = String(data.github_repo).split('/');
          if (owner && repo) setLiveUrl(`https://${owner}.github.io/${repo}/`);
        }
      }

      // No placeholder insert here (schema requires github_repo). Row is created during /api/publish.
    } catch (err) {
      console.error('Error loading fingerprint:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePublish = async () => {
    if (Object.values(errors).some((e) => e)) {
      alert('Please fix all errors before publishing.');
      return;
    }
    if (!fingerprint) {
      alert('Unable to determine fingerprint. Please reload the page and try again.');
      return;
    }

    setPublishLoading(true);
    setLiveUrl(null);

    try {
      const response = await fetch('/api/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioData, fingerprint }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || 'Publish failed');

      setLiveUrl(data.url);
      alert('Portfolio published successfully! Check the live URL below.');
    } catch (err) {
      console.error('Publish error:', err);
      alert('Failed to publish portfolio. Check console for details.');
    } finally {
      setPublishLoading(false);
    }
  };

  const exportToPDF = () => {
    if (previewRef.current && !Object.values(errors).some((e) => e)) {
      html2canvas(previewRef.current, { scale: 2 }).then((canvas: HTMLCanvasElement) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
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

  // Export as a nice-looking Tailwind page (includes CDN + runtime config, so it matches your theme)
  const exportToHTML = () => {
    if (Object.values(errors).some((e) => e)) {
      alert('Please fix all errors before exporting.');
      return;
    }

    const esc = (s: string) =>
      (s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    const skills = (portfolioData.skills || []).filter(Boolean);
    const projects = (portfolioData.projects || []).filter(p => (p?.name && p.name.trim()) || (p?.description && p.description.trim()));
    const certs = (portfolioData.certifications || []).filter(Boolean);
    const media = (portfolioData.media || []).filter(m => (m?.title && m.title.trim()) || (m?.link && m.link.trim()));
    const socials = (portfolioData.socials || []).filter(s => s?.label && s?.url);

    const head = `
<!-- Tailwind runtime config so exported HTML matches your Tailwind theme -->
<script>
  window.tailwind = window.tailwind || {};
  window.tailwind.config = {
    darkMode: 'class',
    theme: {
      screens: { sm:'640px', md:'768px', lg:'1024px', xl:'1280px' },
      extend: {
        colors: {
          navy:{ 700:'#1E3A8A' },
          slate:{ 200:'#E2E8F0' },
          teal:{ 500:'#14B8A6', 600:'#0F766E', 700:'#0F766E' },
          gray:{ 50:'#F9FAFB', 600:'#4B5563', 800:'#1F2937' },
        }
      }
    }
  }
</script>
<script src="https://cdn.tailwindcss.com"></script>
<meta name="viewport" content="width=device-width, initial-scale=1" />
    `.trim();

    const html = `
<!DOCTYPE html>
<html lang="en" class="${theme === 'dark' ? 'dark' : ''}">
<head>
  <meta charset="UTF-8" />
  <title>${esc(portfolioData.fullName || 'Portfolio')} | Portfolio</title>
  ${head}
</head>
<body class="min-h-screen bg-gradient-to-b from-[#0A1C3A]/10 to-white text-gray-900 dark:bg-zinc-900 dark:text-white">
  <header class="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur border-b border-slate-200/60 dark:border-zinc-800">
    <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
      <h1 class="text-xl md:text-2xl font-bold text-navy-700 dark:text-white">${esc(portfolioData.fullName || 'Your Name')}</h1>
      <div class="flex gap-2">
        ${portfolioData.cvFileDataUrl ? `<a class="px-3 py-1.5 rounded-full bg-teal-600 text-white text-sm" href="${portfolioData.cvFileDataUrl}" download="${esc(portfolioData.cvFileName || 'cv.pdf')}">Download CV</a>` : ''}
        ${portfolioData.linkedin ? `<a class="px-3 py-1.5 rounded-full border border-teal-600 text-teal-700 dark:text-teal-400 text-sm" href="${portfolioData.linkedin}" target="_blank" rel="noopener">LinkedIn</a>` : ''}
      </div>
    </div>
  </header>

  <main class="max-w-5xl mx-auto px-4 py-8 space-y-8">
    <section class="text-center">
      ${portfolioData.photoDataUrl ? `<img src="${portfolioData.photoDataUrl}" alt="${esc(portfolioData.fullName || 'Headshot')}" class="mx-auto h-32 w-32 rounded-xl object-cover ring-2 ring-teal-500/40" />` : ''}
      <h2 class="text-2xl md:text-3xl font-bold mt-4">${esc(portfolioData.fullName || 'Your Name')}${portfolioData.role ? ` · <span class="font-medium">${esc(portfolioData.role)}</span>` : ''}</h2>
      ${portfolioData.tagline ? `<p class="text-gray-600 dark:text-gray-300 mt-2">${esc(portfolioData.tagline)}</p>` : ''}
      ${portfolioData.location ? `<p class="text-gray-500 dark:text-gray-400 text-sm mt-1">${esc(portfolioData.location)}</p>` : ''}
    </section>

    ${portfolioData.about ? `
    <section class="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow">
      <h3 class="text-xl font-semibold text-navy-700 dark:text-white mb-2">About</h3>
      <p class="text-gray-700 dark:text-gray-300 leading-relaxed">${esc(portfolioData.about)}</p>
    </section>` : ''}

    ${skills.length ? `
    <section class="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow">
      <h3 class="text-xl font-semibold text-navy-700 dark:text-white mb-3">Skills</h3>
      <div class="flex flex-wrap gap-2">
        ${skills.map(s => `<span class="px-3 py-1 rounded-full bg-slate-200 dark:bg-zinc-800 text-sm">${esc(s)}</span>`).join('')}
      </div>
    </section>` : ''}

    ${projects.length ? `
    <section class="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow">
      <h3 class="text-xl font-semibold text-navy-700 dark:text-white mb-3">Projects</h3>
      <div class="space-y-4">
        ${projects.map(p => `
          <article class="rounded-lg border border-slate-200 dark:border-zinc-800 p-4">
            <h4 class="text-lg font-semibold">${esc(p.name || 'Project')}</h4>
            ${p.description ? `<p class="text-gray-700 dark:text-gray-300 mt-1">${esc(p.description)}</p>` : ''}
            ${p.link ? `<a href="${p.link}" target="_blank" rel="noopener" class="inline-block mt-2 text-teal-700 dark:text-teal-400 underline">Visit</a>` : ''}
          </article>
        `).join('')}
      </div>
    </section>` : ''}

    ${certs.length ? `
    <section class="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow">
      <h3 class="text-xl font-semibold text-navy-700 dark:text-white mb-3">Certifications</h3>
      <ul class="list-disc pl-6 space-y-1">
        ${certs.map(c => `<li>${esc(c)}</li>`).join('')}
      </ul>
    </section>` : ''}

    ${media.length ? `
    <section class="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow">
      <h3 class="text-xl font-semibold text-navy-700 dark:text-white mb-3">Media</h3>
      <div class="space-y-3">
        ${media.map(m => `
          <div>
            <div class="font-medium">${esc(m.title || 'Media')}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">${esc(m.type || 'video')}</div>
            ${m.link ? `<a href="${m.link}" target="_blank" rel="noopener" class="inline-block mt-1 text-teal-700 dark:text-teal-400 underline">View</a>` : ''}
          </div>
        `).join('')}
      </div>
    </section>` : ''}

    <section class="rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 shadow">
      <h3 class="text-xl font-semibold text-navy-700 dark:text-white mb-3">Contact</h3>
      <div class="space-y-1">
        ${portfolioData.email ? `<div>Email: <a href="mailto:${portfolioData.email}" class="underline">${esc(portfolioData.email)}</a></div>` : ''}
        ${portfolioData.phone ? `<div>Phone: ${esc(portfolioData.phone)}</div>` : ''}
        ${portfolioData.linkedin ? `<div>LinkedIn: <a href="${portfolioData.linkedin}" target="_blank" rel="noopener" class="underline">Profile</a></div>` : ''}
        ${socials.length ? `<div class="mt-2"><div class="font-medium mb-1">Socials</div>${socials.map(s => `<a class="inline-block mr-3 underline" href="${s.url}" target="_blank" rel="noopener">${esc(s.label)}</a>`).join('')}</div>` : ''}
        ${portfolioData.cvFileDataUrl ? `<div class="mt-2"><a class="px-3 py-1.5 rounded-full bg-teal-600 text-white text-sm" href="${portfolioData.cvFileDataUrl}" download="${esc(portfolioData.cvFileName || 'cv.pdf')}">Download CV</a></div>` : ''}
      </div>
    </section>
  </main>

  <footer class="py-6 text-center text-gray-600 dark:text-gray-400">
    © ${new Date().getFullYear()} ${esc(portfolioData.fullName || 'Your Name')} — Portfolio
  </footer>
</body>
</html>
    `.trim();

    const blob = new Blob([html], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${portfolioData.fullName || 'portfolio'}_portfolio.html`;
    a.click();
    window.URL.revokeObjectURL(url);
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

  // runtime-safe width for preview (no dynamic Tailwind class)
  const previewMaxWidth = viewSize === 'mobile' ? 375 : viewSize === 'tablet' ? 768 : 1280;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1C3A]/10 to-white text-black dark:bg-zinc-900 dark:text-white p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-teal-700 dark:text-teal-400">Portfolio Builder</h1>
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
          style={{ width: '45vw', minWidth: '300px', maxWidth: '800px', transition: 'width 0.3s ease-in-out' }}
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
                  <Image
                    src="https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=☕&slug=theidealprogen&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=FF0000"
                    alt="Buy Me a Coffee"
                    width={200}
                    height={50}
                  />
                </a>
              </div>
              <p className="mt-2 text-sm text-black dark:text-white">
                Each $5 donation extends your portfolio by 30 days (max 6 months). Extension applies automatically after confirmation.
              </p>
              {donationError && <p className="mt-2 text-red-500 dark:text-red-400">{donationError}</p>}
            </div>
          )}

          {liveUrl && (
            <div className="mt-4 p-4 bg-green-100 dark:bg-green-800 rounded-lg">
              <h3 className="text-lg font-semibold text-black dark:text-white">Live Portfolio</h3>
              <p className="text-black dark:text-white">
                Your portfolio is live at: <a href={liveUrl} target="_blank" rel="noopener noreferrer">{liveUrl}</a>
              </p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className={`bg-gray-900 rounded-2xl shadow-xl order-2 min-h-[400px] ${isPreviewExpanded ? 'fixed top-0 left-0 w-full h-screen z-50 overflow-y-auto' : ''}`}
          style={{ width: '45vw', minWidth: '300px', maxWidth: '800px', transition: 'width 0.3s ease-in-out' }}
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

              <div ref={previewRef} style={{ maxWidth: previewMaxWidth, marginLeft: 'auto', marginRight: 'auto' }}>
                <PortfolioPreview data={portfolioData} />
                <div className="mt-4 flex gap-2 justify-center">
                  <Button onClick={exportToPDF} disabled={Object.values(errors).some((e) => e)}>Export to PDF</Button>
                  <Button onClick={exportToHTML} disabled={Object.values(errors).some((e) => e)}>Export to HTML</Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
