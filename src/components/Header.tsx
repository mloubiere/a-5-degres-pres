import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <img 
            src="https://www.5degres.com/wp-content/uploads/2023/03/logo-5degres-1.png" 
            alt="5 Degrés Logo" 
            className="h-10 w-auto"
          />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Présence Bureau</h1>
            <p className="text-sm text-gray-600">Réservez votre place à l'agence</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;