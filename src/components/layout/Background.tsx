import type { ReactNode } from "react";
import { useLocation } from "react-router";

interface BackgroundProps {
  children: ReactNode;
}

export function Background({ children }: BackgroundProps) {
  const location = useLocation();
  const animateBackground = !location.pathname.startsWith("/game/");

  return (
    <>
      <div className={`bg ${animateBackground ? "" : "pause-scroll"}`}></div>
      <div
        className={`bg bg2 ${animateBackground ? "" : "pause-scroll"}`}
      ></div>
      <div
        className={`bg-cover ${
          !animateBackground
            ? "h-full w-full sm:w-auto sm:h-auto sm:rounded-3xl"
            : "rounded-3xl"
        } backdrop-blur-md bg-white/35 shadow-xl ring-1 ring-black/5 flex items-center justify-center`}
      >
        {children}
      </div>
    </>
  );
}
