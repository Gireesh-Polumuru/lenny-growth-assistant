import React from 'react';
import { Sparkles, FileText, Code2, Compass, Layers, Zap } from 'lucide-react';

interface PromptSuggestionsProps {
  onSelectPrompt: (prompt: string) => void;
}

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({ onSelectPrompt }) => {
  const suggestions = [
    {
      icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
      tag: 'PMF Engine',
      title: 'How did Superhuman measure and find product-market fit?',
      prompt: 'How did Superhuman approach product-market fit using Rahul Vohra\'s quantitative survey framework?',
    },
    {
      icon: <Layers className="w-3.5 h-3.5 text-emerald-400" />,
      tag: 'B2B PLG',
      title: 'What are B2B Product-Led Sales and PQL triggers?',
      prompt: 'According to Elena Verna, what are Product Qualified Leads (PQLs) and how should sales teams engage with self-serve users?',
    },
    {
      icon: <FileText className="w-3.5 h-3.5 text-indigo-400" />,
      tag: 'Ship 30 Skill',
      title: 'Write a Ship 30 for 30 essay on Superhuman PMF',
      prompt: 'Write a Ship 30 for 30 essay on Rahul Vohra\'s PMF engine and the 40% benchmark.',
    },
    {
      icon: <Code2 className="w-3.5 h-3.5 text-purple-400" />,
      tag: 'Artifact Tool',
      title: 'Build an interactive HTML PMF Calculator',
      prompt: 'Create an interactive HTML calculator for calculating the Sean Ellis 40% PMF score based on Rahul Vohra\'s methodology.',
    },
    {
      icon: <Compass className="w-3.5 h-3.5 text-blue-400" />,
      tag: 'Four Fits',
      title: 'Explain Brian Balfour\'s Four Fits Framework & Retention',
      prompt: 'Explain Brian Balfour\'s Four Fits Framework and why retention is the foundation of growth.',
    },
    {
      icon: <Sparkles className="w-3.5 h-3.5 text-pink-400" />,
      tag: 'LNO Prioritization',
      title: 'How does Shreyas Doshi prioritize tasks with LNO?',
      prompt: 'How does Shreyas Doshi explain the LNO Framework (Leverage, Neutral, Overhead) for product managers?',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-4">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Grounded Growth Intelligence</span>
      </div>

      <h2 className="text-2xl font-display font-bold text-white tracking-tight mb-2">
        What would you like to explore today?
      </h2>
      <p className="text-xs text-slate-400 max-w-lg mx-auto mb-8 leading-relaxed">
        Ask tactical PM questions, generate ~1,250-word Ship 30 for 30 atomic essays, or build interactive HTML frameworks grounded in Lenny's Podcast transcripts.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-left">
        {suggestions.map((item, idx) => (
          <div
            key={idx}
            onClick={() => onSelectPrompt(item.prompt)}
            className="group p-3.5 rounded-2xl bg-[#1E293B]/70 border border-white/10 hover:border-indigo-500/50 hover:bg-[#1E293B] cursor-pointer transition-all duration-200 hover:-translate-y-0.5 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="p-1.5 rounded-lg bg-slate-900/60 border border-white/5">
                {item.icon}
              </div>
              <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {item.tag}
              </span>
            </div>
            <h3 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 transition-colors line-clamp-2">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};
