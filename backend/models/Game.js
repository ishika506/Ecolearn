import mongoose from "mongoose";

const GameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    emoji: { type: String, default: "🎮" },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }, // linked course
    componentName: { type: String, required: true }, // "DragDropGame", "SortingRace", etc.
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Game", GameSchema);
