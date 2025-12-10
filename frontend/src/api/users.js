import { api } from './client';

export async function getCurrentUser() {
  return api.get('/users/me');
}
