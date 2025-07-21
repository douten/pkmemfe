import { Routes, Route } from "react-router";

// components
import { Game, Home, Lobby, Rules } from "@pages/index";
import { Background } from "@layout/Background";
import { ErrorModal, Toast, LoadingPlayerScreen } from "./index";
import GlobalProvider from "./GlobalProvider";

// hooks
import { useGlobalContext } from "@hooks/useGlobalContext";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/lobby" element={<Lobby />} />
      <Route path="/game/:id" element={<Game />} />
      <Route path="/rules" element={<Rules />} />
    </Routes>
  );
}

function AppManager() {
  const {
    player,
    getPlayerError,
    getPlayer,
    toast,
    isToastVisible,
    hideToast,
  } = useGlobalContext();

  return (
    <>
      {!player && !getPlayerError && <LoadingPlayerScreen />}
      {player && <AppRoutes />}
      {getPlayerError && (
        <ErrorModal error={getPlayerError} onClick={getPlayer} />
      )}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          isVisible={isToastVisible}
          onClose={hideToast}
        />
      )}
    </>
  );
}

function AppContent() {
  return (
    <Background>
      <GlobalProvider>
        <AppManager />
      </GlobalProvider>
    </Background>
  );
}

export default AppContent;
