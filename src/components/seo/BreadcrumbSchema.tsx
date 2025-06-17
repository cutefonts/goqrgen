import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  name: string;
  url: string;
}

const BreadcrumbSchema: React.FC = () => {
  const location = useLocation();
  
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x);
    const breadcrumbs: BreadcrumbItem[] = [
      { name: 'Home', url: 'https://goqrgen.com' }
    ];

    const routeNames: Record<string, string> = {
      generator: 'QR Code Generator',
      scanner: 'QR Code Scanner',
      batch: 'Batch Generator',
      history: 'History',
      about: 'About',
      contact: 'Contact',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service'
    };

    pathnames.forEach((pathname, index) => {
      const url = `https://goqrgen.com/${pathnames.slice(0, index + 1).join('/')}`;
      const name = routeNames[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);
      breadcrumbs.push({ name, url });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  if (breadcrumbs.length <= 1) return null;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((breadcrumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: breadcrumb.name,
      item: breadcrumb.url
    }))
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
};

export default BreadcrumbSchema;