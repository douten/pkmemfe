import { Routes, Route, BrowserRouter } from "react-router";
import { useEffect, useState } from "react";

// hooks & context
import useChannel from "./hooks/useChannel";
import useActionCable from "./hooks/useActionCable";
import GlobalContext from "./context/globalContext";

// components & styling
import "./App.css";
import { Home, Lobby, Game } from "./components/pages/index";
import type { PlayerInterface } from "./components/types";

function App() {
  // START: CONTEXT SETUP
  const { actionCable } = useActionCable("ws://192.168.86.230:3000/cable");
  const { subscribe, unsubscribe, send } = useChannel(actionCable);
  const [player, setPlayer] = useState<PlayerInterface | null>(null);
  const [getPlayerError, setGetPlayerError] = useState<string | null>(null);

  const getPlayer = async () => {
    try {
      const response = await fetch(
        "http://192.168.86.230:3000/players/get_player",
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      console.log("getPlayer - INFO: Player data fetched:", data);

      if (!response.ok) {
        setGetPlayerError("Failed to fetch player data");
        return;
      }

      setPlayer(data);
    } catch (error) {
      setGetPlayerError("Failed to load player data. Please try again.");
    }
  };

  const contextValue = { player, send, subscribe, unsubscribe };
  // END: CONTEXT SETUP

  useEffect(() => {
    if (player) return;
    getPlayer();
  }, [player]);

  if (player?.id) {
    return (
      <BrowserRouter>
        <GlobalContext.Provider value={contextValue}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/game/:id" element={<Game />} />
          </Routes>
        </GlobalContext.Provider>
      </BrowserRouter>
    );
  } else {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h3 className="text-lg mb-4">Error in Loading Player Data</h3>
        <p>{getPlayerError}</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={getPlayer}
        >
          Retry
        </button>
      </div>
    );
  }
}

export default App;
