export default function CmsMediaPreviewModal({ item, onClose, getMediaSrc }) {
  if (!item) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
      <div className='bg-white rounded-lg shadow-lg max-w-5xl w-full mx-4 overflow-hidden'>
        <div className='flex items-center justify-between px-4 py-2 border-b border-slate-200 bg-slate-50'>
          <div>
            <h4 className='text-sm font-semibold text-slate-800'>
              Previsualización
            </h4>
            <p className='text-xs text-slate-500'>
              {item.title || item.file_url}
            </p>
          </div>
          <button
            onClick={onClose}
            className='text-xs text-slate-500 hover:text-slate-800'>
            Cerrar
          </button>
        </div>

        <div className='bg-black flex items-center justify-center max-h-[80vh]'>
          {item.type === 'video' ? (
            <video
              src={getMediaSrc(item.file_url)}
              controls
              autoPlay
              muted
              className='max-h-[80vh] max-w-full object-contain'
            />
          ) : (
            <img
              src={getMediaSrc(item.file_url)}
              alt={item.title || ''}
              className='max-h-[80vh] max-w-full object-contain'
            />
          )}
        </div>
      </div>
    </div>
  );
}
