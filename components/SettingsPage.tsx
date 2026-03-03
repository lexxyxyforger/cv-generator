"use client";
import { useSettings } from '@/context/SettingsContext';
import { Sun, Moon, Globe, Check } from 'lucide-react';

export default function SettingsPage() {
  const { settings, setTheme, setLanguage, tr } = useSettings();

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">{tr.settings.title}</h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-10">{tr.settings.subtitle}</p>

      <section className="mb-10">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-2 flex items-center gap-2">
          <Sun size={16} className="text-blue-600" />
          {tr.settings.appearance}
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">{tr.settings.appearanceDesc}</p>
        <div className="flex gap-3">
          <button
            onClick={() => setTheme('light')}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              settings.theme === 'light'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Sun size={20} className={settings.theme === 'light' ? 'text-blue-600' : 'text-zinc-400 dark:text-zinc-500'} />
              {settings.theme === 'light' && <Check size={16} className="text-blue-600" />}
            </div>
            <p className={`text-sm font-bold ${settings.theme === 'light' ? 'text-blue-600' : 'text-zinc-700 dark:text-zinc-300'}`}>
              {tr.settings.lightMode}
            </p>
            <div className="mt-3 h-16 rounded-lg bg-white border border-zinc-200 flex overflow-hidden">
              <div className="w-1/3 bg-zinc-50 border-r border-zinc-200" />
              <div className="flex-1 p-2 space-y-1">
                <div className="h-2 w-3/4 bg-zinc-200 rounded" />
                <div className="h-2 w-1/2 bg-zinc-100 rounded" />
              </div>
            </div>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`flex-1 p-4 rounded-xl border-2 transition-all ${
              settings.theme === 'dark'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <Moon size={20} className={settings.theme === 'dark' ? 'text-blue-600' : 'text-zinc-400 dark:text-zinc-500'} />
              {settings.theme === 'dark' && <Check size={16} className="text-blue-600" />}
            </div>
            <p className={`text-sm font-bold ${settings.theme === 'dark' ? 'text-blue-600' : 'text-zinc-700 dark:text-zinc-300'}`}>
              {tr.settings.darkMode}
            </p>
            <div className="mt-3 h-16 rounded-lg bg-zinc-900 border border-zinc-700 flex overflow-hidden">
              <div className="w-1/3 bg-zinc-800 border-r border-zinc-700" />
              <div className="flex-1 p-2 space-y-1">
                <div className="h-2 w-3/4 bg-zinc-700 rounded" />
                <div className="h-2 w-1/2 bg-zinc-800 rounded" />
              </div>
            </div>
          </button>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-widest mb-2 flex items-center gap-2">
          <Globe size={16} className="text-blue-600" />
          {tr.settings.language}
        </h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">{tr.settings.languageDesc}</p>
        <div className="flex gap-3">
          <button
            onClick={() => setLanguage('en')}
            className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              settings.language === 'en'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
            }`}
          >
            <span className="text-2xl">🇬🇧</span>
            <div className="text-left">
              <p className={`text-sm font-bold ${settings.language === 'en' ? 'text-blue-600' : 'text-zinc-700 dark:text-zinc-300'}`}>
                {tr.settings.english}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">English</p>
            </div>
            {settings.language === 'en' && <Check size={16} className="text-blue-600 ml-auto" />}
          </button>

          <button
            onClick={() => setLanguage('id')}
            className={`flex-1 flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
              settings.language === 'id'
                ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
            }`}
          >
            <span className="text-2xl">🇮🇩</span>
            <div className="text-left">
              <p className={`text-sm font-bold ${settings.language === 'id' ? 'text-blue-600' : 'text-zinc-700 dark:text-zinc-300'}`}>
                {tr.settings.indonesian}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">Bahasa Indonesia</p>
            </div>
            {settings.language === 'id' && <Check size={16} className="text-blue-600 ml-auto" />}
          </button>
        </div>
      </section>

      <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
        <Check size={14} />
        {tr.settings.saved}
      </div>

      <div className="mt-16 pt-6 border-t border-zinc-200 dark:border-zinc-700 text-center">
        <p className="text-xs text-zinc-400 dark:text-zinc-500">
          CV Generator Pro &middot; {tr.settings.madeBy}{' '}
          <span className="font-semibold text-zinc-600 dark:text-zinc-400">Nightfall</span>
        </p>
        <p className="text-[10px] text-zinc-400 dark:text-zinc-600 mt-1">v0.1.0 &middot; Next.js + Tailwind CSS</p>
      </div>
    </div>
  );
}
