import "./App.css";
import useChannel from "./hooks/useChannel";
import useActionCable from "./hooks/useActionCable";
import GlobalContext from "./context/globalContext";
import { Routes, Route, BrowserRouter } from "react-router";
import { useState } from "react";

import { Home } from "./components/pages/index";

function App() {
  // These are actioncable hooks that has to be called inside component
  const { actionCable } = useActionCable("ws://192.168.86.230:3000/cable");
  const { subscribe, unsubscribe, send } = useChannel<any>(actionCable);
  const [playerId, setPlayerId] = useState<string | null>(null);

  const getPlayerId = async () => {
    const response = await fetch(
      "http://192.168.86.230:3000/players/get_player",
      {
        credentials: "include",
      }
    );
    const data = await response.json();
    console.log({ data });

    setPlayerId(data.id);
  };

  const contextValue = { playerId, getPlayerId, send, subscribe, unsubscribe };

  return (
    <BrowserRouter>
      <GlobalContext.Provider value={contextValue}>
        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/lobby" element={<Lobby />} />
        <Route path="/game/:id" element={<Game />} /> */}
        </Routes>
      </GlobalContext.Provider>
    </BrowserRouter>
  );
}

export default App;
