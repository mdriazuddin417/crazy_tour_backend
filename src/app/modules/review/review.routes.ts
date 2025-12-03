import { Router } from 'express';

import { checkAuth } from '../../middlewares/checkAuth';
import { Role } from '../user/user.interface';
import { ReviewController } from './review.controller';

const router = Router();

router.post('/',  checkAuth(Role.TOURIST), ReviewController.createReview);
router.get('/guide/:guideId', ReviewController.getReviewsByGuide);
router.get('/',  checkAuth(Role.ADMIN), ReviewController.getAllReviews);

export default router;