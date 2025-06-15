// db.js
import Dexie from 'dexie';

export const db = new Dexie('GrooveEstrellaDB');

db.version(1).stores({
  playlists: '++id, name', // id = PK, name is indexed
});

// Optionally: define default schema
export const createPlaylist = async (name) => {
  return await db.playlists.add({ name, songs: [] });
};

export const addSongToPlaylist = async (playlistId, song) => {
  const playlist = await db.playlists.get(playlistId);
  if (!playlist) throw new Error('Playlist not found');

  // Prevent duplicate songs by id
  const songExists = playlist.songs?.some((s) => s.id === song.id);
  if (!songExists) {
    playlist.songs.push(song);
    await db.playlists.put(playlist); // update
  }
};

export const getAllPlaylists = async () => {
  return await db.playlists.toArray();
};

export const getPlaylistById = async (id) => {
  return await db.playlists.get(id);
};
