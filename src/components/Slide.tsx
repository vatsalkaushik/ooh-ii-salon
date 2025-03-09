'use client';

import React from 'react';
import Image from 'next/image';

interface SlideType {
  id: string;
  title: string;
  content: string;
  level: number;
  quotes: string[];
  images: string[];
  bullets: string[];
}

interface SlideProps {
  slide: SlideType;
  isActive: boolean;
}

const Slide: React.FC<SlideProps> = ({ slide, isActive }) => {
  return (
    <div 
      className={`slide ${isActive ? 'active' : 'hidden'} h-screen w-screen flex flex-col justify-center items-center p-10`}
    >
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">{slide.title}</h2>
        
        {slide.quotes.length > 0 && (
          <div className="mb-6">
            {slide.quotes.map((quote, index) => (
              <blockquote 
                key={index} 
                className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-300 my-4"
              >
                {quote}
              </blockquote>
            ))}
          </div>
        )}
        
        {slide.images.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-4 justify-center">
            {slide.images.map((image, index) => (
              <div key={index} className="relative h-64 w-full md:w-1/2">
                <Image 
                  src={image} 
                  alt={`Slide image ${index + 1}`} 
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        )}
        
        {slide.bullets.length > 0 && (
          <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
            {slide.bullets.map((bullet, index) => (
              <li key={index}>{bullet}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Slide; 