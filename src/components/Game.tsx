import { useContext, useEffect, useState } from "react";
import ActionCableContext from "../context/actionCableContext";

import { PlayerBadge } from "./PlayerBadge";

export const Game = () => {
  const context = useContext(ActionCableContext);
  if (!context) {
    throw new Error("ActionCableContext is not available");
  }

  const { subscribe, unsubscribe, send, playerId } = context;
  const [game, setGame] = useState<any>(null);
  const [canFlip, setCanFlip] = useState(false);
  const opponentId = game?.players.filter((p: any) => p !== playerId)[0];

  useEffect(() => {
    subscribe(
      { channel: "GamesChannel" },
      {
        received: (data) => {
          console.log("Received data:", data);

          if (data.game) {
            setGame({ ...data.game });
          }

          if (data.can_flip) {
            const canFlip = data.can_flip[playerId];
            console.log("Can flip:", canFlip);
            setCanFlip(canFlip);
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
      <div className="flex items-center gap-4 mb-4 justify-center">
        <span>game{game.id}:</span>
        {playerId && <PlayerBadge playerId={playerId} />}
        <span>vs</span>
        {opponentId && <PlayerBadge playerId={opponentId} />}
      </div>
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => {
          send("concede", {});
        }}
      >
        Concede
      </button>

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
    </div>
  );
};
