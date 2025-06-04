// src/components/SearchPagination.jsx
import React from "react";
import { motion } from "framer-motion";

const SearchPagination = ({ prevUrl, nextUrl, handlePageChange }) => {
  if (!prevUrl && !nextUrl) return null; // No pagination required

  return (
    <div className="pagination-wrapper flex flex-col items-center gap-3 mt-6">
      <div className="flex items-center gap-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          className="text-black bg-white rounded-lg px-4 py-2 disabled:opacity-50"
          disabled={!prevUrl}
          onClick={() => handlePageChange(prevUrl)}
        >
          ⬅ Prev
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          className="text-black bg-white rounded-lg px-4 py-2 disabled:opacity-50"
          disabled={!nextUrl}
          onClick={() => handlePageChange(nextUrl)}
        >
          Next ➡
        </motion.button>
      </div>
    </div>
  );
};

export default SearchPagination;
