
import React, { useState, useEffect } from 'react';
import type { WindowInstance, AppDefinition } from '../types';

interface SystemMonitorProps {
  openWindows: WindowInstance[];
  apps: AppDefinition[];
  closeApp: (id: string) => void;
}

const SystemMonitor: React.FC<SystemMonitorProps> = ({ openWindows, apps, closeApp }) => {
  const [processStats, setProcessStats] = useState<{ [key: string]: { cpu: number; mem: number } }>({});
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setProcessStats(prev => {
        const newStats: { [key: string]: { cpu: number; mem: number } } = {};
        openWindows.forEach(win => {
          const currentStats = prev[win.id];
          const currentCpu = currentStats?.cpu || Math.random() * 5;
          const currentMem = currentStats?.mem || Math.random() * 50 + 20;
          newStats[win.id] = {
            cpu: Math.max(0.1, currentCpu + (Math.random() - 0.48) * 2),
            mem: Math.max(20, currentMem + (Math.random() - 0.5) * 5),
          };
        });
        return newStats;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, [openWindows]);

  const getApp = (appId: string) => apps.find(a => a.id === appId);

  const handleEndTask = () => {
    if (selectedProcessId) {
      closeApp(selectedProcessId);
      setSelectedProcessId(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900/80 rounded-b-lg text-sm">
      <div className="flex-grow overflow-y-auto">
        <table className="w-full">
          <thead className="sticky top-0 bg-gray-800">
            <tr>
              <th className="p-2 text-left font-semibold">Process Name</th>
              <th className="p-2 text-right font-semibold">CPU (%)</th>
              <th className="p-2 text-right font-semibold">Memory (MB)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {openWindows.map(win => {
              const app = getApp(win.appId);
              const stats = processStats[win.id] || { cpu: 0, mem: 0 };
              return (
                <tr
                  key={win.id}
                  onClick={() => setSelectedProcessId(win.id)}
                  className={`cursor-pointer ${selectedProcessId === win.id ? 'bg-cyan-500/30' : 'hover:bg-white/10'}`}
                >
                  <td className="p-2 flex items-center gap-2">
                    <span className="w-4 h-4">{app?.icon}</span>
                    <span>{win.title}</span>
                  </td>
                  <td className="p-2 text-right font-mono">{stats.cpu.toFixed(1)}</td>
                  <td className="p-2 text-right font-mono">{stats.mem.toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex-shrink-0 p-2 border-t border-white/20 flex justify-end">
        <button
          onClick={handleEndTask}
          disabled={!selectedProcessId}
          className="px-4 py-2 bg-red-600 rounded hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          End Task
        </button>
      </div>
    </div>
  );
};

export default SystemMonitor;
