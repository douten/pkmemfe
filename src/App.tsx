import { Routes, Route, HashRouter } from "react-router";
import { useEffect, useState } from "react";

// hooks & context
import useChannel from "./hooks/useChannel";
import useActionCable from "./hooks/useActionCable";
import GlobalContext from "./context/globalContext";
import { useToast } from "./hooks/useToast";

// components & styling
import "./App.css";
import { Home, Lobby, Game, Rules } from "./components/pages/index";
import { Button } from "./components/Button";
import { Toast } from "./components/Toast";

// typing
import type { PlayerInterface } from "./components/types";

function App() {
  // START: CONTEXT SETUP
  const { actionCable } = useActionCable(import.meta.env.VITE_ACTION_CABLE_URL);
  const { subscribe, unsubscribe, send } = useChannel(actionCable);
  const [player, setPlayer] = useState<PlayerInterface | null>(null);
  const [stopBg, setStopBg] = useState<boolean>(false);
  const [getPlayerError, setGetPlayerError] = useState<string | null>(null);
  const { toast, isVisible, showToast, hideToast } = useToast();

  const contextValue = {
    player,
    setPlayer,
    send,
    subscribe,
    unsubscribe,
    stopBg,
    setStopBg,
    showToast,
    hideToast,
  };
  // END: CONTEXT SETUP

  const getPlayer = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/players/get_player`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setGetPlayerError("Failed to fetch player data.");
        return;
      }

      setPlayer(data);
    } catch (error: unknown) {
      setGetPlayerError(error instanceof Error ? error.message : String(error));
    }
  };

  useEffect(() => {
    getPlayer();
  }, []);

  return (
    <HashRouter>
      <div className={`bg ${stopBg ? "pause-scroll" : ""}`}></div>
      <div className={`bg bg2 ${stopBg ? "pause-scroll" : ""}`}></div>
      <div
        className={`bg-cover ${
          stopBg
            ? "h-dvh w-dvh sm:w-auto sm:h-auto sm:rounded-3xl"
            : "rounded-3xl"
        } backdrop-blur-md bg-white/35 shadow-xl ring-1 ring-black/5`}
      >
        {player && (
          <GlobalContext.Provider value={contextValue}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/lobby" element={<Lobby />} />
              <Route path="/game/:id" element={<Game />} />
              <Route path="/rules" element={<Rules />} />
            </Routes>
          </GlobalContext.Provider>
        )}
        {!player && !getPlayerError && (
          <div className="flex flex-col items-center justify-center h-full m-8">
            <div className="text-black-text text-center flex items-center gap-1">
              Loading player data
              <div className="flex gap-[2px] justify-end items-center mt-[3px]">
                <span className="sr-only">Loading...</span>
                <div className="h-[5px] w-[5px] bg-black-text rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-[5px] w-[5px] bg-black-text rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-[5px] w-[5px] bg-black-text rounded-full animate-bounce"></div>
              </div>
            </div>
            {/* <Button label="Retry" onClick={getPlayer} /> */}
          </div>
        )}
        {getPlayerError && (
          <div className="flex flex-col items-center justify-center h-full p-8">
            <h3 className="text-7xl mb-4">⚠️</h3>
            <p className="text-vermilion mb-3 text-center">{getPlayerError}</p>
            <Button label="Retry" onClick={getPlayer} />
          </div>
        )}
        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            isVisible={isVisible}
            onClose={hideToast}
          />
        )}
      </div>
    </HashRouter>
  );
}

export default App;
