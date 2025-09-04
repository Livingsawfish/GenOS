
import React, { useState, useRef } from 'react';

interface TextEditorProps {
  initialContent?: string;
  filePath?: string;
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

const getLanguage = (filePath?: string): 'python' | 'javascript' | 'other' => {
    const extension = filePath?.split('.').pop()?.toLowerCase();
    if (extension === 'py') return 'python';
    if (['js', 'jsx', 'ts', 'tsx'].includes(extension || '')) return 'javascript';
    return 'other';
}

const highlightCode = (code: string, language: 'python' | 'javascript' | 'other'): string => {
    if (language === 'other') {
        // Simple escape for HTML
        return code.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    
    const keywords = language === 'python' ? pythonKeywords : jsKeywords;
    const keywordRegex = new RegExp(`\\b(${keywords.join('|')})\\b`, 'g');

    return code
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(keywordRegex, '<span class="text-cyan-400">$1</span>') // Keywords
        .replace(/(\b(def|function)\s+)(\w+)/g, '$1<span class="text-yellow-400">$3</span>') // Function names
        .replace(/(['"`])(?:(?=(\\?))\2.)*?\1/g, '<span class="text-rose-400">$&</span>') // Strings
        .replace(/(#|\/\/).*$/gm, '<span class="text-gray-500">$&</span>') // Comments
        .replace(/\b(\d+)\b/g, '<span class="text-amber-400">$1</span>'); // Numbers
};

const TextEditor: React.FC<TextEditorProps> = ({ initialContent, filePath }) => {
  const [code, setCode] = useState(initialContent ?? 'Welcome to the Text Editor!\n\nStart typing here...');
  const language = getLanguage(filePath);
  
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const preRef = useRef<HTMLPreElement>(null);

  const syncScroll = () => {
    if (editorRef.current && preRef.current) {
        preRef.current.scrollTop = editorRef.current.scrollTop;
        preRef.current.scrollLeft = editorRef.current.scrollLeft;
    }
  };

  // Add a newline to the highlighted code to ensure the last line is rendered
  // correctly and the cursor is visible when on an empty last line.
  const highlightedCode = highlightCode(code + '\n', language);

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-b-lg relative font-mono text-sm leading-relaxed">
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
  );
};

export default TextEditor;
