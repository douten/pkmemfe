import { useContext, useEffect, useState } from "react";
import ActionCableContext from "../context/actionCableContext";

import { PlayerBadge } from "./PlayerBadge";

export const Game = () => {
  const actionCableContext = useContext(ActionCableContext);
  if (!actionCableContext) {
    throw new Error("ActionCableContext is not available");
  }

  const { subscribe, unsubscribe, send } = actionCableContext;
  const [game, setGame] = useState<any>(null);

  useEffect(() => {
    subscribe(
      { channel: "GamesChannel" },
      {
        received: (data) => {
          console.log("Received data:", data);
          setGame({ ...data.game });
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
    // if (e.currentTarget.dataset.flipped === "true") return;
    // send("flip_card", {
    //   game_card_id: e.currentTarget.id,
    //   player_id: playerId,
    // });
  };

  // Match Making Phase
  if (!game) {
    return <div>No players available</div>;
  }

  if (game.players.length === 1) {
    return (
      <div>
        <div>{game.players[0].guestId}</div>
        <div>Waiting for another player...</div>
      </div>
    );
  }

  // Live Game
  return (
    <div>
      <PlayerBadge playerId={game.players[0]} />
      <div className="grid grid-cols-4 gap-4">
        {game.cards?.map((card: any, index: number) => (
          <div
            key={index}
            id={card}
            className="w-20 h-30 rounded-md"
            style={{
              backgroundColor: card.flipped ? "#686868" : "#fff",
            }}
            data-flipped={card.flipped}
            onClick={flipCard}
          >
            {card.card?.number && (
              <div style={{ fontWeight: "bold" }}>{card.card.number}</div>
            )}
          </div>
        ))}
      </div>
      <PlayerBadge playerId={game.players[1]} />
    </div>
  );
};
