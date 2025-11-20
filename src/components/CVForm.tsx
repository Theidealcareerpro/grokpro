'use client';
import { ChangeEvent, useEffect, useState } from 'react';
import { CVData, EducationEntry, ExperienceEntry, Theme, FontChoice, EMPTY_CV } from '@/lib/types';
import Section from './Section';
import Input from './Input';
import Textarea from './Textarea';
import Button from './Button';
import { CheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

interface CVFormProps {
  cvData: CVData;
  setCVData: (data: CVData) => void;
}

export default function CVForm({ cvData, setCVData }: CVFormProps) {
  const [localData, setLocalData] = useState<CVData>(cvData);
  const [collapsedSections, setCollapsedSections] = useState({
    personal: false,
    education: false,
    experience: false,
    skills: false,
    certifications: false,
    projects: false,
    customization: false,
  });
  const [errors, setErrors] = useState<{
    name: string;
    email: string;
    phone: string;
    education: string[];
    experience: string[];
  }>({
    name: '',
    email: '',
    phone: '',
    education: Array(cvData.education.length).fill(''),
    experience: Array(cvData.experience.length).fill(''),
  });

  useEffect(() => {
    setCVData(localData);
    validateForm();
  }, [localData, setCVData]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', phone: '', education: [...errors.education], experience: [...errors.experience] };

    if (!localData.name || !localData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!localData.email || !emailRegex.test(localData.email)) {
      newErrors.email = 'Valid email is required';
      isValid = false;
    }

    const phoneRegex = /^(\+44|0)7\d{9}$/;
    if (localData.phone && !phoneRegex.test(localData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Valid UK phone number required (e.g., 07123456789 or +447123456789)';
      isValid = false;
    }

    if (localData.education.length === 0) {
      newErrors.education = ['At least one education entry is required'];
      isValid = false;
    } else {
      newErrors.education = localData.education.map((edu) => {
        const eduErrors = [];
        if (!edu.school || !edu.school.trim()) eduErrors.push('School is required');
        if (!edu.degree || !edu.degree.trim()) eduErrors.push('Degree is required');
        return eduErrors.length ? eduErrors.join(', ') : '';
      });
      if (newErrors.education.some(error => error)) isValid = false;
    }

    if (localData.experience.length === 0) {
      newErrors.experience = ['At least one experience entry is required'];
      isValid = false;
    } else {
      newErrors.experience = localData.experience.map((exp) => {
        const expErrors: string[] = [];
        if (!exp.company || !exp.company.trim()) expErrors.push('Company is required');
        if (!exp.role || !exp.role.trim()) expErrors.push('Role is required');
        return expErrors.length ? expErrors.join(', ') : '';
      });
      if (newErrors.experience.some(error => error)) isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (field: keyof CVData, value: string) => {
    setLocalData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'theme' && !['blue', 'emerald', 'rose', 'black', 'orange'].includes(value as Theme)) {
        updated.theme = 'blue';
      }
      if (field === 'font' && !['Helvetica', 'Roboto', 'Times'].includes(value as FontChoice)) {
        updated.font = 'Helvetica';
      }
      return updated;
    });
  };

  const handleEducationChange = (i: number, field: keyof EducationEntry, value: string) => {
    const updated = [...localData.education];
    updated[i] = { ...updated[i], [field]: value };
    setLocalData(prev => ({ ...prev, education: updated }));
  };

  const handleExperienceChange = (i: number, field: keyof ExperienceEntry, value: string) => {
    const updated = [...localData.experience];
    updated[i] = { ...updated[i], [field]: value };
    setLocalData(prev => ({ ...prev, experience: updated }));
  };

  const handleAchievementChange = (expIndex: number, achIndex: number, value: string) => {
    const updated = [...localData.experience];
    const exp = updated[expIndex];
    const achievements = [...exp.achievements];
    achievements[achIndex] = value;
    updated[expIndex] = { ...exp, achievements };
    setLocalData(prev => ({ ...prev, experience: updated }));
  };

  const handleListChange = (e: ChangeEvent<HTMLInputElement>, field: 'skills' | 'certifications' | 'projects', index: number) => {
    const updatedList = [...localData[field]];
    updatedList[index] = e.target.value;
    setLocalData(prev => ({ ...prev, [field]: updatedList }));
  };

  const addEducation = () => {
    const updated = [...localData.education, { school: '', degree: '', location: '', date: '', details: '' }];
    setLocalData(prev => ({ ...prev, education: updated }));
    setErrors(prev => ({ ...prev, education: [...prev.education, ''] }));
  };

  const addExperience = () => {
    const updated = [...localData.experience, { company: '', location: '', date: '', role: '', description: '', achievements: [''] }];
    setLocalData(prev => ({ ...prev, experience: updated }));
    setErrors(prev => ({ ...prev, experience: [...prev.experience, ''] }));
  };

  const addAchievement = (expIndex: number) => {
    const updated = [...localData.experience];
    updated[expIndex] = { ...updated[expIndex], achievements: [...updated[expIndex].achievements, ''] };
    setLocalData(prev => ({ ...prev, experience: updated }));
  };

  const addListItem = (field: 'skills' | 'certifications' | 'projects') => {
    setLocalData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeEducation = (index: number) => {
    const updated = [...localData.education];
    updated.splice(index, 1);
    setLocalData(prev => ({ ...prev, education: updated }));
    const newErrors = [...errors.education];
    newErrors.splice(index, 1);
    setErrors(prev => ({ ...prev, education: newErrors }));
  };

  const removeExperience = (index: number) => {
    const updated = [...localData.experience];
    updated.splice(index, 1);
    setLocalData(prev => ({ ...prev, experience: updated }));
    const newErrors = [...errors.experience];
    newErrors.splice(index, 1);
    setErrors(prev => ({ ...prev, experience: newErrors }));
  };

  const removeAchievement = (expIndex: number, achIndex: number) => {
    const updated = [...localData.experience];
    const achievements = [...updated[expIndex].achievements];
    achievements.splice(achIndex, 1);
    updated[expIndex] = { ...updated[expIndex], achievements };
    setLocalData(prev => ({ ...prev, experience: updated }));
  };

  const removeListItem = (field: 'skills' | 'certifications' | 'projects', index: number) => {
    const updatedList = [...localData[field]];
    updatedList.splice(index, 1);
    setLocalData(prev => ({ ...prev, [field]: updatedList }));
  };

  const toggleSection = (section: keyof typeof collapsedSections) => {
    setCollapsedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const hintErr = 'text-[11px]';

  return (
    <form className="space-y-6 sm:space-y-7 w-full">
      <Section title="Personal Information" isCollapsed={collapsedSections.personal} onToggle={() => toggleSection('personal')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 mb-5">
          <div className="relative min-w-0">
            <Input
              label="Name"
              value={localData.name}
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
          <div className="relative min-w-0">
            <Input
              label="Email"
              type="email"
              value={localData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors.email ? 'border-red-500' : localData.email && !errors.email ? 'border-green-500' : ''}
            />
            {errors.email && (
              <div className={`absolute -bottom-5 left-0 flex items-center text-red-500 ${hintErr}`}>
                <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                {errors.email}
              </div>
            )}
            {localData.email && !errors.email && (
              <CheckIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
          </div>
          <div className="relative min-w-0">
            <Input
              label="Phone"
              value={localData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              className={errors.phone ? 'border-red-500' : localData.phone && !errors.phone ? 'border-green-500' : ''}
            />
            {errors.phone && (
              <div className={`absolute -bottom-5 left-0 flex items-center text-red-500 ${hintErr}`}>
                <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                {errors.phone}
              </div>
            )}
            {localData.phone && !errors.phone && (
              <CheckIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
            )}
          </div>
          <div className="min-w-0">
            <Input label="Location" value={localData.location} onChange={(e) => handleChange('location', e.target.value)} />
          </div>
          <div className="min-w-0">
            <Input label="LinkedIn" value={localData.linkedin} onChange={(e) => handleChange('linkedin', e.target.value)} />
          </div>
          <div className="min-w-0">
            <Input label="Portfolio" value={localData.portfolio} onChange={(e) => handleChange('portfolio', e.target.value)} />
          </div>
        </div>
        <Textarea label="Professional Summary" value={localData.summary} onChange={(e) => handleChange('summary', e.target.value)} />
      </Section>

      {/* EDUCATION */}
      <Section title="Education" isCollapsed={collapsedSections.education} onToggle={() => toggleSection('education')}>
        {localData.education.map((edu, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 border rounded p-3 sm:p-4 min-w-0">
            <div className="relative min-w-0">
              <Input
                label="School"
                value={edu.school}
                onChange={(e) => handleEducationChange(i, 'school', e.target.value)}
                className={errors.education[i] ? 'border-red-500' : edu.school.trim() ? 'border-green-500' : ''}
              />
              {errors.education[i] && (
                <div className={`absolute -bottom-6 left-0 flex items-center text-red-500 ${hintErr}`}>
                  <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                  {errors.education[i]}
                </div>
              )}
              {edu.school.trim() && !errors.education[i] && (
                <CheckIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
              )}
            </div>

            <div className="relative min-w-0">
              <Input
                label="Degree"
                value={edu.degree}
                onChange={(e) => handleEducationChange(i, 'degree', e.target.value)}
                className={errors.education[i] ? 'border-red-500' : edu.degree.trim() ? 'border-green-500' : ''}
              />
              {errors.education[i] && (
                <div className={`absolute -bottom-6 left-0 flex items-center text-red-500 ${hintErr}`}>
                  <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                  {errors.education[i]}
                </div>
              )}
              {edu.degree.trim() && !errors.education[i] && (
                <CheckIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
              )}
            </div>

            <div className="min-w-0">
              <Input label="Location" value={edu.location} onChange={(e) => handleEducationChange(i, 'location', e.target.value)} />
            </div>
            <div className="min-w-0">
              <Input label="Date" value={edu.date} onChange={(e) => handleEducationChange(i, 'date', e.target.value)} />
            </div>

            <div className="min-w-0 sm:col-span-2">
              <Textarea label="Details" value={edu.details} onChange={(e) => handleEducationChange(i, 'details', e.target.value)} />
            </div>

            <div className="sm:col-span-2">
              <Button type="button" size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => removeEducation(i)}>
                Remove Education
              </Button>
            </div>
          </div>
        ))}
        {errors.education.length > 0 && errors.education[0] && (
          <div className={`text-red-500 ${hintErr} flex items-center mt-2 mb-2`}>
            <ExclamationCircleIcon className="w-4 h-4 mr-1" />
            {errors.education[0]}
          </div>
        )}
        <Button type="button" size="sm" onClick={addEducation}>+ Add Education</Button>
      </Section>

      {/* EXPERIENCE */}
      <Section title="Professional Experience" isCollapsed={collapsedSections.experience} onToggle={() => toggleSection('experience')}>
        {localData.experience.map((exp, i) => (
          <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5 border rounded p-3 sm:p-4 min-w-0">
            <div className="relative min-w-0">
              <Input
                label="Company"
                value={exp.company}
                onChange={(e) => handleExperienceChange(i, 'company', e.target.value)}
                className={errors.experience[i] ? 'border-red-500' : exp.company.trim() ? 'border-green-500' : ''}
              />
              {errors.experience[i] && (
                <div className={`absolute -bottom-6 left-0 flex items-center text-red-500 ${hintErr}`}>
                  <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                  {errors.experience[i]}
                </div>
              )}
              {exp.company.trim() && !errors.experience[i] && (
                <CheckIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
              )}
            </div>

            <div className="relative min-w-0">
              <Input
                label="Role"
                value={exp.role}
                onChange={(e) => handleExperienceChange(i, 'role', e.target.value)}
                className={errors.experience[i] ? 'border-red-500' : exp.role.trim() ? 'border-green-500' : ''}
              />
              {errors.experience[i] && (
                <div className={`absolute -bottom-6 left-0 flex items-center text-red-500 ${hintErr}`}>
                  <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                  {errors.experience[i]}
                </div>
              )}
              {exp.role.trim() && !errors.experience[i] && (
                <CheckIcon className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
              )}
            </div>

            <div className="min-w-0">
              <Input label="Location" value={exp.location} onChange={(e) => handleExperienceChange(i, 'location', e.target.value)} />
            </div>
            <div className="min-w-0">
              <Input label="Date" value={exp.date} onChange={(e) => handleExperienceChange(i, 'date', e.target.value)} />
            </div>

            <div className="min-w-0 sm:col-span-2">
              <Textarea label="Description" value={exp.description} onChange={(e) => handleExperienceChange(i, 'description', e.target.value)} />
            </div>

            <div className="min-w-0 sm:col-span-2">
              <p className="text-[13px] font-medium text-gray-700">Key Achievements</p>
              {exp.achievements.map((ach, j) => (
                <div key={j} className="flex gap-2 mt-1">
                  <Input label={`Achievement ${j + 1}`} value={ach} onChange={(e) => handleAchievementChange(i, j, e.target.value)} />
                  <Button type="button" size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => removeAchievement(i, j)}>-</Button>
                </div>
              ))}
              <Button type="button" size="sm" onClick={() => addAchievement(i)}>+ Add Achievement</Button>
            </div>

            <div className="sm:col-span-2">
              <Button type="button" size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => removeExperience(i)}>
                Remove Experience
              </Button>
            </div>
          </div>
        ))}
        {errors.experience.length > 0 && errors.experience[0] && (
          <div className={`text-red-500 ${hintErr} flex items-center mt-2 mb-2`}>
            <ExclamationCircleIcon className="w-4 h-4 mr-1" />
            {errors.experience[0]}
          </div>
        )}
        <Button type="button" size="sm" onClick={addExperience}>+ Add Experience</Button>
      </Section>

      {(['skills', 'certifications', 'projects'] as const).map((field) => (
        <Section key={field} title={field.charAt(0).toUpperCase() + field.slice(1)} isCollapsed={collapsedSections[field]} onToggle={() => toggleSection(field)}>
          {(localData[field] as string[]).map((item, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <Input label={`${field.slice(0, -1)} ${i + 1}`} value={item} onChange={(e) => handleListChange(e, field, i)} />
              <Button type="button" size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => removeListItem(field, i)}>-</Button>
            </div>
          ))}
          <Button type="button" size="sm" onClick={() => addListItem(field)}>+ Add {field.slice(0, -1)}</Button>
        </Section>
      ))}

      <Section title="Customization" isCollapsed={collapsedSections.customization} onToggle={() => toggleSection('customization')}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <select
            value={localData.theme}
            onChange={(e) => handleChange('theme', e.target.value as Theme)}
            className="w-full px-3 py-2 rounded border dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="blue">Blue</option>
            <option value="emerald">Emerald</option>
            <option value="rose">Rose</option>
            <option value="black">Black</option>
          </select>
          <select
            value={localData.font}
            onChange={(e) => handleChange('font', e.target.value as FontChoice)}
            className="w-full px-3 py-2 rounded border dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Helvetica">Helvetica</option>
            <option value="Roboto">Roboto</option>
            <option value="Times">Times</option>
          </select>
        </div>
      </Section>

      <Button
        type="button"
        size="sm"
        className="w-full mt-3 bg-gray-600 hover:bg-gray-700"
        onClick={() => {
          localStorage.removeItem('cvData');
          setLocalData(EMPTY_CV);
          setErrors({
            name: '',
            email: '',
            phone: '',
            education: Array(EMPTY_CV.education.length).fill(''),
            experience: Array(EMPTY_CV.experience.length).fill(''),
          });
        }}
      >
        Reset CV
      </Button>
    </form>
  );
}
