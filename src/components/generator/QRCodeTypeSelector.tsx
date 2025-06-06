import React from 'react';
import { QRCodeType } from '../../types/qrTypes';
import { Link2, FileText, Mail, Phone, MessageSquare, Wifi, User, Calendar, Map } from 'lucide-react';

interface QRCodeTypeSelectorProps {
  selectedType: QRCodeType;
  onSelectType: (type: QRCodeType) => void;
}

const QRCodeTypeSelector: React.FC<QRCodeTypeSelectorProps> = ({ 
  selectedType, 
  onSelectType 
}) => {
  const types: { type: QRCodeType; label: string; icon: React.FC<{ className?: string }> }[] = [
    { type: 'url', label: 'URL', icon: Link2 },
    { type: 'text', label: 'Text', icon: FileText },
    { type: 'email', label: 'Email', icon: Mail },
    { type: 'phone', label: 'Phone', icon: Phone },
    { type: 'sms', label: 'SMS', icon: MessageSquare },
    { type: 'wifi', label: 'WiFi', icon: Wifi },
    { type: 'vcard', label: 'Contact', icon: User },
    { type: 'event', label: 'Event', icon: Calendar },
    { type: 'geolocation', label: 'Location', icon: Map },
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        QR Code Type
      </label>
      <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
        {types.map(({ type, label, icon: Icon }) => (
          <button
            key={type}
            onClick={() => onSelectType(type)}
            className={`flex flex-col items-center justify-center p-3 rounded-lg border ${
              selectedType === type
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900 dark:border-purple-400 text-purple-700 dark:text-purple-300'
                : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
            } transition-colors`}
          >
            <Icon className={`w-5 h-5 mb-1 ${
              selectedType === type 
                ? 'text-purple-600 dark:text-purple-400' 
                : 'text-gray-500 dark:text-gray-400'
            }`} />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QRCodeTypeSelector;