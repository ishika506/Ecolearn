// models/Progress.js
import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    completedLessons: [
      {
        lessonId: { type: mongoose.Schema.Types.ObjectId, required: true },
        completedAt: { type: Date, default: Date.now },
        quizUnlocked: { type: Boolean, default: false },
        quizCompleted: { type: Boolean, default: false }, // ✅ track quiz completion
        quizScore: { type: Number, default: null }, // store score if quiz done
      },
    ],
    currentLesson: { type: mongoose.Schema.Types.ObjectId },
    isCourseCompleted: { type: Boolean, default: false },
    
  },
  { timestamps: true }
);

ProgressSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model("Progress", ProgressSchema);
