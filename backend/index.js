// server.js
import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoute from "./routes/auth.js";
import courseRoute from "./routes/course.js";
import gameRoute from "./routes/game.routes.js";
import taskRoute from "./routes/task.routes.js";
import leaderboardRoutes from "./routes/leaderboard.js"
import adminRoutes from "./routes/admin.js"




dotenv.config();

const app = express();

// Resolve __dirname (for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // Vite dev server
  credentials: true,
}));
app.use(express.json());

// ✅ Serve uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/courses", courseRoute);
app.use("/api/games", gameRoute);
app.use("/api/tasks", taskRoute);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/admin", adminRoutes);



// Error handler
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";
  res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

// Connect to MongoDB


const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected!");
});

// Start server
connect().then(() => {
  const PORT = process.env.PORT || 8800;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
});
