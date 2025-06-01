// LocallySavedSongs.jsx
import React from 'react';
import Card from '../Components/Card';

const LocallySavedSongs = ({ localSaved }) => {
    return (
        <div className="bg-white/5 p-2 rounded-xl border border-white/10 shadow-md">
            <h3 className="text-xl font-semibold mb-4 pl-3">Saved Locally</h3>
            <div className="flex flex-row flex-wrap justify-center">
                {
                    Array.isArray(localSaved) && localSaved.length === 0 ? (
                        <h1 className='text-2xl font-medium my-6'>No Locally saved Songs</h1>
                    ) : (
                        localSaved?.map((track, index) => (
                            <Card
                                key={index}
                                url={track.image}
                                title={track.title}
                                artist={track.artist}
                                spoURL={track.spoURL}
                                YTURL={track.YTURL}
                                trackURI={track.trackURI}
                                popularity={track.popularity}
                                explicit={track.explicit}
                                type={track.type || "track"}
                            />
                        ))
                    )
                }
            </div>
        </div>
    );
};

export default LocallySavedSongs;
