import { motion, AnimatePresence } from "framer-motion";

export const NotificationBadge = ({ message }: { message: string }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="flex gap-2 bg-white/[0.7] py-1 px-3 rounded-xl"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{
          type: "spring",
          stiffness: 800,
          damping: 30,
        }}
      >
        <span className="text-sm text-black-text">{message}</span>
      </motion.div>
    </AnimatePresence>
  );
};
