import "./App.css";
import { useEffect, useState } from "react";
import { Game } from "./components/Game/Game";
import useActionCable from "./hooks/useActionCable";
import useChannel from "./hooks/useChannel";
import ActionCableContext from "./context/actionCableContext";

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

  useEffect(() => {
    getPlayerId();
  }, []);

  const getPlayerId = async () => {
    const response = await fetch("http://192.168.86.230:3000/players/get_id", {
      credentials: "include",
    });
    const data = await response.json();
    console.log("Player ID:", data);
    setPlayerId(data.id);
  };

  return (
    <>
      <ActionCableContext.Provider value={{ subscribe, unsubscribe, send }}>
        {!isPlaying ? (
          <>
            <h1>Welcome {playerId?.toUpperCase()}</h1>

            <button
              onClick={() => {
                setIsPlaying(true);
              }}
            >
              Start Game
            </button>
          </>
        ) : (
          <Game />
        )}
      </ActionCableContext.Provider>
    </>
  );
}

export default App;
