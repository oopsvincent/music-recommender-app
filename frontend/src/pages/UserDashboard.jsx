import React, { useEffect, useState } from 'react';
import Account from '../Components/Account'; // FIXED IMPORT
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';

import { useAuth } from '../hooks/AuthContext';

const UserDashboard = () => {
    const { authTokens } = useAuth();
    const accessToken = authTokens?.accessToken;

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (!accessToken) {
                console.warn('No access token provided');
                return;
            }

            try {
                const response = await fetch('https://api.spotify.com/v1/me', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                console.log('Response status:', response.status);

                if (response.status === 401) {
                    console.warn('Access token expired or invalid');
                    return;
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch user profile');
                }

                const data = await response.json();
                setUserData(data);
                console.log('Spotify user profile:', data);
            } catch (error) {
                console.error('Error fetching Spotify user data:', error);
            }
        };

        fetchUserProfile();
    }, [accessToken]);

    const username = userData?.display_name || 'Guest';
    const imageName = username;
    const imageUrl = userData?.images?.[0]?.url || `https://placehold.co/200/orange/white?text=${encodeURIComponent(username)}`;

    return (
        <div className='w-full h-lvh flex flex-col justify-center items-center'>
            {userData ? (
                <Account
                    src={imageUrl}
                    username={username}
                    email={userData.email}
                    followers={userData.followers?.total}
                />
            ) : (
                <p className="text-white text-xl">Fetching user data...</p>
            )}

            <button
                onClick={() => window.open('https://music-recommender-api.onrender.com/login')}
                className='inline-flex justify-center items-center px-5 py-2 m-5 bg-green-500 text-white text-xl gap-5 hover:text-black hover:scale-110 active:text-black active:scale-90 transition-all duration-200 rounded-2xl'
            >
                Login with Spotify
            </button>
        </div>
    );
};

export default UserDashboard;
