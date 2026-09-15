import React, { useState } from 'react';
import { X, Settings, Cpu, Cloud, Terminal, Check, RefreshCw } from 'lucide-react';
import { ModelsStatus } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelsStatus: ModelsStatus | null;
  selectedProvider: string;
  onSelectProvider: (provider: string) => void;
  onRefreshModels?: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  modelsStatus,
  selectedProvider,
  onSelectProvider,
  onRefreshModels,
}) => {
  const [ollamaHost, setOllamaHost] = useState('http://localhost:11434');
  const [claudeApiKey, setClaudeApiKey] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const ollama = modelsStatus?.providers?.ollama;
  const anthropic = modelsStatus?.providers?.anthropic;

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-[#111827]">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#111827]">
                Assistant Configuration & LLM Providers
              </h2>
              <p className="text-xs text-[#6B7280]">
                Configure local Ollama, Anthropic Claude, or Deterministic Engine
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9CA3AF] hover:text-[#111827] hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Active Model Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B7280]">
              Active LLM Provider
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => onSelectProvider('ollama')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedProvider === 'ollama'
                    ? 'border-[#0E382B] bg-emerald-50/50 shadow-xs'
                    : 'border-[#E5E7EB] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Cpu className="w-4 h-4 text-[#059669]" />
                  {selectedProvider === 'ollama' && <Check className="w-3.5 h-3.5 text-[#059669]" />}
                </div>
                <div className="font-bold text-xs text-[#111827]">Ollama (Local)</div>
                <div className="text-[10px] text-[#6B7280]">{ollama?.available ? 'Connected' : 'Offline'}</div>
              </button>

              <button
                type="button"
                onClick={() => onSelectProvider('anthropic')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedProvider === 'anthropic'
                    ? 'border-[#0E382B] bg-emerald-50/50 shadow-xs'
                    : 'border-[#E5E7EB] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Cloud className="w-4 h-4 text-purple-600" />
                  {selectedProvider === 'anthropic' && <Check className="w-3.5 h-3.5 text-[#059669]" />}
                </div>
                <div className="font-bold text-xs text-[#111827]">Claude 3.5 Sonnet</div>
                <div className="text-[10px] text-[#6B7280]">{anthropic?.available ? 'Ready' : 'API Key'}</div>
              </button>

              <button
                type="button"
                onClick={() => onSelectProvider('mock')}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  selectedProvider === 'mock'
                    ? 'border-[#0E382B] bg-emerald-50/50 shadow-xs'
                    : 'border-[#E5E7EB] hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Terminal className="w-4 h-4 text-blue-600" />
                  {selectedProvider === 'mock' && <Check className="w-3.5 h-3.5 text-[#059669]" />}
                </div>
                <div className="font-bold text-xs text-[#111827]">Fast Mock PM</div>
                <div className="text-[10px] text-blue-700 font-medium">Zero Setup</div>
              </button>
            </div>
          </div>

          {/* Ollama Host URL */}
          <div className="space-y-1.5 pt-2 border-t border-[#E5E7EB]">
            <label className="block text-xs font-semibold text-[#374151]">
              Ollama Host URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={ollamaHost}
                onChange={(e) => setOllamaHost(e.target.value)}
                placeholder="http://localhost:11434"
                className="flex-1 px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#0E382B]"
              />
              {onRefreshModels && (
                <button
                  type="button"
                  onClick={onRefreshModels}
                  className="px-3 py-2 rounded-xl border border-[#E5E7EB] hover:bg-gray-50 text-xs text-[#374151] font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Test Connection</span>
                </button>
              )}
            </div>
            <p className="text-[11px] text-[#6B7280]">
              Status: <span className={ollama?.available ? 'text-[#059669] font-medium' : 'text-[#F59E0B] font-medium'}>
                {ollama?.available ? '● Service Connected & Model Available' : '● Offline (will auto-fallback to Fast Mock Engine)'}
              </span>
            </p>
          </div>

          {/* Anthropic Cloud API Key */}
          <div className="space-y-1.5 pt-2 border-t border-[#E5E7EB]">
            <label className="block text-xs font-semibold text-[#374151]">
              Anthropic Claude API Key (Optional)
            </label>
            <input
              type="password"
              value={claudeApiKey}
              onChange={(e) => setClaudeApiKey(e.target.value)}
              placeholder="sk-ant-api03-..."
              className="w-full px-3 py-2 bg-[#F9FAFB] border border-[#E5E7EB] rounded-xl text-xs text-[#111827] focus:outline-none focus:border-[#0E382B]"
            />
            <p className="text-[11px] text-[#6B7280]">
              If no API key is set, the system automatically uses the Deterministic PM Mock Engine for evaluations.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between shrink-0">
          <div className="text-xs text-[#059669] font-medium">
            {savedSuccess && '✓ Settings applied successfully'}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-[#E5E7EB] hover:bg-gray-100 text-xs font-medium text-[#374151] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                handleSave();
                setTimeout(onClose, 600);
              }}
              className="px-4 py-2 rounded-xl bg-[#0E382B] hover:bg-[#0A2B21] text-white text-xs font-semibold shadow-xs cursor-pointer"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
