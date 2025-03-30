import { Router } from 'express';
import * as validateController from '../controllers/validate.controller';
import { verifyApiKey } from '../middlewares/auth.middleware';

const router = Router();

// All validation routes require API key
router.use(verifyApiKey);

// Validation routes
router.post('/token', validateController.validateToken);
router.post('/roles', validateController.checkUserRoles);

export default router; 