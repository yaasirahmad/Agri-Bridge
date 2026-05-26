import { useState } from 'react';
import { Bot, Sparkles, User, Loader2, Send } from 'lucide-react';
import { ChatMessage } from '../../../types';

interface ZiraatChatPanelProps {
  chatMessages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isBotTyping: boolean;
}

export default function ZiraatChatPanel({
  chatMessages,
  onSendMessage,
  isBotTyping,
}: ZiraatChatPanelProps) {
  const [inputMessage, setInputMessage] = useState('');

  const cleanMessageText = (text: string) => {
    return text
      .replace(/####\s*/g, '')
      .replace(/###\s*/g, '')
      .replace(/##\s*/g, '')
      .replace(/#\s*/g, '')
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .trim();
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;
    onSendMessage(inputMessage);
    setInputMessage('');
  };

  const handleQuickQuestion = (query: string) => {
    onSendMessage(query);
  };

  return (
    <div className="bg-brand-green rounded-2xl shadow-xl border border-brand-gold/30 flex flex-col h-[650px] relative overflow-hidden" id="ai-assistant-card">
      {/* Header */}
      <div className="p-5 border-b border-brand-cream/10 bg-brand-green/80 backdrop-blur flex items-center justify-between" id="ai-assistant-header">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-gold/20 rounded-xl relative">
            <Bot className="w-6 h-6 text-brand-gold" />
            <span className="absolute bottom-0.5 right-0.5 w-2 h-2 bg-emerald-400 rounded-full border border-brand-green"></span>
          </div>
          <div>
            <h3 className="text-brand-cream font-serif font-bold text-md flex items-center gap-1.5">
              Crop Advisor
              <Sparkles className="w-4 h-4 text-brand-gold" />
            </h3>
            <p className="text-[11px] text-brand-cream/70 font-sans">Online</p>
          </div>
        </div>

      </div>

      {/* Quick Questions Helper Panel */}
      <div className="p-3 bg-brand-emerald-light/40 border-b border-brand-cream/10" id="ai-assistant-suggestions">
        <p className="text-[10px] uppercase font-bold tracking-wider text-brand-gold mb-1 text-center font-sans">
          Quick Questions
        </p>
        <div className="flex flex-col gap-1.5" id="suggestion-pills">
          <button
            onClick={() => handleQuickQuestion('How do I optimize water for Punjab basmati rice?')}
            className="text-left text-xs bg-brand-green hover:bg-brand-emerald-light text-brand-cream hover:text-brand-gold border border-brand-cream/10 rounded-lg py-1.5 px-2.5 transition-all text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer"
          >
            How to save water for rice?
          </button>
          <button
            onClick={() => handleQuickQuestion('How to dry date palms in Khairpur Sindh?')}
            className="text-left text-xs bg-brand-green hover:bg-brand-emerald-light text-brand-cream hover:text-brand-gold border border-brand-cream/10 rounded-lg py-1.5 px-2.5 transition-all text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer"
          >
            Best practices for date farming?
          </button>
          <button
            onClick={() => handleQuickQuestion('What are the blockchain Smart Contract rules?')}
            className="text-left text-xs bg-brand-green hover:bg-brand-emerald-light text-brand-cream hover:text-brand-gold border border-brand-cream/10 rounded-lg py-1.5 px-2.5 transition-all text-ellipsis overflow-hidden whitespace-nowrap cursor-pointer"
          >
            How does trade payment work?
          </button>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-brand-green/95" id="ai-message-pane">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 max-w-[85%] ${
              msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                msg.sender === 'user' ? 'bg-brand-gold text-brand-green' : 'bg-brand-cream text-brand-green'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div
              className={`p-3 rounded-xl text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-brand-gold text-brand-green font-semibold rounded-tr-none'
                  : 'bg-white/10 text-brand-cream rounded-tl-none border border-brand-cream/5 text-slate-100 whitespace-pre-wrap'
              }`}
            >
              <p className="whitespace-pre-wrap">{cleanMessageText(msg.text)}</p>
              <span className="block text-[10px] text-right mt-1 opacity-60 font-mono">
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {isBotTyping && (
          <div className="flex gap-3 max-w-[80%]" id="assistant-typing-anim">
            <div className="w-7 h-7 rounded-lg bg-brand-cream text-brand-green flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3 bg-white/5 border border-brand-cream/5 rounded-xl rounded-tl-none flex items-center gap-2">
              <Loader2 className="w-4 h-4 text-brand-gold animate-spin" />
              <span className="text-xs text-brand-cream italic font-sans">Typing...</span>
            </div>
          </div>
        )}
      </div>

      {/* Form Input Area */}
      <div className="p-4 border-t border-brand-cream/10 bg-brand-green" id="chat-input-area">
        <div className="flex gap-2 relative">
          <input
            type="text"
            placeholder="Type your question..."
            className="flex-1 bg-brand-emerald-light text-brand-cream border border-brand-cream/10 rounded-xl py-3 pl-3 pr-10 text-sm focus:outline-none focus:border-brand-gold/60 placeholder-brand-cream/45"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <button
            onClick={handleSendMessage}
            className="absolute right-1.5 top-1.5 p-2 bg-brand-gold hover:bg-brand-gold-light text-brand-green rounded-lg transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
