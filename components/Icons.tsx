import React from 'react';
import ClockSvg from "../img/Clock.svg";
import FullscreenSvg from "../img/Fullscreen.svg";
import ProjectorSvg from "../img/Projector.svg";
import FullscreenExitSvg from "../img/FullscreenExit.svg";
import SettingsHelperSvg from "../img/SettingsHelper.svg";

export const MonitorIcon: React.FC = () => (
  <img src={ProjectorSvg} alt="Monitor" width={24} height={24} />
);

export const StopIcon: React.FC = () => (
  <img src={FullscreenExitSvg} alt="Stop" width={24} height={24} />
);

export const ClockIcon: React.FC = () => (
  <img src={ClockSvg} alt="Clock" width={24} height={24} />
);

export const SettingsIcon: React.FC = () => (
  <img src={SettingsHelperSvg} alt="Settings" width={24} height={24} />
);

export const MaximizeIcon: React.FC = () => (
  <img src={FullscreenSvg} alt="Maximize" width={24} height={24} />
);

export const MinimizeIcon: React.FC = () => (
  <img src={FullscreenExitSvg} alt="Minimize" width={24} height={24} />
);
