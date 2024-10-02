import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import Order from "../models/Order.js";
import { createCheckoutSession } from "../controllers/payment.controller.js";

import dotenv from "dotenv";
dotenv.config();

const router = express.Router();

router.get("/create-checkout-session", protectRoute, createCheckoutSession);
router.get("/checkout-success", protectRoute, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status === "paid") {
      if (session.metadata.couponCode) {
        await Coupon.findOneAndUpdate(
          {
            code: session.metadata.couponCode,
            userId: session.metadata.userId,
          },
          { isActive: false }
        );
      }

      const products = JSON.parse(session.metadata.products);
      const newOrder = new Order({
        user: session.metadata.userId,
        products: products.map((product) => ({
          product: product.id,
          quantity: product.quantity,
          price: product.price,
        })),
        totalAmount: session.amount_total / 100,
        stripeSessionId: sessionId,
      });

      await newOrder.save();

      res.status(200).json({
        success: true,
        message: "Payment successful",
        orderId: newOrder._id,
      });
    }
    res.status(400).json({ message: "Payment failed" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error occurred" });
  }
});

export default router;
