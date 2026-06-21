import React, { memo } from 'react';

interface ClockProps {
  time: Date;
  is12Hour: boolean;
  showSeconds: boolean;
}

export const Clock: React.FC<ClockProps> = memo(({ time, is12Hour, showSeconds }) => {
  let hours = time.getHours();
  const isPM = hours >= 12;
  const amPmSuffix = isPM ? 'пп' : 'дп';

  if (is12Hour) {
    hours = hours % 12;
    if (hours === 0) hours = 12;
  }
  const formattedHours = hours.toString().padStart(2, '0');
  const formattedMinutes = time.getMinutes().toString().padStart(2, '0');
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const timeOnly = `${formattedHours}:${formattedMinutes}`;

  // Розрахунок розміру шрифту на основі кількості елементів
  let fontSize = '26vw';
  if (showSeconds && is12Hour) {
    fontSize = '12.5vw';
  } else if (showSeconds || is12Hour) {
    fontSize = '17vw';
  }

  const isSmall = is12Hour || showSeconds;
  const sizeClass = isSmall ? 'to-small-size' : 'to-large-size';
  
  const suffixClass = is12Hour ? 'show' : 'hide';
  const secondsClass = showSeconds ? 'show' : 'hide';

  return (
    <div className="flex flex-col items-center justify-center select-none cursor-default text-center w-full overflow-hidden">
      <div 
        style={{ fontSize }}
        className={`flex justify-center items-baseline font-mono tabular-nums font-bold text-gray-100 tracking-wider leading-none w-full transform animate-clock-enter transition-clock-size ${sizeClass} whitespace-nowrap`}
      >
        <span>{timeOnly}</span>
        <span className={`seconds-container ${secondsClass}`}>
          :{seconds}
        </span>
        <span className={`ampm-suffix ${suffixClass}`}>
          {amPmSuffix}
        </span>
      </div>
    </div>
  );
});

Clock.displayName = 'Clock';
