'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Slide from './Slide';
import TableOfContents from './TableOfContents';

interface SlideType {
  id: string;
  title: string;
  content: string;
  level: number;
  quotes: string[];
  images: string[];
  bullets: string[];
}

interface PresentationProps {
  initialSlides?: SlideType[];
  initialFile?: string;
}

const ClientPresentation: React.FC<PresentationProps> = ({ 
  initialSlides = [], 
  initialFile = 'slides.md'
}) => {
  const [slides, setSlides] = useState<SlideType[]>(initialSlides);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [loading, setLoading] = useState(initialSlides.length === 0);
  const [currentFile, setCurrentFile] = useState(initialFile);
  
  const fetchSlides = useCallback(async (file: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/slides?file=${encodeURIComponent(file)}`);
      const data = await response.json();
      
      if (data.slides) {
        setSlides(data.slides);
        setCurrentSlideIndex(0); // Reset to first slide when changing files
      }
    } catch (error) {
      console.error('Failed to fetch slides:', error);
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => {
    if (initialSlides.length === 0) {
      fetchSlides(currentFile);
    }
  }, [fetchSlides, initialSlides.length, currentFile]);
  
  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlideIndex(index);
    }
  }, [slides.length]);
  
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'ArrowDown') {
      goToSlide(currentSlideIndex + 1);
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      goToSlide(currentSlideIndex - 1);
    }
  }, [goToSlide, currentSlideIndex]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">Loading presentation...</div>
      </div>
    );
  }
  
  if (slides.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-2xl">No slides found</div>
      </div>
    );
  }
  
  return (
    <div className="presentation relative bg-white dark:bg-white min-h-screen">
      <TableOfContents 
        slides={slides} 
        currentSlideIndex={currentSlideIndex} 
        onSlideSelect={goToSlide} 
      />
      
      <div className="ml-0 md:ml-64 transition-all duration-300">
        {slides.map((slide, index) => (
          <Slide 
            key={slide.id} 
            slide={slide} 
            isActive={index === currentSlideIndex} 
          />
        ))}
      </div>
      
      <div className="fixed bottom-5 left-5 md:left-[17rem] text-gray-600 dark:text-gray-300 transition-all duration-300">
        Slide {currentSlideIndex + 1} of {slides.length}
      </div>
    </div>
  );
};

export default ClientPresentation; 