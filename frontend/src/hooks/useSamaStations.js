import { useEffect, useState } from 'react';
import {
  INTEREST_STATIONS,
  fetchSamaStations,
  enrichStation,
} from '../services/sama.api';

export function useSamaStations() {
  const [stations, setStations] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const all = await fetchSamaStations();
        const codes = new Set(INTEREST_STATIONS.map(s => s.code));
        const baseStations = all.filter(s => codes.has(s.codigo));

        const enriched = await Promise.all(
          baseStations.map(base => {
            const meta = INTEREST_STATIONS.find(s => s.code === base.codigo);
            if (!meta) return null;
            return enrichStation(base, meta);
          })
        );

        const clean = enriched.filter(Boolean);
        setStations(clean);
        setActiveIndex(0);
      } catch (e) {
        console.error('Error cargando estaciones SAMA', e);
      }
    }

    load();
    const interval = setInterval(load, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!stations.length) return;
    const timer = setInterval(
      () => setActiveIndex(prev => (prev + 1) % stations.length),
      10000
    );
    return () => clearInterval(timer);
  }, [stations]);

  const activeStation = stations[activeIndex] || null;

  return { stations, activeIndex, activeStation, setActiveIndex };
}
