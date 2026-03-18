import React, { useState } from "react";

const RenewableEnergyDragDrop = () => {
  const [placed, setPlaced] = useState(0);

  return (
    <div className="p-6 bg-green-200 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">⚡ Renewable Energy Drag & Drop</h2>
      <p className="mb-4">Match energy sources to renewable or non-renewable categories.</p>
      <p className="text-xl font-semibold mb-4">Placed Correctly: {placed}</p>
      <button
        onClick={() => setPlaced(placed + 1)}
        className="neo-btn px-4 py-2 text-sm"
      >
        Place Source
      </button>
    </div>
  );
};

export default RenewableEnergyDragDrop;
