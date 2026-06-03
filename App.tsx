import React, { useState, useEffect, useCallback } from 'react';
import { Clock } from './components/Clock';
import { useCurrentTime } from './hooks/useCurrentTime';
import ClockSvg from "./img/Clock.svg";
import FullscreenSvg from "./img/Fullscreen.svg";
import ProjectorSvg from "./img/Projector.svg";
import FullscreenExitSvg from "./img/FullscreenExit.svg";
import SettingsHelperSvg from "./img/SettingsHelper.svg";

// Icons
const MonitorIcon = () => (
  <img src={ProjectorSvg} alt="Monitor" width={24} height={24} />
);

const StopIcon = () => (
  <img src={FullscreenExitSvg} alt="Stop" width={24} height={24} />
);

const ClockIcon = ({ showSeconds }: { showSeconds: boolean }) => (
  <img src={ClockSvg} alt="Clock" width={24} height={24} />
);

const SettingsIcon = () => (
  <img src={SettingsHelperSvg} alt="Settings" width={24} height={24} />
);

const MaximizeIcon = () => (
  <img src={FullscreenSvg} alt="Maximize" width={24} height={24} />
);

const MinimizeIcon = () => (
  <img src={FullscreenExitSvg} alt="Minimize" width={24} height={24} />
);

// Type definitions for the Window Management API
interface ScreenDetailed extends Screen {
  isPrimary: boolean;
  left: number;
  top: number;
}

interface ScreenDetails {
  screens: readonly ScreenDetailed[];
  currentScreen: ScreenDetailed;
}

declare global {
  interface Window {
    getScreenDetails?(): Promise<ScreenDetails>;
  }
}

function App(): React.ReactNode {
  const currentTime = useCurrentTime();
  const [projectorWindow, setProjectorWindow] = useState<Window | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // --- State Initialization with LocalStorage ---

  const [showSeconds, setShowSeconds] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('clock_show_seconds');
      return stored !== null ? JSON.parse(stored) : true;
    } catch { return true; }
  });

  const [timeScale, setTimeScale] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('clock_time_scale');
      const val = stored !== null ? parseFloat(stored) : 1;
      // Clamp between 0.1 and 1
      return Math.min(Math.max(val, 0), 1);
    } catch { return 1; }
  });

  const [dateScale, setDateScale] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('clock_date_scale');
      const val = stored !== null ? parseFloat(stored) : 1;
      // Clamp between 0.1 and 1
      return Math.min(Math.max(val, 0), 1);
    } catch { return 1; }
  });

  // --- Synchronization Logic ---

  // Listen for storage changes to sync settings across windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'clock_show_seconds' && e.newValue) {
        setShowSeconds(JSON.parse(e.newValue));
      } else if (e.key === 'clock_time_scale' && e.newValue) {
        const val = parseFloat(e.newValue);
        setTimeScale(Math.min(Math.max(val, 0), 1));
      } else if (e.key === 'clock_date_scale' && e.newValue) {
        const val = parseFloat(e.newValue);
        setDateScale(Math.min(Math.max(val, 0), 1));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Update handlers
  const toggleSeconds = useCallback(() => {
    const newValue = !showSeconds;
    setShowSeconds(newValue);
    localStorage.setItem('clock_show_seconds', JSON.stringify(newValue));
  }, [showSeconds]);

  // Unified update functions for both sliders and touch gestures
  const updateTimeScale = useCallback((newValue: number) => {
    const clamped = Math.min(Math.max(newValue, 0), 1);
    setTimeScale(clamped);
    localStorage.setItem('clock_time_scale', clamped.toString());
  }, []);

  const updateDateScale = useCallback((newValue: number) => {
    const clamped = Math.min(Math.max(newValue, 0), 1);
    setDateScale(clamped);
    localStorage.setItem('clock_date_scale', clamped.toString());
  }, []);

  const handleTimeScaleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateTimeScale(parseFloat(e.target.value));
  }, [updateTimeScale]);

  const handleDateScaleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateDateScale(parseFloat(e.target.value));
  }, [updateDateScale]);

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
      document.documentElement.requestFullscreen().catch(e => {
        console.error(`Error attempting to enable full-screen mode: ${e.message} (${e.name})`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // --- Projector Window Logic ---

  const urlParams = new URLSearchParams(window.location.search);
  const isProjectorView = urlParams.get('mode') === 'projector';

  useEffect(() => {
    if (!isProjectorView) return;
    const channel = new BroadcastChannel('clock_control');
    channel.onmessage = (event) => {
      if (event.data === 'close') {
        window.close();
      }
    };
    return () => channel.close();
  }, [isProjectorView]);

  const openProjector = useCallback(async () => {
    if (projectorWindow && !projectorWindow.closed) {
      projectorWindow.focus();
      return;
    }

    if (!window.getScreenDetails) {
      alert('Ваш браузер не підтримує Window Management API, який необхідний для проектування на другий екран.');
      return;
    }

    try {
      const details: ScreenDetails = await window.getScreenDetails();
      const secondaryScreen = details.screens.find(s => !s.isPrimary);

      if (!secondaryScreen) {
        alert('Другий екран не виявлено. Підключіть інший дисплей і спробуйте ще раз.');
        return;
      }

      const { left, top, width, height } = secondaryScreen;
      const features = `left=${left},top=${top},width=${width},height=${height},popup=yes,noopener,noreferrer`;

      const newWindow = window.open('/?mode=projector', 'projector-clock', features);
      setProjectorWindow(newWindow);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'NotAllowedError') {
        alert('Дозвіл на керування вікнами було відхилено.');
      } else {
        console.error("Помилка відкриття вікна проектора:", err);
      }
    }
  }, [projectorWindow]);

  const closeProjector = useCallback(() => {
    if (projectorWindow) projectorWindow.close();
    const channel = new BroadcastChannel('clock_control');
    channel.postMessage('close');
    channel.close();
    setProjectorWindow(null);
  }, [projectorWindow]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (projectorWindow && projectorWindow.closed) {
        setProjectorWindow(null);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [projectorWindow]);

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

  const isProjectorOpen = projectorWindow && !projectorWindow.closed;

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
            <ClockIcon showSeconds={showSeconds} />
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-3 font-semibold rounded-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-opacity-75 transition-colors ${showSettings ? 'bg-gray-800 text-white border-gray-500' : 'bg-black text-gray-300 hover:bg-gray-900 hover:border-gray-500'}`}
            title="Налаштування розміру"
          >
            <SettingsIcon />
          </button>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="bg-gray-900/90 border border-gray-700 p-4 rounded-xl flex flex-col gap-4 w-64 backdrop-blur-sm shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col gap-1">
              <label htmlFor="timeScale" className="text-xs text-gray-400 font-medium flex justify-between">
                <span>Розмір часу</span>
                <span>{Math.round(timeScale * 100)}%</span>
              </label>
              <input
                id="timeScale"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={timeScale}
                onChange={handleTimeScaleInput}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-200"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="dateScale" className="text-xs text-gray-400 font-medium flex justify-between">
                <span>Розмір дати</span>
                <span>{Math.round(dateScale * 100)}%</span>
              </label>
              <input
                id="dateScale"
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={dateScale}
                onChange={handleDateScaleInput}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-gray-200"
              />
            </div>

            <button
              onClick={() => {
                updateTimeScale(1);
                updateDateScale(1);
              }}
              className="text-xs text-gray-500 hover:text-white mt-1 underline decoration-gray-700 hover:decoration-white underline-offset-2"
            >
              Скинути налаштування
            </button>
          </div>
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
        {/* Optional: You can keep or remove the text hint since there is a button now, 
            but I'll keep it as non-intrusive text. 
            Added pointer-events-none so clicks go through if overlapping slightly */}
        Натисніть F11 для повноекранного режиму
      </footer>
    </main>
  );
}

export default App;