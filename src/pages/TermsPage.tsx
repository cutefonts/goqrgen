import React from 'react';
import { Helmet } from 'react-helmet-async';

const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <Helmet>
        <title>Terms of Service | GOQRGen QR Code Generator</title>
        <meta name="description" content="Read GOQRGen's terms of service to understand the guidelines for using our QR code generation platform. Learn about user responsibilities and service limitations." />
        <link rel="canonical" href="https://goqrgen.com/terms" />
      </Helmet>

      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Terms of Service
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Last updated: March 15, 2024
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Please read these Terms of Service carefully before using GOQRGen's website and services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Acceptance of Terms
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            By accessing or using our service, you agree to be bound by these Terms. 
            If you disagree with any part of the terms, you may not access the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Use of Service
          </h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
            <li>You must use the service in compliance with all applicable laws</li>
            <li>You are responsible for all content generated through your use of the service</li>
            <li>You agree not to use the service for any illegal or unauthorized purpose</li>
            <li>You must not transmit any malicious code or attempt to harm the service</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Intellectual Property
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            The service and its original content, features, and functionality are owned by 
            GOQRGen and are protected by international copyright, trademark, patent, trade 
            secret, and other intellectual property laws.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Limitation of Liability
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            GOQRGen shall not be liable for any indirect, incidental, special, consequential, 
            or punitive damages resulting from your use or inability to use the service.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Changes to Terms
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We reserve the right to modify or replace these Terms at any time. We will provide 
            notice of any changes by posting the new Terms on this page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            If you have any questions about these Terms, please contact us through our Contact page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;