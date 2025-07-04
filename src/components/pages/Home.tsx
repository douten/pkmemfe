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
    <div>
      <div className=" w-70 aspect-[63/88] bg-[url(/swirl-bg.jpg)] bg-cover rounded-3xl backdrop-blur-sm bg-white/30 shadow-xl ring-1 ring-black/5">
        <div className="flex flex-col flex-wrap items-center justify-around h-full">
          {player && (
            <>
              <h1 className="font-black text-white italic text-5xl caveat-title text-teal-800">
                PKmem
              </h1>
              <div>
                <GameForm player={player} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
