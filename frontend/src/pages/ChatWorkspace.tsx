import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Sidebar } from '../components/layout/Sidebar';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ChatComposer } from '../components/chat/ChatComposer';
import { EmptyState } from '../components/chat/EmptyState';
import { ArtifactPanel } from '../components/artifacts/ArtifactPanel';
import { SettingsModal } from '../components/common/SettingsModal';
import { DocsModal } from '../components/common/DocsModal';
import { EpisodesModal } from '../components/common/EpisodesModal';
import { Session, Message, Artifact, ModelsStatus } from '../types';
import {
  fetchSessions,
  createSession,
  deleteSession,
  fetchSessionMessages,
  sendMessage,
  fetchModelsStatus,
  fetchArtifact,
} from '../services/api';
import { Loader2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export const ChatWorkspace: React.FC = () => {
  const { theme } = useTheme();
  const location = useLocation();

  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [modelsStatus, setModelsStatus] = useState<ModelsStatus | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>('mock');
  const [activeArtifact, setActiveArtifact] = useState<Artifact | null>(null);
  const [isArtifactOpen, setIsArtifactOpen] = useState<boolean>(false);
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isDocsOpen, setIsDocsOpen] = useState<boolean>(false);
  const [isEpisodesOpen, setIsEpisodesOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [composerInput, setComposerInput] = useState<string>('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize models and sessions
  useEffect(() => {
    loadModelsAndSessions();
  }, []);

  // Check if returning from ArtifactWorkspace with a specific session to resume
  useEffect(() => {
    if (location.state && (location.state as any).resumeSessionId) {
      const resumeId = (location.state as any).resumeSessionId;
      selectSession(resumeId);
    }
  }, [location.state]);

  // Keyboard shortcut: Cmd+K / Ctrl+K for New Conversation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleNewChat();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const loadModelsAndSessions = async () => {
    try {
      const status = await fetchModelsStatus();
      setModelsStatus(status);

      // Intelligent default: if Ollama is running, select Ollama; else Fast Mock
      if (status.providers.ollama?.available) {
        setSelectedProvider('ollama');
      } else if (status.providers.anthropic?.available) {
        setSelectedProvider('anthropic');
      } else {
        setSelectedProvider('mock');
      }

      const sessionList = await fetchSessions();
      setSessions(sessionList);

      if (sessionList.length > 0) {
        const resumeId = (location.state as any)?.resumeSessionId;
        const initialId = (resumeId && sessionList.find(s => s.id === resumeId)) ? resumeId : sessionList[0].id;
        selectSession(initialId);
      } else {
        handleNewChat();
      }
    } catch (err) {
      console.error('Initialization error:', err);
    }
  };

  const selectSession = async (sessionId: string) => {
    setActiveSessionId(sessionId);
    try {
      const msgs = await fetchSessionMessages(sessionId);
      setMessages(msgs);

      // Inspect if there is an artifact in the history
      const lastWithArtifact = [...msgs].reverse().find((m) => m.artifact_id);
      if (lastWithArtifact?.artifact_id) {
        const art = await fetchArtifact(lastWithArtifact.artifact_id);
        setActiveArtifact(art);
      } else {
        setActiveArtifact(null);
        setIsArtifactOpen(false);
      }
    } catch (err) {
      console.error('Failed to load session:', err);
    }
  };

  const handleNewChat = async () => {
    try {
      const newSession = await createSession('New Conversation');
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
      setMessages([]);
      setActiveArtifact(null);
      setIsArtifactOpen(false);
      setComposerInput('');
    } catch (err) {
      console.error('Failed to create new chat:', err);
    }
  };

  const handleDeleteSession = async (sessionId: string) => {
    try {
      await deleteSession(sessionId);
      const remaining = sessions.filter((s) => s.id !== sessionId);
      setSessions(remaining);
      if (activeSessionId === sessionId) {
        if (remaining.length > 0) {
          selectSession(remaining[0].id);
        } else {
          handleNewChat();
        }
      }
    } catch (err) {
      console.error('Failed to delete session:', err);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    let targetSessionId = activeSessionId;
    if (!targetSessionId) {
      const newSession = await createSession(text.slice(0, 40));
      targetSessionId = newSession.id;
      setSessions((prev) => [newSession, ...prev]);
      setActiveSessionId(targetSessionId);
    }

    // Clear input
    setComposerInput('');

    // Optimistic user message
    const tempUserMsg: Message = {
      id: `temp-${Date.now()}`,
      session_id: targetSessionId,
      role: 'user',
      content: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const resp = await sendMessage(targetSessionId, text, selectedProvider);

      const assistantMsg: Message = {
        id: resp.message_id,
        session_id: targetSessionId,
        role: 'assistant',
        content: resp.answer,
        provider: resp.provider,
        model: resp.model,
        sources: resp.sources,
        artifact_id: resp.artifact?.id,
        created_at: new Date().toISOString(),
        message_metadata: { latency_ms: resp.latency_ms },
      };

      setMessages((prev) => [...prev, assistantMsg]);

      // If artifact was generated, open artifact panel automatically
      if (resp.artifact) {
        setActiveArtifact(resp.artifact);
        setIsArtifactOpen(true);
      }

      // Update session title in list if first exchange
      setSessions((prev) =>
        prev.map((s) =>
          s.id === targetSessionId && s.title === 'New Conversation'
            ? { ...s, title: text.slice(0, 45) + (text.length > 45 ? '...' : '') }
            : s
        )
      );
    } catch (err: any) {
      console.error('Failed to send message:', err);
      // Append subtle error message
      const errorMsg: Message = {
        id: `err-${Date.now()}`,
        session_id: targetSessionId,
        role: 'assistant',
        content: `I encountered an issue generating the response: ${err.message || 'Model connection error'}. Please verify model selection in the top toolbar.`,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenArtifact = async (artifactId?: string) => {
    if (!artifactId) {
      setIsArtifactOpen(true);
      return;
    }
    try {
      const art = await fetchArtifact(artifactId);
      setActiveArtifact(art);
      setIsArtifactOpen(true);
    } catch (err) {
      console.error('Failed to load artifact:', err);
    }
  };

  const handleSelectExamplePrompt = (promptText: string) => {
    setComposerInput(promptText);
  };

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null;

  return (
    <div className={`flex h-screen w-screen overflow-hidden ${
      theme === 'dark' ? 'bg-[#080D16] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-[#111827]'
    }`}>
      {/* Zone 1: Left Navigation Sidebar */}
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={selectSession}
        onNewSession={handleNewChat}
        onDeleteSession={handleDeleteSession}
        isOpenMobile={isSidebarOpenMobile}
        onCloseMobile={() => setIsSidebarOpenMobile(false)}
        onOpenEpisodes={() => setIsEpisodesOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenDocs={() => setIsDocsOpen(true)}
      />

      {/* Main Center + Right Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* Top Header Toolbar */}
        <Header
          activeSession={activeSession}
          modelsStatus={modelsStatus}
          selectedProvider={selectedProvider}
          onSelectProvider={setSelectedProvider}
          onRefreshModels={loadModelsAndSessions}
          onNewChat={handleNewChat}
          isArtifactOpen={isArtifactOpen}
          onToggleArtifact={() => setIsArtifactOpen(!isArtifactOpen)}
          hasActiveArtifact={!!activeArtifact}
          onToggleSidebarMobile={() => setIsSidebarOpenMobile(true)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenDocs={() => setIsDocsOpen(true)}
        />

        {/* Workspace Body: Chat Stream + Contextual Artifact Panel */}
        <div className="flex-1 flex overflow-hidden min-h-0 relative">
          {/* Zone 2: Main Conversation Stream */}
          <main className={`flex-1 flex flex-col h-full overflow-hidden min-w-0 ${
            theme === 'dark' ? 'bg-[#080D16]' : 'bg-[#F8FAFC]'
          }`}>
            {/* Message Feed Canvas */}
            <div className="flex-1 overflow-y-auto min-h-0">
              {messages.length === 0 ? (
                <EmptyState onSelectPrompt={handleSelectExamplePrompt} />
              ) : (
                <div className={`py-2 divide-y ${
                  theme === 'dark' ? 'divide-[#1E293B]/40' : 'divide-gray-200/60'
                }`}>
                  {messages.map((msg) => (
                    <ChatMessage
                      key={msg.id}
                      message={msg}
                      onOpenArtifact={handleOpenArtifact}
                    />
                  ))}

                  {/* Polished Generation State */}
                  {isLoading && (
                    <div className="py-6 px-4 sm:px-6">
                      <div className="max-w-3xl mx-auto space-y-1.5 text-xs">
                        <div className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-[#111827]'}`}>
                          Assistant
                        </div>
                        <div className={`flex items-center gap-2 text-xs ${
                          theme === 'dark' ? 'text-[#C5CBD5]' : 'text-[#6B7280]'
                        }`}>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-[#10B981]" />
                          <span>Finding relevant transcript evidence & formulating grounded response...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Zone 2 Bottom: Refined Composer */}
            <ChatComposer
              input={composerInput}
              onInputChange={setComposerInput}
              onSendMessage={handleSendMessage}
              isLoading={isLoading}
            />
          </main>

          {/* Zone 3: Contextual Right Artifact Panel (Appears smoothly when artifact is open) */}
          {isArtifactOpen && activeArtifact && (
            <ArtifactPanel
              artifact={activeArtifact}
              onClose={() => setIsArtifactOpen(false)}
            />
          )}
        </div>
      </div>

      {/* Interactive Global Modals */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        modelsStatus={modelsStatus}
        selectedProvider={selectedProvider}
        onSelectProvider={setSelectedProvider}
        onRefreshModels={loadModelsAndSessions}
      />

      <DocsModal
        isOpen={isDocsOpen}
        onClose={() => setIsDocsOpen(false)}
      />

      <EpisodesModal
        isOpen={isEpisodesOpen}
        onClose={() => setIsEpisodesOpen(false)}
        onSelectEpisodePrompt={(prompt) => {
          setComposerInput(prompt);
        }}
      />
    </div>
  );
};
