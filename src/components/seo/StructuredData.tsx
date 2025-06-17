import React from 'react';
import { Helmet } from 'react-helmet-async';

interface StructuredDataProps {
  type?: 'WebApplication' | 'SoftwareApplication' | 'WebPage';
  name?: string;
  description?: string;
  url?: string;
  applicationCategory?: string;
  operatingSystem?: string;
  offers?: {
    price: string;
    priceCurrency: string;
  };
}

const StructuredData: React.FC<StructuredDataProps> = ({
  type = 'WebApplication',
  name = 'GOQRGen - QR Code Generator',
  description = 'Free online QR code generator with advanced customization options. Create QR codes for URLs, WiFi, contacts, and more.',
  url = 'https://goqrgen.com',
  applicationCategory = 'UtilitiesApplication',
  operatingSystem = 'Any',
  offers = { price: '0', priceCurrency: 'USD' }
}) => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    url,
    applicationCategory,
    operatingSystem,
    offers: {
      '@type': 'Offer',
      price: offers.price,
      priceCurrency: offers.priceCurrency
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250'
    },
    author: {
      '@type': 'Organization',
      name: 'GOQRGen',
      url: 'https://goqrgen.com'
    },
    datePublished: '2024-01-01',
    dateModified: new Date().toISOString().split('T')[0],
    inLanguage: 'en-US',
    isAccessibleForFree: true,
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '2.0.0',
    screenshot: 'https://goqrgen.com/assets/screenshot.png'
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default StructuredData;