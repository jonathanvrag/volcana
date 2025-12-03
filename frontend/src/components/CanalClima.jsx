import Map from './Map';

export default function CanalClima() {
  return (
    <div
      className='h-full w-full flex items-center justify-center bg-slate-800 rounded-xl p-4'
      style={{ position: 'relative' }}>
      <Map />
    </div>
  );
}
