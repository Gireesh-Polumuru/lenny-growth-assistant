import React from 'react';
import { X, BookOpen, ShieldCheck, FileText, Cpu, CheckCircle } from 'lucide-react';

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#111827]">
                The Lenny Growth Assistant Documentation
              </h2>
              <p className="text-xs text-[#6B7280]">
                Architecture, Grounding Guardrails, Ship 30 Skills & Artifact Security
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
        <div className="p-6 space-y-6 overflow-y-auto text-xs leading-relaxed text-[#374151]">
          {/* Section 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-[#111827]">
              <CheckCircle className="w-4 h-4 text-[#059669]" />
              <span>1. Strict Transcript Grounding & Citations</span>
            </div>
            <p className="text-[#4B5563]">
              Every response is anchored in 150+ hours of Lenny's Podcast transcripts. Claims are tagged with verified speaker attribution, episode titles, and timestamp intervals (e.g. <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[11px] font-mono">[04:12 - 09:45]</code>). Out-of-domain queries are politely declined to prevent AI hallucinations.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2 pt-3 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2 font-bold text-sm text-[#111827]">
              <FileText className="w-4 h-4 text-purple-600" />
              <span>2. Ship 30 for 30 Atomic Essay Engine</span>
            </div>
            <p className="text-[#4B5563]">
              Our specialized writing skill encodes Nicolas Cole & Dickie Bush's atomic essay principles:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#4B5563]">
              <li><strong>Atomic Hook:</strong> Grabs reader attention in under 3 seconds with a single provocative question.</li>
              <li><strong>1-3-1 Pacing:</strong> Prevents wall-of-text fatigue with rhythmic short/medium/short sentence cadence.</li>
              <li><strong>Scannable Bold Highlights:</strong> Optimized for rapid reading by product leaders.</li>
              <li><strong>The One Big Takeaway:</strong> Summarizes the actionable operational takeaway in 2 sentences.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="space-y-2 pt-3 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2 font-bold text-sm text-[#111827]">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>3. Artifact Viewer & Security Sandboxing</span>
            </div>
            <p className="text-[#4B5563]">
              When the assistant generates interactive HTML/CSS calculators or visual frameworks, it renders in a side-by-side split screen. For security:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[#4B5563]">
              <li>Generated HTML executes inside an <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[11px]">&lt;iframe sandbox="allow-scripts"&gt;</code> without <code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[11px]">allow-same-origin</code>.</li>
              <li>Protected by Content Security Policy (CSP) blocking external outbound network requests.</li>
            </ul>
          </div>

          {/* Section 4 */}
          <div className="space-y-2 pt-3 border-t border-[#E5E7EB]">
            <div className="flex items-center gap-2 font-bold text-sm text-[#111827]">
              <Cpu className="w-4 h-4 text-[#0E382B]" />
              <span>4. Multi-LLM Provider Architecture</span>
            </div>
            <p className="text-[#4B5563]">
              The system supports Local Ollama (<code className="bg-gray-100 px-1 py-0.5 rounded font-mono text-[11px]">llama3.1</code>), Anthropic Claude 3.5 Sonnet, and a Deterministic Fast Mock Engine with automated offline failover for zero-friction evaluation.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#0E382B] hover:bg-[#0A2B21] text-white text-xs font-semibold shadow-xs cursor-pointer"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
