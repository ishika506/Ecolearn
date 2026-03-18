// models/Course.js
import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String },
});

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  order: { type: Number, required: true },
  isLocked: { type: Boolean, default: true },
  videoUrl: { type: String },      // ✅ Optional video link
  quizzes: [QuizSchema],
});

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    lessons: [LessonSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Course", CourseSchema);
