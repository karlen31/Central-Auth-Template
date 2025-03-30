import { Router } from 'express';
import * as serviceController from '../controllers/service.controller';
import { verifyToken, checkRole } from '../middlewares/auth.middleware';

const router = Router();

// All service routes are protected and require admin role
router.use(verifyToken, checkRole(['admin']));

// Service routes
router.post('/', serviceController.createService);
router.get('/', serviceController.getServices);
router.get('/:id', serviceController.getService);
router.put('/:id', serviceController.updateService);
router.post('/:id/regenerate-keys', serviceController.regenerateKeys);
router.delete('/:id', serviceController.deleteService);

export default router; 