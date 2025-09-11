import React from 'react';
import type { AppDefinition } from './types';
import Terminal from './apps/Terminal';
import AppStore from './apps/AppStore';
import TicTacToe from './apps/TicTacToe';
import Calculator from './apps/Calculator';
import TextEditor from './apps/TextEditor';
import Browser from './apps/Browser';
import Settings from './apps/Settings';
import SystemInfo from './apps/SystemInfo';
import GeminiChat from './apps/GeminiChat';
import AppWizard from './apps/AppWizard';
import FileExplorer from './apps/FileExplorer';
import Minesweeper from './apps/Minesweeper';
import ImageViewer from './apps/ImageViewer';
import SystemMonitor from './apps/SystemMonitor';
import MusicPlayer from './apps/MusicPlayer';
import { TerminalIcon, AppStoreIcon, TicTacToeIcon, CalculatorIcon, TextEditorIcon, BrowserIcon, SettingsIcon, AboutIcon, GeminiIcon, WizardIcon, FileExplorerIcon, MinesweeperIcon, ImageViewerIcon, PythonPadIcon, CodeCanvasIcon, CPlusPlusStudioIcon, SystemMonitorIcon, MusicPlayerIcon } from './components/icons';

export const ACCENT_COLORS = [
    { name: 'Cyan', className: 'cyan' },
    { name: 'Rose', className: 'rose' },
    { name: 'Emerald', className: 'emerald' },
    { name: 'Violet', className: 'violet' },
    { name: 'Orange', className: 'orange' },
];

export const INITIAL_APPS: AppDefinition[] = [
  { id: 'system-info', name: 'System Info', icon: <AboutIcon />, component: SystemInfo, defaultSize: { width: 400, height: 350 } },
  { id: 'terminal', name: 'Terminal', icon: <TerminalIcon />, component: Terminal, defaultSize: { width: 600, height: 400 } },
  { id: 'appstore', name: 'App Store', icon: <AppStoreIcon />, component: AppStore, defaultSize: { width: 700, height: 500 } },
  { id: 'tictactoe', name: 'Tic-Tac-Toe', icon: <TicTacToeIcon />, component: TicTacToe, defaultSize: { width: 350, height: 450 } },
  { id: 'calculator', name: 'Calculator', icon: <CalculatorIcon />, component: Calculator, defaultSize: { width: 300, height: 400 } },
  { id: 'editor', name: 'Text Editor', icon: <TextEditorIcon />, component: TextEditor, defaultSize: { width: 500, height: 600 } },
  { id: 'browser', name: 'Browser', icon: <BrowserIcon />, component: Browser, defaultSize: { width: 800, height: 600 } },
  { id: 'settings', name: 'Personalization', icon: <SettingsIcon />, component: Settings, defaultSize: { width: 500, height: 550 } },
  { id: 'geminichat', name: 'Gemini Chat', icon: <GeminiIcon />, component: GeminiChat, defaultSize: { width: 500, height: 650 } },
  { id: 'appwizard', name: 'App Wizard', icon: <WizardIcon />, component: AppWizard, defaultSize: { width: 400, height: 350 } },
  { id: 'explorer', name: 'File Explorer', icon: <FileExplorerIcon />, component: FileExplorer, defaultSize: { width: 700, height: 500 } },
  { id: 'minesweeper', name: 'Minesweeper', icon: <MinesweeperIcon />, component: Minesweeper, defaultSize: { width: 400, height: 500 } },
  { id: 'imageviewer', name: 'Image Viewer', icon: <ImageViewerIcon />, component: ImageViewer, defaultSize: { width: 600, height: 450 } },
  { id: 'pythonpad', name: 'PythonPad', icon: <PythonPadIcon />, component: TextEditor, defaultSize: { width: 600, height: 700 } },
  { id: 'codecanvas', name: 'CodeCanvas', icon: <CodeCanvasIcon />, component: TextEditor, defaultSize: { width: 600, height: 700 } },
  { id: 'cplusplusstudio', name: 'C++ Studio', icon: <CPlusPlusStudioIcon />, component: TextEditor, defaultSize: { width: 600, height: 700 } },
  { id: 'systemmonitor', name: 'System Monitor', icon: <SystemMonitorIcon />, component: SystemMonitor, defaultSize: { width: 500, height: 400 } },
  { id: 'musicplayer', name: 'Music Player', icon: <MusicPlayerIcon />, component: MusicPlayer, defaultSize: { width: 350, height: 450 } },
];

export const DEFAULT_INSTALLED_APPS = ['system-info', 'terminal', 'settings', 'appstore', 'geminichat', 'explorer', 'browser', 'editor'];

export const DEFAULT_DESKTOP_APPS = ['explorer', 'browser', 'geminichat', 'terminal', 'settings'];

export const DEFAULT_PINNED_APPS = ['geminichat', 'browser', 'appstore', 'settings', 'explorer'];

export const WALLPAPERS = [
  'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2070&auto=format&fit=crop',
];

// Utility to get theme-based class names to avoid Tailwind CSS purging issues with dynamic class names
export const getThemeClasses = (color: string) => {
    switch (color) {
        case 'rose':
            return {
                text: 'text-rose-500',
                bg: 'bg-rose-500',
                bgActive: 'bg-rose-500',
                hoverBg: 'hover:bg-rose-500/20',
                ring: 'focus:ring-rose-500',
            };
        case 'emerald':
            return {
                text: 'text-emerald-500',
                bg: 'bg-emerald-500',
                bgActive: 'bg-emerald-500',
                hoverBg: 'hover:bg-emerald-500/20',
                ring: 'focus:ring-emerald-500',
            };
        case 'violet':
            return {
                text: 'text-violet-500',
                bg: 'bg-violet-500',
                bgActive: 'bg-violet-500',
                hoverBg: 'hover:bg-violet-500/20',
                ring: 'focus:ring-violet-500',
            };
        case 'orange':
            return {
                text: 'text-orange-500',
                bg: 'bg-orange-500',
                bgActive: 'bg-orange-500',
                hoverBg: 'hover:bg-orange-500/20',
                ring: 'focus:ring-orange-500',
            };
        default: // cyan
            return {
                text: 'text-cyan-500',
                bg: 'bg-cyan-500',
                bgActive: 'bg-cyan-500',
                hoverBg: 'hover:bg-cyan-500/20',
                ring: 'focus:ring-cyan-500',
            };
    }
};