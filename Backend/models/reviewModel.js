import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    category: {
      type: String,
      enum: ['general', 'delivery', 'recipes', 'interface'],
      default: 'general'
    },
    date: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model('Review', reviewSchema);
