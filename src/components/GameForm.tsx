import type { PlayerInterface } from "./types";
import { useNavigate } from "react-router";

export const GameForm = ({ player }: { player: PlayerInterface }) => {
  const navigate = useNavigate();

  return (
    <>
      {player.game_id ? (
        <div className="flex flex-col items-center justify-center gap-4 p-4">
          <div>You were in game {player.game_id} </div>
          <button
            onClick={() => {
              // go to game url
            }}
          >
            Continue Game
          </button>
          <button
            onClick={() => {
              // concede game logic
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
