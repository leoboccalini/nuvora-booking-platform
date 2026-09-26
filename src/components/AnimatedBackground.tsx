import React from 'react';
import { BGPattern } from './ui/bg-pattern';
interface AnimatedBackgroundProps {
    children: React.ReactNode;
    variant?: 'gradient' | 'particles' | 'wave' | 'both';
    className?: string;
}
export const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ children, variant = 'both', className = '' }) => {
    return (<div className={`relative min-h-screen ${className}`}>
      
      <div className="fixed inset-0 bg-black z-[-1]"/>
      
      
      {(variant === 'particles' || variant === 'both') && (<BGPattern variant="dots" size={32} fill="rgba(255, 217, 0, 0.15)" className="fixed inset-0 z-0 opacity-50"/>)}

      
      {(variant === 'gradient' || variant === 'both') && (<div className="fixed inset-0 bg-gradient-animated subtle-glow opacity-30 z-0 pointer-events-none"/>)}
      
      
      <div className="relative z-20">
        {children}
      </div>
    </div>);
};
export default AnimatedBackground;
