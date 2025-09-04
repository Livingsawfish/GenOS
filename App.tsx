
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { WindowInstance, AppDefinition } from './types';
import { INITIAL_APPS, DEFAULT_INSTALLED_APPS, WALLPAPERS, ACCENT_COLORS } from './constants';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import StartMenu from './components/StartMenu';
import { PlaceholderIcon } from './components/icons';

const GRID_SIZE = 96;
const TASKBAR_HEIGHT = 48;

const App: React.FC = () => {
  const [allApps, setAllApps] = useState<AppDefinition[]>(INITIAL_APPS);
  const [openWindows, setOpenWindows] = useState<WindowInstance[]>([]);
  const [installedAppIds, setInstalledAppIds] = useState<string[]>(DEFAULT_INSTALLED_APPS);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [wallpaper, setWallpaper] = useState(WALLPAPERS[0]);
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0].className);
  const [desktopIconPositions, setDesktopIconPositions] = useState<{ [appId: string]: { col: number; row: number } }>({});

  const installedApps = useMemo(() => allApps.filter(app => installedAppIds.includes(app.id)), [allApps, installedAppIds]);
  
  const activeWindowId = useMemo(() => {
    if (openWindows.length === 0) return null;
    const visibleWindows = openWindows.filter(w => w.state !== 'minimized');
    if (visibleWindows.length === 0) return null;
    
    return visibleWindows.reduce((topWin, currentWin) => 
        (currentWin.zIndex > topWin.zIndex ? currentWin : topWin)
    ).id;
  }, [openWindows]);

  // Effect to calculate and assign desktop icon positions
  useEffect(() => {
    const maxRows = Math.floor((window.innerHeight - TASKBAR_HEIGHT) / GRID_SIZE);
    let nextCol = 0;
    let nextRow = 0;

    const newPositions = { ...desktopIconPositions };
    const occupiedSlots = new Set(Object.values(newPositions).map(p => `${p.col},${p.row}`));

    const findNextAvailableSlot = () => {
        while (true) {
            if (!occupiedSlots.has(`${nextCol},${nextRow}`)) {
                return { col: nextCol, row: nextRow };
            }
            nextRow++;
            if (nextRow >= maxRows) {
                nextRow = 0;
                nextCol++;
            }
        }
    };
    
    installedAppIds.forEach(appId => {
        if (!newPositions[appId]) {
            const { col, row } = findNextAvailableSlot();
            newPositions[appId] = { col, row };
            occupiedSlots.add(`${col},${row}`);
        }
    });

    setDesktopIconPositions(newPositions);

  }, [installedAppIds]);


  const bringToFront = useCallback((id: string) => {
    setOpenWindows(windows => {
        const maxZIndex = Math.max(0, ...windows.map(w => w.zIndex));
        if (maxZIndex > 1000) { // Prevent z-index from growing indefinitely
            // Renumber z-indexes
            const sortedWindows = [...windows].sort((a,b) => a.zIndex - b.zIndex);
            return sortedWindows.map((win, index) => 
                win.id === id ? {...win, zIndex: sortedWindows.length } : {...win, zIndex: index + 1}
            );
        }
        return windows.map(win =>
            win.id === id ? { ...win, zIndex: maxZIndex + 1 } : win
        );
    });
  }, []);

  const handleTaskbarIconClick = useCallback((id: string) => {
      const window = openWindows.find(w => w.id === id);
      if (!window) return;

      if (window.state === 'minimized') {
          // Restore and bring to front
          setOpenWindows(prev => prev.map(win => win.id === id ? { ...win, state: 'normal' } : win));
          bringToFront(id);
      } else {
          if (window.id === activeWindowId) {
              // Minimize if it's the active window
              minimizeApp(id);
          } else {
              // Just bring to front if it's not active
              bringToFront(id);
          }
      }
  }, [openWindows, activeWindowId, bringToFront]);


  const openApp = useCallback((appId: string) => {
    const appDef = allApps.find(app => app.id === appId);
    if (!appDef) return;

    const existingWindow = openWindows.find(win => win.appId === appId);
    if (existingWindow) {
      handleTaskbarIconClick(existingWindow.id);
      return;
    }

    const maxZIndex = Math.max(0, ...openWindows.map(w => w.zIndex));
    const newWindow: WindowInstance = {
      id: `win-${Date.now()}`,
      appId: appDef.id,
      title: appDef.name,
      position: { x: Math.random() * 200 + 50, y: Math.random() * 100 + 50 },
      size: appDef.defaultSize || { width: 500, height: 400 },
      zIndex: maxZIndex + 1,
      state: 'normal',
    };
    setOpenWindows(prev => [...prev, newWindow]);
  }, [openWindows, handleTaskbarIconClick, allApps]);

  const closeApp = useCallback((id: string) => {
    setOpenWindows(prev => prev.filter(win => win.id !== id));
  }, []);

  const minimizeApp = useCallback((id: string) => {
    setOpenWindows(prev => prev.map(win => win.id === id ? { ...win, state: 'minimized' } : win));
  }, []);

  const maximizeApp = useCallback((id: string) => {
    setOpenWindows(prev => prev.map(win => {
        if (win.id === id) {
            if (win.state === 'maximized') {
                return { // Restore
                    ...win,
                    state: 'normal',
                    position: win.previousPosition || { x: 50, y: 50 },
                    size: win.previousSize || { width: 500, height: 400 },
                };
            } else {
                return { // Maximize
                    ...win,
                    state: 'maximized',
                    previousPosition: win.position,
                    previousSize: win.size,
                    position: { x: 0, y: 0 },
                    size: { width: window.innerWidth, height: window.innerHeight - TASKBAR_HEIGHT },
                };
            }
        }
        return win;
    }));
    bringToFront(id);
  }, [bringToFront]);

  const updateWindowSize = useCallback((id: string, newSize: { width: number, height: number}) => {
    setOpenWindows(prev => prev.map(win => win.id === id ? { ...win, size: newSize } : win));
  }, []);

  const toggleStartMenu = useCallback(() => {
    setIsStartMenuOpen(prev => !prev);
  }, []);

  const installApp = useCallback((appId: string) => {
    if (!installedAppIds.includes(appId)) {
        setInstalledAppIds(prev => [...prev, appId]);
    }
  }, [installedAppIds]);

  const uninstallApp = useCallback((appId: string) => {
    setInstalledAppIds(prev => prev.filter(id => id !== appId));
    setOpenWindows(prev => prev.filter(win => win.appId !== appId));
    setDesktopIconPositions(prev => {
        const newPos = {...prev};
        delete newPos[appId];
        return newPos;
    })
  }, []);
  
  const addGeneratedApp = useCallback((appName: string, component: React.ComponentType<any>) => {
    const newApp: AppDefinition = {
        id: `generated-${appName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}`,
        name: appName,
        icon: <PlaceholderIcon />,
        component: component,
        defaultSize: { width: 500, height: 400 },
    };
    setAllApps(prev => [...prev, newApp]);
    setInstalledAppIds(prev => [...prev, newApp.id]);
  }, []);
  
  const updateIconPosition = useCallback((appId: string, newPos: { col: number, row: number }) => {
    setDesktopIconPositions(prev => ({
        ...prev,
        [appId]: newPos
    }));
  }, []);

  const getAppProps = (appId: string) => {
    switch (appId) {
        case 'appstore':
            return { allApps, installedAppIds, installApp, uninstallApp };
        case 'settings':
            return { setWallpaper, currentWallpaper: wallpaper, setAccentColor, accentColor };
        case 'appwizard':
            return { addGeneratedApp };
        default:
            return {};
    }
  };

  return (
    <main className="h-screen w-screen overflow-hidden font-sans select-none">
      <Desktop 
        installedApps={installedApps} 
        iconPositions={desktopIconPositions}
        accentColor={accentColor}
        onOpenApp={openApp} 
        onMoveIcon={updateIconPosition}
        wallpaper={wallpaper} 
      />
      
      {openWindows.filter(win => win.state !== 'minimized').map(win => {
        const app = allApps.find(app => app.id === win.appId);
        if (!app) return null;
        
        const appProps = getAppProps(app.id);
        const AppToRender = app.component;

        return (
          <Window
            key={win.id}
            id={win.id}
            app={app}
            position={win.position}
            size={win.size}
            zIndex={win.zIndex}
            state={win.state}
            onClose={closeApp}
            onFocus={bringToFront}
            onMinimize={minimizeApp}
            onMaximize={maximizeApp}
            onSizeChange={updateWindowSize}
          >
            <AppToRender {...appProps} />
          </Window>
        );
      })}

      <StartMenu
        isOpen={isStartMenuOpen}
        apps={installedApps}
        accentColor={accentColor}
        onOpenApp={openApp}
        onClose={() => setIsStartMenuOpen(false)}
      />
      <Taskbar 
        openWindows={openWindows} 
        apps={allApps} 
        activeWindowId={activeWindowId}
        accentColor={accentColor}
        onToggleStartMenu={toggleStartMenu} 
        onTaskbarIconClick={handleTaskbarIconClick}
      />
    </main>
  );
};

export default App;