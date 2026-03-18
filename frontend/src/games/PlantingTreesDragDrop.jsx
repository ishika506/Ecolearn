import React, { useState } from "react";

const PlantingTreesDragDrop = () => {
  const [planted, setPlanted] = useState(0);

  return (
    <div className="p-6 bg-green-200 rounded-lg shadow-md text-center">
      <h2 className="text-2xl font-bold mb-4">🌱 Planting Trees Drag & Drop</h2>
      <p className="mb-4">Drag tree saplings to the right soil areas to plant them.</p>
      <p className="text-xl font-semibold mb-4">Planted: {planted}</p>
      <button
        onClick={() => setPlanted(planted + 1)}
        className="neo-btn px-4 py-2 text-sm"
      >
        Plant Tree
      </button>
    </div>
  );
};

export default PlantingTreesDragDrop;
