import { useEffect, useContext } from "react";
import { PlayerBadge } from "../../components/PlayerBadge";
import GlobalContext from "../../context/globalContext";

export const Home = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("ActionCableContext is not available");
  }
  const { playerId, getPlayerId } = context;

  useEffect(() => {
    if (!playerId) {
      getPlayerId();
    }
  }, [playerId, getPlayerId]);

  return (
    <div className="flex flex-wrap items-center gap-4 mb-4">
      <h2 className="text-xl">Player</h2>
      {playerId && <PlayerBadge playerId={playerId} />}
    </div>
  );
};
