
import React from 'react';
import type { WindowInstance } from '../types';
import type { AppDefinition } from '../types';
import { StartIcon } from './icons';
import { getThemeClasses } from '../constants';

interface TaskbarProps {
  openWindows: WindowInstance[];
  apps: AppDefinition[];
  activeWindowId: string | null;
  accentColor: string;
  onToggleStartMenu: () => void;
  onTaskbarIconClick: (id: string) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ openWindows, apps, activeWindowId, accentColor, onToggleStartMenu, onTaskbarIconClick }) => {
  const getAppIcon = (appId: string) => {
    return apps.find(app => app.id === appId)?.icon;
  };

  const theme = getThemeClasses(accentColor);

  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-900/70 backdrop-blur-lg border-t border-white/20 flex items-center px-2 gap-2 z-30">
      <button
        onClick={onToggleStartMenu}
        className={`p-2 rounded transition-colors ${theme.hoverBg}`}
        aria-label="Start Menu"
      >
        <StartIcon className={`w-6 h-6 ${theme.text}`} />
      </button>
      <div className="flex items-center gap-2">
        {openWindows.map(win => {
          const isActive = win.id === activeWindowId && win.state !== 'minimized';
          const isMinimized = win.state === 'minimized';
          return (
            <button
              key={win.id}
              onClick={() => onTaskbarIconClick(win.id)}
              className={`p-2 rounded transition-colors relative ${isActive ? 'bg-white/20' : 'hover:bg-white/10'}`}
              title={win.title}
            >
              <span className="w-6 h-6">{getAppIcon(win.appId)}</span>
              {(isActive || isMinimized) && (
                <div className={`absolute bottom-0 left-1 right-1 h-1 ${isActive ? theme.bgActive : ''} ${isMinimized ? 'bg-gray-400' : ''} rounded-full`}></div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  );
};

export default Taskbar;