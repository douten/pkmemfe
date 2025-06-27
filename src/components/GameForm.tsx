import type { PlayerInterface } from "./types";
import { useNavigate } from "react-router";

export const GameForm = ({ player }: { player: PlayerInterface }) => {
  const navigate = useNavigate();

  const concedeGame = async () => {
    if (!player.game_id) return;

    const response = await fetch(
      `http://192.168.86.230:3000/games/${player.game_id}/concede`,
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
    <>
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
        <button
          onClick={() => {
            navigate("/lobby");
          }}
        >
          Start Game
        </button>
      )}
    </>
  );
};
