import React from 'react';
import type { AppDefinition } from '../types';
import DesktopIcon from './DesktopIcon';

interface DesktopProps {
  desktopApps: AppDefinition[];
  iconPositions: { [appId: string]: { col: number; row: number } };
  accentColor: string;
  onOpenApp: (appId: string) => void;
  onMoveIcon: (appId: string, newPos: { col: number; row: number }) => void;
  onContextMenu: (e: React.MouseEvent) => void;
  wallpaper: string;
}

const Desktop: React.FC<DesktopProps> = ({ desktopApps, iconPositions, accentColor, onOpenApp, onMoveIcon, onContextMenu, wallpaper }) => {
  return (
    <div
      className="w-full h-full absolute top-0 left-0 bg-cover bg-center transition-all duration-500"
      style={{ backgroundImage: `url(${wallpaper})` }}
      onContextMenu={onContextMenu}
    >
      <div className="relative w-full h-full">
        {desktopApps.map(app => {
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