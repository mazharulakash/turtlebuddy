import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import { Menu, X, ChevronDown, Phone, Shield } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentRoute, navigateTo, openEnrolModal, settings, services, adminToken } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About Us', path: '/about' },
    {
      label: 'Services',
      path: '/services',
      hasDropdown: true,
    },
    { label: 'Our Team', path: '/team' },
    { label: 'Gallery', path: '/gallery' },
    { label: 'Blogs', path: '/blogs' },
    { label: 'Notices', path: '/notices' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    navigateTo(path);
    setMobileMenuOpen(false);
    setServicesDropdownOpen(false);
  };

  const emergencyNotice = settings?.general?.emergencyNotice;

  return (
    <>
      {/* Top Banner Notice (if configured) */}
      {emergencyNotice && (
        <div
          className="py-1.5 px-4 text-xs font-medium text-center text-white transition-colors"
          style={{ backgroundColor: 'var(--tb-secondary, #f97316)' }}
        >
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[10px] bg-white/20 px-2 py-0.5 rounded-full">
              Notice
            </span>
            <span className="truncate">{emergencyNotice}</span>
            <button
              onClick={() => handleNavClick('/notices')}
              className="underline hover:text-white/80 shrink-0 ml-1 font-semibold"
            >
              Details
            </button>
          </div>
        </div>
      )}

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 border-b ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-sm border-slate-200/80 py-3'
            : 'bg-white border-slate-100 py-4'
        }`}
        style={{
          backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'var(--tb-nav-bg, #ffffff)',
          color: 'var(--tb-nav-text, #1e293b)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            {/* Zone 1: Brand Wordmark & Logo */}
            <div
              onClick={() => handleNavClick('/')}
              className="cursor-pointer whitespace-nowrap shrink-0"
            >
              <BrandLogo size="md" />
            </div>

            {/* Zone 2: Navigation Links (Desktop) */}
            <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
              {navLinks.map((link) => {
                const isActive =
                  currentRoute === link.path ||
                  (link.path === '/services' && currentRoute.startsWith('/services'));

                if (link.hasDropdown) {
                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => setServicesDropdownOpen(true)}
                      onMouseLeave={() => setServicesDropdownOpen(false)}
                    >
                      <button
                        onClick={() => handleNavClick(link.path)}
                        className={`flex items-center gap-1 transition-colors whitespace-nowrap py-1 ${
                          isActive
                            ? 'font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        style={{ color: isActive ? 'var(--tb-primary, #0284c7)' : undefined }}
                      >
                        {link.label}
                        <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                      </button>

                      {/* Dropdown Menu */}
                      {servicesDropdownOpen && (
                        <div className="absolute top-full left-0 w-64 pt-2 z-50">
                          <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-2 text-xs divide-y divide-slate-50">
                            <button
                              onClick={() => handleNavClick('/services')}
                              className="w-full text-left px-3 py-2 rounded-lg font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                            >
                              All Therapy Services →
                            </button>
                            <div className="pt-1">
                              {services.map((srv) => (
                                <button
                                  key={srv.id}
                                  onClick={() => handleNavClick(`/services/${srv.slug}`)}
                                  className="w-full text-left px-3 py-1.5 rounded-md text-slate-600 hover:text-slate-900 hover:bg-sky-50/60 transition-colors block truncate"
                                >
                                  {srv.title}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <button
                    key={link.label}
                    onClick={() => handleNavClick(link.path)}
                    className={`transition-colors whitespace-nowrap py-1 ${
                      isActive
                        ? 'font-bold'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    style={{ color: isActive ? 'var(--tb-primary, #0284c7)' : undefined }}
                  >
                    {link.label}
                  </button>
                );
              })}
            </nav>

            {/* Zone 3: Actions (Enrol Now + Contact info / Admin button) */}
            <div className="hidden sm:flex items-center gap-3 shrink-0">
              {settings?.general?.phone && (
                <a
                  href={`tel:${settings.general.phone.replace(/[^0-9+]/g, '')}`}
                  className="hidden xl:flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 mr-1"
                >
                  <Phone className="w-3.5 h-3.5 text-sky-600" />
                  <span>{settings.general.phone}</span>
                </a>
              )}

              {/* Admin Quick Entry Button */}
              <button
                onClick={() => handleNavClick('/admin')}
                className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-xs flex items-center gap-1"
                title={adminToken ? 'Admin Dashboard (Active)' : 'Admin Login'}
              >
                <Shield className={`w-4 h-4 ${adminToken ? 'text-emerald-500' : ''}`} />
                <span className="text-[11px] font-medium hidden md:inline">
                  {adminToken ? 'Admin' : 'CMS'}
                </span>
              </button>

              {/* Primary Call to Action */}
              <button
                onClick={() => openEnrolModal()}
                className="px-5 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow active:scale-95 text-white whitespace-nowrap"
                style={{
                  backgroundColor: 'var(--tb-btn, #0284c7)',
                  color: 'var(--tb-btn-text, #ffffff)',
                }}
              >
                Enrol Now
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => openEnrolModal()}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg text-white"
                style={{ backgroundColor: 'var(--tb-btn, #0284c7)' }}
              >
                Enrol
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 mt-3">
            <div className="space-y-1">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.path)}
                  className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentRoute === link.path ? 'bg-sky-50 font-bold text-sky-700' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Individual services for mobile */}
            <div className="border-t border-slate-100 pt-2 pl-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Therapy Services
              </span>
              <div className="space-y-1">
                {services.map((srv) => (
                  <button
                    key={srv.id}
                    onClick={() => handleNavClick(`/services/${srv.slug}`)}
                    className="block w-full text-left py-1 text-xs text-slate-600 hover:text-sky-600"
                  >
                    • {srv.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
              <button
                onClick={() => handleNavClick('/admin')}
                className="flex items-center gap-1.5 text-xs text-slate-600 font-medium"
              >
                <Shield className="w-4 h-4 text-slate-500" />
                <span>Admin CMS Panel</span>
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openEnrolModal();
                }}
                className="px-4 py-2 text-xs font-bold text-white rounded-lg shadow-sm"
                style={{ backgroundColor: 'var(--tb-secondary, #f97316)' }}
              >
                Book Assessment
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
