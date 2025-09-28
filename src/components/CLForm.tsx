'use client';
import { useEffect, useMemo, useState } from 'react';
import { CLData, EMPTY_CL } from '@/lib/types';
import Section from './Section';
import Input from './Input';
import Textarea from './Textarea';
import Button from './Button';
import { CheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface CLFormProps {
  clData: CLData;
  setCLData: (data: CLData) => void;
}

function shallowEqualErrors(
  a: Record<string, string>,
  b: Record<string, string>
) {
  const ak = Object.keys(a);
  const bk = Object.keys(b);
  if (ak.length !== bk.length) return false;
  for (const k of ak) if (a[k] !== b[k]) return false;
  return true;
}

export default function CLForm({ clData, setCLData }: CLFormProps) {
  const [localData, setLocalData] = useState<CLData>(clData);
  const [collapsedSections, setCollapsedSections] = useState({
    header: false,
    date: false,
    hiringManager: false,
    intro: false,
    body: false,
    excitement: false,
    thankYou: false,
    closing: false,
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    jobTitle: '',
    companyName: '',
    hiringManagerName: '',
    companyAddress: '',
    cityStateZip: '',
    body: '',
  });

  useEffect(() => {
    setLocalData(clData);
  }, [clData]);

  const computedErrors = useMemo(() => {
    const next = {
      name: '',
      email: '',
      jobTitle: '',
      companyName: '',
      hiringManagerName: '',
      companyAddress: '',
      cityStateZip: '',
      body: '',
    };

    if (!localData.name || !localData.name.trim()) next.name = 'Name is required';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!localData.email || !emailRegex.test(localData.email)) next.email = 'Valid email is required';

    if (!localData.jobTitle || !localData.jobTitle.trim()) next.jobTitle = 'Job title is required';
    if (!localData.companyName || !localData.companyName.trim()) next.companyName = 'Company name is required';
    if (!localData.hiringManagerName || !localData.hiringManagerName.trim()) next.hiringManagerName = 'Hiring manager name is required';
    if (!localData.companyAddress || !localData.companyAddress.trim()) next.companyAddress = 'Company address is required';
    if (!localData.cityStateZip || !localData.cityStateZip.trim()) next.cityStateZip = 'City, State, ZIP is required';

    if (localData.bodyParagraphs.length === 0) next.body = 'At least one body paragraph is required';

    return next;
  }, [localData]);

  useEffect(() => {
    setErrors((prev) => (shallowEqualErrors(prev, computedErrors) ? prev : computedErrors));
  }, [computedErrors]);

  useEffect(() => {
    setCLData(localData);
  }, [localData, setCLData]);

  const handleChange = (field: keyof CLData, value: string) => {
    setLocalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleBodyChange = (index: number, value: string) => {
    const updated = [...localData.bodyParagraphs];
    updated[index] = value;
    setLocalData((prev) => ({ ...prev, bodyParagraphs: updated }));
  };

  const addBodyParagraph = () => {
    setLocalData((prev) => ({ ...prev, bodyParagraphs: [...prev.bodyParagraphs, ''] }));
  };

  const removeBodyParagraph = (index: number) => {
    const updated = [...localData.bodyParagraphs];
    updated.splice(index, 1);
    setLocalData((prev) => ({ ...prev, bodyParagraphs: updated }));
  };

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const hintErr = 'text-[11px]';

  return (
    <form className="space-y-6 sm:space-y-7 w-full">
      <Section title="Header" isCollapsed={collapsedSections.header} onToggle={() => toggleSection('header')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="relative mb-5 min-w-0">
            <Input
              label="Full Name"
              value={localData.name}
              placeholder="e.g., John Doe"
              onChange={(e) => handleChange('name', e.target.value)}
              className={errors.name ? 'border-red-500' : localData.name.trim() ? 'border-green-500' : ''}
            />
            {errors.name && (
              <div className={`absolute -bottom-5 left-0 flex items-center text-red-500 ${hintErr}`}>
                <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                {errors.name}
              </div>
            )}
            {localData.name.trim() && !errors.name && (
              <CheckIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
          </div>
          <Input
            label="Address or City, State"
            value={localData.address}
            placeholder="e.g., London, UK or 123 Main St, London, UK"
            onChange={(e) => handleChange('address', e.target.value)}
          />
          <div className="relative mb-5 min-w-0">
            <Input
              label="Email"
              type="email"
              value={localData.email}
              placeholder="e.g., john.doe@example.com"
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors.email ? 'border-red-500' : localData.email.trim() ? 'border-green-500' : ''}
            />
            {errors.email && (
              <div className={`absolute -bottom-5 left-0 flex items-center text-red-500 ${hintErr}`}>
                <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                {errors.email}
              </div>
            )}
            {localData.email.trim() && !errors.email && (
              <CheckIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
          </div>
          <Input
            label="Phone Number (Optional)"
            value={localData.phone}
            placeholder="e.g., 07812345678 (if applicable)"
            onChange={(e) => handleChange('phone', e.target.value)}
          />
          <Input
            label="LinkedIn (Optional)"
            value={localData.linkedin}
            placeholder="e.g., linkedin.com/in/johndoe (if applicable)"
            onChange={(e) => handleChange('linkedin', e.target.value)}
          />
          <Input
            label="Portfolio/Website (Optional)"
            value={localData.portfolio}
            placeholder="e.g., johndoe.dev (if applicable)"
            onChange={(e) => handleChange('portfolio', e.target.value)}
          />
        </div>
      </Section>

      <Section title="Date" isCollapsed={collapsedSections.date} onToggle={() => toggleSection('date')}>
        <Input
          label="Date"
          value={localData.date || new Date().toLocaleDateString('en-GB')}
          placeholder="e.g., September 03, 2025 (auto-filled if left blank)"
          onChange={(e) => handleChange('date', e.target.value)}
        />
      </Section>

      <Section
        title="Hiring Manager Info"
        isCollapsed={collapsedSections.hiringManager}
        onToggle={() => toggleSection('hiringManager')}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="relative mb-5 min-w-0">
            <Input
              label="Hiring Manager’s Name"
              value={localData.hiringManagerName}
              placeholder="e.g., Ms. Emily Carter"
              onChange={(e) => handleChange('hiringManagerName', e.target.value)}
              className={errors.hiringManagerName ? 'border-red-500' : localData.hiringManagerName.trim() ? 'border-green-500' : ''}
            />
            {errors.hiringManagerName && (
              <div className={`absolute -bottom-5 left-0 flex items-center text-red-500 ${hintErr}`}>
                <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                {errors.hiringManagerName}
              </div>
            )}
            {localData.hiringManagerName.trim() && !errors.hiringManagerName && (
              <CheckIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
          </div>
          <div className="relative mb-5 min-w-0">
            <Input
              label="Company Name"
              value={localData.companyName}
              placeholder="e.g., TechCorp Innovations"
              onChange={(e) => handleChange('companyName', e.target.value)}
              className={errors.companyName ? 'border-red-500' : localData.companyName.trim() ? 'border-green-500' : ''}
            />
            {errors.companyName && (
              <div className={`absolute -bottom-5 left-0 flex items-center text-red-500 ${hintErr}`}>
                <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                {errors.companyName}
              </div>
            )}
            {localData.companyName.trim() && !errors.companyName && (
              <CheckIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
          </div>
          <div className="relative mb-5 min-w-0">
            <Input
              label="Company Address"
              value={localData.companyAddress}
              placeholder="e.g., 123 Tech St"
              onChange={(e) => handleChange('companyAddress', e.target.value)}
              className={errors.companyAddress ? 'border-red-500' : localData.companyAddress.trim() ? 'border-green-500' : ''}
            />
            {errors.companyAddress && (
              <div className={`absolute -bottom-5 left-0 flex items-center text-red-500 ${hintErr}`}>
                <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                {errors.companyAddress}
              </div>
            )}
            {localData.companyAddress.trim() && !errors.companyAddress && (
              <CheckIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
          </div>
          <div className="relative mb-5 min-w-0">
            <Input
              label="City, State, ZIP"
              value={localData.cityStateZip}
              placeholder="e.g., London, UK, W1A 1AA"
              onChange={(e) => handleChange('cityStateZip', e.target.value)}
              className={errors.cityStateZip ? 'border-red-500' : localData.cityStateZip.trim() ? 'border-green-500' : ''}
            />
            {errors.cityStateZip && (
              <div className={`absolute -bottom-5 left-0 flex items-center text-red-500 ${hintErr}`}>
                <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                {errors.cityStateZip}
              </div>
            )}
            {localData.cityStateZip.trim() && !errors.cityStateZip && (
              <CheckIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
          </div>
        </div>
      </Section>

      <Section title="Job Information" isCollapsed={collapsedSections.intro} onToggle={() => toggleSection('intro')}>
        <div className="relative mb-5 min-w-0">
          <Input
            label="Job Title"
            value={localData.jobTitle}
            placeholder="e.g., Senior Software Engineer"
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            className={errors.jobTitle ? 'border-red-500' : localData.jobTitle.trim() ? 'border-green-500' : ''}
          />
          {errors.jobTitle && (
            <div className={`absolute -bottom-5 left-0 flex items-center text-red-500 ${hintErr}`}>
              <ExclamationCircleIcon className="w-4 h-4 mr-1" />
              {errors.jobTitle}
            </div>
          )}
          {localData.jobTitle.trim() && !errors.jobTitle && (
            <CheckIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
          )}
        </div>
      </Section>

      <Section title="Intro Paragraph" isCollapsed={collapsedSections.intro} onToggle={() => toggleSection('intro')}>
        <Textarea
          label="Intro Paragraph"
          value={localData.intro}
          placeholder="e.g., I am writing to express my interest in the [Job Title] position at [Company Name], leveraging my skills in [Core Skill] to contribute to your mission."
          onChange={(e) => handleChange('intro', e.target.value)}
        />
      </Section>

      <Section title="Body Paragraphs" isCollapsed={collapsedSections.body} onToggle={() => toggleSection('body')}>
        {localData.bodyParagraphs.map((paragraph, i) => (
          <div key={i} className="mb-3">
            <Textarea
              label={`Body Paragraph ${i + 1}`}
              value={paragraph}
              placeholder="e.g., In my role at [Company], I: Developed [Project], improving [Metric] by [Percentage]. Add specific achievements to showcase your skills."
              onChange={(e) => handleBodyChange(i, e.target.value)}
            />
            <Button type="button" size="sm" className="bg-red-600 hover:bg-red-700 mt-2" onClick={() => removeBodyParagraph(i)}>
              Remove Paragraph
            </Button>
          </div>
        ))}
        {errors.body && localData.bodyParagraphs.length === 0 && (
          <div className={`text-red-500 ${hintErr} flex items-center mt-2 mb-2`}>
            <ExclamationCircleIcon className="w-4 h-4 mr-1" />
            {errors.body}
          </div>
        )}
        <Button type="button" size="sm" onClick={addBodyParagraph}>
          + Add Body Paragraph
        </Button>
      </Section>

      <Section
        title="Excitement Paragraph"
        isCollapsed={collapsedSections.excitement}
        onToggle={() => toggleSection('excitement')}
      >
        <Textarea
          label="Excitement Paragraph"
          value={localData.excitement}
          placeholder="e.g., I am excited about [Company]’s focus on [Value], especially [Initiative], and eager to contribute my expertise in [Skill]."
          onChange={(e) => handleChange('excitement', e.target.value)}
        />
      </Section>

      <Section
        title="Thank You Paragraph"
        isCollapsed={collapsedSections.thankYou}
        onToggle={() => toggleSection('thankYou')}
      >
        <Textarea
          label="Thank You Paragraph"
          value={localData.thankYou}
          placeholder="e.g., Thank you for considering my application. I look forward to discussing my contributions to [Company]."
          onChange={(e) => handleChange('thankYou', e.target.value)}
        />
      </Section>

      <Section title="Closing" isCollapsed={collapsedSections.closing} onToggle={() => toggleSection('closing')}>
        <Textarea
          label="Closing"
          value={localData.closing || `Sincerely,\n\n${localData.name}\n${localData.email}`}
          placeholder={`e.g., Sincerely,\n\nJohn Doe\njohn.doe@example.com`}
          onChange={(e) => handleChange('closing', e.target.value)}
        />
      </Section>

      <Button
        type="button"
        size="sm"
        className="w-full mt-3 bg-gray-600 hover:bg-gray-700"
        onClick={() => {
          localStorage.removeItem('clData');
          setLocalData(EMPTY_CL);
        }}
      >
        Reset Cover Letter
      </Button>
    </form>
  );
}
