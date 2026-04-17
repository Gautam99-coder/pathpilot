import express from 'express';
import {
  enrollInPath,
  getUserDashboard,
  getEnrollmentProgress,
  markPhaseComplete,
  completeQuizAndAwardCertificate,
  createDonationOrder,
  verifyDonationPayment
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/enroll/:pathId', enrollInPath);
router.get('/dashboard', getUserDashboard);
router.get('/progress/:pathId', getEnrollmentProgress);
router.post('/progress/:pathId/complete-phase', markPhaseComplete);
router.post('/progress/:pathId/quiz', completeQuizAndAwardCertificate);
router.post('/progress/:pathId/donation/order', createDonationOrder);
router.post('/progress/:pathId/donation/verify', verifyDonationPayment);

export default router;
