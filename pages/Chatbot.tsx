
import React, { useState, useEffect, useRef, useContext } from 'react';
import { LanguageContext } from '../App';
import { startChat } from '../services/geminiService';
import { Bot, User as UserIcon, Send } from 'lucide-react';
import { Chat, GenerateContentResponse } from '@google/genai';

interface Message {
  text: string;
  sender: 'user' | 'bot';
}

const Chatbot: React.FC = () => {
  const { t } = useContext(LanguageContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chat, setChat] = useState<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChat(startChat());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading || !chat) return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await chat.sendMessageStream({ message: input });
      let botResponse = '';
      setMessages((prev) => [...prev, { text: '', sender: 'bot' }]);
      for await (const chunk of result) {
        botResponse += chunk.text;
        setMessages((prev) => {
            const newMessages = [...prev];
            newMessages[newMessages.length - 1] = { text: botResponse, sender: 'bot' };
            return newMessages;
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [...prev, { text: t.error, sender: 'bot' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gray-100 dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        <div className="text-center mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">{t.chatWithNafsiBot}</h1>
          <p className="text-gray-600 dark:text-gray-300">{t.nafsiBotDescription}</p>
        </div>
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-end gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.sender === 'bot' && <Bot className="w-8 h-8 p-1.5 bg-blue-500 text-white rounded-full flex-shrink-0" />}
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-2xl shadow ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'
              }`}
            >
              <p className="whitespace-pre-wrap">{msg.text}</p>
            </div>
            {msg.sender === 'user' && <UserIcon className="w-8 h-8 p-1.5 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white rounded-full flex-shrink-0" />}
          </div>
        ))}
        {isLoading && (
            <div className="flex items-end gap-2 justify-start">
                 <Bot className="w-8 h-8 p-1.5 bg-blue-500 text-white rounded-full flex-shrink-0" />
                 <div className="px-4 py-2 rounded-2xl shadow bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none">
                    <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t.typeMessage}
            className="flex-1 p-3 border border-gray-300 dark:border-gray-600 rounded-full bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          >
            <Send size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
