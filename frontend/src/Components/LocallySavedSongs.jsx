// LocallySavedSongs.jsx
import React from 'react';
import { TrackCard } from './CardComponents/TracksCard';

const LocallySavedSongs = ({ localSaved }) => {
    return (
        <div className="bg-white/5 p-2 rounded-xl border border-white/10 shadow-md">
            <h3 className="text-xl font-semibold mb-8 mt-3 pl-3">Saved Locally</h3>
            <div className="flex flex-row flex-wrap justify-center gap-5">
                {
                    Array.isArray(localSaved) && localSaved.length === 0 ? (
                        <h1 className='text-2xl font-medium my-6'>No Locally saved Songs</h1>
                    ) : (
                        localSaved?.map((track, index) => (
                            <TrackCard
                                key={index}
                                url={track.image}
                                title={track.title}
                                artist={track.artist}
                                spoURL={track.spoURL}
                                YTURL={track.YTURL}
                                trackURI={track.trackURI}
                                popularity={track.popularity}
                                explicit={track.explicit}
                            />
                        ))
                    )
                }
            </div>
        </div>
    );
};

export default LocallySavedSongs;
