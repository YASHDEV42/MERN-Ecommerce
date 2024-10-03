import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import Order from "../models/Order.js";
import { createCheckoutSession } from "../controllers/payment.controller.js";
import { checkoutSuccess } from "../controllers/payment.controller.js";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/create-checkout-session", protectRoute, createCheckoutSession);
router.get("/checkout-success", protectRoute, checkoutSuccess);

export default router;
