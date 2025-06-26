import "./App.css";
import { useEffect, useState } from "react";
import useActionCable from "./hooks/useActionCable";
import useChannel from "./hooks/useChannel";
import ActionCableContext from "./context/actionCableContext";

import { Lobby } from "./components/Lobby";
import { PlayerBadge } from "./components/PlayerBadge";
import { Game } from "./components/Game";

// const ws = new WebSocket("ws://192.168.86.230:3000/cable");

interface Message {
  body: string;
  id: number;
  created_at: string;
  updated_at: string;
  guid?: string;
}

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [inGameId, setInGameId] = useState<string | null>(null);

  const { actionCable } = useActionCable(`ws://192.168.86.230:3000/cable`);
  const { subscribe, unsubscribe, send } = useChannel<any>(actionCable);

  // accessible across all children components
  const contextValue = { playerId, send, setPlayerId, subscribe, unsubscribe };

  useEffect(() => {
    getPlayerId();
  }, []);

  const getPlayerId = async () => {
    const response = await fetch(
      "http://192.168.86.230:3000/players/get_player",
      {
        credentials: "include",
      }
    );
    const data = await response.json();
    setPlayerId(data.id);

    if (data.game_id) {
      setInGameId(data.game_id);
    }
  };

  const concedeGame = async () => {
    if (!playerId) {
      alert("No player ID found. Please try again.");
      getPlayerId();
      return;
    }
    if (!inGameId) {
      alert("No game ID found. Please try again.");
      return;
    }
    const response = await fetch(
      `http://192.168.86.230:3000/games/${inGameId}/concede`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (data.status === "success") {
      setInGameId(null);
      setIsPlaying(false);
    }
  };

  return (
    <>
      <ActionCableContext.Provider value={contextValue}>
        {!isPlaying && (
          <>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h2 className="text-3xl">Welcome</h2>{" "}
              {playerId && <PlayerBadge playerId={playerId} />}
            </div>

            {inGameId ? (
              <div className="flex flex-col items-center justify-center gap-4 p-4">
                <div>You were in game {inGameId} </div>
                <button
                  onClick={() => {
                    setIsPlaying(true);
                  }}
                >
                  Continue Game
                </button>
                <button
                  onClick={() => {
                    concedeGame();
                  }}
                >
                  Concede Game
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  if (!playerId) {
                    alert("No player ID found. Please try again.");
                    getPlayerId();
                    return;
                  }
                  setIsPlaying(true);
                }}
              >
                Start Game
              </button>
            )}
          </>
        )}

        {isPlaying && !inGameId && <Lobby />}

        {isPlaying && inGameId && <Game gameId={inGameId} />}
      </ActionCableContext.Provider>
    </>
  );
}

export default App;
