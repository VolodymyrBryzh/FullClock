import { useState, useEffect, useCallback } from 'react';

export const useClockSettings = () => {
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
      return Math.min(Math.max(val, 0), 1);
    } catch { return 1; }
  });

  const [dateScale, setDateScale] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('clock_date_scale');
      const val = stored !== null ? parseFloat(stored) : 1;
      return Math.min(Math.max(val, 0), 1);
    } catch { return 1; }
  });

  // --- Synchronization Logic ---
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

  const toggleSeconds = useCallback(() => {
    setShowSeconds((prev) => {
      const newValue = !prev;
      localStorage.setItem('clock_show_seconds', JSON.stringify(newValue));
      return newValue;
    });
  }, []);

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

  return {
    showSeconds,
    timeScale,
    dateScale,
    toggleSeconds,
    updateTimeScale,
    updateDateScale,
  };
};
