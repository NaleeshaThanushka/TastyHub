import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, required: true },
  cookTime: { type: String, required: true },
  servings: { type: Number, required: true },
  image: { type: String }, 
  ingredients: [{ type: String, required: true }],
  instructions: [{ type: String, required: true }],
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  dateAdded: { type: Date, default: Date.now }
});

export default mongoose.model("Recipe", recipeSchema);
