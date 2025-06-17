import React from 'react';
import { QRCodeCustomization } from '../../types/qrTypes';
import { Palette, Image as ImageIcon, Shield } from 'lucide-react';

interface QRCodeCustomizerProps {
  customization: QRCodeCustomization;
  onChange: (customization: QRCodeCustomization) => void;
}

const QRCodeCustomizer: React.FC<QRCodeCustomizerProps> = ({ customization, onChange }) => {
  const handleChange = (field: keyof QRCodeCustomization, value: any) => {
    onChange({ ...customization, [field]: value });
  };

  return (
    <div className="space-y-6">
      {/* Colors */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <Palette className="w-4 h-4 mr-2" />
          Colors
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Foreground Color
            </label>
            <div className="flex">
              <input
                type="color"
                value={customization.fgColor}
                onChange={(e) => handleChange('fgColor', e.target.value)}
                className="h-10 w-full rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600"
                aria-label="Select foreground color"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Background Color
            </label>
            <div className="flex">
              <input
                type="color"
                value={customization.bgColor}
                onChange={(e) => handleChange('bgColor', e.target.value)}
                className="h-10 w-full rounded-lg cursor-pointer border border-gray-300 dark:border-gray-600"
                aria-label="Select background color"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Size */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Size: {customization.size}px
        </label>
        <input
          type="range"
          min="128"
          max="512"
          step="8"
          value={customization.size}
          onChange={(e) => handleChange('size', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          aria-label="Adjust QR code size"
        />
      </div>

      {/* Style */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Style
        </label>
        <div className="grid grid-cols-3 gap-2">
          {['squares', 'dots', 'rounded'].map((style) => (
            <button
              key={style}
              onClick={() => handleChange('style', style)}
              className={`px-3 py-2 text-sm rounded-lg border ${
                customization.style === style
                  ? 'border-purple-500 bg-purple-50 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
              aria-pressed={customization.style === style}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Corner Radius */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Corner Radius: {customization.cornerRadius || 0}%
        </label>
        <input
          type="range"
          min="0"
          max="50"
          value={customization.cornerRadius || 0}
          onChange={(e) => handleChange('cornerRadius', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
          aria-label="Adjust corner radius"
        />
      </div>

      {/* Error Correction */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <Shield className="w-4 h-4 mr-2" />
          Error Correction
        </label>
        <select
          value={customization.level}
          onChange={(e) => handleChange('level', e.target.value)}
          className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
          aria-label="Select error correction level"
        >
          <option value="L">Low (7%)</option>
          <option value="M">Medium (15%)</option>
          <option value="Q">Quartile (25%)</option>
          <option value="H">High (30%)</option>
        </select>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Higher levels make the QR code more resistant to damage but increase its size
        </p>
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
          <ImageIcon className="w-4 h-4 mr-2" />
          Logo (Optional)
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  handleChange('logoImage', event.target?.result);
                };
                reader.readAsDataURL(file);
              }
            }}
            className="hidden"
            id="logo-upload"
            aria-label="Upload logo"
          />
          <label
            htmlFor="logo-upload"
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Choose File
          </label>
          {customization.logoImage && (
            <button
              onClick={() => handleChange('logoImage', undefined)}
              className="text-red-600 hover:text-red-700 text-sm"
              aria-label="Remove logo"
            >
              Remove
            </button>
          )}
        </div>
        {customization.logoImage && (
          <div className="mt-2">
            <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
              Logo Size: {customization.logoSize || 25}%
            </label>
            <input
              type="range"
              min="10"
              max="40"
              value={customization.logoSize || 25}
              onChange={(e) => handleChange('logoSize', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              aria-label="Adjust logo size"
            />
          </div>
        )}
      </div>

      {/* Margin */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="include-margin"
          checked={customization.includeMargin}
          onChange={(e) => handleChange('includeMargin', e.target.checked)}
          className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
          aria-label="Include margin"
        />
        <label htmlFor="include-margin" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
          Include Margin
        </label>
      </div>
    </div>
  );
};

export default QRCodeCustomizer;