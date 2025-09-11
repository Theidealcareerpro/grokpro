'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronUp, Trash2, Plus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import type { PortfolioData, PortfolioProject, PortfolioSocial, Media } from '@/lib/portfolio-types';

/* ------------------------------------------------------------------ */
/* helpers (module scope = stable)                                     */
/* ------------------------------------------------------------------ */

const TEMPLATE_OPTIONS = [
  { id: 'modern', label: 'Modern' },
  { id: 'classic', label: 'Classic' },       // ClassicProLeft in publish, Classic in preview
  { id: 'minimal', label: 'Minimal' },
  { id: 'tech', label: 'Tech' },
  { id: 'creative', label: 'Creative' },
  { id: 'corporate', label: 'Corporate' },
] as const;

type TemplateIdOption = typeof TEMPLATE_OPTIONS[number]['id'];

// Accept http/https + data + blob for in-app uploads and external links
function isValidUrlFlexible(value: string) {
  if (!value) return false;
  if (value.startsWith('data:')) return true;
  if (value.startsWith('blob:')) return true;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

function shallowEqualErrors(a: Record<string, string>, b: Record<string, string>) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (const k of aKeys) if (a[k] !== b[k]) return false;
  return true;
}

function debounce<T extends (...args: any[]) => void>(fn: T, ms = 300) {
  let t: ReturnType<typeof setTimeout> | null = null;
  const debounced = (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), ms);
  };
  return debounced as T;
}

/* ------------------------------------------------------------------ */
/* component                                                           */
/* ------------------------------------------------------------------ */

interface PortfolioFormProps {
  portfolioData: PortfolioData;
  setPortfolioData: (data: PortfolioData) => void;
  errors: { [key: string]: string };
  setErrors: (
    errors:
      | { [key: string]: string }
      | ((prev: { [key: string]: string }) => { [key: string]: string })
  ) => void;
  onUsernameUpdate?: (newUsername: string) => Promise<void>;
}

export default function PortfolioForm({
  portfolioData,
  setPortfolioData,
  errors,
  setErrors,
  onUsernameUpdate,
}: PortfolioFormProps) {
  const [isOpen, setIsOpen] = useState<Record<string, boolean>>({
    header: true,
    about: false,
    contact: false,
    skills: false,
    projects: false,
    certifications: false,
    media: false,
  });

  // stable arrays (defensive fallback so UI never crashes)
  const skills = portfolioData.skills ?? [];
  const projects = portfolioData.projects ?? [];
  const certifications = portfolioData.certifications ?? [];
  const socials = portfolioData.socials ?? [];
  const media = portfolioData.media ?? [];

  /* ----------------------- validation (fixed) ----------------------- */

  const computedErrors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!portfolioData.fullName?.trim()) e.name = 'Name is required';

    if (portfolioData.photoDataUrl && !isValidUrlFlexible(portfolioData.photoDataUrl)) {
      e.photo = 'Invalid image URL or data URI';
    }

    if (portfolioData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(portfolioData.email)) {
      e.email = 'Invalid email format';
    }

    if (portfolioData.phone && !/^\+?[\d\s\-()]{7,}$/.test(portfolioData.phone)) {
      e.phone = 'Invalid phone number';
    }

    if (portfolioData.linkedin && !isValidUrlFlexible(portfolioData.linkedin)) {
      e.linkedin = 'Invalid LinkedIn URL';
    }

    if (socials.some((s) => s?.url && !isValidUrlFlexible(s.url))) {
      e.socials = 'One or more social URLs are invalid';
    }

    if (projects.some((p) => p?.link && !isValidUrlFlexible(p.link!))) {
      e.projects = 'One or more project links are invalid';
    }

    if (media.some((m) => m?.link && !isValidUrlFlexible(m.link!))) {
      e.media = 'One or more media links are invalid';
    }

    return e;
  }, [portfolioData, socials, projects, media]);

  useEffect(() => {
    setErrors((prev) => (shallowEqualErrors(prev, computedErrors) ? prev : computedErrors));
  }, [computedErrors, setErrors]);

  /* ------------------------- event handlers ------------------------- */

  const handleFileUpload = (type: 'photo' | 'cv', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === 'photo' && file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, photo: 'Image size must be less than 2MB' }));
      return;
    }
    if (type === 'cv' && (file.size > 5 * 1024 * 1024 || !file.type.includes('pdf'))) {
      setErrors((prev) => ({ ...prev, cv: 'CV must be a PDF less than 5MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'photo') {
        setPortfolioData({ ...portfolioData, photoDataUrl: reader.result as string });
        setErrors((prev) => ({ ...prev, photo: '' }));
      } else {
        setPortfolioData({
          ...portfolioData,
          cvFileDataUrl: reader.result as string,
          cvFileName: file.name,
        });
        setErrors((prev) => ({ ...prev, cv: '' }));
      }
    };
    reader.readAsDataURL(file);
  };

  const updateSocial = (index: number, field: keyof PortfolioSocial, value: string) => {
    const next = socials.map((s, i) => (i === index ? { ...s, [field]: value } : s));
    setPortfolioData({ ...portfolioData, socials: next });
  };

  const addSocial = () =>
    setPortfolioData({
      ...portfolioData,
      socials: [...socials, { label: '', url: '' }],
    });

  const removeSocial = (index: number) =>
    setPortfolioData({
      ...portfolioData,
      socials: socials.filter((_, i) => i !== index),
    });

  const updateMedia = (index: number, field: keyof Media, value: string) => {
    const next = media.map((m, i) =>
      i === index ? { ...m, [field]: field === 'type' && !['video', 'podcast', 'article'].includes(value) ? 'video' : value } : m
    );
    setPortfolioData({ ...portfolioData, media: next });
  };

  const addMedia = () =>
    setPortfolioData({
      ...portfolioData,
      media: [...media, { title: '', type: 'video', link: '' }],
    });

  const removeMedia = (index: number) =>
    setPortfolioData({
      ...portfolioData,
      media: media.filter((_, i) => i !== index),
    });

  const updateProject = (index: number, field: keyof PortfolioProject, value: string) => {
    const next = projects.map((p, i) => (i === index ? { ...p, [field]: value } : p));
    setPortfolioData({ ...portfolioData, projects: next });
  };

  const addProject = () =>
    setPortfolioData({
      ...portfolioData,
      projects: [...projects, { name: '', description: '', link: '' }],
    });

  const removeProject = (index: number) =>
    setPortfolioData({
      ...portfolioData,
      projects: projects.filter((_, i) => i !== index),
    });

  const updateSkill = (index: number, value: string) => {
    const next = skills.map((s, i) => (i === index ? value : s));
    setPortfolioData({ ...portfolioData, skills: next });
  };

  const addSkill = () =>
    setPortfolioData({
      ...portfolioData,
      skills: [...skills, ''],
    });

  const removeSkill = (index: number) =>
    setPortfolioData({
      ...portfolioData,
      skills: skills.filter((_, i) => i !== index),
    });

  const updateCertification = (index: number, value: string) => {
    const next = certifications.map((c, i) => (i === index ? value : c));
    setPortfolioData({ ...portfolioData, certifications: next });
  };

  const addCertification = () =>
    setPortfolioData({
      ...portfolioData,
      certifications: [...certifications, ''],
    });

  const removeCertification = (index: number) =>
    setPortfolioData({
      ...portfolioData,
      certifications: certifications.filter((_, i) => i !== index),
    });

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { type, source, destination } = result;

      if (type === 'skills') {
        const items = [...skills];
        const [moved] = items.splice(source.index, 1);
        items.splice(destination.index, 0, moved);
        setPortfolioData({ ...portfolioData, skills: items });
        return;
      }

      if (type === 'projects') {
        const items = [...projects];
        const [moved] = items.splice(source.index, 1);
        items.splice(destination.index, 0, moved);
        setPortfolioData({ ...portfolioData, projects: items });
        return;
      }

      if (type === 'certifications') {
        const items = [...certifications];
        const [moved] = items.splice(source.index, 1);
        items.splice(destination.index, 0, moved);
        setPortfolioData({ ...portfolioData, certifications: items });
        return;
      }

      // media
      const items = [...media];
      const [moved] = items.splice(source.index, 1);
      items.splice(destination.index, 0, moved);
      setPortfolioData({ ...portfolioData, media: items });
    },
    [portfolioData, setPortfolioData, skills, projects, certifications, media]
  );

  // Debounced username update to avoid spamming API
  const debouncedUsernameRef = useRef(
    onUsernameUpdate
      ? debounce((u: string) => {
          onUsernameUpdate(u).catch(() => void 0);
        }, 600)
      : null
  );

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setPortfolioData({ ...portfolioData, username: newUsername });
    debouncedUsernameRef.current?.(newUsername);
  };

  /* ------------------------------- UI ------------------------------- */

  const hasAnyErrors = Object.keys(errors || {}).length > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit Portfolio</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">

        {/* Error summary (compact) */}
        {hasAnyErrors && (
          <div
            className="rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm"
            role="alert"
            aria-live="polite"
          >
            Please fix the issues:{' '}
            {Object.entries(errors).map(([k, v], i) => (
              <span key={k}>
                {v}
                {i < Object.keys(errors).length - 1 ? '; ' : ''}
              </span>
            ))}
          </div>
        )}

        {Object.entries(isOpen).map(([section, open]) => (
          <div key={section} className={`border rounded-lg ${section}-section`}>
            <Button
              variant="ghost"
              className="w-full text-left font-semibold p-3 flex justify-between items-center"
              onClick={() => setIsOpen((prev) => ({ ...prev, [section]: !prev[section] }))}
              aria-expanded={open}
              aria-controls={`${section}-content`}
              aria-label={`Toggle ${section} section`}
            >
              <span className="capitalize">{section}</span>
              {open ? <ChevronUp /> : <ChevronDown />}
            </Button>

            <AnimatePresence>
              {open && (
                <motion.div
                  id={`${section}-content`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 space-y-4"
                >
                  {section === 'header' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Full Name <span className="text-xs text-gray-500">(e.g., John Doe)</span>
                        </label>
                        <Input
                          placeholder="Full Name"
                          value={portfolioData.fullName}
                          onChange={(e) => setPortfolioData({ ...portfolioData, fullName: e.target.value })}
                          className={errors.name ? 'border-red-500' : ''}
                          aria-label="Full Name"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Role <span className="text-xs text-gray-500">(e.g., Software Engineer)</span>
                        </label>
                        <Input
                          placeholder="Role"
                          value={portfolioData.role}
                          onChange={(e) => setPortfolioData({ ...portfolioData, role: e.target.value })}
                          aria-label="Role"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Tagline <span className="text-xs text-gray-500">(e.g., Building Innovative Solutions)</span>
                        </label>
                        <Input
                          placeholder="Tagline"
                          value={portfolioData.tagline}
                          onChange={(e) => setPortfolioData({ ...portfolioData, tagline: e.target.value })}
                          aria-label="Tagline"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Location <span className="text-xs text-gray-500">(e.g., London, UK)</span>
                        </label>
                        <Input
                          placeholder="Location"
                          value={portfolioData.location}
                          onChange={(e) => setPortfolioData({ ...portfolioData, location: e.target.value })}
                          aria-label="Location"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                          Username <span className="text-xs text-gray-500">(e.g., johndoe, optional)</span>
                        </label>
                        <Input
                          placeholder="Username"
                          value={portfolioData.username || ''}
                          onChange={handleUsernameChange}
                          aria-label="Username"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Upload Image</label>
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileUpload('photo', e)}
                            className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            aria-label="Upload Headshot"
                          />
                          {errors.photo && <p className="text-red-500 text-sm mt-1">{errors.photo}</p>}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Upload CV (PDF)</label>
                          <Input
                            type="file"
                            accept="application/pdf"
                            onChange={(e) => handleFileUpload('cv', e)}
                            className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            aria-label="Upload CV"
                          />
                          {errors.cv && <p className="text-red-500 text-sm mt-1">{errors.cv}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Template</label>
                        <Select
                          value={portfolioData.templateId}
                          onValueChange={(value: TemplateIdOption) => {
                            if (value !== portfolioData.templateId) {
                              setPortfolioData({ ...portfolioData, templateId: value });
                            }
                          }}
                        >
                          <SelectTrigger className="w-full py-2 px-4 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-900 dark:border-zinc-700">
                            <SelectValue placeholder="Select Template" />
                          </SelectTrigger>
                          <SelectContent className="w-full bg-white border border-gray-300 rounded-md shadow-lg z-10 dark:bg-zinc-900 dark:border-zinc-700">
                            {TEMPLATE_OPTIONS.map((opt) => (
                              <SelectItem key={opt.id} value={opt.id} className="py-2 px-4 hover:bg-gray-100 dark:hover:bg-zinc-800">
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </>
                  )}

                  {section === 'about' && (
                    <Textarea
                      placeholder="About Me (e.g., Passionate about technology with 5+ years of experience)"
                      value={portfolioData.about}
                      onChange={(e) => setPortfolioData({ ...portfolioData, about: e.target.value })}
                      aria-label="About Me"
                    />
                  )}

                  {section === 'contact' && (
                    <>
                      <Input
                        placeholder="Email (e.g., john.doe@example.com)"
                        value={portfolioData.email}
                        onChange={(e) => setPortfolioData({ ...portfolioData, email: e.target.value })}
                        className={errors.email ? 'border-red-500' : ''}
                        aria-label="Email"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}

                      <Input
                        placeholder="Phone (e.g., +44 123 456 7890)"
                        value={portfolioData.phone}
                        onChange={(e) => setPortfolioData({ ...portfolioData, phone: e.target.value })}
                        className={errors.phone ? 'border-red-500' : ''}
                        aria-label="Phone"
                      />
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}

                      <Input
                        placeholder="LinkedIn URL (e.g., https://linkedin.com/in/johndoe)"
                        value={portfolioData.linkedin}
                        onChange={(e) => setPortfolioData({ ...portfolioData, linkedin: e.target.value })}
                        className={errors.linkedin ? 'border-red-500' : ''}
                        aria-label="LinkedIn URL"
                      />
                      {errors.linkedin && <p className="text-red-500 text-sm mt-1">{errors.linkedin}</p>}

                      <div className="flex items-center justify-between mt-4">
                        <h4 className="text-sm font-medium">Social Links</h4>
                        <Button onClick={addSocial} variant="secondary" size="sm" aria-label="Add Social Link">
                          <Plus className="h-4 w-4 mr-1" /> Add Social
                        </Button>
                      </div>

                      {socials.map((social, index: number) => (
                        <div key={index} className="grid grid-cols-12 gap-2 mt-2 items-center">
                          <div className="col-span-5">
                            <Input
                              placeholder="Label (e.g., Twitter)"
                              value={social.label}
                              onChange={(e) => updateSocial(index, 'label', e.target.value)}
                              aria-label={`Social Label ${index + 1}`}
                            />
                          </div>
                          <div className="col-span-6">
                            <Input
                              placeholder="URL (e.g., https://twitter.com/johndoe)"
                              value={social.url}
                              onChange={(e) => updateSocial(index, 'url', e.target.value)}
                              className={errors.socials ? 'border-red-500' : ''}
                              aria-label={`Social URL ${index + 1}`}
                            />
                          </div>
                          <div className="col-span-1 flex justify-end">
                            <Button variant="ghost" size="icon" onClick={() => removeSocial(index)} aria-label={`Remove Social ${index + 1}`}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {errors.socials && <p className="text-red-500 text-sm mt-1">{errors.socials}</p>}
                    </>
                  )}

                  {section === 'skills' && (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="skills" type="skills">
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} className="skills-section">
                            {skills.map((skill, index: number) => (
                              <Draggable key={`skill-${index}`} draggableId={`skill-${index}`} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex items-center gap-2 mt-2"
                                  >
                                    <Input
                                      placeholder="Skill (e.g., JavaScript)"
                                      value={skill}
                                      onChange={(e) => updateSkill(index, e.target.value)}
                                      className="flex-1"
                                      aria-label={`Skill ${index + 1}`}
                                    />
                                    <Button variant="ghost" size="icon" onClick={() => removeSkill(index)} aria-label={`Remove Skill ${index + 1}`}>
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <Button onClick={addSkill} className="mt-3" aria-label="Add Skill">
                        <Plus className="h-4 w-4 mr-1" /> Add Skill
                      </Button>
                    </DragDropContext>
                  )}

                  {section === 'projects' && (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="projects" type="projects">
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} className="projects-section">
                            {projects.map((project, index: number) => (
                              <Draggable key={`project-${index}`} draggableId={`project-${index}`} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="space-y-2 mt-2 border p-3 rounded"
                                  >
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Project {index + 1}</h4>
                                      <Button variant="ghost" size="icon" onClick={() => removeProject(index)} aria-label={`Remove Project ${index + 1}`}>
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                    <Input
                                      placeholder="Project Name (e.g., Portfolio Website)"
                                      value={project.name}
                                      onChange={(e) => updateProject(index, 'name', e.target.value)}
                                      aria-label={`Project Name ${index + 1}`}
                                    />
                                    <Textarea
                                      placeholder="Description (e.g., Built a responsive site with React)"
                                      value={project.description}
                                      onChange={(e) => updateProject(index, 'description', e.target.value)}
                                      aria-label={`Project Description ${index + 1}`}
                                    />
                                    <Input
                                      placeholder="Link (e.g., https://example.com)"
                                      value={project.link}
                                      onChange={(e) => updateProject(index, 'link', e.target.value)}
                                      className={errors.projects ? 'border-red-500' : ''}
                                      aria-label={`Project Link ${index + 1}`}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <Button onClick={addProject} className="mt-3" aria-label="Add Project">
                        <Plus className="h-4 w-4 mr-1" /> Add Project
                      </Button>
                    </DragDropContext>
                  )}

                  {section === 'certifications' && (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="certifications" type="certifications">
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} className="certifications-section">
                            {certifications.map((cert, index: number) => (
                              <Draggable key={`cert-${index}`} draggableId={`cert-${index}`} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="flex items-center gap-2 mt-2"
                                  >
                                    <Input
                                      placeholder="Certification (e.g., AWS Certified Developer)"
                                      value={cert}
                                      onChange={(e) => updateCertification(index, e.target.value)}
                                      className="flex-1"
                                      aria-label={`Certification ${index + 1}`}
                                    />
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => removeCertification(index)}
                                      aria-label={`Remove Certification ${index + 1}`}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <Button onClick={addCertification} className="mt-3" aria-label="Add Certification">
                        <Plus className="h-4 w-4 mr-1" /> Add Certification
                      </Button>
                    </DragDropContext>
                  )}

                  {section === 'media' && (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="media" type="media">
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} className="media-section">
                            {media.map((item, index: number) => (
                              <Draggable key={`media-${index}`} draggableId={`media-${index}`} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="space-y-2 mt-2 border p-3 rounded"
                                  >
                                    <div className="flex items-center justify-between">
                                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Media {index + 1}</h4>
                                      <Button variant="ghost" size="icon" onClick={() => removeMedia(index)} aria-label={`Remove Media ${index + 1}`}>
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>

                                    <Input
                                      placeholder="Title (e.g., Tech Talk Video)"
                                      value={item.title}
                                      onChange={(e) => updateMedia(index, 'title', e.target.value)}
                                      aria-label={`Media Title ${index + 1}`}
                                    />
                                    {/* native select = simplest, no extra deps */}
                                    <select
                                      value={item.type}
                                      onChange={(e) => updateMedia(index, 'type', e.target.value)}
                                      className="w-full px-3 py-2 rounded border dark:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                      aria-label={`Media Type ${index + 1}`}
                                    >
                                      <option value="video">Video</option>
                                      <option value="podcast">Podcast</option>
                                      <option value="article">Article</option>
                                    </select>
                                    <Input
                                      placeholder="Link (e.g., https://youtube.com/watch)"
                                      value={item.link}
                                      onChange={(e) => updateMedia(index, 'link', e.target.value)}
                                      className={errors.media ? 'border-red-500' : ''}
                                      aria-label={`Media Link ${index + 1}`}
                                    />
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <Button onClick={addMedia} className="mt-3" aria-label="Add Media">
                        <Plus className="h-4 w-4 mr-1" /> Add Media
                      </Button>
                    </DragDropContext>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
