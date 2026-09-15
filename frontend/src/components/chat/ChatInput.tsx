import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, FileText, Code2, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const applySkillTemplate = (prefix: string) => {
    setInput((prev) => (prev ? `${prefix}: ${prev}` : `${prefix} `));
    textareaRef.current?.focus();
  };

  return (
    <div className="p-3 sm:p-4 bg-[#0B0F17]/90 backdrop-blur-md border-t border-white/10">
      <div className="max-w-4xl mx-auto space-y-2">
        {/* Quick Skill Tags */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-[11px]">
          <span className="text-slate-400 text-[10px] uppercase font-semibold shrink-0">Quick Skills:</span>
          
          <button
            onClick={() => applySkillTemplate('Write a Ship 30 for 30 essay on')}
            disabled={isLoading}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition-all shrink-0 active:scale-95"
          >
            <FileText className="w-3 h-3" />
            <span>Ship 30 for 30 Essay</span>
          </button>

          <button
            onClick={() => applySkillTemplate('Create an interactive HTML calculator for')}
            disabled={isLoading}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/20 transition-all shrink-0 active:scale-95"
          >
            <Code2 className="w-3 h-3" />
            <span>Interactive HTML Tool</span>
          </button>

          <button
            onClick={() => applySkillTemplate('According to Lenny\'s Podcast, what does')}
            disabled={isLoading}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 transition-all shrink-0 active:scale-95"
          >
            <Sparkles className="w-3 h-3" />
            <span>Grounded Q&A</span>
          </button>
        </div>

        {/* Input Box */}
        <form
          onSubmit={handleSubmit}
          className="relative flex items-end bg-[#1E293B] rounded-2xl border border-white/10 focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all shadow-inner"
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a PM/Growth question, request an essay, or generate an interactive tool..."
            rows={1}
            disabled={isLoading}
            className="w-full py-3 pl-4 pr-12 bg-transparent text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 resize-none outline-none max-h-40 min-h-[44px]"
          />

          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`absolute right-2 bottom-2 p-2 rounded-xl transition-all ${
              input.trim() && !isLoading
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-500 hover:to-indigo-600 shadow-md active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </form>

        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
          <span>Press <strong>Enter</strong> to send, <strong>Shift+Enter</strong> for new line</span>
          <span className="font-mono">Strict Transcript Grounding</span>
        </div>
      </div>
    </div>
  );
};
