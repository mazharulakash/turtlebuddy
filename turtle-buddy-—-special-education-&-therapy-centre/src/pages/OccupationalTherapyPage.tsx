import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Activity, Compass, ShieldCheck, HeartHandshake } from 'lucide-react';

export const OccupationalTherapyPage: React.FC = () => {
  const { openEnrolModal, navigateTo } = useApp();

  return (
    <div className="space-y-16 py-10 pb-24">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <span
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100"
            >
              Sensory Processing & Motor Milestones
            </span>
            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight"
              style={{ color: 'var(--tb-heading, #0f172a)' }}
            >
              Occupational Therapy (OT) & Sensory Integration
            </h1>
            <p className="text-base text-slate-600 leading-relaxed">
              Equipping children with sensory balance, fine and gross motor dexterity, and independent self-care skills
              inside our specially engineered sensory integration gym.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => openEnrolModal('Occupational Therapy')}
                className="px-6 py-3 text-sm font-bold text-white rounded-xl shadow-md transition-all active:scale-95"
                style={{ backgroundColor: 'var(--tb-secondary, #f97316)' }}
              >
                Book Sensory Assessment
              </button>
              <button
                onClick={() => navigateTo('/gallery')}
                className="px-6 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all"
              >
                Tour Our Sensory Gym
              </button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-3xl shadow-xl border-4 border-white aspect-4/3 bg-slate-100">
              <img
                src="/src/assets/images/sensory_occupational_therapy_1792054965310.jpg"
                alt="Sensory Occupational Therapy at Turtle Buddy"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Gym Features */}
      <section className="bg-slate-50 py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl font-extrabold text-slate-900">
              Our Sensory Gym & Equipment
            </h2>
            <p className="text-sm text-slate-600">
              A clinical environment designed to stimulate vestibular, proprioceptive, and tactile systems safely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Vestibular Swings & Hammocks</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Swings that provide calming linear acceleration or alerting rotary movements to organize the inner-ear balance system.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Proprioceptive Crash Pads</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Heavy work activities, climbing ramps, and high-density foam courses that satisfy sensory-seeking needs and body awareness.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Fine Motor Manipulatives</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Pencil grip training, therapeutic putty, bilateral buttoning boards, and scissor skill progression kits.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Action banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900 text-white space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Build Everyday Independence</h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
            Book an OT evaluation with certified pediatric occupational therapists.
          </p>
          <button
            onClick={() => openEnrolModal('Occupational Therapy')}
            className="px-6 py-3 text-sm font-bold text-slate-900 bg-white rounded-xl hover:bg-slate-100 transition-all shadow-md"
          >
            Request OT Consultation
          </button>
        </div>
      </section>
    </div>
  );
};
