import { useState, useEffect } from 'react';
import CanalClima from '../CanalClima';
import PanelMonitor from '../PanelMonitor';
import SciurusGranatensis from '../../assets/SciurusGranatensis.png';
import ReinitaCastaña from '../../assets/ReinitaCastaña.png';
import PristimantisAchatinus from '../../assets/PristimantisAchatinus.png';
import AtractusSp from '../../assets/AtractusSp.png';

export default function PantallaPublica() {
  const [showPanelMonitor, setShowPanelMonitor] = useState(true);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setShowPanelMonitor(prevShow => !prevShow);
    }, 20000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <div className='grid grid-cols-3 grid-rows-2 gap-4 p-4 h-screen w-screen bg-slate-900'>
        <div className='flex items-center justify-center bg-slate-800 rounded-xl p-4'>
          <img
            src={SciurusGranatensis}
            alt='Sciurus Granatensis'
            className='rounded-xl shadow-lg object-cover h-full w-full'
          />
        </div>
        <div className='flex items-center justify-center bg-slate-800 rounded-xl p-4'>
          <img
            src={ReinitaCastaña}
            alt='Reinita Castaña'
            className='rounded-xl shadow-lg object-cover h-full w-full'
          />
        </div>
        <div className='col-start-1 row-start-2 flex items-center justify-center bg-slate-800 rounded-xl p-4'>
          <img
            src={PristimantisAchatinus}
            alt='Pristimantis Achatinus'
            className='rounded-xl shadow-lg object-cover h-full w-full'
          />
        </div>
        <div className='col-start-2 row-start-2 flex items-center justify-center bg-slate-800 rounded-xl p-4'>
          <img
            src={AtractusSp}
            alt='Atractus Sp'
            className='rounded-xl shadow-lg object-cover h-full w-full'
          />
        </div>
        <div className='row-span-2 col-start-3 row-start-1'>
          {showPanelMonitor ? <PanelMonitor /> : <CanalClima />}
        </div>
      </div>
    </div>
  );
}
