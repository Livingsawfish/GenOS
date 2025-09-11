import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { WizardIcon } from '../components/icons';

interface AppWizardProps {
  addGeneratedApp: (appName: string, component: React.ComponentType<any>) => void;
}

declare global {
  interface Window {
    Babel: any;
  }
}

const AppWizard: React.FC<AppWizardProps> = ({ addGeneratedApp }) => {
  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!appName.trim() || !appDescription.trim()) return;

    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `
        Generate a single, self-contained React functional component based on the following description.
        - The component must be a function that returns JSX.
        - It must use ONLY React hooks (useState, useEffect, etc.) and standard HTML elements.
        - Style the component using Tailwind CSS classes.
        - The component must be fully functional and self-contained.
        - DO NOT include 'import React...' or 'export default...'.
        - Your response MUST be ONLY the code, starting with '() => {' and ending with '}'.
        - Do not add any explanation or markdown formatting like \`\`\`.
        
        Description: "${appDescription}"
      `;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      let responseText = response.text;
      
      const startIndex = responseText.indexOf('() => {');
      if (startIndex === -1) {
        throw new Error("AI did not return a component in the expected format.");
      }
      
      let codeBlock = responseText.substring(startIndex);
      
      let braceCount = 0;
      let endIndex = -1;
      let inString = false;
      let stringChar = '';

      for (let i = 0; i < codeBlock.length; i++) {
        const char = codeBlock[i];
        if (inString) {
          if (char === stringChar && codeBlock[i-1] !== '\\') {
            inString = false;
          }
        } else if (char === "'" || char === '"' || char === '`') {
          inString = true;
          stringChar = char;
        } else if (char === '{') {
          braceCount++;
        } else if (char === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIndex = i;
            break;
          }
        }
      }

      if (endIndex === -1) {
        throw new Error("Could not parse the generated component code; it seems to be incomplete.");
      }

      const finalComponentCode = codeBlock.substring(0, endIndex + 1);

      if (!window.Babel) {
        throw new Error("Babel is not loaded. Cannot transpile dynamic component.");
      }

      const transformedCode = window.Babel.transform(
        `const TempComponent = ${finalComponentCode};`,
        { presets: ['react'] }
      ).code;
      
      const componentFactory = new Function('React', `${transformedCode}; return TempComponent;`);
      const GeneratedComponent = componentFactory(React);

      addGeneratedApp(appName.trim(), GeneratedComponent);
      setSuccess(true);
      setAppName('');
      setAppDescription('');
      setTimeout(() => setSuccess(false), 4000);

    } catch (e) {
      console.error("Failed to generate app:", e);
      let errorMessage = "Something went wrong while generating the app. The AI might be busy, or the request was invalid. Please try again.";
      if (e instanceof Error) {
          errorMessage = `Failed to generate app: ${e.message}`;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 h-full flex flex-col items-center justify-center text-center bg-gray-800/50 rounded-b-lg">
      <WizardIcon className="w-16 h-16 text-cyan-400 mb-4" />
      <h1 className="text-2xl font-bold mb-2">AI App Wizard</h1>
      <p className="text-gray-300 mb-4">Describe the app you want to create.</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="w-full bg-gray-900/80 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Enter App Name"
            disabled={isLoading}
          />
          <textarea
            value={appDescription}
            onChange={(e) => setAppDescription(e.target.value)}
            className="w-full bg-gray-900/80 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500 h-24 resize-none"
            placeholder="E.g., 'a simple pomodoro timer' or 'a markdown previewer'"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700 disabled:bg-gray-500 disabled:cursor-wait flex items-center justify-center"
            disabled={!appName.trim() || !appDescription.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : 'Create App'}
          </button>
        </div>
      </form>

      {success && (
        <p className="mt-4 text-green-400">
          App created successfully! Find it on your desktop or in the Start Menu.
        </p>
      )}
      {error && (
        <p className="mt-4 text-red-400 text-sm max-w-sm">{error}</p>
      )}
    </div>
  );
};

export default AppWizard;