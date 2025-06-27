import { useContext, useEffect, useState } from "react";
import GlobalContext from "../../context/globalContext";

import { PlayerBadge } from "../PlayerBadge";
import { Game } from "../Game";

export const Lobby = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("ActionCableContext is not available");
  }

  const { subscribe, unsubscribe, send, player } = context;
  const [activePlayersCount, setActivePlayersCount] = useState<number>(0);
  const [gameId, setGameId] = useState<string | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [opponentId, setOpponentId] = useState<string | null>(null);

  const playerId = player?.id;

  useEffect(() => {
    if (!playerId) return;

    subscribe(
      { channel: "LobbyChannel" },
      {
        received: ({ lobby_channel: channel }) => {
          if (channel.opponent_id) {
            setOpponentId(channel.opponent_id);
          }

          if (channel.game_id) {
            // delay 1.5s before setting gameId
            setTimeout(() => {
              send("join_game", {
                game_id: channel.game_id,
              });
              setGameId(channel.game_id);
            }, 1500);
          }

          if (channel.is_playing) {
            setIsPlaying(channel.is_playing);
          }

          if (channel.active_players_count) {
            setActivePlayersCount(channel.active_players_count);
          }
        },
        connected: () => {
          send("get_lobby_stats", {});
        },
        disconnected: () => {
          console.log("LobbyChannel disconnected", { gameId });
          if (gameId) {
            setIsPlaying(true);
          }
        },
      }
    );

    return () => {
      unsubscribe();
    };
  }, [playerId]);

  // Match Making Phase

  return gameId && isPlaying ? (
    <Game gameId={gameId} />
  ) : (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <div>{playerId && <PlayerBadge playerId={playerId} />}</div>
      {!opponentId && (
        <>
          <div>Matching...</div>
          <div className="flex flex-row gap-1 items-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            {/* player count badge */}
            <span className="text-sm text-gray-500">
              {activePlayersCount}{" "}
              {activePlayersCount === 1 ? "player" : "players"}
            </span>
          </div>
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
