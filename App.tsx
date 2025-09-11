import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { WindowInstance, AppDefinition, Folder as FileSystemFolder, File as FileSystemFile } from './types';
import { INITIAL_APPS, DEFAULT_INSTALLED_APPS, WALLPAPERS, ACCENT_COLORS, DEFAULT_DESKTOP_APPS } from './constants';
import { initialFileSystem, getNodeFromPath, deepClone } from './system';
import Desktop from './components/Desktop';
import Taskbar from './components/Taskbar';
import Window from './components/Window';
import StartMenu from './components/StartMenu';
import LoginScreen from './components/LoginScreen';
import ContextMenu from './components/ContextMenu';
import { PlaceholderIcon } from './components/icons';

const GRID_SIZE = 96;
const TASKBAR_HEIGHT = 48;

type Theme = 'light' | 'dark';
type TaskbarPosition = 'top' | 'bottom';

const App: React.FC = () => {
  const [allApps, setAllApps] = useState<AppDefinition[]>(INITIAL_APPS);
  const [openWindows, setOpenWindows] = useState<WindowInstance[]>([]);
  const [installedAppIds, setInstalledAppIds] = useState<string[]>(DEFAULT_INSTALLED_APPS);
  const [desktopAppIds, setDesktopAppIds] = useState<string[]>(DEFAULT_DESKTOP_APPS);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [wallpaper, setWallpaper] = useState(WALLPAPERS[0]);
  const [accentColor, setAccentColor] = useState(ACCENT_COLORS[0].className);
  const [desktopIconPositions, setDesktopIconPositions] = useState<{ [appId: string]: { col: number; row: number } }>({});
  const [fileSystem, setFileSystem] = useState<FileSystemFolder>(initialFileSystem);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  
  // New state for polishing features
  const [theme, setTheme] = useState<Theme>('dark');
  const [taskbarPosition, setTaskbarPosition] = useState<TaskbarPosition>('bottom');
  const [contextMenu, setContextMenu] = useState<{ visible: boolean; x: number; y: number; items: any[] }>({ visible: false, x: 0, y: 0, items: [] });

  const installedApps = useMemo(() => allApps.filter(app => installedAppIds.includes(app.id)), [allApps, installedAppIds]);
  const desktopApps = useMemo(() => allApps.filter(app => desktopAppIds.includes(app.id)), [allApps, desktopAppIds]);
  
  const activeWindowId = useMemo(() => {
    if (openWindows.length === 0) return null;
    const visibleWindows = openWindows.filter(w => w.state !== 'minimized');
    if (visibleWindows.length === 0) return null;
    
    return visibleWindows.reduce((topWin, currentWin) => 
        (currentWin.zIndex > topWin.zIndex ? currentWin : topWin)
    ).id;
  }, [openWindows]);
  
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    if (currentUser) {
        try {
            const stateToSave = {
                installedAppIds,
                desktopAppIds,
                wallpaper,
                accentColor,
                desktopIconPositions,
                fileSystem,
                theme,
                taskbarPosition,
            };
            localStorage.setItem(`gemini-os-state-${currentUser}`, JSON.stringify(stateToSave));
        } catch (error) {
            console.error("Failed to save state to localStorage", error);
        }
    }
  }, [installedAppIds, desktopAppIds, wallpaper, accentColor, desktopIconPositions, fileSystem, currentUser, theme, taskbarPosition]);


  useEffect(() => {
    setDesktopIconPositions(currentPositions => {
      const maxRows = Math.floor((window.innerHeight - TASKBAR_HEIGHT) / GRID_SIZE);
      const newPositions = { ...currentPositions };
      
      Object.keys(newPositions).forEach(appId => {
        if (!desktopAppIds.includes(appId)) {
          delete newPositions[appId];
        }
      });

      const occupiedSlots = new Set(Object.values(newPositions).map((p: any) => `${p.col},${p.row}`));
      let nextCol = 0;
      let nextRow = 0;

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
      
      let wasModified = false;
      desktopAppIds.forEach(appId => {
        if (!newPositions[appId]) {
          const { col, row } = findNextAvailableSlot();
          newPositions[appId] = { col, row };
          occupiedSlots.add(`${col},${row}`);
          wasModified = true;
        }
      });
      
      const hasRemovedItems = Object.keys(currentPositions).length > Object.keys(newPositions).length;

      return (wasModified || hasRemovedItems) ? newPositions : currentPositions;
    });

  }, [desktopAppIds]);
  
  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, visible: false }));
  }, []);
  
  useEffect(() => {
    document.addEventListener('click', closeContextMenu);
    return () => document.removeEventListener('click', closeContextMenu);
  }, [closeContextMenu]);


  const bringToFront = useCallback((id: string) => {
    setOpenWindows(windows => {
        const maxZIndex = Math.max(0, ...windows.map(w => w.zIndex));
        if (maxZIndex > 1000) {
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
          setOpenWindows(prev => prev.map(win => win.id === id ? { ...win, state: 'normal' } : win));
          bringToFront(id);
      } else {
          if (window.id === activeWindowId) {
              minimizeApp(id);
          } else {
              bringToFront(id);
          }
      }
  }, [openWindows, activeWindowId, bringToFront]);


  const openApp = useCallback((appId: string, options?: { filePath?: string, commandToRun?: string }) => {
    const appDef = allApps.find(app => app.id === appId);
    if (!appDef) return;

    if (appId !== 'terminal' || !options?.commandToRun) {
        if (!options?.filePath) {
          const existingWindow = openWindows.find(win => win.appId === appId && !win.filePath);
          if (existingWindow) {
            handleTaskbarIconClick(existingWindow.id);
            return;
          }
        } else {
           const existingWindow = openWindows.find(win => win.appId === appId && win.filePath === options.filePath);
           if (existingWindow) {
            handleTaskbarIconClick(existingWindow.id);
            return;
           }
        }
    }
    
    let windowTitle = appDef.name;
    let initialContent: string | undefined = undefined;

    if (options?.filePath) {
        const pathParts = options.filePath.split(/[/\\]/).filter(p => p);
        const node = getNodeFromPath(pathParts, fileSystem);
        if (node && node.type === 'file') {
            const fileName = pathParts[pathParts.length - 1];
            windowTitle = `${fileName} - ${appDef.name}`;
            initialContent = node.content;
        } else {
            console.error("File not found:", options.filePath);
        }
    }

    const maxZIndex = Math.max(0, ...openWindows.map(w => w.zIndex));

    const lastVisibleWindow = openWindows.filter(w => w.state === 'normal').sort((a,b) => a.zIndex - b.zIndex).pop();
    const cascadeOffset = 25;

    let initialPosition = lastVisibleWindow
      ? { x: lastVisibleWindow.position.x + cascadeOffset, y: lastVisibleWindow.position.y + cascadeOffset }
      : { x: 100, y: 100 };

    if (initialPosition.x > window.innerWidth - 200 || initialPosition.y > window.innerHeight - 200) {
        initialPosition = { x: 100, y: 100 };
    }

    const newWindow: WindowInstance = {
      id: `win-${Date.now()}`,
      appId: appDef.id,
      title: windowTitle,
      position: initialPosition,
      size: appDef.defaultSize || { width: 500, height: 400 },
      zIndex: maxZIndex + 1,
      state: 'normal',
      filePath: options?.filePath,
      initialContent: initialContent,
      commandToRun: options?.commandToRun,
    };
    setOpenWindows(prev => [...prev, newWindow]);
  }, [openWindows, handleTaskbarIconClick, allApps, fileSystem]);

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
                return {
                    ...win,
                    state: 'normal',
                    position: win.previousPosition || { x: 50, y: 50 },
                    size: win.previousSize || { width: 500, height: 400 },
                };
            } else {
                return {
                    ...win,
                    state: 'maximized',
                    previousPosition: win.position,
                    previousSize: win.size,
                    position: { x: 0, y: taskbarPosition === 'top' ? TASKBAR_HEIGHT : 0 },
                    size: { width: window.innerWidth, height: window.innerHeight - TASKBAR_HEIGHT },
                };
            }
        }
        return win;
    }));
    bringToFront(id);
  }, [bringToFront, taskbarPosition]);

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
    setDesktopAppIds(prev => prev.filter(id => id !== appId));
    setOpenWindows(prev => prev.filter(win => win.appId !== appId));
    setDesktopIconPositions(prev => {
        const newPos = {...prev};
        delete newPos[appId];
        return newPos;
    })
  }, []);
  
  const addAppToDesktop = useCallback((appId: string) => {
    if (!desktopAppIds.includes(appId)) {
        setDesktopAppIds(prev => [...prev, appId]);
    }
  }, [desktopAppIds]);

  const removeAppFromDesktop = useCallback((appId: string) => {
    setDesktopAppIds(prev => prev.filter(id => id !== appId));
    setDesktopIconPositions(prev => {
        const newPositions = { ...prev };
        delete newPositions[appId];
        return newPositions;
    });
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
    setDesktopAppIds(prev => [...prev, newApp.id]);
  }, []);
  
  const updateIconPosition = useCallback((appId: string, newPos: { col: number, row: number }) => {
    setDesktopIconPositions(prev => ({
        ...prev,
        [appId]: newPos
    }));
  }, []);
  
  const handleDesktopContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    closeContextMenu();
    const menuItems = [
      { label: 'Change Wallpaper', onClick: () => { openApp('settings'); } },
      { label: 'System Monitor', onClick: () => { openApp('systemmonitor'); } },
      { label: 'System Info', onClick: () => { openApp('system-info'); } },
    ];
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, items: menuItems });
  };


  const handleLogin = (username: string) => {
      try {
          const savedStateJSON = localStorage.getItem(`gemini-os-state-${username}`);
          if (savedStateJSON) {
              const savedState = JSON.parse(savedStateJSON);
              setInstalledAppIds(savedState.installedAppIds || DEFAULT_INSTALLED_APPS);
              setDesktopAppIds(savedState.desktopAppIds || DEFAULT_DESKTOP_APPS);
              setWallpaper(savedState.wallpaper || WALLPAPERS[0]);
              setAccentColor(savedState.accentColor || ACCENT_COLORS[0].className);
              setDesktopIconPositions(savedState.desktopIconPositions || {});
              setFileSystem(savedState.fileSystem || initialFileSystem);
              setTheme(savedState.theme || 'dark');
              setTaskbarPosition(savedState.taskbarPosition || 'bottom');
          } else {
              setInstalledAppIds(DEFAULT_INSTALLED_APPS);
              setDesktopAppIds(DEFAULT_DESKTOP_APPS);
              setWallpaper(WALLPAPERS[0]);
              setAccentColor(ACCENT_COLORS[0].className);
              setDesktopIconPositions({});
              setFileSystem(initialFileSystem);
              setTheme('dark');
              setTaskbarPosition('bottom');
          }
      } catch (error) {
          console.error("Failed to load state from localStorage, using defaults.", error);
          // Reset to defaults if stored data is corrupt
          setInstalledAppIds(DEFAULT_INSTALLED_APPS);
          setDesktopAppIds(DEFAULT_DESKTOP_APPS);
          setWallpaper(WALLPAPERS[0]);
          setAccentColor(ACCENT_COLORS[0].className);
          setDesktopIconPositions({});
          setFileSystem(initialFileSystem);
          setTheme('dark');
          setTaskbarPosition('bottom');
      } finally {
          setCurrentUser(username);
          setIsStartMenuOpen(false);
          setOpenWindows([]);
      }
  };

  const handleLogout = () => {
      setCurrentUser(null);
  };

  const handleExecuteFile = useCallback((filePath: string, content: string) => {
      setFileSystem(currentFs => {
          const newFs = deepClone(currentFs);
          const pathParts = filePath.split(/[/\\]/).filter(p => p);
          const fileName = pathParts.pop();
          if (!fileName) return currentFs;

          const parentNode = getNodeFromPath(pathParts, newFs) as FileSystemFolder;
          if (parentNode && parentNode.children[fileName] && parentNode.children[fileName].type === 'file') {
              (parentNode.children[fileName] as FileSystemFile).content = content;
          }
          return newFs;
      });

      const pathParts = filePath.split(/[/\\]/).filter(p => p);
      const fileName = pathParts[pathParts.length - 1];
      const extension = fileName.split('.').pop()?.toLowerCase();
      let commandToRun = '';

      if (extension === 'py') {
          commandToRun = `python ${filePath}`;
      } else if (extension === 'js') {
          commandToRun = `node ${filePath}`;
      } else if (['cpp', 'c', 'h', 'hpp'].includes(extension || '')) {
          const executableName = `${fileName}.out`;
          const executablePath = [...pathParts.slice(0, -1), executableName].join('/');
          commandToRun = `g++ ${filePath} && ./${executablePath}`;
      }

      if (commandToRun) {
          openApp('terminal', { commandToRun });
      }
  }, [openApp]);


  const getAppProps = (appId: string, win: WindowInstance) => {
    switch (appId) {
        case 'appstore':
            return { allApps, installedAppIds, installApp, uninstallApp, desktopAppIds, addAppToDesktop, removeAppFromDesktop };
        case 'settings':
            return { setWallpaper, currentWallpaper: wallpaper, setAccentColor, accentColor, theme, setTheme, taskbarPosition, setTaskbarPosition };
        case 'appwizard':
            return { addGeneratedApp };
        case 'explorer':
            return { fileSystem, openApp, setFileSystem };
        case 'terminal':
            return { fileSystem, setFileSystem, initialCommand: win.commandToRun, username: currentUser || 'guest', openWindows, apps: allApps, closeApp };
        case 'pythonpad':
        case 'codecanvas':
        case 'cplusplusstudio':
        case 'editor':
            return { initialContent: win.initialContent, filePath: win.filePath, onExecute: handleExecuteFile };
        case 'browser':
            return { initialContent: win.initialContent, filePath: win.filePath };
        case 'imageviewer':
            return { initialContent: win.initialContent };
        case 'systemmonitor':
            return { openWindows, apps: allApps, closeApp };
        case 'musicplayer':
            return { initialContent: win.initialContent, filePath: win.filePath };
        case 'system-info':
            return { username: currentUser || 'guest', theme, wallpaper };
        default:
            return {};
    }
  };

  if (!currentUser) {
      return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <main className="h-screen w-screen overflow-hidden font-sans select-none bg-gray-200 dark:bg-gray-900">
      <Desktop 
        desktopApps={desktopApps} 
        iconPositions={desktopIconPositions}
        accentColor={accentColor}
        onOpenApp={openApp} 
        onMoveIcon={updateIconPosition}
        wallpaper={wallpaper} 
        onContextMenu={handleDesktopContextMenu}
      />
      
      {openWindows.filter(win => win.state !== 'minimized').map(win => {
        const app = allApps.find(app => app.id === win.appId);
        if (!app) return null;
        
        const appProps = getAppProps(app.id, win);
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
            taskbarPosition={taskbarPosition}
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

      {contextMenu.visible && (
        <ContextMenu 
            x={contextMenu.x}
            y={contextMenu.y}
            items={contextMenu.items}
            onClose={closeContextMenu}
        />
      )}

      <StartMenu
        isOpen={isStartMenuOpen}
        apps={installedApps}
        accentColor={accentColor}
        username={currentUser}
        taskbarPosition={taskbarPosition}
        onOpenApp={openApp}
        onClose={() => setIsStartMenuOpen(false)}
        onLogout={handleLogout}
      />
      <Taskbar 
        openWindows={openWindows} 
        apps={allApps} 
        activeWindowId={activeWindowId}
        accentColor={accentColor}
        taskbarPosition={taskbarPosition}
        onToggleStartMenu={toggleStartMenu} 
        onTaskbarIconClick={handleTaskbarIconClick}
      />
    </main>
  );
};

export default App;