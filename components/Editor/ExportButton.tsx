"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Download, FileText, Image, ChevronDown, X, Loader2 } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

type ExportFormat = 'pdf' | 'png' | 'jpeg';
type Resolution = { label: string; scale: number; desc: string };

const RESOLUTIONS: Resolution[] = [
  { label: '1x', scale: 1, desc: '72 DPI' },
  { label: '2x', scale: 2, desc: '144 DPI' },
  { label: '3x', scale: 3, desc: '216 DPI' },
  { label: '4x', scale: 4, desc: '300 DPI' },
];

interface ExportButtonProps {
  targetRef: React.RefObject<HTMLDivElement | null>;
  fileName?: string;
}

export default function ExportButton({ targetRef, fileName = 'cv-export' }: ExportButtonProps) {
  const { tr } = useSettings();
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<ExportFormat>('pdf');
  const [resolution, setResolution] = useState<Resolution>(RESOLUTIONS[1]); // 2x default
  const [exporting, setExporting] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleExport = async () => {
    const el = targetRef.current;
    if (!el) return;

    setExporting(true);
    try {
      const html2canvas = (await import('html2canvas-pro')).default;

      const canvas = await html2canvas(el, {
        scale: resolution.scale,
        useCORS: true,
        allowTaint: true,
        backgroundColor: null,
        logging: false,
      });

      if (format === 'pdf') {
        const { jsPDF } = await import('jspdf');

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const orientation = imgWidth > imgHeight ? 'landscape' : 'portrait';
        const pdf = new jsPDF({
          orientation,
          unit: 'px',
          format: [imgWidth / resolution.scale, imgHeight / resolution.scale],
          hotfixes: ['px_scaling'],
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(
          canvas.toDataURL('image/png', 1.0),
          'PNG',
          0,
          0,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );

        pdf.save(`${fileName}.pdf`);
      } else {
        const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';
        const quality = format === 'jpeg' ? 0.95 : undefined;
        const dataUrl = canvas.toDataURL(mimeType, quality);

        const link = document.createElement('a');
        link.download = `${fileName}.${format}`;
        link.href = dataUrl;
        link.click();
      }

      setOpen(false);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setExporting(false);
    }
  };

  const exp = tr.export;

  return (
    <div className="relative" ref={panelRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all"
      >
        <Download size={18} />
        {exp.download}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-200 dark:border-zinc-700">
            <span className="text-sm font-bold text-zinc-900 dark:text-white">{exp.exportOptions}</span>
            <button onClick={() => setOpen(false)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
              <X size={16} />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">{exp.format}</p>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { id: 'pdf' as ExportFormat, icon: FileText, label: 'PDF', color: 'text-red-500' },
                  { id: 'png' as ExportFormat, icon: Image, label: 'PNG', color: 'text-blue-500' },
                  { id: 'jpeg' as ExportFormat, icon: Image, label: 'JPEG', color: 'text-green-500' },
                ]).map((fmt) => {
                  const isActive = format === fmt.id;
                  return (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => setFormat(fmt.id)}
                      className={`flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                      }`}
                    >
                      <fmt.icon size={20} className={fmt.color} />
                      <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">{fmt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">{exp.resolution}</p>
              <div className="grid grid-cols-4 gap-1.5">
                {RESOLUTIONS.map((res) => {
                  const isActive = resolution.scale === res.scale;
                  return (
                    <button
                      key={res.label}
                      type="button"
                      onClick={() => setResolution(res)}
                      className={`flex flex-col items-center gap-0.5 p-2 rounded-lg border-2 transition-all ${
                        isActive
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600'
                      }`}
                    >
                      <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{res.label}</span>
                      <span className="text-[9px] text-zinc-400">{res.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
              {format === 'pdf' ? exp.pdfHint : exp.imageHint}
              {' '}{exp.resolutionHint.replace('{scale}', resolution.label)}
            </p>

            <button
              type="button"
              onClick={handleExport}
              disabled={exporting}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {exporting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  {exp.exporting}
                </>
              ) : (
                <>
                  <Download size={16} />
                  {exp.downloadAs.replace('{format}', format.toUpperCase())}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
