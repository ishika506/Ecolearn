import express from "express";
import { getLeaderboard} from "../controllers/leaderboardController.js";
import { verifyToken } from "../middleware/VerifyUser.js"; // only verify login

const router = express.Router();

// GET /api/leaderboard
router.get("/", verifyToken,getLeaderboard);

export default router;
