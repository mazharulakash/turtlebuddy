import React from 'react';
import { useApp } from '../../context/AppContext';
import { BrandLogo } from '../common/BrandLogo';
import { Phone, Mail, MapPin, Clock, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, services, navigateTo } = useApp();

  const general = settings?.general;
  const footer = settings?.footer;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Column 1: Brand & Bio */}
          <div className="space-y-4">
            <BrandLogo size="md" whiteText={true} />
            <p className="text-sm text-slate-400 leading-relaxed">
              {settings?.about?.mission ||
                'Nurturing every child’s potential through compassionate, evidence-based ABA therapy, speech pathology, and sensory occupational therapy.'}
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-amber-300 font-medium bg-amber-950/40 border border-amber-800/40 px-3 py-2 rounded-xl">
              <Heart className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Dedicated to autism and neurodiverse growth</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => navigateTo('/')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/about')}
                  className="hover:text-white transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/team')}
                  className="hover:text-white transition-colors"
                >
                  Clinical Specialists & Team
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/gallery')}
                  className="hover:text-white transition-colors"
                >
                  Facility Gallery & Sensory Gym
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/blogs')}
                  className="hover:text-white transition-colors"
                >
                  Parent Resources & Blogs
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/notices')}
                  className="hover:text-white transition-colors"
                >
                  Admissions & Announcements
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateTo('/privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy & Confidentiality
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Clinical Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Our Services</h4>
            <ul className="space-y-2.5 text-sm">
              {services.slice(0, 6).map((service) => (
                <li key={service.id}>
                  <button
                    onClick={() => navigateTo(`/services/${service.slug}`)}
                    className="hover:text-white transition-colors text-left truncate block max-w-full"
                  >
                    {service.title}
                  </button>
                </li>
              ))}
              <li className="pt-1">
                <button
                  onClick={() => navigateTo('/enrol')}
                  className="text-amber-400 hover:text-amber-300 font-semibold text-xs flex items-center gap-1"
                >
                  Book Assessment Request →
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Hours */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Contact & Visit</h4>
            <div className="space-y-3 text-sm text-slate-300">
              {general?.address && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span>{general.address}</span>
                </div>
              )}
              {general?.phone && (
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                  <a href={`tel:${general.phone}`} className="hover:text-white transition-colors">
                    {general.phone}
                  </a>
                </div>
              )}
              {general?.email && (
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                  <a href={`mailto:${general.email}`} className="hover:text-white transition-colors">
                    {general.email}
                  </a>
                </div>
              )}
              {general?.openingHours && (
                <div className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <span className="text-xs text-slate-400">{general.openingHours}</span>
                </div>
              )}
            </div>

            {/* Admin entry point link */}
            <div className="pt-2">
              <button
                onClick={() => navigateTo('/admin')}
                className="text-xs text-slate-500 hover:text-slate-300 underline transition-colors"
              >
                Staff / Admin Portal Login
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{footer?.copyright || '© 2026 Turtle Buddy. All rights reserved.'}</p>
          <p className="text-slate-500 text-center md:text-right max-w-xl">
            {footer?.disclaimer ||
              'Turtle Buddy provides developmental assessments and special education allied therapies. For medical emergencies, consult your primary pediatrician.'}
          </p>
        </div>
      </div>
    </footer>
  );
};
