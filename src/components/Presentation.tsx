import React, { useState, useEffect, useCallback } from 'react';
import Slide from './Slide';
import { Slide as SlideType } from '@/utils/markdown';

interface PresentationProps {
  slides: SlideType[];
}

const Presentation: React.FC<PresentationProps> = ({ slides }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  
  const goToNextSlide = useCallback(() => {
    if (currentSlideIndex < slides.length - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  }, [currentSlideIndex, slides.length]);
  
  const goToPrevSlide = useCallback(() => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  }, [currentSlideIndex]);
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' || event.key === 'Space') {
      goToNextSlide();
    } else if (event.key === 'ArrowLeft') {
      goToPrevSlide();
    }
  }, [goToNextSlide, goToPrevSlide]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  return (
    <div className="presentation relative bg-gray-100 dark:bg-gray-900 min-h-screen">
      {slides.map((slide, index) => (
        <Slide 
          key={slide.id} 
          slide={slide} 
          isActive={index === currentSlideIndex} 
        />
      ))}
      
      <div className="fixed bottom-5 right-5 flex space-x-4">
        <button 
          onClick={goToPrevSlide}
          disabled={currentSlideIndex === 0}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <button 
          onClick={goToNextSlide}
          disabled={currentSlideIndex === slides.length - 1}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
      
      <div className="fixed bottom-5 left-5 text-gray-600 dark:text-gray-300">
        Slide {currentSlideIndex + 1} of {slides.length}
      </div>
    </div>
  );
};

export default Presentation; 