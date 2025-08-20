import React, { useState, useEffect } from 'react';
import { Star, Send, User, Calendar, ThumbsUp } from 'lucide-react';
import './Review.css';

const Review = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: '',
    email: '',
    rating: 0,
    comment: '',
    category: 'general'
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toast auto-hide effect
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '', type: '' });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // ✅ Fetch reviews from backend
  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/reviews');
      const data = await res.json();
      setReviews(data);
      calculateAverageRating(data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const calculateAverageRating = (reviewList) => {
    if (reviewList.length === 0) return;
    const total = reviewList.reduce((sum, review) => sum + review.rating, 0);
    setAverageRating((total / reviewList.length).toFixed(1));
    setTotalReviews(reviewList.length);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingClick = (rating) => {
    setNewReview((prev) => ({
      ...prev,
      rating
    }));
  };

  // Validation function
  const validateForm = () => {
    if (!newReview.name.trim()) {
      setToast({
        show: true,
        message: '❌ Please enter your name',
        type: 'error'
      });
      return false;
    }
    
    if (newReview.rating === 0) {
      setToast({
        show: true,
        message: '⭐ Please select a rating',
        type: 'error'
      });
      return false;
    }
    
    if (!newReview.comment.trim()) {
      setToast({
        show: true,
        message: '💬 Please write your review comment',
        type: 'error'
      });
      return false;
    }
    
    if (newReview.comment.trim().length < 10) {
      setToast({
        show: true,
        message: '📝 Review comment should be at least 10 characters long',
        type: 'error'
      });
      return false;
    }
    
    return true;
  };

  // ✅ Submit review to backend with toast notifications
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const res = await fetch('http://localhost:4000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReview)
      });
      
      if (res.ok) {
        await fetchReviews(); // refresh list
        setNewReview({
          name: '',
          email: '',
          rating: 0,
          comment: '',
          category: 'general'
        });
        setToast({
          show: true,
          message: '🎉 Thank you! Your review has been submitted successfully',
          type: 'success'
        });
      } else {
        throw new Error('Failed to submit review');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
      setToast({
        show: true,
        message: '❌ Failed to submit review. Please try again later.',
        type: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ✅ Like review in backend
  const handleLike = async (id) => {
    try {
      const res = await fetch(`http://localhost:4000/api/reviews/${id}/like`, {
        method: 'PATCH'
      });
      if (res.ok) {
        await fetchReviews();
        setToast({
          show: true,
          message: '👍 Review liked!',
          type: 'success'
        });
      }
    } catch (err) {
      console.error('Error liking review:', err);
      setToast({
        show: true,
        message: '❌ Failed to like review',
        type: 'error'
      });
    }
  };

  const renderStars = (rating, interactive = false, size = 'medium') => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <Star
          key={index}
          className={`star ${size} ${
            starValue <=
            (interactive ? hoveredRating || newReview.rating : rating)
              ? 'filled'
              : ''
          }`}
          onClick={interactive ? () => handleRatingClick(starValue) : undefined}
          onMouseEnter={interactive ? () => setHoveredRating(starValue) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
        />
      );
    });
  };

  const getCategoryColor = (category) => {
    const colors = {
      general: '#4CAF50',
      delivery: '#FF9800',
      recipes: '#2196F3',
      interface: '#9C27B0'
    };
    return colors[category] || '#4CAF50';
  };

  return (
    <div className="review-container">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification toast-${toast.type}`}>
          <div className="toast-content">
            <span className="toast-message">{toast.message}</span>
            <button
              className="toast-close"
              onClick={() => setToast({ show: false, message: '', type: '' })}
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="review-header">
        <h1 className="review-title">Customer Reviews</h1>
        <p className="review-subtitle">Share your experience with our food app</p>
        <div className="rating-overview">
          <div className="average-rating">
            <span className="rating-number">{averageRating}</span>
            <div className="rating-stars">
              {renderStars(Math.round(averageRating))}
            </div>
            <span className="total-reviews">Based on {totalReviews} reviews</span>
          </div>
        </div>
      </div>

      {/* Review Form */}
      <div className="review-form-container">
        <h2 className="form-title">Write a Review</h2>
        <div className="review-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={newReview.name}
                onChange={handleInputChange}
                placeholder="Your name"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={newReview.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Rating *</label>
              <div className="rating-input">
                {renderStars(newReview.rating, true, 'large')}
                <span className="rating-text">
                  {newReview.rating > 0 &&
                    `${newReview.rating} star${newReview.rating > 1 ? 's' : ''}`}
                </span>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                name="category"
                value={newReview.category}
                onChange={handleInputChange}
              >
                <option value="general">General Experience</option>
                <option value="delivery">Food Delivery</option>
                <option value="recipes">Recipes</option>
                <option value="interface">User Interface</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="comment">Your Review *</label>
            <textarea
              id="comment"
              name="comment"
              value={newReview.comment}
              onChange={handleInputChange}
              placeholder="Tell us about your experience with our food app..."
              rows="4"
              required
            />
          </div>

          <button 
            type="button" 
            className={`submit-btn ${isSubmitting ? 'submitting' : ''}`} 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="spinner"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send size={18} />
                Submit Review
              </>
            )}
          </button>
        </div>
      </div>

      {/* Reviews List */}
      <div className="reviews-list">
        <h2 className="reviews-title">What Our Users Say</h2>
        {reviews.map((review) => (
          <div key={review._id} className="review-card">
            <div className="review-header-card">
              <div className="user-info">
                <div className="user-avatar">
                  <User size={24} />
                </div>
                <div className="user-details">
                  <h3 className="user-name">{review.name}</h3>
                  <div className="review-meta">
                    <Calendar size={14} />
                    <span>{new Date(review.date).toLocaleDateString()}</span>
                    <span
                      className="category-badge"
                      style={{ backgroundColor: getCategoryColor(review.category) }}
                    >
                      {review.category}
                    </span>
                  </div>
                </div>
              </div>
              <div className="review-rating">
                {renderStars(review.rating, false, 'small')}
              </div>
            </div>
            <p className="review-comment">{review.comment}</p>
            <div className="review-actions">
              <button className="like-btn" onClick={() => handleLike(review._id)}>
                <ThumbsUp size={16} />
                <span>{review.likes}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Review;