'use client';

import React, { useEffect, useRef } from 'react';

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
  const activeItemRef = useRef<HTMLLIElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll to active item when currentSlideIndex changes
  useEffect(() => {
    if (activeItemRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeItem = activeItemRef.current;
      
      // Calculate if the active item is outside the visible area
      const containerRect = container.getBoundingClientRect();
      const activeItemRect = activeItem.getBoundingClientRect();
      
      const isAbove = activeItemRect.top < containerRect.top;
      const isBelow = activeItemRect.bottom > containerRect.bottom;
      
      if (isAbove || isBelow) {
        // Scroll the active item into view with some padding
        activeItem.scrollIntoView({ 
          behavior: 'smooth', 
          block: isBelow ? 'end' : 'start' 
        });
      }
    }
  }, [currentSlideIndex]);

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 shadow-md z-10">
      <div ref={containerRef} className="p-4 pt-6 overflow-y-auto h-full">
        <ul className="space-y-1">
          {slides.map((slide, index) => (
            <li 
              key={slide.id} 
              ref={index === currentSlideIndex ? activeItemRef : null}
            >
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
    </div>
  );
};

export default TableOfContents; 