import React from 'react';
import { Leaf } from 'phosphor-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'white';
}

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', onClick, variant = 'default' }) => {
  const sizeClasses = {
    sm: { text: 'text-xl', icon: 24 },
    md: { text: 'text-3xl', icon: 32 },
    lg: { text: 'text-4xl', icon: 40 }
  };

  const currentSize = sizeClasses[size];
  const iconColor = variant === 'white' ? 'text-white' : 'text-cradle-brand';
  const textColor = variant === 'white' ? 'text-white' : 'text-black';

  return (
    <div 
      className={`flex items-center gap-2 font-serif font-normal ${currentSize.text} ${className}`}
      onClick={onClick}
    >
      <Leaf weight="light" size={currentSize.icon} className={iconColor} />
      <span className={textColor}>Tymeless</span>
    </div>
  );
};

export default Logo;

