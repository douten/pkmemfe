import type { ReactNode } from "react";
import { useLocation } from "react-router";

interface BackgroundProps {
  children: ReactNode;
}

export function Background({ children }: BackgroundProps) {
  const location = useLocation();
  const showHomeCard = !location.pathname.startsWith("/game/");

  return (
    <>
      <div
        className={`sm:my-4 ${
          !showHomeCard
            ? "min-h-dvh sm:min-h-auto sm:h-full w-full sm:w-auto sm:h-auto sm:rounded-3xl"
            : "rounded-3xl"
        } bg-white/35 backdrop-blur-[3px] shadow-xl ring-1 ring-black/5`}
      >
        {children}
      </div>
    </>
  );
}
