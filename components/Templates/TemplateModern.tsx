import type { CVData } from '@/types/cv';
import { DEFAULT_MODERN_COLORS, PHOTO_SHAPE_PRESETS, LOGO_SHAPE_PRESETS } from '@/types/cv';
import type { TranslationKey } from '@/lib/i18n';

export default function TemplateModern({ data, tr }: { data: CVData; tr?: TranslationKey }) {
  const c = data.modernColors ?? DEFAULT_MODERN_COLORS;

  const getPhotoStyle = (): React.CSSProperties => {
    const shape = data.photoShape ?? 'tilted';
    if (shape === 'custom') {
      return {
        borderColor: data.photoBorderColor ?? `${c.accent}80`,
        borderWidth: `${data.photoBorderWidth ?? 4}px`,
        borderStyle: 'solid',
        borderRadius: `${data.photoBorderRadius ?? 16}px`,
        transform: `rotate(${data.photoRotation ?? 0}deg)`,
        backgroundColor: `${c.sidebar}cc`,
      };
    }
    const preset = PHOTO_SHAPE_PRESETS.find(p => p.id === shape) ?? PHOTO_SHAPE_PRESETS[1];
    return {
      borderColor: data.photoBorderColor ?? `${c.accent}80`,
      borderWidth: `${data.photoBorderWidth ?? 4}px`,
      borderStyle: 'solid',
      borderRadius: preset.borderRadius,
      transform: `rotate(${preset.rotation}deg)`,
      clipPath: preset.clipPath,
      backgroundColor: `${c.sidebar}cc`,
    };
  };

  return (
    <div className="flex min-h-[297mm] w-[210mm] shadow-inner" style={{ backgroundColor: c.background ?? '#ffffff' }}>
      <div className="w-1/3 text-white p-8" style={{ backgroundColor: c.sidebar }}>
        <div
          className="mb-8 mx-auto flex items-center justify-center overflow-hidden shadow-xl"
          style={{ ...getPhotoStyle(), width: data.photoWidth ?? data.photoSize ?? 128, height: data.photoHeight ?? data.photoSize ?? 128 }}
        >
          {data.photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.photo}
              alt={data.name}
              className="w-full h-full object-cover"
              style={{
                transform: `scale(${data.photoZoom ?? 1}) translate(${data.photoOffsetX ?? 0}%, ${data.photoOffsetY ?? 0}%)`,
              }}
            />
          ) : (
            <span className="text-4xl font-black" style={{ color: c.sidebarText }}>{data.name?.[0] ?? "?"}</span>
          )}
        </div>
        
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: c.accent }}>{tr?.template.contact ?? "Contact"}</h3>
        <p className="text-[10px] mb-1" style={{ color: c.sidebarText }}>{data.email}</p>
        <p className="text-[10px] mb-1" style={{ color: c.sidebarText }}>{data.phone || "0812-3456-7890"}</p>
        {data.address && <p className="text-[10px] mb-1" style={{ color: c.sidebarText }}>{data.address}</p>}
        {data.linkedin && <p className="text-[10px] mb-1" style={{ color: c.sidebarText }}>{data.linkedin}</p>}
        {data.website && <p className="text-[10px] mb-1" style={{ color: c.sidebarText }}>{data.website}</p>}
        {data.github && <p className="text-[10px] mb-1" style={{ color: c.sidebarText }}>{data.github}</p>}
        {data.twitter && <p className="text-[10px] mb-1" style={{ color: c.sidebarText }}>{data.twitter}</p>}
        {data.instagram && <p className="text-[10px] mb-1" style={{ color: c.sidebarText }}>{data.instagram}</p>}
        {data.dribbble && <p className="text-[10px] mb-1" style={{ color: c.sidebarText }}>{data.dribbble}</p>}
        {data.behance && <p className="text-[10px] mb-1" style={{ color: c.sidebarText }}>{data.behance}</p>}
        <div className="mb-8" />

        {data.skills.length > 0 && (
          <>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: c.accent }}>{tr?.template.skills ?? "Skills"}</h3>
            <div className="space-y-2 mb-8">
              {data.skills.map((s, i) => (
                <div key={i}>
                  <span className="px-2 py-1 rounded text-[9px] inline-block" style={{ backgroundColor: `${c.accent}20`, color: c.sidebarText }}>{s.name}</span>
                  {s.desc && <p className="text-[9px] mt-0.5 opacity-70" style={{ color: c.sidebarText }}>{s.desc}</p>}
                </div>
              ))}
            </div>
          </>
        )}

        {data.languages.length > 0 && (
          <>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: c.accent }}>{data.languagesHeader || tr?.template.languages || "Languages"}</h3>
            <div className="space-y-1.5 mb-8">
              {data.languages.map((l, i) => (
                <div key={i} className="flex justify-between items-center">
                  <span className="text-[10px]" style={{ color: c.sidebarText }}>{l.name}</span>
                  {l.level && <span className="text-[9px] opacity-70" style={{ color: c.sidebarText }}>{l.level}</span>}
                </div>
              ))}
            </div>
          </>
        )}

        {data.certifications.length > 0 && (
          <>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: c.accent }}>{tr?.template.certifications ?? "Certifications"}</h3>
            <div className="space-y-2 mb-8">
              {data.certifications.map((cert, i) => (
                <div key={i}>
                  <p className="text-[10px] font-medium" style={{ color: c.sidebarText }}>• {cert.name}</p>
                  {cert.desc && <p className="text-[9px] ml-3 opacity-70" style={{ color: c.sidebarText }}>{cert.desc}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="flex-1 p-12 relative" style={{ backgroundColor: c.background ?? '#ffffff' }}>
        {data.logo && (
          <div
            className="absolute top-6 right-6 flex items-center justify-center overflow-hidden"
            style={(() => {
              const size = data.logoSize ?? 64;
              const preset = LOGO_SHAPE_PRESETS.find(p => p.id === (data.logoShape ?? 'rounded')) ?? LOGO_SHAPE_PRESETS[1];
              return { width: size, height: size, borderRadius: preset.borderRadius, clipPath: preset.clipPath };
            })()}
          >
            <img
              src={data.logo} alt="Logo"
              className="w-full h-full object-contain"
              style={{ transform: `scale(${data.logoZoom ?? 1}) translate(${data.logoOffsetX ?? 0}%, ${data.logoOffsetY ?? 0}%)` }}
            />
          </div>
        )}
        <h1 className="text-4xl font-black mb-2 leading-tight wrap-break-word" style={{ color: c.headingText }}>{data.name || ""}<span style={{ color: c.accent }}>.</span></h1>
        <p className="text-xl font-medium mb-6 wrap-break-word" style={{ color: c.bodyText ?? '#a1a1aa' }}>{data.title}</p>

        {data.about && (
          <p className="text-[11px] leading-relaxed mb-10 border-l-2 pl-4" style={{ borderColor: c.accent, color: c.bodyText ?? '#52525b' }}>{data.about}</p>
        )}

        <div className="space-y-10">
          <section>
            <h4 className="text-xs font-black uppercase tracking-widest mb-6" style={{ color: c.accent }}>{tr?.template.workHistory ?? "Work History"}</h4>
            {data.experience.map((exp, i) => (
              <div key={i} className="mb-8 group">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-2 h-2 rounded-full group-hover:scale-150 transition-transform" style={{ backgroundColor: c.accent }}></div>
                  <span className="font-bold text-xs" style={{ color: c.accent }}>{exp.year}</span>
                </div>
                <h5 className="font-bold" style={{ color: c.headingText }}>{exp.role}</h5>
                <p className="text-xs mb-2" style={{ color: c.bodyText ?? '#52525b' }}>{exp.company}</p>
                <p className="text-[11px] leading-relaxed" style={{ color: `${c.bodyText ?? '#52525b'}cc` }}>{exp.desc}</p>
              </div>
            ))}
          </section>

          {data.education.length > 0 && (
            <section>
              <h4 className="text-xs font-black uppercase tracking-widest mb-6" style={{ color: c.accent }}>{tr?.template.education ?? "Education"}</h4>
              {data.education.map((edu, i) => (
                <div key={i} className="mb-6 group">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-2 h-2 rounded-full group-hover:scale-150 transition-transform" style={{ backgroundColor: c.accent }}></div>
                    <span className="font-bold text-xs" style={{ color: c.accent }}>{edu.year}</span>
                  </div>
                  <h5 className="font-bold" style={{ color: c.headingText }}>{edu.degree}{edu.field ? ` — ${edu.field}` : ''}</h5>
                  <p className="text-xs mb-2" style={{ color: c.bodyText ?? '#52525b' }}>{edu.school}</p>
                  {edu.desc && <p className="text-[11px] leading-relaxed" style={{ color: `${c.bodyText ?? '#52525b'}cc` }}>{edu.desc}</p>}
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}