import { Router } from 'express';

import { ReviewController } from './review.controller';

const router = Router();

router.post('/', ReviewController.createReview);
router.get('/guide/:guideId', ReviewController.getReviewsByGuide);
router.get('/tourist/:touristId', ReviewController.getReviewsByTourist);
router.get('/',  ReviewController.getAllReviews);


export const ReviewRoutes = router;