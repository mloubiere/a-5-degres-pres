import React from 'react';
import { Calendar } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="relative">
          <Calendar className="h-12 w-12 text-primary-600 mx-auto mb-4 animate-pulse" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <p className="text-secondary-600 font-medium">Chargement des réservations...</p>
        <p className="text-secondary-400 text-sm mt-1">Connexion à la base de données</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;