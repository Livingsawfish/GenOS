import React, { useState, useCallback, useEffect } from 'react';

const GRID_SIZE = 96; // Corresponds to w-24/h-24 in Tailwind
const TASKBAR_HEIGHT = 48;

export const useDraggableIcon = (
  id: string,
  initialGridPos: { col: number; row: number },
  onMove: (id: string, newGridPos: { col: number, row: number }) => void
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentPosition, setCurrentPosition] = useState({ 
    x: initialGridPos.col * GRID_SIZE, 
    y: initialGridPos.row * GRID_SIZE 
  });

  // Update position if initial grid position changes from props
  useEffect(() => {
    setCurrentPosition({
        x: initialGridPos.col * GRID_SIZE,
        y: initialGridPos.row * GRID_SIZE,
    });
  }, [initialGridPos]);

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - currentPosition.x,
      y: e.clientY - currentPosition.y,
    });
    // Set a high z-index while dragging
    e.currentTarget.style.zIndex = '1000';
  }, [currentPosition]);

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      setCurrentPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  }, [isDragging, dragStart]);

  const onMouseUp = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    setIsDragging(false);
    
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    // Calculate viewport boundaries
    const maxCol = Math.floor(window.innerWidth / GRID_SIZE) - 1;
    const maxRow = Math.floor((window.innerHeight - TASKBAR_HEIGHT) / GRID_SIZE) - 1;
    
    // Calculate and clamp the new grid position
    const newCol = Math.round(newX / GRID_SIZE);
    const newRow = Math.round(newY / GRID_SIZE);

    const clampedCol = Math.max(0, Math.min(newCol, maxCol));
    const clampedRow = Math.max(0, Math.min(newRow, maxRow));

    onMove(id, { col: clampedCol, row: clampedRow });
    
    // Reset z-index on the element itself, will be handled by ref in the component
    const element = document.getElementById(`icon-${id}`);
    if (element) {
        element.style.zIndex = '10';
    }

  }, [isDragging, dragStart, id, onMove]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp, { once: true });
    }
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDragging, onMouseMove, onMouseUp]);

  return {
    position: currentPosition,
    onMouseDown,
    isDragging,
  };
};
