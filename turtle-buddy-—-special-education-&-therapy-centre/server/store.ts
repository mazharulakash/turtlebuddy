import fs from 'fs';
import path from 'path';
import {
  SiteSettings,
  ServiceItem,
  TeamMember,
  GalleryItem,
  BlogPost,
  NoticeItem,
  TestimonialItem,
  EnquiryRecord,
  AdminActivity,
} from '../src/types';
import {
  defaultSettings,
  defaultServices,
  defaultTeam,
  defaultGallery,
  defaultBlogs,
  defaultNotices,
  defaultTestimonials,
  defaultEnquiries,
  defaultActivities,
} from './defaultData';

export interface DatabaseSchema {
  settings: SiteSettings;
  services: ServiceItem[];
  team: TeamMember[];
  gallery: GalleryItem[];
  blogs: BlogPost[];
  notices: NoticeItem[];
  testimonials: TestimonialItem[];
  enquiries: EnquiryRecord[];
  activities: AdminActivity[];
  adminAuth: {
    email: string;
    passwordHash: string; // Plaintext or salted hash for demonstration
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function getInitialDb(): DatabaseSchema {
  return {
    settings: JSON.parse(JSON.stringify(defaultSettings)),
    services: JSON.parse(JSON.stringify(defaultServices)),
    team: JSON.parse(JSON.stringify(defaultTeam)),
    gallery: JSON.parse(JSON.stringify(defaultGallery)),
    blogs: JSON.parse(JSON.stringify(defaultBlogs)),
    notices: JSON.parse(JSON.stringify(defaultNotices)),
    testimonials: JSON.parse(JSON.stringify(defaultTestimonials)),
    enquiries: JSON.parse(JSON.stringify(defaultEnquiries)),
    activities: JSON.parse(JSON.stringify(defaultActivities)),
    adminAuth: {
      email: 'admin@turtlebuddy.com',
      passwordHash: 'TurtleBuddy2025!', // Default master admin password
    },
  };
}

class Store {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all required keys exist
        const initial = getInitialDb();
        return {
          ...initial,
          ...parsed,
          settings: { ...initial.settings, ...(parsed.settings || {}) },
        };
      }
    } catch (err) {
      console.error('Error reading db.json, initializing fresh store:', err);
    }
    const fresh = getInitialDb();
    this.save(fresh);
    return fresh;
  }

  private save(dataToSave?: DatabaseSchema) {
    try {
      const payload = dataToSave || this.data;
      fs.writeFileSync(DB_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write to db.json:', err);
    }
  }

  public resetAll(): DatabaseSchema {
    this.data = getInitialDb();
    this.save();
    return this.data;
  }

  // --- Settings ---
  public getSettings(): SiteSettings {
    return this.data.settings;
  }

  public updateSettings(updates: Partial<SiteSettings>, user = 'Admin'): SiteSettings {
    this.data.settings = {
      ...this.data.settings,
      ...updates,
      theme: { ...this.data.settings.theme, ...(updates.theme || {}) },
      general: { ...this.data.settings.general, ...(updates.general || {}) },
      hero: { ...this.data.settings.hero, ...(updates.hero || {}) },
      about: { ...this.data.settings.about, ...(updates.about || {}) },
      footer: { ...this.data.settings.footer, ...(updates.footer || {}) },
    };
    this.logActivity('Updated website settings & theme configuration', user);
    this.save();
    return this.data.settings;
  }

  // --- Services ---
  public getServices(onlyPublished = false): ServiceItem[] {
    const list = [...this.data.services].sort((a, b) => a.order - b.order);
    return onlyPublished ? list.filter((s) => s.published) : list;
  }

  public getService(idOrSlug: string): ServiceItem | undefined {
    return this.data.services.find((s) => s.id === idOrSlug || s.slug === idOrSlug);
  }

  public createService(serviceData: Omit<ServiceItem, 'id'>, user = 'Admin'): ServiceItem {
    const newService: ServiceItem = {
      ...serviceData,
      id: `srv-${Date.now()}`,
      order: serviceData.order || this.data.services.length + 1,
    };
    this.data.services.push(newService);
    this.logActivity(`Created new clinical service: ${newService.title}`, user);
    this.save();
    return newService;
  }

  public updateService(id: string, updates: Partial<ServiceItem>, user = 'Admin'): ServiceItem | null {
    const index = this.data.services.findIndex((s) => s.id === id);
    if (index === -1) return null;
    this.data.services[index] = { ...this.data.services[index], ...updates };
    this.logActivity(`Updated service: ${this.data.services[index].title}`, user);
    this.save();
    return this.data.services[index];
  }

  public deleteService(id: string, user = 'Admin'): boolean {
    const target = this.data.services.find((s) => s.id === id);
    if (!target) return false;
    this.data.services = this.data.services.filter((s) => s.id !== id);
    this.logActivity(`Deleted service: ${target.title}`, user);
    this.save();
    return true;
  }

  // --- Team ---
  public getTeam(): TeamMember[] {
    return [...this.data.team].sort((a, b) => a.order - b.order);
  }

  public createTeamMember(memberData: Omit<TeamMember, 'id'>, user = 'Admin'): TeamMember {
    const newMember: TeamMember = {
      ...memberData,
      id: `tm-${Date.now()}`,
      order: memberData.order || this.data.team.length + 1,
    };
    this.data.team.push(newMember);
    this.logActivity(`Added team profile: ${newMember.name}`, user);
    this.save();
    return newMember;
  }

  public updateTeamMember(id: string, updates: Partial<TeamMember>, user = 'Admin'): TeamMember | null {
    const index = this.data.team.findIndex((t) => t.id === id);
    if (index === -1) return null;
    this.data.team[index] = { ...this.data.team[index], ...updates };
    this.logActivity(`Updated team profile: ${this.data.team[index].name}`, user);
    this.save();
    return this.data.team[index];
  }

  public deleteTeamMember(id: string, user = 'Admin'): boolean {
    const target = this.data.team.find((t) => t.id === id);
    if (!target) return false;
    this.data.team = this.data.team.filter((t) => t.id !== id);
    this.logActivity(`Deleted team profile: ${target.name}`, user);
    this.save();
    return true;
  }

  // --- Gallery ---
  public getGallery(onlyPublished = false): GalleryItem[] {
    const items = [...this.data.gallery];
    return onlyPublished ? items.filter((i) => i.published) : items;
  }

  public createGalleryItem(itemData: Omit<GalleryItem, 'id' | 'createdAt'>, user = 'Admin'): GalleryItem {
    const newItem: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.data.gallery.push(newItem);
    this.logActivity(`Added gallery photo: ${newItem.title}`, user);
    this.save();
    return newItem;
  }

  public updateGalleryItem(id: string, updates: Partial<GalleryItem>, user = 'Admin'): GalleryItem | null {
    const index = this.data.gallery.findIndex((g) => g.id === id);
    if (index === -1) return null;
    this.data.gallery[index] = { ...this.data.gallery[index], ...updates };
    this.logActivity(`Updated gallery item: ${this.data.gallery[index].title}`, user);
    this.save();
    return this.data.gallery[index];
  }

  public deleteGalleryItem(id: string, user = 'Admin'): boolean {
    const target = this.data.gallery.find((g) => g.id === id);
    if (!target) return false;
    this.data.gallery = this.data.gallery.filter((g) => g.id !== id);
    this.logActivity(`Deleted gallery item: ${target.title}`, user);
    this.save();
    return true;
  }

  // --- Blogs ---
  public getBlogs(onlyPublished = false): BlogPost[] {
    const items = [...this.data.blogs].sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
    return onlyPublished ? items.filter((b) => b.published) : items;
  }

  public getBlog(idOrSlug: string): BlogPost | undefined {
    return this.data.blogs.find((b) => b.id === idOrSlug || b.slug === idOrSlug);
  }

  public createBlog(blogData: Omit<BlogPost, 'id'>, user = 'Admin'): BlogPost {
    const newBlog: BlogPost = {
      ...blogData,
      id: `blog-${Date.now()}`,
    };
    this.data.blogs.push(newBlog);
    this.logActivity(`Published new article: ${newBlog.title}`, user);
    this.save();
    return newBlog;
  }

  public updateBlog(id: string, updates: Partial<BlogPost>, user = 'Admin'): BlogPost | null {
    const index = this.data.blogs.findIndex((b) => b.id === id);
    if (index === -1) return null;
    this.data.blogs[index] = { ...this.data.blogs[index], ...updates };
    this.logActivity(`Updated article: ${this.data.blogs[index].title}`, user);
    this.save();
    return this.data.blogs[index];
  }

  public deleteBlog(id: string, user = 'Admin'): boolean {
    const target = this.data.blogs.find((b) => b.id === id);
    if (!target) return false;
    this.data.blogs = this.data.blogs.filter((b) => b.id !== id);
    this.logActivity(`Deleted article: ${target.title}`, user);
    this.save();
    return true;
  }

  // --- Notices ---
  public getNotices(onlyPublished = false): NoticeItem[] {
    const items = [...this.data.notices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return onlyPublished ? items.filter((n) => n.published) : items;
  }

  public createNotice(noticeData: Omit<NoticeItem, 'id'>, user = 'Admin'): NoticeItem {
    const newNotice: NoticeItem = {
      ...noticeData,
      id: `not-${Date.now()}`,
    };
    this.data.notices.push(newNotice);
    this.logActivity(`Published announcement: ${newNotice.title}`, user);
    this.save();
    return newNotice;
  }

  public updateNotice(id: string, updates: Partial<NoticeItem>, user = 'Admin'): NoticeItem | null {
    const index = this.data.notices.findIndex((n) => n.id === id);
    if (index === -1) return null;
    this.data.notices[index] = { ...this.data.notices[index], ...updates };
    this.logActivity(`Updated notice: ${this.data.notices[index].title}`, user);
    this.save();
    return this.data.notices[index];
  }

  public deleteNotice(id: string, user = 'Admin'): boolean {
    const target = this.data.notices.find((n) => n.id === id);
    if (!target) return false;
    this.data.notices = this.data.notices.filter((n) => n.id !== id);
    this.logActivity(`Deleted notice: ${target.title}`, user);
    this.save();
    return true;
  }

  // --- Testimonials ---
  public getTestimonials(onlyPublished = false): TestimonialItem[] {
    const list = [...this.data.testimonials];
    return onlyPublished ? list.filter((t) => t.published) : list;
  }

  public createTestimonial(testimonialData: Omit<TestimonialItem, 'id'>, user = 'Admin'): TestimonialItem {
    const newTestimonial: TestimonialItem = {
      ...testimonialData,
      id: `test-${Date.now()}`,
    };
    this.data.testimonials.push(newTestimonial);
    this.logActivity(`Added testimonial from ${newTestimonial.parentName}`, user);
    this.save();
    return newTestimonial;
  }

  public updateTestimonial(id: string, updates: Partial<TestimonialItem>, user = 'Admin'): TestimonialItem | null {
    const index = this.data.testimonials.findIndex((t) => t.id === id);
    if (index === -1) return null;
    this.data.testimonials[index] = { ...this.data.testimonials[index], ...updates };
    this.logActivity(`Updated testimonial for ${this.data.testimonials[index].parentName}`, user);
    this.save();
    return this.data.testimonials[index];
  }

  public deleteTestimonial(id: string, user = 'Admin'): boolean {
    const target = this.data.testimonials.find((t) => t.id === id);
    if (!target) return false;
    this.data.testimonials = this.data.testimonials.filter((t) => t.id !== id);
    this.logActivity(`Deleted testimonial from ${target.parentName}`, user);
    this.save();
    return true;
  }

  // --- Enquiries ---
  public getEnquiries(): EnquiryRecord[] {
    return [...this.data.enquiries].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public createEnquiry(enquiryInput: Omit<EnquiryRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'>): EnquiryRecord {
    const now = new Date().toISOString();
    const newEnquiry: EnquiryRecord = {
      ...enquiryInput,
      id: `enq-${Date.now()}`,
      status: 'New',
      createdAt: now,
      updatedAt: now,
    };
    this.data.enquiries.unshift(newEnquiry);
    this.logActivity(`New assessment request received from ${newEnquiry.parentName} for ${newEnquiry.serviceOfInterest}`, 'Public Web');
    this.save();
    return newEnquiry;
  }

  public updateEnquiry(
    id: string,
    updates: { status?: EnquiryRecord['status']; adminNotes?: string },
    user = 'Admin'
  ): EnquiryRecord | null {
    const index = this.data.enquiries.findIndex((e) => e.id === id);
    if (index === -1) return null;
    this.data.enquiries[index] = {
      ...this.data.enquiries[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.logActivity(`Updated enquiry #${id} status to ${this.data.enquiries[index].status}`, user);
    this.save();
    return this.data.enquiries[index];
  }

  public deleteEnquiry(id: string, user = 'Admin'): boolean {
    const target = this.data.enquiries.find((e) => e.id === id);
    if (!target) return false;
    this.data.enquiries = this.data.enquiries.filter((e) => e.id !== id);
    this.logActivity(`Deleted enquiry #${id} (${target.parentName})`, user);
    this.save();
    return true;
  }

  // --- Activities ---
  public getActivities(): AdminActivity[] {
    return [...this.data.activities].slice(0, 50);
  }

  public logActivity(action: string, user = 'Admin') {
    const entry: AdminActivity = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      action,
      timestamp: new Date().toISOString(),
      user,
    };
    this.data.activities.unshift(entry);
    if (this.data.activities.length > 100) {
      this.data.activities.pop();
    }
  }

  // --- Admin Auth ---
  public verifyAdmin(email: string, password: string): { success: boolean; token?: string; user?: { email: string } } {
    if (
      email.toLowerCase().trim() === this.data.adminAuth.email.toLowerCase().trim() &&
      password === this.data.adminAuth.passwordHash
    ) {
      const token = `tb_session_${Buffer.from(email + ':' + Date.now()).toString('base64')}`;
      return {
        success: true,
        token,
        user: { email: this.data.adminAuth.email },
      };
    }
    return { success: false };
  }

  public updateAdminCredentials(email: string, newPassword?: string, user = 'Admin'): boolean {
    if (email) this.data.adminAuth.email = email.toLowerCase().trim();
    if (newPassword && newPassword.length >= 6) this.data.adminAuth.passwordHash = newPassword;
    this.logActivity('Admin credentials updated', user);
    this.save();
    return true;
  }
}

export const store = new Store();
