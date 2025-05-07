import React, { useState, useEffect } from 'react';
import Account from '../Components/Account';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';

const UserDashboard = () => {
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        setUserData({
            display_name: localStorage.getItem('userName'),
        });
    }, []);  // <-- Empty dependency array = runs only once when component mounts
    
  return (
    <div className='w-full h-lvh flex flex-col justify-center items-center'>
    <Account
        src={
            userData?.images?.length > 0 && userData.images[0]?.url
                ? userData.images[0].url
                : `https://placehold.co/200/orange/white?text=${encodeURIComponent(userData?.display_name || 'User')}`
        }
        username={userData?.display_name}
        email={userData?.email}
        followers={userData?.followers}
    />{" "}

    <button onClick={() => window.open('https://music-recommender-api.onrender.com/login')} className='inline-flex justify-center items-center px-5 py-2 m-5 bg-green-500 text-white text-xl gap-5 hover:text-black hover:scale-110 active:text-black active:scale-90 transition-all duration-200 rounded-2xl'>
        Login with Spotify
        <FontAwesomeIcon icon={faSpotify} className="text-4xl" />
    </button>
</div>
  )
}

export default UserDashboard