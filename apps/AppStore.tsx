import React from 'react';
import type { AppDefinition } from '../types';

interface AppStoreProps {
  allApps: AppDefinition[];
  installedAppIds: string[];
  installApp: (appId: string) => void;
  uninstallApp: (appId: string) => void;
}

const AppStore: React.FC<AppStoreProps> = ({ allApps, installedAppIds, installApp, uninstallApp }) => {
  return (
    <div className="p-4 bg-gray-900/80 h-full rounded-b-lg">
      <h1 className="text-2xl font-bold mb-4">App Store</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allApps.map(app => (
          <div key={app.id} className="bg-gray-800/70 p-4 rounded-lg flex flex-col items-center text-center">
            <div className="w-12 h-12 text-cyan-300">{app.icon}</div>
            <h2 className="text-lg font-semibold mt-2">{app.name}</h2>
            <div className="mt-4">
              {installedAppIds.includes(app.id) ? (
                 <button 
                    onClick={() => uninstallApp(app.id)} 
                    disabled={['appstore', 'settings', 'about', 'terminal'].includes(app.id)}
                    className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed"
                 >
                   Uninstall
                 </button>
              ) : (
                <button 
                    onClick={() => installApp(app.id)}
                    className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
                >
                  Install
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AppStore;
