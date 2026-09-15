import React, { useState } from 'react';
import {
  MessageSquare,
  Plus,
  Trash2,
  Headphones,
  Zap,
  Target,
  Home,
  MessagesSquare,
  MoreVertical,
  X,
  ArrowRight,
  Settings,
  BookOpen
} from 'lucide-react';
import { Session } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenEpisodes?: () => void;
  onOpenSettings?: () => void;
  onOpenDocs?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  isOpenMobile,
  onCloseMobile,
  onOpenEpisodes,
  onOpenSettings,
  onOpenDocs,
}) => {
  const { theme } = useTheme();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-40 w-64 border-r flex flex-col transition-all duration-200 ease-in-out ${
          theme === 'dark'
            ? 'bg-[#0B0F19] border-[#1E293B] text-[#F8FAFC]'
            : 'bg-[#F9FAFB] border-[#E5E7EB] text-[#111827]'
        } ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Workspace Brand / Header */}
        <div className={`p-4 border-b flex items-center justify-between shrink-0 ${
          theme === 'dark' ? 'border-[#1E293B] bg-[#0B0F19]' : 'border-[#E5E7EB] bg-[#F9FAFB]'
        }`}>
          <div className="flex items-center gap-2.5">
            {/* Green Leaf Brand Icon */}
            <div className="w-7 h-7 rounded-lg bg-emerald-500/15 flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-[#10B981] fill-current"
              >
                <path d="M17.472 2C13.25 2 9.5 4.5 7.5 8C5.5 11.5 6 16 6 16s4.5.5 8-1.5c3.5-2 6-5.75 6-9.972C20 3.128 18.872 2 17.472 2zM12.5 13.5c-1.5.5-3 .5-4.5 0 0-1.5.5-3 1.5-4.5 1-1.5 2.5-2.5 4-3 1-.5 2-.5 2.5 0s0 1.5-.5 2.5c-.5 1.5-1.5 3-3.5 5z" />
              </svg>
            </div>
            <div>
              <h1 className="font-bold text-xs tracking-tight leading-none text-inherit">
                Lenny Growth Assistant
              </h1>
              <p className="text-[11px] text-[#8F98A8] mt-0.5 leading-none">
                Insights. Ideas. Impact.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className={`lg:hidden p-1 rounded-md transition-colors ${
              theme === 'dark' ? 'hover:bg-[#1E293B] text-[#9CA3AF]' : 'hover:bg-[#F3F4F6] text-[#6B7280]'
            } cursor-pointer`}
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action: + New conversation Button */}
        <div className="p-3">
          <button
            type="button"
            onClick={() => {
              onNewSession();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-[#0E382B] hover:bg-[#0A2B21] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New conversation</span>
          </button>
        </div>

        {/* Main Nav Links */}
        <div className="px-3 py-1 space-y-0.5">
          <button
            type="button"
            onClick={() => {
              onNewSession();
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'text-[#9CA3AF] hover:bg-[#1E293B] hover:text-white'
                : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-[#8F98A8]" />
            <span>Home</span>
          </button>
          <button
            type="button"
            onClick={() => {
              if (sessions.length > 0) {
                onSelectSession(sessions[0].id);
              }
              onCloseMobile();
            }}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'text-[#9CA3AF] hover:bg-[#1E293B] hover:text-white'
                : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]'
            }`}
          >
            <MessagesSquare className="w-3.5 h-3.5 text-[#8F98A8]" />
            <span>All conversations ({sessions.length})</span>
          </button>
        </div>

        {/* Section: RECENT CONVERSATIONS */}
        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#8F98A8]">
            Recent Conversations
          </div>

          {sessions.length === 0 ? (
            <div className="px-3 py-4 text-center text-xs text-[#8F98A8]">
              No conversations yet.
            </div>
          ) : (
            sessions.map((s) => {
              const isActive = s.id === activeSessionId;
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    onSelectSession(s.id);
                    onCloseMobile();
                  }}
                  className={`group relative flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-all ${
                    isActive
                      ? theme === 'dark'
                        ? 'bg-[#1E293B] text-white font-semibold'
                        : 'bg-[#F3F4F6] text-[#111827] font-semibold'
                      : theme === 'dark'
                        ? 'text-[#9CA3AF] hover:bg-[#1E293B]/60 hover:text-white'
                        : 'text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]'
                  }`}
                >
                  {/* Active Indicator Bar on left */}
                  {isActive && (
                    <div className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-[#10B981] rounded-r" />
                  )}

                  <div className="flex items-start gap-2.5 overflow-hidden pr-2">
                    <MessageSquare
                      className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                        isActive ? 'text-[#10B981]' : 'text-[#8F98A8] group-hover:text-inherit'
                      }`}
                    />
                    <div className="overflow-hidden">
                      <div className="truncate text-xs leading-tight">
                        {s.title || 'Superhuman\'s PMF strategy'}
                      </div>
                      <div className="text-[10px] text-[#8F98A8] mt-0.5 font-normal">
                        {isActive ? 'Active' : 'History'}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(s.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-[#8F98A8] transition-opacity rounded cursor-pointer"
                    title="Delete conversation"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              );
            })
          )}

          {onOpenEpisodes && (
            <div className="pt-1 px-2.5">
              <button
                type="button"
                onClick={() => {
                  onOpenEpisodes();
                  onCloseMobile();
                }}
                className={`flex items-center gap-1 text-[11px] font-medium transition-colors cursor-pointer ${
                  theme === 'dark' ? 'text-[#9CA3AF] hover:text-white' : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                <span>Browse all transcripts</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
          )}
        </div>

        {/* Section: KNOWLEDGE BASE CARD */}
        <div className={`p-3 border-t shrink-0 space-y-1.5 ${
          theme === 'dark' ? 'border-[#1E293B] bg-[#0B0F19]' : 'border-[#E5E7EB] bg-[#F9FAFB]'
        }`}>
          <div className="px-1 text-[10px] font-bold uppercase tracking-wider text-[#8F98A8]">
            Knowledge Base
          </div>

          <div
            onClick={() => {
              if (onOpenEpisodes) onOpenEpisodes();
              onCloseMobile();
            }}
            className={`p-3 rounded-xl border shadow-xs space-y-2 cursor-pointer transition-all group ${
              theme === 'dark'
                ? 'bg-[#111827] border-[#1E293B] hover:border-gray-700'
                : 'bg-white border-[#E5E7EB] hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between text-xs font-bold text-inherit">
              <div className="flex items-center gap-2">
                <Headphones className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Lenny's Podcast</span>
              </div>
              <ArrowRight className="w-3 h-3 text-[#8F98A8] group-hover:text-inherit transition-transform group-hover:translate-x-0.5" />
            </div>

            <div className="space-y-1 text-[11px]">
              <div className="flex items-center gap-2 text-[#8F98A8]">
                <Plus className="w-3 h-3" />
                <span>7 landmark episodes</span>
              </div>
              <div className="flex items-center gap-2 text-[#8F98A8]">
                <Zap className="w-3 h-3" />
                <span>15+ transcript sections</span>
              </div>
              <div className="flex items-center gap-2 text-[#10B981] font-medium">
                <Target className="w-3 h-3 text-[#10B981]" />
                <span>Grounded retrieval</span>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onOpenEpisodes) onOpenEpisodes();
                onCloseMobile();
              }}
              className={`w-full mt-1 py-1.5 px-2 rounded-lg border text-[11px] font-medium flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'border-[#1E293B] bg-[#1E293B]/60 hover:bg-[#1E293B] text-white'
                  : 'border-[#E5E7EB] bg-white hover:bg-[#F9FAFB] text-[#374151]'
              }`}
            >
              <span>Browse episodes</span>
              <ArrowRight className="w-2.5 h-2.5 text-[#8F98A8]" />
            </button>
          </div>
        </div>

        {/* Section: USER PROFILE & MENU */}
        <div className={`p-3 border-t relative shrink-0 ${
          theme === 'dark' ? 'border-[#1E293B] bg-[#0B0F19]' : 'border-[#E5E7EB] bg-[#F9FAFB]'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-[#059669] text-white flex items-center justify-center text-xs font-bold shrink-0">
                S
              </div>
              <div className="overflow-hidden">
                <div className="text-xs font-semibold text-inherit truncate leading-tight">
                  Product Lead
                </div>
                <div className="text-[11px] text-[#8F98A8] truncate leading-tight">
                  fde@assessment.ai
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={`p-1 rounded-md transition-colors cursor-pointer ${
                theme === 'dark' ? 'text-[#9CA3AF] hover:text-white hover:bg-[#1E293B]' : 'text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F3F4F6]'
              }`}
              title="Profile menu"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Profile Dropdown Menu */}
          {isProfileMenuOpen && (
            <div className={`absolute bottom-14 right-3 w-52 rounded-xl border shadow-xl py-1.5 z-50 text-xs space-y-0.5 animate-in fade-in slide-in-from-bottom-2 duration-150 ${
              theme === 'dark'
                ? 'bg-[#111827] border-[#1E293B] text-white'
                : 'bg-white border-[#E5E7EB] text-[#374151]'
            }`}>
              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  if (onOpenSettings) onOpenSettings();
                }}
                className={`w-full px-3 py-2 text-left flex items-center gap-2 cursor-pointer ${
                  theme === 'dark' ? 'hover:bg-[#1E293B] text-white' : 'hover:bg-gray-50 text-[#374151]'
                }`}
              >
                <Settings className="w-3.5 h-3.5 text-[#8F98A8]" />
                <span>Model Settings</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  if (onOpenDocs) onOpenDocs();
                }}
                className={`w-full px-3 py-2 text-left flex items-center gap-2 cursor-pointer ${
                  theme === 'dark' ? 'hover:bg-[#1E293B] text-white' : 'hover:bg-gray-50 text-[#374151]'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-[#8F98A8]" />
                <span>System Documentation</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  if (onOpenEpisodes) onOpenEpisodes();
                }}
                className={`w-full px-3 py-2 text-left flex items-center gap-2 cursor-pointer ${
                  theme === 'dark' ? 'hover:bg-[#1E293B] text-white' : 'hover:bg-gray-50 text-[#374151]'
                }`}
              >
                <Headphones className="w-3.5 h-3.5 text-[#8F98A8]" />
                <span>Transcript Library</span>
              </button>

              <div className={`border-t my-1 ${theme === 'dark' ? 'border-[#1E293B]' : 'border-[#E5E7EB]'}`} />

              <button
                type="button"
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  onNewSession();
                }}
                className="w-full px-3 py-2 text-left flex items-center gap-2 text-[#10B981] hover:bg-emerald-500/10 font-medium cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Conversation</span>
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

