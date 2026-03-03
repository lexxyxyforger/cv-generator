import type { CVData } from '@/types/cv';
import { DEFAULT_MODERN_COLORS } from '@/types/cv';

const STORAGE_KEY = 'cv-generator-data';

export const defaultCVData: CVData = {
  name: "Azizi Shafaa Asadel",
  title: "Frontend Developer",
  email: "azizi@example.com",
  about: "Student yang fokus pada coding dan design.",
  phone: "",
  address: "",
  linkedin: "",
  website: "",
  skills: [],
  education: [],
  languages: [],
  certifications: [],
  experience: [{ company: "Tech Corp", role: "Intern", year: "2025", desc: "" }],
  modernColors: DEFAULT_MODERN_COLORS,
};

let listeners: Array<() => void> = [];
let cachedSnapshot: CVData = defaultCVData;

function subscribe(cb: () => void) {
  listeners = [...listeners, cb];
  return () => {
    listeners = listeners.filter((l) => l !== cb);
  };
}

function getSnapshot(): CVData {
  return cachedSnapshot;
}

function getServerSnapshot(): CVData {
  return defaultCVData;
}

function loadCVData(): CVData {
  if (typeof window === 'undefined') return defaultCVData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<CVData>;
      return { ...defaultCVData, ...parsed };
    }
  } catch {
  }
  return defaultCVData;
}

function saveCVData(data: CVData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
  }
}

export function emitCVChange(next: CVData) {
  cachedSnapshot = next;
  saveCVData(next);
  listeners.forEach((l) => l());
}

if (typeof window !== 'undefined') {
  cachedSnapshot = loadCVData();
}

export const cvStore = { subscribe, getSnapshot, getServerSnapshot };

const TAB_KEY = 'cv-generator-tab';

interface TabState {
  activePage: 'editor' | 'settings';
  activeTemplate: string;
}

const defaultTab: TabState = { activePage: 'editor', activeTemplate: 'basic' };

let tabListeners: Array<() => void> = [];
let cachedTab: TabState = defaultTab;

function tabSubscribe(cb: () => void) {
  tabListeners = [...tabListeners, cb];
  return () => { tabListeners = tabListeners.filter((l) => l !== cb); };
}

function getTabSnapshot(): TabState {
  return cachedTab;
}

function getTabServerSnapshot(): TabState {
  return defaultTab;
}

function loadTab(): TabState {
  if (typeof window === 'undefined') return defaultTab;
  try {
    const raw = localStorage.getItem(TAB_KEY);
    if (raw) return { ...defaultTab, ...JSON.parse(raw) };
  } catch { /* ignore */ }
  return defaultTab;
}

function saveTab(t: TabState) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(TAB_KEY, JSON.stringify(t)); } catch { /* ignore */ }
}

export function emitTabChange(next: TabState) {
  cachedTab = next;
  saveTab(next);
  tabListeners.forEach((l) => l());
}

if (typeof window !== 'undefined') {
  cachedTab = loadTab();
}

export const tabStore = { subscribe: tabSubscribe, getSnapshot: getTabSnapshot, getServerSnapshot: getTabServerSnapshot };
