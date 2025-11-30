import React, { useState, useEffect } from 'react';

export default function Carrousel() {
  const weatherMap = {
    '☀️': 'Soleado',
    '🌦️': 'Llovizna',
    '⛈️': 'Tormenta',
    '🌧️': 'Lluvia',
    '🌤️': 'Parcialmente Nublado',
    '☁️': 'Nublado',
  };

  const items = ['☀️', '🌦️', '⛈️', '🌧️', '🌤️', '☁️'];
  const itemsPerBlock = 3;
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);

  const blocks = [];
  for (let i = 0; i < items.length; i += itemsPerBlock) {
    blocks.push(items.slice(i, i + itemsPerBlock));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBlockIndex(prevIndex => (prevIndex + 1) % blocks.length);
    }, 20000); // 20 segundos
    // }, 2000); // 20 segundos

    return () => clearInterval(interval);
  }, [blocks.length]);

  return (
    <div className='relative w-full max-w-lg mx-auto bg-slate-800/80 backdrop-blur-sm rounded-xl shadow-lg'>
      <div className='overflow-hidden relative h-28 flex items-center justify-center pt-4 pb-6'>
        <div
          className='flex transition-transform ease-out duration-500'
          style={{ transform: `translateX(-${currentBlockIndex * 100}%)` }}>
          {blocks.map((block, blockIndex) => (
            <div
              key={blockIndex}
              className='w-full flex-shrink-0 flex justify-around items-center px-4'>
              {block.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className='flex flex-col items-center text-center gap-2 w-24'>
                  <div className='w-16 h-16 flex-shrink-0 flex items-center justify-center bg-slate-700/50 rounded-full text-4xl shadow-md'>
                    {item}
                  </div>
                  <span className='text-white text-sm font-medium'>
                    {weatherMap[item]}
                  </span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
