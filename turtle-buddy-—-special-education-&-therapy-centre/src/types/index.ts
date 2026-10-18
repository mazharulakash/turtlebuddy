export type EnquiryStatus = 'New' | 'Contacted' | 'Scheduled' | 'Completed' | 'Closed';

export interface SiteTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  headingColor: string;
  bodyTextColor: string;
  buttonColor: string;
  buttonTextColor: string;
  navBgColor: string;
  navTextColor: string;
  borderRadius: string;
  fontFamily: string;
}

export interface SiteGeneral {
  siteName: string;
  tagLine: string;
  logoUrl: string;
  phone: string;
  email: string;
  address: string;
  openingHours: string;
  emergencyNotice: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
  };
  mapUrl: string;
}

export interface SiteHero {
  welcomeBadge: string;
  mainHeading: string;
  supportingText: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  heroImage: string;
  floatingBadgeTitle: string;
  floatingBadgeSubtitle: string;
}

export interface SiteStat {
  id: string;
  value: string;
  label: string;
  note: string;
}

export interface ValueItem {
  title: string;
  description: string;
}

export interface SiteAbout {
  title: string;
  subtitle: string;
  mission: string;
  vision: string;
  values: ValueItem[];
  photo: string;
  story: string;
}

export interface WhyChooseUsItem {
  id: string;
  title: string;
  description: string;
}

export interface SiteFooter {
  copyright: string;
  disclaimer: string;
}

export interface SiteSettings {
  theme: SiteTheme;
  general: SiteGeneral;
  hero: SiteHero;
  stats: SiteStat[];
  about: SiteAbout;
  whyChooseUs: WhyChooseUsItem[];
  footer: SiteFooter;
}

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  iconName: string;
  benefits: string[];
  whoIsItFor: string[];
  approach: string[];
  published: boolean;
  order: number;
}

export interface TeamMember {
  id: string;
  name: string;
  designation: string;
  qualifications: string;
  specialties: string[];
  bio: string;
  photo: string;
  order: number;
  email?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  caption: string;
  published: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  featuredImage: string;
  publishedDate: string;
  readTime: string;
  published: boolean;
}

export interface NoticeItem {
  id: string;
  title: string;
  description: string;
  date: string;
  category: 'Event' | 'Admission' | 'Workshop' | 'General';
  isImportant: boolean;
  published: boolean;
  actionUrl?: string;
  actionText?: string;
}

export interface TestimonialItem {
  id: string;
  parentName: string;
  childDetail: string;
  quote: string;
  serviceReceived: string;
  rating: number;
  published: boolean;
}

export interface EnquiryRecord {
  id: string;
  parentName: string;
  phone: string;
  email: string;
  childAge: string;
  childName?: string;
  serviceOfInterest: string;
  preferredDate: string;
  message: string;
  consent: boolean;
  status: EnquiryStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminActivity {
  id: string;
  action: string;
  timestamp: string;
  user: string;
}
