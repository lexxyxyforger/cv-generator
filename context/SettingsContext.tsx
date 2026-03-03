"use client";
import React, { createContext, useContext, useEffect, useCallback, useSyncExternalStore } from 'react';
import type { Settings, Theme, Language } from '@/lib/settings';
import { defaultSettings, loadSettings, saveSettings } from '@/lib/settings';
import { t, type TranslationKey } from '@/lib/i18n';

let listeners: Array<() => void> = [];
let cachedSnapshot: Settings = defaultSettings;

function subscribe(cb: () => void) {
  listeners = [...listeners, cb];
  return () => { listeners = listeners.filter(l => l !== cb); };
}

function getSnapshot(): Settings {
  return cachedSnapshot;
}

function getServerSnapshot(): Settings {
  return defaultSettings;
}

function emitChange(next: Settings) {
  cachedSnapshot = next;
  saveSettings(next);
  listeners.forEach(l => l());
}

if (typeof window !== 'undefined') {
  cachedSnapshot = loadSettings();
}

interface SettingsContextValue {
  settings: Settings;
  setTheme: (theme: Theme) => void;
  setLanguage: (lang: Language) => void;
  tr: TranslationKey;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const settings = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const root = document.documentElement;
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [settings.theme]);

  const setTheme = useCallback((theme: Theme) => {
    emitChange({ ...settings, theme });
  }, [settings]);

  const setLanguage = useCallback((lang: Language) => {
    emitChange({ ...settings, language: lang });
  }, [settings]);

  const tr = t(settings.language);

  return (
    <SettingsContext.Provider value={{ settings, setTheme, setLanguage, tr }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
