import type { ReactNode } from "react";
import { useLocation } from "react-router";

interface PageContainerProps {
  children: ReactNode;
}

export function PageContainer({ children }: PageContainerProps) {
  const location = useLocation();
  // in game page we want the container to be full width and height
  // for mobile.
  const showFullContainer = location.pathname.startsWith("/game/");

  const fullContainerClasses =
    "min-h-dvh w-full flex items-center justify-center";
  // "desktop" classes, for container to be contained
  const desktopContainerClasses =
    "sm:min-h-auto sm:h-full sm:w-auto sm:h-auto sm:rounded-3xl";

  return (
    <>
      <div
        className={`${
          showFullContainer
            ? `${fullContainerClasses} ${desktopContainerClasses}`
            : "rounded-3xl"
        } bg-white/50 shadow-xl ring-1 ring-black/5 sm:my-4`}
      >
        {children}
      </div>
    </>
  );
}
