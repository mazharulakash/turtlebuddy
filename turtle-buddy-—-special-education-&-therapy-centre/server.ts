import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { store } from './server/store';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // JSON Body Parser with ample limit for image uploads
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Ensure uploads directory exists
  const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  app.use('/uploads', express.static(UPLOADS_DIR));

  // --- Auth Middleware ---
  const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer tb_session_')) {
      return res.status(401).json({ error: 'Unauthorized: Admin authentication required.' });
    }
    next();
  };

  // --- Auth Endpoints ---
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    const result = store.verifyAdmin(email, password);
    if (!result.success) {
      return res.status(401).json({ error: 'Invalid admin credentials.' });
    }
    return res.json({
      success: true,
      token: result.token,
      user: result.user,
    });
  });

  app.get('/api/auth/me', requireAdmin, (_req: Request, res: Response) => {
    return res.json({ success: true, user: { email: 'admin@turtlebuddy.com' } });
  });

  app.post('/api/auth/change-password', requireAdmin, (req: Request, res: Response) => {
    const { email, newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }
    store.updateAdminCredentials(email, newPassword);
    return res.json({ success: true, message: 'Admin password updated successfully.' });
  });

  // --- Combined Public Bootstrap Endpoint ---
  app.get('/api/public/bootstrap', (_req: Request, res: Response) => {
    const settings = store.getSettings();
    const services = store.getServices(true);
    const team = store.getTeam();
    const gallery = store.getGallery(true);
    const blogs = store.getBlogs(true);
    const notices = store.getNotices(true);
    const testimonials = store.getTestimonials(true);

    return res.json({
      settings,
      services,
      team,
      gallery,
      blogs,
      notices,
      testimonials,
    });
  });

  // --- Settings Endpoints ---
  app.get('/api/settings', (_req: Request, res: Response) => {
    return res.json(store.getSettings());
  });

  app.put('/api/settings', requireAdmin, (req: Request, res: Response) => {
    const updated = store.updateSettings(req.body);
    return res.json({ success: true, settings: updated });
  });

  app.post('/api/settings/reset', requireAdmin, (_req: Request, res: Response) => {
    store.resetAll();
    return res.json({ success: true, settings: store.getSettings() });
  });

  // --- Services Endpoints ---
  app.get('/api/services', (req: Request, res: Response) => {
    const onlyPublished = req.query.admin !== 'true';
    return res.json(store.getServices(onlyPublished));
  });

  app.get('/api/services/:idOrSlug', (req: Request, res: Response) => {
    const service = store.getService(req.params.idOrSlug);
    if (!service) return res.status(404).json({ error: 'Service not found.' });
    return res.json(service);
  });

  app.post('/api/services', requireAdmin, (req: Request, res: Response) => {
    const newService = store.createService(req.body);
    return res.status(201).json(newService);
  });

  app.put('/api/services/:id', requireAdmin, (req: Request, res: Response) => {
    const updated = store.updateService(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Service not found.' });
    return res.json(updated);
  });

  app.delete('/api/services/:id', requireAdmin, (req: Request, res: Response) => {
    const success = store.deleteService(req.params.id);
    if (!success) return res.status(404).json({ error: 'Service not found.' });
    return res.json({ success: true });
  });

  // --- Team Endpoints ---
  app.get('/api/team', (_req: Request, res: Response) => {
    return res.json(store.getTeam());
  });

  app.post('/api/team', requireAdmin, (req: Request, res: Response) => {
    const newMember = store.createTeamMember(req.body);
    return res.status(201).json(newMember);
  });

  app.put('/api/team/:id', requireAdmin, (req: Request, res: Response) => {
    const updated = store.updateTeamMember(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Team member not found.' });
    return res.json(updated);
  });

  app.delete('/api/team/:id', requireAdmin, (req: Request, res: Response) => {
    const success = store.deleteTeamMember(req.params.id);
    if (!success) return res.status(404).json({ error: 'Team member not found.' });
    return res.json({ success: true });
  });

  // --- Gallery Endpoints ---
  app.get('/api/gallery', (req: Request, res: Response) => {
    const onlyPublished = req.query.admin !== 'true';
    return res.json(store.getGallery(onlyPublished));
  });

  app.post('/api/gallery', requireAdmin, (req: Request, res: Response) => {
    const newItem = store.createGalleryItem(req.body);
    return res.status(201).json(newItem);
  });

  app.put('/api/gallery/:id', requireAdmin, (req: Request, res: Response) => {
    const updated = store.updateGalleryItem(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Gallery item not found.' });
    return res.json(updated);
  });

  app.delete('/api/gallery/:id', requireAdmin, (req: Request, res: Response) => {
    const success = store.deleteGalleryItem(req.params.id);
    if (!success) return res.status(404).json({ error: 'Gallery item not found.' });
    return res.json({ success: true });
  });

  // --- Blogs Endpoints ---
  app.get('/api/blogs', (req: Request, res: Response) => {
    const onlyPublished = req.query.admin !== 'true';
    return res.json(store.getBlogs(onlyPublished));
  });

  app.get('/api/blogs/:idOrSlug', (req: Request, res: Response) => {
    const blog = store.getBlog(req.params.idOrSlug);
    if (!blog) return res.status(404).json({ error: 'Blog post not found.' });
    return res.json(blog);
  });

  app.post('/api/blogs', requireAdmin, (req: Request, res: Response) => {
    const newBlog = store.createBlog(req.body);
    return res.status(201).json(newBlog);
  });

  app.put('/api/blogs/:id', requireAdmin, (req: Request, res: Response) => {
    const updated = store.updateBlog(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Blog post not found.' });
    return res.json(updated);
  });

  app.delete('/api/blogs/:id', requireAdmin, (req: Request, res: Response) => {
    const success = store.deleteBlog(req.params.id);
    if (!success) return res.status(404).json({ error: 'Blog post not found.' });
    return res.json({ success: true });
  });

  // --- Notices Endpoints ---
  app.get('/api/notices', (req: Request, res: Response) => {
    const onlyPublished = req.query.admin !== 'true';
    return res.json(store.getNotices(onlyPublished));
  });

  app.post('/api/notices', requireAdmin, (req: Request, res: Response) => {
    const newNotice = store.createNotice(req.body);
    return res.status(201).json(newNotice);
  });

  app.put('/api/notices/:id', requireAdmin, (req: Request, res: Response) => {
    const updated = store.updateNotice(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Notice not found.' });
    return res.json(updated);
  });

  app.delete('/api/notices/:id', requireAdmin, (req: Request, res: Response) => {
    const success = store.deleteNotice(req.params.id);
    if (!success) return res.status(404).json({ error: 'Notice not found.' });
    return res.json({ success: true });
  });

  // --- Testimonials Endpoints ---
  app.get('/api/testimonials', (req: Request, res: Response) => {
    const onlyPublished = req.query.admin !== 'true';
    return res.json(store.getTestimonials(onlyPublished));
  });

  app.post('/api/testimonials', requireAdmin, (req: Request, res: Response) => {
    const newTestimonial = store.createTestimonial(req.body);
    return res.status(201).json(newTestimonial);
  });

  app.put('/api/testimonials/:id', requireAdmin, (req: Request, res: Response) => {
    const updated = store.updateTestimonial(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Testimonial not found.' });
    return res.json(updated);
  });

  app.delete('/api/testimonials/:id', requireAdmin, (req: Request, res: Response) => {
    const success = store.deleteTestimonial(req.params.id);
    if (!success) return res.status(404).json({ error: 'Testimonial not found.' });
    return res.json({ success: true });
  });

  // --- Public Enquiry / Enrolment Submission ---
  app.post('/api/enquiries', (req: Request, res: Response) => {
    const { parentName, phone, email, childAge, serviceOfInterest, preferredDate, message, consent } = req.body;
    if (!parentName || !phone || !email || !serviceOfInterest) {
      return res.status(400).json({ error: 'Please provide parent name, phone, email, and service of interest.' });
    }
    if (!consent) {
      return res.status(400).json({ error: 'Consent to terms and privacy policy is required.' });
    }

    const created = store.createEnquiry({
      parentName,
      phone,
      email,
      childAge: childAge || 'Not specified',
      childName: req.body.childName || '',
      serviceOfInterest,
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      message: message || '',
      consent: true,
    });

    return res.status(201).json({
      success: true,
      message: 'Thank you! Your assessment / enrolment request has been received. Our clinical intake team will contact you within 24 business hours.',
      enquiryId: created.id,
    });
  });

  // --- Admin Enquiry Management ---
  app.get('/api/admin/enquiries', requireAdmin, (_req: Request, res: Response) => {
    return res.json(store.getEnquiries());
  });

  app.patch('/api/admin/enquiries/:id', requireAdmin, (req: Request, res: Response) => {
    const updated = store.updateEnquiry(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Enquiry not found.' });
    return res.json(updated);
  });

  app.delete('/api/admin/enquiries/:id', requireAdmin, (req: Request, res: Response) => {
    const success = store.deleteEnquiry(req.params.id);
    if (!success) return res.status(404).json({ error: 'Enquiry not found.' });
    return res.json({ success: true });
  });

  // CSV Export
  app.get('/api/admin/enquiries/export.csv', requireAdmin, (_req: Request, res: Response) => {
    const enquiries = store.getEnquiries();
    const headers = ['ID', 'Date', 'Status', 'Parent Name', 'Child Name', 'Child Age', 'Phone', 'Email', 'Service', 'Preferred Date', 'Message', 'Notes'];
    const rows = enquiries.map((e) => [
      `"${e.id}"`,
      `"${new Date(e.createdAt).toLocaleDateString()}"`,
      `"${e.status}"`,
      `"${(e.parentName || '').replace(/"/g, '""')}"`,
      `"${(e.childName || '').replace(/"/g, '""')}"`,
      `"${(e.childAge || '').replace(/"/g, '""')}"`,
      `"${(e.phone || '').replace(/"/g, '""')}"`,
      `"${(e.email || '').replace(/"/g, '""')}"`,
      `"${(e.serviceOfInterest || '').replace(/"/g, '""')}"`,
      `"${(e.preferredDate || '').replace(/"/g, '""')}"`,
      `"${(e.message || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
      `"${(e.adminNotes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="turtle-buddy-enquiries-${new Date().toISOString().split('T')[0]}.csv"`);
    return res.send(csvContent);
  });

  // Admin Activities Log
  app.get('/api/admin/activities', requireAdmin, (_req: Request, res: Response) => {
    return res.json(store.getActivities());
  });

  // Image / Media Upload
  app.post('/api/media/upload', requireAdmin, (req: Request, res: Response) => {
    const { dataUrl, filename } = req.body;
    if (!dataUrl || !dataUrl.includes(';base64,')) {
      return res.status(400).json({ error: 'Valid base64 image data URL required.' });
    }

    try {
      const matches = dataUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
      if (!matches) {
        return res.status(400).json({ error: 'Invalid image format.' });
      }

      const ext = matches[1] === 'jpeg' ? 'jpg' : matches[1];
      const buffer = Buffer.from(matches[2], 'base64');
      const safeName = (filename ? filename.replace(/[^a-zA-Z0-9_-]/g, '') : 'img') + `_${Date.now()}.${ext}`;
      const filePath = path.join(UPLOADS_DIR, safeName);

      fs.writeFileSync(filePath, buffer);
      const publicUrl = `/uploads/${safeName}`;

      store.logActivity(`Uploaded media file: ${safeName}`, 'Admin');
      return res.json({ success: true, url: publicUrl, filename: safeName });
    } catch (err) {
      console.error('Media upload error:', err);
      return res.status(500).json({ error: 'Failed to process image upload.' });
    }
  });

  // --- Dev / Prod Static & Vite Middleware ---
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Turtle Buddy Full-Stack Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
});
