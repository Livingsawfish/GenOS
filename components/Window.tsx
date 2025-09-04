
import React, { useState, useEffect } from 'react';
import { useDraggable } from '../hooks/useDraggable';
import type { AppDefinition } from '../types';

interface WindowProps {
  id: string;
  app: AppDefinition;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  state: 'normal' | 'minimized' | 'maximized';
  onClose: (id: string) => void;
  onFocus: (id:string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onSizeChange: (id: string, newSize: { width: number, height: number }) => void;
  children: React.ReactNode;
}

const Window: React.FC<WindowProps> = ({
  id,
  app,
  position,
  size,
  zIndex,
  state,
  onClose,
  onFocus,
  onMinimize,
  onMaximize,
  onSizeChange,
  children
}) => {
  const { position: currentPosition, onMouseDown: onDragMouseDown } = useDraggable(id, position);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    onFocus(id);
    // Only drag if the event target is the header itself and window is not maximized
    if (e.target === e.currentTarget && state !== 'maximized') {
      onDragMouseDown(e);
    }
  };
  
  const onResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (state === 'maximized') return;
    e.stopPropagation();
    setIsResizing(true);
    onFocus(id);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height,
    });
  };

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const dx = e.clientX - resizeStart.x;
      const dy = e.clientY - resizeStart.y;
      onSizeChange(id, {
        width: Math.max(300, resizeStart.width + dx),
        height: Math.max(200, resizeStart.height + dy),
      });
    };
  
    const onMouseUp = () => {
      setIsResizing(false);
    };
  
    if (isResizing) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    }
  
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isResizing, resizeStart, onSizeChange, id]);

  return (
    <div
      id={id}
      className={`absolute flex flex-col bg-gray-800/70 backdrop-blur-md shadow-2xl border border-white/20 ${state === 'maximized' ? 'rounded-none' : 'rounded-lg'}`}
      style={{
        left: `${currentPosition.x}px`,
        top: `${currentPosition.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: zIndex + 20, // Base z-index for windows
        transition: state === 'maximized' ? 'all 0.2s ease-in-out' : 'none',
      }}
      onMouseDown={() => onFocus(id)}
    >
      <div
        className={`flex items-center justify-between h-8 px-2 bg-gray-900/50 ${state === 'maximized' ? '' : 'rounded-t-lg'} ${state !== 'maximized' ? 'cursor-move' : ''}`}
        onMouseDown={handleMouseDown}
        onDoubleClick={() => onMaximize(id)}
      >
        <div className="flex items-center gap-2 text-sm">
          <span className="w-4 h-4">{app.icon}</span>
          <span>{app.name}</span>
        </div>
        <div className="flex items-center gap-2">
            <button
                onClick={() => onMinimize(id)}
                className="w-5 h-5 bg-yellow-500 rounded-full hover:bg-yellow-600 focus:outline-none"
                aria-label="Minimize"
            />
            <button
                onClick={() => onMaximize(id)}
                className="w-5 h-5 bg-green-500 rounded-full hover:bg-green-600 focus:outline-none flex items-center justify-center"
                aria-label="Maximize"
            >
              {state !== 'maximized' ? (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2.5 h-2.5 text-black/60">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 4.5v15h15" />
                  </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-2.5 h-2.5 text-black/60">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H21v7.5M21 6L6 21M10.5 6H6v4.5" />
                </svg>
              )}
            </button>
            <button
                onClick={() => onClose(id)}
                className="w-5 h-5 bg-red-500 rounded-full hover:bg-red-600 focus:outline-none flex items-center justify-center text-white font-bold"
                aria-label="Close"
            >
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
        </div>
      </div>
      <div className="flex-grow p-1 overflow-auto relative">
        {children}
        {state !== 'maximized' && (
          <div
            onMouseDown={onResizeMouseDown}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-px"
          >
            <div className="w-2 h-2 border-r-2 border-b-2 border-white/50"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Window;
