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

  return (
    <div className="flex flex-col items-center justify-center select-none cursor-default text-center w-full overflow-hidden">
      <div className="flex justify-center items-baseline font-mono tabular-nums font-bold text-gray-100 tracking-wider leading-none w-full transform animate-clock-enter text-[26vw]">
        <span>{hoursAndMinutes}</span>
      </div>
    </div>
  );
});

Clock.displayName = 'Clock';
