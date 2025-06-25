import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Music, Check, X, AlertTriangle, Shield } from 'lucide-react';
import DataNoticeModal from '../Components/DataNoticeModal';
import ConfirmationModal from '../Components/ConfirmationModal';

// Main Settings Page
const SettingsPage = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showDataNotice, setShowDataNotice] = useState(false);
  const [dataNoticeEnabled, setDataNoticeEnabled] = useState(true);

  const handleDeleteAccount = () => {
    // Clear all data instead of localStorage.clear() since we can't use localStorage
    localStorage.clear();
    window.location.reload();
    setShowDeleteConfirm(false);
  };

  const handleClearPlaylist = () => {
    // Clear saved songs instead of localStorage operations
    localStorage.removeItem("savedSongs");
    window.location.reload();
    setShowClearConfirm(false);
  };

  const handleClearSaved = (request) => {
    localStorage.clear(request);
  }

  const handleShowDataNotice = () => {
    setShowDataNotice(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
        </motion.div>

        {/* Settings Cards */}
        <div className="space-y-4">
          {/* Privacy Notice Setting */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="text-white font-medium text-sm">Privacy Notice</h3>
                  <p className="text-gray-400 text-xs">Show data notice on startup</p>
                </div>
              </div>
              {/* <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dataNoticeEnabled}
                  onChange={(e) => setDataNoticeEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label> */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleShowDataNotice}
              className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
            >
              View Privacy Notice
            </motion.button>
            </div>
          </motion.div>

          {/* Clear Playlist */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Music className="w-5 h-5 text-purple-400" />
                <div>
                  <h3 className="text-white font-medium text-sm">Clear Saved</h3>
                  <p className="text-gray-400 text-xs">Remove all saved music</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowClearConfirm(true)}
                className="bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 border border-purple-500/30 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
              >
                Clear
              </motion.button>
            </div>
          </motion.div>

          {/* Clear Playlists */}
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.25 }}
  className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
>
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Music className="w-5 h-5 text-green-400" />
      <div>
        <h3 className="text-white font-medium text-sm">Clear Saved Playlists</h3>
        <p className="text-gray-400 text-xs">Remove all stored playlists</p>
      </div>
    </div>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        localStorage.removeItem("savedPlaylists");
        window.location.reload();
      }}
      className="bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
    >
      Clear
    </motion.button>
  </div>
</motion.div>

{/* Clear Artists */}
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.27 }}
  className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
>
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Music className="w-5 h-5 text-yellow-400" />
      <div>
        <h3 className="text-white font-medium text-sm">Clear Saved Artists</h3>
        <p className="text-gray-400 text-xs">Remove all stored artists</p>
      </div>
    </div>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        localStorage.removeItem("savedArtists");
        window.location.reload();
      }}
      className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-400 border border-yellow-500/30 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
    >
      Clear
    </motion.button>
  </div>
</motion.div>

{/* Clear Albums */}
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  transition={{ delay: 0.29 }}
  className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
>
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Music className="w-5 h-5 text-cyan-400" />
      <div>
        <h3 className="text-white font-medium text-sm">Clear Saved Albums</h3>
        <p className="text-gray-400 text-xs">Remove all stored albums</p>
      </div>
    </div>
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => {
        localStorage.removeItem("savedAlbums");
        window.location.reload();
      }}
      className="bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
    >
      Clear
    </motion.button>
  </div>
</motion.div>


          {/* Delete Account */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-red-900/20 to-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-red-800/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5 text-red-400" />
                <div>
                  <h3 className="text-white font-medium text-sm">Delete All Data</h3>
                  <p className="text-gray-400 text-xs">Remove all stored information</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-8 text-xs text-gray-500"
        >
          All data is stored locally on your device
        </motion.div>
      </div>

      {/* Modals */}
      <ConfirmationModal
        isOpen={showDeleteConfirm}
        onConfirm={handleDeleteAccount}
        onCancel={() => setShowDeleteConfirm(false)}
        title="Delete All Data"
        message="This will permanently remove all your saved music and preferences. This action cannot be undone."
        confirmText="Delete All"
        confirmColor="red"
        icon={<AlertTriangle className="w-6 h-6 text-red-400" />}
      />

      <ConfirmationModal
        isOpen={showClearConfirm}
        onConfirm={handleClearPlaylist}
        onCancel={() => setShowClearConfirm(false)}
        title="Clear Playlist"
        message="This will remove all your saved songs. Your other settings will remain unchanged."
        confirmText="Clear Playlist"
        confirmColor="blue"
        icon={<Music className="w-6 h-6 text-purple-400" />}
      />

      <DataNoticeModal
        isOpen={showDataNotice}
        onClose={() => setShowDataNotice(false)}
      />
    </div>
  );
};

export default SettingsPage;