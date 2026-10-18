import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { Plus, Edit2, Trash2, CheckCircle2, Eye, EyeOff, X, Save } from 'lucide-react';
import { ServiceItem } from '../../types';

export const AdminServices: React.FC = () => {
  const { services, adminToken, refreshData } = useApp();
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [fullDesc, setFullDesc] = useState('');
  const [image, setImage] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [published, setPublished] = useState(true);

  const startCreate = () => {
    setIsCreating(true);
    setEditingService(null);
    setTitle('');
    setSlug('');
    setShortDesc('');
    setFullDesc('');
    setImage('/src/assets/images/aba_therapy_session_1792054964703.jpg');
    setBenefitsText('Increases functional communication\nPromotes positive adaptive behaviors\nEnhances social engagement');
    setPublished(true);
  };

  const startEdit = (service: ServiceItem) => {
    setIsCreating(false);
    setEditingService(service);
    setTitle(service.title);
    setSlug(service.slug);
    setShortDesc(service.shortDescription);
    setFullDesc(service.fullDescription);
    setImage(service.image);
    setBenefitsText(service.benefits.join('\n'));
    setPublished(service.published);
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingService(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const benefits = benefitsText.split('\n').map((b) => b.trim()).filter(Boolean);

    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      shortDescription: shortDesc,
      fullDescription: fullDesc,
      image,
      iconName: 'Activity',
      benefits,
      whoIsItFor: ['Children needing individualized developmental support'],
      approach: ['Multidisciplinary clinical assessment', '1:1 therapist sessions', 'Parent carryover'],
      published,
      order: editingService ? editingService.order : services.length + 1,
    };

    try {
      if (editingService) {
        await fetch(`/api/services/${editingService.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(payload),
        });
        setStatusMsg(`Updated "${title}" successfully.`);
      } else {
        await fetch('/api/services', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(payload),
        });
        setStatusMsg(`Created new service "${title}".`);
      }
      cancelForm();
      await refreshData();
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to save service.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) return;
    try {
      await fetch(`/api/services/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setStatusMsg(`Deleted service "${name}".`);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = async (service: ServiceItem) => {
    try {
      await fetch(`/api/services/${service.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ published: !service.published }),
      });
      setStatusMsg(`Updated publication state for "${service.title}".`);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout activeTab="services">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Clinical Services Management</h1>
            <p className="text-xs text-slate-500">
              Add, edit, reorder, and publish therapy modalities displayed on the website.
            </p>
          </div>
          {!isCreating && !editingService && (
            <button
              onClick={startCreate}
              className="px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--tb-btn, #0284c7)' }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Service</span>
            </button>
          )}
        </div>

        {statusMsg && (
          <div className="p-3 bg-sky-50 text-sky-800 text-xs rounded-xl border border-sky-200">
            {statusMsg}
          </div>
        )}

        {/* Modal / Form for Create / Edit */}
        {(isCreating || editingService) && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {isCreating ? 'Create New Clinical Service' : `Edit "${editingService?.title}"`}
              </h3>
              <button onClick={cancelForm} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Service Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Pediatric Music Therapy"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. pediatric-music-therapy"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Card Short Summary (1-2 sentences)
                </label>
                <input
                  type="text"
                  required
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  placeholder="Brief summary for homepage cards..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Detailed Description
                </label>
                <textarea
                  rows={3}
                  value={fullDesc}
                  onChange={(e) => setFullDesc(e.target.value)}
                  placeholder="Comprehensive clinical explanation..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Breakthroughs (one per line)
                </label>
                <textarea
                  rows={3}
                  value={benefitsText}
                  onChange={(e) => setBenefitsText(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pubCheck"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded text-sky-600"
                />
                <label htmlFor="pubCheck" className="text-xs font-semibold text-slate-700">
                  Published and visible on public website
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
                  {isCreating ? 'Create Service' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Services List Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4 hidden sm:table-cell">Slug</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={srv.image}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{srv.title}</div>
                        <div className="text-[11px] text-slate-500 line-clamp-1">
                          {srv.shortDescription}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500 hidden sm:table-cell">
                    /services/{srv.slug}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => togglePublish(srv)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold ${
                        srv.published
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {srv.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{srv.published ? 'Published' : 'Hidden'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => startEdit(srv)}
                      className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded-lg"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(srv.id, srv.title)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg"
                      title="Delete"
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
