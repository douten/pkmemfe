import { Routes, Route, HashRouter } from "react-router";
import { useState } from "react";

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
  const { actionCable } = useActionCable(import.meta.env.VITE_ACTION_CABLE_URL);
  const { subscribe, unsubscribe, send } = useChannel(actionCable);
  const [player, setPlayer] = useState<PlayerInterface | null>(null);
  const [stopBg, setStopBg] = useState<boolean>(false);

  const contextValue = {
    player,
    setPlayer,
    send,
    subscribe,
    unsubscribe,
    stopBg,
    setStopBg,
  };
  // END: CONTEXT SETUP

  return (
    <HashRouter>
      <div className={`bg ${stopBg ? "pause-scroll" : ""}`}></div>
      <div className={`bg bg2 ${stopBg ? "pause-scroll" : ""}`}></div>
      <div className="py-[20px] px-[25px] bg-cover rounded-3xl backdrop-blur-md bg-white/25 shadow-xl ring-1 ring-black/5">
        <GlobalContext.Provider value={contextValue}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lobby" element={<Lobby />} />
            <Route path="/game/:id" element={<Game />} />
          </Routes>
        </GlobalContext.Provider>
      </div>
    </HashRouter>
  );
}

export default App;
