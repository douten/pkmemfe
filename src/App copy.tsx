import "./App.css";
import { useEffect, useState } from "react";

import GlobalContext from "./context/globalContext";

import { Lobby } from "./components/pages/Lobby";
import { PlayerBadge } from "./components/PlayerBadge";
import { Game } from "./components/pages/Game";

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
  const [inGameId, setInGameId] = useState<string | null>(null);

  // accessible across all children components

  useEffect(() => {
    getPlayerId();
  }, []);

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
      <GlobalContext.Provider value={contextValue}>
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
      </GlobalContext.Provider>
    </>
  );
}

export default App;
