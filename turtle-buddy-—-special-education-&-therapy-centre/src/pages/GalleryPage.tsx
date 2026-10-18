import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ZoomIn, Sparkles } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  const { gallery } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxItem, setLightboxItem] = useState<{ url: string; title: string; caption: string } | null>(null);

  // Derive categories
  const categories = ['All', ...Array.from(new Set(gallery.map((g) => g.category)))];

  const filteredItems = gallery.filter((item) => {
    if (activeCategory === 'All') return true;
    return item.category === activeCategory;
  });

  return (
    <div className="space-y-12 py-10 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--tb-secondary, #f97316)' }}
        >
          Centre Environments
        </span>
        <h1
          className="text-4xl sm:text-5xl font-extrabold tracking-tight"
          style={{ color: 'var(--tb-heading, #0f172a)' }}
        >
          Photo Gallery & Learning Spaces
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Take a visual tour through our purpose-built sensory integration gym, specialized ABA suites, speech
          communication corners, and joyful play areas.
        </p>

        {/* Categories Bar */}
        <div className="pt-4 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                activeCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() =>
                setLightboxItem({ url: item.imageUrl, title: item.title, caption: item.caption })
              }
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col"
              style={{ borderRadius: 'var(--tb-radius, 16px)' }}
            >
              <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>
                <span className="absolute top-3 left-3 text-[10px] font-bold text-white bg-slate-900/70 backdrop-blur-xs px-2.5 py-1 rounded-md">
                  {item.category}
                </span>
              </div>
              <div className="p-4 space-y-1">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">{item.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxItem && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[75vh] overflow-hidden bg-slate-900 flex items-center justify-center">
              <img
                src={lightboxItem.url}
                alt={lightboxItem.title}
                className="max-h-[75vh] w-auto object-contain mx-auto"
              />
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 bg-white flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">{lightboxItem.title}</h3>
                <p className="text-xs text-slate-600 mt-1">{lightboxItem.caption}</p>
              </div>
              <button
                onClick={() => setLightboxItem(null)}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
