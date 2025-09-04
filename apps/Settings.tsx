
import React from 'react';
import { WALLPAPERS, ACCENT_COLORS } from '../constants';

interface SettingsProps {
  setWallpaper: (wallpaperUrl: string) => void;
  currentWallpaper: string;
  setAccentColor: (color: string) => void;
  accentColor: string;
}

const Settings: React.FC<SettingsProps> = ({ setWallpaper, currentWallpaper, setAccentColor, accentColor }) => {
  
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
      case 'rose': return 'ring-rose-300';
      case 'emerald': return 'ring-emerald-300';
      case 'violet': return 'ring-violet-300';
      case 'orange': return 'ring-orange-300';
      case 'cyan':
      default:
        return 'ring-cyan-300';
    }
  }
  
  return (
    <div className="p-4 h-full bg-gray-900/80 rounded-b-lg overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Personalization</h1>
      
      <h2 className="text-lg mb-2">Accent Color</h2>
      <div className="flex gap-3 mb-6">
        {ACCENT_COLORS.map(color => (
          <div
            key={color.className}
            onClick={() => setAccentColor(color.className)}
            className={`w-10 h-10 rounded-full cursor-pointer ${getBgClass(color.className)}
                        ${accentColor === color.className ? `ring-2 ring-offset-2 ring-offset-gray-800 ${getRingClass(color.className)}` : ''}`}
            title={color.name}
          />
        ))}
      </div>
      
      <h2 className="text-lg mb-2">Change Wallpaper</h2>
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