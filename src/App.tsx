import { HashRouter } from "react-router";

// components
import AppContent from "@c/AppContent";

// styling
import "./App.css";

function App() {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
}

export default App;
