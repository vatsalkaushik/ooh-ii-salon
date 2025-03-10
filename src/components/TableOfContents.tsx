'use client';

import React, { useState } from 'react';

interface SlideType {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  slides: SlideType[];
  currentSlideIndex: number;
  onSlideSelect: (index: number) => void;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({ 
  slides, 
  currentSlideIndex, 
  onSlideSelect 
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 shadow-md transition-all duration-300 z-10 ${isCollapsed ? 'w-12' : 'w-64'}`}>
      <button 
        onClick={toggleCollapse}
        className="absolute right-2 top-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
        aria-label={isCollapsed ? "Expand table of contents" : "Collapse table of contents"}
      >
        {isCollapsed ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>
      
      {!isCollapsed && (
        <div className="p-4 pt-12 overflow-y-auto h-full">
          <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">Table of Contents</h3>
          <ul className="space-y-1">
            {slides.map((slide, index) => (
              <li key={slide.id}>
                <button
                  onClick={() => onSlideSelect(index)}
                  className={`text-left w-full p-1.5 rounded text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    index === currentSlideIndex 
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-medium' 
                      : 'text-gray-700 dark:text-gray-300'
                  }`}
                  style={{ 
                    paddingLeft: `${(slide.level || 1) * 0.75}rem` 
                  }}
                >
                  {slide.title || `Slide ${index + 1}`}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default TableOfContents; 