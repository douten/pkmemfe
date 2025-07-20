import { createContext } from "react";
import useChannel from "../hooks/useChannel";

import type { PlayerInterface } from "../components/types";
import type { ToastConfigInterface } from "../hooks/useToast";

interface GlobalContextType {
  player: PlayerInterface | null;
  // ActionCable channel functions
  send: ReturnType<typeof useChannel>["send"];
  subscribe: ReturnType<typeof useChannel>["subscribe"];
  unsubscribe: ReturnType<typeof useChannel>["unsubscribe"];
  // Global Toast functions
  showToast: (config: ToastConfigInterface) => void;
  hideToast: () => void;
}

const GlobalContext = createContext<GlobalContextType | null>(null);
export default GlobalContext;
