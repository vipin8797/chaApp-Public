import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// SignUp new User
export const signup = async (req, res) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // check existing user
    const user = await User.findOne({ email });
    if (user) {
      return res.json({ success: false, message: "Account already exists" });
    }

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create new user
    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    // generate JWT
    const token = generateToken(newUser._id);

    return res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully",
    });
  } catch (err) {
    console.log(err.message);
    return res.json({ success: false, message: err.message });
  }
};







// Login Function of User
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check missing fields
    if (!email || !password) {
      return res.json({ success: false, message: "Missing details" });
    }

    // 2. Check user exists
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    // 3. Check password
    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    // 4. Generate JWT
    const token = generateToken(userData._id);

    return res.json({
      success: true,
      userData,
      token,
      message: "Login successful",
    });

  } catch (err) {
    console.log(err.message);
    return res.json({ success: false, message: err.message });
  }
};