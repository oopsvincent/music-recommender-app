// DataNoticeModal.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DataNoticeModal = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const acknowledged = localStorage.getItem("dataNoticeAcknowledged");
    if (!acknowledged) {
      setOpen(true);
    }
  }, []);

  const handleAcknowledge = () => {
    localStorage.setItem("dataNoticeAcknowledged", "true");
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4"
        >
          <motion.div
            initial={{ scale: 0.75 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.75 }}
            transition={{ duration: 0.25 }}
            className="max-w-md w-full bg-white rounded-2xl shadow-xl p-6 space-y-4"
          >
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                This app stores your <strong>saved music</strong> and{" "}
                <strong>preferences</strong> locally in your browser. This
                ensures your data stays available across visits.
              </p>
              <p>No information leaves your device; nothing is sent to external servers.</p>
              <p>You can clear this data anytime in the app settings.</p>
            </div>

            <footer>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleAcknowledge}
                className="w-full bg-[#D40000] mt-5 rounded-md text-white py-2 font-semibold transition"
              >
                Got it
              </motion.button>
            </footer>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DataNoticeModal;
