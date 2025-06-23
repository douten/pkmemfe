import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import "./App.css";

import useActionCable from "./hooks/useActionCable";
import useChannel from "./hooks/useChannel";

// const ws = new WebSocket("ws://192.168.86.230:3000/cable");

interface Message {
  body: string;
  id: number;
  created_at: string;
  updated_at: string;
  guid?: string;
}

function App() {
  const [game, setGame] = useState<any>(null);
  const [cards, setCards] = useState<any[]>([]);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [opponentId, setOpponentId] = useState<string | null>(null);

  const { actionCable } = useActionCable(`ws://192.168.86.230:3000/cable`);
  const { subscribe, unsubscribe, send } = useChannel<any>(actionCable);

  useEffect(() => {
    if (!playerId) return;
    subscribe(
      { channel: "GamesChannel" },
      {
        received: (data) => {
          console.log("Received data:", data);
          setGame(data.game);
          setCards([...data.cards]);
          setOpponentId(data.opponent || null);
        },
        connected: () => {
          send("get_game", {});
        },
      }
    );

    return () => {
      unsubscribe();
    };
  }, [playerId]);

  useEffect(() => {
    getPlayerId();
  }, []);

  const getPlayerId = async () => {
    const response = await fetch("http://192.168.86.230:3000/players/get_id", {
      credentials: "include",
    });
    const data = await response.json();
    console.log("Player ID:", data);
    setPlayerId(data.id);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const message = formData.get("message") as string;
    if (!message) return;

    form.reset();

    send("receive", { body: message, playerId });
  };

  const flipCard = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.currentTarget.dataset.flipped === "true") return;
    send("flip_card", {
      game_card_id: e.currentTarget.id,
      player_id: playerId,
    });
  };

  return (
    <>
      <div className="App">
        <div>you: {playerId}</div>
        {opponentId && <div>opponent: {opponentId}</div>}
        <div>game id: {game?.id}</div>
        <div>game state: {game?.state}</div>
        <h3>Cards</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {cards?.map((card: any, index) => (
            <div
              key={index}
              id={card.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "5px",
                padding: "10px",
                width: "50px",
                height: "75px",
                backgroundColor: card.flipped ? "#686868" : "#fff",
              }}
              data-flipped={card.flipped}
              onClick={flipCard}
            >
              {card.card?.number && (
                <div style={{ fontWeight: "bold" }}>{card.card.number}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
