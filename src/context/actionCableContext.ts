import { createContext } from "react";
import useChannel from "../hooks/useChannel";

interface ActionCableContextType {
  subscribe: ReturnType<typeof useChannel>["subscribe"];
  unsubscribe: ReturnType<typeof useChannel>["unsubscribe"];
  send: ReturnType<typeof useChannel>["send"];
}

const ActionCableContext = createContext<ActionCableContextType | null>(null);
export default ActionCableContext;
