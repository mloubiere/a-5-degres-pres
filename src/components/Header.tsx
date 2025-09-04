import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-lg border-b border-primary-100">
      <div className="container mx-auto px-2 md:px-4 py-3 md:py-4">
        <div className="flex items-center gap-3">
          <img 
            src="/images/Logo_5D.png" 
            alt="5 Degrés Logo" 
            className="h-8 md:h-12 w-auto"
          />
          <div>
            <h1 className="text-lg md:text-xl font-bold text-secondary-900">Présence Bureau</h1>
            <p className="text-xs md:text-sm text-primary-600">Réservez votre place à l'agence</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;