import { Routes, Route, HashRouter } from "react-router";
import { useEffect, useState } from "react";

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

  const contextValue = { player, setPlayer, send, subscribe, unsubscribe };
  // END: CONTEXT SETUP

  return (
    <HashRouter>
      <GlobalContext.Provider value={contextValue}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/game/:id" element={<Game />} />
        </Routes>
      </GlobalContext.Provider>
    </HashRouter>
  );
}

export default App;
