import { Card } from "./Card";
import { PlayerBadge } from "./PlayerBadge";
import { ConcedeModal } from "./ConcedeModal";
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
    <div className="h-full flex items-center justify-center flex-col gap-1 overflow-hidden relative">
      <ConcedeModal onConcede={onConcede} />

      <div className="game-content">
        {/* Game Grid */}
        <div className="sm:px-4 grid grid-cols-4 w-fit gap-[5px] mt-[30px] sm:mt-[60px]">
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
        <div className="w-full flex items-center gap-4 justify-center p-3 sm:mb-3">
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
    </div>
  );
};
