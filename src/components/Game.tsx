import { useContext, useEffect, useState } from "react";
import GlobalContext from "../context/globalContext";

import { PlayerBadge } from "./PlayerBadge";

export const Game = ({ gameId }: { gameId: string }) => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("ActionCableContext is not available");
  }

  const { subscribe, unsubscribe, send, playerId } = context;
  const [game, setGame] = useState<any>(null);
  const [opponentId, setOpponentId] = useState<string | null>(null);
  const [canFlip, setCanFlip] = useState(false);

  const updateGameStates = (game: any) => {
    setGame({ ...game });
    setCanFlip(game.players.find((p: any) => p.id === playerId)?.can_flip);
    setOpponentId(game.players.find((p: any) => p.id !== playerId)?.id || "");
  };

  useEffect(() => {
    if (!gameId) return;
    subscribe(
      { channel: "GamesChannel", game_id: gameId },
      {
        received: (data) => {
          console.log("Received data:", data);

          const delay = data.delay || 0;
          if (data.game) {
            if (delay) {
              setTimeout(() => {
                updateGameStates(data.game);
              }, delay);
            } else {
              updateGameStates(data.game);
            }
          }
        },
        connected: () => {
          send("get_game", {});
        },
      }
    );

    return () => {
      unsubscribe();
    };
  }, [gameId]);

  const flipCard = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.dataset.flipped === "true" || !canFlip) return;

    send("flip_card", {
      game_card_id: e.currentTarget.id,
      player_id: playerId,
    });
  };

  // Match Making Phase
  if (!game) {
    return <div>Creating Game...</div>;
  }

  if (game.state === "finished") {
    return (
      <div className="flex flex-col items-center justify-center">
        <div>Game {game.id} </div>
        <div>{playerId && <PlayerBadge playerId={playerId} />}</div>
        {game?.winner === playerId ? (
          <div className="text-green-500">Congratulations You won!</div>
        ) : (
          <div className="text-red-500">and a ooopp, You lost!</div>
        )}
      </div>
    );
  }

  // Live Game
  return (
    <div>
      <span>game{game.id}:</span>

      <div className="flex items-center gap-4 mb-4 justify-center">
        {playerId && <PlayerBadge playerId={playerId} />}
        {/* score badge */}
        <span className="text-xs text-gray-500">
          {game.players.find((p: any) => p.id === playerId)?.score || 0}
        </span>
        <span className="text-xs text-gray-500">vs</span>
        <span className="text-xs text-gray-500">
          {game.players.find((p: any) => p.id !== playerId)?.score || 0}
        </span>
        {opponentId && <PlayerBadge playerId={opponentId} />}
      </div>
      <div className="flex items-center gap-4 mb-4 justify-center">
        <div>
          {canFlip ? (
            <span className="text-green-500">your turn..</span>
          ) : (
            <span className="text-red-500">opponent's turn...</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {game.cards?.map((card: any, index: number) => (
          <div
            key={index}
            id={card.id}
            className="w-22 h-31 rounded-md"
            style={{
              backgroundColor: card.flipped ? "#686868" : "#fff",
            }}
            data-flipped={card.flipped}
            onClick={flipCard}
          >
            {card.flipped ? (
              <img
                src={card.image_url}
                alt="Card"
                className="w-full h-full rounded-md"
              />
            ) : (
              <img
                src="https://tcg.pokemon.com/assets/img/global/tcg-card-back-2x.jpg"
                alt="Card Back"
                className="w-full h-full rounded-md"
              />
            )}
          </div>
        ))}
      </div>

      <button
        className="mb-4 px-2 py-1 bg-blue-500 text-white rounded text-xs"
        onClick={() => {
          send("concede", {});
        }}
      >
        Concede
      </button>
    </div>
  );
};
