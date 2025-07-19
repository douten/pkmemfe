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
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.dataset.flipped === "true" || !canFlip) return;
    onFlipCard(e.currentTarget.id);
  };

  const playerScore = game.players.find((p) => p.id === playerId)?.score || 0;
  const opponentScore = game.players.find((p) => p.id !== playerId)?.score || 0;

  return (
    <div className="h-full flex items-center justify-center flex-col gap-1 sm:my-3">
      {/* Score Display */}
      <div className="w-full flex items-center gap-4 my-4 justify-center p-3">
        <div className="flex items-center gap-1">
          <span className="text-xs text-black-text">you</span>
          <br />
          {playerId && <PlayerBadge playerId={playerId} size="sm" />}
          <span className="text-md text-black-text font-bold">
            {playerScore}
          </span>
        </div>
        <span className="text-xl font-bold text-black-text font-black">:</span>
        <span className="text-md text-black-text font-bold">
          {opponentScore}
        </span>
        {opponentId && <PlayerBadge playerId={opponentId} size="sm" />}
      </div>

      {/* Game Grid */}
      <div className="sm:px-4 grid grid-cols-4 w-fit gap-[5px]">
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

      {/* Game Status */}
      <div className="w-full flex items-center gap-2 my-4 p-1 text-black-text justify-center">
        {canFlip ? (
          <span className="text-green-500">your turn...</span>
        ) : (
          <span className="text-red-500">waiting on opponent...</span>
        )}
        <button
          className="py-1 px-2 bg-gray text-white rounded text-xs"
          onClick={onConcede}
        >
          Concede
        </button>
      </div>
    </div>
  );
};
