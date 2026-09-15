import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, RefreshCw, Cpu, Cloud, Terminal } from 'lucide-react';
import { ModelsStatus } from '../../types';

interface ModelSelectorProps {
  modelsStatus: ModelsStatus | null;
  selectedProvider: string;
  onSelectProvider: (provider: string) => void;
  onRefreshStatus?: () => void;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  modelsStatus,
  selectedProvider,
  onSelectProvider,
  onRefreshStatus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const ollama = modelsStatus?.providers?.ollama;
  const anthropic = modelsStatus?.providers?.anthropic;

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getActiveLabel = () => {
    if (selectedProvider === 'ollama') {
      return {
        name: `Ollama · ${ollama?.default_model || 'llama3.2:latest'}`,
        status: ollama?.available ? 'Local' : 'Unavailable',
        statusType: 'Local',
        isOk: !!ollama?.available,
        icon: <Cpu className="w-3.5 h-3.5" />,
      };
    }
    if (selectedProvider === 'anthropic') {
      return {
        name: 'Claude 3.5 Sonnet',
        status: anthropic?.available ? 'Cloud' : 'Key Needed',
        statusType: 'Cloud',
        isOk: !!anthropic?.available,
        icon: <Cloud className="w-3.5 h-3.5" />,
      };
    }
    return {
      name: 'Deterministic Mock PM Engine',
      status: 'Local',
      statusType: 'Local',
      isOk: true,
      icon: <Terminal className="w-3.5 h-3.5" />,
    };
  };

  const active = getActiveLabel();

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#6B7280] font-normal hidden sm:inline">
        Model
      </span>

      <div className="relative" ref={dropdownRef}>
        {/* Trigger Button - Pill shape matching screenshot */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white hover:bg-gray-50 border border-[#E5E7EB] text-xs text-[#111827] font-medium shadow-xs transition-colors cursor-pointer"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              active.isOk ? 'bg-[#059669]' : 'bg-[#F59E0B]'
            }`}
          />
          <span>{active.name}</span>
          <ChevronDown className={`w-3 h-3 text-[#6B7280] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Popover */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-72 rounded-xl bg-white border border-[#E5E7EB] shadow-lg z-50 py-1.5 text-xs">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#6B7280] border-b border-[#E5E7EB]">
              Select Model Provider
            </div>

            {/* Option: Local Ollama */}
            <div
              onClick={() => {
                onSelectProvider('ollama');
                setIsOpen(false);
              }}
              className={`px-3 py-2.5 flex items-start justify-between cursor-pointer hover:bg-[#F9FAFB] transition-colors ${
                selectedProvider === 'ollama' ? 'bg-[#F3F4F6]' : ''
              }`}
            >
              <div className="flex items-start gap-2.5">
                <Cpu className="w-4 h-4 text-[#4B5563] mt-0.5" />
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-[#111827]">
                    <span>Ollama (Local)</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                        ollama?.available
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ollama?.available ? 'Connected' : 'Offline'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6B7280]">
                    {ollama?.default_model || 'llama3.1'} · http://localhost:11434
                  </div>
                </div>
              </div>
              {selectedProvider === 'ollama' && (
                <Check className="w-4 h-4 text-[#0E382B]" />
              )}
            </div>

            {/* Option: Cloud Claude */}
            <div
              onClick={() => {
                onSelectProvider('anthropic');
                setIsOpen(false);
              }}
              className={`px-3 py-2.5 flex items-start justify-between cursor-pointer hover:bg-[#F9FAFB] transition-colors ${
                selectedProvider === 'anthropic' ? 'bg-[#F3F4F6]' : ''
              }`}
            >
              <div className="flex items-start gap-2.5">
                <Cloud className="w-4 h-4 text-[#4B5563] mt-0.5" />
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-[#111827]">
                    <span>Claude 3.5 Sonnet</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase ${
                        anthropic?.available
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {anthropic?.available ? 'API Key Set' : 'Cloud'}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6B7280]">
                    Anthropic frontier reasoning
                  </div>
                </div>
              </div>
              {selectedProvider === 'anthropic' && (
                <Check className="w-4 h-4 text-[#0E382B]" />
              )}
            </div>

            {/* Option: Fast Mock PM Engine */}
            <div
              onClick={() => {
                onSelectProvider('mock');
                setIsOpen(false);
              }}
              className={`px-3 py-2.5 flex items-start justify-between cursor-pointer hover:bg-[#F9FAFB] transition-colors ${
                selectedProvider === 'mock' ? 'bg-[#F3F4F6]' : ''
              }`}
            >
              <div className="flex items-start gap-2.5">
                <Terminal className="w-4 h-4 text-[#4B5563] mt-0.5" />
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-[#111827]">
                    <span>Deterministic Mock PM Engine</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold uppercase bg-blue-100 text-blue-800">
                      Zero Setup
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6B7280]">
                    Instant grounded responses for evaluation
                  </div>
                </div>
              </div>
              {selectedProvider === 'mock' && (
                <Check className="w-4 h-4 text-[#0E382B]" />
              )}
            </div>

            {/* Refresh Diagnostics */}
            {onRefreshStatus && (
              <div className="p-2 border-t border-[#E5E7EB] bg-[#F9FAFB]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRefreshStatus();
                  }}
                  className="w-full py-1 text-center text-[11px] text-[#4B5563] hover:text-[#111827] flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Check local Ollama connection</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Connection State Badge */}
      <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#059669] font-medium">
        <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
        <span>Local</span>
      </div>
    </div>
  );
};
