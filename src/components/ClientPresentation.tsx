'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Slide from './Slide';

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
  initialFile = 'Part 1.md' 
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
    if (event.key === 'ArrowRight' || event.key === ' ') {
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
    <div className="presentation relative bg-gray-100 dark:bg-gray-900 min-h-screen">
      {slides.map((slide, index) => (
        <Slide 
          key={slide.id} 
          slide={slide} 
          isActive={index === currentSlideIndex} 
        />
      ))}
      
      <div className="fixed bottom-5 left-5 text-gray-600 dark:text-gray-300">
        Slide {currentSlideIndex + 1} of {slides.length}
      </div>
    </div>
  );
};

export default ClientPresentation; 