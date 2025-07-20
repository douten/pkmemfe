import { useLocation } from "react-router";
import { Routes, Route } from "react-router";

// components
import { Background, Game, Home, Lobby, Rules } from "./pages/index";
import { ErrorModal, Toast, LoadingPlayerScreen } from "./index";
import GlobalProvider from "./GlobalProvider";

// hooks
import { useGlobalContext } from "../hooks/useGlobalContext";

function AppRoutes() {
  const { player, getPlayerError, getPlayer, toast, isVisible, hideToast } =
    useGlobalContext();

  return (
    <>
      {player && (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/game/:id" element={<Game />} />
          <Route path="/rules" element={<Rules />} />
        </Routes>
      )}
      {!player && !getPlayerError && <LoadingPlayerScreen />}
      {getPlayerError && (
        <ErrorModal error={getPlayerError} onClick={getPlayer} />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          isVisible={isVisible}
          onClose={hideToast}
        />
      )}
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const animateBackground = !location.pathname.startsWith("/game/");

  return (
    <Background animateBackground={animateBackground}>
      <GlobalProvider>
        <AppRoutes />
      </GlobalProvider>
    </Background>
  );
}

export default AppContent;
