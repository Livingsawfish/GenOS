import React from 'react';
import type { AppDefinition } from '../types';
import DesktopIcon from './DesktopIcon';

interface DesktopProps {
  installedApps: AppDefinition[];
  iconPositions: { [appId: string]: { col: number; row: number } };
  accentColor: string;
  onOpenApp: (appId: string) => void;
  onMoveIcon: (appId: string, newPos: { col: number; row: number }) => void;
  wallpaper: string;
}

const Desktop: React.FC<DesktopProps> = ({ installedApps, iconPositions, accentColor, onOpenApp, onMoveIcon, wallpaper }) => {
  return (
    <div
      className="w-full h-full absolute top-0 left-0 bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: `url(${wallpaper})` }}
    >
      <div className="relative w-full h-full">
        {installedApps.map(app => {
          const pos = iconPositions[app.id];
          if (!pos) return null; // Don't render if position is not calculated yet

          return (
            <DesktopIcon 
              key={app.id} 
              app={app} 
              gridPos={pos}
              accentColor={accentColor}
              onOpen={onOpenApp}
              onMove={onMoveIcon}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Desktop;