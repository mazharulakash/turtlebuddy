import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  SiteSettings,
  ServiceItem,
  TeamMember,
  GalleryItem,
  BlogPost,
  NoticeItem,
  TestimonialItem,
  SiteTheme,
} from '../types';

interface AppContextType {
  settings: SiteSettings | null;
  services: ServiceItem[];
  team: TeamMember[];
  gallery: GalleryItem[];
  blogs: BlogPost[];
  notices: NoticeItem[];
  testimonials: TestimonialItem[];
  loading: boolean;
  error: string | null;
  adminToken: string | null;
  adminEmail: string | null;
  currentRoute: string;
  navigateTo: (route: string) => void;
  refreshData: () => Promise<void>;
  login: (token: string, email: string) => void;
  logout: () => void;
  applyTheme: (theme: SiteTheme) => void;
  openEnrolModal: (serviceName?: string) => void;
  closeEnrolModal: () => void;
  isEnrolModalOpen: boolean;
  selectedServiceForModal: string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Router simulation
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    return window.location.hash ? window.location.hash.replace('#', '') : '/';
  });

  // Enrolment Quick Modal
  const [isEnrolModalOpen, setIsEnrolModalOpen] = useState(false);
  const [selectedServiceForModal, setSelectedServiceForModal] = useState('');

  // Admin Auth
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('tb_admin_token');
  });
  const [adminEmail, setAdminEmail] = useState<string | null>(() => {
    return localStorage.getItem('tb_admin_email');
  });

  const applyTheme = (theme: SiteTheme) => {
    const root = document.documentElement;
    root.style.setProperty('--tb-primary', theme.primaryColor || '#0284c7');
    root.style.setProperty('--tb-secondary', theme.secondaryColor || '#f97316');
    root.style.setProperty('--tb-accent', theme.accentColor || '#10b981');
    root.style.setProperty('--tb-bg', theme.backgroundColor || '#f8fafc');
    root.style.setProperty('--tb-heading', theme.headingColor || '#0f172a');
    root.style.setProperty('--tb-text', theme.bodyTextColor || '#334155');
    root.style.setProperty('--tb-btn', theme.buttonColor || '#0284c7');
    root.style.setProperty('--tb-btn-text', theme.buttonTextColor || '#ffffff');
    root.style.setProperty('--tb-nav-bg', theme.navBgColor || '#ffffff');
    root.style.setProperty('--tb-nav-text', theme.navTextColor || '#1e293b');
    root.style.setProperty('--tb-radius', theme.borderRadius || '16px');
    root.style.setProperty('--tb-font', theme.fontFamily ? `"${theme.fontFamily}", system-ui, sans-serif` : '"Plus Jakarta Sans", system-ui, sans-serif');
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/public/bootstrap');
      if (!res.ok) throw new Error('Failed to load website configuration.');
      const data = await res.json();
      setSettings(data.settings);
      setServices(data.services || []);
      setTeam(data.team || []);
      setGallery(data.gallery || []);
      setBlogs(data.blogs || []);
      setNotices(data.notices || []);
      setTestimonials(data.testimonials || []);

      if (data.settings?.theme) {
        applyTheme(data.settings.theme);
      }
    } catch (err: unknown) {
      console.error('Data fetch error:', err);
      const message = err instanceof Error ? err.message : 'Failed to connect to server';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Listen to hash changes for deep linking
    const handleHashChange = () => {
      const route = window.location.hash.replace('#', '') || '/';
      setCurrentRoute(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    const cleanRoute = route.startsWith('/') ? route : `/${route}`;
    window.location.hash = cleanRoute;
    setCurrentRoute(cleanRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const login = (token: string, email: string) => {
    setAdminToken(token);
    setAdminEmail(email);
    localStorage.setItem('tb_admin_token', token);
    localStorage.setItem('tb_admin_email', email);
  };

  const logout = () => {
    setAdminToken(null);
    setAdminEmail(null);
    localStorage.removeItem('tb_admin_token');
    localStorage.removeItem('tb_admin_email');
    navigateTo('/admin/login');
  };

  const openEnrolModal = (serviceName?: string) => {
    setSelectedServiceForModal(serviceName || '');
    setIsEnrolModalOpen(true);
  };

  const closeEnrolModal = () => {
    setIsEnrolModalOpen(false);
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        services,
        team,
        gallery,
        blogs,
        notices,
        testimonials,
        loading,
        error,
        adminToken,
        adminEmail,
        currentRoute,
        navigateTo,
        refreshData: fetchData,
        login,
        logout,
        applyTheme,
        openEnrolModal,
        closeEnrolModal,
        isEnrolModalOpen,
        selectedServiceForModal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
