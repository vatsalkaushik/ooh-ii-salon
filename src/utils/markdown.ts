import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Slide {
  id: string;
  title: string;
  content: string;
  level: number;
  quotes: string[];
  images: string[];
  bullets: string[];
}

export function parseMarkdownToSlides(filePath: string): Slide[] {
  const fullPath = path.join(process.cwd(), filePath);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { content } = matter(fileContents);

  // Split content by headers
  const sections = content.split(/(?=^#{1,6} )/m);
  
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
      
      // Extract images - handle both standard Markdown and Obsidian formats
      const images: string[] = [];
      
      // Handle standard Markdown image syntax: ![alt](path)
      sectionContent = sectionContent.replace(/!\[(.*?)\]\((.*?)\)/g, (match, alt, src) => {
        // Ensure image paths are properly formatted
        const formattedSrc = src.trim();
        // If it's a relative path without a leading slash and not an external URL, add the leading slash
        if (!formattedSrc.startsWith('/') && !formattedSrc.startsWith('http')) {
          images.push(`/${formattedSrc}`);
        } else {
          images.push(formattedSrc);
        }
        return '';
      });
      
      // Handle Obsidian image syntax: ![[image path]]
      sectionContent = sectionContent.replace(/!\[\[(.*?)\]\]/g, (match, imagePath) => {
        const formattedPath = imagePath.trim();
        // Assume these are images in the public/images directory
        if (!formattedPath.startsWith('/') && !formattedPath.startsWith('http')) {
          images.push(`/images/${formattedPath}`);
        } else {
          images.push(formattedPath);
        }
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

export function getAllMarkdownFiles(): string[] {
  const contentDirectory = path.join(process.cwd(), 'public/content');
  return fs.readdirSync(contentDirectory)
    .filter(file => file.endsWith('.md'))
    .map(file => `/content/${file}`);
}

export function getMarkdownContent(filePath: string): string {
  const fullPath = path.join(process.cwd(), filePath);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return fileContents;
} 