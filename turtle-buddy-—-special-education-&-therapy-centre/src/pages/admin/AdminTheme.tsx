import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { Palette, RotateCcw, Save, CheckCircle2, AlertCircle, Eye } from 'lucide-react';
import { SiteTheme } from '../../types';

export const AdminTheme: React.FC = () => {
  const { settings, adminToken, applyTheme, refreshData } = useApp();

  const [theme, setTheme] = useState<SiteTheme>(() => {
    return (
      settings?.theme || {
        primaryColor: '#0284c7',
        secondaryColor: '#f97316',
        accentColor: '#10b981',
        backgroundColor: '#f8fafc',
        headingColor: '#0f172a',
        bodyTextColor: '#334155',
        buttonColor: '#0284c7',
        buttonTextColor: '#ffffff',
        navBgColor: '#ffffff',
        navTextColor: '#1e293b',
        borderRadius: '16px',
        fontFamily: 'Plus Jakarta Sans',
      }
    );
  });

  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (settings?.theme) {
      setTheme(settings.theme);
    }
  }, [settings]);

  const handleChange = (field: keyof SiteTheme, value: string) => {
    const updated = { ...theme, [field]: value };
    setTheme(updated);
    // Live preview by updating CSS variables in DOM immediately!
    applyTheme(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ theme }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save theme settings');

      setSuccessMsg('Theme colors and styling updated successfully! Changes are live across the website.');
      applyTheme(theme);
      await refreshData();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error updating theme');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('Reset all theme colors and fonts to Turtle Buddy defaults?')) return;
    const defaultTheme: SiteTheme = {
      primaryColor: '#0284c7',
      secondaryColor: '#f97316',
      accentColor: '#10b981',
      backgroundColor: '#f8fafc',
      headingColor: '#0f172a',
      bodyTextColor: '#334155',
      buttonColor: '#0284c7',
      buttonTextColor: '#ffffff',
      navBgColor: '#ffffff',
      navTextColor: '#1e293b',
      borderRadius: '16px',
      fontFamily: 'Plus Jakarta Sans',
    };
    setTheme(defaultTheme);
    applyTheme(defaultTheme);

    try {
      await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ theme: defaultTheme }),
      });
      setSuccessMsg('Theme successfully reset to defaults.');
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout activeTab="theme">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-purple-50 text-purple-700 mb-2">
              <Palette className="w-3.5 h-3.5" />
              <span>Theme Configuration</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">Appearance & Colour Settings</h1>
            <p className="text-xs text-slate-500">
              Customize colors, fonts, and geometry. Changes are applied dynamically to all public pages.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleResetDefaults}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2 text-xs font-bold text-white rounded-xl shadow-xs hover:shadow transition-all flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--tb-btn, #0284c7)' }}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : 'Save Theme Changes'}</span>
            </button>
          </div>
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

        {/* 2-Column: Color Controls + Live Preview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Color Palette Variables
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Primary Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Brand Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={theme.primaryColor}
                    onChange={(e) => handleChange('primaryColor', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Used for logos, key accents & cards</p>
              </div>

              {/* Secondary Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Secondary Color (Warm Tone)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={theme.secondaryColor}
                    onChange={(e) => handleChange('secondaryColor', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Used for CTA highlights & badges</p>
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={theme.accentColor}
                    onChange={(e) => handleChange('accentColor', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Growth, success & verification icons</p>
              </div>

              {/* Background Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Website Background
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={theme.backgroundColor}
                    onChange={(e) => handleChange('backgroundColor', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Neutral body canvas background</p>
              </div>

              {/* Heading Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Heading Text Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.headingColor}
                    onChange={(e) => handleChange('headingColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={theme.headingColor}
                    onChange={(e) => handleChange('headingColor', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Headings H1 through H6</p>
              </div>

              {/* Body Text Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Body Text Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.bodyTextColor}
                    onChange={(e) => handleChange('bodyTextColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={theme.bodyTextColor}
                    onChange={(e) => handleChange('bodyTextColor', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Paragraph and description prose</p>
              </div>

              {/* Button Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Button Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.buttonColor}
                    onChange={(e) => handleChange('buttonColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={theme.buttonColor}
                    onChange={(e) => handleChange('buttonColor', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">CTA buttons background</p>
              </div>

              {/* Button Text Color */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary Button Text Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={theme.buttonTextColor}
                    onChange={(e) => handleChange('buttonTextColor', e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                  />
                  <input
                    type="text"
                    value={theme.buttonTextColor}
                    onChange={(e) => handleChange('buttonTextColor', e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Label color inside primary button</p>
              </div>
            </div>

            {/* Typography & Geometry */}
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 pt-4">
              Typography & Geometry
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Font Family
                </label>
                <select
                  value={theme.fontFamily}
                  onChange={(e) => handleChange('fontFamily', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Plus Jakarta Sans">Plus Jakarta Sans (Default Child-Friendly)</option>
                  <option value="Outfit">Outfit (Clean Geometric Modern)</option>
                  <option value="Bricolage Grotesque">Bricolage Grotesque (Expressive Display)</option>
                  <option value="system-ui">System UI Sans-Serif</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Border Radius Style
                </label>
                <select
                  value={theme.borderRadius}
                  onChange={(e) => handleChange('borderRadius', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="8px">Subtle Soft (8px)</option>
                  <option value="12px">Modern Balanced (12px)</option>
                  <option value="16px">Friendly Playful (16px - Default)</option>
                  <option value="24px">Extra Rounded Warm (24px)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Live Preview Column */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4 sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Eye className="w-4 h-4 text-sky-600" />
                  <span>Real-Time Theme Preview</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Live updates</span>
              </div>

              {/* Sample Card Simulated using chosen theme values */}
              <div
                className="p-6 border shadow-xs space-y-4"
                style={{
                  backgroundColor: theme.backgroundColor,
                  borderRadius: theme.borderRadius,
                  borderColor: '#e2e8f0',
                  fontFamily: `"${theme.fontFamily}", system-ui, sans-serif`,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: `${theme.primaryColor}20`, color: theme.primaryColor }}
                  >
                    Turtle Buddy Demo
                  </span>
                  <span style={{ color: theme.accentColor }} className="text-xs font-bold">
                    ● Active State
                  </span>
                </div>

                <h4
                  className="text-lg font-extrabold leading-tight"
                  style={{ color: theme.headingColor }}
                >
                  Every Child Deserves a Chance to Grow
                </h4>

                <p className="text-xs leading-relaxed" style={{ color: theme.bodyTextColor }}>
                  This is a live simulation of headings, body paragraphs, and action buttons using your selected
                  palette.
                </p>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    className="px-4 py-2 text-xs font-bold shadow-xs transition-transform active:scale-95"
                    style={{
                      backgroundColor: theme.buttonColor,
                      color: theme.buttonTextColor,
                      borderRadius: theme.borderRadius,
                    }}
                  >
                    Primary Action
                  </button>

                  <button
                    className="px-4 py-2 text-xs font-bold border"
                    style={{
                      borderColor: theme.secondaryColor,
                      color: theme.secondaryColor,
                      backgroundColor: '#ffffff',
                      borderRadius: theme.borderRadius,
                    }}
                  >
                    Secondary Button
                  </button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl text-[11px] text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">How Theme Persistence Works:</p>
                <p>
                  Clicking <strong>Save Theme Changes</strong> permanently stores this configuration in the
                  server database. Every visitor will experience these colors automatically.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};
