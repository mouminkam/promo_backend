// ============================================
// Promoo Backend — Search Routes
// ============================================

import { Router } from 'express';
import { searchController } from '../controllers/search.controller';
import { validate } from '../middleware/validate.middleware';
import { searchSchema } from '../validators/search.validator';

const router = Router();

// Search endpoints can be public, but usually it's better to keep them public or partially protected.
// For now, we leave them public since users might search before logging in.
router.get('/', validate(searchSchema), searchController.search);

export default router;
