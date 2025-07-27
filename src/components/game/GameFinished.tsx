import { Button, Card } from "@ui/index";
import { PlayerBadge } from "@/components/ui/PlayerBadge";
import type { GameInterface, PlayerScoredCardsInterface } from "@/types/types";
import { useState, useMemo } from "react";

interface GameFinishedProps {
  game: GameInterface;
  scoredCards: PlayerScoredCardsInterface[];
  playerId: string | undefined;
  onBackToHome: () => void;
}

export const GameFinished = ({
  game,
  scoredCards,
  onBackToHome,
}: GameFinishedProps) => {
  const getRandomEmoji = (isWinner: boolean) => {
    return isWinner
      ? ["👑", "🏆", "🥇", "😏", "😎", "🥳", "💅"][
          Math.floor(Math.random() * 7)
        ]
      : ["💔", "😢", "😞", "😤", "🫥", "😡"][Math.floor(Math.random() * 6)];
  };

  const winnerEmoji = useMemo(() => getRandomEmoji(true), []);
  const loserEmoji = useMemo(() => getRandomEmoji(false), []);

  const [flipped, setFlipped] = useState<{ [id: string]: boolean }>({});

  return (
    <div className="h-full flex items-center justify-center flex-col gap-1 sm:my">
      <div className="flex flex-col items-center justify-center w-full p-2 sm:p-8">
        <div className="text-2xl">Game {game.id}</div>
        <div className="text-md mb-6">{game.state.toUpperCase()}</div>

        {/* {game.winner && (
          <div className="text-lg h-full flex flex-col items-start justify-center gap-4">
            {game.players.map((p) => (
              <div key={p.id} className="flex items-center gap-2">
                {getRandomEmoji(p.id === game.winner)}{" "}
                <PlayerBadge playerId={p.id} size="lg" />
                {playerId && p.id === playerId ? "(you)" : <div>&nbsp;</div>}
              </div>
            ))}
          </div>
        )} */}

        {scoredCards &&
          scoredCards.map((scored) => (
            <div
              key={scored.player_id}
              className="flex flex-col self-start gap-2 bg-white/30 p-4 rounded-xl mb-6 w-full"
            >
              <div className="flex gap-3 items-center">
                <PlayerBadge playerId={scored.player_id} size="lg" />
                <span className="text-2xl font-semibold tracking-widest">
                  {scored.cards.length}
                </span>
                <span className="text-xl">
                  {scored.player_id === game.winner ? winnerEmoji : loserEmoji}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {scored.cards.map((card) => (
                  <div
                    className="aspect-[63/88] sm:w-20"
                    key={card.id}
                    onMouseEnter={() => {
                      setFlipped((f) => ({ ...f, [card.id]: false }));
                      setTimeout(() => {
                        setFlipped((f) => ({ ...f, [card.id]: true }));
                      }, 300);
                    }}
                  >
                    <Card
                      isFlipped={flipped[card.id] ?? true}
                      image_url={card.image_url}
                      width="100%"
                      height="100%"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}

        <Button label="Back to Home" onClick={onBackToHome} />
      </div>
    </div>
  );
};
