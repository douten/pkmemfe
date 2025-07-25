import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "warning" | "info";
  duration?: number; // in milliseconds
  onClose?: () => void;
  isVisible: boolean;
}

export const Toast = ({
  message,
  type = "info",
  duration = 3000,
  onClose,
  isVisible,
}: ToastProps) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setShow(false);
        if (onClose) {
          setTimeout(onClose, 300); // Wait for fade out animation
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const getToastColors = () => {
    switch (type) {
      default:
        return "bg-white/60 text-black-text";
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{
            scale: 0,
          }}
          animate={{
            scale: 1,
            opacity: 1,
          }}
          exit={{
            scale: 0,
            opacity: 0.3,
          }}
          transition={{
            type: "spring",
            ease: [0.25, 0.46, 0.45, 0.94],
            duration: 0.4,
          }}
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d",
          }}
          className="fixed top-0 w-full h-full z-100 flex items-center justify-center"
        >
          <div
            className={`${getToastColors()} backdrop-blur-sm bg-white/80 px-6 py-4 rounded-lg shadow-lg w-max`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-md">{message}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
