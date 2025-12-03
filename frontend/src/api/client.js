const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(
      `Error ${res.status} en ${path}: ${errorText || res.statusText}`
    );
  }

  if (res.status === 204) return null;

  return res.json();
}

export const api = {
  get: path => request(path),
  post: (path, body) =>
    request(path, { method: 'POST', body: JSON.stringify(body) }),
  put: (path, body) =>
    request(path, { method: 'PUT', body: JSON.stringify(body) }),
  delete: path => request(path, { method: 'DELETE' }),
};
