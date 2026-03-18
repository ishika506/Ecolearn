import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"], // restrict values
    default: "user", // normal users by default
  },
  // Reference to Progress documents
  progress: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Progress",
    },
  ],
  // Reference to Badge documents
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Add methods for password hashing and JWT generation later if needed

export default mongoose.model("User", userSchema);
