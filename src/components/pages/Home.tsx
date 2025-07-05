import { useContext, useEffect, useState } from "react";
import GlobalContext from "../../context/globalContext";
import { GameForm } from "../GameForm";

export const Home = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("ActionCableContext is not available");
  }

  const { player, setPlayer, setStopBg } = context;
  const [getPlayerError, setGetPlayerError] = useState<string | null>(null);

  const getPlayer = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/players/get_player`,
        {
          credentials: "include",
        }
      );

      const data = await response.json();

      console.log("getPlayer - INFO: Player data fetched:", data);

      if (!response.ok) {
        setGetPlayerError("Failed to fetch player data");
        return;
      }

      setPlayer(data);
    } catch (error) {
      setGetPlayerError("Failed to load player data. Please try again.");
    }
  };

  useEffect(() => {
    if (player) return;
    getPlayer();
  }, [player]);

  useEffect(() => {
    setStopBg(false); // Ensure background animation is running on home page
  }, []);

  return (
    <div className="flex flex-col w-[240px] aspect-[63/88] flex-wrap items-center h-full p-[10px]">
      {player && (
        <>
          <div className="flex flex-col items-center justify-center aspect-[20/14] box-border bg-white/25 w-full ring-black/5 ring rounded-xl inset-shadow-md">
            <h1 className="font-black text-vermilion italic text-[38px] caveat-title text-teal-800">
              PKmem
            </h1>
          </div>
          <GameForm player={player} />
        </>
      )}

      {getPlayerError && (
        <div className="flex flex-col items-center justify-center h-full">
          <h3 className="text-lg mb-4">Error in Loading Player Data</h3>
          <p>{getPlayerError}</p>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={getPlayer}
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};
