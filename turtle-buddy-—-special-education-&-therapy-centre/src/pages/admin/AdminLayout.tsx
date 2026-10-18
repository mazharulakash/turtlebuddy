import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../../components/common/BrandLogo';
import {
  LayoutDashboard,
  Palette,
  FileEdit,
  ClipboardList,
  Users,
  Image,
  BookOpen,
  Bell,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  MessageSquare,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab }) => {
  const { adminEmail, logout, navigateTo } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'enquiries', label: 'Enquiries & CRM', icon: ClipboardList, path: '/admin/enquiries' },
    { id: 'theme', label: 'Theme & Appearance', icon: Palette, path: '/admin/theme' },
    { id: 'content', label: 'Homepage & Content', icon: FileEdit, path: '/admin/content' },
    { id: 'services', label: 'Clinical Services', icon: MessageSquare, path: '/admin/services' },
    { id: 'team', label: 'Clinical Team', icon: Users, path: '/admin/team' },
    { id: 'blogs', label: 'Blog & Articles', icon: BookOpen, path: '/admin/blogs' },
    { id: 'gallery', label: 'Gallery & Media', icon: Image, path: '/admin/gallery' },
    { id: 'notices', label: 'Notices & Alerts', icon: Bell, path: '/admin/notices' },
    { id: 'settings', label: 'Settings & Security', icon: Settings, path: '/admin/settings' },
  ];

  const handleNav = (path: string) => {
    navigateTo(path);
    setMobileSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      {/* Top Admin Header */}
      <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div
              onClick={() => handleNav('/admin/dashboard')}
              className="cursor-pointer flex items-center gap-2"
            >
              <BrandLogo size="sm" whiteText={true} />
              <span className="hidden sm:inline-block text-xs bg-sky-950 text-sky-400 font-bold px-2.5 py-0.5 rounded-full border border-sky-800">
                Admin CMS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('/')}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Live Site</span>
            </button>

            <div className="h-4 w-px bg-slate-700 hidden sm:block" />

            <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span className="truncate max-w-[150px]">{adminEmail || 'admin@turtlebuddy.com'}</span>
            </div>

            <button
              onClick={logout}
              className="p-2 sm:px-3 sm:py-1.5 text-xs font-semibold bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-lg flex items-center gap-1.5 transition-colors border border-rose-800/40"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* Sidebar Desktop */}
        <aside className="w-64 shrink-0 hidden lg:block space-y-1">
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-3 space-y-1">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              CMS Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileSidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div
              className="fixed inset-0 bg-black/60"
              onClick={() => setMobileSidebarOpen(false)}
            />
            <div className="relative w-64 bg-slate-900 text-white p-4 space-y-2 z-10 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <span className="font-bold text-sm">Navigation Menu</span>
                  <button onClick={() => setMobileSidebarOpen(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNav(item.path)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                          isActive ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full py-2 bg-rose-900 text-rose-200 rounded-xl text-xs font-bold"
              >
                Log Out
              </button>
            </div>
          </div>
        )}

        {/* Dynamic Content Panel */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
};
