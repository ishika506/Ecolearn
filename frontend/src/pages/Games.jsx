// src/pages/Games.jsx
import React, { useEffect, useState, useContext } from "react";
import API from "../api";
import { AuthContext } from "../context/AuthContext";

// Import all game components
import PlasticSortingChallenge from "../games/PlasticSortingChallenge";
import EcosystemPuzzleRace from "../games/EcosystemPuzzleRace";
import EcosystemDragAndDrop from "../games/EcosystemDragDrop";
import PlantingTreesDragAndDrop from "../games/PlantingTreesDragDrop";
import RenewableEnergyDragAndDrop from "../games/RenewableEnergyDragDrop";
import WaterCycleMemoryMatch from "../games/WaterCycleMemory";
import RecyclingMemoryMatch from "../games/RecyclingMemoryMatch";
import WasteSortingMemoryMatch from "../games/WasteSortingMemoryMatch";
import ClimateQuiz from "../games/ClimateQuiz";
import EnergyEfficiencyQuiz from "../games/EnergyEfficiencyQuiz";
import RenewableEnergyQuiz from "../games/RenewableEnergyQuiz";
import CarbonFootprintQuiz from "../games/CarbonFootprintQuiz";
import TrashCleanUpAdventure from "../games/TrashCleanUpAdventure";
import OceanCleanUpGame from "../games/OceanCleanUp";
import BeachCleanUpAdventure from "../games/BeachCleanUpAdventure";

// Map backend componentName + title to frontend component
const gameComponents = {
  SortingRace: {
    "Plastic Sorting Challenge": PlasticSortingChallenge,
    "Ecosystem Puzzle Race": EcosystemPuzzleRace,
  },
  DragDropGame: {
    "Ecosystem Drag & Drop": EcosystemDragAndDrop,
    "Planting Trees Drag & Drop": PlantingTreesDragAndDrop,
    "Renewable Energy Drag & Drop": RenewableEnergyDragAndDrop,
  },
  MemoryMatch: {
    "Water Cycle Memory Match": WaterCycleMemoryMatch,
    "Recycling Memory Match": RecyclingMemoryMatch,
    "Waste Sorting Memory Match": WasteSortingMemoryMatch,
  },
  QuizGame: {
    "Climate Quiz": ClimateQuiz,
    "Energy Efficiency Quiz": EnergyEfficiencyQuiz,
    "Renewable Energy Quiz": RenewableEnergyQuiz,
    "Carbon Footprint Quiz": CarbonFootprintQuiz,
  },
  TrashCleanUp: {
    "Trash Clean-Up Adventure": TrashCleanUpAdventure,
    "Ocean Clean-Up Game": OceanCleanUpGame,
    "Beach Clean-Up Adventure": BeachCleanUpAdventure,
  },
};

const Games = () => {
  const { user } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);

  // Fetch user games
  useEffect(() => {
    if (!user) return;

    const fetchGames = async () => {
      try {
        const res = await API.get(`/games/user/${user._id}`);
        setGames(res.data);
      } catch (err) {
        console.error("Failed to fetch games:", err.response?.data || err.message);
      }
    };

    fetchGames();
  }, [user]);

  // Render selected game
  if (selectedGame) {
    const ComponentMap = gameComponents[selectedGame.componentName];
    const GameComponent = ComponentMap?.[selectedGame.title];

    if (!GameComponent) return <p>Game component not found!</p>;

    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedGame(null)}
          className="neo-btn px-4 py-2 text-sm"
        >
          ← Back to Games
        </button>
        <div className="neo-card rounded-[28px] p-6">
          <GameComponent />
        </div>
      </div>
    );
  }

  // Render all games grid
  return (
    <div className="space-y-6">
      <div className="neo-card rounded-[28px] p-6 text-center">
        <h2 className="text-3xl font-bold text-green-900">🌟 Play Environmental Games</h2>
        <p className="text-green-700 mt-2">Complete courses to unlock new adventures.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {games.map((game) => (
          <div
            key={game._id}
            onClick={() => game.isUnlocked && setSelectedGame(game)}
            className={`neo-card rounded-[24px] p-6 flex flex-col items-center justify-center text-center transition ${
              game.isUnlocked ? "cursor-pointer" : "opacity-60 cursor-not-allowed"
            } ${game.isUnlocked ? "hover:-translate-y-1" : ""}`}
          >
            <div className="text-5xl mb-4">{game.emoji}</div>
            <h3 className="text-xl font-bold text-green-900">{game.title}</h3>
            <p className="text-green-700 mt-2">
              {game.isUnlocked
                ? "Click to play"
                : `Complete the course "${game.courseTitle}" to unlock`}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Games;
