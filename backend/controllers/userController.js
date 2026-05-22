import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import { HTTP_STATUS } from "../lib/statusCodes.js";
import { isValidEmail, isValidPassword, isValidName } from "../lib/validators.js";

// SignUp new User
export const signup = async (req, res, next) => {
  const { fullName, email, password, bio } = req.body;

  try {
    if (!fullName || !email || !password || !bio) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "Missing Details" });
    }

    if (!isValidName(fullName)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "Name must be at least 2 characters long" });
    }

    if (!isValidEmail(email)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "Invalid email address format" });
    }

    if (!isValidPassword(password)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "Password must be at least 6 characters long" });
    }

    // check existing user
    const user = await User.findOne({ email });
    if (user) {
      return res.status(HTTP_STATUS.CONFLICT).json({ success: false, message: "Account already exists" });
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

    return res.status(HTTP_STATUS.CREATED).json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully",
    });
  } catch (err) {
    next(err);
  }
};






// Login Function of User
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Check missing fields
    if (!email || !password) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "Missing details" });
    }

    if (!isValidEmail(email)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "Invalid email format" });
    }

    // 2. Check user exists
    const userData = await User.findOne({ email });
    if (!userData) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: "Invalid Credentials" });
    }

    // 3. Check password
    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ success: false, message: "Invalid Credentials" });
    }

    // 4. Generate JWT
    const token = generateToken(userData._id);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      userData,
      token,
      message: "Login successful",
    });

  } catch (err) {
    next(err);
  }
};



//Controller to check if user is authenticated
export const checkAuth = (req, res) => {
  res.status(HTTP_STATUS.OK).json({ success: true, user: req.user });
}



//Controller function to update UserProfile.
export const updateProfile = async (req, res, next) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;

    if (fullName && !isValidName(fullName)) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: "Name must be at least 2 characters long" });
    }

    let updatedUser;

    // No new profile pic
    if (!profilePic || profilePic.trim() === "") {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } 
    else {
      // Upload image to Cloudinary
      const upload = await cloudinary.uploader.upload(profilePic, {
        folder: "chatapp/profilePics",
      });

      updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          profilePic: upload.secure_url,
          bio,
          fullName,
        },
        { new: true }
      );
    }

    return res.status(HTTP_STATUS.OK).json({ success: true, user: updatedUser });
  } catch (err) {
    next(err);
  }
};