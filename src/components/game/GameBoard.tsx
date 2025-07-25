// components
import { Card } from "@ui/Card";
import { ConcedeModal } from "@/components/game/ConcedeModal";

// hooks
import { useGlobalToast } from "@hooks/useGlobalToast";

// types
import type { GameInterface, CardInterface } from "@/types/types";

interface GameBoardProps {
  game: GameInterface;
  cards: CardInterface[];
  playerId: string | undefined;
  opponentId: string | null;
  turnPlayerId: string | undefined;
  onFlipCard: (cardId: string) => void;
  onConcede: () => void;
}

export const GameBoard = ({
  game,
  cards,
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
        message: "Opponent's turn, please wait...",
        type: "warning",
        duration: 1000,
      });
      return;
    }

    // Do nothing if card is already flipped
    if (e.currentTarget.dataset.flipped === "true") return;
    onFlipCard(e.currentTarget.id);
  };

  return (
    <div className="h-full flex items-center justify-center flex-col gap-1 overflow-hidden relative">
      <div className="flex mx-4 mt-3 self-start items-start gap-2 h-[30px]">
        {/* <div className="flex gap-2 bg-white/[0.7] py-1 px-3 rounded-xl transition-colors duration-300">
          <span className="text-sm text-black-text">Opponent's Turn</span>
        </div> */}
      </div>

      <div className="game-content transition-filter duration-300">
        {/* Game Grid */}
        <div className="sm:px-4 grid grid-cols-4 w-fit gap-[5px] my-4 sm:my-3">
          {cards?.map((card, index) => (
            <div
              key={index}
              id={card.id}
              className="w-22 h-31 rounded-md"
              data-flipped={!!card.image_url}
              onClick={handleCardClick}
            >
              <Card
                isFlipped={!!card.image_url}
                image_url={card.image_url}
                width="100%"
                height="100%"
              />
            </div>
          ))}
        </div>
      </div>

      {turnPlayerId && game && playerId && opponentId && (
        <ConcedeModal
          onConcede={onConcede}
          game={game}
          turnPlayerId={turnPlayerId}
          playerId={playerId}
          opponentId={opponentId}
        />
      )}
    </div>
  );
};
