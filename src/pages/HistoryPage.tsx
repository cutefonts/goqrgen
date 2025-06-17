import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from '../contexts/HistoryContext';
import { QRCodeCanvas } from 'qrcode.react';
import { Trash2, Download, Search, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { saveAs } from 'file-saver';
import { toPng } from 'html-to-image';

const HistoryPage: React.FC = () => {
  const { history, clearHistory, removeFromHistory } = useHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [detailsId, setDetailsId] = useState<string | null>(null);
  
  const filteredHistory = history.filter(item => 
    (item?.name || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (item?.value || '').toLowerCase().includes((searchTerm || '').toLowerCase()) ||
    (item?.type || '').toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const handleDownload = async (id: string) => {
    const qrItem = history.find(item => item?.id === id);
    if (!qrItem) return;
    
    if (qrItem.preview) {
      saveAs(qrItem.preview, `${(qrItem.name || 'qr-code').replace(/\s+/g, '-').toLowerCase()}.png`);
    } else {
      const qrElement = document.getElementById(`qr-${id}`);
      if (qrElement) {
        try {
          const dataUrl = await toPng(qrElement);
          saveAs(dataUrl, `${(qrItem.name || 'qr-code').replace(/\s+/g, '-').toLowerCase()}.png`);
        } catch (error) {
          console.error('Error generating QR code image:', error);
        }
      }
    }
  };

  const toggleDetails = (id: string) => {
    setDetailsId(detailsId === id ? null : id);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getTypeLabel = (type: string): string => {
    const typeLabels: Record<string, string> = {
      url: 'URL',
      text: 'Text',
      email: 'Email',
      phone: 'Phone',
      sms: 'SMS',
      wifi: 'WiFi',
      vcard: 'Contact',
      event: 'Event',
      geolocation: 'Location',
    };
    
    return typeLabels[type] || type;
  };

  return (
    <div className="animate-fadeIn">
      <Helmet>
        <title>QR Code History | View & Manage Your QR Codes</title>
        <meta name="description" content="Access your QR code history and manage all your generated QR codes in one place. Track usage, edit details, and organize your QR codes easily." />
        <link rel="canonical" href="https://goqrgen.com/history" />
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">History</h1>
        
        <button
          onClick={clearHistory}
          className="bg-red-100 text-red-600 hover:bg-red-200 px-4 py-2 rounded-lg flex items-center transition-colors dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
          disabled={history.length === 0}
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear History
        </button>
      </div>
      
      {history.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <Info className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">No QR Codes Yet</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Your generated QR codes will appear here. Start by creating a new QR code.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search your QR codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
            />
          </div>
          
          <div className="grid gap-4">
            {filteredHistory.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-8 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                  No QR codes match your search. Try different keywords.
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
                >
                  <div className="p-4 flex items-center">
                    <div 
                      id={`qr-${item.id}`}
                      className="bg-white p-2 rounded-md mr-4 flex-shrink-0"
                      style={{ width: 80, height: 80 }}
                    >
                      <QRCodeCanvas
                        value={item.value || ''}
                        size={60}
                        fgColor={item.customization?.fgColor || '#000000'}
                        bgColor={item.customization?.bgColor || '#FFFFFF'}
                        level={item.customization?.level || 'M'}
                        includeMargin={item.customization?.includeMargin || false}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white truncate">
                        {item.name || 'Untitled QR Code'}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 text-xs rounded px-2 py-0.5 mr-2">
                          {getTypeLabel(item.type)}
                        </span>
                        <span className="truncate">
                          {formatDate(item.created)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                        {item.value || 'No content'}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => handleDownload(item.id)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        title="Download"
                      >
                        <Download className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => removeFromHistory(item.id)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => toggleDetails(item.id)}
                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        title="Details"
                      >
                        {detailsId === item.id ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  {detailsId === item.id && (
                    <div className="px-4 pb-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Content
                          </h4>
                          <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg break-all text-sm text-gray-600 dark:text-gray-400">
                            {item.value || 'No content'}
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Customization
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center">
                              <span className="w-4 h-4 rounded mr-2" style={{ backgroundColor: item.customization?.fgColor || '#000000' }}></span>
                              <span className="text-gray-600 dark:text-gray-400">Foreground</span>
                            </div>
                            <div className="flex items-center">
                              <span className="w-4 h-4 rounded mr-2" style={{ backgroundColor: item.customization?.bgColor || '#FFFFFF' }}></span>
                              <span className="text-gray-600 dark:text-gray-400">Background</span>
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                              Size: {item.customization?.size || 200}px
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                              Error correction: {item.customization?.level || 'M'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default HistoryPage;