import type { ReactNode } from "react";

interface BackgroundProps {
  animateBackground: boolean;
  children: ReactNode;
}

export function Background({ animateBackground, children }: BackgroundProps) {
  return (
    <>
      <div className={`bg ${animateBackground ? "" : "pause-scroll"}`}></div>
      <div
        className={`bg bg2 ${animateBackground ? "" : "pause-scroll"}`}
      ></div>
      <div
        className={`bg-cover ${
          !animateBackground
            ? "h-dvh w-dvh sm:w-auto sm:h-auto sm:rounded-3xl"
            : "rounded-3xl"
        } backdrop-blur-md bg-white/35 shadow-xl ring-1 ring-black/5`}
      >
        {children}
      </div>
    </>
  );
}
