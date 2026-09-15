import React, { useState } from 'react';
import { ExternalLink, BookOpen, Play, Clock, Quote, ChevronDown, ChevronUp } from 'lucide-react';
import { SourceCitation } from '../../types';

interface SourceReferencesProps {
  sources: SourceCitation[];
}

export const SourceReferences: React.FC<SourceReferencesProps> = ({ sources }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!sources || sources.length === 0) return null;

  const getMediaTimestampUrl = (url?: string, timestampStr?: string): string => {
    if (!url) return '';
    if (!timestampStr) return url;

    // Parse start timestamp (e.g. "04:12" or "04:12 - 09:45")
    const startPart = timestampStr.split('-')[0].trim();
    const parts = startPart.split(':').map(Number);
    let totalSeconds = 0;
    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
      totalSeconds = parts[0] * 60 + parts[1];
    } else if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      totalSeconds = parts[0] * 3600 + parts[1] * 60 + parts[2];
    }

    if (totalSeconds <= 0) return url;

    // Handle YouTube links
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const sep = url.includes('?') ? '&' : '?';
      return `${url}${sep}t=${totalSeconds}s`;
    }

    // Generic media / web link with timestamp anchor & parameter
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}t=${startPart}#t=${totalSeconds}`;
  };

  return (
    <div className="mt-5 pt-4 border-t border-gray-200/60 dark:border-[#1E293B] space-y-2.5">
      {/* High Contrast Header */}
      <div className="flex items-center gap-2 text-xs font-bold text-gray-900 dark:text-white">
        <BookOpen className="w-3.5 h-3.5 text-[#10B981]" />
        <span>Sources & Evidence ({sources.length})</span>
      </div>

      <div className="space-y-2">
        {sources.slice(0, 3).map((src, idx) => {
          const isExpanded = expandedIndex === idx;
          const displayTime = src.timestamp ? src.timestamp.split('-')[0].trim() : '00:00';
          const mediaUrl = getMediaTimestampUrl(src.url, src.timestamp);

          return (
            <div
              key={idx}
              className="rounded-xl border border-[#E5E7EB] dark:border-[#1E293B] bg-white dark:bg-[#0F172A] shadow-xs hover:border-gray-300 dark:hover:border-gray-700 transition-all overflow-hidden"
            >
              {/* Reference Main Row */}
              <div
                onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                className="p-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-[#1E293B]/40 transition-colors"
              >
                {/* Left: Guest Avatar Thumbnail & Details */}
                <div className="flex items-center gap-3 overflow-hidden pr-3">
                  {/* Avatar / Thumbnail */}
                  <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                    {src.guest ? src.guest.split(' ').map(n => n[0]).join('') : 'L'}
                  </div>

                  <div className="overflow-hidden">
                    <div className="font-bold text-xs text-[#111827] dark:text-[#F8FAFC] truncate">
                      {src.guest}
                    </div>
                    <div className="text-xs text-[#4B5563] dark:text-[#9CA3AF] truncate">
                      {src.title}
                    </div>
                    <div className="text-[11px] text-[#6B7280] dark:text-[#8F98A8] truncate">
                      Lenny's Podcast {src.company ? `· ${src.company}` : ''}
                    </div>
                  </div>
                </div>

                {/* Right: Timestamp, Play Button, External Link, Expand Chevron */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <div className="flex items-center gap-1 text-xs text-[#4B5563] dark:text-[#9CA3AF] font-medium">
                    <Clock className="w-3 h-3 text-[#6B7280]" />
                    <span>{displayTime}</span>
                  </div>

                  {/* BUG 2 FIX: Play Clip Button */}
                  <button
                    type="button"
                    disabled={!src.url}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!mediaUrl) return;
                      window.open(mediaUrl, '_blank', 'noopener,noreferrer');
                    }}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      src.url
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-600 dark:text-[#10B981] border border-emerald-500/30 cursor-pointer'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed opacity-50'
                    }`}
                    title={
                      src.url
                        ? `Play podcast clip at ${displayTime}`
                        : 'No source audio/video URL available'
                    }
                    aria-label={src.url ? `Play clip at ${displayTime}` : 'Playback unavailable'}
                  >
                    <Play className="w-3 h-3 fill-current ml-0.5" />
                  </button>

                  {/* BUG 3 FIX: External Link Button */}
                  {src.url ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(src.url, '_blank', 'noopener,noreferrer');
                      }}
                      className="p-1 text-[#6B7280] hover:text-[#111827] dark:hover:text-white transition-colors cursor-pointer rounded"
                      title={`Open full episode source: ${src.title}`}
                      aria-label="Open episode source in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      className="p-1 text-gray-300 dark:text-gray-600 cursor-not-allowed opacity-50 rounded"
                      title="Source URL not available"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* BUG 4 FIX: Expand/Collapse Chevron Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedIndex(isExpanded ? null : idx);
                    }}
                    className="p-1 text-[#6B7280] hover:text-[#111827] dark:hover:text-white transition-colors cursor-pointer rounded"
                    title={isExpanded ? 'Collapse transcript evidence' : 'Expand transcript evidence'}
                    aria-label={isExpanded ? 'Collapse evidence' : 'Expand evidence'}
                  >
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-[#6B7280]" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-[#6B7280]" />
                    )}
                  </button>
                </div>
              </div>

              {/* BUG 4 FIX: Expandable Transcript Evidence & Details */}
              {isExpanded && (
                <div className="px-4 pb-3.5 pt-2.5 border-t border-gray-200/60 dark:border-[#1E293B] bg-[#F9FAFB] dark:bg-[#0B0F19] text-xs space-y-2.5">
                  {/* Relevant Transcript Excerpt */}
                  <div className="flex items-start gap-2 text-[#374151] dark:text-[#D1D5DB] italic leading-relaxed pt-1">
                    <Quote className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                    <span>"{src.snippet}"</span>
                  </div>

                  {/* Metadata Grid */}
                  <div className="pt-2 border-t border-gray-200/60 dark:border-[#1E293B] grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-[#4B5563] dark:text-[#8F98A8]">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Guest: </span>
                      <strong className="text-[#111827] dark:text-[#F8FAFC] font-semibold">
                        {src.guest} {src.company ? `(${src.company})` : ''}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Episode: </span>
                      <strong className="text-[#111827] dark:text-[#F8FAFC] font-semibold truncate block">
                        {src.title}
                      </strong>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Section: </span>
                      <span className="text-gray-700 dark:text-gray-300">{src.section || 'Key Discussion'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Timestamp: </span>
                      <span className="font-mono text-[10px] text-gray-700 dark:text-gray-300">{src.timestamp}</span>
                    </div>
                  </div>

                  {/* Source URL link in expanded card */}
                  {src.url && (
                    <div className="pt-2 flex items-center justify-between text-[11px] border-t border-gray-200/40 dark:border-[#1E293B]/60">
                      <span className="text-gray-500 dark:text-gray-400">Source URL:</span>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(src.url, '_blank', 'noopener,noreferrer');
                        }}
                        className="flex items-center gap-1 text-[#059669] dark:text-[#10B981] hover:underline font-medium truncate max-w-sm"
                      >
                        <span className="truncate">{src.url}</span>
                        <ExternalLink className="w-3 h-3 shrink-0" />
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
