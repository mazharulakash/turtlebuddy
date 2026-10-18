import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { Save, Lock, Shield, CheckCircle2, AlertCircle, Building, KeyRound } from 'lucide-react';
import { SiteGeneral } from '../../types';

export const AdminSettings: React.FC = () => {
  const { settings, adminToken, adminEmail, refreshData } = useApp();

  const [general, setGeneral] = useState<SiteGeneral>(() => {
    return (
      settings?.general || {
        siteName: 'Turtle Buddy',
        tagLine: 'Child Development & Special Education Centre',
        logoUrl: '',
        phone: '+1 (800) 489-3221',
        email: 'care@turtlebuddycentre.org',
        address: '840 Greenfield Meadow Blvd, Springdale',
        openingHours: 'Mon - Fri: 8:00 AM - 6:00 PM | Sat: 9:00 AM - 2:00 PM',
        emergencyNotice: 'Admissions for 2026-2027 are currently open.',
        socialLinks: {},
        mapUrl: '',
      }
    );
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [savingGeneral, setSavingGeneral] = useState(false);
  const [generalMsg, setGeneralMsg] = useState<string | null>(null);

  const handleGeneralChange = (field: keyof SiteGeneral, value: string) => {
    setGeneral((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingGeneral(true);
    setGeneralMsg(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ general }),
      });
      if (res.ok) {
        setGeneralMsg('Centre contact information updated successfully.');
        await refreshData();
      }
    } catch (err) {
      console.error(err);
      setGeneralMsg('Failed to update centre details.');
    } finally {
      setSavingGeneral(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg(null);
    setPasswordError(null);

    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          email: adminEmail,
          newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to change password');

      setPasswordMsg('Admin password changed successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : 'Error changing password');
    }
  };

  return (
    <AdminLayout activeTab="settings">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h1 className="text-xl font-bold text-slate-900">Centre Contact & Security Settings</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage public contact coordinates, header notices, and administrative credentials.
          </p>
        </div>

        {/* Section 1: Contact Information */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-sky-600" />
              <span>Public Contact & Centre Coordinates</span>
            </h2>
            {generalMsg && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                {generalMsg}
              </span>
            )}
          </div>

          <form onSubmit={handleSaveGeneral} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Centre Name</label>
                <input
                  type="text"
                  required
                  value={general.siteName}
                  onChange={(e) => handleGeneralChange('siteName', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={general.tagLine}
                  onChange={(e) => handleGeneralChange('tagLine', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Direct Phone</label>
                <input
                  type="text"
                  required
                  value={general.phone}
                  onChange={(e) => handleGeneralChange('phone', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Intake Email</label>
                <input
                  type="email"
                  required
                  value={general.email}
                  onChange={(e) => handleGeneralChange('email', e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Facility Address</label>
              <input
                type="text"
                required
                value={general.address}
                onChange={(e) => handleGeneralChange('address', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Operating Hours</label>
              <input
                type="text"
                value={general.openingHours}
                onChange={(e) => handleGeneralChange('openingHours', e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Top Announcement Ribbon Text
              </label>
              <input
                type="text"
                value={general.emergencyNotice}
                onChange={(e) => handleGeneralChange('emergencyNotice', e.target.value)}
                placeholder="Notice displayed at the top of the header..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingGeneral}
                className="px-5 py-2 text-xs font-bold text-white rounded-lg shadow-xs flex items-center gap-1.5"
                style={{ backgroundColor: 'var(--tb-btn, #0284c7)' }}
              >
                <Save className="w-3.5 h-3.5" />
                <span>{savingGeneral ? 'Saving...' : 'Update Centre Information'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Section 2: Security & Password */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-600" />
              <span>Administrator Password Change</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Logged in as: <span className="font-semibold text-slate-700">{adminEmail}</span>
            </p>
          </div>

          {passwordMsg && (
            <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{passwordMsg}</span>
            </div>
          )}
          {passwordError && (
            <div className="p-3 bg-rose-50 text-rose-800 text-xs rounded-xl border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white rounded-lg shadow-xs"
                style={{ backgroundColor: 'var(--tb-btn, #0284c7)' }}
              >
                Change Admin Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};
