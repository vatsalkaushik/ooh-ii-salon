import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

interface Slide {
  id: string;
  title: string;
  content: string;
  level: number;
  quotes: string[];
  images: string[];
  bullets: string[];
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file') || 'Part 1.md';
  
  try {
    const slides = parseMarkdownToSlides(`public/content/${file}`);
    return NextResponse.json({ slides });
  } catch (error) {
    console.error('Error parsing markdown:', error);
    return NextResponse.json({ error: 'Failed to parse markdown' }, { status: 500 });
  }
}

function parseMarkdownToSlides(filePath: string): Slide[] {
  const fullPath = path.join(process.cwd(), filePath);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  
  // Split content by headers
  const sections = fileContents.split(/(?=^#{1,6} )/m);
  
  return sections
    .filter(section => section.trim() !== '')
    .map((section, index) => {
      // Extract header level and title
      const headerMatch = section.match(/^(#{1,6}) (.*?)$/m);
      const level = headerMatch ? headerMatch[1].length : 0;
      const title = headerMatch ? headerMatch[2].trim() : 'Untitled Slide';
      
      // Remove the header from the content
      let sectionContent = section.replace(/^#{1,6} .*?$/m, '').trim();
      
      // Extract quotes
      const quotes: string[] = [];
      sectionContent = sectionContent.replace(/> "(.*?)"/g, (match, quote) => {
        quotes.push(quote);
        return '';
      });
      
      // Extract blockquotes that don't match the above pattern
      sectionContent = sectionContent.replace(/> (.*?)(?:\n|$)/g, (match, quote) => {
        if (!quotes.includes(quote)) {
          quotes.push(quote);
        }
        return '';
      });
      
      // Extract images
      const images: string[] = [];
      sectionContent = sectionContent.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
        images.push(src);
        return '';
      });
      
      // Convert remaining content to bullets
      const bullets = sectionContent
        .split('\n')
        .filter(line => line.trim() !== '')
        .map(line => line.replace(/^[*-] /, '').trim())
        .filter(line => !line.startsWith('#') && line !== '');
      
      return {
        id: `slide-${index}`,
        title,
        content: sectionContent,
        level,
        quotes,
        images,
        bullets
      };
    });
} 