import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router";

// hooks & context
import useChannel from "../hooks/useChannel";
import useActionCable from "../hooks/useActionCable";
import GlobalContext from "../context/globalContext";
import { useToast } from "../hooks/useToast";

// components & styling
import { Background, Game, Home, Lobby, Rules } from "./pages/index";
import { ErrorModal, Toast, LoadingPlayerScreen } from "./index";

// typing
import type { PlayerInterface } from "./types";

function AppContent() {
  const location = useLocation();
  const animateBackground = !location.pathname.startsWith("/game/");

  // START: CONTEXT SETUP
  const { actionCable } = useActionCable(import.meta.env.VITE_ACTION_CABLE_URL);
  const { subscribe, unsubscribe, send } = useChannel(actionCable);
  const [player, setPlayer] = useState<PlayerInterface | null>(null);
  const [getPlayerError, setGetPlayerError] = useState<string | null>(null);
  const { toast, isVisible, showToast, hideToast } = useToast();

  const contextValue = {
    player,
    send,
    subscribe,
    unsubscribe,
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
    <Background animateBackground={animateBackground}>
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
      {!player && !getPlayerError && <LoadingPlayerScreen />}
      {getPlayerError && (
        <ErrorModal error={getPlayerError} onClick={getPlayer} />
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
    </Background>
  );
}

export default AppContent;
