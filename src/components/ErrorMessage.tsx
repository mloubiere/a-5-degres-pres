import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
          Erreur de connexion
        </h3>
        
        <p className="text-secondary-600 mb-6">
          {message}
        </p>
        
        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4" />
            Réessayer
          </button>
        )}
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600">
            Assurez-vous que Supabase est correctement configuré et que la connexion internet fonctionne.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;