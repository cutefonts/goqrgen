import React, { useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { QRCodeCustomization } from '../../types/qrTypes';
import { Smartphone, Monitor, Tablet } from 'lucide-react';

interface DevicePreviewProps {
  qrValue: string;
  customization: QRCodeCustomization;
}

const DevicePreview: React.FC<DevicePreviewProps> = ({ qrValue, customization }) => {
  const [activeDevice, setActiveDevice] = React.useState<'phone' | 'tablet' | 'desktop'>('phone');
  const previewRef = useRef<HTMLDivElement>(null);

  const devices = [
    { id: 'phone', label: 'Phone', icon: Smartphone },
    { id: 'tablet', label: 'Tablet', icon: Tablet },
    { id: 'desktop', label: 'Desktop', icon: Monitor },
  ];

  const getDeviceStyles = () => {
    const baseClasses = "relative mx-auto bg-gray-800 rounded-[2.5rem] p-2 overflow-hidden";
    
    switch (activeDevice) {
      case 'phone':
        return {
          container: `${baseClasses} w-[250px] h-[500px]`,
          screen: "bg-white h-full w-full rounded-[2rem] overflow-hidden",
          qrSize: 128
        };
      case 'tablet':
        return {
          container: `${baseClasses} w-[350px] h-[450px]`,
          screen: "bg-white h-full w-full rounded-[1.5rem] overflow-hidden",
          qrSize: 160
        };
      case 'desktop':
        return {
          container: `${baseClasses} w-full max-w-[500px] h-[300px] rounded-lg p-1`,
          screen: "bg-white h-full w-full rounded-md overflow-hidden",
          qrSize: 180
        };
      default:
        return {
          container: `${baseClasses} w-[250px] h-[500px]`,
          screen: "bg-white h-full w-full rounded-[2rem] overflow-hidden",
          qrSize: 128
        };
    }
  };

  const styles = getDeviceStyles();

  return (
    <div className="mt-6">
      <h3 className="text-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        Device Preview
      </h3>
      
      <div className="flex justify-center space-x-2 mb-4">
        {devices.map((device) => (
          <button
            key={device.id}
            onClick={() => setActiveDevice(device.id as 'phone' | 'tablet' | 'desktop')}
            className={`px-3 py-1.5 rounded-md flex items-center text-sm ${
              activeDevice === device.id
                ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <device.icon className="w-4 h-4 mr-1.5" />
            {device.label}
          </button>
        ))}
      </div>
      
      <div ref={previewRef} className={styles.container}>
        <div className={styles.screen}>
          <div className="flex flex-col h-full">
            {/* Mock browser/app header */}
            <div className="bg-gray-100 px-4 py-2 flex items-center">
              {activeDevice === 'desktop' ? (
                <>
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="mx-auto bg-white rounded-full px-4 py-1 text-xs text-gray-600 flex items-center">
                    <span className="truncate max-w-[200px]">example.com</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-xs font-medium text-gray-800">
                    {activeDevice === 'phone' ? 'QR Scanner' : 'QR Code Reader'}
                  </div>
                  <div className="ml-auto flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                    <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                  </div>
                </>
              )}
            </div>
            
            {/* QR code container */}
            <div className="flex-1 flex items-center justify-center p-4 bg-gray-50">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <QRCodeCanvas
                  value={qrValue}
                  size={styles.qrSize}
                  fgColor={customization.fgColor}
                  bgColor={customization.bgColor}
                  level={customization.level}
                  includeMargin={customization.includeMargin}
                />
              </div>
            </div>
            
            {/* Mock app footer */}
            {activeDevice !== 'desktop' && (
              <div className="bg-gray-100 px-4 py-3 flex justify-around">
                <div className="w-6 h-1 bg-gray-300 rounded-full"></div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
        This is how your QR code will appear on different devices
      </p>
    </div>
  );
};

export default DevicePreview;