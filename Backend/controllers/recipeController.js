import Recipe from "../models/Recipe.js";

export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find().sort({ dateAdded: -1 });
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch recipes" });
  }
};

export const addRecipe = async (req, res) => {
  try {
    const { title, category, difficulty, cookTime, servings, ingredients, instructions } = req.body;

    const newRecipe = new Recipe({
      title,
      category,
      difficulty,
      cookTime,
      servings,
      ingredients,
      instructions,
      image: req.file ? `/uploads/${req.file.filename}` : undefined // ✅ set path if uploaded
    });

    await newRecipe.save();
    res.status(201).json(newRecipe);
  } catch (err) {
    console.error("❌ Error adding recipe:", err);
    res.status(500).json({ error: "Failed to add recipe" });
  }
};



export const deleteRecipe = async (req, res) => {
  try {
    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete recipe" });
  }
};
