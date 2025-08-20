import React, { useState, useEffect } from "react";
import { Send, Clock, Users, ChefHat, Eye, EyeOff, Trash2 } from "lucide-react";
import './Recipe.css'

const API_URL = "http://localhost:4000/api/recipes";

// Toast notification system
const Toast = ({ message, type, onClose }) => (
  <div className={`toast toast-${type}`} onClick={onClose}>
    <div className="toast-content">
      <span className="toast-icon">
        {type === 'success' && '✅'}
        {type === 'error' && '❌'}
        {type === 'warning' && '⚠️'}
        {type === 'info' && 'ℹ️'}
      </span>
      <span className="toast-message">{message}</span>
    </div>
  </div>
);

const ToastContainer = ({ toasts, removeToast }) => (
  <div className="toast-container">
    {toasts.map((toast) => (
      <Toast
        key={toast.id}
        message={toast.message}
        type={toast.type}
        onClose={() => removeToast(toast.id)}
      />
    ))}
  </div>
);

const Recipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [newRecipe, setNewRecipe] = useState({
  title: "",
  category: "italian",
  difficulty: "Easy",
  cookTime: "",
  servings: 1,
  ingredients: [""],
  instructions: [""],
  image: null, // ✅ add image field
});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [errors, setErrors] = useState({});

  const categories = [
    { id: "all", name: "All Recipes", icon: "🍽️" },
    { id: "italian", name: "Italian", icon: "🍝" },
    { id: "indian", name: "Indian", icon: "🍛" },
    { id: "mexican", name: "Mexican", icon: "🌮" },
    { id: "mediterranean", name: "Mediterranean", icon: "🫒" },
    { id: "salads", name: "Salads", icon: "🥗" },
    { id: "desserts", name: "Desserts", icon: "🍰" },
  ];

  // Toast management functions
  const addToast = (message, type = 'info') => {
    const id = Date.now() + Math.random();
    const toast = { id, message, type };
    setToasts(prev => [...prev, toast]);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Validation functions
  const validateTitle = (title) => {
    if (!title || title.trim().length === 0) {
      return "Recipe title is required";
    }
    if (title.trim().length < 3) {
      return "Recipe title must be at least 3 characters long";
    }
    if (title.trim().length > 100) {
      return "Recipe title must be less than 100 characters";
    }
    return null;
  };

  const validateCookTime = (cookTime) => {
    if (!cookTime || cookTime.trim().length === 0) {
      return "Cook time is required";
    }
    if (cookTime.trim().length > 50) {
      return "Cook time description is too long";
    }
    return null;
  };

  const validateServings = (servings) => {
    const num = parseInt(servings);
    if (isNaN(num) || num < 1) {
      return "Servings must be at least 1";
    }
    if (num > 50) {
      return "Servings cannot exceed 50";
    }
    return null;
  };

  const validateIngredients = (ingredients) => {
    const validIngredients = ingredients.filter(ing => ing.trim().length > 0);
    
    if (validIngredients.length === 0) {
      return "At least one ingredient is required";
    }
    
    for (let i = 0; i < validIngredients.length; i++) {
      if (validIngredients[i].trim().length < 2) {
        return `Ingredient ${i + 1} is too short`;
      }
      if (validIngredients[i].trim().length > 200) {
        return `Ingredient ${i + 1} is too long`;
      }
    }
    
    // Check for duplicates
    const lowerIngredients = validIngredients.map(ing => ing.toLowerCase().trim());
    const duplicates = lowerIngredients.filter((item, index) => lowerIngredients.indexOf(item) !== index);
    if (duplicates.length > 0) {
      return "Duplicate ingredients found";
    }
    
    return null;
  };

  const validateInstructions = (instructions) => {
    const validInstructions = instructions.filter(inst => inst.trim().length > 0);
    
    if (validInstructions.length === 0) {
      return "At least one instruction step is required";
    }
    
    for (let i = 0; i < validInstructions.length; i++) {
      if (validInstructions[i].trim().length < 5) {
        return `Instruction step ${i + 1} is too short (minimum 5 characters)`;
      }
      if (validInstructions[i].trim().length > 1000) {
        return `Instruction step ${i + 1} is too long (maximum 1000 characters)`;
      }
    }
    
    return null;
  };

  const validateRecipe = (recipe) => {
    const newErrors = {};
    
    const titleError = validateTitle(recipe.title);
    if (titleError) newErrors.title = titleError;
    
    if (!recipe.category) {
      newErrors.category = "Please select a category";
    }
    
    if (!recipe.difficulty) {
      newErrors.difficulty = "Please select a difficulty level";
    }
    
    const cookTimeError = validateCookTime(recipe.cookTime);
    if (cookTimeError) newErrors.cookTime = cookTimeError;
    
    const servingsError = validateServings(recipe.servings);
    if (servingsError) newErrors.servings = servingsError;
    
    const ingredientsError = validateIngredients(recipe.ingredients);
    if (ingredientsError) newErrors.ingredients = ingredientsError;
    
    const instructionsError = validateInstructions(recipe.instructions);
    if (instructionsError) newErrors.instructions = instructionsError;
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      addToast(firstError, 'error');
      return false;
    }
    
    return true;
  };

  // Real-time field validation
  const validateField = (name, value) => {
    let error = null;
    
    switch (name) {
      case 'title':
        error = validateTitle(value);
        break;
      case 'cookTime':
        error = validateCookTime(value);
        break;
      case 'servings':
        error = validateServings(value);
        break;
      default:
        break;
    }
    
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
    
    return error === null;
  };

  // Fetch recipes on load
  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setRecipes(data);
      addToast("Recipes loaded successfully!", 'success');
    } catch (err) {
      console.error("❌ Error fetching recipes:", err);
      addToast("Failed to load recipes. Please check if the server is running.", 'error');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecipe((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleInputBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleArrayChange = (idx, field, value) => {
    const updated = [...newRecipe[field]];
    updated[idx] = value;
    setNewRecipe((prev) => ({ ...prev, [field]: updated }));
    
    // Clear array-related errors when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleAddField = (field) => {
    if (newRecipe[field].length >= 20) {
      addToast(`Maximum 20 ${field} allowed`, 'warning');
      return;
    }
    setNewRecipe((prev) => ({ ...prev, [field]: [...prev[field], ""] }));
  };

  const handleRemoveField = (field, idx) => {
    if (newRecipe[field].length <= 1) {
      addToast(`At least one ${field.slice(0, -1)} is required`, 'warning');
      return;
    }
    const updated = [...newRecipe[field]];
    updated.splice(idx, 1);
    setNewRecipe((prev) => ({ ...prev, [field]: updated }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateRecipe(newRecipe)) return;

  setIsSubmitting(true);
  try {
    const formData = new FormData();
    formData.append("title", newRecipe.title);
    formData.append("category", newRecipe.category);
    formData.append("difficulty", newRecipe.difficulty);
    formData.append("cookTime", newRecipe.cookTime);
    formData.append("servings", newRecipe.servings);
    newRecipe.ingredients.forEach(ing => formData.append("ingredients[]", ing));
    newRecipe.instructions.forEach(inst => formData.append("instructions[]", inst));
    if (newRecipe.imageFile) {
      formData.append("image", newRecipe.imageFile); // ✅ image file from input
    }

const res = await fetch(API_URL, {
  method: "POST",
  body: formData
});


    if (res.ok) {
      const savedRecipe = await res.json();
      setRecipes((prev) => [savedRecipe, ...prev]);
      setNewRecipe({
        title: "",
        category: "italian",
        difficulty: "Easy",
        cookTime: "",
        servings: 1,
        ingredients: [""],
        instructions: [""],
        image: null,
      });
      setErrors({});
      setShowAddForm(false);
      addToast("Recipe added successfully! 🎉", "success");
    } else {
      const errorData = await res.json().catch(() => null);
      addToast(errorData?.message || "Failed to add recipe.", "error");
    }
  } catch (err) {
    console.error("❌ Error adding recipe:", err);
    addToast("Network error. Please check your connection.", "error");
  }
  setIsSubmitting(false);
};

  const deleteRecipe = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) {
      return;
    }
    
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      
      if (res.ok) {
        setRecipes((prev) => prev.filter((r) => r._id !== id));
        addToast("Recipe deleted successfully!", 'success');
        
        // Close expanded recipe if it was the deleted one
        if (expandedRecipe === id) {
          setExpandedRecipe(null);
        }
        
        // Remove from favorites if it was favorited
        setFavorites(prev => prev.filter(fId => fId !== id));
      } else {
        const errorData = await res.json().catch(() => null);
        const errorMessage = errorData?.message || "Failed to delete recipe. Please try again.";
        addToast(errorMessage, 'error');
      }
    } catch (err) {
      console.error("❌ Error deleting recipe:", err);
      addToast("Network error. Please check your connection.", 'error');
    }
  };

  const toggleRecipeDetails = (id) => {
    setExpandedRecipe(expandedRecipe === id ? null : id);
  };

  const toggleFavorite = (recipeId) => {
    const wasFavorited = favorites.includes(recipeId);
    setFavorites((prev) =>
      wasFavorited
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId]
    );
    
    addToast(
      wasFavorited ? "Removed from favorites" : "Added to favorites",
      'info'
    );
  };

  const getDifficultyColor = (difficulty) => {
    if (!difficulty) return "difficulty-unknown";

    switch (difficulty.toLowerCase()) {
      case "easy":
        return "difficulty-easy";
      case "medium":
        return "difficulty-medium";
      case "hard":
        return "difficulty-hard";
      default:
        return "difficulty-unknown";
    }
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddRecipeClick = () => {
    setShowAddForm(true);
    setErrors({});
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setNewRecipe({
      title: "",
      category: "italian",
      difficulty: "Easy",
      cookTime: "",
      servings: 1,
      ingredients: [""],
      instructions: [""],
    });
    setErrors({});
  };

 const handleFileChange = (e) => {
  setNewRecipe((prev) => ({ 
    ...prev, 
    imageFile: e.target.files[0], // Make sure this is imageFile
    image: URL.createObjectURL(e.target.files[0]) // Preview image
  }));
};
  // Add Recipe Form Modal
  if (showAddForm) {
    return (
      <>
        <ToastContainer toasts={toasts} removeToast={removeToast} />
        <div className="recipe-modal-overlay" onClick={handleCloseForm}>
  <div className="recipe-form-modal" onClick={(e) => e.stopPropagation()}>
    <button className="modal-close-btn" onClick={handleCloseForm}>
      ×
    </button>

    <div className="recipe-form-header">
      <h2>Add New Recipe</h2>
      <p>Share your favorite recipe with the community</p>
    </div>

    <form className="recipe-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="image">Recipe Photo</label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />
        {newRecipe.image && (
          <div className="image-preview">
            <img 
              src={newRecipe.image} 
              alt="Preview" 
              className="preview-image"
            />
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="title">Recipe Title *</label>
        <input
          type="text"
          id="title"
          name="title"
          value={newRecipe.title}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder="Enter recipe name (3-100 characters)"
          className={errors.title ? 'error' : ''}
          required
        />
        {errors.title && <span className="error-message">{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="category">Category *</label>
        <select
          id="category"
          name="category"
          value={newRecipe.category}
          onChange={handleInputChange}
          className={errors.category ? 'error' : ''}
          required
        >
          {categories.slice(1).map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category && <span className="error-message">{errors.category}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="difficulty">Difficulty *</label>
          <select
            id="difficulty"
            name="difficulty"
            value={newRecipe.difficulty}
            onChange={handleInputChange}
            className={errors.difficulty ? 'error' : ''}
            required
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          {errors.difficulty && <span className="error-message">{errors.difficulty}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="cookTime">Cook Time *</label>
          <input
            type="text"
            id="cookTime"
            name="cookTime"
            value={newRecipe.cookTime}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="e.g., 30 mins, 1 hour"
            className={errors.cookTime ? 'error' : ''}
            required
          />
          {errors.cookTime && <span className="error-message">{errors.cookTime}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="servings">Servings *</label>
          <input
            type="number"
            id="servings"
            name="servings"
            value={newRecipe.servings}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            placeholder="1-50"
            min="1"
            max="50"
            className={errors.servings ? 'error' : ''}
            required
          />
          {errors.servings && <span className="error-message">{errors.servings}</span>}
        </div>
      </div>

      <div className="form-group">
        <label>Ingredients * <small>(max 20)</small></label>
        {newRecipe.ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-input-group">
            <input
              type="text"
              value={ingredient}
              onChange={(e) =>
                handleArrayChange(index, "ingredients", e.target.value)
              }
              placeholder={`Ingredient ${index + 1} (2-200 characters)`}
              maxLength="200"
            />
            {newRecipe.ingredients.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveField("ingredients", index)}
                className="remove-btn"
                title="Remove ingredient"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddField("ingredients")}
          className="add-field-btn"
          disabled={newRecipe.ingredients.length >= 20}
        >
          + Add Ingredient ({newRecipe.ingredients.length}/20)
        </button>
        {errors.ingredients && <span className="error-message">{errors.ingredients}</span>}
      </div>

      <div className="form-group">
        <label>Instructions * <small>(max 20)</small></label>
        {newRecipe.instructions.map((instruction, index) => (
          <div key={index} className="instruction-input-group">
            <textarea
              value={instruction}
              onChange={(e) =>
                handleArrayChange(index, "instructions", e.target.value)
              }
              placeholder={`Step ${index + 1} (5-1000 characters)`}
              rows="3"
              maxLength="1000"
            />
            {newRecipe.instructions.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveField("instructions", index)}
                className="remove-btn"
                title="Remove instruction"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => handleAddField("instructions")}
          className="add-field-btn"
          disabled={newRecipe.instructions.length >= 20}
        >
          + Add Instruction ({newRecipe.instructions.length}/20)
        </button>
        {errors.instructions && <span className="error-message">{errors.instructions}</span>}
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={handleCloseForm}
          className="btn-secondary"
          disabled={isSubmitting}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting || Object.keys(errors).some(key => errors[key])}
          className={`btn-primary ${isSubmitting ? "loading" : ""}`}
        >
          {isSubmitting ? "Adding Recipe..." : "Add Recipe"}
        </button>
      </div>
    </form>
  </div>
</div>
      </>
    );
  }

  // Main Recipe List View
  return (
    <>
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <div className="recipes-container">
        <header className="recipes-header">
          <div className="hero-section">
            <h1 className="main-title">Delicious Recipes</h1>
            <p className="main-subtitle">Discover amazing dishes from around the world</p>
            <button onClick={handleAddRecipeClick} className="add-recipe-btn">
              + Add New Recipe
            </button>
          </div>

          <div className="search-section">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button className="search-btn">🔍</button>
            </div>
          </div>

          <div className="categories-section">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`category-btn ${
                  selectedCategory === category.id ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
              </button>
            ))}
          </div>
        </header>

        <main className="recipes-main">
          <div className="recipes-grid">
            {filteredRecipes.map((recipe) => (
              <div key={recipe._id} className="recipe-card">
                 {/* Add this image display at the top of the recipe card */}
                 {recipe.image && (
                 <div className="recipe-image-container">
             <img 
               src={`http://localhost:4000${recipe.image}`} 
               alt={recipe.title}
               className="recipe-image"
             />
            </div>
  )}                <div className="recipe-content">
                  <h3 className="recipe-title">{recipe.title}</h3>

                  <div className="recipe-meta">
                    <span className="meta-item">
                      <span className="meta-icon">⏱️</span>
                      {recipe.cookTime}
                    </span>
                    <span className="meta-item">
                      <span className="meta-icon">👥</span>
                      {recipe.servings} servings
                    </span>
                    <span
                      className={`difficulty-badge ${getDifficultyColor(
                        recipe.difficulty
                      )}`}
                    >
                      {recipe.difficulty}
                    </span>
                  </div>

                  <div className="recipe-ingredients">
                    <h4>Ingredients:</h4>
                    <ul className="ingredients-list">
                      {recipe.ingredients.slice(0, 3).map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                      {recipe.ingredients.length > 3 && (
                        <li className="more-ingredients">
                          +{recipe.ingredients.length - 3} more
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="recipe-actions">
                    <button
                      className="btn-secondary"
                      onClick={() => toggleRecipeDetails(recipe._id)}
                    >
                      {expandedRecipe === recipe._id ? "Hide Details" : "View Recipe"}
                    </button>
                    <button
                      className={`favorite-btn ${
                        favorites.includes(recipe._id) ? "favorited" : ""
                      }`}
                      onClick={() => toggleFavorite(recipe._id)}
                      title={favorites.includes(recipe._id) ? "Remove from favorites" : "Add to favorites"}
                    >
                      ❤️
                    </button>
                  </div>

                  {expandedRecipe === recipe._id && (
             <div className="recipe-details-expanded">
               {recipe.image && (
                <div className="recipe-image-expanded">
                  <img 
                    src={`http://localhost:4000${recipe.image}`} 
                    alt={recipe.title}
                        />
                       </div>
                        )}

              <h4>Ingredients</h4>
          <ul className="ingredients-list">
             {recipe.ingredients.map((ingredient, i) => (
                <li key={i}>{ingredient}</li>
             ))}
          </ul>

            <h4>Instructions</h4>
            <ol className="instructions-list">
             {recipe.instructions.map((step, i) => (
                <li key={i}>{step}</li>
                 ))}
             </ol>

                   <button
                    className="delete-recipe-btn"
                    onClick={() => deleteRecipe(recipe._id)}
                    title="Delete this recipe">
                      <Trash2 size={16} /> Delete Recipe
                   </button>
              </div>
            )}

                </div>
              </div>
            ))}
          </div>

          {filteredRecipes.length === 0 && (
            <div className="no-results">
              <h3>No recipes found</h3>
              <p>
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your search or filter criteria"
                  : "Start by adding your first recipe!"
                }
              </p>
            </div>
          )}
        </main>
      </div>

      
    </>
  );
};

export default Recipe;