const AppBar = () => {
    return (
      <nav className="bg-black text-white px-6 py-4 flex justify-between items-center shadow-lg fixed bottom-0 left-0 w-dvw">
        {/* Logo */}
        {/* <div className="text-2xl font-bold tracking-wide">🎵 MusicApp</div>
   */}
        {/* Search Bar */}
        <div className="relative w-64">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 bg-gray-800 text-white rounded-full outline-none focus:ring-2 focus:ring-gray-500 transition-all"
          />
          <svg
            className="absolute right-3 top-3 w-5 h-5 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-4.35-4.35M15 10a5 5 0 11-10 0 5 5 0 0110 0z"
            />
          </svg>
        </div>
  
        {/* Navigation */}
        <div className="flex space-x-6">
          <button className="hover:text-gray-400 transition-all">Music</button>
          <button className="hover:text-gray-400 transition-all">Artists</button>
          <button className="hover:text-gray-400 transition-all">Editor's Choice</button>
        </div>
      </nav>
    );
  };
  
  export default AppBar;
  