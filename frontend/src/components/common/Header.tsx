import React from 'react';
import { Sparkles, Cpu, Cloud, Terminal, Plus, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { ModelsStatus } from '../../types';

interface HeaderProps {
  modelsStatus: ModelsStatus | null;
  selectedProvider: string;
  onSelectProvider: (provider: string) => void;
  onNewChat: () => void;
  isArtifactOpen: boolean;
  onToggleArtifact: () => void;
  hasActiveArtifact: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  modelsStatus,
  selectedProvider,
  onSelectProvider,
  onNewChat,
  isArtifactOpen,
  onToggleArtifact,
  hasActiveArtifact,
}) => {
  const ollamaAvailable = modelsStatus?.providers?.ollama?.available;
  const claudeAvailable = modelsStatus?.providers?.anthropic?.available;

  return (
    <header className="h-16 border-b border-white/10 bg-[#0B0F17]/90 backdrop-blur-md px-4 flex items-center justify-between z-30 sticky top-0">
      {/* Brand & Title */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-display font-bold text-lg text-white tracking-tight">
              The Lenny Growth Assistant
            </h1>
            <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              FDE AI System
            </span>
          </div>
          <p className="text-xs text-slate-400 font-normal hidden sm:block">
            Grounded Product & Growth Intelligence • Lenny's Podcast
          </p>
        </div>
      </div>

      {/* Model Selector & Actions */}
      <div className="flex items-center gap-3">
        {/* Model Switcher Dropdown */}
        <div className="flex items-center bg-[#1E293B] rounded-xl p-1 border border-white/10 text-xs">
          {/* Local Ollama Button */}
          <button
            onClick={() => onSelectProvider('ollama')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedProvider === 'ollama'
                ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={ollamaAvailable ? 'Local Ollama Running (http://localhost:11434)' : 'Ollama not detected (Click to switch or start ollama serve)'}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Ollama Local</span>
            <span className={`w-2 h-2 rounded-full ${ollamaAvailable ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          </button>

          {/* Cloud Claude Button */}
          <button
            onClick={() => onSelectProvider('anthropic')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedProvider === 'anthropic'
                ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={claudeAvailable ? 'Anthropic Claude API Active' : 'Anthropic API Key not configured'}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Claude 3.5</span>
            <span className={`w-2 h-2 rounded-full ${claudeAvailable ? 'bg-indigo-400' : 'bg-slate-500'}`} />
          </button>

          {/* Fast Deterministic Mock / Demo Mode */}
          <button
            onClick={() => onSelectProvider('mock')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
              selectedProvider === 'mock'
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title="Fast Deterministic Evaluation Engine (Ready to test out of the box)"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Fast Mock</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
          </button>
        </div>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden md:inline">New Chat</span>
        </button>

        {/* Artifact Drawer Toggle */}
        {hasActiveArtifact && (
          <button
            onClick={onToggleArtifact}
            className={`p-2 rounded-xl border transition-all ${
              isArtifactOpen
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                : 'bg-[#1E293B] text-slate-300 border-white/10 hover:bg-slate-800'
            }`}
            title={isArtifactOpen ? 'Close Artifact Panel' : 'Open Artifact Panel'}
          >
            {isArtifactOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4 text-indigo-400 animate-bounce" />}
          </button>
        )}
      </div>
    </header>
  );
};
