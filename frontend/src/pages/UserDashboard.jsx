// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faSignOutAlt, faEnvelope, faGlobe, faUser, faCrown } from '@fortawesome/free-solid-svg-icons';

export default function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      await fetch('https://music-recommender-api.onrender.com/refresh_access_token', {
        credentials: 'include',
      });

      const response = await fetch('https://music-recommender-api.onrender.com/me', {
        credentials: 'include',
      });

      if (response.status === 401) {
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
    const interval = setInterval(fetchUserProfile, 1000 * 60 * 10);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('https://music-recommender-api.onrender.com/logout', { credentials: 'include' });
      window.location.reload();
    } catch (err) {
      console.error('[ERROR] Logout failed:', err);
    }
  };

  const Label = ({ icon, text }) => (
    <div className='flex items-center gap-3 text-gray-300 text-sm'>
      <FontAwesomeIcon icon={icon} className='w-4 h-4 text-green-400' />
      <span>{text}</span>
    </div>
  );

  if (userData) {
    localStorage.setItem('userName', userData.display_name);
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-zinc-900 to-gray-900 text-white relative overflow-hidden px-6'>
      <div className='absolute top-0 left-0 w-full h-full bg-gradient-radial from-emerald-500/10 to-transparent blur-3xl z-0' />
      
      <div className='relative z-10 w-full max-w-xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_60px_5px_rgba(0,255,160,0.15)] rounded-3xl p-8 space-y-6 animate-fade-in'>
        {loading ? (
    <div className="flex items-center justify-center text-white">
      <Loader className="animate-spin w-8 h-8 mr-3" />
      <span className="text-lg">Loading Your Account...</span>
    </div>
        ) : userData ? (
          <>
            <div className='flex flex-col items-center space-y-4'>
              <div className='relative'>
                <img src={userData.image} alt='Avatar' className='w-32 h-32 rounded-full border-4 border-green-500 shadow-xl' />
                {userData.product === 'premium' && (
                  <div className='absolute -bottom-2 -right-2 bg-yellow-400 text-black p-2 rounded-full shadow-md animate-pulse'>
                    <FontAwesomeIcon icon={faCrown} className='w-4 h-4' />
                  </div>
                )}
              </div>
              <h2 className='text-3xl font-bold tracking-tight text-white drop-shadow-md'>{userData.display_name}</h2>
              <div className='flex items-center gap-2 text-sm uppercase tracking-widest text-green-300'>
                <FontAwesomeIcon icon={faSpotify} />
                <span>{userData.product}</span>
              </div>
            </div>

            <div className='grid gap-2'>
              {/* <Label icon={faEnvelope} text={userData.email} /> */}
              <Label icon={faGlobe} text={userData.country} />
              <Label icon={faUser} text={`Spotify ID: ${userData.id}`} />
            </div>

            {userData.product !== 'premium' && (
              <div className='mt-4 text-center'>
                <p className='text-yellow-300 italic text-sm'>Upgrade to Premium for uninterrupted magic 🎧</p>
                <button
                  onClick={() => window.open('https://www.spotify.com/premium/', '_blank')}
                  className='mt-3 px-5 py-2 rounded-xl bg-gradient-to-r from-yellow-500 to-pink-500 text-white text-sm font-semibold shadow hover:scale-105 transition-transform'
                >
                  Upgrade to Premium
                </button>
              </div>
            )}

            <button
              onClick={handleLogout}
              className='w-full py-2 mt-6 rounded-xl bg-red-500 hover:bg-red-600 active:scale-95 transition-all text-white font-medium shadow-lg flex items-center justify-center gap-2'
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              Logout
            </button>
          </>
        ) : (
          <div className='text-center space-y-5'>
            <p className='text-xl font-medium'>You’re not logged in.</p>
            <button
              onClick={() => window.open('https://music-recommender-api.onrender.com/login', '_self')}
              className='inline-flex items-center px-6 py-3 bg-green-500 text-white text-lg gap-3 hover:text-black hover:scale-110 active:scale-90 transition-all duration-200 rounded-2xl shadow-lg'
            >
              <FontAwesomeIcon icon={faSpotify} />
              Login with Spotify
            </button>
          </div>
        )}
      </div>
    </div>
  );
}