import mongoose from "mongoose";
import Task from "../models/Task.js";
import Progress from "../models/Progress.js";
import User from "../models/User.js";

/* ===============================
   ADMIN: Create Global Task
================================ */
export const createTask = async (req, res) => {
  try {
    const { title, instructions, lockedUntilCourse } = req.body;

    const newTask = new Task({
      title,
      instructions,
      lockedUntilCourse: lockedUntilCourse || null,
    });

    await newTask.save();
    res.status(201).json({ success: true, task: newTask });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ===============================
   USER: Submit Task
================================ */
export const submitTask = async (req, res) => {
  try {
    const { taskId, experience } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const globalTask = await Task.findById(taskId);
    if (!globalTask || globalTask.user) {
      return res.status(404).json({ success: false, message: "Global task not found" });
    }

    const submission = new Task({
      title: globalTask.title,
      instructions: globalTask.instructions,
      lockedUntilCourse: globalTask.lockedUntilCourse,
      user: req.user.id,
      image: imagePath,
      experience,
      status: "pending",
    });

    await submission.save();
    res.status(201).json({ success: true, submission });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ===============================
   USER: Get Tasks + Status
================================ */
export const getUserTasks = async (req, res) => {
  try {
    const userId = req.params.id;

    const globalTasks = await Task.find({ user: null }).populate("lockedUntilCourse");
    const userSubmissions = await Task.find({ user: userId });
    const progress = await Progress.find({ user: userId });

    const tasksWithStatus = globalTasks.map((task) => {
      const submission = userSubmissions.find(
        (s) => s.title === task.title
      );

      let isUnlocked = true;
      if (task.lockedUntilCourse) {
        const courseProgress = progress.find(
          (p) => p.course.toString() === task.lockedUntilCourse._id.toString()
        );
        isUnlocked = !!courseProgress?.isCourseCompleted;
      }

      return {
        _id: task._id,
        title: task.title,
        instructions: task.instructions,
        lockedUntilCourse: task.lockedUntilCourse,
        isUnlocked,
        status: submission ? submission.status : "not_started",
        userSubmission: submission || null,
      };
    });

    res.status(200).json({ success: true, tasks: tasksWithStatus });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ===============================
   ADMIN: Approve Task
================================ */
export const approveTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || !task.user) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    task.status = "approved";
    task.approvedBy = req.user.id;
    task.approvedAt = new Date();

    await task.save();
    res.status(200).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ===============================
   ADMIN: Reject Task
================================ */
export const rejectTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task || !task.user) {
      return res.status(404).json({ success: false, message: "Submission not found" });
    }

    task.status = "rejected";
    task.approvedBy = req.user.id;
    task.approvedAt = new Date();

    await task.save();
    res.status(200).json({ success: true, task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ===============================
   ADMIN: Get ALL User Submissions
   (THIS FIXES YOUR 500 ERROR)
================================ */
export const getAllUserTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: { $ne: null } })
      .populate("user", "name email")
      .populate("approvedBy", "name email")
      .populate("lockedUntilCourse", "title")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (err) {
    console.error("getAllUserTasks error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
