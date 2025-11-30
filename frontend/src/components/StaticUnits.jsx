import CanalClima from './CanalClima';
import { Link } from 'react-router-dom';

export default function staticUnits() {
  return (
    <div>
      <div className='grid grid-cols-3 grid-rows-2 gap-3 h-[504px] w-[1176px]'>
        <div className='bg-red-500'>
          <Link to='/dinamicas'>
            <button className='w-full h-full text-white text-2xl font-bold cursor-pointer'>
              Ir a Dinámicas
            </button>
          </Link>
        </div>
        <div className='bg-red-500'>2</div>
        <div className='col-start-1 row-start-2 bg-red-500'>3</div>
        <div className='col-start-2 row-start-2 bg-red-500'>4</div>
        <div className='row-span-2 col-start-3 row-start-1 bg-red-500 h-[504px] w-[280px]'>
          <CanalClima />
        </div>
      </div>
    </div>
  );
}
