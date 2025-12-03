import { api } from './client';

export async function fetchPlaylists() {
  return api.get('/playlists');
}

export async function createPlaylist(data) {
  // { name, description?, is_active? }
  return api.post('/playlists', data);
}

export async function updatePlaylist(id, data) {
  return api.put(`/playlists/${id}`, data);
}

export async function deletePlaylist(id) {
  return api.delete(`/playlists/${id}`);
}
