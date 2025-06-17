import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Image, Palette, Share, History as HistoryIcon, Edit } from 'lucide-react';
import { saveAs } from 'file-saver';
import { toPng, toJpeg, toSvg } from 'html-to-image';
import { QRCodeData, QRCodeType, QRCodeCustomization } from '../types/qrTypes';
import { useHistory } from '../contexts/HistoryContext';
import QRCodeTypeSelector from '../components/generator/QRCodeTypeSelector';
import QRCodeContentEditor from '../components/generator/QRCodeContentEditor';
import QRCodeCustomizer from '../components/generator/QRCodeCustomizer';
import DevicePreview from '../components/generator/DevicePreview';

const GeneratorPage: React.FC = () => {
  const [qrType, setQrType] = useState<QRCodeType>('url');
  const [qrValue, setQrValue] = useState('https://example.com');
  const [qrName, setQrName] = useState('My QR Code');
  const [customization, setCustomization] = useState<QRCodeCustomization>({
    fgColor: '#6366F1',
    bgColor: '#FFFFFF',
    size: 256,
    includeMargin: true,
    level: 'M',
    cornerRadius: 0,
    style: 'squares',
  });
  
  const [activeTab, setActiveTab] = useState<'content' | 'customize'>('content');
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  
  const qrRef = useRef<HTMLDivElement>(null);
  const { addToHistory } = useHistory();

  useEffect(() => {
    if (qrType === 'url' && !qrValue.startsWith('http')) {
      setQrValue('https://example.com');
    }
  }, [qrType, qrValue]);

  useEffect(() => {
    const typeToDefaultName: Record<QRCodeType, string> = {
      url: 'Website QR Code',
      text: 'Text QR Code',
      email: 'Email QR Code',
      phone: 'Phone QR Code',
      sms: 'SMS QR Code',
      wifi: 'WiFi QR Code',
      vcard: 'Contact QR Code',
      event: 'Event QR Code',
      geolocation: 'Location QR Code',
    };
    
    setQrName(typeToDefaultName[qrType] || 'My QR Code');
  }, [qrType]);

  const handleDownload = async (format: 'png' | 'jpeg' | 'svg') => {
    if (!qrRef.current) return;

    try {
      let dataUrl;
      const fileName = `${qrName.replace(/\s+/g, '-').toLowerCase()}.${format}`;
      
      switch (format) {
        case 'png':
          dataUrl = await toPng(qrRef.current);
          saveAs(dataUrl, fileName);
          break;
        case 'jpeg':
          dataUrl = await toJpeg(qrRef.current);
          saveAs(dataUrl, fileName);
          break;
        case 'svg':
          dataUrl = await toSvg(qrRef.current);
          saveAs(dataUrl, fileName);
          break;
      }

      const qrData: QRCodeData = {
        id: Date.now().toString(),
        type: qrType,
        value: qrValue,
        name: qrName,
        created: new Date().toISOString(),
        customization,
        preview: dataUrl,
      };
      
      addToHistory(qrData);
    } catch (error) {
      console.error('Failed to download QR code:', error);
    }
  };

  const handleShare = async () => {
    if (!qrRef.current) return;
    
    try {
      const dataUrl = await toPng(qrRef.current);
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'qrcode.png', { type: 'image/png' });
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: qrName,
            files: [file],
          });
        } catch (shareError) {
          await copyToClipboard();
        }
      } else {
        await copyToClipboard();
      }
    } catch (error) {
      console.error('Failed to share QR code:', error);
      alert('Failed to share QR code. Please try again.');
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      alert('QR code content copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy to clipboard');
    }
  };

  const saveToHistory = async () => {
    if (!qrRef.current) return;
    
    try {
      const dataUrl = await toPng(qrRef.current);
      
      const qrData: QRCodeData = {
        id: Date.now().toString(),
        type: qrType,
        value: qrValue,
        name: qrName,
        created: new Date().toISOString(),
        customization,
        preview: dataUrl,
      };
      
      addToHistory(qrData);
      alert('QR code saved to history!');
    } catch (error) {
      console.error('Failed to save QR code to history:', error);
    }
  };

  return (
    <div className="animate-fadeIn">
      <Helmet>
        <title>QR Code Generator | Create QR Codes for Free</title>
        <meta name="description" content="Generate custom QR codes for URLs, text, Wi-Fi, vCards, and more with GOQRGen's free QR Code Generator. Fast, easy, and no signup required!" />
        <link rel="canonical" href="https://goqrgen.com/generator" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        QR Code Generator
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex mb-4 border-b dark:border-gray-700">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'content'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('content')}
            >
              <Edit className="inline-block w-4 h-4 mr-2" />
              Content
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'customize'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
              onClick={() => setActiveTab('customize')}
            >
              <Palette className="inline-block w-4 h-4 mr-2" />
              Customize
            </button>
          </div>

          {activeTab === 'content' ? (
            <>
              <div className="mb-6">
                <label htmlFor="qrName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  QR Code Name
                </label>
                <input
                  type="text"
                  id="qrName"
                  value={qrName}
                  onChange={(e) => setQrName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Enter a name for your QR code"
                />
              </div>
              
              <QRCodeTypeSelector 
                selectedType={qrType} 
                onSelectType={setQrType} 
              />
              
              <QRCodeContentEditor 
                type={qrType} 
                value={qrValue} 
                onChange={setQrValue} 
              />
            </>
          ) : (
            <QRCodeCustomizer 
              customization={customization} 
              onChange={setCustomization} 
            />
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 flex flex-col">
          <div className="text-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Preview</h2>
          </div>
          
          <div 
            ref={qrRef}
            className={`mx-auto p-6 rounded-lg bg-white flex items-center justify-center transition-all duration-300 ${
              isPreviewExpanded ? 'scale-110' : ''
            }`}
            style={{ 
              width: customization.size + 48, 
              height: customization.size + 48 
            }}
          >
            <QRCodeCanvas
              value={qrValue}
              size={customization.size}
              fgColor={customization.fgColor}
              bgColor={customization.bgColor}
              level={customization.level}
              includeMargin={customization.includeMargin}
              renderAs="canvas"
            />
          </div>
          
          <button
            className="text-sm text-purple-600 dark:text-purple-400 mt-2 hover:underline"
            onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
          >
            {isPreviewExpanded ? 'Shrink preview' : 'Expand preview'}
          </button>
          
          <DevicePreview qrValue={qrValue} customization={customization} />
          
          <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
            <div className="dropdown col-span-2">
              <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors">
                <Download className="w-5 h-5 mr-2" />
                Download
              </button>
              <div className="dropdown-content hidden absolute mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-10">
                {['png', 'jpeg', 'svg'].map((format) => (
                  <button
                    key={format}
                    onClick={() => handleDownload(format as 'png' | 'jpeg' | 'svg')}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    {format.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleShare}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
            >
              <Share className="w-5 h-5 mr-2" />
              Share
            </button>
            
            <button
              onClick={saveToHistory}
              className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
            >
              <HistoryIcon className="w-5 h-5 mr-2" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratorPage;