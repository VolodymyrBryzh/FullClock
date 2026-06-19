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

  // Обчислюємо розмір шрифту на основі вибраних елементів
  let fontSize = '26vw';
  if (is12Hour && showSeconds) {
    fontSize = '12.5vw';
  } else if (is12Hour || showSeconds) {
    fontSize = '17vw';
  }

  // Визначаємо затримку анімації:
  // Якщо є додаткові елементи (12г або секунди), годинник має зменшитись одразу,
  // а нові елементи виїхати з затримкою.
  // Якщо годинник пустий, елементи зникають одразу, а годинник збільшується з затримкою.
  const isShrinking = is12Hour || showSeconds;
  const sizeClass = isShrinking ? 'to-12h' : 'to-24h';
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
