import type { PlayerInterface } from "./types";
import { useNavigate } from "react-router";

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
        <div className="flex flex-col items-center justify-center gap-1">
          <button
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              navigate("/lobby");
            }}
          >
            Start Game
          </button>
          <a href="">Rules</a>
        </div>
      )}
    </>
  );
};
