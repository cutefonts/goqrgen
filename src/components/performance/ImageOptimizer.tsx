import React, { useState, useCallback } from 'react';
import { Upload, Download, Settings, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageOptimizerProps {
  onOptimizedImage?: (optimizedImage: string) => void;
}

const ImageOptimizer: React.FC<ImageOptimizerProps> = ({ onOptimizedImage }) => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [optimizedImage, setOptimizedImage] = useState<string | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<'jpeg' | 'png' | 'webp'>('jpeg');

  const optimizeImage = useCallback(async (file: File) => {
    setIsOptimizing(true);
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions (max 1200px width)
        const maxWidth = 1200;
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        const newWidth = img.width * ratio;
        const newHeight = img.height * ratio;
        
        canvas.width = newWidth;
        canvas.height = newHeight;
        
        // Draw and compress
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);
        
        const mimeType = format === 'png' ? 'image/png' : 
                        format === 'webp' ? 'image/webp' : 'image/jpeg';
        
        const optimizedDataUrl = canvas.toDataURL(mimeType, quality / 100);
        setOptimizedImage(optimizedDataUrl);
        onOptimizedImage?.(optimizedDataUrl);
        
        toast.success('Image optimized successfully!');
        setIsOptimizing(false);
      };
      
      img.onerror = () => {
        toast.error('Failed to load image');
        setIsOptimizing(false);
      };
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setOriginalImage(result);
        img.src = result;
      };
      reader.readAsDataURL(file);
      
    } catch (error) {
      console.error('Image optimization error:', error);
      toast.error('Failed to optimize image');
      setIsOptimizing(false);
    }
  }, [quality, format, onOptimizedImage]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size should be less than 10MB');
      return;
    }
    
    optimizeImage(file);
  };

  const downloadOptimized = () => {
    if (!optimizedImage) return;
    
    const link = document.createElement('a');
    link.download = `optimized-image.${format}`;
    link.href = optimizedImage;
    link.click();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
        <ImageIcon className="w-5 h-5 mr-2" />
        Image Optimizer
      </h3>
      
      {/* Upload Area */}
      <div className="mb-6">
        <label className="cursor-pointer block w-full p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center hover:border-purple-500 transition-colors">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <span className="text-gray-600 dark:text-gray-400">
            Click to upload an image or drag and drop
          </span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Quality: {quality}%
          </label>
          <input
            type="range"
            min="10"
            max="100"
            value={quality}
            onChange={(e) => setQuality(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Format
          </label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value as 'jpeg' | 'png' | 'webp')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
        </div>
      </div>

      {/* Preview */}
      {(originalImage || optimizedImage) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {originalImage && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Original
              </h4>
              <img
                src={originalImage}
                alt="Original"
                className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
              />
            </div>
          )}
          
          {optimizedImage && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Optimized
              </h4>
              <img
                src={optimizedImage}
                alt="Optimized"
                className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
              />
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      {optimizedImage && (
        <div className="flex space-x-3">
          <button
            onClick={downloadOptimized}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Download Optimized
          </button>
        </div>
      )}

      {isOptimizing && (
        <div className="text-center py-4">
          <div className="animate-spin w-6 h-6 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-2"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Optimizing image...</p>
        </div>
      )}
    </div>
  );
};

export default ImageOptimizer;