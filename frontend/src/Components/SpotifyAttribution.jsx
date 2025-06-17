// Attribution.jsx
import React from "react";

const Attribution = () => {
    return (
        <div className="z-50 w-full flex items-center justify-between px-4 py-2 bg-gradient-to-r from-black/90 via-gray-900/80 to-black/90 backdrop-blur-md border-b border-white/10 shadow-md">
            <div className="flex items-center">
                <img
                    src="/in.svg"
                    alt="GrooveEstrella Logo"
                    className="w-8 h-8 object-contain rounded-full shadow"
                />
                <span className="text-white text-lg md:text-xl font-bold host-grotesk">
                    GrooveEstrella
                </span>
            </div>
            {/* <span className="text-xs text-white/50 font-medium tracking-widest hidden sm:block">
                Powered by Spotify
            </span> */}
        </div>
    );
};

export default Attribution;