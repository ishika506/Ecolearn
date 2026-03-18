import React, { useState } from "react";

const OceanCleanUp = () => {
  const [collected, setCollected] = useState(0);

  return (
    <div className="p-6 bg-green-200 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">🌊 Ocean Clean-Up Game</h2>
      <p className="mb-4">Drag floating trash into recycling bins to clean the ocean.</p>
      <p className="text-xl font-semibold mb-4">Collected: {collected}</p>
      <button
        onClick={() => setCollected(collected + 1)}
        className="neo-btn px-4 py-2 text-sm"
      >
        Collect Trash
      </button>
    </div>
  );
};

export default OceanCleanUp;
