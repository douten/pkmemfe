import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className="bg"></div>
    <div className="bg bg2"></div>
    <div className="py-[20px] px-[25px] bg-cover rounded-3xl backdrop-blur-md bg-white/25 shadow-xl ring-1 ring-black/5">
      <App />
    </div>
  </StrictMode>
);
