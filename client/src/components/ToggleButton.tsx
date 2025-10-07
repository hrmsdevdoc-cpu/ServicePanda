import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ToggleButtonProps {
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ 
  isExpanded, 
  onToggle, 
  className = '' 
}) => {
  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('Toggle button clicked, current state:', isExpanded);
        onToggle();
      }}
      className={`
        relative
        bg-gray-500 hover:bg-gray-600 
        text-white rounded
        w-8 h-8 shadow-lg transition-all duration-200
        hover:shadow-xl active:scale-95
        border border-gray-300
        flex items-center justify-center
        cursor-pointer
        ${className}
      `}
      aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
    >
      {isExpanded ? (
        <ChevronLeft className="w-4 h-4 text-white" />
      ) : (
        <ChevronRight className="w-4 h-4 text-white" />
      )}
    </button>
  );
};

export default ToggleButton;
