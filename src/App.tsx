import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from './contexts/ThemeContext';
import { HistoryProvider } from './contexts/HistoryContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import GeneratorPage from './pages/GeneratorPage';
import HistoryPage from './pages/HistoryPage';
import ScannerPage from './pages/ScannerPage';
import BatchPage from './pages/BatchPage';
import AboutPage from './pages/AboutPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TermsPage from './pages/TermsPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// SEO and Performance Components
import StructuredData from './components/seo/StructuredData';
import BreadcrumbSchema from './components/seo/BreadcrumbSchema';
import GoogleAnalytics from './components/analytics/GoogleAnalytics';
import ServiceWorker from './components/performance/ServiceWorker';
import FeedbackWidget from './components/feedback/FeedbackWidget';
import SkipToContent from './components/accessibility/SkipToContent';

function App() {
  const helmetContext = {};

  return (
    <HelmetProvider context={helmetContext}>
      <ThemeProvider>
        <HistoryProvider>
          <Router>
            <SkipToContent />
            <StructuredData />
            <BreadcrumbSchema />
            <GoogleAnalytics trackingId="GA_MEASUREMENT_ID" />
            <ServiceWorker />
            
            <Layout>
              <main id="main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/generator" element={<GeneratorPage />} />
                  <Route path="/history" element={<HistoryPage />} />
                  <Route path="/scanner" element={<ScannerPage />} />
                  <Route path="/batch" element={<BatchPage />} />
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/404" element={<NotFoundPage />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </main>
            </Layout>
            
            <FeedbackWidget />
          </Router>
        </HistoryProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;