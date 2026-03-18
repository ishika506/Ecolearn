import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Ecosystem spots
const habitats = [
  { type: "forest", label: "🌲 Forest", color: "bg-green-400" },
  { type: "water", label: "🌊 Water", color: "bg-blue-400" },
  { type: "sky", label: "☁️ Sky", color: "bg-gray-300" },
];

// Ecosystem items
const items = [
  { emoji: "🦋", type: "forest" },
  { emoji: "🐟", type: "water" },
  { emoji: "🦅", type: "sky" },
  { emoji: "🐿️", type: "forest" },
  { emoji: "🐠", type: "water" },
  { emoji: "🕊️", type: "sky" },
];

const EcosystemDragDrop = () => {
  const [score, setScore] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleHabitatClick = (habitatType) => {
    if (gameOver) return;

    const currentItem = items[currentIndex];
    if (!currentItem) return;

    if (currentItem.type === habitatType) {
      setScore((s) => s + 1);
    }

    // Check for game over at 5 correct items
    if (score + 1 >= 5) {
      setGameOver(true);
    } else {
      // Show next random item
      const nextIndex = Math.floor(Math.random() * items.length);
      setCurrentIndex(nextIndex);
    }
  };

  return (
    <div className="relative p-6 bg-green-100 rounded-xl shadow-xl max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">🌳 Ecosystem Drag & Drop</h2>
      <p className="text-xl font-semibold mb-6">Score: {score}/5</p>

      {gameOver ? (
        <div className="text-4xl font-bold text-green-700 mt-10">🎉 You Win! 🎉</div>
      ) : (
        <div className="mb-8 flex justify-center">
          <AnimatePresence>
            <motion.div
              key={currentIndex}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-6xl cursor-pointer"
            >
              {items[currentIndex].emoji}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <div className="flex justify-around">
        {habitats.map((habitat) => (
          <motion.div
            key={habitat.type}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={`${habitat.color} w-28 h-28 rounded-xl flex flex-col items-center justify-center shadow-lg cursor-pointer`}
            onClick={() => handleHabitatClick(habitat.type)}
          >
            <span className="text-3xl">{habitat.label.split(" ")[0]}</span>
            <span className="text-sm font-bold">{habitat.label.split(" ")[1]}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default EcosystemDragDrop;
