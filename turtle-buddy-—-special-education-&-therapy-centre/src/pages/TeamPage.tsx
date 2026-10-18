import React from 'react';
import { useApp } from '../context/AppContext';
import { Mail, Award, CheckCircle2 } from 'lucide-react';

export const TeamPage: React.FC = () => {
  const { team, openEnrolModal } = useApp();

  return (
    <div className="space-y-16 py-10 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--tb-secondary, #f97316)' }}
        >
          Clinical Specialists & Educators
        </span>
        <h1
          className="text-4xl sm:text-5xl font-extrabold tracking-tight"
          style={{ color: 'var(--tb-heading, #0f172a)' }}
        >
          Meet Our Multidisciplinary Faculty
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Our team unites board-certified behavior analysts, speech-language pathologists, pediatric occupational
          therapists, and child psychologists dedicated to evidence-based care.
        </p>
      </section>

      {/* Team Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-6"
              style={{ borderRadius: 'var(--tb-radius, 16px)' }}
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={member.photo}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-100 shrink-0"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">{member.name}</h3>
                    <p className="text-xs font-semibold text-sky-600 mt-0.5">{member.designation}</p>
                    <p className="text-[11px] text-slate-400 mt-1">{member.qualifications}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {member.bio}
                </p>

                {/* Specialties */}
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Clinical Specialties:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {member.specialties.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-slate-50 border border-slate-100 text-slate-700 px-2.5 py-0.5 rounded-lg"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                {member.email ? (
                  <a
                    href={`mailto:${member.email}`}
                    className="text-xs text-slate-500 hover:text-sky-600 flex items-center gap-1.5 truncate max-w-[170px]"
                  >
                    <Mail className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </a>
                ) : (
                  <span className="text-xs text-slate-400">Turtle Buddy Faculty</span>
                )}
                <button
                  onClick={() => openEnrolModal(`Consultation with ${member.name}`)}
                  className="px-3 py-1.5 text-xs font-bold text-sky-700 bg-sky-50 rounded-lg hover:bg-sky-100 transition-colors"
                >
                  Consult
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
