import { useContext, useEffect, useState } from "react";
import ActionCableContext from "../context/actionCableContext";

import { PlayerBadge } from "./PlayerBadge";

export const Game = () => {
  const context = useContext(ActionCableContext);
  if (!context) {
    throw new Error("ActionCableContext is not available");
  }

  const RESET_DELAY = 1300; // 1 second delay for resetting the game state

  const { subscribe, unsubscribe, send, playerId } = context;
  const [game, setGame] = useState<any>(null);
  const [canFlip, setCanFlip] = useState(false);
  const opponentId = game?.players.filter((p: any) => p.id !== playerId)[0].id;

  useEffect(() => {
    subscribe(
      { channel: "GamesChannel" },
      {
        received: (data) => {
          console.log("Received data:", data);

          const reset = data.reset || false;

          if (data.game) {
            // setGame({ ...data.game });

            if (reset) {
              setTimeout(() => {
                setGame({ ...data.game });
              }, RESET_DELAY);
            } else {
              setGame({ ...data.game });
            }
          }

          if (data.can_flip) {
            const canFlip = data.can_flip[playerId];

            // if reset then setCanFlip with interval of 3 seconds
            if (reset) {
              setTimeout(() => {
                setCanFlip(canFlip);
              }, RESET_DELAY);
            } else {
              // if not reset then just set canFlip
              setCanFlip(canFlip);
            }

            console.log("Can flip:", canFlip);
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
  }, []);

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

  if (!opponentId || game.state === "matching") {
    return (
      <div>
        <div>{playerId && <PlayerBadge playerId={playerId} />}</div>
        <div>Waiting for another player...</div>
      </div>
    );
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

      <div className="grid grid-cols-4 gap-4">
        {game.cards?.map((card: any, index: number) => (
          <div
            key={index}
            id={card.id}
            className="w-20 h-30 rounded-md"
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
