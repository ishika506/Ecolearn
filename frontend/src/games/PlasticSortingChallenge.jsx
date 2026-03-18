import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Bins
const bins = [
  { type: "plastic", emoji: "♻️", label: "Plastic", color: "bg-blue-400" },
  { type: "organic", emoji: "🌱", label: "Organic", color: "bg-green-400" },
  { type: "paper", emoji: "📄", label: "Paper", color: "bg-yellow-400" },
  { type: "metal", emoji: "🥫", label: "Metal", color: "bg-gray-400" },
  { type: "glass", emoji: "🍾", label: "Glass", color: "bg-purple-400" },
];

// More garbage emojis
const garbageItems = [
  { emoji: "🥤", type: "plastic" },
  { emoji: "🛍️", type: "plastic" },
  { emoji: "🍎", type: "organic" },
  { emoji: "🍌", type: "organic" },
  { emoji: "📰", type: "paper" },
  { emoji: "📦", type: "paper" },
  { emoji: "🥫", type: "metal" },
  { emoji: "🍾", type: "glass" },
  { emoji: "🥡", type: "plastic" },
  { emoji: "🍋", type: "organic" },
  { emoji: "🗞️", type: "paper" },
  { emoji: "🍶", type: "glass" },
];

const PlasticSortingChallenge = () => {
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (score >= 5) setGameOver(true); // End at 5 correct answers
  }, [score]);

  const handleBinClick = (binType) => {
    if (gameOver) return;

    const currentItem = garbageItems[currentIndex];
    if (!currentItem) return;

    if (currentItem.type === binType) {
      setScore((s) => s + 1);
    }

    // Show next garbage
    const nextIndex = Math.floor(Math.random() * garbageItems.length);
    setCurrentIndex(nextIndex);
  };

  return (
    <div className="relative p-6 bg-green-100 rounded-xl shadow-xl max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-4">♻️ Plastic Sorting Challenge</h2>
      <p className="text-xl font-semibold text-center mb-6">Score: {score}/5</p>

      {gameOver ? (
        <div className="text-center text-4xl font-bold text-green-700 mt-10">
          🎉 You Win! 🎉
        </div>
      ) : (
        <div className="flex justify-center mb-8">
          <AnimatePresence>
            <motion.div
              key={currentIndex}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-6xl cursor-pointer"
            >
              {garbageItems[currentIndex].emoji}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Bins */}
      <div className="flex justify-around">
        {bins.map((bin) => (
          <motion.div
            key={bin.type}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`${bin.color} w-24 h-24 rounded-xl flex flex-col items-center justify-center shadow-lg cursor-pointer`}
            onClick={() => handleBinClick(bin.type)}
          >
            <span className="text-4xl">{bin.emoji}</span>
            <span className="text-sm font-bold">{bin.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default PlasticSortingChallenge;
