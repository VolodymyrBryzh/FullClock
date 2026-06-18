import React, { memo } from 'react';

interface ClockProps {
  time: Date;
  is12Hour: boolean;
}

export const Clock: React.FC<ClockProps> = memo(({ time, is12Hour }) => {
  const hoursAndMinutes = time.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: is12Hour
  });

  const fontSize = is12Hour ? '17vw' : '26vw';

  return (
    <div className="flex flex-col items-center justify-center select-none cursor-default text-center w-full overflow-hidden">
      <div 
        style={{ fontSize }}
        className="flex justify-center items-baseline font-mono tabular-nums font-bold text-gray-100 tracking-wider leading-none w-full transform animate-clock-enter transition-font-size whitespace-nowrap"
      >
        <span>{hoursAndMinutes}</span>
      </div>
    </div>
  );
});

Clock.displayName = 'Clock';
