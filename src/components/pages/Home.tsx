import { useContext, useEffect } from "react";
import GlobalContext from "../../context/globalContext";
import { GameForm } from "../GameForm";

export const Home = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("ActionCableContext is not available");
  }

  const { player, setStopBg } = context;

  useEffect(() => {
    setStopBg(false); // Ensure background animation is running on home page
  }, []);

  return (
    <div className="flex flex-col w-[240px] aspect-[63/88] flex-wrap items-center h-full p-[10px]">
      <>
        <div className="flex flex-col items-center justify-center aspect-[20/14] box-border bg-white/25 w-full ring-black/5 ring rounded-xl inset-shadow-md">
          <h1 className="font-black text-vermilion italic text-[38px] caveat-title text-teal-800">
            PKmem
          </h1>
        </div>
        {player && <GameForm player={player} />}
      </>
    </div>
  );
};
