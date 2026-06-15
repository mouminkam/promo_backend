// ============================================
// Promoo Backend — Category Routes
// ============================================

import { Router } from 'express';
import { categoryController } from '../controllers/category.controller';
import { validate } from '../middleware/validate.middleware';
import { z } from 'zod';

const router = Router();

// Validation schema for category ID
const categoryIdSchema = z.object({
  params: z.object({
    id: z.string().uuid('Invalid category ID'),
  }),
  query: z.object({
    page: z.coerce.number().int().positive().default(1).optional(),
    limit: z.coerce.number().int().positive().max(100).default(20).optional(),
  }).optional(),
});

// Categories are public
router.get('/', categoryController.getCategories);

router.get('/:id/content', validate(categoryIdSchema), categoryController.getCategoryContent);

export default router;
