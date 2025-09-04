import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { GeminiIcon } from '../components/icons';

interface Message {
  sender: 'user' | 'ai';
  text: string;
}

const GeminiChat: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'ai', text: "Hello! I'm Gemini. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const newChat = ai.chats.create({ 
        model: 'gemini-2.5-flash',
        config: {
            systemInstruction: "You are Gemini, a helpful and friendly AI assistant running inside GeminiOS, a simulated operating system. Keep your responses concise and helpful.",
        },
    });
    setChat(newChat);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chat || isLoading) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const responseStream = await chat.sendMessageStream({ message: input });
      
      let aiResponseText = '';
      setMessages(prev => [...prev, { sender: 'ai', text: '...' }]);
      
      for await (const chunk of responseStream) {
        aiResponseText += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { sender: 'ai', text: aiResponseText };
          return newMessages;
        });
      }

    } catch (error) {
      console.error("Gemini API error:", error);
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900/80 rounded-b-lg">
      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
             {msg.sender === 'ai' && <span className="w-8 h-8 flex-shrink-0 text-cyan-400"><GeminiIcon /></span>}
            <div className={`p-3 rounded-lg max-w-lg ${msg.sender === 'user' ? 'bg-cyan-600' : 'bg-gray-700'}`}>
              <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && messages[messages.length-1]?.sender === 'user' && (
             <div className="flex items-start gap-2.5">
                <span className="w-8 h-8 flex-shrink-0 text-cyan-400"><GeminiIcon /></span>
                <div className="p-3 rounded-lg bg-gray-700">
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                        <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse [animation-delay:0.4s]"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-2 border-t border-white/20">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full bg-gray-800 text-white px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Type a message..."
            disabled={isLoading}
          />
          <button type="submit" className="px-4 py-2 bg-cyan-600 rounded hover:bg-cyan-700 disabled:bg-gray-500 disabled:cursor-not-allowed" disabled={isLoading}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default GeminiChat;
