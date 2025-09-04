
import React from 'react';
import { StartIcon } from '../components/icons';

const About: React.FC = () => {
  return (
    <div className="p-4 h-full flex flex-col items-center justify-center text-center bg-gray-800/50 rounded-b-lg">
      <StartIcon className="w-16 h-16 text-cyan-400 mb-4" />
      <h1 className="text-2xl font-bold mb-2">GeminiOS</h1>
      <p className="text-gray-300">A simulated desktop environment.</p>
      <p className="text-sm text-gray-400 mt-4">
        Built with React, TypeScript, and Tailwind CSS.
      </p>
    </div>
  );
};

export default About;
