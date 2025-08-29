import React, { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SnackbarProps {
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Snackbar: React.FC<SnackbarProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 4000
}) => {
  const [show, setShow] = useState(false);

  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Attendre la fin de l'animation
        setTimeout(onClose, 300); // Attendre la fin de l'animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible && !show) return null;

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  const handleClose = () => {
    setShow(false);
    setTimeout(onClose, 300);
  };

  return (
    <div className={`
      fixed top-16 md:top-20 left-0 right-0 z-50 transition-all duration-300 ease-in-out
      ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
    `}>
      fixed top-16 md:top-20 left-0 right-0 z-50 transition-all duration-300 ease-in-out
      ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
    `}>
      <div className={`
        w-full shadow-lg border-l-4 p-4 flex items-center gap-3
        ${type === 'success' 
          ? 'bg-success-50 border-success-500 text-success-800' 
          : 'bg-red-50 border-red-500 text-red-800'
        }
      `}>
        <div className="flex-shrink-0">
          {type === 'success' ? (
            <CheckCircle className="h-5 w-5 text-success-600" />
          ) : (
            <X className="h-5 w-5 text-red-600" />
          )}
        </div>
        
        <div className="flex-1">
          <p className={`
            text-sm font-medium
            text-left md:text-center
          `}>
            {message}
          </p>
        </div>
        
        <button
          onClick={handleClose}
          className={`
            flex-shrink-0 p-1 rounded-full transition-colors duration-200
            ${type === 'success' 
              ? 'hover:bg-success-100 text-success-600' 
              : 'hover:bg-red-100 text-red-600'
            }
          `}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default Snackbar;

export default Snackbar