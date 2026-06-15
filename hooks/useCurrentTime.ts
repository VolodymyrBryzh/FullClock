import { useState, useEffect } from 'react';

export const useCurrentTime = (): Date => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    let timeoutId: number;

    const tick = () => {
      const now = new Date();
      setCurrentTime(now);
      
      const msToNextSecond = 1000 - now.getMilliseconds();
      timeoutId = window.setTimeout(tick, msToNextSecond);
    };

    tick();

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return currentTime;
};
