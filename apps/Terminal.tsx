
import React, { useState, useRef, useEffect } from 'react';
import type { Folder, FileSystemNode } from '../types';
import { deepClone, getNodeFromPath, resolvePath } from '../system';

interface TerminalProps {
  fileSystem: Folder;
  setFileSystem: React.Dispatch<React.SetStateAction<Folder>>;
  initialCommand?: string;
}

const Terminal: React.FC<TerminalProps> = ({ fileSystem, setFileSystem, initialCommand }) => {
  const [history, setHistory] = useState<string[]>(['GeminiOS Terminal [Version 1.0]']);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState<string[]>([]);
  const endOfHistoryRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  const executeCommand = (command: string): string => {
    const [cmd, ...args] = command.trim().split(' ').filter(Boolean);

    switch (cmd) {
      case 'help':
        return 'Commands: help, ls, cat, echo, clear, date, whoami, pwd, cd, mkdir, touch, rm, python, node, info';
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
      case 'echo':
        return args.join(' ');
      case 'clear':
        setHistory([]);
        return '';
      case 'date':
        return new Date().toLocaleString();
      case 'whoami':
        return 'guest';
      case 'pwd':
        return `/${cwd.join('/')}`;
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
          if (parent.children[newFileName]) return ''; // Do nothing if file exists, standard touch behavior
          parent.children[newFileName] = { type: 'file', content: '' };
          setFileSystem(newFs);
          return '';
      }
      case 'rm': {
          if (!args[0]) return 'rm: missing operand';
          const targetName = args[0];
          const newFs = deepClone(fileSystem);
          const parent = getNodeFromPath(cwd, newFs) as Folder;
          if (!parent.children[targetName]) return `rm: cannot remove '${targetName}': No such file or directory`;
          const targetNode = parent.children[targetName];
          if (targetNode.type === 'folder' && Object.keys(targetNode.children).length > 0) {
              return `rm: failed to remove '${targetName}': Directory not empty`;
          }
          delete parent.children[targetName];
          setFileSystem(newFs);
          return '';
      }
      case 'python':
      case 'node': {
        if (!args[0]) return `${cmd}: missing script operand`;
        const scriptPath = args[0];
        const resolved = resolvePath(scriptPath, cwd);
        if (!resolved) return `${cmd}: invalid path: ${scriptPath}`;
        const node = getNodeFromPath(resolved, fileSystem);
        if (!node) return `${cmd}: can't open file '${scriptPath}': No such file or directory`;
        if (node.type === 'folder') return `${cmd}: error: '${scriptPath}' is a directory`;

        // Simulate execution for known scripts
        const fileName = resolved[resolved.length - 1];
        if (cmd === 'python' && fileName === 'hello.py') return 'Hello, World!';
        if (cmd === 'node' && fileName === 'script.js') return 'Hello, User!';

        return `Simulated execution of ${fileName}.`;
      }
      case 'info':
        return [
          '      *       ',
          '     ***      ',
          '    *****     GeminiOS v1.0',
          '   *******    ------------------',
          '    *****     OS: GeminiOS',
          '     ***      Kernel: React 18',
          '      *       Shell: GeminiTerm',
          '              Uptime: a while',
        ].join('\n');
      case undefined: // User just pressed Enter
      case '':
        return '';
      default:
        return `${cmd}: command not found`;
    }
  };

  useEffect(() => {
    if (initialCommand && !isReady) {
      setTimeout(() => {
        const prompt = `guest@gemini:/${cwd.join('/')}$`;
        const output = executeCommand(initialCommand);
        setHistory(prev => {
          const newHistory = [...prev, `${prompt} ${initialCommand}`];
          if (output) newHistory.push(...output.split('\n'));
          return newHistory;
        });
        setIsReady(true);
      }, 100);
    } else if (!initialCommand) {
        setHistory(prev => [...prev, 'Type `help` to get started.']);
        setIsReady(true);
    }
  }, [initialCommand, isReady]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = input.trim();
      const prompt = `guest@gemini:/${cwd.join('/')}$`;
      const output = executeCommand(command);
      const newHistory = [...history, `${prompt} ${command}`];
      if (output) newHistory.push(...output.split('\n'));
      setHistory(newHistory);
      setInput('');
    }
  };

  useEffect(() => {
    endOfHistoryRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);
  
  return (
    <div className="h-full bg-black text-green-400 font-mono p-2 text-sm rounded-b-lg" onClick={() => document.getElementById('terminal-input')?.focus()}>
      <div className="overflow-y-auto h-full">
        {history.map((line, index) => (
          <div key={index} className="whitespace-pre-wrap break-words">{line}</div>
        ))}
        {isReady && (
          <div className="flex">
            <span className="text-cyan-400">{`guest@gemini:`}</span>
            <span className="text-yellow-400">{`/${cwd.join('/')}`}</span>
            <span>{`$ `}</span>
            <input
              id="terminal-input"
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              className="bg-transparent border-none text-green-400 focus:outline-none flex-grow ml-2"
              autoFocus
            />
          </div>
        )}
        <div ref={endOfHistoryRef} />
      </div>
    </div>
  );
};

export default Terminal;