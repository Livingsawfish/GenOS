
import React from 'react';
import type { AppDefinition } from './types';
import Terminal from './apps/Terminal';
import AppStore from './apps/AppStore';
import TicTacToe from './apps/TicTacToe';
import Calculator from './apps/Calculator';
import TextEditor from './apps/TextEditor';
import Browser from './apps/Browser';
import Settings from './apps/Settings';
import About from './apps/About';
import GeminiChat from './apps/GeminiChat';
import AppWizard from './apps/AppWizard';
import FileExplorer from './apps/FileExplorer';
import { TerminalIcon, AppStoreIcon, TicTacToeIcon, CalculatorIcon, TextEditorIcon, BrowserIcon, SettingsIcon, AboutIcon, GeminiIcon, WizardIcon, FileExplorerIcon } from './components/icons';

export const ACCENT_COLORS = [
    { name: 'Cyan', className: 'cyan' },
    { name: 'Rose', className: 'rose' },
    { name: 'Emerald', className: 'emerald' },
    { name: 'Violet', className: 'violet' },
    { name: 'Orange', className: 'orange' },
];

export const INITIAL_APPS: AppDefinition[] = [
  { id: 'about', name: 'About GeminiOS', icon: <AboutIcon />, component: About, defaultSize: { width: 400, height: 300 } },
  { id: 'terminal', name: 'Terminal', icon: <TerminalIcon />, component: Terminal, defaultSize: { width: 600, height: 400 } },
  { id: 'appstore', name: 'App Store', icon: <AppStoreIcon />, component: AppStore, defaultSize: { width: 700, height: 500 } },
  { id: 'tictactoe', name: 'Tic-Tac-Toe', icon: <TicTacToeIcon />, component: TicTacToe, defaultSize: { width: 350, height: 450 } },
  { id: 'calculator', name: 'Calculator', icon: <CalculatorIcon />, component: Calculator, defaultSize: { width: 300, height: 400 } },
  { id: 'editor', name: 'Text Editor', icon: <TextEditorIcon />, component: TextEditor, defaultSize: { width: 500, height: 600 } },
  { id: 'browser', name: 'Browser', icon: <BrowserIcon />, component: Browser, defaultSize: { width: 800, height: 600 } },
  { id: 'settings', name: 'Personalization', icon: <SettingsIcon />, component: Settings, defaultSize: { width: 500, height: 500 } },
  { id: 'geminichat', name: 'Gemini Chat', icon: <GeminiIcon />, component: GeminiChat, defaultSize: { width: 500, height: 650 } },
  { id: 'appwizard', name: 'App Wizard', icon: <WizardIcon />, component: AppWizard, defaultSize: { width: 400, height: 350 } },
  { id: 'explorer', name: 'File Explorer', icon: <FileExplorerIcon />, component: FileExplorer, defaultSize: { width: 700, height: 500 } },
];

export const DEFAULT_INSTALLED_APPS = ['about', 'terminal', 'settings', 'appstore', 'geminichat', 'appwizard', 'explorer', 'browser', 'editor'];

export const DEFAULT_PINNED_APPS = ['geminichat', 'browser', 'editor', 'terminal', 'settings', 'explorer'];

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
                text: 'text-rose-300',
                bg: 'bg-rose-500',
                bgActive: 'bg-rose-300',
                hoverBg: 'hover:bg-rose-500/50',
                ring: 'focus:ring-rose-500',
            };
        case 'emerald':
            return {
                text: 'text-emerald-300',
                bg: 'bg-emerald-500',
                bgActive: 'bg-emerald-300',
                hoverBg: 'hover:bg-emerald-500/50',
                ring: 'focus:ring-emerald-500',
            };
        case 'violet':
            return {
                text: 'text-violet-300',
                bg: 'bg-violet-500',
                bgActive: 'bg-violet-300',
                hoverBg: 'hover:bg-violet-500/50',
                ring: 'focus:ring-violet-500',
            };
        case 'orange':
            return {
                text: 'text-orange-300',
                bg: 'bg-orange-500',
                bgActive: 'bg-orange-300',
                hoverBg: 'hover:bg-orange-500/50',
                ring: 'focus:ring-orange-500',
            };
        default: // cyan
            return {
                text: 'text-cyan-300',
                bg: 'bg-cyan-500',
                bgActive: 'bg-cyan-300',
                hoverBg: 'hover:bg-cyan-500/50',
                ring: 'focus:ring-cyan-500',
            };
    }
};
