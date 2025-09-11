'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, type DropResult } from '@hello-pangea/dnd';
import type { PortfolioData, PortfolioProject, PortfolioSocial, Media } from '@/lib/portfolio-types';

/* ----------------- helpers (module scope = stable) ----------------- */

const isValidUrl = (string: string) => {
  try {
    new URL(string);
    return true;
  } catch {
    return false;
  }
};

function shallowEqualErrors(a: Record<string, string>, b: Record<string, string>) {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  for (const k of aKeys) if (a[k] !== b[k]) return false;
  return true;
}

/* ----------------------------- component ---------------------------- */

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

  /* ----------------------- validation (fixed) ----------------------- */

  const computedErrors = useMemo(() => {
    const e: Record<string, string> = {};
    if (!portfolioData.fullName.trim()) e.name = 'Name is required';
    if (portfolioData.photoDataUrl && !isValidUrl(portfolioData.photoDataUrl)) e.photo = 'Invalid image URL';
    if (portfolioData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(portfolioData.email)) e.email = 'Invalid email format';
    if (portfolioData.phone && !/^\+?[\d\s-]{7,}$/.test(portfolioData.phone)) e.phone = 'Invalid phone number';
    if (portfolioData.linkedin && !isValidUrl(portfolioData.linkedin)) e.linkedin = 'Invalid LinkedIn URL';
    if (portfolioData.socials.some((s) => s.url && !isValidUrl(s.url))) e.socials = 'One or more social URLs are invalid';
    if (portfolioData.projects.some((p) => p.link && !isValidUrl(p.link))) e.projects = 'One or more project links are invalid';
    if (portfolioData.media.some((m) => m.link && !isValidUrl(m.link))) e.media = 'One or more media links are invalid';
    return e;
  }, [portfolioData]);

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
    const newSocials = [...portfolioData.socials];
    newSocials[index] = { ...newSocials[index], [field]: value };
    setPortfolioData({ ...portfolioData, socials: newSocials });
  };

  const addSocial = () =>
    setPortfolioData({
      ...portfolioData,
      socials: [...portfolioData.socials, { label: '', url: '' }],
    });

  const updateMedia = (index: number, field: keyof Media, value: string) => {
    const newMedia = [...portfolioData.media];
    newMedia[index] = { ...newMedia[index], [field]: value };
    if (field === 'type' && !['video', 'podcast', 'article'].includes(value)) {
      newMedia[index].type = 'video';
    }
    setPortfolioData({ ...portfolioData, media: newMedia });
  };

  const addMedia = () =>
    setPortfolioData({
      ...portfolioData,
      media: [...portfolioData.media, { title: '', type: 'video', link: '' }],
    });

  const updateProject = (index: number, field: keyof PortfolioProject, value: string) => {
    const newProjects = [...portfolioData.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setPortfolioData({ ...portfolioData, projects: newProjects });
  };

  const addProject = () =>
    setPortfolioData({
      ...portfolioData,
      projects: [...portfolioData.projects, { name: '', description: '', link: '' }],
    });

  const updateSkill = (index: number, value: string) => {
    const newSkills = [...portfolioData.skills];
    newSkills[index] = value;
    setPortfolioData({ ...portfolioData, skills: newSkills });
  };

  const addSkill = () =>
    setPortfolioData({
      ...portfolioData,
      skills: [...portfolioData.skills, ''],
    });

  const updateCertification = (index: number, value: string) => {
    const newCertifications = [...portfolioData.certifications];
    newCertifications[index] = value;
    setPortfolioData({ ...portfolioData, certifications: newCertifications });
  };

  const addCertification = () =>
    setPortfolioData({
      ...portfolioData,
      certifications: [...portfolioData.certifications, ''],
    });

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { type, source, destination } = result;

      if (type === 'skills') {
        const items = [...portfolioData.skills];
        const [moved] = items.splice(source.index, 1);
        items.splice(destination.index, 0, moved);
        setPortfolioData({ ...portfolioData, skills: items });
        return;
      }

      if (type === 'projects') {
        const items = [...portfolioData.projects];
        const [moved] = items.splice(source.index, 1);
        items.splice(destination.index, 0, moved);
        setPortfolioData({ ...portfolioData, projects: items });
        return;
      }

      if (type === 'certifications') {
        const items = [...portfolioData.certifications];
        const [moved] = items.splice(source.index, 1);
        items.splice(destination.index, 0, moved);
        setPortfolioData({ ...portfolioData, certifications: items });
        return;
      }

      // media
      const items = [...portfolioData.media];
      const [moved] = items.splice(source.index, 1);
      items.splice(destination.index, 0, moved);
      setPortfolioData({ ...portfolioData, media: items });
    },
    [portfolioData, setPortfolioData]
  );

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setPortfolioData({ ...portfolioData, username: newUsername });
    if (onUsernameUpdate) void onUsernameUpdate(newUsername);
  };

  /* ------------------------------- UI ------------------------------- */

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Edit Portfolio</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {Object.entries(isOpen).map(([section, open]) => (
          <div key={section} className={`border rounded-lg ${section}-section`}>
            <Button
              variant="ghost"
              className="w-full text-left font-semibold p-3 flex justify-between items-center"
              onClick={() => setIsOpen((prev) => ({ ...prev, [section]: !prev[section] }))}
              aria-label={`Toggle ${section} section`}
            >
              {section.charAt(0).toUpperCase() + section.slice(1)}
              {open ? <ChevronUp /> : <ChevronDown />}
            </Button>

            <AnimatePresence>
              {open && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 space-y-4"
                >
                  {section === 'header' && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Full Name <span className="text-xs text-gray-500">(e.g., John Doe)</span>
                        </label>
                        <Input
                          placeholder="Full Name"
                          value={portfolioData.fullName}
                          onChange={(e) => setPortfolioData({ ...portfolioData, fullName: e.target.value })}
                          className={errors.name ? 'border-red-500' : ''}
                          aria-label="Full Name"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
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
                        <label className="block text-sm font-medium text-gray-700">
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
                        <label className="block text-sm font-medium text-gray-700">
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
                        <label className="block text-sm font-medium text-gray-700">
                          Username <span className="text-xs text-gray-500">(e.g., johndoe, optional)</span>
                        </label>
                        <Input
                          placeholder="Username"
                          value={portfolioData.username || ''}
                          onChange={handleUsernameChange}
                          aria-label="Username"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Upload Image</label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload('photo', e)}
                          className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          aria-label="Upload Headshot"
                        />
                        {errors.photo && <p className="text-red-500 text-sm">{errors.photo}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Upload CV</label>
                        <Input
                          type="file"
                          accept="application/pdf"
                          onChange={(e) => handleFileUpload('cv', e)}
                          className="mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                          aria-label="Upload CV"
                        />
                        {errors.cv && <p className="text-red-500 text-sm">{errors.cv}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">Template</label>
                        <Select
                          value={portfolioData.templateId}
                          onValueChange={(value: string) => {
                            if (
                              ['modern', 'classic', 'minimal', 'tech', 'creative', 'corporate'].includes(value) &&
                              value !== portfolioData.templateId
                            ) {
                              setPortfolioData({ ...portfolioData, templateId: value as typeof portfolioData.templateId });
                            }
                          }}
                        >
                          <SelectTrigger className="w-full py-2 px-4 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <SelectValue placeholder="Select Template" />
                          </SelectTrigger>
                          <SelectContent className="w-full bg-white border border-gray-300 rounded-md shadow-lg z-10">
                            <SelectItem value="modern" className="py-2 px-4 hover:bg-gray-100">
                              Modern
                            </SelectItem>
                            <SelectItem value="classic" className="py-2 px-4 hover:bg-gray-100">
                              Classic
                            </SelectItem>
                            <SelectItem value="minimal" className="py-2 px-4 hover:bg-gray-100">
                              Minimal
                            </SelectItem>
                            <SelectItem value="tech" className="py-2 px-4 hover:bg-gray-100">
                              Tech
                            </SelectItem>
                            <SelectItem value="creative" className="py-2 px-4 hover:bg-gray-100">
                              Creative
                            </SelectItem>
                            <SelectItem value="corporate" className="py-2 px-4 hover:bg-gray-100">
                              Corporate
                            </SelectItem>
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
                      {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

                      <Input
                        placeholder="Phone (e.g., +44 123 456 7890)"
                        value={portfolioData.phone}
                        onChange={(e) => setPortfolioData({ ...portfolioData, phone: e.target.value })}
                        className={errors.phone ? 'border-red-500' : ''}
                        aria-label="Phone"
                      />
                      {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

                      <Input
                        placeholder="LinkedIn URL (e.g., https://linkedin.com/in/johndoe)"
                        value={portfolioData.linkedin}
                        onChange={(e) => setPortfolioData({ ...portfolioData, linkedin: e.target.value })}
                        className={errors.linkedin ? 'border-red-500' : ''}
                        aria-label="LinkedIn URL"
                      />
                      {errors.linkedin && <p className="text-red-500 text-sm">{errors.linkedin}</p>}

                      {portfolioData.socials.map((social, index: number) => (
                        <div key={index} className="grid grid-cols-2 gap-2 mt-2">
                          <Input
                            placeholder="Label (e.g., Twitter)"
                            value={social.label}
                            onChange={(e) => updateSocial(index, 'label', e.target.value)}
                            aria-label={`Social Label ${index + 1}`}
                          />
                          <Input
                            placeholder="URL (e.g., https://twitter.com/johndoe)"
                            value={social.url}
                            onChange={(e) => updateSocial(index, 'url', e.target.value)}
                            className={errors.socials ? 'border-red-500' : ''}
                            aria-label={`Social URL ${index + 1}`}
                          />
                        </div>
                      ))}
                      {errors.socials && <p className="text-red-500 text-sm">{errors.socials}</p>}
                      <Button onClick={addSocial} className="mt-2" aria-label="Add Social Link">
                        Add Social
                      </Button>
                    </>
                  )}

                  {section === 'skills' && (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="skills" type="skills">
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} className="skills-section">
                            {portfolioData.skills.map((skill, index: number) => (
                              <Draggable key={index} draggableId={`skill-${index}`} index={index}>
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
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <Button onClick={addSkill} className="mt-2" aria-label="Add Skill">
                        Add Skill
                      </Button>
                    </DragDropContext>
                  )}

                  {section === 'projects' && (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="projects" type="projects">
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} className="projects-section">
                            {portfolioData.projects.map((project, index: number) => (
                              <Draggable key={index} draggableId={`project-${index}`} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="space-y-2 mt-2 border p-2 rounded"
                                  >
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
                      <Button onClick={addProject} className="mt-2" aria-label="Add Project">
                        Add Project
                      </Button>
                    </DragDropContext>
                  )}

                  {section === 'certifications' && (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="certifications" type="certifications">
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} className="certifications-section">
                            {portfolioData.certifications.map((cert, index: number) => (
                              <Draggable key={index} draggableId={`cert-${index}`} index={index}>
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
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                      <Button onClick={addCertification} className="mt-2" aria-label="Add Certification">
                        Add Certification
                      </Button>
                    </DragDropContext>
                  )}

                  {section === 'media' && (
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="media" type="media">
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.droppableProps} className="media-section">
                            {portfolioData.media.map((item, index: number) => (
                              <Draggable key={index} draggableId={`media-${index}`} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="space-y-2 mt-2 border p-2 rounded"
                                  >
                                    <Input
                                      placeholder="Title (e.g., Tech Talk Video)"
                                      value={item.title}
                                      onChange={(e) => updateMedia(index, 'title', e.target.value)}
                                      aria-label={`Media Title ${index + 1}`}
                                    />
                                    {/* Native select is fine here */}
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
                      <Button onClick={addMedia} className="mt-2" aria-label="Add Media">
                        Add Media
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
