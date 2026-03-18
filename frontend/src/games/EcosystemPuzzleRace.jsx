import React, { useState } from "react";
import { motion } from "framer-motion";

// Puzzle pieces with their correct positions
const puzzlePieces = [
  { id: 1, emoji: "🌳", correctPos: 0 },
  { id: 2, emoji: "🦋", correctPos: 1 },
  { id: 3, emoji: "🐦", correctPos: 2 },
  { id: 4, emoji: "🌼", correctPos: 3 },
  { id: 5, emoji: "🐿️", correctPos: 4 },
];

// Board with 5 positions (null means empty)
const boardPositions = [null, null, null, null, null];

const EcosystemPuzzle = () => {
  const [board, setBoard] = useState([...boardPositions]);
  const [pieces, setPieces] = useState([...puzzlePieces]);
  const [placed, setPlaced] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handlePlacePiece = (pieceId, slotIndex) => {
    const piece = pieces.find((p) => p.id === pieceId);
    if (!piece) return;
    if (board[slotIndex]) return; // Slot already filled

    // Only allow correct placement
    if (piece.correctPos === slotIndex) {
      const newBoard = [...board];
      newBoard[slotIndex] = piece.emoji;
      setBoard(newBoard);

      setPieces(pieces.filter((p) => p.id !== pieceId));
      setPlaced((p) => {
        const newPlaced = p + 1;
        if (newPlaced === puzzlePieces.length) setGameOver(true);
        return newPlaced;
      });
    } else {
      alert("❌ Wrong spot! Try the correct position.");
    }
  };

  return (
    <div className="p-6 bg-green-100 rounded-xl shadow-xl max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">🦋 Ecosystem Jigsaw Puzzle</h2>
      <p className="text-xl font-semibold mb-4">
        Placed Correctly: {placed} / {puzzlePieces.length}
      </p>

      {gameOver && (
        <div className="p-6 bg-green-300 rounded-xl mt-4">
          <h3 className="text-4xl font-bold mb-2">🎉 Puzzle Completed! 🎉</h3>
          <p className="text-xl">You placed all pieces correctly!</p>
        </div>
      )}

      {/* Puzzle Board */}
      <div className="grid grid-cols-5 gap-4 my-6">
        {board.map((b, idx) => (
          <div
            key={idx}
            className="w-20 h-20 bg-green-200 rounded-lg flex items-center justify-center text-3xl shadow-md cursor-pointer hover:bg-green-300"
            onClick={() => {
              // Check if any piece is selected to place
              if (pieces.length === 0) return;
              const selectedPiece = pieces[0]; // pick first available piece
              handlePlacePiece(selectedPiece.id, idx);
            }}
          >
            {b || "?"}
          </div>
        ))}
      </div>

      {/* Available Pieces */}
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {pieces.map((piece) => (
          <motion.div
            key={piece.id}
            whileHover={{ scale: 1.2 }}
            className="cursor-pointer text-4xl"
          >
            {piece.emoji}
          </motion.div>
        ))}
      </div>

      <p className="mt-4 text-gray-700">
        Click a piece slot to place the correct piece. Wrong slots will alert you!
      </p>
    </div>
  );
};

export default EcosystemPuzzle;
