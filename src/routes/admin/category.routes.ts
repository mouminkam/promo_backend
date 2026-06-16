// ============================================
// Promoo Backend — Admin Category Routes
// ============================================

import { Router } from 'express';
import { adminCategoryController } from '../../controllers/admin/category.controller';
import { validate } from '../../middleware/validate.middleware';
import { categoryIdSchema, createCategorySchema, updateCategorySchema } from '../../validators/admin/category.validator';

const router = Router();

// Base route: /api/v1/admin/categories

// Get all categories is public, handled in Phase 9 (src/routes/category.routes.ts)
// This file only handles the Admin specific operations (Create, Update, Delete)

router.post('/', validate(createCategorySchema), adminCategoryController.createCategory);
router.put('/:id', validate(updateCategorySchema), adminCategoryController.updateCategory);
router.delete('/:id', validate(categoryIdSchema), adminCategoryController.deleteCategory);

export default router;
