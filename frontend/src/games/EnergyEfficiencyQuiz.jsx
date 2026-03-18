import React, { useState } from "react";

const EnergyEfficiencyQuiz = () => {
  const [score, setScore] = useState(0);

  return (
    <div className="p-6 bg-green-200 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">💡 Energy Efficiency Quiz</h2>
      <p className="mb-4">Test your knowledge on how to save energy at home and work.</p>
      <p className="text-xl font-semibold mb-4">Score: {score}</p>
      <button
        onClick={() => setScore(score + 1)}
        className="neo-btn px-4 py-2 text-sm"
      >
        Correct Answer
      </button>
    </div>
  );
};

export default EnergyEfficiencyQuiz;
