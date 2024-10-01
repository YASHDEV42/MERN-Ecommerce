import User from "../models/User.js";
export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }

  const user = new User({ email, password, name });
  await user.save();
  res.json({ message: "User created" });

  res.send("Signup Route");
};

export const signin = async (req, res) => {
  res.send("Signin Route");
};

export const signout = async (req, res) => {
  res.send("Signout Route");
};
