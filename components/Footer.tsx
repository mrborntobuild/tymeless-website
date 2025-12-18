import React from 'react';
import Logo from './Logo';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FDFCF8] border-t border-gray-100 py-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-cradle-text/60">
        <div className="flex items-center gap-2">
          <Logo size="sm" />
          <span>© 2025 Tymeless AI Inc. All rights reserved.</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-cradle-brand transition">Terms</a>
          <a href="#" className="hover:text-cradle-brand transition">Privacy</a>
        </div>
      </div>
    </footer>
  );
};
