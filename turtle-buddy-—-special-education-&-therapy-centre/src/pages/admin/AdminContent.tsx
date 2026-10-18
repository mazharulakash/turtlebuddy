import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { Save, CheckCircle2, AlertCircle, Sparkles, Upload, Image as ImageIcon } from 'lucide-react';
import { SiteHero, SiteAbout, SiteStat } from '../../types';

export const AdminContent: React.FC = () => {
  const { settings, adminToken, refreshData } = useApp();

  const [hero, setHero] = useState<SiteHero>(() => {
    return (
      settings?.hero || {
        welcomeBadge: 'WELCOME TO TURTLE BUDDY',
        mainHeading: 'Every Child Deserves a Chance to Grow',
        supportingText: 'At Turtle Buddy, we empower children on the autism spectrum through evidence-based therapy.',
        primaryButtonText: 'Explore Our Services',
        primaryButtonLink: '/services',
        secondaryButtonText: 'Book an Assessment',
        secondaryButtonLink: '/enrol',
        heroImage: '/src/assets/images/hero_child_therapy_1792054963772.jpg',
        floatingBadgeTitle: 'Growing Together',
        floatingBadgeSubtitle: 'Individualized plans & warm multi-disciplinary care',
      }
    );
  });

  const [aboutStory, setAboutStory] = useState(settings?.about?.story || '');
  const [stats, setStats] = useState<SiteStat[]>(settings?.stats || []);

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const curatedHeroImages = [
    { label: 'Happy Child & Blocks (Default)', url: '/src/assets/images/hero_child_therapy_1792054963772.jpg' },
    { label: 'ABA Therapy Puzzle Session', url: '/src/assets/images/aba_therapy_session_1792054964703.jpg' },
    { label: 'Speech & Language Mirror Play', url: '/src/assets/images/speech_therapy_child_1792054965416.jpg' },
    { label: 'Sensory Gym & Obstacle Course', url: '/src/assets/images/sensory_occupational_therapy_1792054965310.jpg' },
  ];

  const handleHeroChange = (field: keyof SiteHero, val: string) => {
    setHero((prev) => ({ ...prev, [field]: val }));
  };

  const handleStatChange = (id: string, field: 'value' | 'label' | 'note', val: string) => {
    setStats((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const payload = {
        hero,
        about: {
          ...(settings?.about || {}),
          story: aboutStory,
        },
        stats,
      };

      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Failed to update content.');
      setSuccessMsg('Homepage content and statistics saved successfully!');
      await refreshData();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error updating content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout activeTab="content">
      <div className="space-y-6">
        {/* Top Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Homepage Content & Copy CMS</h1>
            <p className="text-xs text-slate-500">
              Update hero headlines, welcome badges, hero photography, and statistical milestones.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-1.5"
            style={{ backgroundColor: 'var(--tb-btn, #0284c7)' }}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>

        {successMsg && (
          <div className="p-4 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}
        {errorMsg && (
          <div className="p-4 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Section 1: Hero Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-600" />
            <span>Hero Section Configuration</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Welcome Badge Text
              </label>
              <input
                type="text"
                value={hero.welcomeBadge}
                onChange={(e) => handleHeroChange('welcomeBadge', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Main Hero Heading
              </label>
              <input
                type="text"
                value={hero.mainHeading}
                onChange={(e) => handleHeroChange('mainHeading', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Supporting Paragraph Text
            </label>
            <textarea
              rows={3}
              value={hero.supportingText}
              onChange={(e) => handleHeroChange('supportingText', e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Primary Button Label
              </label>
              <input
                type="text"
                value={hero.primaryButtonText}
                onChange={(e) => handleHeroChange('primaryButtonText', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Secondary Button Label
              </label>
              <input
                type="text"
                value={hero.secondaryButtonText}
                onChange={(e) => handleHeroChange('secondaryButtonText', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Hero Image Selection */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-semibold text-slate-700">
              Hero Featured Photograph
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {curatedHeroImages.map((img, i) => (
                <div
                  key={i}
                  onClick={() => handleHeroChange('heroImage', img.url)}
                  className={`p-2 rounded-xl border cursor-pointer transition-all ${
                    hero.heroImage === img.url
                      ? 'border-sky-600 bg-sky-50/50 ring-2 ring-sky-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img
                    src={img.url}
                    alt={img.label}
                    className="w-full aspect-4/3 object-cover rounded-lg"
                  />
                  <p className="text-[10px] text-slate-600 mt-1 truncate">{img.label}</p>
                </div>
              ))}
            </div>
            <div className="pt-1">
              <label className="block text-[11px] text-slate-500 mb-1">
                Or enter custom image URL:
              </label>
              <input
                type="text"
                value={hero.heroImage}
                onChange={(e) => handleHeroChange('heroImage', e.target.value)}
                placeholder="/uploads/custom-hero.jpg or https://..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Statistics Counter Values */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            Statistics & Milestones Section
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Value</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleStatChange(stat.id, 'value', e.target.value)}
                    className="w-full px-2 py-1 text-sm font-bold font-mono border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Label</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleStatChange(stat.id, 'label', e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase">Note</label>
                  <input
                    type="text"
                    value={stat.note}
                    onChange={(e) => handleStatChange(stat.id, 'note', e.target.value)}
                    className="w-full px-2 py-1 text-[11px] border border-slate-300 rounded bg-white"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: About Story */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            About Section Story
          </h2>
          <textarea
            rows={4}
            value={aboutStory}
            onChange={(e) => setAboutStory(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg resize-none"
            placeholder="Introduction text displayed in the About Us section on the homepage..."
          />
        </div>
      </div>
    </AdminLayout>
  );
};
