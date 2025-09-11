import React, { useState } from 'react';
import { StartIcon } from './icons';

interface LoginScreenProps {
  onLogin: (username: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('guest');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-200 dark:bg-gray-900 flex flex-col items-center justify-center text-black dark:text-white">
      <div 
        className="text-center p-8 bg-gray-300/50 dark:bg-gray-800/50 rounded-lg shadow-2xl backdrop-blur-md animate-fade-in-up"
        style={{ backgroundImage: `radial-gradient(circle at top, rgba(10, 128, 148, 0.3), transparent 70%)` }}
      >
        <StartIcon className="w-24 h-24 text-cyan-500 dark:text-cyan-400 mx-auto mb-4" />
        <h1 className="text-4xl font-bold mb-2">Welcome to GeminiOS</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">Enter a username to begin or continue your session.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-xs mx-auto">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-gray-100/80 dark:bg-gray-900/80 text-black dark:text-white px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-center text-lg"
            placeholder="Username"
          />
          <button
            type="submit"
            className="px-4 py-3 bg-cyan-600 rounded-md hover:bg-cyan-700 text-white font-bold text-lg transition-colors"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;