import React from 'react';
import { MessageSquare, Trash2, Plus, Database } from 'lucide-react';
import { Session } from '../../types';

interface SessionSidebarProps {
  sessions: Session[];
  activeSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewSession: () => void;
  onDeleteSession: (id: string) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

export const SessionSidebar: React.FC<SessionSidebarProps> = ({
  sessions,
  activeSessionId,
  onSelectSession,
  onNewSession,
  onDeleteSession,
  isOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static top-16 bottom-0 left-0 z-40 w-72 bg-[#111827] border-r border-white/10 flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Sidebar Action Button */}
        <div className="p-3">
          <button
            onClick={() => {
              onNewSession();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-medium rounded-xl text-xs shadow-md transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto px-3 py-1 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Recent Conversations
          </div>

          {sessions.length === 0 ? (
            <div className="text-center py-8 px-4 text-xs text-slate-400">
              No conversations yet. Ask your first product or growth question!
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
                  className={`group relative flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-white font-medium border border-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 overflow-hidden pr-2">
                    <MessageSquare
                      className={`w-3.5 h-3.5 shrink-0 ${
                        isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-300'
                      }`}
                    />
                    <span className="truncate">{s.title || 'Untitled Conversation'}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(s.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 text-slate-400 transition-opacity"
                    title="Delete Conversation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Knowledge Base Meta Card */}
        <div className="p-3 border-t border-white/10 bg-[#0B0F17]/50">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-white/5 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              <span>Transcript Knowledge Base</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Lenny's Podcast Repository: Rahul Vohra, Elena Verna, Brian Balfour, Shreyas Doshi, Marty Cagan & Claire Vo.
            </p>
            <div className="flex items-center justify-between text-[10px] text-indigo-300 font-mono pt-1">
              <span>● Vector Grounded</span>
              <span>100% Provenance</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
