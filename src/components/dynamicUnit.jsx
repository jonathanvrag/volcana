import CanalClima from './canalClima';
import { Link } from 'react-router-dom';

export default function dynamicUnit() {
  return (
    <div>
      <div className='grid grid-cols-3 grid-rows-2 gap-3 h-screen w-screen'>
        <div className='bg-red-500'>
          <Link to='/'>
            <button className='w-full h-full text-white text-2xl font-bold cursor-pointer'>
              Ir a Estáticas
            </button>
          </Link>
        </div>
        <div className='bg-red-500'>2</div>
        <div className='col-start-1 row-start-2 bg-red-500'>3</div>
        <div className='col-start-2 row-start-2 bg-red-500'>4</div>
        <div className='row-span-2 col-start-3 row-start-1 bg-red-500'>
          <CanalClima />
        </div>
      </div>
    </div>
  );
}
