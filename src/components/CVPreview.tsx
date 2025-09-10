'use client';
  import { CVData } from '@/lib/types';
  import {
    MapPinIcon,
    DevicePhoneMobileIcon,
    EnvelopeIcon,
    LinkIcon,
    ClipboardDocumentIcon,
  } from '@heroicons/react/24/outline';
  import { motion } from 'framer-motion';

  interface CVPreviewProps {
    data: CVData;
  }

  export default function CVPreview({ data }: CVPreviewProps) {
    const themeColor = data.theme === 'blue' ? 'text-blue-600' : data.theme === 'emerald' ? 'text-emerald-600' : data.theme === 'black' ? 'text-black' : data.theme === 'teal' ? 'text-teal-600' : 'text-rose-600';

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`bg-white dark:bg-zinc-900 p-8 rounded-lg shadow-lg text-gray-800 dark:text-gray-200 print:p-0 print:bg-white print:shadow-none ${data.font === 'Helvetica' ? 'font-helvetica' : data.font === 'Roboto' ? 'font-roboto' : 'font-times'}`}
      >
        <h1 className={`text-4xl font-bold text-center ${themeColor} print:text-2xl`}>{data.name || 'Your Name'}</h1>
        <div className="flex flex-wrap justify-center gap-4 items-center text-gray-600 dark:text-gray-400 text-sm mt-2 print:text-sm print:flex-col print:gap-1">
          {data.portfolio && (
            <a
              href={data.portfolio.startsWith('http') ? data.portfolio : `https://${data.portfolio}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline print:underline"
            >
              <ClipboardDocumentIcon className={`w-4 h-4 ${themeColor}`} />
              <span className="font-bold">{data.portfolio.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
          {data.email && (
            <a href={`mailto:${data.email}`} className="flex items-center gap-1 hover:underline print:underline">
              <EnvelopeIcon className={`w-4 h-4 ${themeColor}`} />
              <span className="font-bold">{data.email}</span>
            </a>
          )}
          {data.phone && (
            <a href={`tel:${data.phone}`} className="flex items-center gap-1 hover:underline print:underline">
              <DevicePhoneMobileIcon className={`w-4 h-4 ${themeColor}`} />
              <span className="font-bold">{data.phone}</span>
            </a>
          )}
          {data.linkedin && (
            <a
              href={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:underline print:underline"
            >
              <LinkIcon className={`w-4 h-4 ${themeColor}`} />
              <span className="font-bold">{data.linkedin.replace(/^https?:\/\//, '')}</span>
            </a>
          )}
          {data.location && (
            <span className="flex items-center gap-1 print:no-underline">
              <MapPinIcon className={`w-4 h-4 ${themeColor}`} />
              <span className="font-bold">{data.location}</span>
            </span>
          )}
        </div>
        <hr className="border-t border-gray-300 my-4 print:border-t print:my-2" />
        {data.summary && (
          <section className="mb-6 print:mb-4">
            <h2 className={`text-xl font-semibold ${themeColor} mb-2 print:text-lg`}>Summary</h2>
            <p className="text-justify print:text-sm">{data.summary}</p>
          </section>
        )}
        {data.education.length > 0 && (
          <section className="mb-6 print:mb-4">
            <h2 className={`text-xl font-semibold ${themeColor} mb-2 print:text-lg`}>Education</h2>
            {data.education.map((edu, idx) => (
              <div key={idx} className="mb-3 print:mb-2">
                <div className="flex justify-between text-sm font-medium print:text-xs">
                  <span>{edu.school} — {edu.location}</span>
                  <span>{edu.date}</span>
                </div>
                <p className="font-semibold print:text-sm">{edu.degree}</p>
                <p className="text-justify print:text-xs">{edu.details}</p>
              </div>
            ))}
          </section>
        )}
        {data.experience.length > 0 && (
          <section className="mb-6 print:mb-4">
            <h2 className={`text-xl font-semibold ${themeColor} mb-2 print:text-lg`}>Professional Experience</h2>
            {data.experience.map((exp, idx) => (
              <div key={idx} className="mb-4 print:mb-2">
                <div className="flex justify-between text-sm font-medium print:text-xs">
                  <span className="font-bold">{exp.company} — {exp.location}</span>
                  <span className="font-bold">{exp.date}</span>
                </div>
                <p className={`text-sm ${themeColor} underline italic print:text-sm`}>{exp.role}</p> {/* Match size with Key Achievements, use theme color */}
                <p className="text-justify print:text-xs">{exp.description}</p>
                {exp.achievements.filter(a => a.trim()).length > 0 && (
                  <div className="mt-2 print:mt-1">
                    <h3 className={`text-sm font-semibold ${themeColor} print:text-xs`}>Key Achievements</h3>
                    <ul className="list-disc list-inside text-sm print:text-xs">
                      {exp.achievements.map((ach, i) => ach.trim() && <li key={i}>{ach}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </section>
        )}
        {data.skills.filter(s => s.trim()).length > 0 && (
          <section className="mb-6 print:mb-4">
            <h2 className={`text-xl font-semibold ${themeColor} mb-2 print:text-lg`}>Skills</h2>
            <ul className="grid grid-cols-2 gap-y-1 list-disc list-inside text-sm print:text-xs">
              {data.skills.map((skill, idx) => skill.trim() && <li key={idx}>{skill}</li>)}
            </ul>
          </section>
        )}
        {data.certifications.filter(c => c.trim()).length > 0 && (
          <section className="mb-6 print:mb-4">
            <h2 className={`text-xl font-semibold ${themeColor} mb-2 print:text-lg`}>Certifications</h2>
            <ul className="grid grid-cols-2 gap-y-1 list-disc list-inside text-sm print:text-xs">
              {data.certifications.map((cert, idx) => cert.trim() && <li key={idx}>{cert}</li>)}
            </ul>
          </section>
        )}
        {data.projects.filter(p => p.trim()).length > 0 && (
          <section className="print:mb-4">
            <h2 className={`text-xl font-semibold ${themeColor} mb-2 print:text-lg`}>Projects</h2>
            <ul className="list-disc list-inside text-sm print:text-xs">
              {data.projects.map((proj, idx) => proj.trim() && <li key={idx} className="text-justify print:text-xs">{proj}</li>)}
            </ul>
          </section>
        )}
      </motion.div>
    );
  }