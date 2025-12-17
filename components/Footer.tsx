import React from 'react';
import { Instagram, Twitter, Youtube, Linkedin, Circle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FDFCF8] border-t border-gray-100 pt-20 pb-10 px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="max-w-xs">
            <div className="flex items-center gap-2 mb-6">
               <svg width="32" height="32" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10 10C10 10 20 20 10 30" stroke="#2A2420" strokeWidth="2.5" strokeLinecap="round"/>
                  <path d="M30 10C30 10 20 20 30 30" stroke="#2A2420" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="20" cy="20" r="3" fill="#2A2420"/>
               </svg>
               <span className="font-serif text-2xl font-medium text-cradle-text">Cradle</span>
            </div>
            <p className="text-xl md:text-2xl font-serif text-cradle-text leading-tight">
               Cradle allows the most cherished memories to scale their time, infinitely.
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 text-sm">
             <div>
                <h4 className="font-bold text-cradle-text mb-4">Cradle</h4>
                <ul className="space-y-3 text-cradle-text/60">
                   <li><a href="#" className="hover:text-cradle-brand">Features</a></li>
                   <li><a href="#" className="hover:text-cradle-brand">About</a></li>
                   <li><a href="#" className="hover:text-cradle-brand">Pricing</a></li>
                   <li><a href="#" className="hover:text-cradle-brand">Explore</a></li>
                   <li><a href="#" className="hover:text-cradle-brand">Careers</a></li>
                   <li><a href="#" className="hover:text-cradle-brand">Blog</a></li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-cradle-text mb-4">Use Cases</h4>
                <ul className="space-y-3 text-cradle-text/60">
                   <li><a href="#" className="hover:text-cradle-brand">Genealogy</a></li>
                   <li><a href="#" className="hover:text-cradle-brand">Memorials</a></li>
                   <li><a href="#" className="hover:text-cradle-brand">Military Service</a></li>
                   <li><a href="#" className="hover:text-cradle-brand">Dementia Care</a></li>
                </ul>
             </div>
             <div>
                <h4 className="font-bold text-cradle-text mb-4">Social</h4>
                <div className="flex gap-4 text-cradle-text/60">
                   <a href="#" className="hover:text-cradle-brand"><Instagram size={20}/></a>
                   <a href="#" className="hover:text-cradle-brand"><Twitter size={20}/></a>
                   <a href="#" className="hover:text-cradle-brand"><Youtube size={20}/></a>
                   <a href="#" className="hover:text-cradle-brand"><Linkedin size={20}/></a>
                </div>
             </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-cradle-text/40">
           <div className="flex gap-6">
              <span>© 2024 Cradle AI Inc. All rights reserved.</span>
           </div>
           <div className="flex gap-6">
              <a href="#" className="hover:text-cradle-brand">Terms</a>
              <a href="#" className="hover:text-cradle-brand">Privacy</a>
              <a href="#" className="hover:text-cradle-brand">Cookies</a>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-100">
                 <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                 Operational
              </div>
           </div>
        </div>
      </div>
    </footer>
  );
};
