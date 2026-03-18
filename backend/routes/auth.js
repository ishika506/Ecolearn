import express from "express";
import { login, register } from "../controllers/auth.js";
import { getAllStudents } from "../controllers/adminController.js";



const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Logged out successfully" });
});


export default router;
