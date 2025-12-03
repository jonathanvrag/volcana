import { useEffect, useState } from 'react';
import { fetchPlaylists } from '../../../api/playlists';
import { fetchMedia, createMedia, deleteMedia } from '../../../api/media';

export default function CmsMedia() {
  const [playlists, setPlaylists] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [playlistId, setPlaylistId] = useState('');
  const [type, setType] = useState('image');
  const [title, setTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [duration, setDuration] = useState(20);
  const [creating, setCreating] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      setError('');
      const [pls, mediaItems] = await Promise.all([
        fetchPlaylists(),
        fetchMedia(),
      ]);
      setPlaylists(pls);
      setMedia(mediaItems);
      if (!playlistId && pls.length > 0) {
        setPlaylistId(String(pls[0].id));
      }
    } catch (err) {
      setError(err.message || 'Error cargando media');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    if (!playlistId || !fileUrl.trim()) return;

    try {
      setCreating(true);
      setError('');
      await createMedia({
        playlist_id: Number(playlistId),
        type,
        title: title.trim() || null,
        description: null,
        file_url: fileUrl.trim(),
        duration_seconds: Number(duration) || 20,
        order_index: Number(orderIndex) || 0,
        active: true,
      });
      setTitle('');
      setFileUrl('');
      setOrderIndex(0);
      setDuration(20);
      await loadData();
    } catch (err) {
      setError(err.message || 'Error creando media');
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('¿Eliminar este item?')) return;
    try {
      await deleteMedia(id);
      setMedia(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      setError(err.message || 'Error eliminando media');
    }
  }

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='text-lg font-semibold text-slate-800'>Media</h3>
        <p className='text-sm text-slate-600'>
          Gestiona las imágenes, videos y textos que componen los loops.
        </p>
      </div>

      {error && (
        <div className='rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700'>
          {error}
        </div>
      )}

      {/* Formulario creación */}
      <form
        onSubmit={handleCreate}
        className='bg-white rounded-lg shadow-sm p-4 space-y-3'>
        <h4 className='text-sm font-semibold text-slate-800'>
          Nuevo item de media
        </h4>
        <div className='grid gap-3 md:grid-cols-3'>
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-medium text-slate-600'>
              Playlist *
            </label>
            <select
              className='border border-slate-300 rounded px-2 py-1.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500'
              value={playlistId}
              onChange={e => setPlaylistId(e.target.value)}>
              <option value=''>Seleccione</option>
              {playlists.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs font-medium text-slate-600'>Tipo</label>
            <select
              className='border border-slate-300 rounded px-2 py-1.5 text-sm text-slate-900 bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500'
              value={type}
              onChange={e => setType(e.target.value)}>
              <option value='image'>Imagen</option>
              <option value='video'>Video</option>
              <option value='text'>Texto</option>
              <option value='clip'>Clip</option>
            </select>
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs font-medium text-slate-600'>Título</label>
            <input
              className='border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white'
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder='Nombre interno'
            />
          </div>
        </div>

        <div className='grid gap-3 md:grid-cols-3'>
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-medium text-slate-600'>
              URL / ruta archivo *
            </label>
            <input
              className='border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white'
              value={fileUrl}
              onChange={e => setFileUrl(e.target.value)}
              placeholder='/media/imagenes/volcana-01.png'
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs font-medium text-slate-600'>
              Orden en loop
            </label>
            <input
              type='number'
              className='border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white'
              value={orderIndex}
              onChange={e => setOrderIndex(e.target.value)}
            />
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs font-medium text-slate-600'>
              Duración (s)
            </label>
            <input
              type='number'
              className='border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white'
              value={duration}
              onChange={e => setDuration(e.target.value)}
            />
          </div>
        </div>

        <button
          type='submit'
          disabled={creating || !playlistId || !fileUrl.trim()}
          className='inline-flex items-center px-3 py-1.5 text-sm font-medium rounded bg-sky-700 text-white hover:bg-sky-800 disabled:opacity-60'>
          {creating ? 'Creando...' : 'Crear media'}
        </button>
      </form>

      {/* Tabla media */}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        <table className='min-w-full text-sm'>
          <thead className='bg-slate-50 border-b border-slate-200'>
            <tr>
              <th className='text-left px-3 py-2 font-medium text-slate-600'>
                ID
              </th>
              <th className='text-left px-3 py-2 font-medium text-slate-600'>
                Playlist
              </th>
              <th className='text-left px-3 py-2 font-medium text-slate-600'>
                Tipo
              </th>
              <th className='text-left px-3 py-2 font-medium text-slate-600'>
                Título
              </th>
              <th className='text-left px-3 py-2 font-medium text-slate-600'>
                URL
              </th>
              <th className='text-left px-3 py-2 font-medium text-slate-600'>
                Orden
              </th>
              <th className='text-left px-3 py-2 font-medium text-slate-600'>
                Duración
              </th>
              <th className='px-3 py-2' />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={8}
                  className='px-3 py-4 text-center text-slate-500'>
                  Cargando media...
                </td>
              </tr>
            ) : media.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className='px-3 py-4 text-center text-slate-500'>
                  No hay media creada aún.
                </td>
              </tr>
            ) : (
              media.map(m => (
                <tr
                  key={m.id}
                  className='border-t border-slate-100 hover:bg-slate-50'>
                  <td className='px-3 py-2 text-slate-700'>{m.id}</td>
                  <td className='px-3 py-2 text-slate-700'>
                    {playlists.find(p => p.id === m.playlist_id)?.name ||
                      m.playlist_id}
                  </td>
                  <td className='px-3 py-2 text-slate-700'>{m.type}</td>
                  <td className='px-3 py-2 text-slate-700'>{m.title || '—'}</td>
                  <td className='px-3 py-2 text-slate-600 max-w-xs truncate'>
                    {m.file_url}
                  </td>
                  <td className='px-3 py-2 text-slate-700'>{m.order_index}</td>
                  <td className='px-3 py-2 text-slate-700'>
                    {m.duration_seconds}s
                  </td>
                  <td className='px-3 py-2 text-right'>
                    <button
                      onClick={() => handleDelete(m.id)}
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
