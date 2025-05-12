// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import Account from '../Components/Account';
import { useNavigate } from 'react-router-dom';

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

  const handleLogout = () => {
    // Clear session cookie by hitting backend logout route (if you have it)
    // For now just reload page / navigate home
    sessionStorage.clear(); // optional cleanups
    navigate('/');
    window.location.reload();
  };

  return (
    <div className='w-full h-screen flex flex-col justify-center items-center text-white'>
      {loading ? (
        <p className='text-xl'>Loading your account...</p>
      ) : userData ? (
        <>
          <Account
            src={userData.image}
            username={userData.display_name}
            email={userData.email}
            followers={'Hidden for privacy'} // Optional
          />
          <button
            onClick={handleLogout}
            className='mt-4 bg-red-500 px-5 py-2 rounded-2xl hover:bg-red-600 active:scale-95 transition'
          >
            Logout
          </button>
        </>
      ) : (
        <>
          <p className='text-xl mb-4'>You are not logged in</p>
          <button
            onClick={() => window.open('https://music-recommender-api.onrender.com/login', '_self')}
            className='inline-flex justify-center items-center px-5 py-2 bg-green-500 text-white text-xl gap-5 hover:text-black hover:scale-110 active:scale-90 transition-all duration-200 rounded-2xl'
          >
            Login with Spotify
          </button>
        </>
      )}
    </div>
  );
}
