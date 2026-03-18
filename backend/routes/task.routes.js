// routes/task.routes.js
import express from "express";
import { verifyToken, verifyUser, verifyAdmin } from "../middleware/VerifyUser.js";
import upload from "../middleware/upload.js";
import {
  createTask,
  submitTask,
  getUserTasks,
  approveTask,
  rejectTask,
  getAllUserTasks,
} from "../controllers/task.controller.js";

const router = express.Router();

// Admin creates global task
router.post("/", verifyAdmin, createTask);

// User submits work
router.post("/submit", verifyToken, upload.single("image"), submitTask);

// ✅ ADMIN: get all submissions (PUT THIS FIRST)
router.get("/user/all", verifyAdmin, getAllUserTasks);

// User-specific tasks (PUT AFTER)
router.get("/user/:id", verifyUser, getUserTasks);

// Admin approves/rejects
router.put("/approve/:id", verifyAdmin, approveTask);
router.put("/reject/:id", verifyAdmin, rejectTask);

export default router;
