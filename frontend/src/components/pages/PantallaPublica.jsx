import { useEffect, useState } from 'react';
import { fetchMediaByPlaylist } from '../../api/media';
import CampusMap from '../CampusMap.jsx';

const GROUP_SIZE = 4;
const GROUP_DURATION = 20;

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || 'http://localhost:8000';

export default function PantallaPublica({ playlistId = 1, soloVideo = false }) {
  const [groups, setGroups] = useState([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchMediaByPlaylist(playlistId);

        if (soloVideo) {
          setGroups([data]);
        } else {
          const g = [];
          for (let i = 0; i < data.length; i += GROUP_SIZE) {
            g.push(data.slice(i, i + GROUP_SIZE));
          }
          setGroups(g);
        }
        setCurrentGroupIndex(0);
      } catch (err) {
        setError(err.message || 'Error cargando contenido');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [playlistId, soloVideo]);

  useEffect(() => {
    if (groups.length === 0 || soloVideo) return;
    const timer = setTimeout(
      () => setCurrentGroupIndex(prev => (prev + 1) % groups.length),
      GROUP_DURATION * 1000
    );
    return () => clearTimeout(timer);
  }, [groups, currentGroupIndex, soloVideo]);

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-slate-50 text-slate-800'>
        <p className='text-2xl font-medium tracking-wide'>
          Cargando contenido...
        </p>
      </div>
    );
  }

  if (error || groups.length === 0) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800'>
        <div className='mb-4 text-xs uppercase tracking-[0.25em] text-sky-700'>
          Universidad EAFIT · Pantalla Innovación
        </div>
        <p className='text-xl'>
          {error || 'No hay contenido disponible para esta pantalla.'}
        </p>
      </div>
    );
  }

  const currentGroup = groups[currentGroupIndex];

  return (
    <div className='w-screen h-screen flex flex-col bg-white overflow-hidden'>
      {/* Header - más compacto para pantalla 1170x504 */}
      <header className='flex-shrink-0 h-12 px-6 flex items-center justify-between bg-[#003A6A] text-white'>
        <div className='flex items-center gap-3'>
          <div className='text-sm font-semibold tracking-[0.15em] uppercase'>
            Universidad EAFIT
          </div>
          <div className='h-4 w-px bg-white/30' />
          <div className='text-xs font-medium'>
            Punto de Monitoreo La Volcana
          </div>
        </div>
        <div className='text-[10px] tracking-[0.15em] uppercase text-sky-100'>
          Ciencia · Tecnología · Innovación
        </div>
      </header>

      {/* Contenedor principal */}
      <main className='flex-1 flex gap-2 p-2 min-h-0 overflow-hidden'>
        {/* Área de contenido - proporción 267:83 según especificaciones */}
        <div className='flex-grow' style={{ flexBasis: '267fr', minWidth: 0 }}>
          {soloVideo && currentGroup.length > 0 ? (
            // Video único
            <div className='w-full h-full bg-white flex items-center justify-center'>
              {(() => {
                const video = currentGroup[0];
                const src = video.file_url.startsWith('http')
                  ? video.file_url
                  : `${API_ORIGIN}${video.file_url}`;

                return (
                  <>
                    {video.type === 'video' ? (
                      <video
                        src={src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <img
                        src={src}
                        alt={video.title || ''}
                        className='w-full h-full object-cover'
                      />
                    )}

                    {/* Título comentado */}
                    {/* {video.title && (
                      <div className='absolute bottom-0 left-0 right-0 bg-white/60 px-2 py-1'>
                        <p className='text-[10px] font-medium text-white truncate'>
                          {video.title}
                        </p>
                      </div>
                    )} */}
                  </>
                );
              })()}
            </div>
          ) : (
            <div className='w-full h-full grid grid-cols-2 grid-rows-2 gap-1'>
              {currentGroup.map(m => {
                const src = m.file_url.startsWith('http')
                  ? m.file_url
                  : `${API_ORIGIN}${m.file_url}`;

                return (
                  <div key={m.id} className='relative bg-white overflow-hidden'>
                    {m.type === 'video' ? (
                      <video
                        src={src}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className='w-full h-full object-cover'
                      />
                    ) : (
                      <img
                        src={src}
                        alt={m.title || ''}
                        className='w-full h-full object-cover'
                      />
                    )}

                    {/* Título comentado */}
                    {/* {m.title && (
                      <div className='absolute bottom-0 left-0 right-0 bg-white/60 px-2 py-1'>
                        <p className='text-[10px] font-medium text-white truncate'>
                          {m.title}
                        </p>
                      </div>
                    )} */}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Canal Clima - 83cm de los 350cm totales */}
        <div
          className='flex-shrink-0 h-full bg-white'
          style={{ width: '23.7%', minWidth: 0 }}>
          <CampusMap />
        </div>
      </main>
    </div>
  );
}
