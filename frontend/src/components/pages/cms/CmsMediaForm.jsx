export default function CmsMediaForm({
  playlists,
  playlistId,
  setPlaylistId,
  type,
  setType,
  title,
  setTitle,
  fileUrl,
  setFileUrl,
  orderIndex,
  setOrderIndex,
  duration,
  setDuration,
  creating,
  uploading,
  uploadProgress,
  onCreate,
  onFileSelect,
  fileInputRef,
}) {
  return (
    <form
      onSubmit={onCreate}
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

      <div className='grid gap-3 md:grid-cols-3'>
        <div className='flex flex-col gap-1'>
          <label className='text-xs font-medium text-slate-600'>
            Archivo (imagen o video)
          </label>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*,video/*'
            onChange={onFileSelect}
            className='hidden'
          />
          <button
            type='button'
            onClick={() => fileInputRef.current && fileInputRef.current.click()}
            disabled={uploading}
            className='inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed'>
            Seleccionar archivo
          </button>

          {/* Barra de progreso */}
          {uploading && (
            <div className='mt-2 space-y-1'>
              <div className='flex items-center justify-between text-[11px] text-slate-600'>
                <span>Subiendo archivo...</span>
                <span className='font-medium'>{uploadProgress}%</span>
              </div>
              <div className='w-full bg-slate-200 rounded-full h-2 overflow-hidden'>
                <div
                  className='bg-sky-600 h-2 rounded-full transition-all duration-300 ease-out'
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {!uploading && fileUrl.startsWith('/media/') && (
            <p className='text-[11px] text-slate-500 mt-1 truncate'>
              ✓ Archivo subido: {fileUrl.replace('/media/', '')}
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
        disabled={creating || uploading || !playlistId || !fileUrl.trim()}
        className='inline-flex items-center px-3 py-1.5 text-sm font-medium rounded bg-sky-700 text-white hover:bg-sky-800 disabled:opacity-60 disabled:cursor-not-allowed'>
        {creating ? 'Creando...' : 'Crear media'}
      </button>
    </form>
  );
}
