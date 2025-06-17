import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  QrCode, Scan, Layers, History, ArrowRight, 
  Zap, Shield, Globe, Palette, BarChart, Download,
  CheckCircle, PlusCircle, Settings, Share2,
  ChevronDown, ChevronUp, ArrowUp
} from 'lucide-react';

const HomePage: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const features = [
    {
      title: 'QR Code Generator',
      description: 'Create custom QR codes for URLs, text, WiFi networks, and more with advanced styling options.',
      icon: QrCode,
      path: '/generator',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      title: 'QR Code Scanner',
      description: 'Scan QR codes using your device camera and instantly access the encoded information.',
      icon: Scan,
      path: '/scanner',
      color: 'from-teal-500 to-emerald-600',
    },
    {
      title: 'Batch Generation',
      description: 'Generate multiple QR codes at once for efficient bulk creation and management.',
      icon: Layers,
      path: '/batch',
      color: 'from-amber-500 to-orange-600',
    },
    {
      title: 'History',
      description: 'Access your previously generated QR codes for quick reference and reuse.',
      icon: History,
      path: '/history',
      color: 'from-blue-500 to-cyan-600',
    },
  ];

  const advancedFeatures = [
    {
      icon: Palette,
      title: 'Advanced Customization',
      description: 'Customize colors, patterns, and add logos to create unique QR codes that match your brand.',
    },
    {
      icon: Shield,
      title: 'Error Correction',
      description: 'Built-in error correction ensures your QR codes remain scannable even if partially damaged.',
    },
    {
      icon: BarChart,
      title: 'Analytics & Tracking',
      description: 'Track scans, analyze user behavior, and measure the performance of your QR codes.',
    },
    {
      icon: Download,
      title: 'Multiple Formats',
      description: 'Export your QR codes in various formats including PNG, SVG, and JPEG with custom resolutions.',
    },
    {
      icon: Share2,
      title: 'Easy Sharing',
      description: 'Share your QR codes directly or download them for use in your marketing materials.',
    },
    {
      icon: Settings,
      title: 'API Access',
      description: 'Generate QR codes programmatically using our robust API for seamless integration.',
    },
  ];

  const tools = [
    {
      icon: PlusCircle,
      title: 'Template Library',
      description: 'Choose from a variety of pre-designed templates for quick and professional QR codes.',
    },
    {
      icon: Globe,
      title: 'Dynamic QR Codes',
      description: 'Create QR codes with updatable content without regenerating the code.',
    },
    {
      icon: Zap,
      title: 'Bulk Operations',
      description: 'Generate, customize, and manage multiple QR codes simultaneously.',
    },
    {
      icon: CheckCircle,
      title: 'Validation Tools',
      description: 'Verify the quality and scannability of your QR codes before deployment.',
    },
  ];

  const faqs = [
    {
      question: 'What types of QR codes can I create?',
      answer: 'You can create QR codes for websites, plain text, contact information (vCard), WiFi networks, phone numbers, SMS messages, email addresses, calendar events, and geographic locations.',
    },
    {
      question: 'Are the QR codes free to use?',
      answer: 'Yes, basic QR code generation is completely free. Advanced features like analytics and dynamic QR codes may require a premium subscription.',
    },
    {
      question: 'Can I customize the appearance of my QR codes?',
      answer: 'Absolutely! You can customize colors, patterns, add logos, and choose from various styles while maintaining scannability.',
    },
    {
      question: 'How do I ensure my QR code is scannable?',
      answer: 'Our built-in validation tool checks the quality and scannability of your QR codes. We also provide best practices and guidelines for optimal scanning.',
    },
    {
      question: 'Can I track QR code scans?',
      answer: 'Yes, our analytics feature allows you to track the number of scans, unique visitors, and other metrics for your QR codes.',
    },
    {
      question: 'What file formats are supported?',
      answer: 'You can download your QR codes in PNG, SVG, and JPEG formats. Each format is optimized for different use cases.',
    },
    {
      question: 'Is there a limit to the number of QR codes I can create?',
      answer: 'Free users can create up to 50 QR codes per month. Premium users have unlimited QR code generation.',
    },
    {
      question: 'Can I update QR code content after creation?',
      answer: 'Yes, with dynamic QR codes you can update the content without changing the QR code itself.',
    },
  ];

  return (
    <div className="animate-fadeIn">
      <Helmet>
        <title>QR Code Generator | Create Custom QR Codes Online | GOQRGen</title>
        <meta name="description" content="Create custom QR codes in seconds! Free, fast & easy QR Code Generator for all your needs at GOQRGen. No sign-up required. Try it now!" />
        <link rel="canonical" href="https://goqrgen.com/" />
      </Helmet>

      {/* Hero Section */}
      <section className="text-center py-12 px-4 sm:px-6 lg:px-8 rounded-3xl bg-gradient-to-br from-purple-600 to-blue-500 text-white mb-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Custom QR Code Generator
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-purple-100">
            Create & Scan QR codes for links, WiFi, email, contacts & more Fast and free!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/generator"
              className="px-8 py-3 bg-white text-purple-700 rounded-lg shadow-lg font-medium text-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              Create QR Code
            </Link>
            <Link
              to="/scanner"
              className="px-8 py-3 bg-purple-800 bg-opacity-40 text-white rounded-lg font-medium text-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              Scan QR Code
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
          Generate Your Free QR Code Now
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg group"
            >
              <div className="p-6">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.color} mb-4`}>
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {feature.description}
                </p>
                <Link
                  to={feature.path}
                  className="inline-flex items-center text-sm font-medium text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900 rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Advanced Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {advancedFeatures.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
                <feature.icon className="h-8 w-8 text-purple-600 dark:text-purple-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Professional Tools
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tools.map((tool, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md text-center">
                <tool.icon className="h-12 w-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                  {tool.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {tool.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-12 bg-gradient-to-br from-purple-600 to-blue-500 rounded-3xl text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose GOQRGen?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
              <p className="text-purple-100">
                Generate QR codes instantly with our optimized platform
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure & Reliable</h3>
              <p className="text-purple-100">
                Your data is safe with our encrypted infrastructure
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Globe className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Standard</h3>
              <p className="text-purple-100">
                Compliant with international QR code standards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-white">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex justify-between items-center"
                >
                  <span className="font-medium text-gray-800 dark:text-white">
                    {faq.question}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </button>
                <div
                  className={`px-6 transition-all duration-200 ease-in-out ${
                    expandedFaq === index ? 'py-4' : 'h-0 overflow-hidden'
                  }`}
                >
                  <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 text-center">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 shadow-xl">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to create your first QR code?</h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Start generating professional QR codes for your business, events, or personal use.
          </p>
          <Link
            to="/generator"
            className="inline-flex items-center px-6 py-3 bg-white text-purple-700 rounded-lg shadow-lg font-medium text-lg transition-transform hover:scale-105 focus:outline-none"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 bg-purple-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 ${
          showBackToTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
        }`}
        aria-label="Back to top"
      >
        <ArrowUp className="h-6 w-6" />
      </button>
    </div>
  );
};

export default HomePage;