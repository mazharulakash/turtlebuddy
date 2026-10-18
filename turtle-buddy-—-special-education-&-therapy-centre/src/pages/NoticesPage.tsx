import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Calendar, ArrowRight, AlertCircle, Info, Sparkles } from 'lucide-react';

export const NoticesPage: React.FC = () => {
  const { notices, navigateTo } = useApp();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filtered = notices.filter((n) => {
    if (selectedFilter === 'All') return true;
    return n.category === selectedFilter;
  });

  return (
    <div className="space-y-12 py-10 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="text-center space-y-4">
        <span
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--tb-secondary, #f97316)' }}
        >
          Official Bulletins
        </span>
        <h1
          className="text-4xl sm:text-5xl font-extrabold tracking-tight"
          style={{ color: 'var(--tb-heading, #0f172a)' }}
        >
          Notices & Announcements
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Stay up to date with cohort enrollment deadlines, free community developmental screenings,
          parent workshops, and center holiday schedules.
        </p>

        {/* Filter buttons */}
        <div className="pt-2 flex flex-wrap justify-center gap-2">
          {['All', 'Admission', 'Event', 'Workshop', 'General'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                selectedFilter === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Notices List */}
      <div className="space-y-4">
        {filtered.map((notice) => (
          <div
            key={notice.id}
            className={`p-6 rounded-2xl bg-white border transition-all shadow-xs ${
              notice.isImportant ? 'border-amber-300 ring-2 ring-amber-100' : 'border-slate-200'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className={`font-bold px-2.5 py-0.5 rounded-md text-[11px] ${
                      notice.category === 'Admission'
                        ? 'bg-sky-100 text-sky-800'
                        : notice.category === 'Event'
                        ? 'bg-emerald-100 text-emerald-800'
                        : notice.category === 'Workshop'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-slate-100 text-slate-800'
                    }`}
                  >
                    {notice.category}
                  </span>
                  {notice.isImportant && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      ★ High Priority
                    </span>
                  )}
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {notice.date}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900">{notice.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
                  {notice.description}
                </p>
              </div>

              {notice.actionUrl && (
                <button
                  onClick={() => navigateTo(notice.actionUrl!)}
                  className="shrink-0 self-start sm:self-center px-4 py-2 text-xs font-bold rounded-xl text-white shadow-xs hover:shadow transition-all flex items-center gap-1.5"
                  style={{ backgroundColor: 'var(--tb-btn, #0284c7)' }}
                >
                  <span>{notice.actionText || 'Take Action'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
