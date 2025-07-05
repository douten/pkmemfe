import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import GlobalContext from "../../context/globalContext";
import { PlayerBadge } from "../PlayerBadge";

export const Lobby = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("ActionCableContext is not available");
  }
  const { subscribe, unsubscribe, send, player, setStopBg } = context;

  const [activePlayersCount, setActivePlayersCount] = useState<number>(0);
  const [opponentId, setOpponentId] = useState<string | null>(null);

  const navigate = useNavigate();
  const playerId = player?.id;

  useEffect(() => {
    if (player?.game_id) {
      navigate(`/game/${player.game_id}`);
    }
  }, [player?.game_id]);

  useEffect(() => {
    subscribe(
      { channel: "LobbyChannel" },
      {
        received: ({ lobby_channel: channel }) => {
          if (channel.opponent_id) {
            setOpponentId(channel.opponent_id);
          }

          if (channel.game_id) {
            setStopBg(true); // stop background animation
            // delay 1.5s before starting game
            setTimeout(() => {
              navigate(`/game/${channel.game_id}`);
            }, 2500);
          }

          if (channel.active_players_count) {
            setActivePlayersCount(channel.active_players_count);
          }
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
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <div>{playerId && <PlayerBadge playerId={playerId} />}</div>
      {!opponentId && (
        <>
          <div>finding opponent...</div>
        </>
      )}

      {opponentId && (
        <div className="flex flex-col items-center justify-center gap-4">
          <div>Opponent found, creating game..</div>
          <div>{opponentId && <PlayerBadge playerId={opponentId} />}</div>
        </div>
      )}
    </div>
  );
};
