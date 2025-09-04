
import React, { useState, useRef, useEffect } from 'react';

interface FileSystem {
  [key: string]: string;
}

const initialFs: FileSystem = {
  'welcome.txt': 'Welcome to GeminiOS Terminal!\nType `help` for a list of commands.',
  'about.txt': 'This is a simulated terminal environment created by a world-class senior frontend React engineer.'
};

const Terminal: React.FC = () => {
  const [fs] = useState<FileSystem>(initialFs);
  const [history, setHistory] = useState<string[]>(['GeminiOS Terminal [Version 1.0]', 'Type `help` to get started.']);
  const [input, setInput] = useState('');
  const endOfHistoryRef = useRef<HTMLDivElement>(null);

  const executeCommand = (command: string): string => {
    const [cmd, ...args] = command.trim().split(' ');
    switch (cmd) {
      case 'help':
        return 'Available commands: help, ls, cat, echo, clear, date, whoami, info';
      case 'ls':
        return Object.keys(fs).join('  ');
      case 'cat':
        if (args.length === 0) return 'Usage: cat [filename]';
        return fs[args[0]] || `cat: ${args[0]}: No such file or directory`;
      case 'echo':
        return args.join(' ');
      case 'clear':
        setHistory([]);
        return '';
      case 'date':
        return new Date().toLocaleString();
      case 'whoami':
        return 'guest';
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
      case '':
        return '';
      default:
        return `${cmd}: command not found`;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const command = input.trim();
      const output = executeCommand(command);
      setHistory(prev => [...prev, `> ${command}`, ...output.split('\n')]);
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
          <div key={index} className="whitespace-pre">{line}</div>
        ))}
        <div className="flex">
          <span>{'>'}</span>
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
        <div ref={endOfHistoryRef} />
      </div>
    </div>
  );
};

export default Terminal;