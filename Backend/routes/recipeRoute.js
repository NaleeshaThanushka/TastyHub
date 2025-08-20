import express from "express";
import multer from "multer";
import { addRecipe, getRecipes, deleteRecipe } from "../controllers/recipeController.js";

const router = express.Router();

// Multer config for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});

const upload = multer({ storage });

// Routes
router.get("/", getRecipes);
router.post("/", upload.single("image"), addRecipe); // ✅ single file upload with field "image"
router.delete("/:id", deleteRecipe);

export default router;
