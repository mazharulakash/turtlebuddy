import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { Plus, Trash2, Upload, Image as ImageIcon, CheckCircle2, X } from 'lucide-react';
import { GalleryItem } from '../../types';

export const AdminGallery: React.FC = () => {
  const { gallery, adminToken, refreshData } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Sensory Gym');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatusMsg(null);

    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      try {
        const res = await fetch('/api/media/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            dataUrl,
            filename: file.name.split('.')[0],
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        setImageUrl(data.url);
        setStatusMsg('Image uploaded to server storage successfully!');
      } catch (err: unknown) {
        setStatusMsg(err instanceof Error ? err.message : 'Upload failed');
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      alert('Please select or upload an image.');
      return;
    }

    try {
      await fetch('/api/gallery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          title,
          category,
          imageUrl,
          caption,
          published: true,
        }),
      });

      setStatusMsg('New photo added to centre gallery.');
      setIsAdding(false);
      setTitle('');
      setImageUrl('');
      setCaption('');
      await refreshData();
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to save gallery photo.');
    }
  };

  const handleDelete = async (id: string, imgTitle: string) => {
    if (!window.confirm(`Delete photo "${imgTitle}"?`)) return;
    try {
      await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setStatusMsg(`Deleted photo "${imgTitle}".`);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout activeTab="gallery">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Gallery & Media Library</h1>
            <p className="text-xs text-slate-500">
              Upload photos, manage sensory gym visuals, and update captions.
            </p>
          </div>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--tb-btn, #0284c7)' }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add / Upload Photo</span>
            </button>
          )}
        </div>

        {statusMsg && (
          <div className="p-3 bg-sky-50 text-sky-800 text-xs rounded-xl border border-sky-200">
            {statusMsg}
          </div>
        )}

        {/* Add Form */}
        {isAdding && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">Add New Photo to Gallery</h3>
              <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Photo Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Dimmable Calming Nook"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Sensory Gym">Sensory Gym</option>
                    <option value="Therapy Rooms">Therapy Rooms</option>
                    <option value="Speech Studio">Speech Studio</option>
                    <option value="Play & Learning">Play & Learning</option>
                    <option value="Outdoor Courtyard">Outdoor Courtyard</option>
                  </select>
                </div>
              </div>

              {/* Upload Box */}
              <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 space-y-3 text-center">
                <input
                  type="file"
                  accept="image/*"
                  id="mediaFile"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="mediaFile"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-100"
                >
                  <Upload className="w-3.5 h-3.5 text-sky-600" />
                  <span>{uploading ? 'Uploading to Server...' : 'Choose File from Computer'}</span>
                </label>
                <div className="text-[11px] text-slate-400">Or paste an existing image URL below:</div>
                <input
                  type="text"
                  required
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/src/assets/images/... or /uploads/..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Caption / Description</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Short description of the room or equipment..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 text-xs font-bold text-white rounded-lg shadow-xs"
                  style={{ backgroundColor: 'var(--tb-btn, #0284c7)' }}
                >
                  Add to Gallery
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((g) => (
            <div
              key={g.id}
              className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
            >
              <div className="relative aspect-4/3 bg-slate-100">
                <img src={g.imageUrl} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => handleDelete(g.id, g.title)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-rose-600 transition-colors"
                  title="Delete Image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <span className="absolute bottom-2 left-2 text-[10px] bg-slate-900/70 text-white px-2 py-0.5 rounded font-medium">
                  {g.category}
                </span>
              </div>
              <div className="p-3">
                <h4 className="text-xs font-bold text-slate-900 truncate">{g.title}</h4>
                <p className="text-[11px] text-slate-500 truncate mt-0.5">{g.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
};
