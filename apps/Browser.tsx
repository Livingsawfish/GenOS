
import React, { useState } from 'react';

interface BrowserProps {
  initialContent?: string;
  filePath?: string;
}

const Browser: React.FC<BrowserProps> = ({ initialContent, filePath }) => {
  const isLocalFile = typeof initialContent === 'string';
  const initialUrl = isLocalFile ? `file:///${filePath?.replace(/[/\\]/g, '/')}` : 'https://www.google.com/webhp?igu=1';
  
  const [url, setUrl] = useState(initialUrl);
  const [inputValue, setInputValue] = useState(initialUrl);

  const handleGo = (e: React.FormEvent) => {
    e.preventDefault();
    let finalUrl = inputValue;
    if (!finalUrl.startsWith('http')) {
      finalUrl = `https://${finalUrl}`;
    }
    setUrl(finalUrl);
  };
  
  const iframeSrc = isLocalFile
    ? `data:text/html;charset=utf-8,${encodeURIComponent(initialContent)}`
    : url;

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-b-lg">
      <div className="p-2 bg-gray-700">
        <form onSubmit={handleGo} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-gray-800 text-white px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:bg-gray-700"
            placeholder="Enter URL"
            disabled={isLocalFile}
          />
          <button type="submit" className="px-4 py-1 bg-cyan-600 rounded hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLocalFile}>Go</button>
        </form>
      </div>
      <iframe
        src={iframeSrc}
        className="w-full h-full border-0"
        title="Browser"
        sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-presentation allow-same-origin allow-scripts"
      ></iframe>
    </div>
  );
};

export default Browser;