import React from 'react';

const SpotifyAttribution = () => {
    return (
        <div className="w-full flex justify-center">
            <div className="flex items-center gap-2 px-6 py-1 bg-black shadow-sm w-full justify-center">
                <p className="text-sm text-white/80 font-medium tracking-wide">
                    Content powered by
                    {/*  <span className="text-[#1DB954] font-semibold">Spotify</span> */}
                </p>

                <div className="flex-1">
                    <img
                        src="/2024-spotify-full-logo/Full_Logo_White_CMYK.svg"
                        alt="Spotify"
                        className="w-24 object-contain"
                    />
                </div>
                <div className='flex justify-center host-grotesk items-center text-2xl'>
                    <img src="/in.svg" alt="logo" className='w-9 h-9' />
                    <p className='text-white'>GrooveEstrella</p>
                </div>
            </div>
        </div>
    );
};

export default SpotifyAttribution;