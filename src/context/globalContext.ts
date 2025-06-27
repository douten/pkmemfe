import { createContext } from "react";
import useChannel from "../hooks/useChannel";

interface GlobalContextType {
  playerId: string | null;
  getPlayerId: () => Promise<void>;
  send: ReturnType<typeof useChannel>["send"];
  subscribe: ReturnType<typeof useChannel>["subscribe"];
  unsubscribe: ReturnType<typeof useChannel>["unsubscribe"];
}

const GlobalContext = createContext<GlobalContextType | null>(null);
export default GlobalContext;
