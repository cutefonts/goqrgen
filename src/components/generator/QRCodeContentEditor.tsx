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
        return 'SMS:+1234567890:Hello World';
      case 'wifi':
        return 'WIFI:T:WPA;S:MyNetwork;P:MyPassword;;';
      case 'vcard':
        return 'BEGIN:VCARD\nVERSION:3.0\nFN:John Doe\nTEL:+1234567890\nEMAIL:john@example.com\nEND:VCARD';
      case 'event':
        return 'BEGIN:VEVENT\nSUMMARY:Meeting\nDTSTART:20240315T100000Z\nDTEND:20240315T110000Z\nEND:VEVENT';
      case 'geolocation':
        return 'geo:37.7749,-122.4194';
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
        return 'SMS Message';
      case 'wifi':
        return 'WiFi Network Details';
      case 'vcard':
        return 'Contact Information (vCard)';
      case 'event':
        return 'Event Details (vEvent)';
      case 'geolocation':
        return 'Location Coordinates';
      default:
        return 'Content';
    }
  };

  const formatContent = (input: string, type: QRCodeType): string => {
    switch (type) {
      case 'url':
        if (input && !input.startsWith('http://') && !input.startsWith('https://')) {
          return 'https://' + input;
        }
        return input;
      
      case 'email':
        if (input && !input.startsWith('mailto:')) {
          return 'mailto:' + input;
        }
        return input;
      
      case 'phone':
        if (input && !input.startsWith('tel:')) {
          return 'tel:' + input;
        }
        return input;
      
      case 'sms':
        if (input && !input.startsWith('SMS:') && !input.startsWith('sms:')) {
          // Format: SMS:number:message
          const parts = input.split(':');
          if (parts.length === 1) {
            return `SMS:${input}:`;
          }
        }
        return input;
      
      case 'wifi':
        if (input && !input.startsWith('WIFI:')) {
          // Simple format helper
          const lines = input.split('\n');
          let ssid = '', password = '', encryption = 'WPA';
          
          lines.forEach(line => {
            const lower = line.toLowerCase();
            if (lower.includes('ssid:') || lower.includes('network:')) {
              ssid = line.split(':')[1]?.trim() || '';
            } else if (lower.includes('password:') || lower.includes('pass:')) {
              password = line.split(':')[1]?.trim() || '';
            } else if (lower.includes('encryption:') || lower.includes('type:')) {
              encryption = line.split(':')[1]?.trim().toUpperCase() || 'WPA';
            }
          });
          
          if (ssid) {
            return `WIFI:T:${encryption};S:${ssid};P:${password};;`;
          }
        }
        return input;
      
      case 'geolocation':
        if (input && !input.startsWith('geo:')) {
          // Try to parse latitude,longitude format
          const coords = input.split(',').map(c => c.trim());
          if (coords.length >= 2) {
            return `geo:${coords[0]},${coords[1]}`;
          }
        }
        return input;
      
      default:
        return input;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleBlur = () => {
    // Format content when user finishes editing
    const formatted = formatContent(value, type);
    if (formatted !== value) {
      onChange(formatted);
    }
  };

  const getHelpText = () => {
    switch (type) {
      case 'url':
        return 'Enter a valid URL. "https://" will be added automatically if missing.';
      case 'email':
        return 'Enter an email address. "mailto:" will be added automatically.';
      case 'phone':
        return 'Enter a phone number with country code (e.g., +1234567890).';
      case 'sms':
        return 'Format: SMS:+1234567890:Your message here';
      case 'wifi':
        return 'Format: WIFI:T:WPA;S:NetworkName;P:Password;; or use simple format with SSID and Password on separate lines.';
      case 'vcard':
        return 'Use vCard format for contact information. Include BEGIN:VCARD and END:VCARD.';
      case 'event':
        return 'Use vEvent format for calendar events. Include BEGIN:VEVENT and END:VEVENT.';
      case 'geolocation':
        return 'Format: geo:latitude,longitude (e.g., geo:37.7749,-122.4194)';
      default:
        return 'Enter any text content for your QR code.';
    }
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
          onChange={handleChange}
          onBlur={handleBlur}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white min-h-[120px] resize-vertical"
          placeholder={getPlaceholder()}
          aria-label={`Enter ${getLabel().toLowerCase()}`}
        />
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
        <p className="font-medium mb-1">💡 Tip:</p>
        <p>{getHelpText()}</p>
      </div>

      {value && value.length > 2000 && (
        <div className="text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg">
          <p className="font-medium mb-1">⚠️ Warning:</p>
          <p>Content is quite long ({value.length} characters). Consider using a higher error correction level for better reliability.</p>
        </div>
      )}
    </div>
  );
};

export default QRCodeContentEditor;