import type { PlayerInterface } from "@components/types";
import { useNavigate } from "react-router";

import { Button } from "@ui/Button";

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
      window.location.reload();
    }
  };

  return (
    <div className="grow w-full">
      {player.game_id ? (
        <div className="flex flex-col items-center justify-center gap-4 p-4">
          <div>You were in game {player.game_id} </div>
          <Button
            label="Continue Game"
            onClick={() => navigate(`/game/${player.game_id}`)}
          />
          <Button label="Concede Game" onClick={concedeGame} />
        </div>
      ) : (
        <div className="h-full flex flex-col items-center justify-center gap-1 p-6">
          <Button label="Play" onClick={() => navigate("/lobby")} />
          <Button label="Rules" onClick={() => navigate("/rules")} />
        </div>
      )}
    </div>
  );
};
