import React from 'react';
import type { AppDefinition } from '../types';
import { useDraggableIcon } from '../hooks/useDraggableIcon';
import { getThemeClasses } from '../constants';

interface DesktopIconProps {
  app: AppDefinition;
  gridPos: { col: number; row: number };
  accentColor: string;
  onOpen: (appId: string) => void;
  onMove: (appId: string, newGridPos: { col: number, row: number }) => void;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ app, gridPos, accentColor, onOpen, onMove }) => {
  const { position, onMouseDown, isDragging } = useDraggableIcon(app.id, gridPos, onMove);
  const theme = getThemeClasses(accentColor);

  return (
    <div
      id={`icon-${app.id}`}
      onMouseDown={onMouseDown}
      onDoubleClick={() => onOpen(app.id)}
      className={`absolute flex flex-col items-center justify-center text-center p-2 rounded-lg cursor-pointer w-24 h-24 ${theme.hoverBg}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transition: isDragging ? 'none' : 'all 0.2s ease',
        zIndex: 10,
      }}
    >
      <div className={`w-10 h-10 mb-1 pointer-events-none ${theme.text}`}>{app.icon}</div>
      <span className="text-xs text-white w-full pointer-events-none">{app.name}</span>
    </div>
  );
};

export default DesktopIcon;