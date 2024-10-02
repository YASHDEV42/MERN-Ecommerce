import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cartRoutes from "./routes/cart.route.js";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser()); // for parsing cookies
app.use(express.json()); // for parsing request body
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
  connectDB();
});
