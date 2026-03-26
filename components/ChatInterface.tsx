import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Sparkles } from 'lucide-react';
import { ChatMessage, UserRole } from '../types';
import { generateResponse } from '../services/geminiService';

interface ChatInterfaceProps {
  userRole: UserRole;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ userRole }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Привет! Я Petsgram AI. Я настроен для роли: ${
        userRole === UserRole.VET ? 'Ветеринар' : 
        userRole === UserRole.FARMER ? 'Фермер' : 
        userRole === UserRole.SCIENTIST ? 'Ученый' : 
        userRole === UserRole.ECO_ACTIVIST ? 'Эко-активист' : 'Владелец питомца'
      }. Чем могу помочь?`,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset chat when role changes
  useEffect(() => {
     setMessages([{
      id: `welcome-${userRole}`,
      role: 'model',
      text: `Режим переключен на: ${userRole}. Чем могу помочь?`,
      timestamp: new Date()
    }]);
  }, [userRole]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateResponse(input, userRole);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Произошла ошибка при соединении с сервером.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="bg-emerald-100 p-2 rounded-full">
            <Sparkles className="text-emerald-600" size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Petsgram Assistant</h2>
            <p className="text-xs text-slate-500 capitalize">{userRole.toLowerCase().replace('_', ' ')} Mode</p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
              
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'user' ? 'bg-slate-200 ml-2' : 'bg-emerald-600 mr-2'
              }`}>
                {msg.role === 'user' ? <User size={16} className="text-slate-600" /> : <Bot size={16} className="text-white" />}
              </div>

              {/* Bubble */}
              <div className={`p-4 rounded-2xl shadow-sm whitespace-pre-wrap leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-br-none' 
                  : msg.isError 
                    ? 'bg-red-50 text-red-600 border border-red-200 rounded-bl-none'
                    : 'bg-white text-slate-800 border border-slate-100 rounded-bl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-end space-x-2">
               <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center shrink-0 mr-2">
                 <Bot size={16} className="text-white" />
               </div>
               <div className="bg-white p-4 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm flex items-center space-x-2">
                 <Loader2 size={16} className="animate-spin text-emerald-600" />
                 <span className="text-slate-400 text-sm">Думаю...</span>
               </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto relative flex items-end bg-slate-100 rounded-2xl border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-200 transition-all">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Задайте вопрос о питомце, лечении или уходе..."
            className="w-full bg-transparent border-none focus:ring-0 p-4 min-h-[60px] max-h-[150px] resize-none text-slate-800 placeholder-slate-400"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-3 mb-1.5 mr-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
