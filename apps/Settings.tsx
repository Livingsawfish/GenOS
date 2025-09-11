import React from 'react';
import { WALLPAPERS, ACCENT_COLORS } from '../constants';

interface SettingsProps {
  setWallpaper: (wallpaperUrl: string) => void;
  currentWallpaper: string;
  setAccentColor: (color: string) => void;
  accentColor: string;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  taskbarPosition: 'top' | 'bottom';
  setTaskbarPosition: (position: 'top' | 'bottom') => void;
}

const Settings: React.FC<SettingsProps> = ({ setWallpaper, currentWallpaper, setAccentColor, accentColor, theme, setTheme, taskbarPosition, setTaskbarPosition }) => {
  
  const getBgClass = (color: string) => {
    switch(color) {
      case 'rose': return 'bg-rose-500';
      case 'emerald': return 'bg-emerald-500';
      case 'violet': return 'bg-violet-500';
      case 'orange': return 'bg-orange-500';
      case 'cyan':
      default:
        return 'bg-cyan-500';
    }
  }
  
  const getRingClass = (color: string) => {
    switch(color) {
      case 'rose': return 'ring-rose-500';
      case 'emerald': return 'ring-emerald-500';
      case 'violet': return 'ring-violet-500';
      case 'orange': return 'ring-orange-500';
      case 'cyan':
      default:
        return 'ring-cyan-500';
    }
  }
  
  return (
    <div className="p-4 h-full bg-gray-200 dark:bg-gray-900/80 text-black dark:text-white rounded-b-lg overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Personalization</h1>
      
      <h2 className="text-lg font-semibold mb-2">Theme</h2>
      <div className="flex items-center gap-4 p-3 rounded-lg bg-black/5 dark:bg-black/20 mb-6">
        <button onClick={() => setTheme('light')} className={`px-4 py-2 rounded-md ${theme === 'light' ? 'bg-cyan-500 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>Light</button>
        <button onClick={() => setTheme('dark')} className={`px-4 py-2 rounded-md ${theme === 'dark' ? 'bg-cyan-500 text-white' : 'bg-gray-300 dark:bg-gray-600'}`}>Dark</button>
      </div>
      
      <h2 className="text-lg font-semibold mb-2">Accent Color</h2>
      <div className="flex gap-3 p-3 rounded-lg bg-black/5 dark:bg-black/20 mb-6">
        {ACCENT_COLORS.map(color => (
          <div
            key={color.className}
            onClick={() => setAccentColor(color.className)}
            className={`w-10 h-10 rounded-full cursor-pointer ${getBgClass(color.className)}
                        ${accentColor === color.className ? `ring-2 ring-offset-2 ring-offset-gray-200 dark:ring-offset-gray-800 ${getRingClass(color.className)}` : ''}`}
            title={color.name}
          />
        ))}
      </div>
      
       <h2 className="text-lg font-semibold mb-2">Taskbar Position</h2>
      <div className="flex items-center gap-4 p-3 rounded-lg bg-black/5 dark:bg-black/20 mb-6">
        <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="taskbar" value="bottom" checked={taskbarPosition === 'bottom'} onChange={() => setTaskbarPosition('bottom')} className={`form-radio ${getRingClass(accentColor)}`}/>
            Bottom
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
            <input type="radio" name="taskbar" value="top" checked={taskbarPosition === 'top'} onChange={() => setTaskbarPosition('top')} className={`form-radio ${getRingClass(accentColor)}`}/>
            Top
        </label>
      </div>

      <h2 className="text-lg font-semibold mb-2">Change Wallpaper</h2>
      <div className="grid grid-cols-2 gap-4">
        {WALLPAPERS.map((wp, index) => (
          <div key={index} className="relative cursor-pointer group" onClick={() => setWallpaper(wp)}>
            <img src={wp} alt={`Wallpaper ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {currentWallpaper === wp && (
              <div className={`absolute inset-0 bg-cyan-500/50 flex items-center justify-center rounded-lg border-2 ${getRingClass('cyan')}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-8 h-8 text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;