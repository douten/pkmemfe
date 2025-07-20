import { useContext } from "react";
import GlobalContext from "../context/globalContext";

export const useGlobalToast = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("No GlobalContext provider found.");
  }

  return {
    showToast: context.showToast,
    hideToast: context.hideToast,
  };
};
