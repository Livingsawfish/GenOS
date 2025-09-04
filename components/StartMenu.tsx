
import React from 'react';
import type { AppDefinition } from '../types';
import { getThemeClasses } from '../constants';

interface StartMenuProps {
  isOpen: boolean;
  apps: AppDefinition[];
  accentColor: string;
  onOpenApp: (appId: string) => void;
  onClose: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, apps, accentColor, onOpenApp, onClose }) => {
  if (!isOpen) return null;

  const theme = getThemeClasses(accentColor);

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      <div className="absolute bottom-12 left-2 w-72 bg-gray-800/80 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl z-50 p-2 animate-fade-in-up">
        <h2 className="text-lg font-semibold px-2 pb-2">Applications</h2>
        <div className="flex flex-col gap-1">
          {apps.map(app => (
            <button
              key={app.id}
              onClick={() => {
                onOpenApp(app.id);
                onClose();
              }}
              className={`flex items-center gap-3 p-2 rounded text-left transition-colors ${theme.hoverBg}`}
            >
              <span className="w-6 h-6">{app.icon}</span>
              <span>{app.name}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default StartMenu;