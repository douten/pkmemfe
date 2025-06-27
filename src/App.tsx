import "./App.css";
import useChannel from "./hooks/useChannel";
import useActionCable from "./hooks/useActionCable";
import GlobalContext from "./context/globalContext";
import { Routes, Route, BrowserRouter } from "react-router";
import { useState } from "react";

import { Home, Lobby } from "./components/pages/index";
import type { GameInterface, PlayerInterface } from "./components/types";

function App() {
  // START: CONTEXT SETUP
  const { actionCable } = useActionCable("ws://192.168.86.230:3000/cable");
  const { subscribe, unsubscribe, send } = useChannel(actionCable);
  const [player, setPlayer] = useState<PlayerInterface | null>(null);

  const getPlayer = async () => {
    const response = await fetch(
      "http://192.168.86.230:3000/players/get_player",
      {
        credentials: "include",
      }
    );
    const data = await response.json();
    console.log({ data });

    setPlayer(data);
  };

  const contextValue = { player, getPlayer, send, subscribe, unsubscribe };
  // END: CONTEXT SETUP

  return (
    <BrowserRouter>
      <GlobalContext.Provider value={contextValue}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobby" element={<Lobby />} />
          {/* <Route path="/game/:id" element={<Game />} /> */}
        </Routes>
      </GlobalContext.Provider>
    </BrowserRouter>
  );
}

export default App;
