import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Clock, Calendar, User, ArrowRight, Share2, BookOpen } from 'lucide-react';
import { BlogPost } from '../types';

export const BlogPage: React.FC = () => {
  const { blogs, currentRoute, navigateTo } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeArticle, setActiveArticle] = useState<BlogPost | null>(() => {
    // If route is /blogs/:slug, find matching blog
    if (currentRoute.startsWith('/blogs/')) {
      const slug = currentRoute.replace('/blogs/', '');
      return blogs.find((b) => b.slug === slug || b.id === slug) || null;
    }
    return null;
  });

  const categories = ['All', ...Array.from(new Set(blogs.map((b) => b.category)))];

  const filteredBlogs = blogs.filter((b) => {
    if (selectedCategory === 'All') return true;
    return b.category === selectedCategory;
  });

  // If reading an individual article:
  if (activeArticle) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-8">
        <button
          onClick={() => {
            setActiveArticle(null);
            navigateTo('/blogs');
          }}
          className="inline-flex items-center gap-2 text-xs font-semibold text-sky-600 hover:text-sky-800"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </button>

        <header className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="font-bold text-sky-600">{activeArticle.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {activeArticle.publishedDate}
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {activeArticle.readTime}
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight"
            style={{ color: 'var(--tb-heading, #0f172a)' }}
          >
            {activeArticle.title}
          </h1>

          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-sm">
              {activeArticle.author.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-900">{activeArticle.author}</p>
              <p className="text-xs text-slate-500">{activeArticle.authorRole}</p>
            </div>
          </div>
        </header>

        <div className="overflow-hidden rounded-3xl aspect-16/9 bg-slate-100 border border-slate-200">
          <img
            src={activeArticle.featuredImage}
            alt={activeArticle.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed text-slate-700 space-y-4">
          {activeArticle.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-xl font-bold text-slate-900 pt-4">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('- ')) {
              return (
                <ul key={index} className="list-disc pl-5 space-y-1">
                  {paragraph.split('\n').map((line, liIdx) => (
                    <li key={liIdx}>{line.replace('- ', '')}</li>
                  ))}
                </ul>
              );
            }
            return <p key={index}>{paragraph}</p>;
          })}
        </div>

        <div className="border-t border-slate-200 pt-6 flex items-center justify-between">
          <button
            onClick={() => {
              setActiveArticle(null);
              navigateTo('/blogs');
            }}
            className="px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
          >
            ← Return to Article List
          </button>
          <button
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }}
            className="px-4 py-2 text-xs font-semibold text-sky-600 border border-sky-200 rounded-xl hover:bg-sky-50 flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Article</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-10 pb-24">
      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span
          className="text-xs font-bold uppercase tracking-wider"
          style={{ color: 'var(--tb-secondary, #f97316)' }}
        >
          Parent Education & Clinical Guidance
        </span>
        <h1
          className="text-4xl sm:text-5xl font-extrabold tracking-tight"
          style={{ color: 'var(--tb-heading, #0f172a)' }}
        >
          Articles, Insights & Advice
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Practical strategies from our clinical director, speech therapists, and sensory occupational therapists
          to support learning and emotional wellness at home.
        </p>

        {/* Categories Bar */}
        <div className="pt-4 flex flex-wrap justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                selectedCategory === cat
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredBlogs.map((blog) => (
            <article
              key={blog.id}
              onClick={() => {
                setActiveArticle(blog);
                navigateTo(`/blogs/${blog.slug}`);
              }}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group cursor-pointer"
              style={{ borderRadius: 'var(--tb-radius, 16px)' }}
            >
              <div className="h-52 overflow-hidden bg-slate-100 relative">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute top-3 left-3 text-[10px] font-bold text-white bg-slate-900/70 backdrop-blur-xs px-2.5 py-1 rounded-md">
                  {blog.category}
                </span>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400">
                    <span>{blog.publishedDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700 truncate max-w-[170px]">
                    By {blog.author}
                  </span>
                  <span className="text-xs font-bold text-sky-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
