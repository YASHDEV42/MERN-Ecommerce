import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

//configaration
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// parseing
app.use(cookieParser()); // for parsing cookies
app.use(express.json()); // for parsing request body

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/analytics", analyticsRoutes);

// Server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  connectDB();
});
