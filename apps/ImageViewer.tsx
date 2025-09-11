
import React from 'react';

interface ImageViewerProps {
  initialContent?: string;
}

const ImageViewer: React.FC<ImageViewerProps> = ({ initialContent }) => {
  if (!initialContent || !initialContent.startsWith('data:image')) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-900 rounded-b-lg text-red-400">
        Invalid image file.
      </div>
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-900 rounded-b-lg p-4">
      <img
        src={initialContent}
        alt="User content"
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
};

export default ImageViewer;
