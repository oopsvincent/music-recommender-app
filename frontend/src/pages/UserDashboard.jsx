// UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';

const UserDashboard = () => {
  const { authTokens, isAuthenticated, logout } = useAuth();
  const token = authTokens?.access_token;

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;

      try {
        const response = await fetch('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch user profile');

        const data = await response.json();
        setUserData(data);
        console.log('Spotify user profile:', data);
      } catch (error) {
        console.error('Error fetching Spotify user data:', error);
      }
    };

    fetchUserProfile();
  }, [token]);

  const loginWithSpotify = () => {
    window.open('https://music-recommender-api.onrender.com/login', '_self');
  };

  return (
    <div className='w-full min-h-[90vh] flex flex-col justify-center items-center text-center text-white p-6'>
      {userData ? (
        <div className="bg-white/5 border border-white/20 rounded-3xl p-6 max-w-md w-full shadow-lg">
          <img src={userData?.images?.[0]?.url || `https://placehold.co/200/orange/white?text=${encodeURIComponent(userData.display_name)}`} alt="Profile" className="w-32 h-32 rounded-full mx-auto mb-4 shadow-lg" />
          <h2 className="text-3xl font-bold mb-1">{userData.display_name}</h2>
          <p className="text-gray-400 mb-2">{userData.email}</p>
          <p className="text-sm text-green-400 mb-4"><FontAwesomeIcon icon={faSpotify} className="mr-1" /> Spotify User</p>

          <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-xl w-full transition-all duration-200 mt-2">Logout</button>
        </div>
      ) : (
        <button
          onClick={loginWithSpotify}
          className='inline-flex justify-center items-center px-6 py-3 bg-green-500 text-white text-xl gap-3 hover:text-black hover:scale-105 active:scale-90 transition-all duration-200 rounded-2xl'
        >
          <FontAwesomeIcon icon={faSpotify} size="lg" /> Login with Spotify
        </button>
      )}
    </div>
  );
};

export default UserDashboard;
