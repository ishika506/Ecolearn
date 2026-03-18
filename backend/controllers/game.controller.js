import Game from "../models/Game.js";
import Progress from "../models/Progress.js";


// Add new game (admin only)
export const addGame = async (req, res) => {
  try {
    const newGame = new Game(req.body);
    await newGame.save();
    res.status(201).json(newGame);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all games for a user with locked/unlocked status




export const getUserGames = async (req, res) => {
  const userId = req.params.id; // or req.params.userId

  try {
    const userProgress = await Progress.find({ user: userId });
    const allGames = await Game.find({ isActive: true }).populate("course", "title"); // populate course title

    const gamesWithStatus = allGames.map(game => {
      const progressForCourse = userProgress.find(
        p => p.course.toString() === game.course._id.toString()
      );
      const isUnlocked = progressForCourse?.isCourseCompleted || false;

      return {
        _id: game._id,
        title: game.title,
        componentName: game.componentName,
        emoji: game.emoji,
        isUnlocked,
        courseTitle: game.course.title, // add this
      };
    });

    res.status(200).json(gamesWithStatus);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};



