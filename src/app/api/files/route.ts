import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const contentDir = path.join(process.cwd(), 'public/content');
    const files = fs.readdirSync(contentDir)
      .filter(file => file.endsWith('.md'));
    
    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error listing files:', error);
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
} 