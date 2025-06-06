import React from 'react';
import { Helmet } from 'react-helmet-async';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <Helmet>
        <title>About GOQRGen | Leading QR Code Solution Provider</title>
        <meta name="description" content="Learn about GOQRGen's mission to provide the best QR code solutions. Discover our commitment to innovation, security, and user-friendly QR code generation tools." />
        <link rel="canonical" href="https://goqrgen.com/about" />
      </Helmet>

      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        About GOQRGen
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            GOQRGen was founded with a simple yet powerful mission: to make QR code generation accessible, 
            professional, and efficient for everyone. We believe in the power of connecting the physical 
            and digital worlds through innovative technology.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            What Sets Us Apart
          </h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
            <li>Advanced customization options for professional-looking QR codes</li>
            <li>User-friendly interface designed for both beginners and experts</li>
            <li>Robust error correction and validation features</li>
            <li>Secure and reliable QR code generation</li>
            <li>Support for multiple QR code formats and content types</li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Our Technology
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We use cutting-edge technology to ensure our QR codes are fast to generate, 
            reliable to scan, and maintain the highest quality standards. Our platform 
            is built with modern web technologies and follows international QR code standards.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Looking Forward
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We're constantly working to improve our service and add new features based on user feedback. 
            Our goal is to remain at the forefront of QR code technology while maintaining the simplicity 
            and reliability our users expect.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;