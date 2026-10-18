import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminLayout } from './AdminLayout';
import { Plus, Edit2, Trash2, X, Eye, EyeOff } from 'lucide-react';
import { BlogPost } from '../../types';

export const AdminBlogs: React.FC = () => {
  const { blogs, adminToken, refreshData } = useApp();
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Parent Advice');
  const [author, setAuthor] = useState('Dr. Elena Vance, PhD, BCBA-D');
  const [authorRole, setAuthorRole] = useState('Clinical Director');
  const [featuredImage, setFeaturedImage] = useState('/src/assets/images/aba_therapy_session_1792054964703.jpg');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [published, setPublished] = useState(true);

  const startCreate = () => {
    setIsCreating(true);
    setEditingBlog(null);
    setTitle('');
    setSlug('');
    setCategory('Early Intervention');
    setAuthor('Dr. Elena Vance, PhD, BCBA-D');
    setAuthorRole('Clinical Director');
    setFeaturedImage('/src/assets/images/speech_therapy_child_1792054965416.jpg');
    setExcerpt('');
    setContent('### Introduction\n\nWrite article contents here...\n\n- Key tip 1\n- Key tip 2');
    setPublished(true);
  };

  const startEdit = (b: BlogPost) => {
    setIsCreating(false);
    setEditingBlog(b);
    setTitle(b.title);
    setSlug(b.slug);
    setCategory(b.category);
    setAuthor(b.author);
    setAuthorRole(b.authorRole);
    setFeaturedImage(b.featuredImage);
    setExcerpt(b.excerpt);
    setContent(b.content);
    setPublished(b.published);
  };

  const cancelForm = () => {
    setIsCreating(false);
    setEditingBlog(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category,
      author,
      authorRole,
      featuredImage,
      excerpt,
      content,
      publishedDate: editingBlog ? editingBlog.publishedDate : new Date().toISOString().split('T')[0],
      readTime: '4 min read',
      published,
    };

    try {
      if (editingBlog) {
        await fetch(`/api/blogs/${editingBlog.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(payload),
        });
        setStatusMsg(`Updated "${title}".`);
      } else {
        await fetch('/api/blogs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify(payload),
        });
        setStatusMsg(`Created article "${title}".`);
      }
      cancelForm();
      await refreshData();
    } catch (err) {
      console.error(err);
      setStatusMsg('Failed to save blog post.');
    }
  };

  const handleDelete = async (id: string, blogTitle: string) => {
    if (!window.confirm(`Delete article "${blogTitle}"?`)) return;
    try {
      await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      setStatusMsg(`Deleted "${blogTitle}".`);
      await refreshData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AdminLayout activeTab="blogs">
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Articles & News CMS</h1>
            <p className="text-xs text-slate-500">
              Publish parent guidance articles, autism resources, and clinical updates.
            </p>
          </div>
          {!isCreating && !editingBlog && (
            <button
              onClick={startCreate}
              className="px-4 py-2 text-xs font-bold text-white rounded-xl shadow-xs flex items-center gap-1.5"
              style={{ backgroundColor: 'var(--tb-btn, #0284c7)' }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Write New Article</span>
            </button>
          )}
        </div>

        {statusMsg && (
          <div className="p-3 bg-sky-50 text-sky-800 text-xs rounded-xl border border-sky-200">
            {statusMsg}
          </div>
        )}

        {/* Create / Edit Form */}
        {(isCreating || editingBlog) && (
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900">
                {isCreating ? 'Write Article' : `Edit: ${editingBlog?.title}`}
              </h3>
              <button onClick={cancelForm} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Article Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Navigating Kindergarten Transitions"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Speech & Language"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Author Name</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Featured Image URL</label>
                  <input
                    type="text"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Short Excerpt</label>
                <input
                  type="text"
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Summary displayed on blog cards..."
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Article Body (Supports markdown headers ### and bullet lists -)
                </label>
                <textarea
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pubBlog"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="rounded text-sky-600"
                />
                <label htmlFor="pubBlog" className="text-xs font-semibold text-slate-700">
                  Published and publicly visible
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
                  Save Article
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Blog Posts Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-4 hidden sm:table-cell">Author</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {blogs.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900">{b.title}</div>
                    <div className="text-[11px] text-sky-600">{b.category}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 hidden sm:table-cell">{b.author}</td>
                  <td className="py-3.5 px-4 text-slate-400 font-mono tabular-nums">{b.publishedDate}</td>
                  <td className="py-3.5 px-4 text-right space-x-1">
                    <button
                      onClick={() => startEdit(b)}
                      className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-slate-100 rounded-lg"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(b.id, b.title)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-lg"
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
