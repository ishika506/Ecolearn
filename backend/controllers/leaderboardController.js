import User from "../models/User.js";
import Progress from "../models/Progress.js";
import Task from "../models/Task.js";

export const getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find();

    const leaderboard = await Promise.all(users.map(async (user) => {
      // Count completed courses
      const coursesCompleted = await Progress.countDocuments({ user: user._id, isCourseCompleted: true });

      // Count approved tasks
      const tasksCompleted = await Task.countDocuments({ user: user._id, status: "approved" });

      // Define points (example: 10 per course, 5 per task)
      const totalPoints = coursesCompleted * 10 + tasksCompleted * 5;

      return {
        userId: user._id,
        name: user.name,
        coursesCompleted,
        tasksCompleted,
        totalPoints,
      };
    }));

    // Sort by totalPoints descending
    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints);

    // Assign ranks
    leaderboard.forEach((user, index) => user.rank = index + 1);

    res.status(200).json(leaderboard);

  } catch (err) {
    next(err);
  }
};
