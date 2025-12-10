import { api } from './client';

export async function getCurrentUser() {
  return api.get('/users/me');
}

export async function changePassword(payload) {
  return api.post('/users/change-password', payload);
}
