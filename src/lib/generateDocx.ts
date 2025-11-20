// src/lib/generateDocx.ts
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  BorderStyle,
} from 'docx';
import { saveAs } from 'file-saver';
import type { CVData } from '@/lib/types';

const themes = {
  blue: '#1d4ed8',
  emerald: '#047857',
  violet: '#7c3aed',
  orange: '#ea580c',
} as const;

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const generateDocx = async (data: CVData) => {
  const themeColor = themes[data.theme as keyof typeof themes] || '#1d4ed8';

  const contact = [
    data.location,
    data.phone,
    data.email,
    data.linkedin?.replace(/^https?:\/\//i, ''),
    data.portfolio?.replace(/^https?:\/\//i, ''),
  ].filter(Boolean).join(' • ');

  // Text styles
  const name = () => new TextRun({ text: data.name || 'Your Name', bold: true, size: 46, color: themeColor });
  const sectionHeader = (text: string) =>
    new TextRun({ text: text.toUpperCase(), bold: true, size: 30, color: themeColor });
  const role = (text: string) =>
    new TextRun({ text, bold: true, italics: true, size: 22, color: themeColor, underline: {} });
  const companyLine = (text: string) =>
    new TextRun({ text, bold: true, size: 26 }); // ← 2pt bigger than role
  const eduLine = (text: string) =>
    new TextRun({ text, bold: true, size: 24 });
  const body = (text: string) => new TextRun({ text, size: 22 });
  const subtle = (text: string) => new TextRun({ text, size: 22, bold: true, color: '666666' });
  const bullet = (text: string) =>
    new Paragraph({
      children: [new TextRun({ text: '• ', color: themeColor, bold: true }), body(text)],
      indent: { left: 520 },
      spacing: { after: 40 },
    });

  // Section header + divider in ONE paragraph → zero gap bug
  const sectionWithDivider = (title: string) =>
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [sectionHeader(title)],
      spacing: { after: 240 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: themeColor } },
    });

  const sections: Paragraph[] = [];

// PERSONAL INFO — TIGHT, NO GAP, DIVIDER AFTER
  sections.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [name()],
      spacing: { after: 0 }, // Tight to contact
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [subtle(contact)],
      spacing: { after: 0 }, // Space only before divider
    }),
    // Divider immediately after contact
    new Paragraph({
      spacing: { after: 2 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 2, color: themeColor } },
    })
  );

  // PROFESSIONAL SUMMARY
  if (data.summary?.trim()) {
    sections.push(sectionWithDivider('Professional Summary'));
    sections.push(
      new Paragraph({
        children: [body(data.summary)],
        alignment: AlignmentType.JUSTIFIED,
        spacing: { after: 300 },
      })
    );
  }

  // EDUCATION
  if (data.education.length > 0) {
    sections.push(sectionWithDivider('Education'));
    data.education.forEach((edu) => {
      const line = `${edu.degree}; ${edu.school}, ${edu.location}; ${edu.date || ''}`;
      sections.push(
        new Paragraph({
          children: [eduLine(line)],
          spacing: { after: 80 },
        })
      );
      if (edu.details?.trim()) {
        sections.push(
          new Paragraph({
            children: [body(edu.details)],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 200 },
          })
        );
      }
    });
  }

  // PROFESSIONAL EXPERIENCE
  if (data.experience.length > 0) {
    sections.push(sectionWithDivider('Professional Experience'));
    data.experience.forEach((exp, i) => {
      const companyName = capitalize(exp.company.trim());
      const headerLine = `${companyName}; ${exp.location || ''}; ${exp.date || ''}`
        .replace(/; ;/g, ';')
        .replace(/;$/, '')
        .trim();

      sections.push(
        new Paragraph({
          children: [companyLine(headerLine)],
          spacing: { after: 100 },
        }),
        new Paragraph({
          children: [role(exp.role)],
          spacing: { after: 150 },
        })
      );

      if (exp.description?.trim()) {
        sections.push(
          new Paragraph({
            children: [body(exp.description)],
            alignment: AlignmentType.JUSTIFIED,
            spacing: { after: 150 },
          })
        );
      }

      if (exp.achievements?.filter(Boolean).length) {
        sections.push(
          new Paragraph({
            children: [role('Key Achievements')],
            spacing: { before: 150, after: 100 },
          })
        );
        exp.achievements.filter(Boolean).forEach((ach) => sections.push(bullet(ach)));
      }

      if (i < data.experience.length - 1) {
        sections.push(new Paragraph({ spacing: { after: 300 } }));
      }
    });
  }

  // SKILLS
  if (data.skills.filter(Boolean).length > 0) {
    sections.push(sectionWithDivider('Skills'));
    data.skills.filter(Boolean).forEach((s) => sections.push(bullet(s)));
  }

  // CERTIFICATIONS
  if (data.certifications.filter(Boolean).length > 0) {
    sections.push(sectionWithDivider('Certifications'));
    data.certifications.filter(Boolean).forEach((c) => sections.push(bullet(c)));
  }

  // PROJECTS
  if (data.projects.filter(Boolean).length > 0) {
    sections.push(sectionWithDivider('Projects'));
    data.projects.filter(Boolean).forEach((p) => sections.push(bullet(p)));
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: 'Calibri', size: 22 },
          paragraph: { spacing: { line: 340 }, alignment: AlignmentType.JUSTIFIED },
        },
      },
    },
    sections: [{
      properties: { page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } } },
      children: sections,
    }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${(data.name || 'Resume').replace(/\s+/g, '_')}_CV.docx`);
};