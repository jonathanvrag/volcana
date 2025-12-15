import L from 'leaflet';

export function getNivelColor(st) {
  if (!st.umbrales || st.nivel == null) return '#2563eb';
  const n = st.nivel;
  const { rojo, naranja, amarillo } = st.umbrales;
  if (n >= rojo) return '#b91c1c';
  if (n >= naranja) return '#ea580c';
  if (n >= amarillo) return '#ca8a04';
  return '#16a34a';
}

export function buildStationIcon(st) {
  let label = st.name || st.codigo;

  if (st.dataType === 'nivel' && st.nivel != null) {
    label = `${st.nivel.toFixed(1)} cm`;
  } else if (st.dataType === 'pluvio' && st.precipitacion3h != null) {
    label = `${st.precipitacion3h.toFixed(1)} mm`;
  } else if (st.dataType === 'meteo' && st.temperatura != null) {
    label = `${st.temperatura.toFixed(1)} °C`;
  }

  const bg =
    st.dataType === 'nivel'
      ? getNivelColor(st)
      : st.dataType === 'pluvio'
      ? '#0f766e'
      : '#1d4ed8';

  const baseClasses =
    'inline-block text-white px-2 py-[2px] rounded-full text-[11px] whitespace-nowrap shadow';

  const html = `<span class="${baseClasses}" style="background:${bg}">${label}</span>`;

  return L.divIcon({
    html,
    className: '',
    iconSize: [60, 22],
  });
}
