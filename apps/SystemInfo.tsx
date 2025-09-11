import React from 'react';
import { StartIcon, UserIcon, SettingsIcon } from '../components/icons';

interface SystemInfoProps {
  username: string;
  theme: 'light' | 'dark';
  wallpaper: string;
}

const InfoRow: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
    <div className="flex items-center gap-3 p-2 border-b border-black/5 dark:border-white/10">
        <span className="w-5 h-5 text-cyan-500">{icon}</span>
        <span className="font-semibold">{label}:</span>
        <span className="text-gray-600 dark:text-gray-300 truncate">{value}</span>
    </div>
);

const SystemInfo: React.FC<SystemInfoProps> = ({ username, theme, wallpaper }) => {
  const wallpaperName = wallpaper.split('/').pop()?.split('?')[0] || 'Unknown';
  return (
    <div className="p-4 h-full flex flex-col items-center text-center bg-gray-200 dark:bg-gray-800/50 text-black dark:text-white rounded-b-lg">
      <StartIcon className="w-16 h-16 text-cyan-500 mb-4" />
      <h1 className="text-2xl font-bold mb-2">GeminiOS</h1>
      <p className="text-gray-600 dark:text-gray-300">A simulated desktop environment.</p>
      
      <div className="mt-6 w-full text-left text-sm">
        <InfoRow icon={<UserIcon />} label="Current User" value={username} />
        <InfoRow icon={<SettingsIcon />} label="Theme" value={theme.charAt(0).toUpperCase() + theme.slice(1)} />
        <InfoRow icon={<SettingsIcon />} label="Wallpaper" value={wallpaperName} />
      </div>

       <p className="text-xs text-gray-500 dark:text-gray-400 mt-auto">
        Built with React, TypeScript, and Tailwind CSS.
      </p>
    </div>
  );
};

export default SystemInfo;