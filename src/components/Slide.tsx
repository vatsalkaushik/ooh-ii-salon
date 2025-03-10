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
  // Function to determine heading class based on level
  const getHeadingClass = () => {
    switch(slide.level) {
      case 1:
        return "text-4xl font-bold mb-6 text-gray-800 dark:text-white";
      case 2:
        return "text-3xl font-bold mb-6 text-gray-800 dark:text-white";
      case 3:
        return "text-2xl font-bold mb-6 text-gray-800 dark:text-white";
      case 4:
        return "text-xl font-bold mb-6 text-gray-800 dark:text-white";
      default:
        return "text-3xl font-bold mb-6 text-gray-800 dark:text-white"; // Default to H2 style
    }
  };

  // Function to ensure image path starts with a slash
  const getImagePath = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  };

  return (
    <div 
      className={`slide ${isActive ? 'active' : 'hidden'} h-screen w-full flex flex-col justify-center items-center p-10`}
    >
      <div className="max-w-5xl w-full p-8">
        <h2 className={getHeadingClass()}>{slide.title}</h2>
        
        {slide.quotes.length > 0 && (
          <div className="mb-6">
            {slide.quotes.map((quote, index) => (
              <blockquote 
                key={index} 
                className="border-l-4 border-blue-500 pl-4 text-gray-600 dark:text-gray-300 my-4"
              >
                {quote}
              </blockquote>
            ))}
          </div>
        )}
        
        {slide.images.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-6 justify-center">
            {slide.images.map((image, index) => (
              <div key={index} className="relative h-96 w-full md:w-3/4 mx-auto">
                <Image 
                  src={getImagePath(image)} 
                  alt={`Slide image ${index + 1}`} 
                  fill
                  className="object-contain"
                  unoptimized={true}
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