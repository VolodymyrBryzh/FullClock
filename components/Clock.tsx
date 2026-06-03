import React, { memo, useEffect, useState, useRef, useCallback } from 'react';

interface ClockProps {
  time: Date;
  showSeconds: boolean;
  timeScale: number;
  dateScale: number;
  onTimeScaleChange?: (scale: number) => void;
  onDateScaleChange?: (scale: number) => void;
}

const dateFormatter = new Intl.DateTimeFormat('uk-UA', {
  weekday: 'short',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

// Helper hook to handle pinch-to-zoom logic
const usePinchZoom = (
  currentScale: number, 
  onScaleChange: ((scale: number) => void) | undefined
) => {
  const touchState = useRef<{ startDist: number; startScale: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && onScaleChange) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchState.current = {
        startDist: dist,
        startScale: currentScale,
      };
    }
  }, [currentScale, onScaleChange]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchState.current && onScaleChange) {
      // Prevent browser default zoom
      // Note: touch-action: none should be set in CSS for this to work best
      
      const currentDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      
      const distDiff = currentDist - touchState.current.startDist;
      
      // Sensitivity factor: 500px pinch spread = 1.0 scale change
      const sensitivity = 500; 
      const newScale = touchState.current.startScale + (distDiff / sensitivity);
      
      onScaleChange(newScale);
    }
  }, [onScaleChange]);

  const handleTouchEnd = useCallback(() => {
    touchState.current = null;
  }, []);

  return { handleTouchStart, handleTouchMove, handleTouchEnd };
};

export const Clock: React.FC<ClockProps> = memo(({ 
  time, 
  showSeconds, 
  timeScale, 
  dateScale,
  onTimeScaleChange,
  onDateScaleChange
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the fade-in effect shortly after mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Pinch handlers for Time
  const { 
    handleTouchStart: onTimeTouchStart, 
    handleTouchMove: onTimeTouchMove, 
    handleTouchEnd: onTimeTouchEnd 
  } = usePinchZoom(timeScale, onTimeScaleChange);

  // Pinch handlers for Date
  const { 
    handleTouchStart: onDateTouchStart, 
    handleTouchMove: onDateTouchMove, 
    handleTouchEnd: onDateTouchEnd 
  } = usePinchZoom(dateScale, onDateScaleChange);

  // Отримуємо години та хвилини (наприклад, "14:05")
  const hoursAndMinutes = time.toLocaleTimeString('uk-UA', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  // Отримуємо секунди (наприклад, "09")
  const seconds = time.getSeconds().toString().padStart(2, '0');
  const formattedDate = dateFormatter.format(time);

  // Розраховуємо динамічні стилі для розміру шрифту.
  // Якщо секунди включені (8 символів), нам потрібен менший множник vw, щоб вмістити текст.
  // Якщо секунди вимкнені (5 символів), ми можемо дозволити значно більший шрифт (26vw).
  // 17vw * 8 символів ≈ 136% ширини (але з урахуванням пропорцій шрифту ~0.6, це ≈ 82% екрану, що безпечно)
  const baseVw = showSeconds ? 17 : 26;

  const timeStyle = {
    fontSize: `clamp(${6 * timeScale}rem, ${baseVw * timeScale}vw, ${80 * timeScale}rem)`,
    touchAction: 'none' as const, // Important for reliable gesture handling
  };

  const dateStyle = {
    fontSize: `clamp(${1.25 * dateScale}rem, ${2.5 * dateScale}vw, ${3 * dateScale}rem)`,
    touchAction: 'none' as const,
  };

  return (
    <div className="flex flex-col items-center justify-center select-none cursor-default text-center w-full overflow-hidden">
      {/* 
        Time Container Animation:
        - transition duration-1000 ease-out: Standard properties (opacity, transform) animate smoothly for entrance.
          Font-size updates instantly for responsive slider behavior.
        - scale-90 -> scale-100: Ефект наближення
        - opacity-0 -> opacity-100: Поява
      */}
      <div 
        style={timeStyle}
        onTouchStart={onTimeTouchStart}
        onTouchMove={onTimeTouchMove}
        onTouchEnd={onTimeTouchEnd}
        onTouchCancel={onTimeTouchEnd}
        className={`
          flex justify-center items-baseline font-mono tabular-nums font-bold text-gray-100 tracking-wider leading-none w-full
          transform transition duration-1000 ease-out
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
        `}
      >
        <span>{hoursAndMinutes}</span>
        
        {/* Контейнер для секунд з анімацією ширини та прозорості */}
        <span 
          className={`overflow-hidden transition-all duration-500 ease-in-out flex justify-start ${
            showSeconds 
              ? 'max-w-[4ch] opacity-100 translate-x-0' 
              : 'max-w-0 opacity-0 -translate-x-4'
          }`}
          aria-hidden={!showSeconds}
        >
          :{seconds}
        </span>
      </div>

      {/* 
        Date Container Animation:
        - delay-300: Дата з'являється трохи пізніше за час
        - translate-y-8 -> translate-y-0: Ефект спливання знизу
      */}
      <div 
        style={dateStyle}
        onTouchStart={onDateTouchStart}
        onTouchMove={onDateTouchMove}
        onTouchEnd={onDateTouchEnd}
        onTouchCancel={onDateTouchEnd}
        className={`
          font-sans text-gray-400 uppercase tracking-widest mt-4
          transform transition duration-1000 delay-300 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        {formattedDate}
      </div>
    </div>
  );
});

Clock.displayName = 'Clock';