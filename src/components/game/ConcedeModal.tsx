import { useState } from "react";
import { Button } from "@ui/Button";

interface ConcedeModalProps {
  onConcede: () => void;
}

export const ConcedeModal = ({ onConcede }: ConcedeModalProps) => {
  const [showModal, setShowModal] = useState(false);

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
      {!showModal && (
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
      )}

      {/* Concede Modal */}
      {showModal && (
        <div className="absolute inset-0 bg-white/40 flex items-center justify-center grow z-50 sm:rounded-3xl">
          <div className="bg-white/60 p-8 rounded-2xl shadow-lg max-w-sm mx-4">
            <h3 className="text-lg font-bold text-black-text mb-4">
              Concede Game...
            </h3>
            <p className="text-black-text mb-6">
              This will end the game and your opponent will win.
            </p>
            <div className="flex gap-3 justify-end">
              <Button label="Cancel" onClick={handleCancelConcede} />
              <Button label="Concede" onClick={handleConfirmConcede} />
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
