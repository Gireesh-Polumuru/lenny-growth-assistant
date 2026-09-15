import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  X,
  Code2,
  Eye,
  Copy,
  Check,
  Download,
  Maximize2,
  Minimize2,
  ShieldCheck,
  FileText,
} from 'lucide-react';
import { Artifact } from '../../types';

interface ArtifactViewerProps {
  artifact: Artifact | null;
  onClose: () => void;
}

export const ArtifactViewer: React.FC<ArtifactViewerProps> = ({ artifact, onClose }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const getSandboxedSrcDoc = (rawHtml: string) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <meta http-equiv="Content-Security-Policy" content="default-src 'self' 'unsafe-inline' data:; connect-src 'none';">
          <style>
            body {
              margin: 0;
              padding: 16px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              background-color: #0B0F17;
              color: #F8FAFC;
              box-sizing: border-box;
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
    <div
      className={`bg-[#111827] border-l border-white/10 flex flex-col z-30 transition-all duration-300 ${
        isFullscreen
          ? 'fixed inset-0 z-50'
          : 'w-full lg:w-[480px] xl:w-[580px] h-full relative'
      }`}
    >
      {/* Topbar */}
      <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between bg-[#0B0F17]/80 shrink-0">
        <div className="flex items-center gap-2 overflow-hidden pr-2">
          <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            {artifact.type === 'html' ? <Code2 className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          </span>
          <div className="overflow-hidden">
            <h3 className="font-bold text-xs text-white truncate">{artifact.title}</h3>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="capitalize">{artifact.type} Artifact</span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-emerald-400">
                <ShieldCheck className="w-3 h-3" />
                <span>Sandboxed</span>
              </span>
            </div>
          </div>
        </div>

        {/* View Tabs & Actions */}
        <div className="flex items-center gap-1.5">
          <div className="flex bg-[#1E293B] p-0.5 rounded-lg border border-white/10 text-xs mr-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                activeTab === 'preview'
                  ? 'bg-indigo-600 text-white shadow-sm font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Preview</span>
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all ${
                activeTab === 'code'
                  ? 'bg-indigo-600 text-white shadow-sm font-medium'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code2 className="w-3 h-3" />
              <span>Code</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Download Artifact"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-[#0B0F17] relative">
        {activeTab === 'preview' ? (
          artifact.type === 'html' ? (
            <iframe
              srcDoc={getSandboxedSrcDoc(artifact.content)}
              sandbox="allow-scripts"
              title={artifact.title}
              className="w-full h-full border-0 bg-[#0B0F17]"
            />
          ) : (
            <div className="p-6 prose-dark text-xs sm:text-sm leading-relaxed max-w-3xl mx-auto">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {artifact.content}
              </ReactMarkdown>
            </div>
          )
        ) : (
          <div className="p-4">
            <pre className="font-mono text-xs text-slate-200 bg-[#0F172A] p-4 rounded-xl border border-white/10 overflow-x-auto whitespace-pre leading-relaxed">
              <code>{artifact.content}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
