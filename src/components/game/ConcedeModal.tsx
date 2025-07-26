import { useState } from "react";
import { Button } from "@ui/Button";
import { PlayerBadge } from "@ui/PlayerBadge";
import { motion, AnimatePresence } from "framer-motion";

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
        className="w-8 h-8 sm:mb-4 cursor-pointer sm:me-4 self-end transition-colors text-viridian hover:text-white bg-white/50 hover:bg-viridian/50 rounded-full flex items-center justify-center text-xs font-bold z-10"
        onClick={handleCloseClick}
      >
        •••
      </button>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0,
              translateX: "45%",
              translateY: "48%",
            }}
            animate={{
              opacity: 1,
              scale: 1,
              translateX: "0%",
              translateY: "0%",
            }}
            exit={{
              opacity: 0,
              scale: 0,
              translateX: "45%",
              translateY: "48%",
            }}
            transition={{
              type: "spring",
              duration: 0.3,
            }}
            className="absolute w-screen h-screen z-100 flex items-center justify-center backdrop-blur-sm"
          >
            <div className="bg-white px-4 pb-4 rounded-2xl shadow-lg shadow-2xl relative max-w-[350px]">
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
              <h3 className="text-md font-semibold mt-[7px] mb-2 text-center">
                GAME {game.id}
              </h3>

              {/* SCORE BOARD */}
              <div className="bg-amber/30 rounded-xl p-3 mt-4">
                <div className="text-center text-sm tracking-widest mb-2">
                  SCORE
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-3">
                      {playerId && (
                        <PlayerBadge playerId={playerId} size="md" />
                      )}
                      <span className="text-2xl font-bold">{playerScore}</span>
                    </div>
                    <span className="[font-variant:small-caps] self-end leading-none relative -top-1 right-7">
                      you
                    </span>
                  </div>
                  <span className="text-2xl font-bold font-black self-start relative top-[-2px]">
                    :
                  </span>
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold">
                        {opponentScore}
                      </span>
                      {opponentId && (
                        <PlayerBadge playerId={opponentId} size="md" />
                      )}
                    </div>
                    <span className="[font-variant:small-caps] self-start leading-none relative -top-1 left-7">
                      opponent
                    </span>
                  </div>
                </div>
              </div>

              {/* TURN */}
              <div className="bg-amber/30 rounded-xl p-3 mt-3">
                <div className="text-center text-sm tracking-widest mb-1">
                  TURN
                </div>
                <div className="text-lg text-center font-semibold">
                  {isPlayerTurn ? "Yours" : "Opponent's"}
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
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
