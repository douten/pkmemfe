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

  duration = duration + 300; // Add extra time for animation

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

  const handleClose = () => {
    setShow(false);
    if (onClose) {
      setTimeout(onClose, 300);
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{
            y: -30,
            opacity: 0.2,
            scale: 0.5,
          }}
          animate={{
            y: 10,
            opacity: 1,
            scale: 1,
          }}
          exit={{
            y: 0,
            opacity: 0,
            scale: 0.5,
          }}
          transition={{
            type: "spring",
            ease: [0.25, 0.46, 0.45, 0.94],
            duration: 0.3,
          }}
          style={{
            perspective: "1200px",
            transformStyle: "preserve-3d",
          }}
          className="fixed top-0 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div
            className={`${getToastColors()} backdrop-blur-sm ps-3 pe-6 py-2 rounded-lg shadow-lg w-max`}
          >
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleClose}
                className="text-current hover:opacity-75 transition-opacity"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <span className="text-sm font-medium">{message}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
