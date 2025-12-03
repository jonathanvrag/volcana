import { api } from './client';

export async function fetchMedia() {
  return api.get('/media');
}

export async function fetchMediaByPlaylist(playlistId) {
  return api.get(`/playlists/${playlistId}/media`);
}

export async function createMedia(data) {
  // { playlist_id, type, title?, description?, file_url, duration_seconds?, order_index?, active? }
  return api.post('/media', data);
}

export async function updateMedia(id, data) {
  return api.put(`/media/${id}`, data);
}

export async function deleteMedia(id) {
  return api.delete(`/media/${id}`);
}
