import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Carrousel from './carrousel.jsx';

export default function Map() {
  const position = [6.199, -75.579];

  return (
    <div className='relative h-full w-full'>
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={false}
        zoomControl={false}
        style={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          zIndex: '1',
        }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />
        <Marker position={position}>
          <Popup>EAFIT</Popup>
        </Marker>
      </MapContainer>
      <div className='absolute bottom-0 left-0 right-0 z-10'>
        <Carrousel />
      </div>
    </div>
  );
}
