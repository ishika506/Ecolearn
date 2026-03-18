import express from "express";
import { addGame, getUserGames } from "../controllers/game.controller.js";
import { verifyAdmin, verifyUser } from "../middleware/VerifyUser.js";

const router = express.Router();

// Admin-only: add a game
router.post("/", verifyAdmin, addGame);

// Get games for a user
router.get("/user/:id", verifyUser, getUserGames);


export default router;
