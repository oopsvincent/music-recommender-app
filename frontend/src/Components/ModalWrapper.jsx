// src/components/ModalWrapper.jsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModalWrapper({ isOpen, onClose, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // click outside closes
        >
          <motion.div
            className="bg-black rounded-xl flex justify-center items-center shadow-xl p-4 max-w-md w-full mx-4 relative"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()} // stop click bubbling
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
