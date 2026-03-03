"use client";
import { useRef, useSyncExternalStore, useCallback } from 'react';

import type { CVData } from '@/types/cv';
import { cvStore, emitCVChange, tabStore, emitTabChange } from '@/lib/cvStore';
import { useSettings } from '@/context/SettingsContext';
import Navigation from '@/components/Navigation';
import SettingsPage from '@/components/SettingsPage';
import FormCV from '@/components/Editor/FormCV';
import ExportButton from '@/components/Editor/ExportButton';
import TemplateBasic from '@/components/Templates/TemplateBasic';
import TemplateModern from '@/components/Templates/TemplateModern';

export default function CVGenerator() {
  const { tr } = useSettings();

  const cvData = useSyncExternalStore(cvStore.subscribe, cvStore.getSnapshot, cvStore.getServerSnapshot);
  const setCvData: React.Dispatch<React.SetStateAction<CVData>> = useCallback((action) => {
    const next = typeof action === 'function' ? action(cvStore.getSnapshot()) : action;
    emitCVChange(next);
  }, []);

  const tab = useSyncExternalStore(tabStore.subscribe, tabStore.getSnapshot, tabStore.getServerSnapshot);
  const activePage = tab.activePage;
  const activeTemplate = tab.activeTemplate;
  const setActivePage = useCallback((p: 'editor' | 'settings') => emitTabChange({ ...tabStore.getSnapshot(), activePage: p }), []);
  const setActiveTemplate = useCallback((t: string) => emitTabChange({ ...tabStore.getSnapshot(), activeTemplate: t }), []);

  const desktopPreviewRef = useRef<HTMLDivElement>(null);
  const mobilePreviewRef = useRef<HTMLDivElement>(null);
  const exportRef = useRef<HTMLDivElement>(null);

  const desktopRefCb = useCallback((node: HTMLDivElement | null) => {
    (desktopPreviewRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    if (node && window.innerWidth >= 1024) {
      (exportRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
  }, []);

  const mobileRefCb = useCallback((node: HTMLDivElement | null) => {
    (mobilePreviewRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    if (node && window.innerWidth < 1024) {
      (exportRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
    }
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Navigation activePage={activePage} onNavigate={setActivePage} />

      {activePage === 'settings' ? (
        <SettingsPage />
      ) : (
        <main className="flex flex-col lg:flex-row lg:h-[calc(100vh-57px)]">
          <div className="w-full lg:w-1/3 p-6 border-r border-zinc-200 dark:border-zinc-700 lg:overflow-y-auto bg-white dark:bg-zinc-900">
            <h2 className="text-xl font-bold mb-4 text-zinc-900 dark:text-white">{tr.editor.title}</h2>

            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setActiveTemplate('basic')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                  activeTemplate === 'basic'
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {tr.editor.atsBasic}
              </button>
              <button
                onClick={() => setActiveTemplate('modern')}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                  activeTemplate === 'modern'
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'
                }`}
              >
                {tr.editor.modernVisual}
              </button>
            </div>

            <FormCV data={cvData} setData={setCvData} activeTemplate={activeTemplate} />

            <div className="mt-8">
              <ExportButton targetRef={exportRef} fileName={cvData.name ? cvData.name.replace(/\s+/g, '-').toLowerCase() : 'cv-export'} />
            </div>

            <div className="mt-8 lg:hidden">
              <h2 className="text-lg font-bold mb-4 text-zinc-900 dark:text-white border-b border-zinc-200 dark:border-zinc-700 pb-2">
                {tr.editor.preview}
              </h2>
              <div className="bg-zinc-100 dark:bg-zinc-950 rounded-xl p-4 overflow-x-auto">
                <div ref={mobileRefCb} className="min-w-[595px] mx-auto shadow-2xl">
                  {activeTemplate === 'basic' ? (
                    <TemplateBasic data={cvData} tr={tr} />
                  ) : (
                    <TemplateModern data={cvData} tr={tr} />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex flex-1 bg-zinc-100 dark:bg-zinc-950 p-10 justify-center overflow-y-auto">
            <div ref={desktopRefCb} className="shadow-2xl">
              {activeTemplate === 'basic' ? (
                <TemplateBasic data={cvData} tr={tr} />
              ) : (
                <TemplateModern data={cvData} tr={tr} />
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}