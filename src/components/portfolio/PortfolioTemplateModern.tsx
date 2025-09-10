'use client';
import Image from 'next/image';
import {
  Briefcase,
  BarChart3,
  Code,
  BookOpen,
  Lightbulb,
  Users,
  Database,
  PieChart,
  Rocket,
  Laptop,
  TrendingUp,
  Link as LinkIcon,
  Mail,
  Phone,
  Linkedin,
  Download,
  Award, // ⟵ added
} from 'lucide-react';
import type { PortfolioData } from '@/lib/portfolio-types';

const defaultSkillIcons = [Briefcase, BarChart3, Code, BookOpen, Lightbulb, Users];
const defaultProjectIcons = [Briefcase, Database, PieChart, Rocket, Laptop, TrendingUp];

export default function PortfolioTemplateModern({ data }: { data: PortfolioData }) {
  return (
    <div className="font-serif bg-gradient-to-b from-[#1c2526] to-[#2e3b3e] text-gray-100 min-h-screen">
      {/* ===== NAVIGATION ===== */}
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-[#0a1c3a] to-[#2b3a5c] shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-yellow-400">{data.fullName || 'Your Name'}</div>
          <div className="hidden md:flex gap-8 font-medium">
            <a href="#home" className="hover:text-yellow-400">Home</a>
            <a href="#about" className="hover:text-yellow-400">About</a>
            <a href="#skills" className="hover:text-yellow-400">Skills</a>
            <a href="#projects" className="hover:text-yellow-400">Projects</a>
            <a href="#certifications" className="hover:text-yellow-400">Certifications</a>
            <a href="#contact" className="hover:text-yellow-400">Contact</a>
          </div>
        </div>
      </nav>

      {/* ===== HERO ===== */}
      <section
        id="home"
        className="h-[90vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden
                   bg-gradient-to-r from-[#0a1c3a] via-[#2b3a5c] to-[#c9982f] bg-[length:400%_400%] animate-[gradientShift_12s_ease_infinite]"
      >
        {data.photoDataUrl ? (
          <Image
            src={data.photoDataUrl}
            alt={data.fullName || 'Profile photo'}
            width={200}
            height={200}
            unoptimized
            className="w-48 h-48 rounded-full object-cover mb-6
                       ring-4 ring-yellow-400 ring-offset-4 ring-offset-[#1c2526]
                       hover:ring-[#c9982f] transition duration-500 shadow-2xl"
          />
        ) : (
          <div className="w-48 h-48 mb-6 rounded-full bg-gray-600 ring-4 ring-yellow-400 ring-offset-4 ring-offset-[#1c2526]" />
        )}
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
          {data.fullName || 'Your Name'} {data.role ? `| ${data.role}` : ''}
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl text-gray-200">
          {data.tagline || 'Delivering expertise with precision and insight'}
        </p>
        <div className="mt-8 flex gap-4 flex-wrap justify-center">
          {data.cvFileDataUrl && (
            <a
              href={data.cvFileDataUrl}
              download={data.cvFileName ?? 'cv.pdf'}
              className="px-6 py-3 rounded-full bg-yellow-400 text-[#0a1c3a] font-semibold shadow-lg
                         hover:bg-[#c9982f] hover:text-white transition"
            >
              <Download className="inline w-4 h-4 mr-2" /> Download CV
            </a>
          )}
          {data.linkedin && (
            <a
              href={data.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full border border-yellow-400 text-yellow-400 font-semibold shadow-lg
                         hover:bg-yellow-400 hover:text-[#0a1c3a] transition"
            >
              <Linkedin className="inline w-4 h-4 mr-2" /> LinkedIn
            </a>
          )}
        </div>
      </section>

      {/* ===== ABOUT ===== */}
      {data.about && (
        <section id="about" className="max-w-5xl mx-auto py-20 px-6">
          <h2 className="text-3xl font-bold mb-6 relative inline-block after:absolute after:-bottom-2 after:left-0 after:w-24 after:h-1 after:bg-gradient-to-r from-yellow-400 to-[#c9982f]">
            About Me
          </h2>
          <p className="text-lg leading-relaxed text-justify">{data.about}</p>
        </section>
      )}

      {/* ===== SKILLS (FORCED SINGLE-COLUMN) ===== */}
      {Array.isArray(data.skills) && data.skills.filter(Boolean).length > 0 && (
        <section id="skills" className="bg-[#2e3b3e] py-20 px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Expertise</h2>

          <div className="mx-auto max-w-3xl flex flex-col gap-4">
            {data.skills.map((s, i) => {
              if (!s) return null;
              const Icon = defaultSkillIcons[i % defaultSkillIcons.length];
              return (
                <div
                  key={i}
                  className="group flex items-center gap-4 rounded-xl bg-[#4a5568] p-5
                             ring-1 ring-white/10 shadow-sm transition
                             hover:-translate-y-1 hover:shadow-xl hover:ring-yellow-400/40"
                >
                  <Icon className="w-7 h-7 text-yellow-400 flex-shrink-0" />
                  <p className="font-medium">{s}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ===== PROJECTS (FORCED SINGLE-COLUMN) ===== */}
      {Array.isArray(data.projects) && data.projects.filter((p) => p?.name?.trim?.() || p?.description?.trim?.()).length > 0 && (
        <section id="projects" className="mx-auto max-w-3xl py-20 px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Projects</h2>

          <div className="flex flex-col gap-6">
            {data.projects.map((p, i) => {
              const show = Boolean(p?.name?.trim?.() || p?.description?.trim?.());
              if (!show) return null;
              const Icon = defaultProjectIcons[i % defaultProjectIcons.length];
              return (
                <article
                  key={i}
                  className="group rounded-xl bg-[#4a5568] p-6 ring-1 ring-white/10 shadow-md transition
                             hover:-translate-y-1 hover:shadow-xl hover:ring-yellow-400/30"
                >
                  <div className="flex items-start gap-4">
                    <Icon className="w-9 h-9 text-yellow-400 flex-shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold">{p?.name}</h3>
                      {p?.description && <p className="mt-2 text-justify text-gray-200">{p.description}</p>}
                      {p?.link && (
                        <a
                          href={p.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-yellow-400 hover:underline mt-3"
                        >
                          <LinkIcon size={16} /> Visit
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* ===== CERTIFICATIONS (CARD STYLE) ===== */}
      {Array.isArray(data.certifications) && data.certifications.filter(Boolean).length > 0 && (
        <section id="certifications" className="bg-[#2e3b3e] py-20 px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Certifications</h2>

          <div className="mx-auto max-w-3xl flex flex-col gap-4">
            {data.certifications.map((cert, index) => (
              cert && (
                <div
                  key={index}
                  className="group flex items-center gap-3 rounded-xl bg-[#4a5568] p-4
                             ring-1 ring-white/10 shadow-sm transition
                             hover:-translate-y-0.5 hover:shadow-lg hover:ring-yellow-400/30"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-400/15 ring-1 ring-yellow-400/40">
                    <Award className="h-6 w-6 text-yellow-400" />
                  </span>
                  <p className="text-lg">{cert}</p>
                </div>
              )
            ))}
          </div>
        </section>
      )}

      {/* ===== CONTACT ===== */}
      <section id="contact" className="bg-[#2e3b3e] py-20 px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Contact</h2>
        <div className="flex justify-center gap-6 flex-wrap text-lg">
          {data.email && (
            <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:text-yellow-400">
              <Mail className="w-5 h-5" /> {data.email}
            </a>
          )}
          {data.phone && (
            <a href={`tel:${data.phone}`} className="flex items-center gap-2 hover:text-yellow-400">
              <Phone className="w-5 h-5" /> {data.phone}
            </a>
          )}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-[#0a1c3a] text-gray-400 text-center py-6">
        <p>© {new Date().getFullYear()} {data.fullName || 'Your Name'} | Professional Portfolio</p>
      </footer>
    </div>
  );
}

/* ===== Animations ===== */
declare global {
  interface CSSStyleDeclaration {
    ['@keyframes gradientShift']: string;
  }
}
