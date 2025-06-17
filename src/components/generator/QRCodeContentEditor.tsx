import React from 'react';
import { QRCodeType } from '../../types/qrTypes';

interface QRCodeContentEditorProps {
  type: QRCodeType;
  value: string;
  onChange: (value: string) => void;
}

const QRCodeContentEditor: React.FC<QRCodeContentEditorProps> = ({ type, value, onChange }) => {
  const getPlaceholder = () => {
    switch (type) {
      case 'url':
        return 'https://example.com';
      case 'email':
        return 'email@example.com';
      case 'phone':
        return '+1234567890';
      case 'sms':
        return '+1234567890';
      case 'wifi':
        return 'SSID:MyWiFi\nPassword:MyPassword\nEncryption:WPA';
      case 'vcard':
        return 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD';
      case 'event':
        return 'Event details...';
      case 'geolocation':
        return 'Latitude: 0.000000\nLongitude: 0.000000';
      default:
        return 'Enter your content here...';
    }
  };

  const getLabel = () => {
    switch (type) {
      case 'url':
        return 'Website URL';
      case 'email':
        return 'Email Address';
      case 'phone':
        return 'Phone Number';
      case 'sms':
        return 'SMS Number and Message';
      case 'wifi':
        return 'WiFi Network Details';
      case 'vcard':
        return 'Contact Information';
      case 'event':
        return 'Event Details';
      case 'geolocation':
        return 'Location Coordinates';
      default:
        return 'Content';
    }
  };

  const validateInput = (input: string) => {
    switch (type) {
      case 'url':
        if (!input.startsWith('http://') && !input.startsWith('https://')) {
          return 'https://' + input;
        }
        break;
      case 'email':
        if (!input.includes('@') && input.length > 0) {
          return input + '@';
        }
        break;
      case 'phone':
        if (!input.startsWith('+') && input.length > 0) {
          return '+' + input;
        }
        break;
    }
    return input;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col">
        <label htmlFor="qr-content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {getLabel()}
        </label>
        <textarea
          id="qr-content"
          value={value}
          onChange={(e) => onChange(validateInput(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white min-h-[120px]"
          placeholder={getPlaceholder()}
          aria-label={`Enter ${getLabel().toLowerCase()}`}
        />
      </div>

      {type === 'url' && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Enter a valid URL starting with http:// or https://
        </p>
      )}

      {type === 'wifi' && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Format: SSID:NetworkName\nPassword:YourPassword\nEncryption:WPA/WEP/nopass
        </p>
      )}

      {type === 'vcard' && (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Include contact details in vCard format
        </p>
      )}
    </div>
  );
};

export default QRCodeContentEditor;