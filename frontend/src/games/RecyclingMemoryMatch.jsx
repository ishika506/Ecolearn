import React, { useState } from "react";

const RecyclingMemoryMatch = () => {
  const [matches, setMatches] = useState(0);

  return (
    <div className="p-6 bg-green-200 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">🟩 Recycling Memory Match</h2>
      <p className="mb-4">Match recyclable items with their corresponding bin types.</p>
      <p className="text-xl font-semibold mb-4">Matches: {matches}</p>
      <button
        onClick={() => setMatches(matches + 1)}
        className="neo-btn px-4 py-2 text-sm"
      >
        Match Item
      </button>
    </div>
  );
};

export default RecyclingMemoryMatch;
