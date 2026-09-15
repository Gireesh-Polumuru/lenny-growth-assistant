import React from 'react';
import { ArrowUpRight, Zap, Layers, FileText, Code2 } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface EmptyStateProps {
  onSelectPrompt: (promptText: string) => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ onSelectPrompt }) => {
  const { theme } = useTheme();

  const exampleTasks = [
    {
      icon: <Layers className="w-4 h-4 text-[#059669]" />,
      category: 'Growth Strategy',
      title: 'What does Elena Verna say about PQLs?',
      prompt: 'According to Elena Verna, what are Product Qualified Leads (PQLs) and how should sales teams engage with self-serve users?',
    },
    {
      icon: <Zap className="w-4 h-4 text-blue-600" />,
      category: 'PMF Framework',
      title: 'How did Superhuman approach product-market fit?',
      prompt: 'How did Superhuman approach product-market fit using Rahul Vohra\'s quantitative survey framework?',
    },
    {
      icon: <FileText className="w-4 h-4 text-purple-600" />,
      category: 'Editorial Skill',
      title: 'Turn this insight into a Ship 30 for 30 essay',
      prompt: 'Write a Ship 30 for 30 essay on Rahul Vohra\'s PMF engine and the 40% benchmark.',
    },
    {
      icon: <Code2 className="w-4 h-4 text-amber-600" />,
      category: 'Interactive Tool',
      title: 'Create a PQL framework visual artifact',
      prompt: 'Create an interactive HTML framework artifact visualizing Elena Verna\'s Product Qualified Leads (PQL) framework from usage signals to revenue.',
    },
  ];

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      {/* Title & Editorial Description */}
      <div className="mb-8">
        <h2 className={`text-2xl sm:text-[26px] font-bold tracking-tight mb-2 ${
          theme === 'dark' ? 'text-white' : 'text-[#0F172A]'
        }`}>
          Lenny Growth Assistant
        </h2>
        <p className={`text-sm leading-relaxed max-w-lg ${
          theme === 'dark' ? 'text-[#C5CBD5]' : 'text-[#475569]'
        }`}>
          Turn Lenny's product and growth knowledge into practical decisions, written content, and interactive artifacts grounded strictly in podcast transcripts.
        </p>
      </div>

      {/* Suggested Starting Tasks */}
      <div className="space-y-3">
        <div className="text-[11px] font-bold uppercase tracking-wider text-[#8F98A8]">
          Suggested Research Inquiries
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {exampleTasks.map((task, idx) => (
            <div
              key={idx}
              onClick={() => onSelectPrompt(task.prompt)}
              className="group p-4 rounded-xl border border-[#E5E7EB] bg-white hover:border-gray-300 hover:shadow-md cursor-pointer transition-all duration-150 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  {task.icon}
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#6B7280]">
                    {task.category}
                  </span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#9CA3AF] group-hover:text-[#111827] transition-colors" />
              </div>
              <h3 className="text-xs font-semibold text-[#111827] group-hover:text-[#0E382B] leading-snug">
                {task.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
