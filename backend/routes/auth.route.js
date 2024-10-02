import express from "express";
import {
  signup,
  signout,
  signin,
  refreshToken,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.post("/refresh-token", refreshToken);

export default router;
