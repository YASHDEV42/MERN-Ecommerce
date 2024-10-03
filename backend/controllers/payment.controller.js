import Coupon from "../models/Coupon.js";
import Order from "../models/Order.js";
import stripe from "stripe";

// Create a new checkout session
export const createCheckoutSession = async (req, res) => {
  const { products, couponCode } = req.body;
  const userId = req.user._id;

  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: "invalid or empty products list" });
  }

  let totalAmount = 0;

  const lineItems = products.map((product) => {
    amount = Math.round(product.price * 100 * product.quantity);
    totalAmount += amount;

    return {
      price_data: {
        currency: "usd",
        product_data: {
          name: product.name,
          images: [product.image],
        },
        unit_amount: amount,
      },
    };
  });

  let coupon = null;
  if (couponCode) {
    coupon = await Coupon.findOne({
      code: couponCode,
      userId,
      isActive: true,
    });
    if (coupon) {
      totalAmount -= Math.round((totalAmount * coupon.discount) / 100);
    }
  }

  const sesion = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `${process.env.CLIENT_URL}/purchase-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.CLIENT_URL}/purchase-cancelled`,
    discounts: coupon
      ? [{ coupon: await createStripeCoupon(coupon.discountPercentage) }]
      : [],
    metadata: {
      userId,
      coupon: couponCode || "",
      products: JSON.stringify(
        products.map((product) => ({
          id: product._id,
          quantity: product.quantity,
          price: product.price,
        }))
      ),
    },
  });

  if (totalAmount >= 20000) {
    await createNewCoupon(10, req.userId);
  }
};
// Create a new stripe coupon
const createStripeCoupon = async (discountPercentage) => {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
  });

  return coupon.id;
};
// Create a new coupon
const createNewCoupon = async (discountPercentage, userId) => {
  const coupon = new Coupon({
    code: Math.random().toString(36).substring(7).toUpperCase(),
    discount: discountPercentage,
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    userId,
  });

  return await coupon.save();
};
// Handle successful payment
export const checkoutSuccess = async (req, res) => {
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
};
