import React from 'react';
import Card from '../Components/Card'; // Assuming your Card component takes a track prop

const PlaylistSection = ({ userPlaylists }) => {
  if (!userPlaylists || userPlaylists.length === 0) {
    return <div className="text-center mt-10 text-gray-500">No saved songs yet</div>;
  }

  return (
    <>
    <div className={`md:ml-10 md:mr-10 lg:ml-40 lg:mr-40 h-at-min relative flex flex-wrap justify-between`}>
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
