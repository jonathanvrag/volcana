import { useEffect, useState } from 'react';
import { fetchMediaByPlaylist } from '../../api/media';

const PLAYLIST_LED_ID = 1;
const GROUP_SIZE = 4;
const GROUP_DURATION = 20;

export default function PantallaPublica() {
  const [groups, setGroups] = useState([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError('');
        const data = await fetchMediaByPlaylist(PLAYLIST_LED_ID);

        const g = [];
        for (let i = 0; i < data.length; i += GROUP_SIZE) {
          g.push(data.slice(i, i + GROUP_SIZE));
        }
        setGroups(g);
        setCurrentGroupIndex(0);
      } catch (err) {
        setError(err.message || 'Error cargando contenido');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (groups.length === 0) return;
    const timer = setTimeout(
      () => setCurrentGroupIndex(prev => (prev + 1) % groups.length),
      GROUP_DURATION * 1000
    );
    return () => clearTimeout(timer);
  }, [groups, currentGroupIndex]);

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
    <div className='min-h-screen w-full flex flex-col bg-slate-50 text-slate-900'>
      {/* Header */}
      <header className='h-14 px-10 flex items-center justify-between bg-[#003A6A] text-white'>
        <div className='flex items-center gap-3'>
          <div className='text-base font-semibold tracking-[0.18em] uppercase'>
            Universidad EAFIT
          </div>
          <div className='h-6 w-px bg-white/30' />
          <div className='text-sm font-medium'>
            Punto de Monitoreo La Volcana
          </div>
        </div>
        <div className='text-xs tracking-[0.18em] uppercase text-sky-100'>
          Ciencia · Tecnología · Innovación
        </div>
      </header>

      {/* Contenedor central */}
      <main className='flex-1 px-6 py-4 md:px-10 md:py-6'>
        <div className='h-[90vh] w-auto rounded-lg bg-white shadow-sm border border-slate-200 p-3 md:p-4'>
          <div className='h-[86vh] w-auto grid grid-cols-2 grid-rows-2 gap-3'>
            {currentGroup.map(m => (
              <div
                key={m.id}
                className='relative bg-slate-900 rounded-md overflow-hidden flex items-center justify-center'>
                {m.type === 'video' ? (
                  <video
                    src={m.file_url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className='w-full h-full object-contain bg-black'
                  />
                ) : (
                  <img
                    src={m.file_url}
                    alt={m.title || ''}
                    className='w-full h-full object-contain bg-black'
                  />
                )}

                {m.title && (
                  <div className='absolute bottom-0 left-0 right-0 bg-black/55 px-3 py-1.5'>
                    <p className='text-xs md:text-sm font-medium text-slate-50'>
                      {m.title}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
