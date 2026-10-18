import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';
import { TeamMember } from '../../types';

export const AdminTeam: React.FC = () => {
  const { team, adminToken, refreshData } = useApp();
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [specialtiesText, setSpecialtiesText] = useState('');
  const [bio, setBio] = useState('');
  const [photo, setPhoto] = useState('');
  const [email, setEmail] = useState('');

  const startCreate = () => {
    setIsCreating(true);
    setEditingMember(null);
    setName('');
    setDesignation('');
    setQualifications('');
    setSpecialtiesText('Pediatric Intervention, Family Guidance');
    setBio('');
    setPhoto('/src/assets/images/aba_therapy_session_1792054964703.jpg');
    setEmail('');
  };

  const startEdit = (m: TeamMember) => {
    setIsCreating(false);
    setEditingMember(m);
    setName(m.name);
    setDesignation(m.designation);
    setQualifications(m.qualifications);
    setSpecialtiesText(m.specialties.join(', '));
    setBio(m.bio);
    setPhoto(m.photo);
    setEmail(m.email || '');
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingMember(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const specialties = specialtiesText.split(',').map((s) => s.trim()).filter(Boolean);

    const payload = {
      name,
      designation,
      qualifications,
      specialties,
      bio,
      photo,
      email: email || undefined,
      order: editingMember ? editingMember.order : team.length + 1,
    };

    try {
      if (editingMember) {
        await fetch(`/api/team/${editingMember.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(payload),
        });
        setStatusMsg(`Updated profile for ${name}.`);
      } else {
        await fetch('/api/team', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(payload),
        });
        setStatusMsg(`Added new team member ${name}.`);
      }
      cancelForm();
      await refreshData();
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to save team member.');
    }
  };

  const handleDelete = async (id: string, memberName: string) => {
    if (!window.confirm(`Delete profile for ${memberName}?`)) return;
    try {
      await fetch(`/api/team/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setStatusMsg(`Deleted profile for ${memberName}.`);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout activeTab="team">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Clinical Team Management</h1>
            <p className="text-xs text-slate-500">
              Manage therapist profiles, clinical degrees, designations, and bios.
            </p>
          </div>
          {!isCreating && !editingMember && (
            <button
              onClick={startCreate}
              className="px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--tb-btn, #0284c7)' }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Team Profile</span>
            </button>
          )}
        </div>

        {statusMsg && (
          <div className="p-3 bg-sky-50 text-sky-800 text-xs rounded-xl border border-sky-200">
            {statusMsg}
          </div>
        )}

        {/* Create / Edit Form */}
        {(isCreating || editingMember) && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {isCreating ? 'Add New Team Member' : `Edit Profile: ${editingMember?.name}`}
              </h3>
              <button onClick={cancelForm} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name & Title *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Emily Hayes, BCBA-D"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designation / Role *</label>
                  <input
                    type="text"
                    required
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    placeholder="e.g. Lead Pediatric Behavioral Specialist"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Degrees & Qualifications</label>
                  <input
                    type="text"
                    value={qualifications}
                    onChange={(e) => setQualifications(e.target.value)}
                    placeholder="e.g. PhD in Clinical Psychology, M.Ed"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="therapist@turtlebuddycentre.org"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Specialties (comma separated)</label>
                <input
                  type="text"
                  value={specialtiesText}
                  onChange={(e) => setSpecialtiesText(e.target.value)}
                  placeholder="e.g. Applied Behavior Analysis, Early Autism, Sensory Diets"
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Photo URL</label>
                <input
                  type="text"
                  value={photo}
                  onChange={(e) => setPhoto(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Biography</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg resize-none"
                />
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
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {team.map((m) => (
            <div key={m.id} className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex items-start gap-4">
              <img
                src={m.photo}
                alt=""
                className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-100 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 truncate">{m.name}</h3>
                    <p className="text-xs text-sky-600">{m.designation}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => startEdit(m)}
                      className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-slate-50 rounded"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(m.id, m.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{m.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
