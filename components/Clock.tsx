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

  // Розмір шрифту залежить від кількості видимих елементів
  const getVwSize = (is12: boolean, showSecs: boolean) => {
    if (showSecs && is12) return 12.5;
    if (showSecs || is12) return 17;
    return 26;
  };

  const fontSize = `${getVwSize(is12Hour, showSeconds)}vw`;
  const suffixClass = is12Hour ? 'show' : 'hide';
  const secondsClass = showSeconds ? 'show' : 'hide';

  return (
    <div className="flex flex-col items-center justify-center select-none cursor-default text-center w-full overflow-hidden">
      <div
        style={{ fontSize }}
        className="flex justify-center items-baseline font-mono tabular-nums font-bold text-gray-100 tracking-wider leading-none w-full animate-clock-enter transition-clock-size whitespace-nowrap"
      >
        <span>{timeOnly}</span>
        <span className={`collapsible ${secondsClass}`}>
          <span className="collapsible-inner">:{seconds}</span>
        </span>
        <span className={`collapsible ampm-suffix ${suffixClass}`}>
          <span className="collapsible-inner">{amPmSuffix}</span>
        </span>
      </div>
    </div>
  );
});

Clock.displayName = 'Clock';
