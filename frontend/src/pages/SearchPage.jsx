import React, {useState, useEffect, useMemo} from 'react'
import SearchComp from '../Components/Search';
import Card from '../Components/Card';
import Skeleton from 'react-loading-skeleton';
import useDebouncedSearch from '../hooks/useDebouncedSearch';
import fetchYouTubeData from '../hooks/useYoutubeSearch';
import { ArtistCard } from '../Components/CardComponents/ArtistsCard';
import { TrackCard } from '../Components/CardComponents/TracksCard';
import { AlbumCard } from '../Components/CardComponents/AlbumsCard';
import { PlaylistCard } from '../Components/CardComponents/PlaylistsCard';


const SearchPage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchType, setSearchType] = useState("track");
    
    const debouncedSearch = useDebouncedSearch(searchTerm, searchType, setLoading, setSearchResults);
    function handleSearchChange(query, type) {
        setSearchTerm(query);
        setSearchType(type);
        if (query.trim() === "") {
            setSearchResults([]);
            return;
        }
        debouncedSearch(query, type); // ✅ Correct
    }


  return (
    <div>
    <SearchComp handleChange={handleSearchChange} />
    <p className="text-white p-5">
        {searchTerm
            ? `User is searching for: ${searchTerm}`
            : "Start typing to search for tracks"}
    </p>

    <div className="flex flex-row flex-wrap justify-center gap-5">
        {loading ? (
            Array.from({ length: 20 }).map((_, index) => (
                <div key={index} className="p-4">
                    <Skeleton height={200} width={150} />
                    <Skeleton height={25} width={`80%`} style={{ marginTop: 10 }} />
                    <Skeleton height={15} width={`60%`} style={{ marginTop: 5 }} />
                    <Skeleton height={35} width={`100%`} style={{ marginTop: 40 }} />
                    <Skeleton height={35} width={`100%`} style={{ marginTop: 5 }} />
                    <Skeleton height={10} width={`40%`} style={{ marginTop: 5 }} />
                </div>
            ))
        ) : (
            (searchTerm ? searchResults  : searchResults).map((track, index) => (
                <div className='flex flex-row flex-wrap justify-center gap-5' key={index}>
                {track.type === "artist" && 
                <ArtistCard 
                followers={track.followers}
                url={track.url}
                title={track.title}
                YTURL={track.YTURL}
                spoURL={track.spoURL}
                id={track.id}
                />}
                
                    {track.type === "album" && 
                    <AlbumCard
                    popularity={track.popularity}
                    YTURL={track.YTURL}
                    spoURL={track.spoURL}
                    url={track.url}
                    title={track.title}
                    artist={track.artists}
                />    
                }
                {track.type === "track" &&                 
                <TrackCard
                    followers={track.followers}
                    url={track.url}
                    title={track.title}
                    artist={track.artists}
                    spoURL={track.spoURL}
                    YTURL={fetchYouTubeData(track.title + " " + track.artists)}
                    popularity={track.popularity}
                    explicit={track.explicit}
                    trackURI={track.trackURI}
                />
                }
                {track.type === "playlist" && 
                <PlaylistCard
                    owner={track.owner}
                    isPublic={track.public}
                    spoURL={track.spoURL}
                    url={track.url}
                    title={track.title}
                    trackURI={track.trackURI}
                />
                }
                </div>
            ))
        )}

    </div>
</div>
  )
}

export default SearchPage