import { useState } from "react";
import { Card } from "./Card";
import { PlayerBadge } from "./PlayerBadge";
import type { GameInterface } from "./types";

interface GameBoardProps {
  game: GameInterface;
  playerId: string | undefined;
  opponentId: string | null;
  canFlip: boolean;
  onFlipCard: (cardId: string) => void;
  onConcede: () => void;
}

export const GameBoard = ({
  game,
  playerId,
  opponentId,
  canFlip,
  onFlipCard,
  onConcede,
}: GameBoardProps) => {
  const [showConcedeModal, setShowConcedeModal] = useState(false);

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.dataset.flipped === "true" || !canFlip) return;
    onFlipCard(e.currentTarget.id);
  };

  const handleCloseClick = () => {
    setShowConcedeModal(true);
  };

  const handleConfirmConcede = () => {
    setShowConcedeModal(false);
    onConcede();
  };

  const handleCancelConcede = () => {
    setShowConcedeModal(false);
  };

  const playerScore = game.players.find((p) => p.id === playerId)?.score || 0;
  const opponentScore = game.players.find((p) => p.id !== playerId)?.score || 0;

  return (
    <div className="h-full flex items-center justify-center flex-col gap-1 sm:my-3 overlow-hidden relative">
      {/* close/concede button */}
      <button
        className="absolute top-4 left-4 w-6 h-6 bg-gray hover:bg-black-text rounded-full flex items-center justify-center text-white text-sm font-bold z-10"
        onClick={handleCloseClick}
      >
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {showConcedeModal && (
        <div className="absolute inset-0 bg-white/40 flex items-center justify-center z-1">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm mx-4">
            <h3 className="text-lg font-bold text-black-text mb-4">
              Concede Game...
            </h3>
            <p className="text-black-text mb-6">
              This will end the game and your opponent will win.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                className="px-4 py-2 bg-gray text-white rounded hover:bg-black-text"
                onClick={handleCancelConcede}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-vermilion text-white rounded hover:bg-red-600"
                onClick={handleConfirmConcede}
              >
                Concede
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Grid */}
      <div className="sm:px-4 grid grid-cols-4 w-fit gap-[5px] mt-[30px] sm:mt-[50px]">
        {game.cards?.map((card, index) => (
          <div
            key={index}
            id={card.id}
            className="w-22 h-31 rounded-md"
            data-flipped={card.flipped}
            onClick={handleCardClick}
          >
            <Card
              isFlipped={card.flipped}
              image_url={card.image_url}
              width="100%"
              height="100%"
            />
          </div>
        ))}
      </div>

      {/* Score Display with Turn Indicators */}
      <div className="w-full flex items-center gap-4 justify-center p-3">
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold h-4 text-left w-full">
            {canFlip ? "your turn" : ""}
          </span>
          <div className="flex items-center gap-5">
            {playerId && <PlayerBadge playerId={playerId} size="sm" />}
            <span className="text-2xl text-black-text font-bold">
              {playerScore}
            </span>
          </div>
        </div>
        <span className="text-2xl font-bold text-black-text font-black self-end">
          :
        </span>
        <div className="flex flex-col items-center">
          <span className="text-xs font-semibold h-4 text-right w-full">
            {!canFlip ? "opponent turn" : ""}
          </span>
          <div className="flex items-center gap-5">
            <span className="text-2xl text-black-text font-bold">
              {opponentScore}
            </span>
            {opponentId && <PlayerBadge playerId={opponentId} size="sm" />}
          </div>
        </div>
      </div>
    </div>
  );
};
