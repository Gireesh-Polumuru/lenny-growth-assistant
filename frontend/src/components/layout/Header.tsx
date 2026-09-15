import React from 'react';
import { Settings, BookOpen, Sun, Moon, Menu } from 'lucide-react';
import { ModelSelector } from '../model/ModelSelector';
import { ModelsStatus, Session } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
  activeSession: Session | null;
  modelsStatus: ModelsStatus | null;
  selectedProvider: string;
  onSelectProvider: (provider: string) => void;
  onRefreshModels?: () => void;
  onNewChat: () => void;
  isArtifactOpen: boolean;
  onToggleArtifact: () => void;
  hasActiveArtifact: boolean;
  onToggleSidebarMobile: () => void;
  onOpenSettings?: () => void;
  onOpenDocs?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSession,
  modelsStatus,
  selectedProvider,
  onSelectProvider,
  onRefreshModels,
  onToggleSidebarMobile,
  onOpenSettings,
  onOpenDocs,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={`h-16 border-b px-6 flex items-center justify-between z-20 shrink-0 transition-colors duration-150 ${
      theme === 'dark' ? 'bg-[#0B0F19] border-[#1E293B]' : 'bg-white border-[#E5E7EB]'
    }`}>
      {/* Left: Active Conversation Title */}
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onToggleSidebarMobile}
          className={`lg:hidden p-1.5 rounded-lg transition-colors ${
            theme === 'dark' ? 'hover:bg-[#1E293B] text-[#9CA3AF]' : 'hover:bg-gray-100 text-[#4B5563]'
          }`}
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <h2 className={`font-bold text-lg tracking-tight truncate ${
          theme === 'dark' ? 'text-[#F8FAFC]' : 'text-[#111827]'
        }`}>
          {activeSession?.title || "Superhuman's PMF strategy"}
        </h2>
      </div>

      {/* Right: Model Selector & Workspace Tool Icons */}
      <div className="flex items-center gap-4">
        {/* Model Selector Pill Dropdown */}
        <ModelSelector
          modelsStatus={modelsStatus}
          selectedProvider={selectedProvider}
          onSelectProvider={onSelectProvider}
          onRefreshStatus={onRefreshModels}
        />

        {/* Action Tool Icons */}
        <div className={`flex items-center gap-1.5 pl-2 border-l ${
          theme === 'dark' ? 'border-[#1E293B]' : 'border-[#E5E7EB]'
        }`}>
          <button
            type="button"
            onClick={onOpenSettings}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'text-[#9CA3AF] hover:text-white hover:bg-[#1E293B]'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-100'
            }`}
            title="Model Settings & Configuration"
          >
            <Settings className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenDocs}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'text-[#9CA3AF] hover:text-white hover:bg-[#1E293B]'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-100'
            }`}
            title="System Documentation & Guardrails"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'text-amber-400 hover:text-amber-300 hover:bg-[#1E293B]'
                : 'text-slate-600 hover:text-[#111827] hover:bg-gray-100'
            }`}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
