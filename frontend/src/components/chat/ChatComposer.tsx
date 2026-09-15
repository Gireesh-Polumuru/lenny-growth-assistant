import React, { useRef, useEffect } from 'react';
import { Send, Loader2, Paperclip } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ChatComposerProps {
  input: string;
  onInputChange: (val: string) => void;
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export const ChatComposer: React.FC<ChatComposerProps> = ({
  input,
  onInputChange,
  onSendMessage,
  isLoading,
}) => {
  const { theme } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
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
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const applySuggestedAction = (actionText: string) => {
    onInputChange(input ? `${actionText}: ${input}` : actionText);
    textareaRef.current?.focus();
  };

  return (
    <div className={`p-4 border-t shrink-0 transition-colors duration-150 ${
      theme === 'dark' ? 'bg-[#080D16] border-[#1E293B]/60' : 'bg-[#F1F5F9] border-[#E2E8F0]'
    }`}>
      <div className="max-w-3xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#E5E7EB] shadow-xs p-3 space-y-2.5 focus-within:border-gray-300 transition-colors"
        >
          {/* Top Row: Input + Grounding indicator + Send Button */}
          <div className="flex items-center gap-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a product, growth, or Lenny's Podcast question..."
              rows={1}
              disabled={isLoading}
              className="flex-1 py-1 px-1 bg-transparent text-sm text-[#111827] placeholder:text-[#9CA3AF] resize-none outline-none max-h-36 min-h-[36px] leading-relaxed"
            />

            <div className="flex items-center gap-3 shrink-0">
              {/* Grounded Indicator */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#4B5563] font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
                <span>Grounded in Lenny's Podcast</span>
              </div>

              {/* Send Button */}
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`p-2 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                  input.trim() && !isLoading
                    ? 'bg-[#0E382B] text-white hover:bg-[#0A2B21] shadow-xs'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                title="Send question (Enter)"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <Send className="w-4 h-4 fill-current ml-0.5" />
                )}
              </button>
            </div>
          </div>

          {/* Bottom Row: Paperclip + Suggested Actions */}
          <div className="flex items-center gap-2 pt-1 border-t border-gray-100 overflow-x-auto scrollbar-none text-xs">
            <button
              type="button"
              className="p-1 text-[#9CA3AF] hover:text-[#111827] rounded-md transition-colors"
              title="Attach context"
            >
              <Paperclip className="w-3.5 h-3.5" />
            </button>

            <span className="text-[11px] font-semibold text-[#6B7280] mr-1 shrink-0">
              Suggested
            </span>

            <div className="flex items-center gap-1.5 overflow-x-auto">
              <button
                type="button"
                onClick={() => applySuggestedAction('Write a Ship 30 for 30 essay on')}
                disabled={isLoading}
                className="px-3 py-1 rounded-full border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[11px] text-[#374151] font-medium transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
              >
                Write a Ship 30 essay
              </button>

              <button
                type="button"
                onClick={() => applySuggestedAction('Create a framework for')}
                disabled={isLoading}
                className="px-3 py-1 rounded-full border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[11px] text-[#374151] font-medium transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
              >
                Create a framework
              </button>

              <button
                type="button"
                onClick={() => applySuggestedAction('Summarize this conversation')}
                disabled={isLoading}
                className="px-3 py-1 rounded-full border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[11px] text-[#374151] font-medium transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
              >
                Summarize this
              </button>

              <button
                type="button"
                onClick={() => applySuggestedAction('Build an artifact for')}
                disabled={isLoading}
                className="px-3 py-1 rounded-full border border-[#E5E7EB] bg-white hover:bg-gray-50 text-[11px] text-[#374151] font-medium transition-colors shadow-2xs whitespace-nowrap cursor-pointer"
              >
                Build an artifact
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
