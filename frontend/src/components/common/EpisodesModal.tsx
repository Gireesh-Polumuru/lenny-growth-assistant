import React, { useState } from 'react';
import { X, Headphones, Search, Clock, MessageSquare } from 'lucide-react';

interface EpisodesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectEpisodePrompt: (prompt: string) => void;
}

export const EpisodesModal: React.FC<EpisodesModalProps> = ({
  isOpen,
  onClose,
  onSelectEpisodePrompt,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const episodes = [
    {
      id: 'ep-1',
      guest: 'Rahul Vohra',
      company: 'Superhuman',
      title: 'How Superhuman Built An Engine To Find Product-Market Fit',
      topics: ['PMF Engine', 'Sean Ellis 40% Metric', 'High-Expectation Customer (HXC)', '50/50 Roadmap Strategy'],
      duration: '1h 14m',
      samplePrompt: 'How did Superhuman approach product-market fit using Rahul Vohra\'s quantitative survey framework?',
      description: 'Rahul explains how he measured PMF weekly using the Sean Ellis benchmark, isolated High-Expectation Customers, and moved their score from 22% to 58% before launch.'
    },
    {
      id: 'ep-2',
      guest: 'Elena Verna',
      company: 'Miro, Amplitude, Dropbox',
      title: 'The Ultimate Guide to B2B Product-Led Growth and Product-Led Sales',
      topics: ['Product Qualified Leads (PQLs)', 'Product-Led Sales', 'Growth Loops', 'Self-Serve Monetization'],
      duration: '1h 22m',
      samplePrompt: 'According to Elena Verna, what are Product Qualified Leads (PQLs) and how should sales teams engage with self-serve users?',
      description: 'Elena covers the mechanics of B2B PLG, defining PQL milestones, and transforming sales from cold outreach to consultative product-led assistance.'
    },
    {
      id: 'ep-3',
      guest: 'Brian Balfour',
      company: 'Reforge, HubSpot',
      title: 'The Four Fits Framework and Retention Mechanics',
      topics: ['Market-Product Fit', 'Product-Channel Fit', 'Channel-Model Fit', 'Model-Market Fit', 'Cohort Retention'],
      duration: '1h 08m',
      samplePrompt: 'Explain Brian Balfour\'s Four Fits Framework and why product-market fit alone is not enough for sustainable growth.',
      description: 'Brian breaks down why companies fail when they treat PMF in isolation, emphasizing the interlocking alignment of market, product, channel, and monetization models.'
    },
    {
      id: 'ep-4',
      guest: 'Shreyas Doshi',
      company: 'Stripe, Twitter, Google',
      title: 'The LNO Framework and High-Agency Product Leadership',
      topics: ['LNO Framework', 'Task Prioritization', 'Pre-mortems', 'Product Sense'],
      duration: '1h 30m',
      samplePrompt: 'What is Shreyas Doshi\'s LNO Framework and how should product managers use it to allocate their time across Leverage, Neutral, and Overhead work?',
      description: 'Shreyas shares frameworks for preventing PM burnout, classifying tasks by return on effort, and building high-conviction product strategy.'
    },
    {
      id: 'ep-5',
      guest: 'Marty Cagan',
      company: 'Silicon Valley Product Group',
      title: 'Transformed: Moving from Feature Teams to Empowered Product Teams',
      topics: ['Empowered Teams', 'Feature Factory Trap', 'Four Product Risks', 'Product Discovery'],
      duration: '1h 18m',
      samplePrompt: 'According to Marty Cagan, what are the four fundamental product risks every empowered team must address during product discovery?',
      description: 'Marty contrasts feature factories with empowered teams, focusing on addressing value, usability, feasibility, and business viability risks before writing production code.'
    },
    {
      id: 'ep-6',
      guest: 'Madhavan Ramanujam',
      company: 'Simon-Kucher & Partners',
      title: 'Monetizing Innovation and Value-Based Pricing Strategy',
      topics: ['Willingness to Pay', 'Feature Shock', 'Minivation', 'Packaging & Tiers'],
      duration: '1h 12m',
      samplePrompt: 'What are the four classic monetization failure modes described by Madhavan Ramanujam and how can product teams design around price early?',
      description: 'Madhavan explains why pricing must be designed into the product from day one rather than tacked on at the end, warning against feature shock and under-pricing.'
    },
    {
      id: 'ep-7',
      guest: 'Claire Vo',
      company: 'LaunchDarkly, ChatPRD',
      title: 'How AI Is Transforming Product Management and 10x PM Workflows',
      topics: ['ChatPRD', 'AI PM Workflows', 'Artifact Acceleration', 'PRD Automation'],
      duration: '1h 05m',
      samplePrompt: 'How does Claire Vo recommend product managers integrate AI into their daily workflow to accelerate PRDs and stress-test assumptions?',
      description: 'Claire discusses using generative AI as an always-on thought partner, generating live artifacts, and radically accelerating discovery velocity.'
    }
  ];

  const filtered = episodes.filter(
    ep => ep.guest.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ep.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ep.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ep.topics.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#E5E7EB] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-[#059669]">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-[#111827]">
                Lenny's Podcast Knowledge Base
              </h2>
              <p className="text-xs text-[#6B7280]">
                7 Landmark Episodes · 15+ Timestamped Transcripts Indexed
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

        {/* Search Filter */}
        <div className="p-4 border-b border-[#E5E7EB] bg-[#F9FAFB] shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by guest, company (Superhuman, Miro, Reforge), or topic..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#0E382B]"
            />
          </div>
        </div>

        {/* Episodes List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-white">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#9CA3AF]">
              No episodes matched your search query.
            </div>
          ) : (
            filtered.map((ep) => (
              <div
                key={ep.id}
                className="p-4 rounded-xl border border-[#E5E7EB] hover:border-gray-300 hover:shadow-xs transition-all bg-white flex flex-col sm:flex-row sm:items-start justify-between gap-4 group"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#111827]">
                      {ep.guest}
                    </span>
                    <span className="text-xs font-medium text-[#059669] bg-emerald-50 px-2 py-0.5 rounded-md">
                      {ep.company}
                    </span>
                    <span className="text-[11px] text-[#9CA3AF] flex items-center gap-1 ml-auto sm:ml-0">
                      <Clock className="w-3 h-3" />
                      {ep.duration}
                    </span>
                  </div>

                  <h3 className="font-semibold text-xs text-[#374151]">
                    {ep.title}
                  </h3>

                  <p className="text-xs text-[#6B7280] leading-relaxed">
                    {ep.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {ep.topics.map((topic, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-[#F3F4F6] text-[#4B5563] px-2 py-0.5 rounded font-medium"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="shrink-0 flex items-center sm:flex-col gap-2 pt-2 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => {
                      onSelectEpisodePrompt(ep.samplePrompt);
                      onClose();
                    }}
                    className="w-full sm:w-auto px-3 py-2 rounded-lg bg-[#0E382B] hover:bg-[#0A2B21] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask about this</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#E5E7EB] bg-[#F9FAFB] flex items-center justify-between text-xs text-[#6B7280] shrink-0">
          <span>Click "Ask about this" to populate the research composer.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg border border-[#E5E7EB] hover:bg-gray-100 text-xs font-medium text-[#374151] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
