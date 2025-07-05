import { useContext } from "react";
import { PlayerBadge } from "../../components/PlayerBadge";
import GlobalContext from "../../context/globalContext";
import { GameForm } from "../GameForm";

export const Home = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("ActionCableContext is not available");
  }
  const { player } = context;

  return (
    <div className="flex flex-col flex-wrap items-center justify-around h-full">
      {player && (
        <>
          <h1 className="font-black text-vermilion italic text-[44px] caveat-title text-teal-800">
            PKmem
          </h1>
          <div>
            <GameForm player={player} />
          </div>
        </>
      )}
    </div>
  );
};
