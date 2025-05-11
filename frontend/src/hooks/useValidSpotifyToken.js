// src/hooks/useValidSpotifyToken.js
import { getSpotifyToken } from './useSpotify';

export async function getValidSpotifyToken() {
  let token = localStorage.getItem('access_token');

  // Optional: you could save the token expiry timestamp + check here

  if (!token) {
    token = await getSpotifyToken();
    localStorage.setItem('access_token', token);
  }

  return token;
}
