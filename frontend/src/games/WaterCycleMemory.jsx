import React, { useState } from "react";

const WaterCycleMemory = () => {
  const [matches, setMatches] = useState(0);

  return (
    <div className="p-6 bg-green-200 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">💧 Water Cycle Memory Match</h2>
      <p className="mb-4">Match cards to complete the stages of the water cycle.</p>
      <p className="text-xl font-semibold mb-4">Matches: {matches}</p>
      <button
        onClick={() => setMatches(matches + 1)}
        className="neo-btn px-4 py-2 text-sm"
      >
        Make a Match
      </button>
    </div>
  );
};

export default WaterCycleMemory;
