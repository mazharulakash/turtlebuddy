import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Award,
  HeartHandshake,
  Calendar,
  MessageSquare,
  Activity,
  BrainCircuit,
  ClipboardCheck,
  ExternalLink,
  ChevronRight,
  Star,
  Compass,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { settings, services, team, gallery, blogs, notices, testimonials, navigateTo, openEnrolModal } = useApp();

  const hero = settings?.hero;
  const stats = settings?.stats || [];
  const about = settings?.about;
  const whyChooseUs = settings?.whyChooseUs || [];

  // Gallery Lightbox Modal state
  const [selectedGalleryImg, setSelectedGalleryImg] = useState<{ url: string; title: string; caption: string } | null>(null);

  // Home Quick Enquiry state
  const [quickParentName, setQuickParentName] = useState('');
  const [quickPhone, setQuickPhone] = useState('');
  const [quickEmail, setQuickEmail] = useState('');
  const [quickService, setQuickService] = useState('Applied Behaviour Analysis (ABA) Therapy');
  const [quickChildAge, setQuickChildAge] = useState('');
  const [quickMessage, setQuickMessage] = useState('');
  const [quickConsent, setQuickConsent] = useState(false);
  const [quickSubmitting, setQuickSubmitting] = useState(false);
  const [quickSuccess, setQuickSuccess] = useState(false);
  const [quickError, setQuickError] = useState<string | null>(null);

  const handleQuickSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuickError(null);

    if (!quickParentName || !quickPhone || !quickEmail) {
      setQuickError('Please provide your name, phone, and email address.');
      return;
    }
    if (!quickConsent) {
      setQuickError('Please consent to clinical contact communications.');
      return;
    }

    setQuickSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentName: quickParentName,
          phone: quickPhone,
          email: quickEmail,
          childAge: quickChildAge || 'Not specified',
          serviceOfInterest: quickService,
          preferredDate: new Date().toISOString().split('T')[0],
          message: quickMessage,
          consent: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit enquiry.');
      setQuickSuccess(true);
    } catch (err: unknown) {
      setQuickError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setQuickSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-20 overflow-hidden">
      {/* =========================================================================
          HERO SECTION (Inspired by DACAC reference layout)
          ========================================================================= */}
      <section className="relative pt-6 sm:pt-10 lg:pt-14 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Value Proposition & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              {/* Welcome Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs border border-sky-100 bg-sky-50 text-sky-700">
                <Sparkles className="w-3.5 h-3.5 text-sky-500" />
                <span>{hero?.welcomeBadge || 'WELCOME TO TURTLE BUDDY'}</span>
              </div>

              {/* Main Headline */}
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12]"
                style={{ color: 'var(--tb-heading, #0f172a)' }}
              >
                {hero?.mainHeading || 'Every Child Deserves a Chance to Grow'}
              </h1>

              {/* Supporting Copy */}
              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                {hero?.supportingText ||
                  'At Turtle Buddy, we empower children on the autism spectrum and with diverse developmental milestones through compassionate, evidence-based therapy, individualized learning plans, and warm family partnerships.'}
              </p>

              {/* Two CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigateTo(hero?.primaryButtonLink || '/services')}
                  className="px-6 py-3.5 text-sm font-bold text-white rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2"
                  style={{ backgroundColor: 'var(--tb-btn, #0284c7)' }}
                >
                  <span>{hero?.primaryButtonText || 'Explore Our Services'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => openEnrolModal()}
                  className="px-6 py-3.5 text-sm font-bold rounded-xl shadow-xs hover:shadow transition-all active:scale-95 border-2 flex items-center gap-2"
                  style={{
                    borderColor: 'var(--tb-secondary, #f97316)',
                    color: 'var(--tb-secondary, #f97316)',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <Calendar className="w-4 h-4" />
                  <span>{hero?.secondaryButtonText || 'Book an Assessment'}</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>BCBA & Licensed Specialists</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Individualized 1:1 Care</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Family-Centered Coaching</span>
                </div>
              </div>
            </div>

            {/* Right Column: Large Rounded Hero Image & Floating Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Decorative background aura */}
                <div
                  className="absolute -inset-4 rounded-3xl opacity-20 filter blur-2xl -z-10"
                  style={{ backgroundColor: 'var(--tb-primary, #0284c7)' }}
                />

                {/* Primary Rounded Hero Image */}
                <div className="overflow-hidden rounded-3xl shadow-xl border-4 border-white bg-slate-100 aspect-4/3 relative group">
                  <img
                    src={hero?.heroImage || '/src/assets/images/hero_child_therapy_1792054963772.jpg'}
                    alt="Happy child learning and participating in therapy at Turtle Buddy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Floating Information Card */}
                <div
                  className="absolute -bottom-6 -left-4 sm:-bottom-6 sm:-left-6 bg-white p-4 sm:p-5 rounded-2xl shadow-xl border border-slate-100 max-w-xs animate-bounce-subtle"
                  style={{ borderRadius: 'var(--tb-radius, 16px)' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: 'var(--tb-secondary, #f97316)' }}
                    >
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-tight">
                        {hero?.floatingBadgeTitle || 'Growing Together'}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-normal mt-0.5">
                        {hero?.floatingBadgeSubtitle || 'Individualized plans & warm multi-disciplinary care'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          STATISTICS SECTION (Editable, sample verified figures)
          ========================================================================= */}
      <section className="bg-white py-12 border-y border-slate-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            {stats.map((stat) => (
              <div key={stat.id} className="pt-4 md:pt-0 px-2 space-y-1">
                <div
                  className="text-3xl sm:text-4xl font-extrabold tracking-tight font-mono tabular-nums"
                  style={{ color: 'var(--tb-primary, #0284c7)' }}
                >
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-slate-800">{stat.label}</div>
                <div className="text-xs text-slate-400">{stat.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          ABOUT SECTION
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Image */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              <div className="overflow-hidden rounded-3xl shadow-lg border-2 border-slate-100 bg-slate-100 aspect-4/3">
                <img
                  src={about?.photo || '/src/assets/images/aba_therapy_session_1792054964703.jpg'}
                  alt="Special education therapist interacting with child at Turtle Buddy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div
                className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl opacity-10 pointer-events-none -z-10"
                style={{ backgroundColor: 'var(--tb-secondary, #f97316)' }}
              />
            </div>
          </div>

          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
            <div className="space-y-2">
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--tb-secondary, #f97316)' }}
              >
                {about?.title || 'About Turtle Buddy'}
              </span>
              <h2
                className="text-3xl sm:text-4xl font-extrabold tracking-tight"
                style={{ color: 'var(--tb-heading, #0f172a)' }}
              >
                {about?.subtitle || 'Nurturing Potential with Science, Patience, and Heart'}
              </h2>
            </div>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              {about?.story ||
                'Turtle Buddy was established to provide a dedicated, stress-free haven where children with Autism Spectrum Disorder (ASD), developmental delays, and sensory challenges receive personalized, clinical-grade care designed around their unique learning styles.'}
            </p>

            {/* Core Values grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {about?.values?.slice(0, 4).map((val, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>{val.title}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-normal">{val.description}</p>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigateTo('/about')}
                className="px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-2"
                style={{ backgroundColor: 'var(--tb-primary, #0284c7)' }}
              >
                <span>Learn More About Us</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SERVICES SECTION (Cards with images, titles, descriptions, learn more)
          ========================================================================= */}
      <section className="bg-slate-50/70 py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: 'var(--tb-secondary, #f97316)' }}
            >
              Comprehensive Pediatric Care
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ color: 'var(--tb-heading, #0f172a)' }}
            >
              Our Specialized Therapy Services
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Evidence-based interventions designed to build real-world communication, motor coordination,
              emotional independence, and joyful peer connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col group"
                style={{ borderRadius: 'var(--tb-radius, 16px)' }}
              >
                {/* Service Card Image */}
                <div className="h-48 overflow-hidden relative bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-bold text-white px-2.5 py-1 rounded-lg bg-slate-900/60 backdrop-blur-xs">
                    {service.title.split('(')[0].trim()}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900 leading-snug group-hover:text-sky-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {service.shortDescription}
                    </p>
                  </div>

                  {/* Highlights */}
                  {service.benefits && service.benefits.length > 0 && (
                    <ul className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
                      {service.benefits.slice(0, 2).map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5 truncate">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span className="truncate">{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Action Link */}
                  <div className="pt-2 flex items-center justify-between">
                    <button
                      onClick={() => navigateTo(`/services/${service.slug}`)}
                      className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 transition-colors"
                    >
                      <span>Explore Service Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openEnrolModal(service.title)}
                      className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 transition-colors"
                    >
                      Enrol
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <button
              onClick={() => navigateTo('/services')}
              className="px-6 py-3 text-sm font-bold text-white rounded-xl shadow-sm hover:shadow transition-all inline-flex items-center gap-2"
              style={{ backgroundColor: 'var(--tb-btn, #0284c7)' }}
            >
              <span>View All Services & Therapy Modalities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          WHY CHOOSE TURTLE BUDDY?
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: 'var(--tb-secondary, #f97316)' }}
          >
            The Turtle Buddy Difference
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold tracking-tight"
            style={{ color: 'var(--tb-heading, #0f172a)' }}
          >
            Why Parents Trust Our Centre
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {whyChooseUs.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-6 rounded-2xl bg-white border border-slate-200/70 shadow-xs hover:border-sky-300 transition-all space-y-3"
              style={{ borderRadius: 'var(--tb-radius, 16px)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                style={{
                  backgroundColor:
                    idx % 3 === 0
                      ? 'var(--tb-primary, #0284c7)'
                      : idx % 3 === 1
                      ? 'var(--tb-secondary, #f97316)'
                      : 'var(--tb-accent, #10b981)',
                }}
              >
                {idx === 0 ? (
                  <BrainCircuit className="w-5 h-5" />
                ) : idx === 1 ? (
                  <Users className="w-5 h-5" />
                ) : idx === 2 ? (
                  <Award className="w-5 h-5" />
                ) : idx === 3 ? (
                  <Activity className="w-5 h-5" />
                ) : idx === 4 ? (
                  <ClipboardCheck className="w-5 h-5" />
                ) : (
                  <Compass className="w-5 h-5" />
                )}
              </div>
              <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          OUR TEAM PREVIEW
          ========================================================================= */}
      <section className="bg-slate-50/70 py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: 'var(--tb-secondary, #f97316)' }}
              >
                Licensed Clinical Specialists
              </span>
              <h2
                className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1"
                style={{ color: 'var(--tb-heading, #0f172a)' }}
              >
                Meet Our Dedicated Team
              </h2>
            </div>
            <button
              onClick={() => navigateTo('/team')}
              className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 shrink-0"
            >
              <span>View Full Clinical Faculty</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.slice(0, 3).map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between space-y-4"
                style={{ borderRadius: 'var(--tb-radius, 16px)' }}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={member.photo}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-18 h-18 rounded-2xl object-cover border-2 border-slate-100 shrink-0"
                  />
                  <div>
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{member.name}</h3>
                    <p className="text-xs font-semibold text-sky-600 mt-0.5">{member.designation}</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug line-clamp-2">
                      {member.qualifications}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed border-t border-slate-100 pt-3">
                  {member.bio}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {member.specialties.map((spec, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          GALLERY PREVIEW WITH LIGHTBOX
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: 'var(--tb-secondary, #f97316)' }}
            >
              Sensory-Safe Facilities
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1"
              style={{ color: 'var(--tb-heading, #0f172a)' }}
            >
              Centre Gallery & Environments
            </h2>
          </div>
          <button
            onClick={() => navigateTo('/gallery')}
            className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 shrink-0"
          >
            <span>Explore Complete Gallery</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.slice(0, 4).map((item) => (
            <div
              key={item.id}
              onClick={() =>
                setSelectedGalleryImg({ url: item.imageUrl, title: item.title, caption: item.caption })
              }
              className="group relative rounded-2xl overflow-hidden aspect-4/3 cursor-pointer bg-slate-100 border border-slate-200/80 shadow-xs"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <span className="text-white text-xs font-bold leading-tight">{item.title}</span>
                <span className="text-[10px] text-slate-300 truncate mt-0.5">{item.category}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedGalleryImg && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedGalleryImg(null)}
        >
          <div
            className="relative max-w-3xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedGalleryImg.url}
              alt={selectedGalleryImg.title}
              className="w-full max-h-[70vh] object-cover"
            />
            <div className="p-4 bg-white flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-900">{selectedGalleryImg.title}</h4>
                <p className="text-xs text-slate-500 mt-0.5">{selectedGalleryImg.caption}</p>
              </div>
              <button
                onClick={() => setSelectedGalleryImg(null)}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PARENT TESTIMONIALS
          ========================================================================= */}
      <section className="bg-sky-50/60 py-16 border-y border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: 'var(--tb-secondary, #f97316)' }}
            >
              Heartfelt Stories
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight"
              style={{ color: 'var(--tb-heading, #0f172a)' }}
            >
              What Families Say About Turtle Buddy
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((test) => (
              <div
                key={test.id}
                className="p-6 rounded-2xl bg-white border border-sky-100 shadow-xs flex flex-col justify-between space-y-4"
                style={{ borderRadius: 'var(--tb-radius, 16px)' }}
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(test.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    "{test.quote}"
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <h4 className="text-xs font-bold text-slate-900">{test.parentName}</h4>
                  <p className="text-[11px] text-slate-500">{test.childDetail}</p>
                  <p className="text-[10px] text-sky-600 font-medium mt-0.5">{test.serviceReceived}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          LATEST NEWS & BLOGS
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: 'var(--tb-secondary, #f97316)' }}
            >
              Developmental Articles & Insights
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1"
              style={{ color: 'var(--tb-heading, #0f172a)' }}
            >
              Latest from Our Blog
            </h2>
          </div>
          <button
            onClick={() => navigateTo('/blogs')}
            className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 shrink-0"
          >
            <span>Read All Articles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogs.slice(0, 3).map((blog) => (
            <article
              key={blog.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
              style={{ borderRadius: 'var(--tb-radius, 16px)' }}
            >
              <div className="h-44 overflow-hidden bg-slate-100 relative">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span className="font-semibold text-sky-600">{blog.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{blog.publishedDate}</span>
                    <span aria-hidden="true">·</span>
                    <span>{blog.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-slate-600 truncate max-w-[160px]">
                    By {blog.author}
                  </span>
                  <button
                    onClick={() => navigateTo(`/blogs/${blog.slug}`)}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* =========================================================================
          NOTICES & ANNOUNCEMENTS
          ========================================================================= */}
      <section className="bg-amber-50/40 py-12 border-y border-amber-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Official Updates
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-0.5">
                Notices & Centre Announcements
              </h2>
            </div>
            <button
              onClick={() => navigateTo('/notices')}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 underline"
            >
              View Notice Archive →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notices.slice(0, 4).map((notice) => (
              <div
                key={notice.id}
                className="p-4 rounded-xl bg-white border border-amber-200/70 shadow-xs flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px]">
                      {notice.category}
                    </span>
                    <span className="text-slate-400">{notice.date}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">{notice.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {notice.description}
                  </p>
                </div>
                {notice.actionUrl && (
                  <button
                    onClick={() => navigateTo(notice.actionUrl!)}
                    className="shrink-0 text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
                  >
                    {notice.actionText || 'Details'}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          CONTACT & ENROLMENT FORM SECTION
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl overflow-hidden shadow-xl p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left side details */}
            <div className="lg:col-span-5 space-y-6">
              <span
                className="text-xs font-bold uppercase tracking-wider text-amber-400"
              >
                Start Your Journey
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Schedule a Comprehensive Developmental Assessment
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Take the first step toward understanding and nurturing your child’s unique potential.
                Our clinical director will personally review your intake enquiry and recommend the optimal
                diagnostic and therapy path.
              </p>
              <div className="space-y-3 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No waiting list for initial telephone triage</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Strict parent and child privacy (HIPAA compliant)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Warm, sensory-safe play observation environment</span>
                </div>
              </div>
            </div>

            {/* Right side form */}
            <div className="lg:col-span-7 bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-lg">
              {quickSuccess ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold">Assessment Request Received</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Thank you, {quickParentName}. Our clinical intake coordinator will contact you at{' '}
                    {quickPhone} within 24 hours.
                  </p>
                  <button
                    onClick={() => setQuickSuccess(false)}
                    className="mt-3 px-4 py-2 text-xs font-bold text-sky-600 border border-sky-200 rounded-lg"
                  >
                    Submit Another Request
                  </button>
                </div>
              ) : (
                <form onSubmit={handleQuickSubmit} className="space-y-4">
                  {quickError && (
                    <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                      {quickError}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Parent / Guardian Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={quickParentName}
                        onChange={(e) => setQuickParentName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Contact Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={quickPhone}
                        onChange={(e) => setQuickPhone(e.target.value)}
                        placeholder="Phone number"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={quickEmail}
                        onChange={(e) => setQuickEmail(e.target.value)}
                        placeholder="parent@example.com"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Child's Age
                      </label>
                      <input
                        type="text"
                        value={quickChildAge}
                        onChange={(e) => setQuickChildAge(e.target.value)}
                        placeholder="e.g. 4 years old"
                        className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Primary Therapy / Service of Interest *
                    </label>
                    <select
                      value={quickService}
                      onChange={(e) => setQuickService(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                    >
                      {services.map((s) => (
                        <option key={s.id} value={s.title}>
                          {s.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Child's Needs or Message
                    </label>
                    <textarea
                      rows={2}
                      value={quickMessage}
                      onChange={(e) => setQuickMessage(e.target.value)}
                      placeholder="Brief details regarding developmental questions or goals..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-1">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={quickConsent}
                        onChange={(e) => setQuickConsent(e.target.checked)}
                        className="mt-0.5 h-3.5 w-3.5 text-sky-600 rounded border-slate-300"
                      />
                      <span className="text-[11px] text-slate-500">
                        I agree to receive assessment details and confirm my information will be held confidentially.
                      </span>
                    </label>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={quickSubmitting}
                      className="w-full py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
                      style={{ backgroundColor: 'var(--tb-secondary, #f97316)' }}
                    >
                      {quickSubmitting ? 'Submitting...' : 'Request Assessment Consultation'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
