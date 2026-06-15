import React from 'react';
import { useCurrentTime } from './hooks/useCurrentTime.ts';
import { Clock } from './components/Clock.tsx';

function App(): React.ReactNode {
  const currentTime = useCurrentTime();

  return (
    <main className="min-h-screen bg-black text-gray-100 flex flex-col items-center justify-center font-sans antialiased">
      <Clock time={currentTime} />
    </main>
  );
}

export default App;
