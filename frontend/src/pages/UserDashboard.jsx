// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify, faCrown } from '@fortawesome/free-brands-svg-icons';
import { faSignOutAlt, faEnvelope, faGlobe, faUser } from '@fortawesome/free-solid-svg-icons';

export default function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('https://music-recommender-api.onrender.com/me', {
        credentials: 'include',
      });

      if (response.status === 401) {
        console.warn('Session expired or user not logged in');
        setUserData(null);
        setLoading(false);
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch user profile');

      const data = await response.json();
      setUserData(data.profile);
      setLoading(false);
    } catch (err) {
      console.error('[ERROR] Failed to fetch profile:', err);
      setUserData(null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('https://music-recommender-api.onrender.com/logout', { credentials: 'include' });
      navigate('/');
      window.location.reload();
    } catch (err) {
      console.error('[ERROR] Logout failed:', err);
    }
  };

  const Label = ({ icon, text }) => (
    <div className='flex items-center gap-2 text-gray-300 text-sm'>
      <FontAwesomeIcon icon={icon} className='w-4 h-4 text-green-400' />
      <span>{text}</span>
    </div>
  );

  return (
    <div className='min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-black via-zinc-900 to-gray-900 text-white px-4'>
      {loading ? (
        <p className='text-xl'>Loading your Parisian account…</p>
      ) : userData ? (
        <div className='bg-white/10 border border-white/20 backdrop-blur-md p-6 rounded-3xl shadow-2xl max-w-md w-full text-center space-y-5'>
          <img src={userData.image} alt='User avatar' className='w-32 h-32 rounded-full mx-auto border-4 border-green-500 shadow-lg' />
          <h2 className='text-2xl font-bold text-white'>{userData.display_name}</h2>

          <div className='flex justify-center gap-2 items-center text-sm'>
            <FontAwesomeIcon icon={faSpotify} className='text-green-500' />
            <span className='uppercase tracking-wider'>{userData.product}</span>
            {userData.product === 'premium' && (
              <FontAwesomeIcon icon={faCrown} className='text-yellow-400 ml-2' title='Premium User' />
            )}
          </div>

          <div className='space-y-2 mt-3'>
            <Label icon={faEnvelope} text={userData.email} />
            <Label icon={faGlobe} text={userData.country} />
            <Label icon={faUser} text={`Spotify ID: ${userData.id}`} />
          </div>

          {userData.product !== 'premium' && (
            <p className='text-sm text-yellow-300 mt-3 italic'>Upgrade to Premium to unlock full music playback 🍷</p>
          )}

          <button
            onClick={handleLogout}
            className='mt-5 inline-flex justify-center items-center gap-2 px-6 py-2 rounded-xl bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white font-medium shadow-lg'
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
            Logout
          </button>
        </div>
      ) : (
        <>
          <p className='text-xl mb-4'>You are not logged in</p>
          <button
            onClick={() => window.open('https://music-recommender-api.onrender.com/login', '_self')}
            className='inline-flex justify-center items-center px-6 py-3 bg-green-500 text-white text-lg gap-3 hover:text-black hover:scale-110 active:scale-90 transition-all duration-200 rounded-2xl shadow-lg'
          >
            <FontAwesomeIcon icon={faSpotify} />
            Login with Spotify
          </button>
        </>
      )}
    </div>
  );
}
