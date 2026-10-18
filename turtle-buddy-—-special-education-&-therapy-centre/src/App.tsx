import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { EnrolmentModal } from './components/common/EnrolmentModal';

// Public Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesPage } from './pages/ServicesPage';
import { AbaTherapyPage } from './pages/AbaTherapyPage';
import { SpeechTherapyPage } from './pages/SpeechTherapyPage';
import { OccupationalTherapyPage } from './pages/OccupationalTherapyPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { ParentCounsellingPage } from './pages/ParentCounsellingPage';
import { TeamPage } from './pages/TeamPage';
import { GalleryPage } from './pages/GalleryPage';
import { BlogPage } from './pages/BlogPage';
import { NoticesPage } from './pages/NoticesPage';
import { ContactPage } from './pages/ContactPage';
import { EnrolPage } from './pages/EnrolPage';
import { PrivacyPage } from './pages/PrivacyPage';

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminTheme } from './pages/admin/AdminTheme';
import { AdminContent } from './pages/admin/AdminContent';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminTeam } from './pages/admin/AdminTeam';
import { AdminBlogs } from './pages/admin/AdminBlogs';
import { AdminGallery } from './pages/admin/AdminGallery';
import { AdminNotices } from './pages/admin/AdminNotices';
import { AdminEnquiries } from './pages/admin/AdminEnquiries';
import { AdminSettings } from './pages/admin/AdminSettings';

const RouterView: React.FC = () => {
  const { currentRoute, adminToken, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-slate-500">Loading Turtle Buddy Centre...</p>
        </div>
      </div>
    );
  }

  // Admin Routes routing
  if (currentRoute.startsWith('/admin')) {
    if (!adminToken && currentRoute !== '/admin/login') {
      return <AdminLoginPage />;
    }

    switch (currentRoute) {
      case '/admin/login':
        return <AdminLoginPage />;
      case '/admin':
      case '/admin/dashboard':
        return <AdminDashboard />;
      case '/admin/theme':
      case '/admin/appearance':
        return <AdminTheme />;
      case '/admin/content':
        return <AdminContent />;
      case '/admin/services':
        return <AdminServices />;
      case '/admin/team':
        return <AdminTeam />;
      case '/admin/blogs':
        return <AdminBlogs />;
      case '/admin/gallery':
        return <AdminGallery />;
      case '/admin/notices':
        return <AdminNotices />;
      case '/admin/enquiries':
        return <AdminEnquiries />;
      case '/admin/settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  }

  // Public Routes (wrapped in Navbar + Footer)
  let PageComponent = HomePage;

  if (currentRoute === '/about') {
    PageComponent = AboutPage;
  } else if (currentRoute === '/services') {
    PageComponent = ServicesPage;
  } else if (currentRoute === '/services/aba-therapy') {
    PageComponent = AbaTherapyPage;
  } else if (currentRoute === '/services/speech-language-therapy') {
    PageComponent = SpeechTherapyPage;
  } else if (currentRoute === '/services/occupational-therapy') {
    PageComponent = OccupationalTherapyPage;
  } else if (currentRoute === '/services/child-development-assessment') {
    PageComponent = AssessmentPage;
  } else if (currentRoute === '/services/parent-counselling') {
    PageComponent = ParentCounsellingPage;
  } else if (currentRoute.startsWith('/services/')) {
    // Other specific services fallback to ServicesPage or detailed view
    PageComponent = ServicesPage;
  } else if (currentRoute === '/team') {
    PageComponent = TeamPage;
  } else if (currentRoute === '/gallery') {
    PageComponent = GalleryPage;
  } else if (currentRoute.startsWith('/blogs')) {
    PageComponent = BlogPage;
  } else if (currentRoute === '/notices') {
    PageComponent = NoticesPage;
  } else if (currentRoute === '/contact') {
    PageComponent = ContactPage;
  } else if (currentRoute === '/enrol') {
    PageComponent = EnrolPage;
  } else if (currentRoute === '/privacy') {
    PageComponent = PrivacyPage;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50">
      <Navbar />
      <main className="flex-1">
        <PageComponent />
      </main>
      <Footer />
      <EnrolmentModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <RouterView />
    </AppProvider>
  );
}
