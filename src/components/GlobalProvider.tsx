import { useState, useEffect } from "react";
import type { ReactNode } from "react";

// hooks & context
import useChannel from "../hooks/useChannel";
import useActionCable from "../hooks/useActionCable";
import GlobalContext from "../context/globalContext";
import { useToast } from "../hooks/useToast";

// types
import type { PlayerInterface } from "../types/types";

interface GlobalProviderProps {
  children: ReactNode;
}

function GlobalProvider({ children }: GlobalProviderProps) {
  // STATE & HOOKS
  const { actionCable } = useActionCable(import.meta.env.VITE_ACTION_CABLE_URL);
  const { subscribe, unsubscribe, send } = useChannel(actionCable);
  const [player, setPlayer] = useState<PlayerInterface | null>(null);
  const [getPlayerError, setGetPlayerError] = useState<string | null>(null);
  const { toast, isToastVisible, showToast, hideToast } = useToast();

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
      setGetPlayerError(null);
    } catch (error: unknown) {
      setGetPlayerError(error instanceof Error ? error.message : String(error));
    }
  };

  useEffect(() => {
    getPlayer();
  }, []);

  const contextValue = {
    player,
    getPlayerError,
    getPlayer,
    send,
    subscribe,
    unsubscribe,
    showToast,
    hideToast,
    toast,
    isToastVisible,
  };

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
}

export default GlobalProvider;
