import React, { useState } from 'react';
import Header from './Header';

interface LoadingSpinnerProps {
  onAnimationComplete?: () => void;
  hideHeader?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ onAnimationComplete, hideHeader = false }) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
    // Délai court avant de déclencher la transition
    setTimeout(() => {
      onAnimationComplete?.();
    }, 300);
  };


  return (
    <div className="w-full h-full">
      {!hideHeader && <Header />}
      
      <div className={`flex items-center justify-center ${hideHeader ? 'h-full' : 'min-h-[calc(100vh-80px)]'}`}>
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <img 
              src="/images/Logo_5D.png" 
              alt="5 Degrés Logo" 
              className="w-32 h-32 md:w-40 md:h-40 object-contain animate-pulse"
              onLoad={handleAnimationComplete}
            />
          </div>
          <p className="text-lg font-medium text-secondary-700">
            Chargement des données en cours
          </p>
          <div className="mt-4 flex justify-center">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;