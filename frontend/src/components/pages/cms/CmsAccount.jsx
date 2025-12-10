import { useState } from 'react';
import { changePassword } from '../../../api/users';

export default function CmsAccount() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (newPassword !== confirm) {
      setError('La nueva contraseña y la confirmación no coinciden');
      return;
    }

    setLoading(true);
    try {
      await changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      setMessage('Contraseña actualizada correctamente');
      setCurrentPassword('');
      setNewPassword('');
      setConfirm('');
    } catch (err) {
      setError('La contraseña actual no es correcta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-md'>
      <h3 className='text-lg font-semibold text-slate-800 mb-4'>
        Cambiar contraseña
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
            Contraseña actual
          </label>
          <input
            type='password'
            className='block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700 mb-1'>
            Nueva contraseña
          </label>
          <input
            type='password'
            className='block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className='block text-sm font-medium text-slate-700 mb-1'>
            Confirmar nueva contraseña
          </label>
          <input
            type='password'
            className='block w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500'
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          className='inline-flex items-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-60'>
          {loading ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
