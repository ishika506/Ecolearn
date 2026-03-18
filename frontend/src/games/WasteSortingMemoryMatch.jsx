import React, { useState } from "react";

const WasteSortingMemoryMatch = () => {
  const [matches, setMatches] = useState(0);

  return (
    <div className="p-6 bg-green-200 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">🗂️ Waste Sorting Memory Match</h2>
      <p className="mb-4">Match different types of waste with their correct bins.</p>
      <p className="text-xl font-semibold mb-4">Matches: {matches}</p>
      <button
        onClick={() => setMatches(matches + 1)}
        className="neo-btn px-4 py-2 text-sm"
      >
        Match Waste
      </button>
    </div>
  );
};

export default WasteSortingMemoryMatch;
