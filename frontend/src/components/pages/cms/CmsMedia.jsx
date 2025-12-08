import { useEffect, useRef, useState } from 'react';
import { fetchPlaylists } from '../../../api/playlists';
import {
  fetchMedia,
  createMedia,
  deleteMedia,
  uploadMediaFile,
  updateMedia,
} from '../../../api/media';

export default function CmsMedia() {
  const [playlists, setPlaylists] = useState([]);
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [savingId, setSavingId] = useState(null);

  const [playlistId, setPlaylistId] = useState('');
  const [type, setType] = useState('image');
  const [title, setTitle] = useState('');
  const [fileUrl, setFileUrl] = useState('');
  const [orderIndex, setOrderIndex] = useState(0);
  const [duration, setDuration] = useState(20);
  const [creating, setCreating] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

  const API_ORIGIN = import.meta.VITE_API_BASE_URL || 'http://localhost:8000';
  const fileInputRef = useRef(null);

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

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

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

  async function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setError('');
      const data = await uploadMediaFile(file);
      setFileUrl(data.file_url);
    } catch (err) {
      setError(err.message || 'Error subiendo archivo');
    } finally {
      setUploading(false);
    }
  }

  function handleLocalChange(id, field, value) {
    setMedia(prev =>
      prev.map(m => (m.id === id ? { ...m, [field]: value } : m))
    );
  }

  async function handleSave(id) {
    const item = media.find(m => m.id === id);
    if (!item) return;

    try {
      setSavingId(id);
      setError('');

      await updateMedia(id, {
        title: item.title || null,
        order_index: Number(item.order_index) || 0,
        duration_seconds: Number(item.duration_seconds) || 20,
        active: item.active,
      });

      setEditingId(null);
    } catch (err) {
      setError(err.message || 'Error actualizando media');
    } finally {
      setSavingId(null);
    }
  }

  function getMediaSrc(fileUrl) {
    if (!fileUrl) return '';
    return fileUrl.startsWith('http') ? fileUrl : `${API_ORIGIN}${fileUrl}`;
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
            </select>
          </div>

          <div className='flex flex-col gap-1'>
            <label className='text-xs font-medium text-slate-600'>Título</label>
            <input
              className='border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white text-slate-950'
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder='Nombre interno'
            />
          </div>
        </div>

        {/* archivo + URL */}
        <div className='grid gap-3 md:grid-cols-3'>
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-medium text-slate-600'>
              Archivo (imagen o video)
            </label>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*,video/*'
              onChange={handleFileSelect}
              className='hidden'
            />
            <button
              type='button'
              onClick={() =>
                fileInputRef.current && fileInputRef.current.click()
              }
              className='inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded border border-slate-300 bg-white text-slate-800 hover:bg-slate-50'>
              Seleccionar archivo
            </button>

            {/* Estado de subida / nombre */}
            {uploading && (
              <p className='text-[11px] text-slate-500 mt-1'>
                Subiendo archivo...
              </p>
            )}
            {!uploading && fileUrl.startsWith('/media/') && (
              <p className='text-[11px] text-slate-500 mt-1 truncate'>
                Archivo seleccionado: {fileUrl.replace('/media/', '')}
              </p>
            )}
          </div>

          <div className='flex flex-col gap-1 md:col-span-2'>
            <label className='text-xs font-medium text-slate-600'>
              URL / ruta archivo *
            </label>
            <input
              className='border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white text-slate-950'
              value={fileUrl}
              onChange={e => setFileUrl(e.target.value)}
              placeholder='/media/imagenes/volcana-01.png'
            />
            <p className='text-[11px] text-slate-500 mt-1'>
              Puedes subir un archivo o pegar una URL pública.
            </p>
          </div>
        </div>

        <div className='grid gap-3 md:grid-cols-3'>
          <div className='flex flex-col gap-1'>
            <label className='text-xs font-medium text-slate-600'>
              Orden en loop
            </label>
            <input
              type='number'
              className='border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white text-slate-950'
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
              className='border border-slate-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white text-slate-950'
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
              <th className='text-left px-3 py-2 font-medium text-slate-600'>
                Activo
              </th>
              <th className='text-left px-3 py-2 font-medium text-slate-600'>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={9}
                  className='px-3 py-4 text-center text-slate-500'>
                  Cargando media...
                </td>
              </tr>
            ) : media.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
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

                  {/* Título */}
                  <td className='px-3 py-2 text-slate-700'>
                    {editingId === m.id ? (
                      <input
                        className='border border-slate-300 rounded px-2 py-1 text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500'
                        value={m.title || ''}
                        onChange={e =>
                          handleLocalChange(m.id, 'title', e.target.value)
                        }
                      />
                    ) : (
                      m.title || '—'
                    )}
                  </td>

                  {/* URL solo lectura */}
                  <td className='px-3 py-2 text-slate-600 max-w-xs truncate'>
                    {m.file_url}
                  </td>

                  {/* Orden */}
                  <td className='px-3 py-2 text-slate-700'>
                    {editingId === m.id ? (
                      <input
                        type='number'
                        className='w-16 border border-slate-300 rounded px-1 py-0.5 text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500'
                        value={m.order_index}
                        onChange={e =>
                          handleLocalChange(m.id, 'order_index', e.target.value)
                        }
                      />
                    ) : (
                      m.order_index
                    )}
                  </td>

                  {/* Duración */}
                  <td className='px-3 py-2 text-slate-700'>
                    {editingId === m.id ? (
                      <input
                        type='number'
                        className='w-16 border border-slate-300 rounded px-1 py-0.5 text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500'
                        value={m.duration_seconds}
                        onChange={e =>
                          handleLocalChange(
                            m.id,
                            'duration_seconds',
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      `${m.duration_seconds}s`
                    )}
                  </td>

                  {/* Activo / Inactivo */}
                  <td className='px-3 py-2 text-slate-700'>
                    <label className='inline-flex items-center gap-1 text-xs'>
                      <input
                        type='checkbox'
                        checked={m.active}
                        onChange={e =>
                          handleLocalChange(m.id, 'active', e.target.checked)
                        }
                        disabled={editingId !== m.id}
                      />
                      <span>{m.active ? 'Sí' : 'No'}</span>
                    </label>
                  </td>

                  {/* Acciones */}
                  <td className='px-3 py-2 text-right space-x-2'>
                    <button
                      onClick={() => setPreviewItem(m)}
                      className='text-xs text-sky-700 hover:text-sky-900'>
                      Ver
                    </button>

                    {editingId === m.id ? (
                      <>
                        <button
                          onClick={() => handleSave(m.id)}
                          disabled={savingId === m.id}
                          className='text-xs text-sky-700 hover:text-sky-900'>
                          {savingId === m.id ? 'Guardando...' : 'Guardar'}
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className='text-xs text-slate-500 hover:text-slate-700'>
                          Cancelar
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingId(m.id)}
                          className='text-xs text-sky-700 hover:text-sky-900'>
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className='text-xs text-red-600 hover:text-red-800 ml-2'>
                          Eliminar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {previewItem && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
          <div className='bg-white rounded-lg shadow-lg max-w-5xl w-full mx-4 overflow-hidden'>
            <div className='flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50'>
              <div>
                <h4 className='text-sm font-semibold text-slate-800'>
                  Previsualización
                </h4>
                <p className='text-xs text-slate-500'>
                  {previewItem.title || previewItem.file_url}
                </p>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                className='text-xs text-slate-500 hover:text-slate-800'>
                Cerrar
              </button>
            </div>

            <div className='bg-black flex items-center justify-center max-h-[80vh]'>
              {previewItem.type === 'video' ? (
                <video
                  src={getMediaSrc(previewItem.file_url)}
                  controls
                  autoPlay
                  muted
                  className='max-h-[80vh] max-w-full object-contain'
                />
              ) : (
                <img
                  src={getMediaSrc(previewItem.file_url)}
                  alt={previewItem.title || ''}
                  className='max-h-[80vh] max-w-full object-contain'
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
