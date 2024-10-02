import Product from "../models/Product.js";

export const getCart = async (req, res) => {
  try {
    const products = await Product.find({ _id: { $in: req.user.cartItems } });

    //add quantity to each product
    const cartItems = products.map((product) => {
      const item = req.user.cartItems.find((item) => item._id === product._id);
      return { ...product.toJSON(), quantity: item.quantity };
    });

    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = req.user;

    const existingItem = user.cartItems.find((item) => item._id === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      user.cartItems.push(productId);
    }

    res.json(user.cartItems);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const user = req.user;
    const item = user.cartItems.find((item) => item._id === id);
    if (item) {
      if (quantity > 0) {
        item.quantity = quantity;
      } else {
        user.cartItems = user.cartItems.filter((item) => item._id !== id);
        await user.save();
      }
      return res.json(user.cartItems);
    } else {
      res.json({ message: "Item not found" });
    }

    await user.save();
    res.json({ message: "Cart updated" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const user = req.user;

    user.cartItems = user.cartItems.filter((item) => item._id !== productId);
    await user.save();

    res.json(user.cartItems);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
