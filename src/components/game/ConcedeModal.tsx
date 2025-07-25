import { useState } from "react";
import { Button } from "@ui/Button";
import { PlayerBadge } from "@ui/PlayerBadge";

import type { GameInterface } from "@/types/types";

interface ConcedeModalProps {
  onConcede: () => void;
  game: GameInterface;
  turnPlayerId: string;
  playerId: string;
  opponentId: string;
}

export const ConcedeModal = ({
  onConcede,
  game,
  turnPlayerId,
  playerId,
  opponentId,
}: ConcedeModalProps) => {
  const [showModal, setShowModal] = useState(false);

  const playerScore = game.players.find((p) => p.id === playerId)?.score || 0;
  const opponentScore = game.players.find((p) => p.id !== playerId)?.score || 0;

  const isPlayerTurn = turnPlayerId === playerId;

  const handleCloseClick = () => {
    setShowModal(true);
  };

  const handleConfirmConcede = () => {
    setShowModal(false);
    onConcede();
  };

  const handleCancelConcede = () => {
    setShowModal(false);
  };

  return (
    <>
      {/* Close/concede button */}
      <button
        className="w-8 h-8 sm:mb-4 me-4 self-end bg-viridian/50 hover:bg-black-text rounded-full flex items-center justify-center text-white text-xs font-bold z-10"
        onClick={handleCloseClick}
      >
        •••
      </button>

      {/* Concede Modal */}
      {showModal && (
        <div className="absolute inset-0 bg-white/40 flex items-center justify-center grow z-50 sm:rounded-3xl">
          <div className="bg-white/60 px-4 pb-4 rounded-2xl shadow-lg max-w-sm mx-4 relative">
            <button
              className="absolute top-2 left-2 w-6 h-6 hover:bg-gray-50 rounded-full flex items-center justify-center text-white text-sm font-bold z-10"
              onClick={handleCancelConcede}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="#545454"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <h3 className="text-md font-semibold text-black-text mt-[7px] mb-5 text-center">
              GAME {game.id}
            </h3>

            {/* SCORE BOARD */}
            <div className="bg-white/30 px-4 pt-2 pb-4 rounded-xl mb-6">
              <div className="w-full flex items-center justify-center text-black-text text-sm tracking-widest select-none mb-2">
                SCORE BOARD
              </div>
              <div className="w-full flex items-center gap-4 justify-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-md h-4 text-left w-full text-black-text [font-variant:small-caps] pl-2">
                    you
                  </span>
                  <div
                    className={`flex items-center gap-2 bg-white/[0.7] py-2 px-4 rounded-xl transition-colors duration-300`}
                  >
                    {playerId && <PlayerBadge playerId={playerId} size="sm" />}
                    <span className="text-2xl text-black-text font-bold">
                      {playerScore}
                    </span>
                  </div>
                </div>
                <span className="text-2xl font-bold text-black-text pb-2 font-black self-end">
                  :
                </span>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-md h-4 text-right w-full text-black-text [font-variant:small-caps] pr-2">
                    opponent
                  </span>
                  <div
                    className={`flex items-center gap-2 bg-white/[0.7] py-2 px-4 rounded-xl transition-colors duration-300`}
                  >
                    <span className="text-2xl text-black-text font-bold">
                      {opponentScore}
                    </span>
                    {opponentId && (
                      <PlayerBadge playerId={opponentId} size="sm" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* TURN */}
            <div className="bg-white/30 px-4 pt-2 pb-4 rounded-xl">
              <div className="w-full flex items-center justify-center text-black-text text-sm tracking-widest select-none mb-2">
                TURN
              </div>
              <div className="w-full flex items-center gap-4 justify-center">
                <span className="text-md text-black-text font-bold">
                  {isPlayerTurn ? "Your Turn" : "Opponent's Turn"}
                </span>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <Button
                label="Concede"
                onClick={handleConfirmConcede}
                type="warning"
              />
            </div>
          </div>
        </div>
      )}

      {/* Blur overlay for background content */}
      {showModal && (
        <style>{`
          .game-content { filter: blur(10px); }
        `}</style>
      )}
    </>
  );
};
