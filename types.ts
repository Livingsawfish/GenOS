
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
}
