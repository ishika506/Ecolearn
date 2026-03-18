// src/pages/LeaderboardPage.jsx
import { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FaBook, FaTasks, FaAward } from "react-icons/fa";
import { motion } from "framer-motion";
import Confetti from "react-confetti";


// ⭐ Badge Component WITH HOVER REASON ⭐
const Badge = ({ color, text, reason }) => (
  <motion.div
    className="relative inline-block cursor-pointer group"
    whileHover={{ scale: 1.15 }}
  >
    {/* Badge */}
    <div
      className={`px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 text-lg ${color}`}
    >
      <FaAward /> {text}
    </div>

    {/* Tooltip */}
    <div
      className="
        absolute left-1/2 -translate-x-1/2 mt-3 
        px-3 py-2 bg-black text-white text-xs rounded shadow-md
        opacity-0 group-hover:opacity-100 
        transition-all duration-200 whitespace-nowrap z-50
      "
    >
      {reason}
    </div>
  </motion.div>
);



const LeaderboardPage = () => {
  const { user, refreshLeaderboardContext } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const res = await API.get("/leaderboard", {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      const myStats = res.data.find((u) => u.userId === user._id);

      setStats(
        myStats || { rank: 0, coursesCompleted: 0, tasksCompleted: 0, totalPoints: 0 }
      );
    } catch (err) {
      console.error(err);
      setError("Failed to load stats");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
    if (refreshLeaderboardContext)
      refreshLeaderboardContext.current = fetchStats;
  }, [fetchStats, refreshLeaderboardContext]);

  if (loading)
    return (
      <div className="text-center mt-10 text-xl font-semibold">
        Loading your stats...
      </div>
    );

  if (error)
    return <div className="text-center mt-10 text-red-500 text-xl">{error}</div>;

  // Chart Data
  const chartData = [
    { name: "Courses", Points: stats.coursesCompleted * 10 },
    { name: "Tasks", Points: stats.tasksCompleted * 5 },
    { name: "Total", Points: stats.totalPoints },
  ];

  return (
    <div className="space-y-6">

      {stats.rank === 1 && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={300}
        />
      )}

      <motion.h2
        className="text-5xl font-bold text-center text-green-800"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        🏆 My Progress Dashboard
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            icon: <FaAward className="text-green-600 text-4xl" />,
            label: "Rank",
            value: stats.rank,
          },
          {
            icon: <FaBook className="text-green-600 text-4xl" />,
            label: "Courses Completed",
            value: stats.coursesCompleted,
          },
          {
            icon: <FaTasks className="text-green-600 text-4xl" />,
            label: "Tasks Completed",
            value: stats.tasksCompleted,
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            className="neo-card rounded-[24px] p-6 flex flex-col items-center space-y-3"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.15 }}
          >
            {stat.icon}
            <h3 className="text-lg font-semibold text-green-900">{stat.label}</h3>
            <motion.p
              className="text-3xl font-bold text-green-900"
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
            >
              {stat.value}
            </motion.p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="neo-card rounded-[28px] p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-center text-green-900">
          Points Progress
        </h3>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34D399" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />

            <Area
              type="monotone"
              dataKey="Points"
              stroke="#34D399"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorPoints)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        className="neo-card rounded-[28px] p-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h3 className="text-2xl font-semibold mb-4 text-center text-green-900">
          Achievements & Badges
        </h3>

        <div className="flex flex-wrap justify-center gap-4">

          {stats.coursesCompleted >= 2 && (
            <Badge
              color="bg-green-200 text-green-800"
              text="Course Master"
              reason="Unlocked by completing 2+ courses"
            />
          )}

          {stats.tasksCompleted >= 10 && (
            <Badge
              color="bg-blue-200 text-blue-800"
              text="Task Champion"
              reason="Unlocked by completing 10+ tasks"
            />
          )}

          {stats.totalPoints >= 100 && (
            <Badge
              color="bg-purple-200 text-purple-800"
              text="High Achiever"
              reason="Unlocked by earning 100+ points"
            />
          )}

          {stats.rank === 1 && (
            <Badge
              color="bg-yellow-400 text-white"
              text="🥇 Top Rank"
              reason="Unlocked for ranking #1 on the leaderboard"
            />
          )}

          {stats.rank === 2 && (
            <Badge
              color="bg-gray-400 text-white"
              text="🥈 Second Place"
              reason="Unlocked for ranking #2"
            />
          )}

          {stats.rank === 3 && (
            <Badge
              color="bg-orange-400 text-white"
              text="🥉 Third Place"
              reason="Unlocked for ranking #3"
            />
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default LeaderboardPage;
