// ============================================
// Promoo Backend — Route Aggregator
// ============================================
// All routes are registered here and mounted in app.ts.
// Each module gets its own router file.

import { Router } from 'express';

const router = Router();

// ─── Health Check ───────────────────────────
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    },
    message: 'Server is running',
  });
});

// ─── Module Routes ──────────────────────────
// Routes will be added here as each Phase is built.
// Example:
//   import authRoutes from './auth.routes';
//   router.use('/auth', authRoutes);

import authRoutes from './auth.routes';

// Phase 2: Authentication
router.use('/auth', authRoutes);

import profileRoutes from './profile.routes';

// Phase 3: Profiles
router.use('/profiles', profileRoutes);

import followRoutes from './follow.routes';

// Phase 4: Follow System
router.use('/follows', followRoutes);

import offerRoutes from './offer.routes';
import adRoutes from './ad.routes';

// Phase 5: Offers & Ads
router.use('/offers', offerRoutes);
router.use('/ads', adRoutes);

import subscriptionRoutes from './subscription.routes';

// Phase 6: Subscriptions
router.use('/subscriptions', subscriptionRoutes);

import chatRoutes from './chat.routes';

// Phase 7: Chat
router.use('/chats', chatRoutes);

// Phase 8: Notifications
// router.use('/notifications', notificationRoutes);

// Phase 9: Upload & Search
// router.use('/upload', uploadRoutes);
// router.use('/search', searchRoutes);
// router.use('/categories', categoryRoutes);

// Phase 10: Featured & Payments
// router.use('/featured', featuredRoutes);
// router.use('/payments', paymentRoutes);

// Phase 11: Reports
// router.use('/reports', reportRoutes);

// Phase 12: Admin
// router.use('/admin', adminRoutes);

// Webhooks (Stripe) — registered separately in app.ts with raw body parser

export default router;
