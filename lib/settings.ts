export type Language = 'en' | 'id';
export type Theme = 'light' | 'dark';

export interface Settings {
  theme: Theme;
  language: Language;
}

export const defaultSettings: Settings = {
  theme: 'light',
  language: 'en',
};

const STORAGE_KEY = 'cv-generator-settings';

export function loadSettings(): Settings {
  if (typeof window === 'undefined') return defaultSettings;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<Settings>;
      return { ...defaultSettings, ...parsed };
    }
  } catch {
  }
  return defaultSettings;
}

export function saveSettings(settings: Settings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}
