import React, { useState, useRef, useEffect } from 'react';
import type { Folder, FileSystemNode, WindowInstance, AppDefinition } from '../types';
import { deepClone, getNodeFromPath, resolvePath } from '../system';

declare global {
  interface Window {
    loadPyodide: (config: any) => Promise<any>;
    pyodide: any;
  }
}

interface TerminalProps {
  fileSystem: Folder;
  setFileSystem: React.Dispatch<React.SetStateAction<Folder>>;
  initialCommand?: string;
  username: string;
  openWindows: WindowInstance[];
  apps: AppDefinition[];
  closeApp: (id: string) => void;
}

const commandManuals: { [key: string]: string } = {
    'help': 'help [command]\n    Shows a list of commands or help for a specific command.',
    'ls': 'ls\n    Lists directory contents.',
    'cat': 'cat [file]\n    Displays file content.',
    'echo': 'echo [text]\n    Displays a line of text.',
    'clear': 'clear\n    Clears the terminal screen.',
    'date': 'date\n    Displays the current date and time.',
    'whoami': 'whoami\n    Displays the current user.',
    'pwd': 'pwd\n    Prints the working directory.',
    'cd': 'cd [directory]\n    Changes the directory.',
    'mkdir': 'mkdir [directory]\n    Creates a new directory.',
    'touch': 'touch [file]\n    Creates a new empty file.',
    'rm': 'rm [file/directory]\n    Removes a file or empty directory.',
    'mv': 'mv [source] [destination]\n    Moves or renames a file or directory.',
    'cp': 'cp [source] [destination]\n    Copies a file.',
    'grep': 'grep [pattern] [file]\n    Searches for a pattern in a file.',
    'head': 'head [-n count] [file]\n    Displays the first part of a file.',
    'tail': 'tail [-n count] [file]\n    Displays the last part of a file.',
    'python': 'python [file.py]\n    Executes a Python script.',
    'node': 'node [file.js]\n    Executes a JavaScript script (simulated).',
    'g++': 'g++ [file.cpp]\n    Compiles a C++ file (simulated).',
    'history': 'history\n    Displays command history.',
    'info': 'info\n    Displays OS info.',
    'man': 'man [command]\n    Displays the manual for a command.',
    'ps': 'ps\n    Lists running processes.',
    'kill': 'kill [pid]\n    Terminates a process by its PID.',
    'uname': 'uname\n    Displays system information.'
};

const Terminal: React.FC<TerminalProps> = ({ fileSystem, setFileSystem, initialCommand, username, openWindows, apps, closeApp }) => {
  const [history, setHistory] = useState<string[]>(['GeminiOS Terminal [Version 1.1]']);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState<string[]>([]);
  const endOfHistoryRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const [pyodide, setPyodide] = useState<any>(null);
  const [isPyodideLoading, setIsPyodideLoading] = useState(false);

  useEffect(() => {
    const loadPyodideInstance = async () => {
        if (window.pyodide) { setPyodide(window.pyodide); return; }
        setIsPyodideLoading(true);
        try {
            const pyodideInstance = await window.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/" });
            window.pyodide = pyodideInstance;
            setPyodide(pyodideInstance);
        } catch (error) {
            console.error("Failed to load Pyodide", error);
            setHistory(prev => [...prev, "Error: Could not load Python interpreter."]);
        } finally {
            setIsPyodideLoading(false);
        }
    };
    if (!pyodide && !isPyodideLoading) { loadPyodideInstance(); }
  }, []);


  const executeCommand = async (command: string): Promise<string> => {
    const [cmd, ...args] = command.trim().split(' ').filter(Boolean);

    // Simulated executable
    if (cmd.startsWith('./')) {
        const executableName = cmd.substring(2);
        const execPath = resolvePath(executableName, cwd);
        if (!execPath) return `bash: ${executableName}: No such file or directory`;
        const node = getNodeFromPath(execPath, fileSystem);
        if (!node) return `bash: ${executableName}: No such file or directory`;
        if (node.type === 'folder' || !node.content.startsWith('SIM_EXEC')) return `bash: ${executableName}: cannot execute binary file`;
        
        if(node.content.includes('main.cpp')) return "Hello, C++ World!";
        return "Executing simulated binary...";
    }
    
    switch (cmd) {
      case 'help':
        return 'Commands: help, ls, cat, echo, clear, date, whoami, pwd, cd, mkdir, touch, rm, python, node, g++, info, mv, cp, grep, head, tail, history, man, ps, kill, uname';
      case 'man': {
          if (!args[0]) return 'What manual page do you want?';
          return commandManuals[args[0]] || `No manual entry for ${args[0]}`;
      }
      case 'ps': {
        if (openWindows.length === 0) return 'No processes running.';
        const processes = openWindows.map(win => {
            const app = apps.find(a => a.id === win.appId);
            return `${win.id.padEnd(18)} ${win.title || app?.name || 'Unknown'}`;
        });
        return ['PID'.padEnd(18) + 'COMMAND', ...processes].join('\n');
      }
      case 'kill': {
          if (!args[0]) return 'usage: kill [pid]';
          const pid = args[0];
          if (!openWindows.some(win => win.id === pid)) return `kill: (${pid}) - No such process`;
          closeApp(pid);
          return `Process ${pid} terminated.`;
      }
      case 'uname': return 'GeminiOS 1.1.0-release kernel';
      case 'ls': {
        const node = getNodeFromPath(cwd, fileSystem);
        if (node?.type !== 'folder') return 'ls: cannot access current directory';
        const contents = Object.entries(node.children)
            .map(([name, child]) => child.type === 'folder' ? `${name}/` : name);
        return contents.length > 0 ? contents.join('  ') : '';
      }
      case 'cat': {
        if (!args[0]) return 'cat: missing operand';
        const targetPath = resolvePath(args[0], cwd);
        if (!targetPath) return 'cat: invalid path';
        const node = getNodeFromPath(targetPath, fileSystem);
        if (!node) return `cat: ${args[0]}: No such file or directory`;
        if (node.type === 'folder') return `cat: ${args[0]}: Is a directory`;
        return node.content;
      }
      case 'echo': return args.join(' ');
      case 'clear': setHistory([]); return '';
      case 'date': return new Date().toLocaleString();
      case 'whoami': return username;
      case 'pwd': return `/${cwd.join('/')}`;
      case 'cd': {
        const target = args[0] || '/';
        const newPath = resolvePath(target, cwd);
        if (!newPath) return `cd: invalid path: ${target}`;
        const node = getNodeFromPath(newPath, fileSystem);
        if (!node) return `cd: no such file or directory: ${target}`;
        if (node.type === 'file') return `cd: not a directory: ${target}`;
        setCwd(newPath);
        return '';
      }
      case 'mkdir': {
          if (!args[0]) return 'mkdir: missing operand';
          const newDirName = args[0];
          const newFs = deepClone(fileSystem);
          const parent = getNodeFromPath(cwd, newFs) as Folder;
          if (parent.children[newDirName]) return `mkdir: cannot create directory '${newDirName}': File exists`;
          parent.children[newDirName] = { type: 'folder', children: {} };
          setFileSystem(newFs);
          return '';
      }
      case 'touch': {
          if (!args[0]) return 'touch: missing operand';
          const newFileName = args[0];
          const newFs = deepClone(fileSystem);
          const parent = getNodeFromPath(cwd, newFs) as Folder;
          if (parent.children[newFileName]) return '';
          parent.children[newFileName] = { type: 'file', content: '' };
          setFileSystem(newFs);
          return '';
      }
      case 'rm': {
          if (!args[0]) return 'rm: missing operand';
          const newFs = deepClone(fileSystem);
          const targetPath = resolvePath(args[0], cwd);
          if(!targetPath) return `rm: invalid path: ${args[0]}`;
          const targetName = targetPath.pop();
          if(!targetName) return `rm: cannot remove '/': Is a directory`;
          const parent = getNodeFromPath(targetPath, newFs) as Folder;
          if (!parent || !parent.children[targetName]) return `rm: cannot remove '${args[0]}': No such file or directory`;
          const targetNode = parent.children[targetName];
          if (targetNode.type === 'folder' && Object.keys(targetNode.children).length > 0) return `rm: failed to remove '${args[0]}': Directory not empty`;
          delete parent.children[targetName];
          setFileSystem(newFs);
          return '';
      }
      case 'mv':
      case 'cp': {
          if (args.length < 2) return `${cmd}: missing operand`;
          const [sourceRaw, destRaw] = args;
          const newFs = deepClone(fileSystem);
          
          const sourcePath = resolvePath(sourceRaw, cwd);
          if (!sourcePath || !getNodeFromPath(sourcePath, newFs)) return `${cmd}: cannot stat '${sourceRaw}': No such file or directory`;
          
          let destPath = resolvePath(destRaw, cwd);
          if(!destPath) return `${cmd}: invalid destination path`;

          let destNode = getNodeFromPath(destPath, newFs);
          let finalDestPath = [...destPath];
          let finalDestName = sourcePath[sourcePath.length -1];

          if (destNode && destNode.type === 'folder') {
              finalDestPath = [...destPath, sourcePath[sourcePath.length - 1]];
          } else {
              finalDestName = destPath[destPath.length-1];
              finalDestPath = destPath.slice(0, -1);
          }

          const sourceName = sourcePath.pop();
          if(!sourceName) return `${cmd}: cannot move root`;
          const sourceParent = getNodeFromPath(sourcePath, newFs) as Folder;
          const nodeToMove = deepClone(sourceParent.children[sourceName]);

          const destParent = getNodeFromPath(finalDestPath, newFs) as Folder;
          if (!destParent) return `${cmd}: destination does not exist`;
          
          destParent.children[finalDestName] = nodeToMove;
          if (cmd === 'mv') {
            delete sourceParent.children[sourceName];
          }
          setFileSystem(newFs);
          return '';
      }
       case 'grep': {
            if (args.length < 2) return 'usage: grep [pattern] [file]';
            const [pattern, fileName] = args;
            const filePath = resolvePath(fileName, cwd);
            if (!filePath) return `grep: ${fileName}: No such file or directory`;
            const node = getNodeFromPath(filePath, fileSystem);
            if (!node || node.type !== 'file') return `grep: ${fileName}: No such file or directory`;
            return node.content.split('\n').filter(line => line.includes(pattern)).join('\n');
        }
        case 'head':
        case 'tail': {
            let count = 10;
            let fileName = args[0];
            if (args[0] === '-n' && args[1]) {
                count = parseInt(args[1], 10);
                fileName = args[2];
            }
            if (!fileName) return `usage: ${cmd} [-n count] [file]`;
            const filePath = resolvePath(fileName, cwd);
            if (!filePath) return `${cmd}: ${fileName}: No such file or directory`;
            const node = getNodeFromPath(filePath, fileSystem);
            if (!node || node.type !== 'file') return `${cmd}: ${fileName}: No such file or directory`;
            const lines = node.content.split('\n');
            const result = cmd === 'head' ? lines.slice(0, count) : lines.slice(-count);
            return result.join('\n');
        }
      case 'python': {
        if (isPyodideLoading || !pyodide) return "Python interpreter is loading, please wait...";
        if (!args[0]) return "python: missing script operand";
        
        const scriptPath = args[0];
        const resolved = resolvePath(scriptPath, cwd);
        if (!resolved) return `python: invalid path: ${scriptPath}`;
        
        const node = getNodeFromPath(resolved, fileSystem);
        if (!node) return `python: can't open file '${scriptPath}': No such file or directory`;
        if (node.type === 'folder') return `python: error: '${scriptPath}' is a directory`;

        try {
            let output = '';
            pyodide.setStdout({ batched: (msg: string) => { output += msg + '\n'; } });
            pyodide.setStderr({ batched: (msg: string) => { output += msg + '\n'; } });
            await pyodide.runPythonAsync(node.content);
            return output.trim();
        } catch (err: any) {
            return err.message;
        } finally {
            pyodide.setStdout({});
            pyodide.setStderr({});
        }
      }
      case 'node': {
        if (!args[0]) return "node: missing script operand";
        return `Simulating node execution for ${args[0]}... \nHello, User!`;
      }
      case 'g++': {
          if (!args[0]) return "g++: fatal error: no input files";
          const fileName = args[0];
          const filePath = resolvePath(fileName, cwd);
          if (!filePath || !getNodeFromPath(filePath, fileSystem)) return `${fileName}: No such file or directory`;
          
          const newFs = deepClone(fileSystem);
          const parentPath = filePath.slice(0,-1);
          const parentNode = getNodeFromPath(parentPath, newFs) as Folder;
          const executableName = `${fileName}.out`;
          parentNode.children[executableName] = { type: 'file', content: `SIM_EXEC_FROM:${fileName}` };
          setFileSystem(newFs);

          return '';
      }
      case 'history': {
          return commandHistory.map((c, i) => `${i + 1}  ${c}`).join('\n');
      }
      case 'info':
        return ['* GeminiOS v1.1', '------------------', 'OS: GeminiOS', 'Kernel: React 18', 'Shell: GeminiTerm'].join('\n');
      case undefined: case '': return '';
      default: return `${cmd}: command not found`;
    }
  };

  const processAndExecute = async (fullCommand: string): Promise<string[]> => {
    const commands = fullCommand.split('&&').map(c => c.trim());
    const outputs = [];
    for(const command of commands) {
        const output = await executeCommand(command);
        if (output && output.includes('command not found')) {
            outputs.push(output);
            break; // Stop execution on error
        }
        if (output) outputs.push(output);
    }
    return outputs;
  };

  const runInitialCommand = async () => {
      if (initialCommand && !isReady) {
          setIsExecuting(true);
          const prompt = `${username}@gemini:/${cwd.join('/')}$`;
          const outputs = await processAndExecute(initialCommand);
          setHistory(prev => {
              const newHistory = [...prev, `${prompt} ${initialCommand}`];
              if (outputs.length > 0) newHistory.push(...outputs.join('\n').split('\n'));
              return newHistory;
          });
          setCommandHistory(prev => [...prev, initialCommand]);
          setIsExecuting(false);
          setIsReady(true);
      } else if (!initialCommand) {
          setHistory(prev => [...prev, 'Type `man help` to get started.']);
          setIsReady(true);
      }
  };

  useEffect(() => {
    setTimeout(() => runInitialCommand(), 100);
  }, [initialCommand, isReady, pyodide]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { setInput(e.target.value); };

  const handleInputKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isExecuting) {
      const command = input.trim();
      if(command) {
        setCommandHistory(prevCommandHistory => {
          const newCommandHistory = [...prevCommandHistory, command];
          setHistoryIndex(newCommandHistory.length);
          return newCommandHistory;
        });
      }
      const prompt = `${username}@gemini:/${cwd.join('/')}$`;
      setIsExecuting(true);
      const outputs = await processAndExecute(command);
      const newHistory = [...history, `${prompt} ${command}`];
      if (outputs.length > 0) newHistory.push(...outputs.join('\n').split('\n'));
      setHistory(newHistory);
      setInput('');
      setIsExecuting(false);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const newIndex = Math.max(0, historyIndex - 1);
        if (commandHistory[newIndex]) {
            setHistoryIndex(newIndex);
            setInput(commandHistory[newIndex]);
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const newIndex = Math.min(commandHistory.length, historyIndex + 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex] || '');
    } else if (e.key === 'Tab') {
        e.preventDefault();
        const parts = input.split(' ');
        const partial = parts.pop() || '';
        const node = getNodeFromPath(cwd, fileSystem) as Folder;
        if (!node || !partial) return;
        
        const matches = Object.keys(node.children).filter(name => name.startsWith(partial));
        if(matches.length === 1) {
            const match = matches[0];
            const newPartial = node.children[match].type === 'folder' ? `${match}/` : match;
            setInput([...parts, newPartial].join(' '));
        } else if (matches.length > 1) {
            // Find common prefix
            let prefix = '';
            for (let i = 0; i < matches[0].length; i++) {
                const char = matches[0][i];
                if (matches.every(m => m[i] === char)) {
                    prefix += char;
                } else {
                    break;
                }
            }
            if(prefix) setInput([...parts, prefix].join(' '));
        }
    }
  };

  useEffect(() => { endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [history]);
  
  const prompt = `${username}@gemini:`;
  
  return (
    <div className="h-full bg-white dark:bg-black text-black dark:text-green-400 font-mono p-2 text-sm rounded-b-lg" onClick={() => document.getElementById('terminal-input')?.focus()}>
      <div className="overflow-y-auto h-full">
        {history.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap break-words">{line}</div>
        ))}
        {isReady && (
          <div className="flex">
            <span className="text-cyan-600 dark:text-cyan-400">{prompt}</span>
            <span className="text-yellow-600 dark:text-yellow-400">{`/${cwd.join('/')}`}</span>
            <span>{`$ `}</span>
            <input
              id="terminal-input"
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="bg-transparent border-none text-black dark:text-green-400 focus:outline-none flex-grow ml-2"
              autoFocus
              disabled={isExecuting}
            />
          </div>
        )}
        <div ref={endOfHistoryRef} />
      </div>
    </div>
  );
};

export default Terminal;