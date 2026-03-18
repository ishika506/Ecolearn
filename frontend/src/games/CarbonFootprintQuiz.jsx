import React, { useState } from "react";

const questions = [
  {
    question: "Which is a renewable source of energy?",
    options: ["Coal", "Wind", "Oil", "Natural Gas"],
    answer: "Wind",
  },
  {
    question: "What can help reduce your carbon footprint at home?",
    options: ["Leaving lights on", "Using public transport", "Driving more", "Buying single-use plastics"],
    answer: "Using public transport",
  },
  {
    question: "Which action reduces carbon emissions?",
    options: ["Planting trees", "Flying frequently", "Using more plastic", "Burning waste"],
    answer: "Planting trees",
  },
  {
    question: "Which is an eco-friendly practice?",
    options: ["Recycling", "Littering", "Using disposable items", "Overconsumption"],
    answer: "Recycling",
  },
  {
    question: "What is a small action to help the environment?",
    options: ["Turning off unused electronics", "Leaving faucets running", "Driving short distances unnecessarily", "Throwing trash in rivers"],
    answer: "Turning off unused electronics",
  },
];

const CarbonFootprintQuiz = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizOver, setQuizOver] = useState(false);

  const handleAnswer = (option) => {
    if (option === questions[currentIndex].answer) {
      setScore((s) => s + 1);
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      setQuizOver(true);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  if (quizOver) {
    return (
      <div className="p-6 bg-green-200 rounded-lg shadow-md text-center max-w-md mx-auto mt-6">
        <h2 className="text-3xl font-bold mb-4">🌍 Quiz Completed!</h2>
        <p className="text-xl font-semibold mb-4">Your Score: {score} / {questions.length}</p>
        <p className="text-lg">Great job on learning how to reduce your carbon footprint! 🌱</p>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="p-6 bg-green-200 rounded-lg shadow-md text-center max-w-md mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4">🌍 Carbon Footprint Quiz</h2>
      <p className="text-lg mb-6">{currentQuestion.question}</p>
      <div className="flex flex-col gap-4">
        {currentQuestion.options.map((option) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            className="neo-btn w-full text-sm"
          >
            {option}
          </button>
        ))}
      </div>
      <p className="text-xl font-semibold mt-4">Score: {score}</p>
    </div>
  );
};

export default CarbonFootprintQuiz;
