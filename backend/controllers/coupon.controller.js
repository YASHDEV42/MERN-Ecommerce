import Coupon from "../models/Coupon.js";

export const getCoupon = async (req, res) => {
  try {
    const coupons = await Coupon.findOne({
      userId: req.user._id,
      isActive: true,
    });
    res.json(coupons || null);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({
      code: code,
      isActive: true,
      userId: req.user._id,
    });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }

    if (coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ message: "Coupon expired" });
    }

    res.json({
      messsage: "Coupon applied",
      discount: coupon.discountPercentage,
      code: coupon.code,
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
