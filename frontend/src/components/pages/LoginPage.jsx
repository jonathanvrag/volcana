import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

async function loginRequest(email, password) {
  const body = new URLSearchParams();
  body.append('username', email);
  body.append('password', password);

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });

  if (!res.ok) {
    throw new Error('Credenciales inválidas');
  }

  const data = await res.json();
  localStorage.setItem('token', data.access_token);
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await loginRequest(email, password);
      navigate('/cms', { replace: true });
    } catch (e) {
      setError('Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-900">
    {/* Columna izquierda: branding */}
    <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/70 via-sky-500/60 to-slate-900" />
      <div className="relative z-10 flex flex-col justify-between p-10 text-white">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/90">
            Universidad EAFIT · SIATA
          </p>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight">
            Volcana
          </h1>
          <p className="mt-2 text-sm text-emerald-50/90 max-w-md">
            Panel de administración de contenidos para la pantalla LED
            y el canal clima de la quebrada La Volcana.
          </p>
        </div>

        <div className="text-xs text-emerald-100/70">
          <p>Acceso restringido a personal autorizado de EAFIT.</p>
        </div>
      </div>
    </div>

    {/* Columna derecha: formulario */}
    <div className="flex-1 flex items-center justify-center bg-slate-50">
      <div className="w-full max-w-md px-8 py-10">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Acceso CMS
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Iniciar sesión
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Usa tu cuenta asignada para administrar playlists y contenido.
          </p>
        </div>

        {error && (
          <p className="mb-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Correo institucional
            </label>
            <input
              type="email"
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              className="block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex justify-center rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60"
          >
            {loading ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  </div>
  );
}