import React from 'react';

interface ContextMenuItem {
  label: string;
  onClick: () => void;
}

interface ContextMenuProps {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, items, onClose }) => {
  const handleItemClick = (item: ContextMenuItem) => {
    item.onClick();
    onClose();
  };

  return (
    <div
      className="absolute z-50 w-48 bg-gray-200/90 dark:bg-gray-800/90 backdrop-blur-md border border-black/10 dark:border-white/20 rounded-md shadow-lg py-1 animate-fade-in-sm"
      style={{ top: y, left: x }}
    >
      {items.map((item, index) => (
        <button
          key={index}
          onClick={() => handleItemClick(item)}
          className="w-full text-left px-4 py-2 text-sm text-black dark:text-white hover:bg-cyan-500/30"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default ContextMenu;