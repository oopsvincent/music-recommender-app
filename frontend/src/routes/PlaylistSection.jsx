import React from 'react';
import Card from '../Components/Card'; // Assuming your Card component takes a track prop

const PlaylistSection = ({ userPlaylists }) => {
  if (!userPlaylists || userPlaylists.length === 0) {
    return <div className="text-center mt-10 text-white bg-black text-2xl p-4 m-5 rounded-2xl">No saved songs yet<br/>If you can't see your saved music here, try reloading the page</div>;
  }

  return (
    <>
    <div className={`flex-row mb-5 md:ml-10 md:mr-10 lg:ml-40 lg:mr-40 h-at-min relative flex flex-wrap justify-center`}>

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
