'use client';

import React, { useState, useEffect } from 'react';

interface FileSelectorProps {
  onFileSelect: (file: string) => void;
  currentFile: string;
}

const FileSelector: React.FC<FileSelectorProps> = ({ onFileSelect, currentFile }) => {
  const [files, setFiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchFiles() {
      try {
        setLoading(true);
        const response = await fetch('/api/files');
        const data = await response.json();
        
        if (data.files) {
          setFiles(data.files);
        }
      } catch (error) {
        console.error('Failed to fetch files:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchFiles();
  }, []);
  
  if (loading) {
    return <div>Loading files...</div>;
  }
  
  if (files.length === 0) {
    return <div>No markdown files found</div>;
  }
  
  return (
    <div className="file-selector p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">Select Presentation</h3>
      <select 
        value={currentFile}
        onChange={(e) => onFileSelect(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
      >
        {files.map((file) => (
          <option key={file} value={file}>
            {file}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FileSelector; 