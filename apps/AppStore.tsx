import React from 'react';
import type { AppDefinition } from '../types';

interface AppStoreProps {
  allApps: AppDefinition[];
  installedAppIds: string[];
  desktopAppIds: string[];
  installApp: (appId: string) => void;
  uninstallApp: (appId: string) => void;
  addAppToDesktop: (appId: string) => void;
  removeAppFromDesktop: (appId: string) => void;
}

const AppStore: React.FC<AppStoreProps> = ({ allApps, installedAppIds, desktopAppIds, installApp, uninstallApp, addAppToDesktop, removeAppFromDesktop }) => {
  return (
    <div className="p-4 bg-gray-200 dark:bg-gray-900/80 h-full rounded-b-lg text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4">App Store</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allApps.map(app => {
          const isInstalled = installedAppIds.includes(app.id);
          const isOnDesktop = desktopAppIds.includes(app.id);
          
          return (
            <div key={app.id} className="bg-gray-300/70 dark:bg-gray-800/70 p-4 rounded-lg flex flex-col items-center text-center">
              <div className="w-12 h-12 text-cyan-500">{app.icon}</div>
              <h2 className="text-lg font-semibold mt-2">{app.name}</h2>
              <div className="mt-4 flex flex-col gap-2 w-full text-white">
                {isInstalled ? (
                   <>
                    {isOnDesktop ? (
                        <button 
                            onClick={() => removeAppFromDesktop(app.id)}
                            className="px-4 py-2 bg-yellow-600 rounded hover:bg-yellow-700 w-full"
                        >
                            Remove from Desktop
                        </button>
                    ) : (
                        <button 
                            onClick={() => addAppToDesktop(app.id)}
                            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 w-full"
                        >
                            Add to Desktop
                        </button>
                    )}
                    <button 
                        onClick={() => uninstallApp(app.id)} 
                        disabled={['appstore', 'settings', 'system-info', 'terminal'].includes(app.id)}
                        className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 disabled:bg-gray-500 disabled:cursor-not-allowed w-full"
                    >
                      Uninstall
                    </button>
                   </>
                ) : (
                  <button 
                      onClick={() => installApp(app.id)}
                      className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 w-full"
                  >
                    Install
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default AppStore;