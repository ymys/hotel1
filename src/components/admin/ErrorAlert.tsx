import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorAlertProps {
  error: string | null;
  onDismiss?: () => void;
  className?: string;
}

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error, onDismiss, className = '' }) => {
  if (!error) return null;

  return (
    <div className={`flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 ${className}`}>
      <AlertCircle className="w-5 h-5 flex-shrink-0" />
      <span className="text-sm flex-1">{error}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700 transition-colors"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorAlert;