
// backend/controllers/auth.js
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js"; // your custom error handler


// ================= REGISTER USER =================
export const register = async (req, res) => {
  try {
    let { name, email, password } = req.body;

    // ---------------- BASIC CHECKS ----------------
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Trim inputs
    name = name.trim();
    email = email.trim().toLowerCase();

    // ---------------- GMAIL FORMAT CHECK ----------------
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid Gmail address",
      });
    }

    // ---------------- STRONG PASSWORD CHECK ----------------
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!strongPasswordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    // ---------------- CHECK USER EXISTS ----------------
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email",
      });
    }

    // ---------------- HASH PASSWORD ----------------
    const hashedPassword = await bcrypt.hash(password, 10);

    // ---------------- CREATE USER ----------------
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

// Login user
export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return next(createError(404, "User not found"));

    const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
    if (!isPasswordCorrect) return next(createError(400, "Wrong password"));

    // Include role in JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const { password, ...other } = user._doc;
    res.status(200).json({ token, user: other });
  } catch (err) {
    next(err);
  }
};

// Logout user (for frontend stored JWT, just remove it on client)
export const logout = async (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
};


