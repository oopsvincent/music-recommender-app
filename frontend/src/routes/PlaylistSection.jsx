import React, { useState, useEffect } from 'react';
import Card from '../Components/Card'; // Assuming your Card component takes a track prop

const PlaylistSection = () => {
            const [userPlaylists, setPlaylists] = useState([]);
            const [selectedTrack, setSelectedTrack] = useState(null);
            const [isSaved, setIsSaved] = useState(false);
        
            // Function to handle saving the playlist
            const savePlaylist = () => {
                const newPlaylist = [...userPlaylists, selectedTrack];
                setPlaylists(newPlaylist);
    
                localStorage.setItem("userPlaylists", JSON.stringify(newPlaylist));
            };
        
            const loadSavedPlaylists = () => {
                const savedPlaylists = localStorage.getItem("savedSongs");
                if (savedPlaylists) {
                    setPlaylists(JSON.parse(savedPlaylists)); // Deserialize the saved playlist
                    setIsSaved(true);
                }
            };
    
            useEffect(() => {
                loadSavedPlaylists();
            }, []);


  if (!userPlaylists || userPlaylists.length === 0) {
    return <div className="text-center mt-10 text-white bg-black text-2xl p-4 m-5 rounded-2xl">No saved songs yet<br/>If you can't see your saved music here, try reloading the page</div>;
  }

  return (
    <>
    <div className={`flex-row mb-5 md:ml-10 md:mr-10 lg:ml-40 lg:mr-40 h-at-min relative flex flex-nowrap justify-center`}>

      {userPlaylists.map((track, index) => (
                            <Card
                            key={index}
                            url={track?.image}
                            title={track?.title}
                            artist={track?.artist}
                            spoURL={track?.spoURL}
                            YTURL={track?.YTURL}
                            popularity={track?.popularity}
                            explicit={track?.explicit}
                            type={track?.type || "music"}
                        />
      ))}
    </div>
    {/* <AppBar /> */}
    </>
  );
};

export default PlaylistSection;
