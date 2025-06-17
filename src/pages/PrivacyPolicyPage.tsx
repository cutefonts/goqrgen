import React from 'react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      <Helmet>
        <title>Privacy Policy | GOQRGen QR Code Generator</title>
        <meta name="description" content="Review GOQRGen's privacy policy to understand how we protect your data while using our QR code generation services. Learn about our commitment to user privacy and data security." />
        <link rel="canonical" href="https://goqrgen.com/privacy" />
      </Helmet>

      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Privacy Policy
      </h1>

      <div className="prose dark:prose-invert max-w-none">
        <section className="mb-8">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Last updated: March 15, 2024
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            This Privacy Policy describes how GOQRGen ("we," "us," or "our") collects, uses, 
            and protects your personal information when you use our website and services.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Information We Collect
          </h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
            <li>QR code content and customization preferences</li>
            <li>Usage data and analytics</li>
            <li>Device and browser information</li>
            <li>Email address (if you subscribe to our newsletter)</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            How We Use Your Information
          </h2>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 space-y-2">
            <li>To provide and improve our services</li>
            <li>To send you updates and newsletters (with your consent)</li>
            <li>To analyze and improve our website performance</li>
            <li>To respond to your inquiries and support requests</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Data Security
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We implement appropriate security measures to protect your personal information 
            against unauthorized access, alteration, disclosure, or destruction. However, 
            no method of transmission over the Internet is 100% secure.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Your Rights
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            You have the right to access, correct, or delete your personal information. 
            You can also opt out of receiving marketing communications at any time.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Contact Us
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            If you have any questions about this Privacy Policy, please contact us through 
            our Contact page.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;