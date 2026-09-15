import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  X,
  Code2,
  Eye,
  FileText,
  Copy,
  Check,
  Download,
  ExternalLink,
  Layers,
  Maximize2
} from 'lucide-react';
import { Artifact } from '../../types';
import { useTheme } from '../../context/ThemeContext';

interface ArtifactPanelProps {
  artifact: Artifact | null;
  onClose: () => void;
}

export const ArtifactPanel: React.FC<ArtifactPanelProps> = ({ artifact, onClose }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState<'preview' | 'code' | 'markdown'>('preview');
  const [copied, setCopied] = useState(false);

  if (!artifact) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(artifact.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
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

  const handleOpenInWorkspace = () => {
    navigate(`/artifacts/${artifact.id}`);
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
              padding: 20px;
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

  return (
    <div className={`w-full lg:w-[480px] xl:w-[540px] h-full border-l flex flex-col z-30 transition-all duration-200 shrink-0 ${
      theme === 'dark' ? 'bg-[#0B0F19] border-[#1E293B]' : 'bg-white border-[#E5E7EB]'
    }`}>
      {/* 1. Top Panel Header */}
      <div className={`h-14 px-5 border-b flex items-center justify-between shrink-0 ${
        theme === 'dark' ? 'bg-[#0B0F19] border-[#1E293B]' : 'bg-white border-[#E5E7EB]'
      }`}>
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#059669]" />
          <span className="font-bold text-xs text-inherit">Artifact Viewer</span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleOpenInWorkspace}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'text-[#9CA3AF] hover:text-white hover:bg-[#1E293B]'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-100'
            }`}
            title="Open in dedicated full workspace"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="text-[11px] hidden sm:inline">Workspace</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className={`flex items-center gap-1 text-xs transition-colors p-1.5 rounded cursor-pointer ${
              theme === 'dark'
                ? 'text-[#9CA3AF] hover:text-white hover:bg-[#1E293B]'
                : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-100'
            }`}
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Artifact Title & Metadata */}
      <div className={`px-5 pt-4 pb-3 border-b space-y-3 shrink-0 ${
        theme === 'dark' ? 'bg-[#0B0F19] border-[#1E293B]' : 'bg-white border-[#E5E7EB]'
      }`}>
        <div>
          <h2 className="font-bold text-base text-inherit leading-tight">
            {artifact.title || 'Growth Artifact'}
          </h2>
          <p className="text-xs text-[#9CA3AF] mt-0.5">
            {artifact.type === 'html' ? 'Interactive visual framework artifact' : 'Ship 30 for 30 atomic essay document'}
          </p>
        </div>

        {/* Tabs: Preview | Code | Markdown */}
        <div className={`flex p-1 rounded-lg border text-xs w-fit ${
          theme === 'dark' ? 'bg-[#111827] border-[#1E293B]' : 'bg-[#F3F4F6] border-gray-200/50'
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              activeTab === 'preview'
                ? theme === 'dark'
                  ? 'bg-[#0E382B] text-white shadow-xs'
                  : 'bg-white text-[#111827] font-semibold shadow-xs'
                : theme === 'dark'
                  ? 'text-[#9CA3AF] hover:text-white'
                  : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Preview</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              activeTab === 'code'
                ? theme === 'dark'
                  ? 'bg-[#0E382B] text-white shadow-xs'
                  : 'bg-white text-[#111827] font-semibold shadow-xs'
                : theme === 'dark'
                  ? 'text-[#9CA3AF] hover:text-white'
                  : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <Code2 className="w-3 h-3" />
            <span>Code</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('markdown')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs transition-colors cursor-pointer ${
              activeTab === 'markdown'
                ? theme === 'dark'
                  ? 'bg-[#0E382B] text-white shadow-xs'
                  : 'bg-white text-[#111827] font-semibold shadow-xs'
                : theme === 'dark'
                  ? 'text-[#9CA3AF] hover:text-white'
                  : 'text-[#6B7280] hover:text-[#111827]'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>Markdown</span>
          </button>
        </div>
      </div>

      {/* 3. Main Workspace Content Body */}
      <div className={`flex-1 overflow-y-auto p-4 ${
        theme === 'dark' ? 'bg-[#080D16]' : 'bg-[#F9FAFB]'
      }`}>
        {activeTab === 'preview' ? (
          artifact.type === 'html' ? (
            <div className="h-full min-h-[460px] bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
              <iframe
                srcDoc={getSandboxedSrcDoc(artifact.content)}
                sandbox="allow-scripts"
                title={artifact.title}
                className="w-full h-full border-0 bg-white"
              />
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 prose-artifact-document overflow-y-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {artifact.content}
              </ReactMarkdown>
            </div>
          )
        ) : activeTab === 'code' ? (
          <div className={`rounded-xl border shadow-xs p-4 overflow-x-auto ${
            theme === 'dark' ? 'bg-[#111827] border-[#1E293B] text-[#E2E8F0]' : 'bg-white border-[#E5E7EB] text-[#111827]'
          }`}>
            <pre className="font-mono text-xs whitespace-pre leading-relaxed">
              <code>{artifact.content}</code>
            </pre>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs p-6 prose-artifact-document overflow-y-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {artifact.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      {/* 4. Bottom Action Toolbar */}
      <div className={`p-3.5 border-t flex items-center justify-between shrink-0 ${
        theme === 'dark' ? 'bg-[#0B0F19] border-[#1E293B]' : 'bg-white border-[#E5E7EB]'
      }`}>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'border-[#1E293B] bg-[#111827] hover:bg-[#1E293B] text-white'
                : 'border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#374151]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#6B7280]" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'border-[#1E293B] bg-[#111827] hover:bg-[#1E293B] text-white'
                : 'border-[#E5E7EB] bg-white hover:bg-gray-50 text-[#374151]'
            }`}
          >
            <Download className="w-3.5 h-3.5 text-[#6B7280]" />
            <span>Download</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleOpenInWorkspace}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0E382B] hover:bg-[#0A2B21] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <span>Open in Workspace</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

