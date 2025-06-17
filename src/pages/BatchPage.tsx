import React, { useState, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Trash2, Plus, Save, FileUp, FileDown } from 'lucide-react';
import { saveAs } from 'file-saver';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { v4 as uuidv4 } from 'uuid';
import { QRCodeCustomization, QRCodeType } from '../types/qrTypes';
import { useHistory } from '../contexts/HistoryContext';
import toast from 'react-hot-toast';

interface BatchItem {
  id: string;
  name: string;
  value: string;
  type: QRCodeType;
}

const BatchPage: React.FC = () => {
  const [items, setItems] = useState<BatchItem[]>([
    { id: uuidv4(), name: 'Website QR Code', value: 'https://example.com', type: 'url' },
    { id: uuidv4(), name: 'Contact QR Code', value: 'tel:+1234567890', type: 'phone' },
  ]);
  
  const [customization, setCustomization] = useState<QRCodeCustomization>({
    fgColor: '#6366F1',
    bgColor: '#FFFFFF',
    size: 200,
    includeMargin: true,
    level: 'M',
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { addToHistory } = useHistory();
  
  const addItem = () => {
    setItems([
      ...items,
      { id: uuidv4(), name: `QR Code ${items.length + 1}`, value: '', type: 'text' },
    ]);
  };
  
  const removeItem = (id: string) => {
    if (items.length <= 1) {
      toast.error('You must have at least one QR code');
      return;
    }
    setItems(items.filter(item => item.id !== id));
  };
  
  const updateItem = (id: string, field: keyof BatchItem, value: string) => {
    setItems(
      items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };
  
  const downloadAll = async () => {
    if (items.length === 0) {
      toast.error('No QR codes to download');
      return;
    }
    
    const emptyItems = items.filter(item => !item.value.trim());
    if (emptyItems.length > 0) {
      toast.error('Please fill in all QR code content before downloading');
      return;
    }
    
    try {
      setIsGenerating(true);
      
      const zip = new JSZip();
      const promises = items.map(async (item, index) => {
        try {
          const element = document.getElementById(`qr-${item.id}`);
          if (!element) {
            console.warn(`QR element not found for item ${item.id}`);
            return null;
          }
          
          const dataUrl = await toPng(element, {
            quality: 1.0,
            pixelRatio: 2,
          });
          const base64Data = dataUrl.split(',')[1];
          
          const fileName = `${item.name.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${index + 1}.png`;
          zip.file(fileName, base64Data, { base64: true });
          
          return { item, preview: dataUrl };
        } catch (error) {
          console.error(`Error generating QR code for ${item.name}:`, error);
          return null;
        }
      });
      
      const results = await Promise.all(promises);
      const successfulResults = results.filter(result => result !== null);
      
      if (successfulResults.length === 0) {
        throw new Error('Failed to generate any QR codes');
      }
      
      // Save to zip file
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      saveAs(zipBlob, `qr-codes-${new Date().toISOString().split('T')[0]}.zip`);
      
      // Add to history
      successfulResults.forEach(result => {
        if (result) {
          addToHistory({
            id: result.item.id,
            type: result.item.type,
            value: result.item.value,
            name: result.item.name,
            created: new Date().toISOString(),
            customization,
            preview: result.preview,
          });
        }
      });
      
      toast.success(`Successfully downloaded ${successfulResults.length} QR codes!`);
      
    } catch (error) {
      console.error('Error generating batch QR codes:', error);
      toast.error('Failed to generate QR codes. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const exportConfig = () => {
    try {
      const config = {
        items,
        customization,
        exportDate: new Date().toISOString(),
      };
      
      const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(config, null, 2))}`;
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute('href', dataStr);
      downloadAnchorNode.setAttribute('download', `qr-batch-config-${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      
      toast.success('Configuration exported successfully!');
    } catch (error) {
      console.error('Error exporting config:', error);
      toast.error('Failed to export configuration');
    }
  };
  
  const importConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.json')) {
      toast.error('Please select a valid JSON configuration file');
      e.target.value = '';
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const config = JSON.parse(event.target?.result as string);
        
        if (!config.items || !Array.isArray(config.items)) {
          throw new Error('Invalid configuration format: missing items array');
        }
        
        if (!config.customization || typeof config.customization !== 'object') {
          throw new Error('Invalid configuration format: missing customization object');
        }
        
        // Validate items structure
        const validItems = config.items.filter((item: any) => 
          item && 
          typeof item.id === 'string' && 
          typeof item.name === 'string' && 
          typeof item.value === 'string' && 
          typeof item.type === 'string'
        );
        
        if (validItems.length === 0) {
          throw new Error('No valid QR code items found in configuration');
        }
        
        setItems(validItems);
        setCustomization({ ...customization, ...config.customization });
        toast.success(`Successfully imported ${validItems.length} QR codes!`);
        
      } catch (error) {
        console.error('Error parsing config file:', error);
        const errorMessage = error instanceof Error ? error.message : 'Invalid configuration file format';
        toast.error(errorMessage);
      }
    };
    
    reader.onerror = () => {
      toast.error('Failed to read the configuration file');
    };
    
    reader.readAsText(file);
    
    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };
  
  const saveAllToHistory = () => {
    const emptyItems = items.filter(item => !item.value.trim());
    if (emptyItems.length > 0) {
      toast.error('Please fill in all QR code content before saving');
      return;
    }
    
    try {
      items.forEach(item => {
        addToHistory({
          id: item.id,
          type: item.type,
          value: item.value,
          name: item.name,
          created: new Date().toISOString(),
          customization,
        });
      });
      toast.success(`Saved ${items.length} QR codes to history!`);
    } catch (error) {
      console.error('Error saving to history:', error);
      toast.error('Failed to save QR codes to history');
    }
  };
  
  return (
    <div className="animate-fadeIn">
      <Helmet>
        <title>Batch QR Code Generator | Create Multiple QR Codes | GOQRGen</title>
        <meta name="description" content="Create hundreds of QR codes in one go! Use our Batch QR Code Generator for fast, bulk QR code creation no design skills needed!" />
        <link rel="canonical" href="https://goqrgen.com/batch" />
      </Helmet>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Batch QR Code Generator
        </h1>
        
        <div className="flex space-x-2">
          <label className="cursor-pointer bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors">
            <FileUp className="w-5 h-5 mr-2" />
            Import
            <input
              type="file"
              accept=".json"
              onChange={importConfig}
              className="hidden"
            />
          </label>
          
          <button
            onClick={exportConfig}
            className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors"
            disabled={items.length === 0}
          >
            <FileDown className="w-5 h-5 mr-2" />
            Export
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              QR Codes ({items.length})
            </h2>
            
            <div className="space-y-4" ref={containerRef}>
              {items.map((item, index) => (
                <div 
                  key={item.id} 
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white">
                      QR Code #{index + 1}
                    </h3>
                    
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1 rounded transition-colors"
                      disabled={items.length <= 1}
                      title={items.length <= 1 ? "Cannot remove the last QR code" : "Remove QR code"}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Name
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateItem(item.id, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                        placeholder="QR Code Name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Type
                      </label>
                      <select
                        value={item.type}
                        onChange={(e) => updateItem(item.id, 'type', e.target.value as QRCodeType)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      >
                        <option value="url">URL</option>
                        <option value="text">Text</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="sms">SMS</option>
                        <option value="wifi">WiFi</option>
                        <option value="vcard">Contact</option>
                        <option value="event">Event</option>
                        <option value="geolocation">Location</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Content
                    </label>
                    <textarea
                      value={item.value}
                      onChange={(e) => updateItem(item.id, 'value', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter QR code content"
                    />
                  </div>
                  
                  {/* Hidden QR code for generation */}
                  <div 
                    id={`qr-${item.id}`}
                    className="hidden bg-white p-4 rounded-lg"
                    style={{ width: customization.size + 32, height: customization.size + 32 }}
                  >
                    <QRCodeCanvas
                      value={item.value || 'Empty'}
                      size={customization.size}
                      fgColor={customization.fgColor}
                      bgColor={customization.bgColor}
                      level={customization.level}
                      includeMargin={customization.includeMargin}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <button
              onClick={addItem}
              className="mt-4 w-full py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg flex items-center justify-center transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Another QR Code
            </button>
          </div>
        </div>
        
        <div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
              Preview & Options
            </h2>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Global Style
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Foreground Color
                    </label>
                    <input
                      type="color"
                      value={customization.fgColor}
                      onChange={(e) => setCustomization({ ...customization, fgColor: e.target.value })}
                      className="w-full h-8 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                      Background Color
                    </label>
                    <input
                      type="color"
                      value={customization.bgColor}
                      onChange={(e) => setCustomization({ ...customization, bgColor: e.target.value })}
                      className="w-full h-8 rounded-md border border-gray-300 dark:border-gray-600 cursor-pointer"
                    />
                  </div>
                </div>
                
                <div className="mt-3">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Size: {customization.size}px
                  </label>
                  <input
                    type="range"
                    min="128"
                    max="300"
                    step="8"
                    value={customization.size}
                    onChange={(e) => setCustomization({ ...customization, size: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
                
                <div className="mt-3">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Error Correction
                  </label>
                  <select
                    value={customization.level}
                    onChange={(e) => setCustomization({ ...customization, level: e.target.value as 'L' | 'M' | 'Q' | 'H' })}
                    className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="L">Low (7%)</option>
                    <option value="M">Medium (15%)</option>
                    <option value="Q">Quartile (25%)</option>
                    <option value="H">High (30%)</option>
                  </select>
                </div>
                
                <div className="mt-3 flex items-center">
                  <input
                    type="checkbox"
                    id="includeMargin"
                    checked={customization.includeMargin}
                    onChange={(e) => setCustomization({ ...customization, includeMargin: e.target.checked })}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label htmlFor="includeMargin" className="ml-2 block text-xs text-gray-500 dark:text-gray-400">
                    Include Margin
                  </label>
                </div>
              </div>
              
              {/* Preview section */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Preview
                </h3>
                
                <div className="grid grid-cols-2 gap-4">
                  {items.slice(0, 2).map((item) => (
                    <div 
                      key={item.id}
                      className="bg-white p-2 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center justify-center">
                        <QRCodeCanvas
                          value={item.value || 'Empty'}
                          size={Math.min(120, customization.size)}
                          fgColor={customization.fgColor}
                          bgColor={customization.bgColor}
                          level={customization.level}
                          includeMargin={customization.includeMargin}
                        />
                      </div>
                      <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400 truncate">
                        {item.name}
                      </p>
                    </div>
                  ))}
                </div>
                
                {items.length > 2 && (
                  <p className="text-xs text-center mt-2 text-gray-500 dark:text-gray-400">
                    +{items.length - 2} more QR codes
                  </p>
                )}
              </div>
              
              <button
                onClick={downloadAll}
                disabled={isGenerating || items.some(item => !item.value.trim()) || items.length === 0}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin -ml-1 mr-3 h-5 w-5 text-white">
                      <div className="border-2 border-white border-t-transparent rounded-full w-full h-full" />
                    </div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5 mr-2" />
                    Download All ({items.length} QR Codes)
                  </>
                )}
              </button>
              
              <button
                onClick={saveAllToHistory}
                disabled={items.some(item => !item.value.trim()) || items.length === 0}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5 mr-2" />
                Save All to History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchPage;