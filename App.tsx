import React, { useState, useEffect } from 'react';
import { Clock } from './components/Clock';
import { useCurrentTime } from './hooks/useCurrentTime';
import { useClockSettings } from './hooks/useClockSettings';
import { useProjector } from './hooks/useProjector';
import { SettingsPanel } from './components/SettingsPanel';
import {
  MonitorIcon,
  StopIcon,
  ClockIcon,
  SettingsIcon,
  MaximizeIcon,
  MinimizeIcon,
} from './components/Icons';

function App(): React.ReactNode {
  const currentTime = useCurrentTime();
  const {
    showSeconds,
    timeScale,
    dateScale,
    toggleSeconds,
    updateTimeScale,
    updateDateScale,
  } = useClockSettings();

  const {
    isProjectorView,
    isProjectorOpen,
    openProjector,
    closeProjector,
  } = useProjector();

  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- Fullscreen Logic ---
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

  // --- Render ---

  if (isProjectorView) {
    return (
      <main className="min-h-screen bg-black text-gray-100 flex flex-col items-center justify-center font-sans antialiased cursor-none">
        <Clock
          time={currentTime}
          showSeconds={showSeconds}
          timeScale={timeScale}
          dateScale={dateScale}
          onTimeScaleChange={updateTimeScale}
          onDateScaleChange={updateDateScale}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-gray-100 flex flex-col items-center justify-center font-sans antialiased">
      <div className="absolute top-5 right-5 z-10 flex flex-col items-end gap-3">
        {/* Main Controls Group */}
        <div className="flex gap-2">
          {!isProjectorOpen ? (
            <button
              onClick={openProjector}
              className="p-3 bg-black text-gray-300 font-semibold rounded-full border border-gray-700 hover:bg-gray-900 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-75 transition-colors"
              title="Відкрити годинник на другому дисплеї"
            >
              <MonitorIcon />
            </button>
          ) : (
            <button
              onClick={closeProjector}
              className="p-3 bg-black text-gray-300 font-semibold rounded-full border border-gray-700 hover:bg-gray-900 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-75 transition-colors"
              title="Закрити вікно проектора"
            >
              <StopIcon />
            </button>
          )}

          <button
            onClick={toggleSeconds}
            className="p-3 bg-black text-gray-300 font-semibold rounded-full border border-gray-700 hover:bg-gray-900 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-75 transition-colors"
            title={showSeconds ? "Приховати секунди" : "Показати секунди"}
          >
            <ClockIcon />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 font-semibold rounded-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-75 transition-colors ${
              showSettings
                ? 'bg-gray-800 text-white border-gray-500'
                : 'bg-black text-gray-300 hover:bg-gray-900 hover:border-gray-500'
            }`}
            title="Налаштування розміру"
          >
            <SettingsIcon />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <SettingsPanel
            timeScale={timeScale}
            dateScale={dateScale}
            onTimeScaleChange={updateTimeScale}
            onDateScaleChange={updateDateScale}
          />
        )}
      </div>

      <Clock
        time={currentTime}
        showSeconds={showSeconds}
        timeScale={timeScale}
        dateScale={dateScale}
        onTimeScaleChange={updateTimeScale}
        onDateScaleChange={updateDateScale}
      />

      {/* Footer / Fullscreen Toggle */}
      <button
        onClick={toggleFullscreen}
        className="absolute bottom-5 right-5 z-10 p-3 bg-black text-gray-300 font-semibold rounded-full border border-gray-700 hover:bg-gray-900 hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-75 transition-colors"
        title={isFullscreen ? "Вийти з повного екрану" : "На весь екран"}
      >
        {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
      </button>

      <footer className="absolute bottom-4 text-xs text-gray-700 pointer-events-none select-none">
        Натисніть F11 для повноекранного режиму
      </footer>
    </main>
  );
}

export default App;