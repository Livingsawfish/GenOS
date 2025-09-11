
import React, { useState, useRef } from 'react';
import { PlayIcon } from '../components/icons';

interface TextEditorProps {
  initialContent?: string;
  filePath?: string;
  onExecute?: (filePath: string, content: string) => void;
}

const pythonKeywords = [
  'False', 'None', 'True', 'and', 'as', 'assert', 'async', 'await', 'break', 'class', 'continue',
  'def', 'del', 'elif', 'else', 'except', 'finally', 'for', 'from', 'global', 'if', 'import',
  'in', 'is', 'lambda', 'nonlocal', 'not', 'or', 'pass', 'raise', 'return', 'try', 'while',
  'with', 'yield'
];

const jsKeywords = [
  'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete',
  'do', 'else', 'export', 'extends', 'finally', 'for', 'function', 'if', 'import', 'in',
  'instanceof', 'new', 'return', 'super', 'switch', 'this', 'throw', 'try', 'typeof',
  'var', 'void', 'while', 'with', 'yield', 'let', 'static', 'implements', 'interface',
  'package', 'private', 'protected', 'public', 'await', 'async', 'null', 'true', 'false'
];

const cppKeywords = [
    'alignas', 'alignof', 'and', 'and_eq', 'asm', 'auto', 'bitand', 'bitor', 'bool', 'break', 'case', 'catch',
    'char', 'char8_t', 'char16_t', 'char32_t', 'class', 'compl', 'concept', 'const', 'consteval', 'constexpr',
    'const_cast', 'continue', 'co_await', 'co_return', 'co_yield', 'decltype', 'default', 'delete', 'do',
    'double', 'dynamic_cast', 'else', 'enum', 'explicit', 'export', 'extern', 'false', 'float', 'for', 'friend',
    'goto', 'if', 'inline', 'int', 'long', 'mutable', 'namespace', 'new', 'noexcept', 'not', 'not_eq', 'nullptr',
    'operator', 'or', 'or_eq', 'private', 'protected', 'public', 'register', 'reinterpret_cast', 'requires',
    'return', 'short', 'signed', 'sizeof', 'static', 'static_assert', 'static_cast', 'struct', 'switch',
    'template', 'this', 'thread_local', 'throw', 'true', 'try', 'typedef', 'typeid', 'typename', 'union',
    'unsigned', 'using', 'virtual', 'void', 'volatile', 'wchar_t', 'while', 'xor', 'xor_eq'
];

type Language = 'python' | 'javascript' | 'cplusplus' | 'other';

const getLanguage = (filePath?: string): Language => {
    const extension = filePath?.split('.').pop()?.toLowerCase();
    if (extension === 'py') return 'python';
    if (['js', 'jsx', 'ts', 'tsx'].includes(extension || '')) return 'javascript';
    if (['cpp', 'c', 'h', 'hpp'].includes(extension || '')) return 'cplusplus';
    return 'other';
}

const highlightCode = (code: string, language: Language): string => {
    if (language === 'other') {
        // Simple escape for HTML
        return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    
    let keywords: string[];
    switch(language) {
        case 'python': keywords = pythonKeywords; break;
        case 'javascript': keywords = jsKeywords; break;
        case 'cplusplus': keywords = cppKeywords; break;
    }
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');

    let highlighted = code
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(keywordRegex, '<span class="text-cyan-400">$1</span>') // Keywords
        .replace(/(\b(def|function)\s+)(\w+)/g, '$1<span class="text-yellow-400">$3</span>') // Function names
        .replace(/(['"`])(?:(?=(\\?))\2.)*?\1/g, '<span class="text-rose-400">$&</span>') // Strings
        .replace(/(#|\/\/).*$/gm, '<span class="text-gray-500">$&</span>') // Comments
        .replace(/\b(\d+)\b/g, '<span class="text-amber-400">$1</span>'); // Numbers

    if (language === 'cplusplus') {
        highlighted = highlighted.replace(/^(\s*#\w+)/gm, '<span class="text-violet-400">$1</span>'); // Preprocessor
    }
    
    return highlighted;
};

const TextEditor: React.FC<TextEditorProps> = ({ initialContent, filePath, onExecute }) => {
  const [code, setCode] = useState(initialContent ?? 'Welcome to the Text Editor!\n\nStart typing here...');
  const language = getLanguage(filePath);
  const isExecutable = onExecute && filePath && ['python', 'javascript', 'cplusplus'].includes(language);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const syncScroll = () => {
    if (editorRef.current && preRef.current) {
        preRef.current.scrollTop = editorRef.current.scrollTop;
        preRef.current.scrollLeft = editorRef.current.scrollLeft;
    }
  };
  
  const handleRunClick = () => {
      if (onExecute && filePath) {
          onExecute(filePath, code);
      }
  }

  // Add a newline to the highlighted code to ensure the last line is rendered
  // correctly and the cursor is visible when on an empty last line.
  const highlightedCode = highlightCode(code + '\n', language);

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-b-lg font-mono text-sm leading-relaxed">
        {isExecutable && (
             <div className="flex-shrink-0 p-1 bg-gray-800 border-b border-white/10 flex items-center justify-end">
                <button 
                    onClick={handleRunClick}
                    className="flex items-center gap-2 px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-white"
                    title="Run Code (saves automatically)"
                >
                    <PlayIcon className="w-4 h-4" />
                    Run
                </button>
             </div>
        )}
        <div className="flex-grow relative">
            <textarea
                ref={editorRef}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onScroll={syncScroll}
                className="w-full h-full bg-transparent text-transparent caret-white p-2 border-none focus:outline-none resize-none absolute top-0 left-0 z-10 leading-relaxed"
                placeholder="Start typing..."
                spellCheck="false"
            />
            <pre
                ref={preRef}
                aria-hidden="true"
                className="w-full h-full p-2 whitespace-pre-wrap break-words overflow-auto"
            >
                <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            </pre>
        </div>
    </div>
  );
};

export default TextEditor;
