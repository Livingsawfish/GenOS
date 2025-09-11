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
        'index.html': { type: 'file', content: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>My Page</title>\n    <link rel="stylesheet" href="styles.css">\n  </head>\n  <body>\n    <h1>Hello, World!</h1>\n  </body>\n</html>' },
        'styles.css': { type: 'file', content: 'body {\n  background-color: #2d3748;\n  color: #e2e8f0;\n  font-family: sans-serif;\n}'},
        'main.cpp': { type: 'file', content: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, C++ World!" << std::endl;\n    return 0;\n}'},
      },
    },
    'Pictures': {
      type: 'folder',
      children: {
        'mountain.png': { type: 'file', content: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAKVSURBVHhe7ZtNq0RRFIb/dxFBEfEGEUGE/wNEFEQExZtEUBAlExFRVBATZzIiokxEFB8gIm4UEwVBMVERQfwDCCIi8k+2d+pU3VO1p2/v4JODnqp7q1PnVFVVVT0YhmEYhmEYhmEYhmEYhmEYhmEYhmEYhmGY/yms+N/5H024/09kP+M+3v4e3gO3wE2wFzz2iF/gJngLnoA34AV4B77g3L4D7oA74A64A+6A6y4v4B74hHvgLviE8T0iBw/Bw/Bw8Gv4M/g7+Gv4K3gL3oK34C14Cz6CvyZvg4/gp8mH4G7yJfgm+SL8EnyBfAj+DP4s/gz+DF4HL4OXwcfg//B/8E/wB/BH8PfwT/B/wYtXiVfAy+B98C74Fvj/4f6h/z74C/hP4V+KX4X/DP8Z/jP8K/gV/Av8B/wH/AP8D/wH/A38J/xv+E/xV8TfEn9D/BfxD8Q/FP/s9/s9+W/1f+E/+W/2P/u/+h/1H/S/8T/vP+8/7z/nf85/zP+8/63/Nf+9/v3/Uf9B/yP+k/4z/rf9J/wf+o/4H/Mf8z/rP+8/6D/nP9l/z3+0/6D/lP+u/3H/ef9x/wn/df9R/wH/Mf+p/wn/ef+h/0H/af9h/3n/Yf9Z/zn/Qf+F//3+Uf+Z/2H/Uf+Z/zn/Wf+p/x3/mf/xHMswDMMwDMMwDMMwDMMwDMMwDMMwDMO4c/kCVJ+e25qGkCMAAAAASUVORK5CYII=' },
      },
    },
    'Music': {
        type: 'folder',
        children: {
            'synth-loop.mp3': { type: 'file', content: 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjQ1LjEwMAAAAAAAAAAAAAAA//tAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGF2YzU4LjkxLjEwMAAAAAAAAAAAAAAAV6anp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp6enp' },
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
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as any;
  }
  if (Array.isArray(obj)) {
    const arrCopy = [];
    for (let i = 0; i < obj.length; i++) {
      arrCopy[i] = deepClone(obj[i]);
    }
    return arrCopy as any;
  }
  const objCopy: { [key: string]: any } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
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
