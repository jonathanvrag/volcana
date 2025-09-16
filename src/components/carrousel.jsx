import React, { useState, useEffect } from 'react';

export default function Carrousel() {
  const items = ['1', '2', '3', '4', '5', '6'];
  const itemsPerBlock = 3;
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);

  const blocks = [];
  for (let i = 0; i < items.length; i += itemsPerBlock) {
    blocks.push(items.slice(i, i + itemsPerBlock));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBlockIndex(prevIndex => (prevIndex + 1) % blocks.length);
      // }, 20000); // 20 segundos
    }, 2000); // 20 segundos

    return () => clearInterval(interval);
  }, [blocks.length]);

  return (
    <div className='relative w-full max-w-lg mx-auto mt-4 bg-white'>
      <div className='overflow-hidden relative h-22 flex items-center justify-center'>
        <div
          className='flex transition-transform ease-out duration-500'
          style={{ transform: `translateX(-${currentBlockIndex * 100}%)` }}>
          {blocks.map((block, blockIndex) => (
            <div
              key={blockIndex}
              className='w-full flex-shrink-0 flex justify-center items-center gap-4'>
              {block.map((item, itemIndex) => (
                <div
                  key={itemIndex}
                  className='w-16 h-16 flex-shrink-0 flex items-center justify-center bg-blue-950 rounded-full text-4xl'>
                  {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
