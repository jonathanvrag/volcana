import { useEffect, useState } from 'react';
import { createUser, getCurrentUser } from '../../../api/users';

export default function CmsUsers() {
  const [form, setForm] = useState({
    email: '',
    full_name: '',
    password: '',
    role: 'editor',
    is_active: true,
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      await createUser(form);
      setMessage('Usuario creado correctamente');
      setForm({
        email: '',
        full_name: '',
        password: '',
        role: 'editor',
        is_active: true,
      });
    } catch (err) {
      setError(
        'No se pudo crear el usuario (correo ya existe o error de permisos)'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null));
  }, []);

    if (!currentUser) {
    return null;
  }

    if (currentUser.role !== 'admin') {
    return (
      <p className="text-sm text-slate-500">
        No tiene permisos para administrar usuarios.
      </p>
    );
  }

  return (
    <div className='max-w-lg'>
      <h3 className='text-lg font-semibold text-slate-800 mb-4'>
        Crear usuario
      </h3>

      {message && (
        <p className='mb-3 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-3 py-2'>
          {message}
        </p>
      )}
      {error && (
        <p className='mb-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded px-3 py-2'>
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label className='block text-sm font-medium text-slate-700 mb-1'>
            Correo
          </label>
          <input
            type='email'
            name='email'
            className='block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700 mb-1'>
            Nombre completo
          </label>
          <input
            type='text'
            name='full_name'
            className='block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'
            value={form.full_name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700 mb-1'>
            Contraseña
          </label>
          <input
            type='password'
            name='password'
            className='block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className='flex gap-4 items-center'>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>
              Rol
            </label>
            <select
              name='role'
              className='rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'
              value={form.role}
              onChange={handleChange}>
              <option value='editor'>Editor</option>
              <option value='admin'>Admin</option>
            </select>
          </div>

          <label className='inline-flex items-center gap-2 mt-5 text-sm text-slate-700'>
            <input
              type='checkbox'
              name='is_active'
              checked={form.is_active}
              onChange={handleChange}
              className='rounded border-slate-300 text-emerald-600 focus:ring-emerald-500'
            />
            Activo
          </label>
        </div>

        <button
          type='submit'
          disabled={loading}
          className='inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60'>
          {loading ? 'Creando…' : 'Crear usuario'}
        </button>
      </form>
    </div>
  );
}
