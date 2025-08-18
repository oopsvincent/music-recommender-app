// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Loader, Music, Heart, Disc, Users, User } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { faSignOutAlt, faEnvelope, faGlobe, faUser, faCrown } from '@fortawesome/free-solid-svg-icons';

export default function UserDashboard() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Check if there's a key parameter for Spotify authentication
  const hasKey = searchParams.get('key');

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
    if (hasKey) {
      fetchUserProfile();
      const interval = setInterval(fetchUserProfile, 1000 * 60 * 10);
      return () => clearInterval(interval);
    } else {
      setLoading(false);
    }
  }, [hasKey]);

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

  // Local Storage Dashboard Component
  const LocalDashboard = () => {
    const userName = localStorage.getItem('userName') || 'Music Lover';
    const savedSongs = JSON.parse(localStorage.getItem('savedSongs') || '[]');
    const savedAlbums = JSON.parse(localStorage.getItem('savedAlbums') || '[]');
    const savedArtists = JSON.parse(localStorage.getItem('savedArtists') || '[]');
    const savedPlaylists = JSON.parse(localStorage.getItem('savedPlaylists') || '[]');

    const firstLetter = userName.charAt(0).toUpperCase();
    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&size=128&background=10b981&color=ffffff&rounded=true&bold=true`;

    const stats = [
      { icon: Music, label: 'Saved Songs', count: savedSongs.length, color: 'text-green-400' },
      { icon: Disc, label: 'Saved Albums', count: savedAlbums.length, color: 'text-purple-400' },
      { icon: Users, label: 'Saved Artists', count: savedArtists.length, color: 'text-blue-400' },
      { icon: Heart, label: 'Saved Playlists', count: savedPlaylists.length, color: 'text-pink-400' }
    ];

    return (
      <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white relative overflow-hidden px-6'>
        <div className='absolute inset-0 bg-gradient-radial from-emerald-500/5 to-transparent' />
        
        <div className='relative z-10 w-full max-w-2xl'>
          {/* Main Profile Card */}
          <div className='bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 mb-6 shadow-2xl'>
            <div className='flex flex-col items-center space-y-6'>
              {/* Avatar */}
              <div className='relative'>
                <div className='w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-4xl font-bold text-white shadow-2xl border-4 border-emerald-400/30'>
                  {firstLetter}
                </div>
                <div className='absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-full'>
                  <User className='w-4 h-4 text-white' />
                </div>
              </div>

              {/* Name */}
              <div className='text-center space-y-2'>
                <h1 className='text-3xl font-bold text-white'>{userName}</h1>
                <p className='text-emerald-400 text-sm uppercase tracking-wider'>Music Explorer</p>
                <p className='text-emerald-400 text-sm hover::underline active::underline cursor-pointer' onClick={() => {navigate("/account?key=spotify-login")}}>Open Spotify Login</p>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className='grid grid-cols-2 gap-4'>
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className='bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-6 hover:bg-white/10 transition-all duration-300'>
                  <div className='flex items-center space-x-4'>
                    <div className={`p-3 rounded-xl bg-white/10 ${stat.color}`}>
                      <IconComponent className='w-6 h-6' />
                    </div>
                    <div>
                      <p className='text-2xl font-bold text-white'>{stat.count}</p>
                      <p className='text-sm text-gray-400'>{stat.label}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Total Collection Summary */}
          <div className='mt-6 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 rounded-2xl p-6'>
            <div className='text-center'>
              <p className='text-lg text-gray-300 mb-2'>Total Collection</p>
              <p className='text-4xl font-bold text-white'>
                {savedSongs.length + savedAlbums.length + savedArtists.length + savedPlaylists.length}
              </p>
              <p className='text-sm text-emerald-400 mt-2'>Items saved</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Original Spotify Dashboard
  const SpotifyDashboard = () => {
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
              <p className='text-xl font-medium'>You're not logged in.</p>
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
  };

  // Render based on whether there's a key parameter
  return hasKey ? <SpotifyDashboard /> : <LocalDashboard />;
}