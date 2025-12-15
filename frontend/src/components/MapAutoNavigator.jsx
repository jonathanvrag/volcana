import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export default function MapAutoNavigator({ station }) {
  const map = useMap();

  useEffect(() => {
    if (!station) return;
    const lat = parseFloat(station.latitud);
    const lng = parseFloat(station.longitud);

    map.flyTo([lat, lng], 11, {
      animate: true,
      duration: 3,
    });
  }, [station, map]);

  return null;
}
