import { Button } from "./Button";
import { PlayerBadge } from "./PlayerBadge";
import type { GameInterface } from "./types";

interface GameFinishedProps {
  game: GameInterface;
  playerId: string | undefined;
  onBackToHome: () => void;
}

export const GameFinished = ({
  game,
  playerId,
  onBackToHome,
}: GameFinishedProps) => {
  const getRandomEmoji = (isWinner: boolean) => {
    return isWinner
      ? ["👑", "🏆", "🥇", "😏", "😎", "🥳", "💅"][
          Math.floor(Math.random() * 7)
        ]
      : ["💔", "😢", "😞", "😤", "🫥", "😡"][Math.floor(Math.random() * 6)];
  };

  return (
    <div className="h-full flex items-center justify-center flex-col gap-1 sm:my-3">
      <div className="flex flex-col items-center justify-center w-fit gap-8 p-4">
        <div className="text-2xl">Game #{game.id} results:</div>

        {game.winner && (
          <div className="text-lg h-full flex flex-col items-start justify-center gap-4">
            {game.players.map((p) => (
              <div key={p.id} className="flex items-center gap-2">
                {getRandomEmoji(p.id === game.winner)}{" "}
                <PlayerBadge playerId={p.id} size="lg" />
                {playerId && p.id === playerId ? "(you)" : <div>&nbsp;</div>}
              </div>
            ))}
          </div>
        )}

        <Button label="Back to Home" onClick={onBackToHome} />
      </div>
    </div>
  );
};
