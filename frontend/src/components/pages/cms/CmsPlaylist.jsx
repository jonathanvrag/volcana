import { useEffect, useState } from 'react';
import {
  fetchPlaylists,
  createPlaylist,
  deletePlaylist,
} from '../../../api/playlists';

export default function CmsPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);

  async function loadPlaylists() {
    try {
      setLoading(true);
      setError('');
      const data = await fetchPlaylists();
      setPlaylists(data);
    } catch (err) {
      setError(err.message || 'Error cargando playlists');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPlaylists();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setCreating(true);
      setError('');
      await createPlaylist({
        name: name.trim(),
        description: description.trim() || null,
        is_active: true,
      });
      setName('');
      setDescription('');
      await loadPlaylists();
    } catch (err) {
      setError(err.message || 'Error creando playlist');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar esta playlist?')) return;
    try {
      await deletePlaylist(id);
      setPlaylists(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      setError(err.message || 'Error eliminando playlist');
    }
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div>
        <h3 className='text-lg font-semibold text-slate-800'>Playlists</h3>
        <p className='text-sm text-slate-600'>
          Gestiona las playlists de la pantalla LED y del Canal Clima.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className='rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700'>
          {error}
        </div>
      )}

      {/* Formulario crear */}
      <form
        onSubmit={handleCreate}
        className='bg-white rounded-lg shadow-sm p-4 space-y-3'>
        <h4 className='text-sm font-semibold text-slate-800'>Nueva playlist</h4>
        <div className='grid gap-3 md:grid-cols-2'>
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-medium text-slate-600'>
              Nombre *
            </label>
            <input
              className='border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white text-slate-950'
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Pantalla LED principal'
            />
          </div>
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-medium text-slate-600'>
              Descripción
            </label>
            <input
              className='border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white text-slate-950'
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder='Loop principal en la pantalla del Bloque 19'
            />
          </div>
        </div>
        <button
          type='submit'
          disabled={creating || !name.trim()}
          className='inline-flex items-center px-3 py-1.5 text-sm font-medium rounded bg-sky-700 text-white hover:bg-sky-800 disabled:opacity-60'>
          {creating ? 'Creando...' : 'Crear playlist'}
        </button>
      </form>

      {/* Tabla de playlists */}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        <table className='min-w-full text-sm'>
          <thead className='bg-slate-50 border-b border-slate-200'>
            <tr>
              <th className='text-left px-3 py-2 font-medium text-slate-600'>
                ID
              </th>
              <th className='text-left px-3 py-2 font-medium text-slate-600'>
                Nombre
              </th>
              <th className='text-left px-3 py-2 font-medium text-slate-600'>
                Descripción
              </th>
              <th className='text-left px-3 py-2 font-medium text-slate-600'>
                Activa
              </th>
              <th className='px-3 py-2' />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className='px-3 py-4 text-center text-slate-500'>
                  Cargando playlists...
                </td>
              </tr>
            ) : playlists.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className='px-3 py-4 text-center text-slate-500'>
                  No hay playlists creadas aún.
                </td>
              </tr>
            ) : (
              playlists.map(p => (
                <tr
                  key={p.id}
                  className='border-t border-slate-100 hover:bg-slate-50'>
                  <td className='px-3 py-2 text-slate-700'>{p.id}</td>
                  <td className='px-3 py-2 text-slate-700'>{p.name}</td>
                  <td className='px-3 py-2 text-slate-600'>
                    {p.description || '—'}
                  </td>
                  <td className='px-3 py-2 text-slate-700'>
                    {p.is_active ? 'Sí' : 'No'}
                  </td>
                  <td className='px-3 py-2 text-right'>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className='text-xs text-red-600 hover:text-red-800'>
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
