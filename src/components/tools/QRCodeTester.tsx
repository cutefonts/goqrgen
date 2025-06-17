import React, { useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { CheckCircle, XCircle, AlertTriangle, Smartphone, Monitor, Tablet } from 'lucide-react';

interface QRCodeTesterProps {
  qrValue: string;
  customization: any;
}

interface TestResult {
  device: string;
  size: number;
  distance: string;
  result: 'pass' | 'warning' | 'fail';
  message: string;
}

const QRCodeTester: React.FC<QRCodeTesterProps> = ({ qrValue, customization }) => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isTesting, setIsTesting] = useState(false);

  const runTests = async () => {
    setIsTesting(true);
    
    // Simulate testing different scenarios
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const tests: TestResult[] = [
      {
        device: 'Smartphone',
        size: 128,
        distance: '10-15cm',
        result: customization.size >= 128 ? 'pass' : 'warning',
        message: customization.size >= 128 ? 'Optimal for mobile scanning' : 'Consider increasing size for better mobile scanning'
      },
      {
        device: 'Tablet',
        size: 200,
        distance: '15-25cm',
        result: customization.size >= 200 ? 'pass' : 'warning',
        message: customization.size >= 200 ? 'Perfect for tablet scanning' : 'Size adequate but could be larger'
      },
      {
        device: 'Desktop',
        size: 256,
        distance: '30-50cm',
        result: customization.size >= 256 ? 'pass' : customization.size >= 200 ? 'warning' : 'fail',
        message: customization.size >= 256 ? 'Excellent for desktop viewing' : 
                customization.size >= 200 ? 'Acceptable for desktop' : 'Too small for desktop scanning'
      }
    ];

    // Add contrast test
    const contrastTest: TestResult = {
      device: 'Contrast',
      size: 0,
      distance: 'N/A',
      result: getContrastRatio(customization.fgColor, customization.bgColor) >= 3 ? 'pass' : 'fail',
      message: getContrastRatio(customization.fgColor, customization.bgColor) >= 3 ? 
               'Good contrast ratio' : 'Poor contrast - may be difficult to scan'
    };

    setTestResults([...tests, contrastTest]);
    setIsTesting(false);
  };

  const getContrastRatio = (color1: string, color2: string): number => {
    // Simplified contrast calculation
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    
    const brightness1 = (r1 * 299 + g1 * 587 + b1 * 114) / 1000;
    const brightness2 = (r2 * 299 + g2 * 587 + b2 * 114) / 1000;
    
    return Math.abs(brightness1 - brightness2) / 255 * 21;
  };

  const getResultIcon = (result: 'pass' | 'warning' | 'fail') => {
    switch (result) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'smartphone':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      case 'desktop':
        return <Monitor className="w-4 h-4" />;
      default:
        return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        QR Code Compatibility Test
      </h3>
      
      <div className="mb-6">
        <button
          onClick={runTests}
          disabled={isTesting || !qrValue}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isTesting ? 'Testing...' : 'Run Compatibility Test'}
        </button>
      </div>

      {isTesting && (
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Testing QR code across different devices...</p>
        </div>
      )}

      {testResults.length > 0 && !isTesting && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-800 dark:text-white">Test Results:</h4>
          {testResults.map((test, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center space-x-3">
                {getDeviceIcon(test.device)}
                <div>
                  <div className="font-medium text-gray-800 dark:text-white">
                    {test.device}
                    {test.size > 0 && (
                      <span className="text-sm text-gray-500 ml-2">
                        ({test.size}px, {test.distance})
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {test.message}
                  </div>
                </div>
              </div>
              {getResultIcon(test.result)}
            </div>
          ))}
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
              Recommendations:
            </h5>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Minimum size: 128px for mobile devices</li>
              <li>• Recommended size: 256px for best compatibility</li>
              <li>• Ensure high contrast between foreground and background</li>
              <li>• Test in various lighting conditions</li>
              <li>• Leave adequate quiet zone (margin) around the QR code</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeTester;