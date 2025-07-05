import type { PlayerInterface } from "./types";
import { useNavigate } from "react-router";

import { Button } from "./Button";

export const GameForm = ({ player }: { player: PlayerInterface }) => {
  const navigate = useNavigate();

  const concedeGame = async () => {
    if (!player.game_id) return;

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/games/${player.game_id}/concede`,
      {
        method: "POST",
        credentials: "include",
      }
    );
    const data = await response.json();
    if (data.status === "success") {
      navigate("/");
    }
  };

  return (
    <div className="grow w-full">
      {player.game_id ? (
        <div className="flex flex-col items-center justify-center gap-4 p-4">
          <div>You were in game {player.game_id} </div>
          <button
            onClick={() => {
              navigate(`/game/${player.game_id}`);
            }}
          >
            Continue Game
          </button>
          <button
            onClick={() => {
              concedeGame();
            }}
          >
            Concede Game
          </button>
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center gap-1">
          <Button label="Start Game" onClick={() => navigate("/lobby")} />
          <Button label="Stats" onClick={() => {}} />
          <Button label="Rules" onClick={() => {}} />
        </div>
      )}
    </div>
  );
};
