'use client';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { MapPinIcon } from '@heroicons/react/24/outline';

// Register fonts
Font.register({
  family: 'Helvetica',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js', // Placeholder, replace with actual font file URL if needed
});
Font.register({
  family: 'Roboto',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js', // Placeholder, replace with actual font file URL if needed
});
Font.register({
  family: 'Times',
  src: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js', // Placeholder, replace with actual font file URL if needed
});

interface CVData {
  name: string;
  theme: "blue" | "emerald" | "rose";
  location?: string;
  phone?: string;
  email?: string;
  linkedin?: string;
  portfolio?: string;
  summary?: string;
  education: { school: string; location: string; date: string; degree: string; details: string }[];
  experience: { company: string; location?: string; date?: string; role: string; description: string; achievements: string[] }[];
  skills: string[];
  certifications: string[];
  projects: string[];
  layout?: "one-column" | "sidebar";
  fontFamily?: "Helvetica" | "Roboto" | "Times";
  customColor?: string;
}

const themeColors = {
  blue: '#2563eb',
  emerald: '#059669',
  rose: '#e11d48',
};

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 11,
    lineHeight: 1.5,
    flexDirection: 'column',
  },
  sidebar: {
    width: 150,
    paddingRight: 10,
    borderRightWidth: 1,
    borderRightColor: '#d1d5db',
  },
  mainContent: {
    flex: 1,
  },
  header: {
    fontSize: 21,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  contact: {
    fontSize: 9,
    color: '#374151',
    textAlign: 'center',
    marginVertical: 6,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#d1d5db',
    marginVertical: 5,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  text: {
    fontSize: 10,
    marginBottom: 2,
  },
  bulletText: {
    fontSize: 10,
    marginLeft: 12,
    marginBottom: 2,
  },
  twoColumn: {
    flexDirection: 'row',
  },
  column: {
    flex: 1,
    paddingRight: 8,
  },
});

export default function CVDocument({ cvData }: { cvData: CVData }) {
  const themeColor = themeColors[cvData.theme] || themeColors.blue;
  const customStyle = cvData.customColor ? { color: cvData.customColor } : {};
  const fontFamily = cvData.fontFamily || 'Helvetica';

  return (
    <Document>
      <Page size="A4" style={[styles.page, { fontFamily }]}>
        {cvData.layout === 'sidebar' ? (
          <View style={styles.twoColumn}>
            <View style={styles.sidebar}>
              <Text style={[styles.header, customStyle]}>{cvData.name || 'Your Name'}</Text>
              <Text style={styles.contact}>
                {[
                  cvData.location,
                  cvData.phone,
                  cvData.email,
                  cvData.linkedin?.replace(/^https?:\/\//, ''),
                  cvData.portfolio?.replace(/^https?:\/\//, ''),
                ].filter(Boolean).join(' | ')}
              </Text>
              {cvData.skills.filter(s => s.trim()).length > 0 && (
                <View>
                  <Text style={[styles.sectionHeader, customStyle]}>Skills</Text>
                  {cvData.skills.filter(s => s.trim()).map((skill, index) => (
                    <Text key={index} style={styles.bulletText}>• {skill}</Text>
                  ))}
                </View>
              )}
              {cvData.certifications.filter(c => c.trim()).length > 0 && (
                <View>
                  <Text style={[styles.sectionHeader, customStyle]}>Certifications</Text>
                  {cvData.certifications.filter(c => c.trim()).map((cert, index) => (
                    <Text key={index} style={styles.bulletText}>• {cert}</Text>
                  ))}
                </View>
              )}
            </View>
            <View style={styles.mainContent}>
              {/* Main content sections */}
              {cvData.summary && (
                <View>
                  <Text style={[styles.sectionHeader, { color: themeColor }, customStyle]}>Summary</Text>
                  <Text style={styles.text}>{cvData.summary}</Text>
                  <View style={styles.separator} />
                </View>
              )}
              {cvData.education.filter(e => e.school.trim()).length > 0 && (
                <View>
                  <Text style={[styles.sectionHeader, { color: themeColor }, customStyle]}>Education</Text>
                  {cvData.education.filter(e => e.school.trim()).map((edu, index) => (
                    <View key={index} style={{ marginBottom: 6 }}>
                      <Text style={styles.text}>{edu.school} — {edu.location} — {edu.date}</Text>
                      <Text style={styles.text}>{edu.degree}</Text>
                      <Text style={styles.text}>{edu.details}</Text>
                    </View>
                  ))}
                  <View style={styles.separator} />
                </View>
              )}
              {cvData.experience.filter(e => e.company.trim()).length > 0 && (
                <View>
                  <Text style={[styles.sectionHeader, { color: themeColor }, customStyle]}>Experience</Text>
                  {cvData.experience.filter(e => e.company.trim()).map((exp, index) => (
                    <View key={index} style={{ marginBottom: 8 }}>
                      <Text style={styles.text}>{exp.company.toUpperCase()} {exp.location ? `— ${exp.location}` : ''} {exp.date ? `(${exp.date})` : ''}</Text>
                      <Text style={styles.text}>{exp.role}</Text>
                      <Text style={styles.text}>{exp.description}</Text>
                      {exp.achievements.filter(a => a.trim()).length > 0 && (
                        <View>
                          <Text style={[styles.sectionHeader, { color: themeColor, fontSize: 10 }, customStyle]}>Achievements</Text>
                          {exp.achievements.filter(a => a.trim()).map((ach, achIndex) => (
                            <Text key={achIndex} style={styles.bulletText}>• {ach}</Text>
                          ))}
                        </View>
                      )}
                    </View>
                  ))}
                  <View style={styles.separator} />
                </View>
              )}
              {cvData.projects.filter(p => p.trim()).length > 0 && (
                <View>
                  <Text style={[styles.sectionHeader, { color: themeColor }, customStyle]}>Projects</Text>
                  {cvData.projects.filter(p => p.trim()).map((proj, index) => (
                    <Text key={index} style={styles.bulletText}>• {proj}</Text>
                  ))}
                </View>
              )}
            </View>
          </View>
        ) : (
          <View>
            <Text style={[styles.header, customStyle]}>{cvData.name || 'Your Name'}</Text>
            <Text style={styles.contact}>
              {[
                cvData.location,
                cvData.phone,
                cvData.email,
                cvData.linkedin?.replace(/^https?:\/\//, ''),
                cvData.portfolio?.replace(/^https?:\/\//, ''),
              ].filter(Boolean).join(' | ')}
            </Text>
            {cvData.summary && (
              <View>
                <Text style={[styles.sectionHeader, { color: themeColor }, customStyle]}>Summary</Text>
                <Text style={styles.text}>{cvData.summary}</Text>
                <View style={styles.separator} />
              </View>
            )}
            {cvData.education.filter(e => e.school.trim()).length > 0 && (
              <View>
                <Text style={[styles.sectionHeader, { color: themeColor }, customStyle]}>Education</Text>
                {cvData.education.filter(e => e.school.trim()).map((edu, index) => (
                  <View key={index} style={{ marginBottom: 6 }}>
                    <Text style={styles.text}>{edu.school} — {edu.location} — {edu.date}</Text>
                    <Text style={styles.text}>{edu.degree}</Text>
                    <Text style={styles.text}>{edu.details}</Text>
                  </View>
                ))}
                <View style={styles.separator} />
              </View>
            )}
            {cvData.experience.filter(e => e.company.trim()).length > 0 && (
              <View>
                <Text style={[styles.sectionHeader, { color: themeColor }, customStyle]}>Experience</Text>
                {cvData.experience.filter(e => e.company.trim()).map((exp, index) => (
                  <View key={index} style={{ marginBottom: 8 }}>
                    <Text style={styles.text}>{exp.company.toUpperCase()} {exp.location ? `— ${exp.location}` : ''} {exp.date ? `(${exp.date})` : ''}</Text>
                    <Text style={styles.text}>{exp.role}</Text>
                    <Text style={styles.text}>{exp.description}</Text>
                    {exp.achievements.filter(a => a.trim()).length > 0 && (
                      <View>
                        <Text style={[styles.sectionHeader, { color: themeColor, fontSize: 10 }, customStyle]}>Achievements</Text>
                        {exp.achievements.filter(a => a.trim()).map((ach, achIndex) => (
                          <Text key={achIndex} style={styles.bulletText}>• {ach}</Text>
                        ))}
                      </View>
                    )}
                  </View>
                ))}
                <View style={styles.separator} />
              </View>
            )}
            {cvData.skills.filter(s => s.trim()).length > 0 && (
              <View>
                <Text style={[styles.sectionHeader, { color: themeColor }, customStyle]}>Skills</Text>
                <View style={styles.twoColumn}>
                  <View style={styles.column}>
                    {cvData.skills.filter(s => s.trim()).slice(0, Math.ceil(cvData.skills.length / 2)).map((skill, index) => (
                      <Text key={index} style={styles.bulletText}>• {skill}</Text>
                    ))}
                  </View>
                  <View style={styles.column}>
                    {cvData.skills.filter(s => s.trim()).slice(Math.ceil(cvData.skills.length / 2)).map((skill, index) => (
                      <Text key={index} style={styles.bulletText}>• {skill}</Text>
                    ))}
                  </View>
                </View>
                <View style={styles.separator} />
              </View>
            )}
            {cvData.certifications.filter(c => c.trim()).length > 0 && (
              <View>
                <Text style={[styles.sectionHeader, { color: themeColor }, customStyle]}>Certifications</Text>
                <View style={styles.twoColumn}>
                  <View style={styles.column}>
                    {cvData.certifications.filter(c => c.trim()).slice(0, Math.ceil(cvData.certifications.length / 2)).map((cert, index) => (
                      <Text key={index} style={styles.bulletText}>• {cert}</Text>
                    ))}
                  </View>
                  <View style={styles.column}>
                    {cvData.certifications.filter(c => c.trim()).slice(Math.ceil(cvData.certifications.length / 2)).map((cert, index) => (
                      <Text key={index} style={styles.bulletText}>• {cert}</Text>
                    ))}
                  </View>
                </View>
                <View style={styles.separator} />
              </View>
            )}
            {cvData.projects.filter(p => p.trim()).length > 0 && (
              <View>
                <Text style={[styles.sectionHeader, { color: themeColor }, customStyle]}>Projects</Text>
                {cvData.projects.filter(p => p.trim()).map((proj, index) => (
                  <Text key={index} style={styles.bulletText}>• {proj}</Text>
                ))}
              </View>
            )}
          </View>
        )}
      </Page>
    </Document>
  );
}