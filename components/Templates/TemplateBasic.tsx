import type { CVData } from '@/types/cv';
import type { TranslationKey } from '@/lib/i18n';

export default function TemplateBasic({ data, tr }: { data: CVData; tr?: TranslationKey }) {
  return (
    <div className="text-black font-serif bg-white w-[210mm] min-h-[297mm] p-12">
      <div className="text-center border-b-2 border-zinc-800 pb-6">
        <h1 className="text-4xl font-black tracking-tight uppercase wrap-break-word">{data.name || (tr?.template.yourName ?? "YOUR NAME")}</h1>
        <p className="text-lg mt-1 text-zinc-800 wrap-break-word">{data.title || (tr?.template.professionalTitle ?? "Professional Title")}</p>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2 text-sm text-zinc-600">
          {data.email && <span>{data.email}</span>}
          {data.phone && <><span>|</span><span>{data.phone}</span></>}
          {data.address && <><span>|</span><span>{data.address}</span></>}
        </div>
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1 text-sm text-zinc-600">
          {data.linkedin && <span>{data.linkedin}</span>}
          {data.website && <><span>|</span><span>{data.website}</span></>}
          {data.github && <><span>|</span><span>{data.github}</span></>}
        </div>
        {(data.twitter || data.instagram || data.dribbble || data.behance) && (
          <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1 text-sm text-zinc-600">
            {data.twitter && <span>{data.twitter}</span>}
            {data.instagram && <>{data.twitter && <span>|</span>}<span>{data.instagram}</span></>}
            {data.dribbble && <>{(data.twitter || data.instagram) && <span>|</span>}<span>{data.dribbble}</span></>}
            {data.behance && <>{(data.twitter || data.instagram || data.dribbble) && <span>|</span>}<span>{data.behance}</span></>}
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-12 gap-8">
        {data.about && (
          <div className="col-span-12">
            <h2 className="font-bold border-b border-zinc-300 text-sm tracking-widest mb-3 uppercase text-zinc-900">{tr?.template.profile ?? "Profile"}</h2>
            <p className="text-sm leading-relaxed text-zinc-700">{data.about}</p>
          </div>
        )}

        {data.experience.length > 0 && (
          <div className="col-span-12">
            <h2 className="font-bold border-b border-zinc-300 text-sm tracking-widest mb-3 uppercase text-zinc-900">{tr?.template.professionalExperience ?? "Professional Experience"}</h2>
            {data.experience.map((exp, i) => (
              <div key={i} className="mb-5">
                <div className="flex justify-between font-bold text-sm text-zinc-900">
                  <span>{exp.company}</span>
                  <span>{exp.year}</span>
                </div>
                <p className="italic text-xs text-zinc-600">{exp.role}</p>
                {exp.desc && <p className="mt-2 text-sm text-zinc-700 leading-snug">{exp.desc}</p>}
              </div>
            ))}
          </div>
        )}

        {data.education.length > 0 && (
          <div className="col-span-12">
            <h2 className="font-bold border-b border-zinc-300 text-sm tracking-widest mb-3 uppercase text-zinc-900">{tr?.template.education ?? "Education"}</h2>
            {data.education.map((edu, i) => (
              <div key={i} className="mb-5">
                <div className="flex justify-between font-bold text-sm text-zinc-900">
                  <span>{edu.school}</span>
                  <span>{edu.year}</span>
                </div>
                <p className="italic text-xs text-zinc-600">
                  {edu.degree}{edu.field ? ` — ${edu.field}` : ''}
                </p>
                {edu.desc && <p className="mt-2 text-sm text-zinc-700 leading-snug">{edu.desc}</p>}
              </div>
            ))}
          </div>
        )}

        {data.skills.length > 0 && (
          <div className="col-span-12">
            <h2 className="font-bold border-b border-zinc-300 text-sm tracking-widest mb-3 uppercase text-zinc-900">{tr?.template.skills ?? "Skills"}</h2>
            <div className="space-y-2">
              {data.skills.map((skill, i) => (
                <div key={i}>
                  <span className="text-sm font-semibold text-zinc-800">• {skill.name}</span>
                  {skill.desc && <p className="text-xs text-zinc-600 ml-3 mt-0.5">{skill.desc}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {data.languages.length > 0 && (
          <div className="col-span-6">
            <h2 className="font-bold border-b border-zinc-300 text-sm tracking-widest mb-3 uppercase text-zinc-900">{data.languagesHeader || tr?.template.languages || "Languages"}</h2>
            <div className="space-y-1">
              {data.languages.map((lang, i) => (
                <p key={i} className="text-sm text-zinc-700">• {lang.name}{lang.level ? ` — ${lang.level}` : ''}</p>
              ))}
            </div>
          </div>
        )}

        {data.certifications.length > 0 && (
          <div className={data.languages.length > 0 ? "col-span-6" : "col-span-12"}>
            <h2 className="font-bold border-b border-zinc-300 text-sm tracking-widest mb-3 uppercase text-zinc-900">{tr?.template.certifications ?? "Certifications"}</h2>
            <div className="space-y-2">
              {data.certifications.map((cert, i) => (
                <div key={i}>
                  <p className="text-sm font-semibold text-zinc-800">• {cert.name}</p>
                  {cert.desc && <p className="text-xs text-zinc-600 ml-3 mt-0.5">{cert.desc}</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}