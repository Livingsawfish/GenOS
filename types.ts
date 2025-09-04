
import React from 'react';

export interface AppDefinition {
  id: string;
  name: string;
  icon: React.ReactNode;
  component: React.ComponentType<any>;
  defaultSize?: { width: number; height: number };
}

export interface WindowInstance {
  id: string;
  appId: string;
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
  state: 'normal' | 'minimized' | 'maximized';
  previousPosition?: { x: number; y: number };
  previousSize?: { width: number; height: number };
  filePath?: string;
  initialContent?: string;
  commandToRun?: string;
}

// File System Types
export interface File {
  type: 'file';
  content: string;
}

export interface Folder {
  type: 'folder';
  children: { [key: string]: File | Folder };
}

export type FileSystemNode = File | Folder;