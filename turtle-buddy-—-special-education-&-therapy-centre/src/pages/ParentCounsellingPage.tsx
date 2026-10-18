import React from 'react';
import { useApp } from '../context/AppContext';
import { HeartHandshake, ShieldCheck, Users, Sparkles, CheckCircle2 } from 'lucide-react';

export const ParentCounsellingPage: React.FC = () => {
  const { openEnrolModal } = useApp();

  return (
    <div className="space-y-16 py-10 pb-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100"
            >
              Whole-Family Psychological Wellness
            </span>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight"
              style={{ color: 'var(--tb-heading, #0f172a)' }}
            >
              Parent Counselling & Family Guidance
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Compassionate mental health and behavioral support for parents and caregivers navigating an autism
              or developmental diagnosis. You are never alone on this journey.
            </p>
            <div className="pt-2">
              <button
                onClick={() => openEnrolModal('Parent Counselling')}
                className="px-6 py-3 text-sm font-bold text-white rounded-xl shadow-md transition-all active:scale-95"
                style={{ backgroundColor: 'var(--tb-secondary, #f97316)' }}
              >
                Schedule Confidential Consultation
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-3xl shadow-xl border-4 border-white aspect-4/3 bg-slate-100">
              <img
                src="/src/assets/images/aba_therapy_session_1792054964703.jpg"
                alt="Parent Counselling session at Turtle Buddy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Guidance Areas */}
      <section className="bg-slate-50 py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">
              How We Support Parents & Siblings
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Post-Diagnosis Processing</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Navigating grief, anxiety, and recalibrating expectations with empathetic clinical psychologists who specialize in pediatric neurodiversity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">De-escalation & Tantrum Strategies</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Step-by-step parent coaching on handling public meltdowns, sensory triggers, sibling jealousy, and sleep difficulties at home.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Monthly Parent Circles</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect with fellow parents facing similar daily milestones, exchange practical tips, and build a lasting village of solidarity.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
