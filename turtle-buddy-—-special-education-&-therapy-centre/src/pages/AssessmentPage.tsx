import React from 'react';
import { useApp } from '../context/AppContext';
import { ClipboardCheck, Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Clock } from 'lucide-react';

export const AssessmentPage: React.FC = () => {
  const { openEnrolModal } = useApp();

  return (
    <div className="space-y-16 py-10 pb-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100"
            >
              Diagnostic Clarity & Early Milestones
            </span>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight"
              style={{ color: 'var(--tb-heading, #0f172a)' }}
            >
              Child Development & Assessment
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Thorough, stress-free multidisciplinary developmental evaluations conducted in a playful,
              supportive setting to provide parents with clear baseline clarity and an actionable growth roadmap.
            </p>
            <div className="pt-2">
              <button
                onClick={() => openEnrolModal('Child Development Assessment')}
                className="px-6 py-3 text-sm font-bold text-white rounded-xl shadow-md transition-all active:scale-95"
                style={{ backgroundColor: 'var(--tb-btn, #0284c7)' }}
              >
                Schedule Diagnostic Evaluation
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-3xl shadow-xl border-4 border-white aspect-4/3 bg-slate-100">
              <img
                src="/src/assets/images/hero_child_therapy_1792054963772.jpg"
                alt="Child assessment at Turtle Buddy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Steps */}
      <section className="bg-slate-50 py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">
              The 4-Step Evaluation Process
            </h2>
            <p className="text-sm text-slate-600">
              Transparent, respectful, and clinically validated every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Parent Intake & History',
                desc: 'Detailed discussion regarding pregnancy milestones, early speech, motor progress, family dynamics, and daily concerns.',
              },
              {
                step: '02',
                title: 'Play-Based Clinical Observation',
                desc: 'Child participates in structured games, puzzles, and sensory tasks without feeling evaluated or under pressure.',
              },
              {
                step: '03',
                title: 'Multidisciplinary Scoring',
                desc: 'Standardized tools (ADOS-2, VB-MAPP, Bayley Scales, Sensory Profile) analyzed collaboratively by our BCBA, SLP, and OT.',
              },
              {
                step: '04',
                title: 'Parent Roadmap Conference',
                desc: 'In-person meeting to review findings, ask questions, and receive your comprehensive written clinical report.',
              },
            ].map((st, i) => (
              <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
                <span className="text-xs font-bold font-mono text-sky-600 bg-sky-50 px-2.5 py-1 rounded-md">
                  Step {st.step}
                </span>
                <h3 className="text-base font-bold text-slate-900">{st.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
