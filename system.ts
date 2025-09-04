
import type { Folder, FileSystemNode } from './types';

export const initialFileSystem: Folder = {
  type: 'folder',
  children: {
    'Documents': {
      type: 'folder',
      children: {
        'welcome.txt': { type: 'file', content: 'Welcome to your Documents folder.' },
        'project_plan.md': { type: 'file', content: '# Project Plan\n\n- Step 1: Create a cool OS.\n- Step 2: ???\n- Step 3: Profit!' },
        'hello.py': { type: 'file', content: '# Simple Python script\ndef greet(name):\n    print(f"Hello, {name}!")\n\ngreet("World")' },
        'script.js': { type: 'file', content: '// Simple JavaScript\nfunction sayHello(name) {\n  console.log(`Hello, ${name}!`);\n}\n\nsayHello("User");' },
      },
    },
    'Pictures': {
      type: 'folder',
      children: {
        'background.jpg': { type: 'file', content: 'This is a placeholder for an image.' },
      },
    },
    'System': {
      type: 'folder',
      children: {
        'config.sys': { type: 'file', content: 'SYSTEM_BOOT=TRUE' },
      },
    },
    'readme.md': { type: 'file', content: '# GeminiOS\nThis is a simulated file system.' },
  },
};

export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  // For Date objects
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  // For Arrays
  if (Array.isArray(obj)) {
    const arrCopy = [];
    for (let i = 0; i < obj.length; i++) {
      arrCopy[i] = deepClone(obj[i]);
    }
    return arrCopy as any;
  }
  // For Objects
  const objCopy: { [key: string]: any } = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      objCopy[key] = deepClone(obj[key]);
    }
  }
  return objCopy as T;
};

export const getNodeFromPath = (path: string[], fs: Folder): FileSystemNode | null => {
  let currentNode: FileSystemNode = fs;
  for (const part of path) {
    if (currentNode.type === 'file') return null; // Can't traverse through a file
    const nextNode = currentNode.children[part];
    if (!nextNode) return null;
    currentNode = nextNode;
  }
  return currentNode;
};

export const resolvePath = (rawPath: string, cwd: string[]): string[] | null => {
    const parts = rawPath.replace(/\\/g, '/').split('/').filter(p => p);
    let newPath: string[];

    if (rawPath.startsWith('/')) {
        newPath = [];
    } else {
        newPath = [...cwd];
    }

    for (const part of parts) {
        if (part === '..') {
            if (newPath.length > 0) {
                newPath.pop();
            }
        } else if (part !== '.') {
            newPath.push(part);
        }
    }
    return newPath;
}
