import React, { useState, useEffect } from 'react';
import { useCurrentTime } from './hooks/useCurrentTime.ts';
import { Clock } from './components/Clock.tsx';
import { MaximizeIcon, MinimizeIcon } from './components/Icons.tsx';

function App(): React.ReactNode {
  const currentTime = useCurrentTime();
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  return (
    <main className="min-h-screen bg-black text-gray-100 flex flex-col items-center justify-center font-sans antialiased relative">
      <Clock time={currentTime} />

      {/* Кнопка повноекранного режиму */}
      <button
        onClick={toggleFullscreen}
        className="absolute bottom-5 right-5 z-10 p-3 bg-black text-gray-400 font-semibold rounded-full border border-gray-800 hover:bg-gray-950 hover:text-gray-100 hover:border-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-opacity-75 transition-all"
        title={isFullscreen ? "Вийти з повного екрану" : "На весь екран"}
      >
        {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
      </button>
    </main>
  );
}

export default App;
