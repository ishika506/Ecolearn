import express from "express";
import { verifyAdmin } from "../middleware/VerifyUser.js";
import {
  getAllStudents,
  getStudentProgress,
  getDashboardStats
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes are protected
router.use(verifyAdmin);

// Students
router.get("/students", getAllStudents);
router.get("/students/:id/progress", getStudentProgress);
router.get("/dashboard", getDashboardStats);


export default router;
