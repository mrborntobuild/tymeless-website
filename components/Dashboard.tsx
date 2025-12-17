import React from 'react';
import { Leaf, Settings, LogOut, ChevronDown, MessageSquare, Image as ImageIcon, Upload, Loader2, Plus, LayoutGrid, Folder, HelpCircle } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  return (
    <div className="min-h-screen bg-[#FDFCF8] font-sans text-[#2A2420]">
      {/* Top Navigation */}
      <header className="px-6 py-4 md:px-12 flex items-center justify-between border-b border-[#EBE8E0]">
        <div className="flex items-center gap-2">
          <Leaf className="text-[#D97757]" strokeWidth={1.5} />
          <span className="font-serif text-xl font-medium">Tymeless</span>
        </div>
        <div className="flex items-center gap-4 text-[#2A2420]/60">
          <button className="hover:text-[#2A2420] transition-colors"><Settings size={20} /></button>
          <button onClick={onLogout} className="hover:text-[#2A2420] transition-colors"><LogOut size={20} /></button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 md:px-12">
        
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif mb-3">Welcome back</h1>
            <p className="text-[#2A2420]/60 text-lg font-light">
              Viewing all content: 0 answered questions, 0 conversations, 38 assets.
            </p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
             <span className="text-xs text-[#2A2420]/40 font-medium uppercase tracking-wider">Viewing stories for</span>
             <button className="bg-white border border-[#EBE8E0] rounded-lg px-4 py-2 flex items-center gap-8 min-w-[200px] justify-between hover:border-[#D97757]/30 transition-colors">
                <span className="font-medium">Henry Moses <span className="text-[#2A2420]/40 font-normal">(Self)</span></span>
                <ChevronDown size={16} className="text-[#2A2420]/40" />
             </button>
          </div>
        </div>

        {/* Filters / Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
           <button className="bg-[#EBE8E0] text-[#2A2420] px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2">
             <LayoutGrid size={16} /> All <span className="bg-[#D97757] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">38</span>
           </button>
           <button className="bg-transparent hover:bg-[#F4F1EA] text-[#2A2420]/60 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
             <Folder size={16} /> All Assets <span className="bg-[#D97757] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">38</span>
           </button>
           <button className="bg-transparent hover:bg-[#F4F1EA] text-[#2A2420]/60 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
             <HelpCircle size={16} /> Questions
           </button>
           <button className="bg-transparent hover:bg-[#F4F1EA] text-[#2A2420]/60 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
             <MessageSquare size={16} /> Conversations
           </button>
        </div>

        {/* Content Area */}
        <div className="space-y-8">
           
           {/* Conversations Section */}
           <div className="bg-white border border-[#EBE8E0] rounded-2xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <MessageSquare className="text-[#D97757]" />
                    <h2 className="text-xl font-serif">Conversations</h2>
                 </div>
                 <button className="bg-[#D97757] hover:bg-[#C56545] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors shadow-sm">
                    <Upload size={16} /> Upload
                 </button>
              </div>

              <div className="flex flex-col items-center justify-center py-12 text-center">
                 <p className="text-[#2A2420]/40 mb-6">No conversations yet.</p>
                 <button className="bg-[#F9F8F6] border border-[#EBE8E0] hover:border-[#D97757]/30 text-[#2A2420] px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 transition-all">
                    <Upload size={16} /> Upload Conversation
                 </button>
              </div>
           </div>

           {/* Assets Section */}
           <div className="space-y-6">
              <div className="flex items-center gap-3 px-2">
                 <Folder className="text-[#D97757]" />
                 <h2 className="text-xl font-serif">Assets</h2>
              </div>
              <p className="px-2 text-[#2A2420]/60 text-sm -mt-4 mb-4">Your uploaded files and media</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Asset Card 1 - Placeholder */}
                 <div className="bg-[#EBE8E0] rounded-2xl aspect-[4/3] animate-pulse"></div>

                 {/* Asset Card 2 - Image Mock */}
                 <div className="relative group rounded-2xl overflow-hidden aspect-[4/3]">
                    <img 
                      src="https://picsum.photos/id/102/800/600" 
                      alt="Asset" 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                 </div>

                 {/* Asset Card 3 - Uploading State Mock */}
                 <div className="bg-[#EFEDE6] border border-[#EBE8E0] rounded-2xl aspect-[4/3] flex flex-col items-center justify-center text-center p-6">
                    <div className="w-16 h-16 rounded-full border-4 border-[#D97757]/20 border-t-[#D97757] animate-spin mb-4"></div>
                    <div className="bg-[#D97757]/10 p-2 rounded-lg mb-2 text-[#D97757]">
                       <ImageIcon size={20} />
                    </div>
                    <span className="font-medium text-sm mb-1">Uploading image...</span>
                    <span className="text-xs text-[#2A2420]/40 font-mono">DSC_0579.jpg</span>
                 </div>
              </div>
           </div>

        </div>

      </main>
    </div>
  );
};

export default Dashboard;
