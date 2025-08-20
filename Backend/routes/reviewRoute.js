import express from 'express';
import { addReview, getReviews, likeReview } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/', addReview);          // Add review
router.get('/', getReviews);          // Get all reviews
router.patch('/:id/like', likeReview); // Like a review

export default router;
