export default function CmsMediaTable({
  playlists,
  media,
  loading,
  editingId,
  savingId,
  onEdit,
  onLocalChange,
  onSave,
  onDelete,
  onPreview,
}) {
  return (
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
              <td colSpan={9} className='px-3 py-4 text-center text-slate-500'>
                Cargando media...
              </td>
            </tr>
          ) : media.length === 0 ? (
            <tr>
              <td colSpan={9} className='px-3 py-4 text-center text-slate-500'>
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

                <td className='px-3 py-2 text-slate-700'>
                  {editingId === m.id ? (
                    <input
                      className='border border-slate-300 rounded px-2 py-1 text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500'
                      value={m.title || ''}
                      onChange={e =>
                        onLocalChange(m.id, 'title', e.target.value)
                      }
                    />
                  ) : (
                    m.title || '—'
                  )}
                </td>

                <td className='px-3 py-2 text-slate-600 max-w-xs truncate'>
                  {m.file_url}
                </td>

                <td className='px-3 py-2 text-slate-700'>
                  {editingId === m.id ? (
                    <input
                      type='number'
                      className='w-16 border border-slate-300 rounded px-1 py-0.5 text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500'
                      value={m.order_index}
                      onChange={e =>
                        onLocalChange(m.id, 'order_index', e.target.value)
                      }
                    />
                  ) : (
                    m.order_index
                  )}
                </td>

                <td className='px-3 py-2 text-slate-700'>
                  {editingId === m.id ? (
                    <input
                      type='number'
                      className='w-16 border border-slate-300 rounded px-1 py-0.5 text-xs bg-white text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500'
                      value={m.duration_seconds}
                      onChange={e =>
                        onLocalChange(m.id, 'duration_seconds', e.target.value)
                      }
                    />
                  ) : (
                    `${m.duration_seconds}s`
                  )}
                </td>

                <td className='px-3 py-2 text-slate-700'>
                  <label className='inline-flex items-center gap-1 text-xs'>
                    <input
                      type='checkbox'
                      checked={m.active}
                      onChange={e =>
                        onLocalChange(m.id, 'active', e.target.checked)
                      }
                      disabled={editingId !== m.id}
                    />
                    <span>{m.active ? 'Sí' : 'No'}</span>
                  </label>
                </td>

                <td className='px-3 py-2 text-right space-x-2'>
                  <button
                    onClick={() => onPreview(m)}
                    className='text-xs text-sky-700 hover:text-sky-900'>
                    Ver
                  </button>

                  {editingId === m.id ? (
                    <>
                      <button
                        onClick={() => onSave(m.id)}
                        disabled={savingId === m.id}
                        className='text-xs text-sky-700 hover:text-sky-900'>
                        {savingId === m.id ? 'Guardando...' : 'Guardar'}
                      </button>
                      <button
                        onClick={() => onEdit(null)}
                        className='text-xs text-slate-500 hover:text-slate-700'>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => onEdit(m.id)}
                        className='text-xs text-sky-700 hover:text-sky-900'>
                        Editar
                      </button>
                      <button
                        onClick={() => onDelete(m.id)}
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
  );
}
