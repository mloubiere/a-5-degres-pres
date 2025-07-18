import React, { useState } from 'react';
import { X, Calendar, Users, MapPin, UserPlus } from 'lucide-react';
import { Reservation } from '../types/presence';

interface ReservationModalProps {
  date: Date;
  availableSpots: number;
  reservations: Reservation[];
  onClose: () => void;
  onReserve: (date: Date, name: string) => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  date,
  availableSpots,
  reservations,
  onClose,
  onReserve
}) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    onReserve(date, name.trim());
    setIsSubmitting(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-100 rounded-lg">
                <Calendar className="h-6 w-6 text-primary-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-secondary-900">Réserver ma place</h2>
                <p className="text-secondary-600 capitalize">{formatDate(date)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-primary-600" />
                <span className="font-semibold text-primary-900">Disponibilité</span>
              </div>
              <p className="text-sm text-primary-700">
                {availableSpots > 0 ? (
                  <>
                    <span className="font-semibold text-success-600">{availableSpots} places disponibles</span>
                    {availableSpots === 1 ? ' restante' : ' restantes'}
                  </>
                ) : (
                  <span className="font-semibold text-red-600">Aucune place disponible</span>
                )}
              </p>
            </div>

            {reservations.length > 0 && (
              <div className="bg-secondary-50 border border-secondary-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-5 w-5 text-secondary-600" />
                  <span className="font-semibold text-secondary-900">Qui sera présent</span>
                </div>
                <div className="space-y-2">
                  {reservations.map((reservation, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-secondary-700">
                      <div className="w-2 h-2 bg-success-500 rounded-full"></div>
                      <span>{reservation.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {availableSpots > 0 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
                  Votre nom
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Entrez votre nom"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={!name.trim() || isSubmitting}
                className={`
                  w-full px-4 py-2 rounded-lg font-medium transition-all duration-200
                  ${!name.trim() || isSubmitting
                    ? 'bg-secondary-300 text-secondary-500 cursor-not-allowed'
                    : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg'
                  }
                `}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Réservation...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Je réserve ma place
                  </div>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-secondary-600 mb-4">
                Toutes les places sont occupées pour cette journée.
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors duration-200"
              >
                Fermer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;