// components
import { Card } from "@ui/Card";
import { PlayerBadge } from "@/components/ui/PlayerBadge";
import { ConcedeModal } from "@/components/game/ConcedeModal";

// hooks
import { useGlobalToast } from "@hooks/useGlobalToast";

// types
import type { GameInterface } from "@/types/types";

interface GameBoardProps {
  game: GameInterface;
  playerId: string | undefined;
  opponentId: string | null;
  turnPlayerId: string | undefined;
  onFlipCard: (cardId: string) => void;
  onConcede: () => void;
}

export const GameBoard = ({
  game,
  playerId,
  opponentId,
  turnPlayerId,
  onFlipCard,
  onConcede,
}: GameBoardProps) => {
  const { showToast } = useGlobalToast();

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Alert player it's not their turn
    if (turnPlayerId !== playerId) {
      showToast({
        message: "Opponent's turn, please wait..",
        type: "warning",
        duration: 1000,
      });
      return;
    }

    // Do nothing if card is already flipped
    if (e.currentTarget.dataset.flipped === "true") return;

    onFlipCard(e.currentTarget.id);
  };

  const playerScore = game.players.find((p) => p.id === playerId)?.score || 0;
  const opponentScore = game.players.find((p) => p.id !== playerId)?.score || 0;

  const isPlayerTurn = turnPlayerId === playerId;
  const isOpponentTurn = turnPlayerId === opponentId;

  return (
    <div className="h-full flex items-center justify-center flex-col gap-1 overflow-hidden relative">
      <ConcedeModal onConcede={onConcede} />

      <div className="game-content">
        {/* Game Grid */}
        <div className="sm:px-4 grid grid-cols-4 w-fit gap-[5px] mt-[50px] sm:mt-[70px]">
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
          <div className="flex flex-col items-center gap-1">
            <span className="text-sm h-4 text-left w-full text-black-text [font-variant:small-caps] pl-2">
              {isPlayerTurn ? "your turn" : ""}
            </span>
            <div
              className={`flex items-center gap-2 ${
                isPlayerTurn ? "bg-white/[0.7]" : "bg-white/[0.2]"
              } py-2 px-4 rounded-xl transition-colors duration-300`}
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
            <span className="text-sm h-4 text-right w-full text-black-text [font-variant:small-caps] pr-2">
              {isOpponentTurn ? "opponent turn" : ""}
            </span>
            <div
              className={`flex items-center gap-2 ${
                isOpponentTurn ? "bg-white/[0.7]" : "bg-white/[0.2]"
              } py-2 px-4 rounded-xl transition-colors duration-300`}
            >
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
