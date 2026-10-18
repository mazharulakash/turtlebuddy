import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ArrowRight, BrainCircuit, Users, HeartHandshake, ShieldCheck, HelpCircle } from 'lucide-react';

export const AbaTherapyPage: React.FC = () => {
  const { openEnrolModal, navigateTo } = useApp();

  return (
    <div className="space-y-16 py-10 pb-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100"
            >
              Gold-Standard Clinical Behavioral Science
            </span>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight"
              style={{ color: 'var(--tb-heading, #0f172a)' }}
            >
              Applied Behaviour Analysis (ABA) Therapy
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Gentle, child-led, positive reinforcement behavioral interventions supervised by Board Certified
              Behavior Analysts (BCBA) to foster meaningful communication, daily autonomy, and joyful play.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => openEnrolModal('ABA Therapy')}
                className="px-6 py-3 text-sm font-bold text-white rounded-xl shadow-md transition-all active:scale-95"
                style={{ backgroundColor: 'var(--tb-btn, #0284c7)' }}
              >
                Schedule ABA Consultation
              </button>
              <button
                onClick={() => navigateTo('/services')}
                className="px-6 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
              >
                View All Services
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-3xl shadow-xl border-4 border-white aspect-4/3 bg-slate-100">
              <img
                src="/src/assets/images/aba_therapy_session_1792054964703.jpg"
                alt="ABA therapy session at Turtle Buddy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="bg-slate-50 py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Our Gentle Methodology
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              How ABA Works at Turtle Buddy
            </h2>
            <p className="text-sm text-slate-600">
              We practice contemporary, compassionate ABA focused on motivation, natural environment learning, and emotional safety.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">Functional Behavioral Assessment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our BCBA determines what motivates the child and what communicative needs lie beneath challenging behaviors or frustrations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center font-bold">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">Natural Environment Training (NET)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rather than repetitive desk drills, therapy occurs during fun play, sensory games, and everyday snack and social interactions.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">Caregiver Coaching</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Parents learn the exact positive reinforcement strategies to replicate successes at home, at the grocery store, and on the playground.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Target Skills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center">
          Skills We Nurture in ABA Therapy
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Functional Communication', desc: 'Requesting needs verbally, through gestures, or using picture exchange & AAC tools.' },
            { title: 'Emotional Self-Regulation', desc: 'Recognizing overwhelm and adopting self-soothing coping mechanisms before meltdowns.' },
            { title: 'Social Play & Turn-Taking', desc: 'Engaging in reciprocal play, sharing favorite items, and reading peer emotional cues.' },
            { title: 'Adaptive Daily Living', desc: 'Independently washing hands, unzipping backpacks, tidying toys, and toilet training.' },
          ].map((item, idx) => (
            <div key={idx} className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900 text-center">
          Frequently Asked Questions About ABA
        </h2>
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-sm font-bold text-slate-900">How many hours per week does a child attend?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Programs are customized based on the child's developmental assessment. Focused programs range from 10 to 15 hours per week, while comprehensive early intervention can be 20 to 25 hours.
            </p>
          </div>
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <h4 className="text-sm font-bold text-slate-900">Can parents observe therapy sessions?</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Absolutely. We operate an open-door policy with one-way observation mirrors and video review sessions so you are always fully informed and involved.
            </p>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to begin ABA therapy?</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Contact our clinical team to schedule an initial consultation and tour our sensory suites.
          </p>
          <button
            onClick={() => openEnrolModal('ABA Therapy')}
            className="px-6 py-3 text-sm font-bold text-slate-900 bg-white rounded-xl hover:bg-slate-100 transition-all shadow-md"
          >
            Request Intake Appointment
          </button>
        </div>
      </section>
    </div>
  );
};
