'use client';

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

// ──────────────────────────────────────────────────────────────
//  BEST-IN-CLASS FONT: Inter v4 (Official, Fast, Beautiful)
// ──────────────────────────────────────────────────────────────
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://rsms.me/inter/font-files/Inter-Regular.woff2', fontWeight: 'normal' },
    { src: 'https://rsms.me/inter/font-files/Inter-Medium.woff2', fontWeight: 500 },
    { src: 'https://rsms.me/inter/font-files/Inter-SemiBold.woff2', fontWeight: 600 },
    { src: 'https://rsms.me/inter/font-files/Inter-Bold.woff2', fontWeight: 'bold' },
  ],
});

const DEFAULT_FONT = 'Inter';

// ──────────────────────────────────────────────────────────────
//  Types
// ──────────────────────────────────────────────────────────────
interface Education {
  school: string;
  location: string;
  date: string;
  degree: string;
  details?: string;
}

interface Experience {
  company: string;
  location?: string;
  date?: string;
  role: string;
  description?: string;
  achievements?: string[];
}

interface CVData {
  name: string;
  theme?: 'blue' | 'emerald' | 'violet' | 'orange';
  customColor?: string;
  location?: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  portfolio?: string;
  summary?: string;
  education: Education[];
  experience: Experience[];
  skills: string[];
  certifications: string[];
  projects: string[];
  layout?: 'sidebar' | 'one-column';
  fontFamily?: 'Inter' | 'Roboto' | 'Helvetica';
}

// ──────────────────────────────────────────────────────────────
//  Themes
// ──────────────────────────────────────────────────────────────
const themes = {
  blue: '#1d4ed8',
  emerald: '#047857',
  violet: '#7c3aed',
  orange: '#ea580c',
  cyan: '#0891b2',            // clean business cyan
  bronze: '#b45309',          // premium resume tone
  forest: '#065f46',          // muted professional green
  teal: '#0d9488',            // refined teal
  gold: '#ca8a04',            // soft gold accent (print-friendly)
  black: '#000000',
} as const;

// ──────────────────────────────────────────────────────────────
//  STYLES – Pixel-perfect & DOCX-matched
// ──────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  page: {
    padding: 42,
    paddingTop: 36,
    fontFamily: DEFAULT_FONT,
    fontSize: 10.5,
    lineHeight: 1.55,
    color: '#1f2937',
    backgroundColor: '#ffffff',
  },

  header: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 0.3,
  },

  contact: {
    fontSize: 9.8,
    textAlign: 'center',
    color: '#4b5563',
    marginBottom: 18,
    fontWeight: 500,
  },

  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold' as const,
    marginTop: 16,
    marginBottom: 7,
    textTransform: 'uppercase' as const,
    letterSpacing: 1.4,
  },

  text: {
    fontSize: 10.5,
    marginBottom: 4,
    lineHeight: 1.5,
  },

  // Fixed bullet layout (never breaks)
  bulletWrapper: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bulletPoint: {
    width: 14,
    fontSize: 10.5,
    textAlign: 'center' as const,
    fontWeight: 'bold' as const,
  },
  bulletText: {
    flex: 1,
    fontSize: 10.5,
    lineHeight: 1.5,
  },

  separator: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 11,
  },

  // Layout
  twoColumn: { flexDirection: 'row', flexGrow: 1 },
  sidebar: {
    width: 190,
    paddingRight: 24,
    borderRightWidth: 1.2,
    borderRightColor: '#e5e7eb',
    paddingTop: 4,
  },
  main: { flex: 1, paddingLeft: 28, paddingTop: 4 },

  // Experience/Education
  jobTitle: { fontSize: 11.5, fontWeight: 'bold' as const },
  jobMeta: { fontSize: 10, color: '#6b7280', marginBottom: 5 },
  achievementHeader: {
    fontSize: 10.8,
    fontWeight: 'bold' as const,
    marginTop: 6,
    marginBottom: 4,
  },
});

// ──────────────────────────────────────────────────────────────
//  COMPONENTS
// ──────────────────────────────────────────────────────────────
const BulletItem: React.FC<{ children: string; color?: string }> = ({
  children,
  color = '#1f2937',
}) => (
  <View style={styles.bulletWrapper}>
    <Text style={[styles.bulletPoint, { color }]}>•</Text>
    <Text style={styles.bulletText}>{children}</Text>
  </View>
);

const Section: React.FC<{
  title: string;
  color: string;
  children: React.ReactNode;
  noSeparator?: boolean;
}> = ({ title, color, children, noSeparator }) => (
  <>
    <Text style={[styles.sectionTitle, { color }]}>{title}</Text>
    {children}
    {!noSeparator && <View style={styles.separator} />}
  </>
);

// ──────────────────────────────────────────────────────────────
//  MAIN DOCUMENT – 100% DOCX MATCHED
// ──────────────────────────────────────────────────────────────
const CVDocument: React.FC<{ cvData: CVData }> = ({ cvData }) => {
  const themeColor = cvData.customColor || themes[cvData.theme || 'blue'];
  const fontFamily = cvData.fontFamily || DEFAULT_FONT;

  const contactItems = [
    cvData.location,
    cvData.phone,
    cvData.email,
    cvData.linkedin?.replace(/^https?:\/\//i, ''),
    cvData.portfolio?.replace(/^https?:\/\//i, ''),
  ].filter(Boolean);

  const hasSidebarContent = cvData.skills.length > 0 || cvData.certifications.length > 0;
  const isSidebar = cvData.layout === 'sidebar' && hasSidebarContent;

  return (
    <Document title={`${cvData.name} - CV`} author={cvData.name}>
      <Page size="A4" style={[styles.page, { fontFamily }]}>
        {isSidebar ? (
          /* ====================== SIDEBAR LAYOUT ====================== */
          <View style={styles.twoColumn}>
            {/* Sidebar */}
            <View style={styles.sidebar}>
              <Text style={[styles.header, { color: themeColor, fontSize: 28 }]}>
                {cvData.name}
              </Text>
              <Text style={styles.contact}>{contactItems.join(' • ')}</Text>

              {cvData.skills.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { color: themeColor, fontSize: 12.5, marginTop: 22 }]}>
                    Skills
                  </Text>
                  {cvData.skills.map((s, i) => (
                    <BulletItem key={i} color={themeColor}>{s}</BulletItem>
                  ))}
                </>
              )}

              {cvData.certifications.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { color: themeColor, fontSize: 12.5, marginTop: 20 }]}>
                    Certifications
                  </Text>
                  {cvData.certifications.map((c, i) => (
                    <BulletItem key={i} color={themeColor}>{c}</BulletItem>
                  ))}
                </>
              )}
            </View>

            {/* Main */}
            <View style={styles.main}>
              {cvData.summary && (
                <Section title="Professional Summary" color={themeColor}>
                  <Text style={styles.text}>{cvData.summary}</Text>
                </Section>
              )}

              {cvData.experience.length > 0 && (
                <Section title="Experience" color={themeColor}>
                  {cvData.experience.map((exp, i) => (
                    <View key={i} style={{ marginBottom: 16 }}>
                      <Text style={styles.jobTitle}>
                        {exp.role} • {exp.company}{exp.location ? `, ${exp.location}` : ''}
                      </Text>
                      <Text style={styles.jobMeta}>{exp.date}</Text>
                      {exp.description && <Text style={styles.text}>{exp.description}</Text>}
                      {exp.achievements?.length ? (
                        <>
                          <Text style={[styles.achievementHeader, { color: themeColor }]}>
                            Key Achievements
                          </Text>
                          {exp.achievements.map((a, j) => (
                            <BulletItem key={j}>{a}</BulletItem>
                          ))}
                        </>
                      ) : null}
                    </View>
                  ))}
                </Section>
              )}

              {cvData.education.length > 0 && (
                <Section title="Education" color={themeColor}>
                  {cvData.education.map((edu, i) => (
                    <View key={i} style={{ marginBottom: 11 }}>
                      <Text style={{ fontWeight: 'bold' as const, fontSize: 11 }}>{edu.degree}</Text>
                      <Text style={styles.text}>{edu.school} • {edu.location}</Text>
                      <Text style={{ fontSize: 9.8, color: '#6b7280' }}>{edu.date}</Text>
                      {edu.details && <Text style={styles.text}>{edu.details}</Text>}
                    </View>
                  ))}
                </Section>
              )}

              {cvData.projects.length > 0 && (
                <Section title="Projects" color={themeColor} noSeparator>
                  {cvData.projects.map((p, i) => (
                    <BulletItem key={i}>{p}</BulletItem>
                  ))}
                </Section>
              )}
            </View>
          </View>
        ) : (
          /* ====================== ONE-COLUMN LAYOUT ====================== */
          <>
            <Text style={[styles.header, { color: themeColor }]}>{cvData.name}</Text>
            <Text style={styles.contact}>{contactItems.join(' • ')}</Text>
            <View style={styles.separator} />

            {cvData.summary && (
              <Section title="Professional Summary" color={themeColor}>
                <Text style={styles.text}>{cvData.summary}</Text>
              </Section>
            )}

            {cvData.experience.length > 0 && (
              <Section title="Experience" color={themeColor}>
                {cvData.experience.map((exp, i) => (
                  <View key={i} style={{ marginBottom: 16 }}>
                    <Text style={styles.jobTitle}>
                      {exp.role} at {exp.company}
                    </Text>
                    <Text style={styles.jobMeta}>
                      {exp.location} {exp.date ? `• ${exp.date}` : ''}
                    </Text>
                    {exp.description && <Text style={styles.text}>{exp.description}</Text>}
                    {exp.achievements?.length ? (
                      <>
                        <Text style={[styles.achievementHeader, { color: themeColor }]}>
                          Key Achievements
                        </Text>
                        {exp.achievements.map((a, j) => (
                          <BulletItem key={j}>{a}</BulletItem>
                        ))}
                      </>
                    ) : null}
                  </View>
                ))}
              </Section>
            )}

            {cvData.education.length > 0 && (
              <Section title="Education" color={themeColor}>
                {cvData.education.map((edu, i) => (
                  <View key={i} style={{ marginBottom: 11 }}>
                    <Text style={{ fontWeight: 'bold' as const, fontSize: 11 }}>{edu.degree}</Text>
                    <Text style={styles.text}>{edu.school}, {edu.location}</Text>
                    <Text style={{ fontSize: 9.8, color: '#6b7280' }}>{edu.date}</Text>
                  </View>
                ))}
              </Section>
            )}

            {/* SKILLS & CERTIFICATIONS — EXACTLY LIKE DOCX (stacked, full width) */}
            {cvData.skills.length > 0 && (
              <Section title="Skills" color={themeColor}>
                {cvData.skills.map((s, i) => (
                  <BulletItem key={i} color={themeColor}>{s}</BulletItem>
                ))}
              </Section>
            )}

            {cvData.certifications.length > 0 && (
              <Section title="Certifications" color={themeColor}>
                {cvData.certifications.map((c, i) => (
                  <BulletItem key={i} color={themeColor}>{c}</BulletItem>
                ))}
              </Section>
            )}

            {cvData.projects.length > 0 && (
              <Section title="Projects" color={themeColor} noSeparator>
                {cvData.projects.map((p, i) => (
                  <BulletItem key={i}>{p}</BulletItem>
                ))}
              </Section>
            )}
          </>
        )}
      </Page>
    </Document>
  );
};

export default CVDocument;