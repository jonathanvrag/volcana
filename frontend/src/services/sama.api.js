const SIGRAN_BASE = 'https://sigran.antioquia.gov.co/api/v1/estaciones';

export const INTEREST_STATIONS = [
  // Nivel
  { code: 'sn_1044', type: 'nivel', name: 'Venecia - Suroeste' },
  { code: 'sn_1040', type: 'nivel', name: 'La Ceja - Oriente' },
  { code: 'sn_1043', type: 'nivel', name: 'Rionegro - Oriente' },
  { code: 'sn_1016', type: 'nivel', name: 'Marinilla - Oriente' },
  { code: 'sn_1004', type: 'nivel', name: 'San Pedro de los Milagros - Norte' },
  { code: 'sn_1018', type: 'nivel', name: 'Don Matías - Norte' },
  { code: 'sn_1051', type: 'nivel', name: 'Santo Domingo - Norte' },
  { code: 'sn_1033', type: 'nivel', name: 'Cisneros - Nordeste (sn_1033)' },
  { code: 'sn_1034', type: 'nivel', name: 'Cisneros - Nordeste (sn_1034)' },
  { code: 'sn_1035', type: 'nivel', name: 'San Carlos - Oriente (sn_1035)' },
  { code: 'sn_1036', type: 'nivel', name: 'San Carlos - Oriente (sn_1036)' },

  // Pluvio
  { code: 'sp_105', type: 'pluvio', name: 'San Pedro de los Milagros - Norte' },
  { code: 'sp_157', type: 'pluvio', name: 'Bello - Valle de Aburrá' },
  { code: 'sp_158', type: 'pluvio', name: 'Rionegro - Oriente' },
  { code: 'sp_155', type: 'pluvio', name: 'La Ceja - Oriente' },
  { code: 'sp_146', type: 'pluvio', name: 'Marinilla - Oriente' },
  { code: 'sp_140', type: 'pluvio', name: 'Santo Domingo - Nordeste' },
  { code: 'sp_133', type: 'pluvio', name: 'Cisneros - Nordeste (sp_133)' },
  { code: 'sp_134', type: 'pluvio', name: 'Cisneros - Nordeste (sp_134)' },
  { code: 'sp_135', type: 'pluvio', name: 'San Carlos - Oriente (sp_135)' },
  { code: 'sp_136', type: 'pluvio', name: 'San Carlos - Oriente (sp_136)' },

  // Met
  { code: 'sm_513', type: 'meteo', name: 'Montebello - Suroeste' },
  { code: 'sm_515', type: 'meteo', name: 'Santa Bárbara - Suroeste' },
];

export async function fetchSamaStations() {
  const res = await fetch(SIGRAN_BASE);
  const json = await res.json();
  return json.values || [];
}

export async function enrichStation(base, meta) {
  try {
    if (meta.type === 'nivel') {
      const nivelRes = await fetch(
        `${SIGRAN_BASE}/${base.codigo}/nivel/?calidad=1&size=1`
      );
      const nivelJson = await nivelRes.json();
      const nivelValue = nivelJson.values?.[0];

      const seccionRes = await fetch(`${SIGRAN_BASE}/${base.codigo}/seccion`);
      const seccionJson = await seccionRes.json();

      return {
        ...base,
        ...meta,
        dataType: 'nivel',
        nivel: nivelValue ? parseFloat(nivelValue.nivel) : null,
        caudal: nivelValue ? parseFloat(nivelValue.caudal) : null,
        fecha: nivelValue?.fecha || null,
        umbrales: {
          amarillo: seccionJson.umbral_amarillo,
          naranja: seccionJson.umbral_naranja,
          rojo: seccionJson.umbral_rojo,
          offset: seccionJson.offset,
        },
      };
    }

    if (meta.type === 'pluvio') {
      const pluRes = await fetch(
        `${SIGRAN_BASE}/${base.codigo}/precipitacion/?calidad=1&size=36`
      );
      const pluJson = await pluRes.json();
      const acum = (pluJson.values || []).reduce(
        (sum, v) => sum + parseFloat(v.muestra),
        0
      );
      const last = pluJson.values?.[0];

      return {
        ...base,
        ...meta,
        dataType: 'pluvio',
        precipitacion3h: acum,
        fecha: last?.fecha || null,
      };
    }

    if (meta.type === 'meteo') {
      const metRes = await fetch(
        `${SIGRAN_BASE}/${base.codigo}/meteorologia?size=1`
      );
      const metJson = await metRes.json();
      const v = metJson.values?.[0];

      return {
        ...base,
        ...meta,
        dataType: 'meteo',
        temperatura:
          v && v.calidad_temperatura === 1 ? parseFloat(v.temperatura) : null,
        humedad:
          v && v.calidad_humedad_relativa === 1
            ? parseFloat(v.humedad_relativa)
            : null,
        lluviaInst: v && v.calidad_lluvia === 1 ? parseFloat(v.lluvia) : null,
        fecha: v?.fecha || null,
      };
    }
  } catch (e) {
    console.error('Error cargando datos de estación', base.codigo, e);
  }

  return {
    ...base,
    ...meta,
    dataType: 'base',
  };
}
