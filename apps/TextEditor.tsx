
import React, { useState } from 'react';

const TextEditor: React.FC = () => {
  const [text, setText] = useState('Welcome to the Text Editor!\n\nStart typing here...');

  return (
    <div className="h-full flex flex-col bg-gray-900 rounded-b-lg">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full h-full bg-gray-200 text-gray-900 p-2 rounded-b-lg border-none focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono"
        placeholder="Start typing..."
      />
    </div>
  );
};

export default TextEditor;
