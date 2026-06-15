import React, { useCallback } from 'react';

interface SettingsPanelProps {
  timeScale: number;
  dateScale: number;
  onTimeScaleChange: (scale: number) => void;
  onDateScaleChange: (scale: number) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  timeScale,
  dateScale,
  onTimeScaleChange,
  onDateScaleChange,
}) => {
  const handleTimeScaleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onTimeScaleChange(parseFloat(e.target.value));
  }, [onTimeScaleChange]);

  const handleDateScaleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onDateScaleChange(parseFloat(e.target.value));
  }, [onDateScaleChange]);

  const handleReset = useCallback(() => {
    onTimeScaleChange(1);
    onDateScaleChange(1);
  }, [onTimeScaleChange, onDateScaleChange]);

  return (
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
        onClick={handleReset}
        className="text-xs text-gray-500 hover:text-white mt-1 underline decoration-gray-700 hover:decoration-white underline-offset-2 text-left"
      >
        Скинути налаштування
      </button>
    </div>
  );
};
