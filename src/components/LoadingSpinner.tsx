import React, { useState } from 'react';
import Lottie from 'lottie-react';
import animationData from '../../public/Animation LottieFiles.json';

interface LoadingSpinnerProps {
  onAnimationComplete?: () => void;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ onAnimationComplete }) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
    // Petit délai pour permettre à l'utilisateur de voir la fin de l'animation
    setTimeout(() => {
      onAnimationComplete?.();
    }, 500);
  };

  if (animationComplete) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: '#fbf0e5' }}>
      <div className="text-center">
        <div className="mb-6">
          <Lottie
            animationData={animationData}
            loop={false}
            autoplay={true}
            style={{ width: 200, height: 200 }}
            onComplete={handleAnimationComplete}
          />
        </div>
        <p className="text-lg font-medium text-secondary-700 animate-pulse">
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
  );
};

export default LoadingSpinner;