export type QRCodeType = 
  | 'url' 
  | 'text' 
  | 'email' 
  | 'phone' 
  | 'sms' 
  | 'wifi' 
  | 'vcard' 
  | 'event' 
  | 'geolocation';

export interface QRCodeData {
  id: string;
  type: QRCodeType;
  value: string;
  name: string;
  created: string;
  customization: QRCodeCustomization;
  preview?: string;
}

export interface QRCodeCustomization {
  fgColor: string;
  bgColor: string;
  size: number;
  includeMargin: boolean;
  level: 'L' | 'M' | 'Q' | 'H';
  logoImage?: string;
  cornerRadius?: number;
  logoSize?: number;
  style?: 'squares' | 'dots' | 'rounded';
}

export type ContactInfo = {
  firstName: string;
  lastName: string;
  organization?: string;
  title?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
};

export type WiFiInfo = {
  ssid: string;
  password: string;
  encryption: 'WEP' | 'WPA' | 'nopass';
  hidden: boolean;
};

export type EventInfo = {
  title: string;
  description?: string;
  location?: string;
  startDate: string;
  endDate?: string;
};

export type GeolocationInfo = {
  latitude: string;
  longitude: string;
  altitude?: string;
  label?: string;
};