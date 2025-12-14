import { MapContainer, ScaleControl, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Coordenadas aproximadas de EAFIT
const EAFIT_CENTER = [6.199, -75.579];

export default function CampusMap() {
  return (
    <MapContainer
      center={EAFIT_CENTER}
      zoom={15}
      style={{ width: '100%', height: '100%' }}
      dragging={false}
      zoomControl={false}
      doubleClickZoom={true}
      scrollWheelZoom={true}
      touchZoom={true}>
      <TileLayer
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        attribution='&copy; OpenStreetMap contributors'
      />

      <ScaleControl position='bottomleft' imperial={false} />
    </MapContainer>
  );
}
