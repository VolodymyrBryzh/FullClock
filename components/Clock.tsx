import React, { memo, useRef, useEffect } from 'react';

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

  // Обчислення розміру макету для відстеження напрямку зміни
  const getVwSize = (is12: boolean, showSecs: boolean) => {
    if (showSecs && is12) return 12.5;
    if (showSecs || is12) return 17;
    return 26;
  };

  const currentVw = getVwSize(is12Hour, showSeconds);
  const prevVwRef = useRef(currentVw);
  const prevVw = prevVwRef.current;

  useEffect(() => {
    prevVwRef.current = currentVw;
  }, [currentVw]);

  // Якщо макет збільшується (currentVw > prevVw), затримуємо зміну розміру годинника,
  // щоб спочатку встигли сховатися елементи, які вимикаються.
  const sizeDelay = currentVw > prevVw ? '0.3s' : '0s';
  const showDelay = '0.4s';
  const hideDelay = '0s';

  const fontSize = `${currentVw}vw`;
  const suffixClass = is12Hour ? 'show' : 'hide';
  const secondsClass = showSeconds ? 'show' : 'hide';

  // CSS змінні для точного керування порядком анімації ширини та прозорості
  const suffixStyles = (is12Hour ? {
    '--width-delay': showDelay,
    '--opacity-delay': showDelay,
    '--transform-delay': showDelay,
  } : {
    '--width-delay': hideDelay,
    '--opacity-delay': hideDelay,
    '--transform-delay': hideDelay,
  }) as React.CSSProperties;

  const secondsStyles = (showSeconds ? {
    '--width-delay': showDelay,
    '--opacity-delay': showDelay,
    '--transform-delay': showDelay,
  } : {
    '--width-delay': hideDelay,
    '--opacity-delay': hideDelay,
    '--transform-delay': hideDelay,
  }) as React.CSSProperties;

  return (
    <div className="flex flex-col items-center justify-center select-none cursor-default text-center w-full overflow-hidden">
      <div 
        style={{ fontSize, transitionDelay: sizeDelay }}
        className="flex justify-center items-baseline font-mono tabular-nums font-bold text-gray-100 tracking-wider leading-none w-full transform animate-clock-enter transition-clock-size whitespace-nowrap"
      >
        <span>{timeOnly}</span>
        <span 
          style={secondsStyles}
          className={`seconds-container ${secondsClass}`}
        >
          :{seconds}
        </span>
        <span 
          style={suffixStyles}
          className={`ampm-suffix ${suffixClass}`}
        >
          {amPmSuffix}
        </span>
      </div>
    </div>
  );
});

Clock.displayName = 'Clock';
