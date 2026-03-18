
import express from "express";
import {
  getAllCourses,
  getCourseById,
  getLessonById,
  completeLesson,
  submitQuiz,deleteCourse,
  updateCourse,
  deleteLesson,
  deleteQuiz
} from "../controllers/courseController.js";
import { verifyToken, verifyAdmin } from "../middleware/VerifyUser.js";
import Course from "../models/Course.js";


const router = express.Router();

// Admin: create course
router.post("/course", verifyAdmin,async (req, res, next) => {
  try {
    const newCourse = new Course(req.body);
    await newCourse.save();
    res.status(201).json(newCourse);
  } catch (err) {
    next(err);
  }
});

// User routes
router.get("/", verifyToken, getAllCourses);
router.get("/:courseId", verifyToken, getCourseById);
router.get("/:courseId/lessons/:lessonId", verifyToken, getLessonById);
router.post("/:courseId/lessons/:lessonId/complete", verifyToken, completeLesson);
router.post("/:courseId/lessons/:lessonId/quiz", verifyToken, submitQuiz);
// Admin: delete course
router.delete("/course/:courseId", verifyAdmin, deleteCourse);
router.put("/course/:courseId", verifyAdmin, updateCourse);
router.delete("/course/:courseId/lesson/:lessonId", verifyAdmin, deleteLesson);
router.delete(
  "/course/:courseId/lesson/:lessonId/quiz/:quizId",
  verifyAdmin,
  deleteQuiz
);


export default router;
