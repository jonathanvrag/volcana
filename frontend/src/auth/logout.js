export function logout(navigate) {
  localStorage.removeItem('token');
  if (navigate) {
    navigate('/login', { replace: true });
  } else {
    window.location.href = '/login';
  }
}
