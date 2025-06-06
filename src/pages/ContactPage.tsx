import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Send, Mail, MapPin, Phone } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    // Show success message
    toast.success('Message sent successfully! We will get back to you soon.');
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 animate-fadeIn">
      <Helmet>
        <title>Contact GOQRGen | Get Support & Assistance</title>
        <meta name="description" content="Need help with QR codes? Contact our support team for assistance with QR code generation, customization, or technical issues. We're here to help you succeed." />
        <link rel="canonical" href="https://goqrgen.com/contact" />
      </Helmet>

      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
        Contact Us
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Get in Touch
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              Contact Information
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-4 mt-1" />
                <div>
                  <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                    Email
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    goqrgen@gmail.com
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-4 mt-1" />
                <div>
                  <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                    Address
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Gonda<br />
                    Uttar Pradesh<br />
                    India
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="w-6 h-6 text-purple-600 dark:text-purple-400 mr-4 mt-1" />
                <div>
                  <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                    Phone
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    +1 (555) 123-4567
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
              FAQ
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-2">
                  What is your response time?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We typically respond to inquiries within 24-48 business hours.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-2">
                  Do you offer custom solutions?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, we can provide customized QR code solutions for businesses.
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-2">
                  Is technical support available?
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, our technical support team is available during business hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;