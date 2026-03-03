"use client";
import React, { useRef, useState, useCallback } from 'react';
import { Plus, Trash2, User, Briefcase, GraduationCap, Star, Globe, Award, Camera, ZoomIn, ZoomOut, Move } from 'lucide-react';
import type { CVData, PhotoShape, Skill, LanguageItem, Certification, LogoShape } from '@/types/cv';
import { COLOR_PRESETS, DEFAULT_MODERN_COLORS, PHOTO_SHAPE_PRESETS, LOGO_SHAPE_PRESETS } from '@/types/cv';
import { useSettings } from '@/context/SettingsContext';

export default function FormCV({ data, setData, activeTemplate }: { data: CVData, setData: React.Dispatch<React.SetStateAction<CVData>>, activeTemplate?: string }) {
  const { tr } = useSettings();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const [skillInput, setSkillInput] = useState('');
  const [langInput, setLangInput] = useState('');
  const [certInput, setCertInput] = useState('');
  const [skillDescInput, setSkillDescInput] = useState('');
  const [langLevelInput, setLangLevelInput] = useState('');
  const [certDescInput, setCertDescInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; ox: number; oy: number } | null>(null);
  const inputCls = "w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 outline-blue-500";
  const inlineCls = "bg-transparent border-b border-zinc-200 dark:border-zinc-600 text-sm p-1 outline-none text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setData({ ...data, photo: ev.target?.result as string, photoZoom: 1, photoOffsetX: 0, photoOffsetY: 0 });
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setData({ ...data, photo: undefined, photoZoom: 1, photoOffsetX: 0, photoOffsetY: 0 });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setData({ ...data, logo: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUrl = (url: string) => {
    setData({ ...data, logo: url || undefined });
  };

  const removeLogo = () => {
    setData({ ...data, logo: undefined });
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  const setPhotoZoom = (val: number) => {
    setData({ ...data, photoZoom: Math.max(1, Math.min(3, val)) });
  };

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStart.current = {
      x: e.clientX,
      y: e.clientY,
      ox: data.photoOffsetX ?? 0,
      oy: data.photoOffsetY ?? 0,
    };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [data.photoOffsetX, data.photoOffsetY]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    const sensitivity = 100 / 180;
    const newX = Math.max(-50, Math.min(50, dragStart.current.ox + dx * sensitivity));
    const newY = Math.max(-50, Math.min(50, dragStart.current.oy + dy * sensitivity));
    setData(prev => ({ ...prev, photoOffsetX: Math.round(newX), photoOffsetY: Math.round(newY) }));
  }, [isDragging, setData]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setData(prev => ({ ...prev, photoZoom: Math.max(1, Math.min(3, (prev.photoZoom ?? 1) + delta)) }));
  }, [setData]);

  const setPhotoBorderColor = (val: string) => setData({ ...data, photoBorderColor: val });
  const setPhotoBorderWidth = (val: number) => setData({ ...data, photoBorderWidth: Math.max(0, Math.min(12, val)) });
  const setPhotoBorderRadius = (val: number) => setData({ ...data, photoBorderRadius: Math.max(0, Math.min(50, val)), photoShape: 'custom' });
  const setPhotoRotation = (val: number) => setData({ ...data, photoRotation: Math.max(-15, Math.min(15, val)), photoShape: 'custom' });

  const currentShape = data.photoShape ?? 'tilted';
  const applyShape = (shapeId: PhotoShape) => {
    const preset = PHOTO_SHAPE_PRESETS.find(p => p.id === shapeId);
    if (!preset) return;
    setData({
      ...data,
      photoShape: shapeId,
      photoBorderRadius: undefined, // use preset via getPhotoStyle
      photoRotation: undefined,
    });
  };

  const getPhotoStyle = () => {
    const shape = currentShape;
    if (shape === 'custom') {
      return {
        borderColor: data.photoBorderColor ?? colors.accent,
        borderWidth: `${data.photoBorderWidth ?? 4}px`,
        borderStyle: 'solid' as const,
        borderRadius: `${data.photoBorderRadius ?? 16}px`,
        transform: `rotate(${data.photoRotation ?? 0}deg)`,
        clipPath: undefined as string | undefined,
      };
    }
    const preset = PHOTO_SHAPE_PRESETS.find(p => p.id === shape) ?? PHOTO_SHAPE_PRESETS[1];
    return {
      borderColor: data.photoBorderColor ?? colors.accent,
      borderWidth: `${data.photoBorderWidth ?? 4}px`,
      borderStyle: 'solid' as const,
      borderRadius: preset.borderRadius,
      transform: `rotate(${preset.rotation}deg)`,
      clipPath: preset.clipPath,
    };
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newExp = [...data.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    setData({ ...data, experience: newExp });
  };

  const addExperience = () => {
    setData({ ...data, experience: [...data.experience, { company: "", role: "", year: "", desc: "" }] });
  };

  const removeExperience = (index: number) => {
    setData({ ...data, experience: data.experience.filter((_, i) => i !== index) });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEdu = [...data.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    setData({ ...data, education: newEdu });
  };

  const addEducation = () => {
    setData({ ...data, education: [...data.education, { school: "", degree: "", field: "", year: "", desc: "" }] });
  };

  const removeEducation = (index: number) => {
    setData({ ...data, education: data.education.filter((_, i) => i !== index) });
  };

  const addSkill = () => {
    const val = skillInput.trim();
    if (!val) return;
    setData({ ...data, skills: [...data.skills, { name: val, desc: skillDescInput.trim() }] });
    setSkillInput('');
    setSkillDescInput('');
  };

  const removeSkill = (index: number) => {
    setData({ ...data, skills: data.skills.filter((_, i) => i !== index) });
  };

  const handleSkillChange = (index: number, field: keyof Skill, value: string) => {
    const newSkills = [...data.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setData({ ...data, skills: newSkills });
  };

  const addLanguage = () => {
    const val = langInput.trim();
    if (!val) return;
    setData({ ...data, languages: [...data.languages, { name: val, level: langLevelInput.trim() }] });
    setLangInput('');
    setLangLevelInput('');
  };

  const removeLanguage = (index: number) => {
    setData({ ...data, languages: data.languages.filter((_, i) => i !== index) });
  };

  const handleLanguageChange = (index: number, field: keyof LanguageItem, value: string) => {
    const newLangs = [...data.languages];
    newLangs[index] = { ...newLangs[index], [field]: value };
    setData({ ...data, languages: newLangs });
  };

  const addCertification = () => {
    const val = certInput.trim();
    if (!val) return;
    setData({ ...data, certifications: [...data.certifications, { name: val, desc: certDescInput.trim() }] });
    setCertInput('');
    setCertDescInput('');
  };

  const removeCertification = (index: number) => {
    setData({ ...data, certifications: data.certifications.filter((_, i) => i !== index) });
  };

  const handleCertificationChange = (index: number, field: keyof Certification, value: string) => {
    const newCerts = [...data.certifications];
    newCerts[index] = { ...newCerts[index], [field]: value };
    setData({ ...data, certifications: newCerts });
  };

  const isModern = activeTemplate === 'modern';
  const colors = data.modernColors ?? DEFAULT_MODERN_COLORS;

  const setModernColor = (key: keyof typeof colors, value: string) => {
    setData({ ...data, modernColors: { ...colors, [key]: value } });
  };

  const applyPreset = (presetColors: typeof colors) => {
    setData({ ...data, modernColors: { ...presetColors } });
  };

  return (
    <div className="space-y-8 pb-20">
      {isModern && (
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-700 pb-2">
            <Camera size={18} className="text-blue-600" /> {tr.form.photo}
          </h3>
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div
                className="relative w-44 h-44 overflow-hidden bg-zinc-200 dark:bg-zinc-700 select-none"
                style={{ ...getPhotoStyle(), cursor: data.photo ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
                onPointerDown={data.photo ? handlePointerDown : undefined}
                onPointerMove={data.photo ? handlePointerMove : undefined}
                onPointerUp={data.photo ? handlePointerUp : undefined}
                onPointerCancel={data.photo ? handlePointerUp : undefined}
                onWheel={data.photo ? handleWheel : undefined}
              >
                {data.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.photo}
                    alt="Profile"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    draggable={false}
                    style={{
                      transform: `scale(${data.photoZoom ?? 1}) translate(${data.photoOffsetX ?? 0}%, ${data.photoOffsetY ?? 0}%)`,
                    }}
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <User size={48} className="text-zinc-400" />
                  </div>
                )}
                {data.photo && (
                  <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${isDragging ? 'opacity-0' : 'opacity-0 hover:opacity-100'}`}>
                    <div className="bg-black/50 text-white text-[10px] px-2 py-1 rounded-full flex items-center gap-1">
                      <Move size={10} /> Drag to crop
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
              >
                {tr.form.uploadPhoto}
              </button>
              {data.photo && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 text-xs font-bold rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  {tr.form.removePhoto}
                </button>
              )}
            </div>

            {data.photo && (
              <div className="w-full space-y-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                <div className="flex items-center gap-2">
                  <ZoomOut size={14} className="text-zinc-400" />
                  <input
                    type="range" min="1" max="3" step="0.05"
                    value={data.photoZoom ?? 1}
                    onChange={(e) => setPhotoZoom(parseFloat(e.target.value))}
                    className="flex-1 accent-blue-600"
                  />
                  <ZoomIn size={14} className="text-zinc-400" />
                  <span className="text-[10px] text-zinc-500 w-10 text-right">{((data.photoZoom ?? 1) * 100).toFixed(0)}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 w-10">{tr.form.photoSize}</span>
                  <input
                    type="range" min="64" max="200" step="4"
                    value={data.photoSize ?? 128}
                    onChange={(e) => {
                      const v = parseInt(e.target.value);
                      setData({ ...data, photoSize: v, photoWidth: v, photoHeight: v });
                    }}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-[10px] text-zinc-500 w-10 text-right">{data.photoSize ?? 128}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 w-10">W</span>
                  <input
                    type="range" min="48" max="250" step="4"
                    value={data.photoWidth ?? data.photoSize ?? 128}
                    onChange={(e) => setData({ ...data, photoWidth: parseInt(e.target.value) })}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-[10px] text-zinc-500 w-10 text-right">{data.photoWidth ?? data.photoSize ?? 128}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 w-10">H</span>
                  <input
                    type="range" min="48" max="250" step="4"
                    value={data.photoHeight ?? data.photoSize ?? 128}
                    onChange={(e) => setData({ ...data, photoHeight: parseInt(e.target.value) })}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-[10px] text-zinc-500 w-10 text-right">{data.photoHeight ?? data.photoSize ?? 128}px</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 w-10">X</span>
                  <input
                    type="range" min="-50" max="50" step="1"
                    value={data.photoOffsetX ?? 0}
                    onChange={(e) => setData({ ...data, photoOffsetX: parseInt(e.target.value) })}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-[10px] text-zinc-500 w-10 text-right">{data.photoOffsetX ?? 0}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 w-10">Y</span>
                  <input
                    type="range" min="-50" max="50" step="1"
                    value={data.photoOffsetY ?? 0}
                    onChange={(e) => setData({ ...data, photoOffsetY: parseInt(e.target.value) })}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-[10px] text-zinc-500 w-10 text-right">{data.photoOffsetY ?? 0}%</span>
                </div>
                <button
                  type="button"
                  onClick={() => setData({ ...data, photoZoom: 1, photoOffsetX: 0, photoOffsetY: 0 })}
                  className="w-full text-[10px] text-zinc-500 hover:text-blue-600 py-1 transition-colors"
                >
                  ↺ Reset crop
                </button>

                <div className="border-t border-zinc-200 dark:border-zinc-700 my-1" />

                <div>
                  <span className="text-[10px] text-zinc-500 font-medium mb-2 block">{tr.form.photoShape}</span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {([
                      { id: 'square'  as PhotoShape, label: tr.form.square,       icon: '⬜' },
                      { id: 'rounded' as PhotoShape, label: tr.form.rounded,      icon: '🔲' },
                      { id: 'circle'  as PhotoShape, label: tr.form.circle,       icon: '⚪' },
                      { id: 'tilted'  as PhotoShape, label: tr.form.shapeTilted,  icon: '◇' },
                      { id: 'diamond' as PhotoShape, label: tr.form.shapeDiamond, icon: '💎' },
                      { id: 'hexagon' as PhotoShape, label: tr.form.shapeHexagon, icon: '⬡' },
                      { id: 'blob'    as PhotoShape, label: tr.form.shapeBlob,    icon: '🫧' },
                      { id: 'custom'  as PhotoShape, label: tr.form.shapeCustom,  icon: '✏️' },
                    ]).map((shape) => {
                      const isActive = currentShape === shape.id;
                      return (
                        <button
                          key={shape.id}
                          type="button"
                          onClick={() => shape.id === 'custom' ? setData({ ...data, photoShape: 'custom' }) : applyShape(shape.id)}
                          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg border-2 transition-all text-center ${
                            isActive
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                          }`}
                        >
                          <span className="text-base leading-none">{shape.icon}</span>
                          <span className="text-[9px] font-medium text-zinc-600 dark:text-zinc-400 leading-tight">{shape.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="border-t border-zinc-200 dark:border-zinc-700 my-1" />

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 w-16">{tr.form.borderColor}</span>
                  <input
                    type="color"
                    value={data.photoBorderColor ?? colors.accent}
                    onChange={(e) => setPhotoBorderColor(e.target.value)}
                    className="w-7 h-7 rounded cursor-pointer border-0 bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded"
                  />
                  <span className="text-[10px] text-zinc-400 font-mono uppercase">{data.photoBorderColor ?? colors.accent}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 w-16">{tr.form.borderWidth}</span>
                  <input
                    type="range" min="0" max="12" step="1"
                    value={data.photoBorderWidth ?? 4}
                    onChange={(e) => setPhotoBorderWidth(parseInt(e.target.value))}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-[10px] text-zinc-500 w-10 text-right">{data.photoBorderWidth ?? 4}px</span>
                </div>

                {currentShape === 'custom' && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 w-16">{tr.form.borderRadius}</span>
                      <div className="flex gap-1">
                        {[
                          { label: tr.form.circle, value: 50 },
                          { label: tr.form.rounded, value: 16 },
                          { label: tr.form.square, value: 4 },
                        ].map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setPhotoBorderRadius(opt.value)}
                            className={`px-2 py-0.5 rounded text-[9px] font-medium transition-colors ${
                              (data.photoBorderRadius ?? 16) === opt.value
                                ? 'bg-blue-600 text-white'
                                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
                            }`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                      <input
                        type="range" min="0" max="50" step="1"
                        value={data.photoBorderRadius ?? 16}
                        onChange={(e) => setPhotoBorderRadius(parseInt(e.target.value))}
                        className="flex-1 accent-blue-600"
                      />
                      <span className="text-[10px] text-zinc-500 w-10 text-right">{data.photoBorderRadius ?? 16}%</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-zinc-500 w-16">{tr.form.rotation}</span>
                      <input
                        type="range" min="-15" max="15" step="1"
                        value={data.photoRotation ?? 0}
                        onChange={(e) => setPhotoRotation(parseInt(e.target.value))}
                        className="flex-1 accent-blue-600"
                      />
                      <span className="text-[10px] text-zinc-500 w-10 text-right">{data.photoRotation ?? 0}°</span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {isModern && (
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-700 pb-2">
            <Award size={18} className="text-blue-600" /> {tr.form.logo}
          </h3>
          <div className="flex flex-col items-center gap-4">
            {data.logo && (
              <div
                className="w-20 h-20 overflow-hidden border border-zinc-200 dark:border-zinc-700 bg-white flex items-center justify-center"
                style={(() => {
                  const preset = LOGO_SHAPE_PRESETS.find(p => p.id === (data.logoShape ?? 'rounded')) ?? LOGO_SHAPE_PRESETS[1];
                  return { borderRadius: preset.borderRadius, clipPath: preset.clipPath };
                })()}
              >
                <img
                  src={data.logo} alt="Logo"
                  className="max-w-full max-h-full object-contain"
                  style={{ transform: `scale(${data.logoZoom ?? 1}) translate(${data.logoOffsetX ?? 0}%, ${data.logoOffsetY ?? 0}%)` }}
                />
              </div>
            )}
            <div className="flex gap-2 w-full">
              <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              <button
                type="button"
                onClick={() => logoInputRef.current?.click()}
                className="flex-1 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
              >
                {tr.form.uploadLogo}
              </button>
              {data.logo && (
                <button
                  type="button"
                  onClick={removeLogo}
                  className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 text-xs font-bold rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                >
                  {tr.form.removeLogo}
                </button>
              )}
            </div>
            <input
              value={data.logo?.startsWith('data:') ? '' : (data.logo ?? '')}
              onChange={(e) => handleLogoUrl(e.target.value)}
              placeholder={tr.form.logoUrl}
              className={inputCls}
            />

            {data.logo && (
              <div className="w-full space-y-3 p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                <div>
                  <span className="text-[10px] text-zinc-500 font-medium mb-2 block">{tr.form.logoShape}</span>
                  <div className="grid grid-cols-5 gap-1.5">
                    {([
                      { id: 'square'  as LogoShape, label: tr.form.square,       icon: '⬜' },
                      { id: 'rounded' as LogoShape, label: tr.form.rounded,      icon: '🔲' },
                      { id: 'circle'  as LogoShape, label: tr.form.circle,       icon: '⚪' },
                      { id: 'hexagon' as LogoShape, label: tr.form.shapeHexagon, icon: '⬡' },
                      { id: 'blob'    as LogoShape, label: tr.form.shapeBlob,    icon: '🫧' },
                    ]).map((shape) => {
                      const isActive = (data.logoShape ?? 'rounded') === shape.id;
                      return (
                        <button
                          key={shape.id}
                          type="button"
                          onClick={() => setData({ ...data, logoShape: shape.id })}
                          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg border-2 transition-all text-center ${
                            isActive
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                          }`}
                        >
                          <span className="text-base leading-none">{shape.icon}</span>
                          <span className="text-[9px] font-medium text-zinc-600 dark:text-zinc-400 leading-tight">{shape.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 w-10">{tr.form.logoSize}</span>
                  <input
                    type="range" min="32" max="96" step="4"
                    value={data.logoSize ?? 64}
                    onChange={(e) => setData({ ...data, logoSize: parseInt(e.target.value) })}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-[10px] text-zinc-500 w-10 text-right">{data.logoSize ?? 64}px</span>
                </div>

                <div className="flex items-center gap-2">
                  <ZoomOut size={14} className="text-zinc-400" />
                  <input
                    type="range" min="1" max="3" step="0.05"
                    value={data.logoZoom ?? 1}
                    onChange={(e) => setData({ ...data, logoZoom: Math.max(1, Math.min(3, parseFloat(e.target.value))) })}
                    className="flex-1 accent-blue-600"
                  />
                  <ZoomIn size={14} className="text-zinc-400" />
                  <span className="text-[10px] text-zinc-500 w-10 text-right">{((data.logoZoom ?? 1) * 100).toFixed(0)}%</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 w-10">X</span>
                  <input
                    type="range" min="-50" max="50" step="1"
                    value={data.logoOffsetX ?? 0}
                    onChange={(e) => setData({ ...data, logoOffsetX: parseInt(e.target.value) })}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-[10px] text-zinc-500 w-10 text-right">{data.logoOffsetX ?? 0}%</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-zinc-500 w-10">Y</span>
                  <input
                    type="range" min="-50" max="50" step="1"
                    value={data.logoOffsetY ?? 0}
                    onChange={(e) => setData({ ...data, logoOffsetY: parseInt(e.target.value) })}
                    className="flex-1 accent-blue-600"
                  />
                  <span className="text-[10px] text-zinc-500 w-10 text-right">{data.logoOffsetY ?? 0}%</span>
                </div>

                <button
                  type="button"
                  onClick={() => setData({ ...data, logoZoom: 1, logoOffsetX: 0, logoOffsetY: 0 })}
                  className="w-full text-[10px] text-zinc-500 hover:text-blue-600 py-1 transition-colors"
                >
                  ↺ {tr.form.resetLogo}
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {isModern && (
        <section className="space-y-4">
          <h3 className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-700 pb-2">
            <span className="w-4.5 h-4.5 rounded-full" style={{ background: `linear-gradient(135deg, ${colors.sidebar}, ${colors.accent})` }} />
            {tr.form.colorTheme}
          </h3>

          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 font-medium">{tr.form.presets}</p>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PRESETS.map((preset) => {
                const isActive = colors.sidebar === preset.colors.sidebar && colors.accent === preset.colors.accent;
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => applyPreset(preset.colors)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-lg border-2 transition-all ${
                      isActive
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]'
                        : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    <div className="flex gap-0.5">
                      <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ background: preset.colors.sidebar }} />
                      <span className="w-4 h-4 rounded-full border border-white/20 shadow-sm" style={{ background: preset.colors.accent }} />
                    </div>
                    <span className="text-[10px] font-medium text-zinc-600 dark:text-zinc-400">{preset.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-2 font-medium">{tr.form.custom}</p>
            <div className="grid grid-cols-2 gap-3">
              {([
                ['sidebar',     tr.form.sidebarColor,     colors.sidebar],
                ['accent',      tr.form.accentColor,      colors.accent],
                ['sidebarText', tr.form.sidebarTextColor,  colors.sidebarText],
                ['headingText', tr.form.headingTextColor,  colors.headingText],
                ['background',  tr.form.backgroundColor,   colors.background ?? '#ffffff'],
                ['bodyText',    tr.form.bodyTextColor,     colors.bodyText ?? '#52525b'],
              ] as const).map(([key, label, value]) => (
                <label key={key} className="flex items-center gap-2 p-2 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-zinc-200 dark:border-zinc-700">
                  <input
                    type="color"
                    value={value}
                    onChange={(e) => setModernColor(key, e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded"
                  />
                  <div className="flex flex-col">
                    <span className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300">{label}</span>
                    <span className="text-[10px] text-zinc-400 font-mono uppercase">{value}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="space-y-4">
        <h3 className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-700 pb-2">
          <User size={18} className="text-blue-600" /> {tr.form.personalInfo}
        </h3>
        <div className="grid gap-4">
          <input name="name" value={data.name} onChange={handleChange} placeholder={tr.form.fullName} className={inputCls} />
          <input name="title" value={data.title} onChange={handleChange} placeholder={tr.form.jobTitle} className={inputCls} />
          <input name="email" value={data.email} onChange={handleChange} placeholder={tr.form.email} className={inputCls} />
          <input name="phone" value={data.phone ?? ''} onChange={handleChange} placeholder={tr.form.phone} className={inputCls} />
          <input name="address" value={data.address ?? ''} onChange={handleChange} placeholder={tr.form.address} className={inputCls} />
          <input name="linkedin" value={data.linkedin ?? ''} onChange={handleChange} placeholder={tr.form.linkedin} className={inputCls} />
          <input name="website" value={data.website ?? ''} onChange={handleChange} placeholder={tr.form.website} className={inputCls} />
          <input name="github" value={data.github ?? ''} onChange={handleChange} placeholder={tr.form.github} className={inputCls} />
          <input name="twitter" value={data.twitter ?? ''} onChange={handleChange} placeholder={tr.form.twitter} className={inputCls} />
          <input name="instagram" value={data.instagram ?? ''} onChange={handleChange} placeholder={tr.form.instagram} className={inputCls} />
          <input name="dribbble" value={data.dribbble ?? ''} onChange={handleChange} placeholder={tr.form.dribbble} className={inputCls} />
          <input name="behance" value={data.behance ?? ''} onChange={handleChange} placeholder={tr.form.behance} className={inputCls} />
          <textarea name="about" value={data.about} onChange={handleChange} placeholder={tr.form.shortBio}
            className={`${inputCls} h-24`} />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-700 pb-2">
          <h3 className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
            <Briefcase size={18} className="text-blue-600" /> {tr.form.experience}
          </h3>
          <button onClick={addExperience} className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 rounded">
            <Plus size={20} />
          </button>
        </div>
        {data.experience.map((exp, index) => (
          <div key={index} className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/50 relative group">
            <button onClick={() => removeExperience(index)} className="absolute -top-2 -right-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={14} />
            </button>
            <div className="grid gap-3">
              <input value={exp.company} onChange={(e) => handleExperienceChange(index, 'company', e.target.value)} placeholder={tr.form.companyName} className={inlineCls} />
              <div className="flex gap-2">
                <input value={exp.role} onChange={(e) => handleExperienceChange(index, 'role', e.target.value)} placeholder={tr.form.role} className={`flex-1 ${inlineCls}`} />
                <input value={exp.year} onChange={(e) => handleExperienceChange(index, 'year', e.target.value)} placeholder={tr.form.year} className={`w-28 ${inlineCls}`} />
              </div>
              <textarea value={exp.desc} onChange={(e) => handleExperienceChange(index, 'desc', e.target.value)} placeholder={tr.form.description}
                className={`${inlineCls} h-16 w-full resize-none`} />
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-700 pb-2">
          <h3 className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
            <GraduationCap size={18} className="text-blue-600" /> {tr.form.education}
          </h3>
          <button onClick={addEducation} className="p-1 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 rounded">
            <Plus size={20} />
          </button>
        </div>
        {data.education.map((edu, index) => (
          <div key={index} className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/50 relative group">
            <button onClick={() => removeEducation(index)} className="absolute -top-2 -right-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={14} />
            </button>
            <div className="grid gap-3">
              <input value={edu.school} onChange={(e) => handleEducationChange(index, 'school', e.target.value)} placeholder={tr.form.schoolName} className={inlineCls} />
              <div className="flex gap-2">
                <input value={edu.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} placeholder={tr.form.degree} className={`flex-1 ${inlineCls}`} />
                <input value={edu.year} onChange={(e) => handleEducationChange(index, 'year', e.target.value)} placeholder={tr.form.year} className={`w-28 ${inlineCls}`} />
              </div>
              <input value={edu.field} onChange={(e) => handleEducationChange(index, 'field', e.target.value)} placeholder={tr.form.fieldOfStudy} className={inlineCls} />
              <textarea value={edu.desc} onChange={(e) => handleEducationChange(index, 'desc', e.target.value)} placeholder={tr.form.description}
                className={`${inlineCls} h-16 w-full resize-none`} />
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-700 pb-2">
          <h3 className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
            <Star size={18} className="text-blue-600" /> {tr.form.skills}
          </h3>
        </div>
        {data.skills.map((skill, i) => (
          <div key={i} className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/50 relative group">
            <button onClick={() => removeSkill(i)} className="absolute -top-2 -right-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={14} />
            </button>
            <div className="grid gap-3">
              <input value={skill.name} onChange={(e) => handleSkillChange(i, 'name', e.target.value)} placeholder={tr.form.skillName} className={inlineCls} />
              <textarea value={skill.desc} onChange={(e) => handleSkillChange(i, 'desc', e.target.value)} placeholder={tr.form.skillDesc}
                className={`${inlineCls} h-12 w-full resize-none`} />
            </div>
          </div>
        ))}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-600 space-y-2">
          <input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
            placeholder={tr.form.skillName}
            className={inputCls}
          />
          <textarea
            value={skillDescInput}
            onChange={(e) => setSkillDescInput(e.target.value)}
            placeholder={tr.form.skillDesc}
            className={`${inputCls} h-12 resize-none`}
          />
          <button onClick={addSkill} className="w-full flex items-center justify-center gap-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={14} /> {tr.form.addSkill}
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-700 pb-2">
          <h3 className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
            <Globe size={18} className="text-blue-600" />
            <input
              name="languagesHeader"
              value={data.languagesHeader ?? ''}
              onChange={handleChange}
              placeholder={tr.form.languages}
              className="bg-transparent outline-none font-bold text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 w-full"
            />
          </h3>
        </div>
        {data.languages.map((lang, i) => (
          <div key={i} className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/50 relative group">
            <button onClick={() => removeLanguage(i)} className="absolute -top-2 -right-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={14} />
            </button>
            <div className="grid gap-3">
              <input value={lang.name} onChange={(e) => handleLanguageChange(i, 'name', e.target.value)} placeholder={tr.form.languageName} className={inlineCls} />
              <input value={lang.level} onChange={(e) => handleLanguageChange(i, 'level', e.target.value)} placeholder={tr.form.languageLevel} className={inlineCls} />
            </div>
          </div>
        ))}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-600 space-y-2">
          <input
            value={langInput}
            onChange={(e) => setLangInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
            placeholder={tr.form.languageName}
            className={inputCls}
          />
          <input
            value={langLevelInput}
            onChange={(e) => setLangLevelInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
            placeholder={tr.form.languageLevel}
            className={inputCls}
          />
          <button onClick={addLanguage} className="w-full flex items-center justify-center gap-1 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors">
            <Plus size={14} /> {tr.form.addLanguage}
          </button>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-700 pb-2">
          <h3 className="flex items-center gap-2 font-bold text-zinc-900 dark:text-white">
            <Award size={18} className="text-blue-600" /> {tr.form.certifications}
          </h3>
        </div>
        {data.certifications.map((cert, i) => (
          <div key={i} className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-xl bg-zinc-50/50 dark:bg-zinc-800/50 relative group">
            <button onClick={() => removeCertification(i)} className="absolute -top-2 -right-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <Trash2 size={14} />
            </button>
            <div className="grid gap-3">
              <input value={cert.name} onChange={(e) => handleCertificationChange(i, 'name', e.target.value)} placeholder={tr.form.certName} className={inlineCls} />
              <textarea value={cert.desc} onChange={(e) => handleCertificationChange(i, 'desc', e.target.value)} placeholder={tr.form.certDesc}
                className={`${inlineCls} h-12 w-full resize-none`} />
            </div>
          </div>
        ))}
        <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-600 space-y-2">
          <input
            value={certInput}
            onChange={(e) => setCertInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
            placeholder={tr.form.certName}
            className={inputCls}
          />
          <textarea
            value={certDescInput}
            onChange={(e) => setCertDescInput(e.target.value)}
            placeholder={tr.form.certDesc}
            className={`${inputCls} h-12 resize-none`}
          />
          <button onClick={addCertification} className="w-full flex items-center justify-center gap-1 py-2 bg-purple-600 text-white text-xs font-bold rounded-lg hover:bg-purple-700 transition-colors">
            <Plus size={14} /> {tr.form.addCertification}
          </button>
        </div>
      </section>
    </div>
  );
}
