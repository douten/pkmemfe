import { createContext } from "react";
import useChannel from "../hooks/useChannel";

import type { PlayerInterface } from "../components/types";

interface GlobalContextType {
  player: PlayerInterface | null;
  setPlayer: React.Dispatch<React.SetStateAction<PlayerInterface | null>>;
  send: ReturnType<typeof useChannel>["send"];
  subscribe: ReturnType<typeof useChannel>["subscribe"];
  unsubscribe: ReturnType<typeof useChannel>["unsubscribe"];
}

const GlobalContext = createContext<GlobalContextType | null>(null);
export default GlobalContext;
