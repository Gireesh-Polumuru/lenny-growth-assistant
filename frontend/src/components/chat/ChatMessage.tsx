import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Copy, Check, ExternalLink, Code2 } from 'lucide-react';
import { Message } from '../../types';
import { SourceReferences } from '../sources/SourceReferences';

interface ChatMessageProps {
  message: Message;
  onOpenArtifact?: (artifactId?: string) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onOpenArtifact }) => {
  const navigate = useNavigate();
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = new Date(message.created_at || Date.now()).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  if (isUser) {
    return (
      <div className="py-4 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto flex items-start gap-3">
          {/* User Avatar */}
          <div className="w-8 h-8 rounded-full bg-[#059669] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-xs">
            S
          </div>

          {/* User Message Bubble - Light Card on Dark Canvas with High Contrast Dark Text */}
          <div className="flex-1 space-y-1">
            <div className="bg-white px-4 py-3 rounded-2xl text-sm text-[#111827] leading-relaxed max-w-2xl border border-gray-200/60 shadow-xs">
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
            <div className="text-[11px] text-[#8F98A8] pl-1">
              {formattedTime}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-5 px-4 sm:px-6 border-b border-gray-200/60 dark:border-[#1E293B]/50">
      <div className="max-w-3xl mx-auto flex items-start gap-3">
        {/* Assistant Avatar */}
        <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-500/20 dark:border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-[#10B981] shrink-0 mt-0.5 shadow-xs">
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 fill-current"
          >
            <path d="M17.472 2C13.25 2 9.5 4.5 7.5 8C5.5 11.5 6 16 6 16s4.5.5 8-1.5c3.5-2 6-5.75 6-9.972C20 3.128 18.872 2 17.472 2zM12.5 13.5c-1.5.5-3 .5-4.5 0 0-1.5.5-3 1.5-4.5 1-1.5 2.5-2.5 4-3 1-.5 2-.5 2.5 0s0 1.5-.5 2.5c-.5 1.5-1.5 3-3.5 5z" />
          </svg>
        </div>

        {/* Assistant Content */}
        <div className="flex-1 space-y-2.5 overflow-hidden">
          {/* Assistant Header & Timestamp */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 dark:text-white text-xs">Assistant</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-500 dark:text-[#8F98A8]">{formattedTime}</span>
              <button
                type="button"
                onClick={handleCopy}
                className="p-1 text-gray-400 hover:text-gray-900 dark:text-[#8F98A8] dark:hover:text-white transition-colors rounded cursor-pointer"
                title="Copy response"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Formatted Markdown Content */}
          <div className="prose-editorial">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                ol: ({ node, ...props }) => (
                  <ol className="space-y-2.5 my-3 list-none pl-0" {...props} />
                ),
                li: ({ node, children, ...props }) => {
                  return (
                    <li className="flex items-start gap-2.5 text-sm" {...props}>
                      {children}
                    </li>
                  );
                },
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>

          {/* Artifact Callout Button (if artifact was generated) */}
          {message.artifact_id && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  if (onOpenArtifact) onOpenArtifact(message.artifact_id);
                  navigate(`/artifacts/${message.artifact_id}`, {
                    state: { fromSession: message.session_id }
                  });
                }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white hover:bg-gray-50 border border-[#E5E7EB] text-xs font-semibold text-[#111827] transition-colors group shadow-xs cursor-pointer"
              >
                <Code2 className="w-4 h-4 text-[#0E382B]" />
                <span>Open Generated Artifact in Workspace</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#6B7280] group-hover:text-[#111827] transition-colors" />
              </button>
            </div>
          )}

          {/* Grounded Source Citations */}
          {message.sources && message.sources.length > 0 && (
            <SourceReferences sources={message.sources} />
          )}
        </div>
      </div>
    </div>
  );
};
