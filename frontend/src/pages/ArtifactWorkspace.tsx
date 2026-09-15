import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  ArrowLeft,
  Eye,
  Code2,
  FileText,
  Copy,
  Check,
  Download,
  ExternalLink,
  Loader2,
  AlertCircle,
  Sun,
  Moon,
  RotateCcw
} from 'lucide-react';
import { fetchArtifact } from '../services/api';
import { Artifact } from '../types';
import { useTheme } from '../context/ThemeContext';

export const ArtifactWorkspace: React.FC = () => {
  const { artifactId } = useParams<{ artifactId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  const [artifact, setArtifact] = useState<Artifact | null>(null);
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'markdown'>('preview');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (artifactId) {
      loadArtifactData(artifactId);
    } else {
      setIsLoading(false);
      setError('No artifact ID specified in URL.');
    }
  }, [artifactId]);

  const loadArtifactData = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchArtifact(id);
      setArtifact(data);
    } catch (err: any) {
      console.error('Failed to fetch artifact:', err);
      setError(err.message || 'The artifact could not be retrieved.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToConversation = () => {
    // If state contains returnPath or session, return there, else navigate back or home
    if (location.state && (location.state as any).fromSession) {
      navigate('/', { state: { resumeSessionId: (location.state as any).fromSession } });
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleCopy = () => {
    if (!artifact) return;
    navigator.clipboard.writeText(artifact.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!artifact) return;
    const extension = artifact.type === 'html' ? 'html' : 'md';
    const blob = new Blob([artifact.content], {
      type: artifact.type === 'html' ? 'text/html;charset=utf-8' : 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifact.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenInNewTab = () => {
    if (!artifact) return;
    const blob = new Blob([artifact.content], {
      type: artifact.type === 'html' ? 'text/html;charset=utf-8' : 'text/markdown;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const getSandboxedSrcDoc = (rawHtml: string) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' data:; connect-src 'none';">
          <style>
            *, *::before, *::after {
              box-sizing: border-box;
            }
            body {
              margin: 0;
              padding: 24px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background-color: #FFFFFF !important;
              color: #172033 !important;
              line-height: 1.6;
              -webkit-font-smoothing: antialiased;
            }
            h1, h2, h3, h4, h5, h6 {
              color: #0F172A !important;
              font-weight: 700;
              margin-top: 0;
            }
            p, span, li, td, th {
              color: #334155;
            }
            strong {
              color: #0F172A !important;
            }
            a {
              color: #059669;
            }
          </style>
        </head>
        <body>
          ${rawHtml}
        </body>
      </html>
    `;
  };

  // 1. Loading State
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#080D16] text-white">
        <div className="flex flex-col items-center gap-3 p-8 rounded-2xl bg-[#111827] border border-[#1E293B] shadow-2xl">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-[#10B981]">
            <Loader2 className="w-5 h-5 animate-spin" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-sm text-white">Artifact Workspace</h3>
            <p className="text-xs text-[#9CA3AF] mt-1">Loading artifact details and code...</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. Error / Missing Artifact State
  if (error || !artifact) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#080D16] p-4 text-white">
        <div className="max-w-md w-full bg-[#111827] border border-[#1E293B] rounded-2xl p-6 shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">
              {error ? 'Unable to load artifact' : 'Artifact not found'}
            </h2>
            <p className="text-xs text-[#9CA3AF] mt-1.5 leading-relaxed">
              {error || 'The requested artifact could not be found or has been removed.'}
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            {artifactId && (
              <button
                type="button"
                onClick={() => loadArtifactData(artifactId)}
                className="px-4 py-2 rounded-xl bg-[#1E293B] hover:bg-[#334155] text-xs font-semibold text-white flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleBackToConversation}
              className="px-4 py-2 rounded-xl bg-[#0E382B] hover:bg-[#0A2B21] text-xs font-semibold text-white flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to conversation</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Render Full Dedicated Artifact Workspace
  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${theme === 'dark' ? 'bg-[#080D16] text-[#F8FAFC]' : 'bg-[#F8FAFC] text-[#111827]'}`}>
      {/* Top Header Toolbar */}
      <header className={`h-16 px-4 sm:px-6 border-b flex items-center justify-between shrink-0 z-20 ${
        theme === 'dark' ? 'bg-[#0B0F19] border-[#1E293B]' : 'bg-white border-[#E5E7EB]'
      }`}>
        {/* Left: Back Button & Title */}
        <div className="flex items-center gap-3.5 overflow-hidden pr-4">
          <button
            type="button"
            onClick={handleBackToConversation}
            className={`p-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
              theme === 'dark'
                ? 'bg-[#1E293B] hover:bg-[#334155] text-white border border-[#334155]'
                : 'bg-[#F3F4F6] hover:bg-[#E5E7EB] text-[#111827] border border-[#E5E7EB]'
            }`}
            title="Return to conversation"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to conversation</span>
          </button>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 hidden sm:block shrink-0" />

          <div className="overflow-hidden">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shrink-0 ${
                artifact.type === 'html'
                  ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                  : 'bg-purple-500/10 text-purple-500 border border-purple-500/20'
              }`}>
                {artifact.type === 'html' ? 'HTML Component' : 'Ship 30 Essay'}
              </span>
              <h1 className="font-bold text-sm sm:text-base text-inherit truncate leading-tight">
                {artifact.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Center/Right: Tabs & Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Tabs: Preview | Code | Markdown */}
          <div className={`flex p-1 rounded-xl border text-xs ${
            theme === 'dark' ? 'bg-[#111827] border-[#1E293B]' : 'bg-[#F3F4F6] border-[#E5E7EB]'
          }`}>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? theme === 'dark'
                    ? 'bg-[#0E382B] text-white shadow-xs'
                    : 'bg-white text-[#111827] font-semibold shadow-xs'
                  : theme === 'dark'
                    ? 'text-[#9CA3AF] hover:text-white'
                    : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Preview</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'code'
                  ? theme === 'dark'
                    ? 'bg-[#0E382B] text-white shadow-xs'
                    : 'bg-white text-[#111827] font-semibold shadow-xs'
                  : theme === 'dark'
                    ? 'text-[#9CA3AF] hover:text-white'
                    : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Code</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('markdown')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'markdown'
                  ? theme === 'dark'
                    ? 'bg-[#0E382B] text-white shadow-xs'
                    : 'bg-white text-[#111827] font-semibold shadow-xs'
                  : theme === 'dark'
                    ? 'text-[#9CA3AF] hover:text-white'
                    : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Markdown</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 border-l border-gray-200 dark:border-gray-800 pl-3">
            <button
              type="button"
              onClick={handleCopy}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'border-[#1E293B] bg-[#111827] hover:bg-[#1E293B] text-white'
                  : 'border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#374151]'
              }`}
              title="Copy artifact content"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="hidden xl:inline text-emerald-500 font-semibold">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-[#6B7280]" />
                  <span className="hidden xl:inline">Copy</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleDownload}
              className={`p-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'border-[#1E293B] bg-[#111827] hover:bg-[#1E293B] text-white'
                  : 'border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#374151]'
              }`}
              title="Download file"
            >
              <Download className="w-3.5 h-3.5 text-[#6B7280]" />
              <span className="hidden xl:inline">Download</span>
            </button>

            <button
              type="button"
              onClick={handleOpenInNewTab}
              className="px-3 py-2 rounded-xl bg-[#0E382B] hover:bg-[#0A2B21] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              title="Open raw in new tab"
            >
              <span className="hidden md:inline">Open in tab</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                theme === 'dark'
                  ? 'border-[#1E293B] bg-[#111827] hover:bg-[#1E293B] text-amber-400'
                  : 'border-[#E5E7EB] bg-white hover:bg-gray-50 text-slate-700'
              }`}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-6 lg:p-8 flex justify-center">
        <div className="w-full max-w-5xl h-full flex flex-col">
          {activeTab === 'preview' ? (
            artifact.type === 'html' ? (
              <div className="flex-1 min-h-[550px] bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
                <iframe
                  srcDoc={getSandboxedSrcDoc(artifact.content)}
                  sandbox="allow-scripts"
                  title={artifact.title}
                  className="w-full h-full border-0 bg-white"
                />
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8 sm:p-12 overflow-y-auto prose-artifact-document">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {artifact.content}
                </ReactMarkdown>
              </div>
            )
          ) : activeTab === 'code' ? (
            <div className={`rounded-2xl border p-6 overflow-x-auto font-mono text-xs leading-relaxed shadow-xl ${
              theme === 'dark'
                ? 'bg-[#0B0F19] border-[#1E293B] text-[#E2E8F0]'
                : 'bg-white border-[#E5E7EB] text-[#111827]'
            }`}>
              <pre className="whitespace-pre">
                <code>{artifact.content}</code>
              </pre>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-8 sm:p-12 overflow-y-auto prose-artifact-document">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {artifact.content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
