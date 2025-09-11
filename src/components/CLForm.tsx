'use client';
import { useEffect, useState } from 'react';
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

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', jobTitle: '', companyName: '', hiringManagerName: '', companyAddress: '', cityStateZip: '', body: '' };

    if (!localData.name || !localData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!localData.email || !emailRegex.test(localData.email)) {
      newErrors.email = 'Valid email is required';
      isValid = false;
    }
    if (!localData.jobTitle || !localData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
      isValid = false;
    }
    if (!localData.companyName || !localData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
      isValid = false;
    }
    if (!localData.hiringManagerName || !localData.hiringManagerName.trim()) {
      newErrors.hiringManagerName = 'Hiring manager name is required';
      isValid = false;
    }
    if (!localData.companyAddress || !localData.companyAddress.trim()) {
      newErrors.companyAddress = 'Company address is required';
      isValid = false;
    }
    if (!localData.cityStateZip || !localData.cityStateZip.trim()) {
      newErrors.cityStateZip = 'City, State, ZIP is required';
      isValid = false;
    }
    if (localData.bodyParagraphs.length === 0) {
      newErrors.body = 'At least one body paragraph is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    setCLData(localData);
    validateForm();
  }, [localData, setCLData, validateForm]);

  const handleChange = (field: keyof CLData, value: string) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handleBodyChange = (index: number, value: string) => {
    const updated = [...localData.bodyParagraphs];
    updated[index] = value;
    setLocalData(prev => ({ ...prev, bodyParagraphs: updated }));
  };

  const addBodyParagraph = () => {
    setLocalData(prev => ({ ...prev, bodyParagraphs: [...prev.bodyParagraphs, ''] }));
  };

  const removeBodyParagraph = (index: number) => {
    const updated = [...localData.bodyParagraphs];
    updated.splice(index, 1);
    setLocalData(prev => ({ ...prev, bodyParagraphs: updated }));
  };

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <form className="space-y-8 w-full">
      <Section title="Header" isCollapsed={collapsedSections.header} onToggle={() => toggleSection('header')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="relative mb-6">
            <Input
              label="Full Name"
              value={localData.name}
              placeholder="e.g., John Doe"
              onChange={(e) => handleChange('name', e.target.value)}
              className={errors.name ? 'border-red-500' : localData.name.trim() ? 'border-green-500' : ''}
            />
            {errors.name && (
              <div className="absolute -bottom-5 left-0 flex items-center text-red-500 text-xs">
                <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                {errors.name}
              </div>
            )}
            {localData.name.trim() && !errors.name && (
              <CheckIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
          </div>
          <Input
            label="Address or City, State"
            value={localData.address}
            placeholder="e.g., London, UK or 123 Main St, London, UK"
            onChange={(e) => handleChange('address', e.target.value)}
          />
          <div className="relative mb-6">
            <Input
              label="Email"
              type="email"
              value={localData.email}
              placeholder="e.g., john.doe@example.com"
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors.email ? 'border-red-500' : localData.email.trim() ? 'border-green-500' : ''}
            />
            {errors.email && (
              <div className="absolute -bottom-5 left-0 flex items-center text-red-500 text-xs">
                <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                {errors.email}
              </div>
            )}
            {localData.email.trim() && !errors.email && (
              <CheckIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
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

      <Section title="Hiring Manager Info" isCollapsed={collapsedSections.hiringManager} onToggle={() => toggleSection('hiringManager')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="relative mb-6">
            <Input
              label="Hiring Manager’s Name"
              value={localData.hiringManagerName}
              placeholder="e.g., Ms. Emily Carter"
              onChange={(e) => handleChange('hiringManagerName', e.target.value)}
              className={errors.hiringManagerName ? 'border-red-500' : localData.hiringManagerName.trim() ? 'border-green-500' : ''}
            />
            {errors.hiringManagerName && (
              <div className="absolute -bottom-5 left-0 flex items-center text-red-500 text-xs">
                <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                {errors.hiringManagerName}
              </div>
            )}
            {localData.hiringManagerName.trim() && !errors.hiringManagerName && (
              <CheckIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
          </div>
          <div className="relative mb-6">
            <Input
              label="Company Name"
              value={localData.companyName}
              placeholder="e.g., TechCorp Innovations"
              onChange={(e) => handleChange('companyName', e.target.value)}
              className={errors.companyName ? 'border-red-500' : localData.companyName.trim() ? 'border-green-500' : ''}
            />
            {errors.companyName && (
              <div className="absolute -bottom-5 left-0 flex items-center text-red-500 text-xs">
                <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                {errors.companyName}
              </div>
            )}
            {localData.companyName.trim() && !errors.companyName && (
              <CheckIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
          </div>
          <div className="relative mb-6">
            <Input
              label="Company Address"
              value={localData.companyAddress}
              placeholder="e.g., 123 Tech St"
              onChange={(e) => handleChange('companyAddress', e.target.value)}
              className={errors.companyAddress ? 'border-red-500' : localData.companyAddress.trim() ? 'border-green-500' : ''}
            />
            {errors.companyAddress && (
              <div className="absolute -bottom-5 left-0 flex items-center text-red-500 text-xs">
                <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                {errors.companyAddress}
              </div>
            )}
            {localData.companyAddress.trim() && !errors.companyAddress && (
              <CheckIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
          </div>
          <div className="relative mb-6">
            <Input
              label="City, State, ZIP"
              value={localData.cityStateZip}
              placeholder="e.g., London, UK, W1A 1AA"
              onChange={(e) => handleChange('cityStateZip', e.target.value)}
              className={errors.cityStateZip ? 'border-red-500' : localData.cityStateZip.trim() ? 'border-green-500' : ''}
            />
            {errors.cityStateZip && (
              <div className="absolute -bottom-5 left-0 flex items-center text-red-500 text-xs">
                <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                {errors.cityStateZip}
              </div>
            )}
            {localData.cityStateZip.trim() && !errors.cityStateZip && (
              <CheckIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
            )}
          </div>
        </div>
      </Section>

      <Section title="Job Information" isCollapsed={collapsedSections.intro} onToggle={() => toggleSection('intro')}>
        <div className="relative mb-6">
          <Input
            label="Job Title"
            value={localData.jobTitle}
            placeholder="e.g., Senior Software Engineer"
            onChange={(e) => handleChange('jobTitle', e.target.value)}
            className={errors.jobTitle ? 'border-red-500' : localData.jobTitle.trim() ? 'border-green-500' : ''}
          />
          {errors.jobTitle && (
            <div className="absolute -bottom-5 left-0 flex items-center text-red-500 text-xs">
              <ExclamationCircleIcon className="w-4 h-4 mr-1" />
              {errors.jobTitle}
            </div>
          )}
          {localData.jobTitle.trim() && !errors.jobTitle && (
            <CheckIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
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
          <div key={i} className="mb-4">
            <Textarea
              label={`Body Paragraph ${i + 1}`}
              value={paragraph}
              placeholder="e.g., In my role at [Company], I: Developed [Project], improving [Metric] by [Percentage]. Add specific achievements to showcase your skills."
              onChange={(e) => handleBodyChange(i, e.target.value)}
            />
            <Button type="button" className="bg-red-600 hover:bg-red-700 mt-2" onClick={() => removeBodyParagraph(i)}>
              Remove Paragraph
            </Button>
          </div>
        ))}
        {errors.body && localData.bodyParagraphs.length === 0 && (
          <div className="text-red-500 text-xs flex items-center mt-2 mb-2">
            <ExclamationCircleIcon className="w-4 h-4 mr-1" />
            {errors.body}
          </div>
        )}
        <Button type="button" onClick={addBodyParagraph}>+ Add Body Paragraph</Button>
      </Section>

      <Section title="Excitement Paragraph" isCollapsed={collapsedSections.excitement} onToggle={() => toggleSection('excitement')}>
        <Textarea
          label="Excitement Paragraph"
          value={localData.excitement}
          placeholder="e.g., I am excited about [Company]’s focus on [Value], especially [Initiative], and eager to contribute my expertise in [Skill]."
          onChange={(e) => handleChange('excitement', e.target.value)}
        />
      </Section>

      <Section title="Thank You Paragraph" isCollapsed={collapsedSections.thankYou} onToggle={() => toggleSection('thankYou')}>
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
          placeholder="e.g., Sincerely, followed by your name and email on new lines (e.g., Sincerely,\n\nJohn Doe\njohn.doe@example.com)."
          onChange={(e) => handleChange('closing', e.target.value)}
        />
      </Section>

      <Button
        type="button"
        className="w-full mt-4 bg-gray-600 hover:bg-gray-700"
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