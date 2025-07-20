// filepath: /Users/minh/code/pkmemfe/src/hooks/useToast.ts
import { useState, useCallback } from "react";

interface ToastConfig {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showToast = useCallback(
    ({ message, type = "info", duration = 3000 }: ToastConfig) => {
      setToast({ message, type, duration });
      setIsVisible(true);
    },
    []
  );

  const hideToast = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setToast(null), 300);
  }, []);

  return {
    toast,
    isVisible,
    showToast,
    hideToast,
  };
};
