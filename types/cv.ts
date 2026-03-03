export interface Experience {
  company: string;
  role: string;
  year: string;
  desc: string;
}

export interface Education {
  school: string;
  degree: string;
  field: string;
  year: string;
  desc: string;
}

export interface Skill {
  name: string;
  desc: string;
}

export interface LanguageItem {
  name: string;
  level: string;
}

export interface Certification {
  name: string;
  desc: string;
}

export type PhotoShape = 'square' | 'rounded' | 'circle' | 'tilted' | 'diamond' | 'hexagon' | 'blob' | 'custom';

export interface PhotoShapePreset {
  id: PhotoShape;
  borderRadius: string;
  rotation: number;
  clipPath?: string;
}

export const PHOTO_SHAPE_PRESETS: PhotoShapePreset[] = [
  { id: 'square',   borderRadius: '4px',  rotation: 0 },
  { id: 'rounded',  borderRadius: '16px', rotation: 0 },
  { id: 'circle',   borderRadius: '50%',  rotation: 0 },
  { id: 'tilted',   borderRadius: '16px', rotation: 5 },
  { id: 'diamond',  borderRadius: '12px', rotation: 45 },
  { id: 'hexagon',  borderRadius: '0',    rotation: 0, clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' },
  { id: 'blob',     borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%', rotation: 0 },
];

export interface ModernColors {
  sidebar: string;
  accent: string;
  sidebarText: string;
  headingText: string;
  background: string;
  bodyText: string;
}

export const COLOR_PRESETS: { name: string; colors: ModernColors }[] = [
  { name: 'Midnight',   colors: { sidebar: '#1a1a1a', accent: '#2563eb', sidebarText: '#a1a1aa', headingText: '#18181b', background: '#ffffff', bodyText: '#52525b' } },
  { name: 'Ocean',      colors: { sidebar: '#0c4a6e', accent: '#38bdf8', sidebarText: '#bae6fd', headingText: '#0c4a6e', background: '#f0f9ff', bodyText: '#334155' } },
  { name: 'Forest',     colors: { sidebar: '#14532d', accent: '#4ade80', sidebarText: '#bbf7d0', headingText: '#14532d', background: '#f0fdf4', bodyText: '#334155' } },
  { name: 'Wine',       colors: { sidebar: '#4c0519', accent: '#fb7185', sidebarText: '#fecdd3', headingText: '#4c0519', background: '#fff1f2', bodyText: '#44403c' } },
  { name: 'Sunset',     colors: { sidebar: '#7c2d12', accent: '#fb923c', sidebarText: '#fed7aa', headingText: '#7c2d12', background: '#fff7ed', bodyText: '#44403c' } },
  { name: 'Royal',      colors: { sidebar: '#312e81', accent: '#a78bfa', sidebarText: '#c4b5fd', headingText: '#312e81', background: '#f5f3ff', bodyText: '#3f3f46' } },
  { name: 'Slate',      colors: { sidebar: '#1e293b', accent: '#64748b', sidebarText: '#cbd5e1', headingText: '#1e293b', background: '#f8fafc', bodyText: '#475569' } },
  { name: 'Rose',       colors: { sidebar: '#881337', accent: '#f43f5e', sidebarText: '#ffe4e6', headingText: '#881337', background: '#fff1f2', bodyText: '#44403c' } },
];

export const DEFAULT_MODERN_COLORS: ModernColors = COLOR_PRESETS[0].colors;

export type LogoShape = 'square' | 'rounded' | 'circle' | 'hexagon' | 'blob';

export interface LogoShapePreset {
  id: LogoShape;
  borderRadius: string;
  clipPath?: string;
}

export const LOGO_SHAPE_PRESETS: LogoShapePreset[] = [
  { id: 'square',  borderRadius: '4px' },
  { id: 'rounded', borderRadius: '12px' },
  { id: 'circle',  borderRadius: '50%' },
  { id: 'hexagon', borderRadius: '0', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' },
  { id: 'blob',    borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
];

export interface CVData {
  name: string;
  title: string;
  email: string;
  phone?: string;
  about: string;
  photo?: string;
  photoZoom?: number;
  photoOffsetX?: number;
  photoOffsetY?: number;
  photoBorderColor?: string;
  photoBorderWidth?: number;
  photoBorderRadius?: number;
  photoRotation?: number;
  photoShape?: PhotoShape;
  photoSize?: number;
  photoWidth?: number;
  photoHeight?: number;
  address?: string;
  linkedin?: string;
  website?: string;
  github?: string;
  twitter?: string;
  instagram?: string;
  dribbble?: string;
  behance?: string;
  skills: Skill[];
  education: Education[];
  languages: LanguageItem[];
  languagesHeader?: string;
  certifications: Certification[];
  experience: Experience[];
  modernColors?: ModernColors;
  logo?: string;
  logoShape?: LogoShape;
  logoSize?: number;
  logoZoom?: number;
  logoOffsetX?: number;
  logoOffsetY?: number;
}
