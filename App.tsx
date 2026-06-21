import React, { useState, useEffect } from 'react';
import { useCurrentTime } from './hooks/useCurrentTime.ts';
import { Clock } from './components/Clock.tsx';
import {
  MaximizeIcon,
  MinimizeIcon,
  GithubIcon,
  ToggleTo12Icon,
  ToggleTo24Icon,
  ToggleShowSecondsIcon,
  ToggleHideSecondsIcon
} from './components/Icons.tsx';

function App(): React.ReactNode {
  const currentTime = useCurrentTime();
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Зчитуємо початкове значення з localStorage
  const [is12Hour, setIs12Hour] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('clock_is_12_hour');
      return stored !== null ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  const [showSeconds, setShowSeconds] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('clock_show_seconds');
      return stored !== null ? JSON.parse(stored) : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((e) => {
        console.error(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const handleToggleFormat = () => {
    setIs12Hour((prev) => {
      const newValue = !prev;
      localStorage.setItem('clock_is_12_hour', JSON.stringify(newValue));
      return newValue;
    });
  };

  const handleToggleSeconds = () => {
    setShowSeconds((prev) => {
      const newValue = !prev;
      localStorage.setItem('clock_show_seconds', JSON.stringify(newValue));
      return newValue;
    });
  };

  return (
    <main className="min-h-screen bg-black text-gray-100 flex flex-col items-center justify-center font-sans antialiased relative">
      <Clock time={currentTime} is12Hour={is12Hour} showSeconds={showSeconds} />

      {/* Кнопка-посилання на GitHub */}
      <a
        href="https://github.com/VolodymyrBryzh/FullClock"
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-5 left-5 z-10 p-3 bg-black text-gray-400 font-semibold rounded-full border border-gray-800 hover:bg-gray-950 hover:text-gray-100 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-75 transition-all"
        title="Відкрити GitHub репозиторій"
      >
        <GithubIcon />
      </a>

      {/* Панель керування у правому кутку */}
      <div className="absolute bottom-5 right-5 z-10 flex gap-3">
        {/* Кнопка перемикання секунд */}
        <button
          onClick={handleToggleSeconds}
          className="p-3 bg-black text-gray-400 font-semibold rounded-full border border-gray-800 hover:bg-gray-950 hover:text-gray-100 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-75 transition-all"
          title={showSeconds ? "Вимкнути показ секунд" : "Увімкнути показ секунд"}
        >
          {showSeconds ? <ToggleHideSecondsIcon /> : <ToggleShowSecondsIcon />}
        </button>

        {/* Кнопка перемикання 12/24 */}
        <button
          onClick={handleToggleFormat}
          className="p-3 bg-black text-gray-400 font-semibold rounded-full border border-gray-800 hover:bg-gray-950 hover:text-gray-100 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-75 transition-all"
          title={is12Hour ? "Перемкнути на 24-годинний формат" : "Перемкнути на 12-годинний формат"}
        >
          {is12Hour ? <ToggleTo24Icon /> : <ToggleTo12Icon />}
        </button>

        {/* Кнопка повноекранного режиму */}
        <button
          onClick={toggleFullscreen}
          className="p-3 bg-black text-gray-400 font-semibold rounded-full border border-gray-800 hover:bg-gray-950 hover:text-gray-100 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-75 transition-all"
          title={isFullscreen ? "Вийти з повного екрану" : "На весь екран"}
        >
          {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
        </button>
      </div>
    </main>
  );
}

export default App;
