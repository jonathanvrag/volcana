import { useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ScaleControl,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import { useSamaStations } from '../hooks/useSamaStations';
import MapAutoNavigator from './MapAutoNavigator';
import StationPopup from './StationPopup';
import { buildStationIcon } from '../utils/mapIcons';

const EAFIT_CENTER = [6.199, -75.579];

const leafletPopupStyle = `
  .leaflet-eafit-popup .leaflet-popup-content-wrapper,
  .leaflet-eafit-popup .leaflet-popup-tip {
    background: transparent;
    box-shadow: none;
    border: none;
  }
`;

export default function CampusMap() {
  const { stations, activeStation } = useSamaStations();
  const markerRefs = useRef({});

  useEffect(() => {
    if (!stations.length || !activeStation) return;

    const current = markerRefs.current[activeStation.codigo];

    Object.values(markerRefs.current).forEach(m => {
      if (m && m.closePopup) m.closePopup();
    });

    if (current && current.openPopup) current.openPopup();
  }, [stations, activeStation]);

  return (
    <>
      <style>{leafletPopupStyle}</style>
      <MapContainer
        center={EAFIT_CENTER}
        zoom={9}
        style={{ width: '100%', height: '100%' }}
        dragging
        zoomControl
        doubleClickZoom
        scrollWheelZoom
        touchZoom>
        <MapAutoNavigator station={activeStation} />

        <TileLayer
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          attribution='© OpenStreetMap contributors'
        />
        <ScaleControl position='bottomleft' imperial={false} />

        {stations.map(st => (
          <Marker
            key={st.codigo}
            position={[parseFloat(st.latitud), parseFloat(st.longitud)]}
            icon={buildStationIcon(st)}
            ref={el => {
              if (el) {
                markerRefs.current[st.codigo] = el;
              }
            }}>
            <Popup
              className='!bg-transparent !border-0 !shadow-none leaflet-eafit-popup'
              autoPan={false}
              closeButton={false}
              autoClose={false}
              closeOnClick={false}>
              <StationPopup station={st} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
}
