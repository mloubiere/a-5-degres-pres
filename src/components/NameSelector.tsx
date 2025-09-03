import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, User, X } from 'lucide-react';

interface NameSelectorProps {
  value: string;
  onChange: (name: string) => void;
  names: string[];
  placeholder?: string;
  className?: string;
}

const NameSelector: React.FC<NameSelectorProps> = ({
  value,
  onChange,
  names,
  placeholder = "Rechercher ou sélectionner un nom...",
  className = ""
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNames, setFilteredNames] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filtrer les noms en fonction du terme de recherche
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredNames(names);
    } else {
      const filtered = names.filter(name =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredNames(filtered);
    }
  }, [searchTerm, names]);

  // Fermer le dropdown quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleNameSelect = (name: string) => {
    onChange(name);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setSearchTerm('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    setSearchTerm(value);
  };

  const uniqueNames = Array.from(new Set(names)).sort();

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-secondary-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="w-full pl-10 pr-10 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          placeholder={placeholder}
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 mr-1 hover:bg-gray-100 rounded transition-colors duration-200"
            >
              <X className="h-4 w-4 text-secondary-400" />
            </button>
          )}
          <div className="pr-3 flex items-center pointer-events-none">
            <ChevronDown className={`h-4 w-4 text-secondary-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-secondary-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredNames.length === 0 ? (
            <div className="p-3 text-center text-secondary-500">
              {searchTerm.trim() ? (
                <div>
                  <p className="text-sm mb-2">Aucun nom trouvé</p>
                  <button
                    type="button"
                    onClick={() => handleNameSelect(searchTerm.trim())}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 transition-colors duration-200"
                  >
                    <UserPlus className="h-3 w-3" />
                    Utiliser "{searchTerm.trim()}"
                  </button>
                </div>
              ) : (
                "Aucun nom disponible"
              )}
            </div>
          ) : (
            <div className="py-1">
              {filteredNames.map((name, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleNameSelect(name)}
                  className="w-full px-3 py-2 text-left hover:bg-primary-50 transition-colors duration-200 flex items-center gap-2"
                >
                  <User className="h-4 w-4 text-secondary-400" />
                  <span className="text-secondary-900">{name}</span>
                </button>
              ))}
              
              {searchTerm.trim() && !filteredNames.includes(searchTerm.trim()) && (
                <div className="border-t border-secondary-200 mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => handleNameSelect(searchTerm.trim())}
                    className="w-full px-3 py-2 text-left hover:bg-primary-50 transition-colors duration-200 flex items-center gap-2"
                  >
                    <UserPlus className="h-4 w-4 text-primary-600" />
                    <span className="text-primary-700">Utiliser "{searchTerm.trim()}"</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NameSelector;