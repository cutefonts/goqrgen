import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Camera, Upload, Copy, Link, RefreshCw, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const ScannerPage: React.FC = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        
        // Get list of available cameras
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setCameras(videoDevices);
        
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
        
        // Stop the stream we just created for the permission check
        stream.getTracks().forEach(track => track.stop());
        
      } catch (err) {
        console.error('Camera permission error:', err);
        setHasCameraPermission(false);
        setError('Camera access was denied. Please grant permission to use the scanner.');
      }
    };
    
    checkCameraPermission();
    
    // Cleanup on unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, []);
  
  // Start scanning
  const startScanner = async () => {
    if (!selectedCamera) {
      setError('No camera selected. Please select a camera and try again.');
      return;
    }
    
    try {
      setScanning(true);
      setError(null);
      setResult(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          deviceId: selectedCamera,
          facingMode: 'environment' // Prefer back camera on mobile
        }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      // Start scanning after video is ready
      setTimeout(() => {
        startScanningLoop();
      }, 500);
      
    } catch (err) {
      console.error('Error starting scanner:', err);
      setError('Failed to start the camera. Please make sure you have granted camera permissions.');
      setScanning(false);
    }
  };

  const startScanningLoop = async () => {
    try {
      const jsQR = (await import('jsqr')).default;
      
      const scanQRCode = () => {
        if (!videoRef.current || !canvasRef.current || !streamRef.current || !scanning) {
          return;
        }
        
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        if (context && video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.height = video.videoHeight;
          canvas.width = video.videoWidth;
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code && code.data) {
            setResult(code.data);
            stopScanner();
            toast.success('QR code scanned successfully!');
            return;
          }
        }
      };
      
      // Use interval instead of requestAnimationFrame for better performance
      scanIntervalRef.current = window.setInterval(scanQRCode, 100);
      
    } catch (err) {
      console.error('Error loading QR scanner:', err);
      setError('Failed to load QR scanner. Please try again.');
      setScanning(false);
    }
  };
  
  // Stop scanning
  const stopScanner = () => {
    setScanning(false);
    
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };
  
  // Reset the scanner
  const resetScanner = () => {
    setResult(null);
    setError(null);
    if (!scanning) {
      startScanner();
    }
  };
  
  // Copy result to clipboard
  const copyToClipboard = async () => {
    if (result) {
      try {
        await navigator.clipboard.writeText(result);
        toast.success('QR code content copied to clipboard!');
      } catch (err) {
        console.error('Failed to copy:', err);
        toast.error('Failed to copy to clipboard');
      }
    }
  };
  
  // Open URL if the result is a valid URL
  const openUrl = () => {
    if (result && (result.startsWith('http://') || result.startsWith('https://'))) {
      window.open(result, '_blank', 'noopener,noreferrer');
    }
  };
  
  // Check if result is a URL
  const isUrl = (text: string) => {
    return text.startsWith('http://') || text.startsWith('https://');
  };
  
  // Handle file upload for QR code scanning
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setError(null);
      setResult(null);
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        throw new Error('Please upload an image file');
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('File size should be less than 5MB');
      }
      
      // Create an image from the file
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      img.src = objectUrl;
      
      img.onload = async () => {
        try {
          // Draw the image to a canvas
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          if (!context) {
            throw new Error('Could not process the image');
          }
          
          canvas.width = img.width;
          canvas.height = img.height;
          context.drawImage(img, 0, 0);
          
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          
          const jsQR = (await import('jsqr')).default;
          
          // Scan for QR code
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          
          if (code && code.data) {
            setResult(code.data);
            toast.success('QR code scanned successfully!');
          } else {
            throw new Error('No QR code found in the image');
          }
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : 'Failed to process the image';
          setError(errorMessage);
          toast.error(errorMessage);
        } finally {
          // Clean up
          URL.revokeObjectURL(objectUrl);
        }
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        const errorMessage = 'Failed to load the image';
        setError(errorMessage);
        toast.error(errorMessage);
      };
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      toast.error(errorMessage);
    }
    
    // Reset the input value
    e.target.value = '';
  };
  
  return (
    <div className="animate-fadeIn">
      <Helmet>
        <title>QR Code Scanner | Scan QR Codes Online</title>
        <meta name="description" content="Scan any QR code directly from your smartphone or desktop browser. Try our free online QR code scanner no downloads or installation needed." />
        <link rel="canonical" href="https://goqrgen.com/scanner" />
      </Helmet>

      <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
        QR Code Scanner
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          {hasCameraPermission === false ? (
            <div className="text-center p-8">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Camera Access Denied
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Please allow camera access in your browser settings to use the QR code scanner.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              {cameras.length > 0 && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Select Camera
                  </label>
                  <select
                    value={selectedCamera}
                    onChange={(e) => setSelectedCamera(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                    disabled={scanning}
                  >
                    {cameras.map((camera, index) => (
                      <option key={camera.deviceId} value={camera.deviceId}>
                        {camera.label || `Camera ${index + 1}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-4">
                {scanning ? (
                  <>
                    <video
                      ref={videoRef}
                      className="absolute inset-0 w-full h-full object-cover"
                      muted
                      playsInline
                      autoPlay
                    ></video>
                    <div className="absolute inset-0 border-[3px] border-white border-opacity-60 rounded-lg"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-purple-500 border-opacity-70 rounded-lg"></div>
                    </div>
                    <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm">
                      Scanning...
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Camera className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <canvas ref={canvasRef} className="hidden"></canvas>
              </div>
              
              <div className="flex space-x-3">
                {!scanning ? (
                  <button
                    onClick={startScanner}
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                    disabled={!selectedCamera}
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Start Scanner
                  </button>
                ) : (
                  <button
                    onClick={stopScanner}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Stop Scanner
                  </button>
                )}
                
                <label className="cursor-pointer flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-colors">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
                  <p className="flex items-start">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </p>
                </div>
              )}
            </>
          )}
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Scan Result
          </h2>
          
          {result ? (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Content
                </h3>
                <div className="break-all text-gray-800 dark:text-white">
                  {result}
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center transition-colors"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </button>
                
                {isUrl(result) && (
                  <button
                    onClick={openUrl}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg flex items-center transition-colors"
                  >
                    <Link className="w-4 h-4 mr-2" />
                    Open URL
                  </button>
                )}
                
                <button
                  onClick={resetScanner}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium rounded-lg flex items-center transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Scan Again
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <p className="text-center">
                Scan a QR code to see the result here
              </p>
            </div>
          )}
          
          <div className="mt-8">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Instructions
            </h3>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li>Position the QR code within the scanner frame</li>
              <li>Hold steady until the code is recognized</li>
              <li>For best results, ensure good lighting</li>
              <li>If scanning doesn't work, try uploading an image</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;