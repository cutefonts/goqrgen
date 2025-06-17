import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { validateQRCode } from 'qrcode-validator';

interface ValidationResult {
  valid: boolean;
  error?: string;
  details: {
    readability: number;
    errorCorrection: string;
    version: number;
  };
}

interface QRCodeValidatorProps {
  qrValue: string;
  customization: any;
}

const QRCodeValidator: React.FC<QRCodeValidatorProps> = ({ qrValue, customization }) => {
  const [validationResult, setValidationResult] = React.useState<ValidationResult | null>(null);
  const [isValidating, setIsValidating] = React.useState(false);

  const validateCode = async () => {
    setIsValidating(true);
    try {
      const result = await validateQRCode(qrValue, customization);
      setValidationResult(result);
    } catch (error) {
      setValidationResult({
        valid: false,
        error: 'Failed to validate QR code',
        details: { readability: 0, errorCorrection: 'unknown', version: 0 }
      });
    }
    setIsValidating(false);
  };

  return (
    <div className="space-y-4">
      <button
        onClick={validateCode}
        disabled={isValidating}
        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg flex items-center justify-center transition-colors disabled:opacity-50"
      >
        {isValidating ? 'Validating...' : 'Validate QR Code'}
      </button>

      {validationResult && (
        <div className={`p-4 rounded-lg ${
          validationResult.valid 
            ? 'bg-green-50 dark:bg-green-900' 
            : 'bg-red-50 dark:bg-red-900'
        }`}>
          <div className="flex items-start">
            {validationResult.valid ? (
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
            )}
            <div className="ml-3">
              <h3 className={`text-sm font-medium ${
                validationResult.valid 
                  ? 'text-green-800 dark:text-green-200' 
                  : 'text-red-800 dark:text-red-200'
              }`}>
                {validationResult.valid ? 'QR Code is Valid' : 'QR Code has Issues'}
              </h3>
              
              {validationResult.error && (
                <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                  {validationResult.error}
                </p>
              )}
              
              <div className="mt-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Readability:</span>
                    <span className="ml-1 font-medium">
                      {validationResult.details.readability}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Error Correction:</span>
                    <span className="ml-1 font-medium">
                      {validationResult.details.errorCorrection}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Version:</span>
                    <span className="ml-1 font-medium">
                      {validationResult.details.version}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCodeValidator;