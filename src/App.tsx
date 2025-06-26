import "./App.css";
import { useEffect, useState } from "react";
import useActionCable from "./hooks/useActionCable";
import useChannel from "./hooks/useChannel";
import ActionCableContext from "./context/actionCableContext";

import { Lobby } from "./components/Lobby";
import { PlayerBadge } from "./components/PlayerBadge";

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

  const { actionCable } = useActionCable(`ws://192.168.86.230:3000/cable`);
  const { subscribe, unsubscribe, send } = useChannel<any>(actionCable);

  // accessible across all children components
  const contextValue = { playerId, send, setPlayerId, subscribe, unsubscribe };

  useEffect(() => {
    getPlayerId();
  }, []);

  const getPlayerId = async () => {
    const response = await fetch("http://192.168.86.230:3000/players/get_id", {
      credentials: "include",
    });
    const data = await response.json();
    setPlayerId(data.id);
  };

  return (
    <>
      <ActionCableContext.Provider value={contextValue}>
        {!isPlaying ? (
          <>
            <div className="flex flex-wrap items-center gap-4 mb-4">
              <h2 className="text-3xl">Welcome</h2>{" "}
              {playerId && <PlayerBadge playerId={playerId} />}
            </div>

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
          </>
        ) : (
          <Lobby />
        )}
      </ActionCableContext.Provider>
    </>
  );
}

export default App;
