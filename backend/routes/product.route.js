import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  getFeaturedProducts,
  getRecommendationsProducts,
  getProductsByCategory,
  toggleFeaturedProduct,
} from "../controllers/products.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// admin routes
router.get("/", protectRoute, adminRoute, getAllProducts);
router.delete("/:id", protectRoute, adminRoute, deleteProduct);
router.post("/", protectRoute, adminRoute, createProduct);
router.put("/:id", protectRoute, adminRoute, updateProduct);
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);

// public routes
router.get("/recommendations", getRecommendationsProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/featured", getFeaturedProducts);
router.get("/:id", getProductById);

export default router;
