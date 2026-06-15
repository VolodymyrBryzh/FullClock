import { useState, useEffect, useCallback } from 'react';

// Type definitions for the Window Management API
export interface ScreenDetailed extends Screen {
  isPrimary: boolean;
  left: number;
  top: number;
}

export interface ScreenDetails {
  screens: readonly ScreenDetailed[];
  currentScreen: ScreenDetailed;
}

declare global {
  interface Window {
    getScreenDetails?(): Promise<ScreenDetails>;
  }
}

export const useProjector = () => {
  const [projectorWindow, setProjectorWindow] = useState<Window | null>(null);

  const urlParams = new URLSearchParams(window.location.search);
  const isProjectorView = urlParams.get('mode') === 'projector';

  // Listen to close command in projector view
  useEffect(() => {
    if (!isProjectorView) return;
    const channel = new BroadcastChannel('clock_control');
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'close') {
        window.close();
      }
    };
    channel.addEventListener('message', handleMessage);
    return () => {
      channel.removeEventListener('message', handleMessage);
      channel.close();
    };
  }, [isProjectorView]);

  // Check if projector window is closed by the user manually
  useEffect(() => {
    const timer = setInterval(() => {
      if (projectorWindow && projectorWindow.closed) {
        setProjectorWindow(null);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [projectorWindow]);

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

  const isProjectorOpen = !!(projectorWindow && !projectorWindow.closed);

  return {
    isProjectorView,
    isProjectorOpen,
    openProjector,
    closeProjector,
  };
};
