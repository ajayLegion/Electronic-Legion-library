import React, { useState, useRef, useEffect } from 'react';
import { generateCircuitResponse } from '../services/geminiService';
import { Message } from '../types';
import { Send, Bot, User, Cpu, Code2 } from 'lucide-react';

const AICircuitDesigner: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', content: "I am the Legion AI Assistant. Describe a circuit or component, and I will generate the specifications and netlist for you." }
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

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const responseText = await generateCircuitResponse(input);
    
    const modelMsg: Message = { role: 'model', content: responseText };
    setMessages(prev => [...prev, modelMsg]);
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Basic markdown parser for code blocks
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(```[\s\S]*?```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) {
        // Extract language and code
        const lines = part.split('\n');
        const language = lines[0].replace('```', '').trim();
        const code = lines.slice(1, -1).join('\n');
        
        if (language === 'svg') {
             return (
                <div key={index} className="my-4 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden">
                    <div className="bg-slate-800 px-4 py-1 text-xs text-slate-400 font-mono border-b border-slate-700 flex items-center justify-between">
                        <span>GENERATED SCHEMATIC</span>
                        <Cpu className="w-3 h-3" />
                    </div>
                    <div className="p-4 flex justify-center bg-white/5">
                        <div dangerouslySetInnerHTML={{ __html: code }} className="w-full max-w-sm stroke-white text-white" />
                    </div>
                </div>
             );
        }

        return (
          <div key={index} className="my-4 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
            <div className="bg-slate-900 px-4 py-1 text-xs text-slate-400 font-mono border-b border-slate-800 flex items-center justify-between">
               <span>{language.toUpperCase() || 'CODE'}</span>
               <Code2 className="w-3 h-3" />
            </div>
            <pre className="p-4 text-sm font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap">
              {code}
            </pre>
          </div>
        );
      }
      // Regular text with simple paragraph breaks
      return part.split('\n\n').map((para, i) => (
          para ? <p key={`${index}-${i}`} className="mb-2 leading-relaxed">{para}</p> : null
      ));
    });
  };

  return (
    <div className="flex flex-col h-full bg-circuit-panel rounded-xl border border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-700 bg-slate-800/50 flex items-center gap-3">
            <div className="bg-gradient-to-r from-circuit-accent to-blue-600 p-2 rounded-lg">
                <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
                <h2 className="font-bold text-slate-100">Circuit Designer AI</h2>
                <p className="text-xs text-slate-400">Powered by Gemini 3.0 Flash</p>
            </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        msg.role === 'user' ? 'bg-slate-700 text-slate-300' : 'bg-circuit-accent/20 text-circuit-accent'
                    }`}>
                        {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                    </div>
                    <div className={`flex-1 max-w-3xl ${msg.role === 'user' ? 'text-right' : ''}`}>
                         <div className={`inline-block text-left p-4 rounded-2xl ${
                             msg.role === 'user' 
                             ? 'bg-slate-700 text-white rounded-tr-sm' 
                             : 'bg-slate-800/50 text-slate-200 border border-slate-700/50 rounded-tl-sm'
                         }`}>
                             {renderMessageContent(msg.content)}
                         </div>
                    </div>
                </div>
            ))}
            {isLoading && (
                <div className="flex gap-4">
                     <div className="w-8 h-8 rounded-full bg-circuit-accent/20 flex items-center justify-center shrink-0 animate-pulse">
                        <Bot className="w-5 h-5 text-circuit-accent" />
                    </div>
                    <div className="bg-slate-800/50 px-4 py-3 rounded-2xl rounded-tl-sm border border-slate-700/50 flex items-center gap-2">
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                        <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-slate-900 border-t border-slate-700">
            <div className="relative max-w-4xl mx-auto">
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe a circuit (e.g., 'Design an active low-pass filter using an Op-Amp with a cutoff of 1kHz')..."
                    className="w-full bg-slate-800 text-slate-200 border border-slate-700 rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:border-circuit-accent focus:ring-1 focus:ring-circuit-accent resize-none h-[60px]"
                />
                <button 
                    onClick={handleSend}
                    disabled={isLoading || !input.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-circuit-accent text-slate-900 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
            <p className="text-center text-[10px] text-slate-600 mt-2">
                AI can make mistakes. Please verify generated netlists against datasheets.
            </p>
        </div>
    </div>
  );
};

export default AICircuitDesigner;
