import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Search,
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const { services, navigateTo, openEnrolModal } = useApp();
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredServices = services.filter((s) => {
    if (filterCategory === 'behavior') return s.slug.includes('aba');
    if (filterCategory === 'speech') return s.slug.includes('speech');
    if (filterCategory === 'motor') return s.slug.includes('occupational');
    if (filterCategory === 'assessment') return s.slug.includes('assessment') || s.slug.includes('counselling');
    return true;
  });

  return (
    <div className="space-y-16 py-10 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--tb-secondary, #f97316)' }}
        >
          Specialized Clinical Offerings
        </span>
        <h1
          className="text-4xl sm:text-5xl font-extrabold tracking-tight"
          style={{ color: 'var(--tb-heading, #0f172a)' }}
        >
          Our Child Development & Therapy Programs
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Scientifically grounded, child-led clinical therapies designed to develop functional communication,
          sensory regulation, emotional autonomy, and happy peer relationships.
        </p>

        {/* Filter Tabs */}
        <div className="pt-4 flex flex-wrap justify-center gap-2">
          {[
            { id: 'all', label: 'All Services' },
            { id: 'behavior', label: 'ABA Therapy' },
            { id: 'speech', label: 'Speech & Language' },
            { id: 'motor', label: 'Occupational & Sensory' },
            { id: 'assessment', label: 'Assessment & Counselling' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterCategory(tab.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                filterCategory === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredServices.map((service, idx) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              style={{ borderRadius: 'var(--tb-radius, 16px)' }}
            >
              <div>
                <div className="h-60 overflow-hidden relative bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <span className="text-sm font-bold text-white bg-slate-900/60 backdrop-blur-xs px-3 py-1 rounded-lg">
                      {service.title}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4">
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {service.shortDescription}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Targeted Breakthroughs:
                    </span>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                      {service.benefits.map((benefit, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="px-6 pb-6 sm:px-8 sm:pb-8 pt-2 flex items-center justify-between border-t border-slate-100">
                <button
                  onClick={() => navigateTo(`/services/${service.slug}`)}
                  className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1.5"
                >
                  <span>Explore In-Depth Program</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => openEnrolModal(service.title)}
                  className="px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs hover:shadow transition-all"
                  style={{ backgroundColor: 'var(--tb-secondary, #f97316)' }}
                >
                  Book Assessment
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Multidisciplinary Synergy Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="p-8 sm:p-12 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8"
          style={{ backgroundColor: 'var(--tb-primary, #0284c7)' }}
        >
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full inline-block">
              Combined Therapy Co-ordination
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              Unsure which therapy fits your child’s current needs?
            </h2>
            <p className="text-xs sm:text-sm text-sky-100 leading-relaxed">
              Our multidisciplinary intake assessment evaluates behavior, speech, motor milestones, and sensory
              processing together to provide a completely transparent clinical recommendation.
            </p>
          </div>
          <button
            onClick={() => openEnrolModal('Comprehensive Multidisciplinary Assessment')}
            className="px-6 py-3 text-sm font-bold text-slate-900 bg-white rounded-xl shadow-md hover:bg-slate-50 transition-all shrink-0"
          >
            Request Free Phone Triage
          </button>
        </div>
      </section>
    </div>
  );
};
