import React from 'react';
import { useState, useCallback, useEffect } from 'react';

export const useDraggable = (
  id: string, 
  initialPosition: { x: number; y: number },
  size: { width: number, height: number },
  taskbarPosition: 'top' | 'bottom'
) => {
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Sync position with prop if it changes and we are not dragging
  useEffect(() => {
    if (!isDragging) {
      setPosition(initialPosition);
    }
  }, [initialPosition, isDragging]);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const target = document.getElementById(id);
    if (!target) return;
    const rect = target.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    e.preventDefault();
  }, [id]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      const TASKBAR_HEIGHT = 48;
      const HEADER_HEIGHT = 32; // Window header height
      const GRAB_MARGIN = 40;   // How much of the window must stay on screen

      const viewportWidth = window.innerWidth;
      
      let newX = e.clientX - dragOffset.x;
      let newY = e.clientY - dragOffset.y;

      // Clamp Y position
      if (taskbarPosition === 'top') {
        newY = Math.max(TASKBAR_HEIGHT, newY);
        newY = Math.min(window.innerHeight - HEADER_HEIGHT, newY);
      } else { // bottom
        newY = Math.max(0, newY);
        newY = Math.min(window.innerHeight - TASKBAR_HEIGHT - HEADER_HEIGHT, newY);
      }

      // Clamp X position
      newX = Math.max(-size.width + GRAB_MARGIN, newX);
      newX = Math.min(viewportWidth - GRAB_MARGIN, newX);

      setPosition({ x: newX, y: newY });
    }
  }, [isDragging, dragOffset, size, taskbarPosition]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    } else {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  return { position, onMouseDown };
};