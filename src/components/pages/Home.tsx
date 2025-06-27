import { useEffect, useContext } from "react";
import { PlayerBadge } from "../../components/PlayerBadge";
import GlobalContext from "../../context/globalContext";
import { GameForm } from "../GameForm";

export const Home = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("ActionCableContext is not available");
  }
  const { player, getPlayer } = context;

  useEffect(() => {
    if (!player) {
      getPlayer();
    }
  }, [player, getPlayer]);

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      {player ? (
        <>
          <h2 className="text-xl">Player</h2>
          <PlayerBadge playerId={player.id} />
          <GameForm player={player} />
        </>
      ) : (
        <>
          <h2 className="text-xl">unable to load player data</h2>
          <button
            onClick={() => {
              getPlayer();
            }}
          >
            Retry
          </button>
        </>
      )}
    </div>
  );
};
