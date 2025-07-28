import { Routes, Route } from "react-router";

// components
import { Game, Home, Lobby, Rules } from "@pages/index";
import { PageContainer } from "@layout/index";
import { ErrorModal, Toast, LoadingPlayerScreen } from "@ui/index";
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
    <PageContainer>
      <GlobalProvider>
        <AppManager />
      </GlobalProvider>
    </PageContainer>
  );
}

export default AppContent;
