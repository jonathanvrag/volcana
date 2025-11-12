import React from 'react';

const dashboardData = [
  {
    title: 'Cámara',
    type: 'camera',
    value:
      'https://siata.gov.co/ultimasFotosCamaras/ultimacam_nivel_eafit.jpg?0',
  },
  {
    title: 'Sensor de Nivel',
    type: 'level',
    value: 75,
  },
  {
    title: 'Variables de Estación Meteorológica',
    type: 'station',
    variables: [
      { icon: '🌡️', label: 'Temperatura', value: '26.3 °C' },
      { icon: '💨', label: 'Viento', value: '12.4 km/h' },
      { icon: '🕒', label: 'Presión', value: '1013 hPa' },
      { icon: '💧', label: 'Humedad', value: '68%' },
    ],
  },
  {
    title: 'Sensor de Humedad del Suelo',
    type: 'soil',
    value: 45,
  },
  {
    title: 'Pluviómetro',
    type: 'rain',
    value: '12.4 mm',
  },
];

export default function PanelMonitor({ data = dashboardData }) {
  return (
    <div className='bg-slate-900 h-full flex justify-center items-center'>
      <div className='bg-slate-800 rounded-xl p-4 w-full max-w-lg grid grid-cols-2 gap-4'>
        {data.map((item, idx) => {
          if (item.type === 'camera') {
            return (
              <div
                key={idx}
                className='col-span-1 bg-slate-700 rounded-lg p-3 flex flex-col'>
                <span className='text-white text-lg font-semibold mb-2'>
                  {item.title}
                </span>
                <img
                  alt='Cámara del río'
                  src={item.value}
                  className='rounded-md h-28 object-cover'
                />
              </div>
            );
          }
          if (item.type === 'level') {
            return (
              <div
                key={idx}
                className='col-span-1 bg-slate-700 rounded-lg p-3 flex flex-col items-center justify-center'>
                <span className='text-white text-lg font-semibold'>
                  {item.title}
                </span>
                <div className='w-full my-3 h-4 bg-slate-600 rounded-full'>
                  <div
                    className='h-full bg-blue-500 rounded-full'
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <span className='text-white text-2xl font-bold'>
                  {item.value}%
                </span>
              </div>
            );
          }
          if (item.type === 'station') {
            return (
              <div
                key={idx}
                className='col-span-2 bg-slate-700 rounded-lg p-3 flex flex-col mb-2'>
                <span className='text-white text-lg font-semibold mb-2'>
                  {item.title}
                </span>
                <div className='flex justify-between text-white'>
                  {item.variables.map((x, ix) => (
                    <div key={ix} className='flex flex-col items-center'>
                      <span className='text-2xl'>{x.icon}</span>
                      <span className='font-bold'>{x.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
          if (item.type === 'soil') {
            return (
              <div
                key={idx}
                className='bg-slate-700 rounded-lg p-3 flex flex-col items-center justify-center'>
                <span className='text-white text-lg font-semibold mb-2'>
                  {item.title}
                </span>
                <div className='relative w-20 h-20 flex items-center justify-center mb-1'>
                  <svg viewBox='0 0 36 36' className='w-full h-full'>
                    <path
                      d='M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831'
                      fill='none'
                      stroke='#3b82f6'
                      strokeWidth='3'
                      strokeDasharray={`${item.value}, ${100 - item.value}`}
                    />
                    <text
                      x='18'
                      y='22'
                      textAnchor='middle'
                      fill='#fff'
                      fontSize='10px'>
                      {item.value}%
                    </text>
                  </svg>
                </div>
                <span className='text-white font-bold text-xl'>
                  {item.value}%
                </span>
              </div>
            );
          }
          if (item.type === 'rain') {
            return (
              <div
                key={idx}
                className='bg-slate-700 rounded-lg p-3 flex flex-col items-center justify-center'>
                <span className='text-white text-lg font-semibold mb-2'>
                  {item.title}
                </span>
                <span className='text-3xl mb-2'>🌧️</span>
                <span className='text-white font-bold text-xl'>
                  {item.value}
                </span>
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
