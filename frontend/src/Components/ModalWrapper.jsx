// src/components/ModalWrapper.jsx
import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ModalWrapper({ isOpen, onClose, children }) {
  
  // Close modal with Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    } else {
      window.removeEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // click outside closes
          aria-hidden="true" // For screen readers
        >
          <motion.div
            className="rounded-xl flex justify-center items-center shadow-xl p-4 max-w-md w-full mx-4 relative glass-bg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            onClick={(e) => e.stopPropagation()} // stop click bubbling
            aria-modal="true" // indicates modal is active
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
