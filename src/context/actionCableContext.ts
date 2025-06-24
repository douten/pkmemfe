import { createContext } from "react";
import useChannel from "../hooks/useChannel";

interface ActionCableContextType {
  playerId: string | null;
  send: ReturnType<typeof useChannel>["send"];
  setPlayerId: React.Dispatch<React.SetStateAction<string | null>>;
  subscribe: ReturnType<typeof useChannel>["subscribe"];
  unsubscribe: ReturnType<typeof useChannel>["unsubscribe"];
}

const ActionCableContext = createContext<ActionCableContextType | null>(null);
export default ActionCableContext;
