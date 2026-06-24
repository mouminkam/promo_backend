// ============================================
// Promoo Backend — Seat Routes
// ============================================

import { Router } from 'express';
import { seatController } from '../controllers/seat.controller';
import { validate } from '../middleware/validate.middleware';
import { requireAuth } from '../middleware/auth.middleware';
import { requireAccountType } from '../middleware/accountType.middleware';
import * as seatValidators from '../validators/seat.validator';

const router = Router();

// Public routes
router.get(
  '/',
  validate(seatValidators.getSeatsQuerySchema),
  seatController.getSeats
);

// Protected routes
router.use(requireAuth);

router.get('/me', seatController.getMySeats);

router.post(
  '/:id/book',
  requireAccountType(['influencer']),
  validate(seatValidators.seatIdParamSchema),
  seatController.bookSeat
);

router.delete(
  '/:id/cancel',
  validate(seatValidators.seatIdParamSchema),
  seatController.cancelSeat
);

export default router;
