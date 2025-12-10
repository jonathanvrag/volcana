import { useEffect, useState } from 'react';
import {
  getCurrentUser,
  listUsers,
  createUser,
  updateUser,
} from '../../../api/users';

export default function CmsUsers() {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingList, setLoadingList] = useState(true);

  const [form, setForm] = useState({
    email: '',
    full_name: '',
    password: '',
    role: 'editor',
    is_active: true,
  });
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const me = await getCurrentUser();
        setCurrentUser(me);
        if (me.role === 'admin') {
          const all = await listUsers();
          setUsers(all);
        }
      } catch {
        setCurrentUser(null);
      } finally {
        setLoadingList(false);
      }
    }
    load();
  }, []);

  const handleFormChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCreate = async e => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setSaving(true);
    try {
      const created = await createUser(form);
      setUsers(prev => [...prev, created]);
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
        'No se pudo crear el usuario (correo ya existe o falta de permisos).'
      );
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async user => {
    try {
      const updated = await updateUser(user.id, {
        is_active: !user.is_active,
      });
      setUsers(prev => prev.map(u => (u.id === user.id ? updated : u)));
    } catch {
      alert('No se pudo actualizar el estado del usuario.');
    }
  };

  const changeRole = async (user, newRole) => {
    try {
      const updated = await updateUser(user.id, { role: newRole });
      setUsers(prev => prev.map(u => (u.id === user.id ? updated : u)));
    } catch {
      alert('No se pudo actualizar el rol.');
    }
  };

  if (!currentUser && loadingList) {
    return <p className='text-sm text-slate-500'>Cargando...</p>;
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <p className='text-sm text-slate-500'>
        No tiene permisos para administrar usuarios.
      </p>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Formulario crear usuario */}
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

        <form onSubmit={handleCreate} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-slate-700 mb-1'>
              Correo
            </label>
            <input
              type='email'
              name='email'
              className='block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'
              value={form.email}
              onChange={handleFormChange}
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
              onChange={handleFormChange}
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
              onChange={handleFormChange}
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
                onChange={handleFormChange}>
                <option value='editor'>Editor</option>
                <option value='admin'>Admin</option>
              </select>
            </div>

            <label className='inline-flex items-center gap-2 mt-5 text-sm text-slate-700'>
              <input
                type='checkbox'
                name='is_active'
                checked={form.is_active}
                onChange={handleFormChange}
                className='rounded border-slate-300 text-emerald-600 focus:ring-emerald-500'
              />
              Activo
            </label>
          </div>

          <button
            type='submit'
            disabled={saving}
            className='inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60'>
            {saving ? 'Creando…' : 'Crear usuario'}
          </button>
        </form>
      </div>

      {/* Lista de usuarios */}
      <div>
        <h3 className='text-lg font-semibold text-slate-800 mb-4'>
          Usuarios existentes
        </h3>

        <div className='overflow-x-auto rounded-md border border-slate-200 bg-white'>
          <table className='min-w-full text-sm text-slate-800'>
            <thead className='bg-slate-50'>
              <tr className='text-left text-slate-500'>
                <th className='px-4 py-2'>Correo</th>
                <th className='px-4 py-2'>Nombre</th>
                <th className='px-4 py-2'>Rol</th>
                <th className='px-4 py-2'>Estado</th>
                <th className='px-4 py-2 text-right'>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr
                  key={u.id}
                  className='border-t border-slate-100 hover:bg-slate-50 text-slate-800'>
                  <td className='px-4 py-2'>{u.email}</td>
                  <td className='px-4 py-2'>
                    {u.full_name || <span className='text-slate-400'>—</span>}
                  </td>
                  <td className='px-4 py-2'>
                    <select
                      value={u.role}
                      onChange={e => changeRole(u, e.target.value)}
                      className='rounded border border-slate-300 bg-white px-2 py-1 text-xs text-slate-800'>
                      <option value='editor'>Editor</option>
                      <option value='admin'>Admin</option>
                    </select>
                  </td>
                  <td className='px-4 py-2'>
                    {u.is_active ? (
                      <span className='inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700'>
                        Activo
                      </span>
                    ) : (
                      <span className='inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500'>
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className='px-4 py-2 text-right'>
                    {u.is_active ? (
                      <button
                        onClick={() => toggleActive(u)}
                        className='inline-flex items-center rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-700 hover:bg-red-100 hover:border-red-300 cursor-pointer'>
                        Desactivar
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleActive(u)}
                        className='inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-100 hover:border-emerald-300 cursor-pointer'>
                        Reactivar
                      </button>
                    )}
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className='px-4 py-4 text-center text-sm text-slate-500'>
                    No hay usuarios registrados todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
