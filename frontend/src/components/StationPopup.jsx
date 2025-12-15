export default function StationPopup({ station: st }) {
  if (!st) return null;

  return (
    <div className='inline-flex flex-col items-center'>
      <div className='min-w-[220px] max-w-xs rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden'>
        {/* Encabezado */}
        <div
          className={
            'px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white ' +
            (st.dataType === 'nivel'
              ? 'bg-emerald-700'
              : st.dataType === 'pluvio'
              ? 'bg-sky-700'
              : 'bg-indigo-700')
          }>
          {st.dataType === 'nivel' && 'ESTACIÓN DE NIVEL'}
          {st.dataType === 'pluvio' && 'ESTACIÓN PLUVIOMÉTRICA'}
          {st.dataType === 'meteo' && 'ESTACIÓN METEOROLÓGICA'}
        </div>

        <div className='px-3 py-2.5 text-slate-900'>
          <div className='text-sm font-semibold leading-snug'>{st.name}</div>
          <div className='text-[11px] text-slate-500 mb-2'>{st.ubicacion}</div>

          <div className='space-y-1.5 text-[13px]'>
            {st.dataType === 'nivel' && (
              <>
                <div className='flex justify-between'>
                  <span className='text-slate-600'>Nivel</span>
                  <span className='font-semibold'>
                    {st.nivel != null ? `${st.nivel} cm` : '—'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-slate-600'>Caudal</span>
                  <span className='font-semibold'>
                    {st.caudal != null ? `${st.caudal} m³/s` : '—'}
                  </span>
                </div>
                <div className='mt-1.5 text-[11px] text-slate-600'>
                  Umbrales (cm):{' '}
                  <span className='font-semibold text-amber-600'>
                    A {st.umbrales.amarillo}
                  </span>{' '}
                  ·{' '}
                  <span className='font-semibold text-orange-600'>
                    N {st.umbrales.naranja}
                  </span>{' '}
                  ·{' '}
                  <span className='font-semibold text-red-600'>
                    R {st.umbrales.rojo}
                  </span>
                </div>
              </>
            )}

            {st.dataType === 'pluvio' && (
              <div className='flex justify-between'>
                <span className='text-slate-600'>Prec. 3 horas</span>
                <span className='font-semibold'>
                  {st.precipitacion3h != null
                    ? `${st.precipitacion3h.toFixed(1)} mm`
                    : '—'}
                </span>
              </div>
            )}

            {st.dataType === 'meteo' && (
              <>
                <div className='flex justify-between'>
                  <span className='text-slate-600'>Temperatura</span>
                  <span className='font-semibold'>
                    {st.temperatura != null ? `${st.temperatura} °C` : '—'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-slate-600'>Humedad relativa</span>
                  <span className='font-semibold'>
                    {st.humedad != null ? `${st.humedad} %` : '—'}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-slate-600'>Lluvia inst.</span>
                  <span className='font-semibold'>
                    {st.lluviaInst != null ? `${st.lluviaInst} mm` : '—'}
                  </span>
                </div>
              </>
            )}
          </div>

          {st.fecha && (
            <div className='mt-2.5 pt-1 border-t border-slate-100 text-[10px] text-slate-500'>
              Último dato:&nbsp;
              {new Date(st.fecha).toLocaleString('es-CO', {
                dateStyle: 'short',
                timeStyle: 'short',
              })}
            </div>
          )}
        </div>
      </div>

      {/* Triángulo */}
      <div className='w-0 h-0 border-x-[10px] border-x-transparent border-t-[10px] border-t-white' />
    </div>
  );
}
