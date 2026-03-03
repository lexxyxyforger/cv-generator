"use client";
import { useSettings } from '@/context/SettingsContext';
import { Sun, Moon, FileText, Settings } from 'lucide-react';

interface NavProps {
  activePage: 'editor' | 'settings';
  onNavigate: (page: 'editor' | 'settings') => void;
}

export default function Navigation({ activePage, onNavigate }: NavProps) {
  const { settings, setTheme, tr } = useSettings();
  const isDark = settings.theme === 'dark';

  return (
    <nav className="w-full border-b border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
          <FileText size={18} className="text-white" />
        </div>
        <span className="font-bold text-zinc-900 dark:text-white text-lg">CV Generator<span className="text-blue-600">Pro</span></span>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => onNavigate('editor')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activePage === 'editor'
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <FileText size={16} />
          {tr.nav.editor}
        </button>
        <button
          onClick={() => onNavigate('settings')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activePage === 'settings'
              ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Settings size={16} />
          {tr.nav.settings}
        </button>
      </div>

      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>
    </nav>
  );
}
