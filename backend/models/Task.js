import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    // GLOBAL FIELDS (define the task itself)
    title: { type: String, required: true },
    instructions: { type: String, required: true },
    lockedUntilCourse: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, // optional lock

    // USER SUBMISSION FIELDS
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null for global task definition
    image: { type: String }, 
    experience: { type: String },
    status: { type: String, enum: ["not_started", "pending", "approved", "rejected"], default: "not_started" },

    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Task", TaskSchema);
