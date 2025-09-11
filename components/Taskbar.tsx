import React, { useState, useEffect } from 'react';
import type { WindowInstance } from '../types';
import type { AppDefinition } from '../types';
import { StartIcon } from './icons';
import { getThemeClasses } from '../constants';

interface TaskbarProps {
  openWindows: WindowInstance[];
  apps: AppDefinition[];
  activeWindowId: string | null;
  accentColor: string;
  taskbarPosition: 'top' | 'bottom';
  onToggleStartMenu: () => void;
  onTaskbarIconClick: (id: string) => void;
}

const Clock = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timerId = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timerId);
    }, []);

    return (
        <div className="text-sm px-2 text-center">
            <div>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div className="text-xs">{time.toLocaleDateString([], { month: 'short', day: 'numeric' })}</div>
        </div>
    );
};

const Taskbar: React.FC<TaskbarProps> = ({ openWindows, apps, activeWindowId, accentColor, taskbarPosition, onToggleStartMenu, onTaskbarIconClick }) => {
  const getAppIcon = (appId: string) => {
    return apps.find(app => app.id === appId)?.icon;
  };

  const theme = getThemeClasses(accentColor);
  
  const positionClass = taskbarPosition === 'bottom' 
    ? 'bottom-0 border-t' 
    : 'top-0 border-b';

  return (
    <div className={`absolute left-0 right-0 h-12 bg-gray-100/70 dark:bg-gray-900/70 text-black dark:text-white backdrop-blur-lg border-black/10 dark:border-white/20 flex items-center px-2 gap-2 z-30 ${positionClass}`}>
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
              className={`p-2 rounded transition-colors relative ${isActive ? 'bg-black/20 dark:bg-white/20' : 'hover:bg-black/10 dark:hover:bg-white/10'}`}
              title={win.title}
            >
              <span className="w-6 h-6">{getAppIcon(win.appId)}</span>
              {(isActive || isMinimized) && (
                <div className={`absolute bottom-0 left-1 right-1 h-1 ${isActive ? theme.bgActive : ''} ${isMinimized ? 'bg-gray-500 dark:bg-gray-400' : ''} rounded-full`}></div>
              )}
            </button>
          )
        })}
      </div>
      <div className="flex-grow" />
      <Clock />
    </div>
  );
};

export default Taskbar;