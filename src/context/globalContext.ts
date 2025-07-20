import { createContext } from "react";
import useChannel from "../hooks/useChannel";

import type { PlayerInterface } from "../components/types";
import type { ToastConfigInterface } from "../hooks/useToast";

interface GlobalContextType {
  player: PlayerInterface | null;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerInterface | null>>;
  stopBg: boolean;
  setStopBg: React.Dispatch<React.SetStateAction<boolean>>;
  send: ReturnType<typeof useChannel>["send"];
  subscribe: ReturnType<typeof useChannel>["subscribe"];
  unsubscribe: ReturnType<typeof useChannel>["unsubscribe"];
  showToast: (config: ToastConfigInterface) => void;
  hideToast: () => void;
}

const GlobalContext = createContext<GlobalContextType | null>(null);
export default GlobalContext;
