import React, { useState } from 'react';
import { ExternalLink, ChevronDown, ChevronUp, Quote, Clock } from 'lucide-react';
import { SourceCitation } from '../../types';

interface SourceCardProps {
  source: SourceCitation;
  index: number;
}

export const SourceCard: React.FC<SourceCardProps> = ({ source, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-xl bg-[#1E293B]/70 border border-white/10 hover:border-indigo-500/40 transition-all overflow-hidden text-xs">
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-2 overflow-hidden pr-2">
          <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
            {index + 1}
          </span>
          <div className="overflow-hidden">
            <div className="font-semibold text-slate-200 truncate flex items-center gap-1.5">
              <span>{source.guest}</span>
              {source.company && (
                <span className="text-[10px] text-slate-400 font-normal">({source.company})</span>
              )}
            </div>
            <div className="text-[11px] text-slate-400 truncate">{source.title}</div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded-md border border-white/5">
            <Clock className="w-2.5 h-2.5 text-indigo-400" />
            {source.timestamp}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-3 bg-[#0F172A]/80 border-t border-white/5 space-y-2 text-[11px] leading-relaxed animate-fadeIn">
          <div className="flex items-start gap-2 text-slate-300 italic">
            <Quote className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
            <span>"{source.snippet}"</span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
            <span className="text-slate-400">
              Section: <strong className="text-slate-300">{source.section || 'Transcript Excerpt'}</strong>
            </span>
            {source.url && (
              <a
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 hover:underline"
              >
                <span>Full Episode</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
