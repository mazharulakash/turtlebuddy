import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, HeartHandshake, CheckCircle2, Award, Users, Sparkles, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { settings, team, navigateTo, openEnrolModal } = useApp();
  const about = settings?.about;

  return (
    <div className="space-y-16 py-10 pb-24">
      {/* Page Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--tb-secondary, #f97316)' }}
        >
          Who We Are
        </span>
        <h1
          className="text-4xl sm:text-5xl font-extrabold tracking-tight"
          style={{ color: 'var(--tb-heading, #0f172a)' }}
        >
          {about?.title || 'About Turtle Buddy'}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          {about?.subtitle ||
            'A compassionate, multidisciplinary child development centre dedicated to nurturing the unique brilliance of neurodiverse children.'}
        </p>
      </section>

      {/* Story & Image Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Our Journey & Dedication to Every Child
            </h2>
            <div className="text-slate-600 text-sm sm:text-base space-y-4 leading-relaxed">
              <p>
                {about?.story ||
                  'Turtle Buddy was founded with a single, heartfelt belief: every child develops at their own beautiful pace, and with the right compassionate support, every child can flourish.'}
              </p>
              <p>
                Our specialized team of Board Certified Behavior Analysts (BCBAs), certified Speech-Language
                Pathologists (CCC-SLP), and licensed Pediatric Occupational Therapists (OTR/L) work
                collaboratively under one roof. By combining these distinct disciplines, we provide
                cohesive, child-centered interventions that celebrate each child’s passions rather than
                attempting to fit them into a rigid standard mold.
              </p>
              <p>
                Whether a child is taking their first steps toward functional speech, learning to navigate
                sensory-rich classrooms, or building peer play skills, Turtle Buddy is a warm, joyful partner
                for families every step of the journey.
              </p>
            </div>
            <div className="pt-2">
              <button
                onClick={() => openEnrolModal()}
                className="px-6 py-3 text-sm font-bold text-white rounded-xl shadow-md transition-all active:scale-95"
                style={{ backgroundColor: 'var(--tb-btn, #0284c7)' }}
              >
                Schedule a Visit & Tour
              </button>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <div className="overflow-hidden rounded-3xl shadow-xl border-4 border-white bg-slate-100 aspect-4/3">
                <img
                  src={about?.photo || '/src/assets/images/aba_therapy_session_1792054964703.jpg'}
                  alt="Therapist guiding a child at Turtle Buddy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute -bottom-6 -right-6 p-4 rounded-2xl bg-white shadow-xl border border-slate-100 max-w-xs hidden sm:block"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-lg shrink-0">
                    ★
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Multidisciplinary Synergy</h4>
                    <p className="text-[11px] text-slate-500">BCBA, Speech, and OT in one unified plan</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Bento */}
      <section className="bg-slate-50 py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {about?.mission ||
                  'To unlock each child’s innate developmental potential through evidence-based, empathetic behavioral, communication, and occupational interventions within a sensory-supportive and joyful learning atmosphere.'}
              </p>
            </div>

            {/* Vision */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Our Vision</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                {about?.vision ||
                  'A world where neurodiverse children are embraced with understanding, provided world-class clinical care, and empowered to live confident, self-directed, and joyful lives with full community inclusion.'}
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Guiding Principles
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Our Foundational Values
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {about?.values?.map((val, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center text-xs font-bold font-mono">
                    0{idx + 1}
                  </div>
                  <h4 className="text-base font-bold text-slate-900">{val.title}</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{val.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Preview Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Guided by Passionate Clinical Leaders
        </h2>
        <p className="text-sm text-slate-600 max-w-2xl mx-auto">
          Our team comprises Board Certified Behavior Analysts, licensed speech pathologists, and pediatric
          occupational therapists who dedicate their lives to pediatric neurodiversity.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigateTo('/team')}
            className="px-6 py-3 text-xs font-bold text-sky-600 border border-sky-200 rounded-xl hover:bg-sky-50 transition-colors inline-flex items-center gap-2"
          >
            <span>Meet All Faculty Members</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
