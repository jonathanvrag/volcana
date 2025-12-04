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

export async function uploadMediaFile(file) {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(
    import.meta.env.VITE_API_BASE_URL
      ? `${import.meta.env.VITE_API_BASE_URL}/upload`
      : 'http://localhost:8000/api/upload',
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(
      `Error subiendo archivo: ${text || res.statusText || res.status}`
    );
  }

  return res.json();
}
