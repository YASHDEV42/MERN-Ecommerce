import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  addToCart,
  removeAllFromCart,
  updateQuantity,
} from "../controllers/cart.controller.js";

const router = express.Router();

// router.get("/", protectRoute, getCart);
router.post("/", protectRoute, addToCart);
router.delete("/", protectRoute, removeAllFromCart);
router.patch("/:id", protectRoute, updateQuantity);

export default router;
