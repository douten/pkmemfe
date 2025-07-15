import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import GlobalContext from "../../context/globalContext";
import { PlayerBadge } from "../PlayerBadge";
import { Button } from "../Button";

export const Lobby = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("ActionCableContext is not available");
  }
  const { subscribe, unsubscribe, send, player } = context;

  // const [activePlayersCount, setActivePlayersCount] = useState<number>(0);
  const [opponentId, setOpponentId] = useState<string | null>(null);

  const navigate = useNavigate();
  const playerId = player?.id;

  useEffect(() => {
    if (player?.game_id) {
      navigate(`/game/${player.game_id}`);
    }
  }, [player?.game_id]);

  useEffect(() => {
    if (!playerId) {
      navigate("/");
      return;
    }

    subscribe(
      { channel: "LobbyChannel", id: Date.now().toString() },
      {
        received: ({ lobby_channel: channel }) => {
          if (channel.opponent_id) {
            setOpponentId(channel.opponent_id);
          }

          if (channel.game_id) {
            navigate(`/game/${channel.game_id}`);
          }

          // if (channel.active_players_count) {
          //   setActivePlayersCount(channel.active_players_count);
          // }
        },
        connected: () => {
          send("get_lobby_stats", {});
        },
      }
    );

    return () => {
      unsubscribe();
    };
  }, [playerId]);

  return (
    <div className="flex flex-col w-[240px] py-10 gap-2 flex-wrap items-center justify-center h-full p-[10px]">
      <div className="flex flex-col items-center justify-center gap-2">
        <div>{playerId && <PlayerBadge playerId={playerId} size="lg" />}</div>
      </div>

      <hr className="h-px my-4 w-full border-0 bg-black-text/70" />

      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-black-text font-medium text-center">
          <div className="flex items-center gap-1 mb-5">
            {opponentId ? "creating game" : "finding opponent"}
            <div className="flex gap-[2px] justify-end items-center mt-[3px]">
              <span className="sr-only">Loading...</span>
              <div className="h-[5px] w-[5px] bg-black-text rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-[5px] w-[5px] bg-black-text rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-[5px] w-[5px] bg-black-text rounded-full animate-bounce"></div>
            </div>
          </div>
          <Button label="Cancel" onClick={() => navigate("/")} />
        </div>
      </div>
    </div>
  );
};
