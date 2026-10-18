import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { Plus, Edit2, Trash2, X, AlertCircle } from 'lucide-react';
import { NoticeItem } from '../../types';

export const AdminNotices: React.FC = () => {
  const { notices, adminToken, refreshData } = useApp();
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<'Admission' | 'Event' | 'Workshop' | 'General'>('Admission');
  const [isImportant, setIsImportant] = useState(false);
  const [actionUrl, setActionUrl] = useState('/enrol');
  const [actionText, setActionText] = useState('Enrol Now');

  const startCreate = () => {
    setIsCreating(true);
    setEditingNotice(null);
    setTitle('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setCategory('Admission');
    setIsImportant(false);
    setActionUrl('/enrol');
    setActionText('Apply Now');
  };

  const startEdit = (n: NoticeItem) => {
    setIsCreating(false);
    setEditingNotice(n);
    setTitle(n.title);
    setDescription(n.description);
    setDate(n.date);
    setCategory(n.category);
    setIsImportant(n.isImportant);
    setActionUrl(n.actionUrl || '');
    setActionText(n.actionText || '');
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingNotice(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      description,
      date,
      category,
      isImportant,
      actionUrl: actionUrl || undefined,
      actionText: actionText || undefined,
      published: true,
    };

    try {
      if (editingNotice) {
        await fetch(`/api/notices/${editingNotice.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(payload),
        });
        setStatusMsg(`Updated notice "${title}".`);
      } else {
        await fetch('/api/notices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(payload),
        });
        setStatusMsg(`Created notice "${title}".`);
      }
      cancelForm();
      await refreshData();
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to save notice.');
    }
  };

  const handleDelete = async (id: string, noticeTitle: string) => {
    if (!window.confirm(`Delete notice "${noticeTitle}"?`)) return;
    try {
      await fetch(`/api/notices/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setStatusMsg(`Deleted notice "${noticeTitle}".`);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout activeTab="notices">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Notices & Bulletins</h1>
            <p className="text-xs text-slate-500">
              Publish cohort deadlines, free screening days, and clinic holiday notices.
            </p>
          </div>
          {!isCreating && !editingNotice && (
            <button
              onClick={startCreate}
              className="px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--tb-btn, #0284c7)' }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Post New Notice</span>
            </button>
          )}
        </div>

        {statusMsg && (
          <div className="p-3 bg-sky-50 text-sky-800 text-xs rounded-xl border border-sky-200">
            {statusMsg}
          </div>
        )}

        {/* Form */}
        {(isCreating || editingNotice) && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {isCreating ? 'Post New Announcement' : `Edit Notice`}
              </h3>
              <button onClick={cancelForm} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Admissions Open for Term 2026-2027"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as 'Admission' | 'Event' | 'Workshop' | 'General')
                    }
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Admission">Admission</option>
                    <option value="Event">Event</option>
                    <option value="Workshop">Workshop</option>
                    <option value="General">General</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Call-to-Action Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={actionUrl}
                    onChange={(e) => setActionUrl(e.target.value)}
                    placeholder="/enrol or /contact"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Button Label (Optional)
                  </label>
                  <input
                    type="text"
                    value={actionText}
                    onChange={(e) => setActionText(e.target.value)}
                    placeholder="e.g. Enrol Now"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="impCheck"
                  checked={isImportant}
                  onChange={(e) => setIsImportant(e.target.checked)}
                  className="rounded text-amber-600"
                />
                <label htmlFor="impCheck" className="text-xs font-semibold text-slate-700">
                  Mark as High-Priority Notice (Highlights in yellow badge)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white rounded-lg shadow-xs"
                  style={{ backgroundColor: 'var(--tb-btn, #0284c7)' }}
                >
                  Save Notice
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Notices Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {notices.map((n) => (
                <tr key={n.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{n.title}</span>
                      {n.isImportant && (
                        <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded font-bold">
                          Important
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{n.description}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-700">{n.category}</td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono tabular-nums">{n.date}</td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => startEdit(n)}
                      className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(n.id, n.title)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};
