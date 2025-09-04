
import React, { useState } from 'react';
import type { AppDefinition } from '../types';
import { getThemeClasses, DEFAULT_PINNED_APPS } from '../constants';
import { UserIcon, PowerIcon } from './icons';

interface StartMenuProps {
  isOpen: boolean;
  apps: AppDefinition[];
  accentColor: string;
  onOpenApp: (appId: string) => void;
  onClose: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ isOpen, apps, accentColor, onOpenApp, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  if (!isOpen) return null;

  const theme = getThemeClasses(accentColor);

  const handleAppClick = (appId: string) => {
    onOpenApp(appId);
    onClose();
  };

  const pinnedAppDefs = apps.filter(app => DEFAULT_PINNED_APPS.includes(app.id));
  
  const allAppsFiltered = apps
    .filter(app => app.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true"></div>
      <div className="absolute bottom-12 left-2 w-full max-w-lg h-[60vh] max-h-96 bg-gray-800/80 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl z-50 flex animate-fade-in-up">
        {/* Left Rail */}
        <div className="w-16 flex-shrink-0 bg-black/10 flex flex-col justify-between items-center p-2 rounded-l-lg">
          <div>
            {/* Can add icons here later */}
          </div>
          <div className="flex flex-col items-center gap-2">
             <button className={`w-12 h-12 flex items-center justify-center rounded-full ${theme.hoverBg}`}>
                <UserIcon className="w-8 h-8"/>
             </button>
             <button className={`w-12 h-12 flex items-center justify-center rounded-full ${theme.hoverBg}`}>
                <PowerIcon className="w-8 h-8"/>
             </button>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="flex-grow flex flex-col p-4">
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for applications..."
            className={`w-full px-3 py-2 mb-4 bg-gray-900/80 border border-white/10 rounded-md focus:outline-none focus:ring-2 ${theme.ring}`}
          />
          
          <div className="flex-grow overflow-y-auto pr-2">
            <h2 className="text-sm font-semibold text-gray-300 mb-2">Pinned</h2>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {pinnedAppDefs.map(app => (
                <button
                  key={app.id}
                  onClick={() => handleAppClick(app.id)}
                  className={`flex flex-col items-center justify-center text-center p-2 rounded-lg transition-colors h-24 ${theme.hoverBg}`}
                >
                  <div className={`w-10 h-10 mb-1 ${theme.text}`}>{app.icon}</div>
                  <span className="text-xs text-white w-full truncate">{app.name}</span>
                </button>
              ))}
            </div>

            <h2 className="text-sm font-semibold text-gray-300 mb-2">All Apps</h2>
            <div className="flex flex-col gap-1">
              {allAppsFiltered.map(app => (
                <button
                  key={app.id}
                  onClick={() => handleAppClick(app.id)}
                  className={`flex items-center gap-3 p-2 rounded text-left transition-colors ${theme.hoverBg}`}
                >
                  <span className="w-6 h-6">{app.icon}</span>
                  <span>{app.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StartMenu;
