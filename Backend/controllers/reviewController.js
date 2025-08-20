import Review from '../models/reviewModel.js';

// @desc    Add new review
// @route   POST /api/reviews
export const addReview = async (req, res) => {
  try {
    const { name, email, rating, comment, category } = req.body;

    if (!name || !rating || !comment) {
      return res.status(400).json({ message: 'Name, rating, and comment are required' });
    }

    const review = new Review({
      name,
      email,
      rating,
      comment,
      category
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
};

// @desc    Get all reviews
// @route   GET /api/reviews
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// @desc    Like a review
// @route   PATCH /api/reviews/:id/like
export const likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    review.likes += 1;
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error liking review', error: error.message });
  }
};
