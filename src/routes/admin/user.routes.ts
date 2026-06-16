// ============================================
// Promoo Backend — Admin User Routes
// ============================================

import { Router } from 'express';
import { adminUserController } from '../../controllers/admin/user.controller';
import { validate } from '../../middleware/validate.middleware';
import { getUsersSchema, toggleBanSchema, toggleVerifySchema, userIdSchema } from '../../validators/admin/user.validator';

const router = Router();

// Base route: /api/v1/admin/users
router.get('/', validate(getUsersSchema), adminUserController.getUsers);

router.get('/:id', validate(userIdSchema), adminUserController.getUserDetails);

router.patch('/:id/ban', validate(toggleBanSchema), adminUserController.toggleBan);

router.patch('/:id/verify', validate(toggleVerifySchema), adminUserController.toggleVerify);

router.delete('/:id', validate(userIdSchema), adminUserController.deleteUser);

export default router;
