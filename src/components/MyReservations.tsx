import React, { useState, useEffect } from 'react';
import { Calendar, Trash2, AlertCircle, CheckCircle } from 'lucide-react';
import { ReservationService } from '../services/reservationService';
import { Reservation } from '../types/presence';
import NameSelector from './NameSelector';

interface MyReservationsProps {
  userName: string;
  onUserNameChange: (name: string) => void;
  availableNames: string[];
  onReservationChange: () => void;
}

interface UserReservation extends Reservation {
  id: string;
  created_at: string;
  updated_at: string;
}

const MyReservations: React.FC<MyReservationsProps> = ({
  userName,
  onUserNameChange,
  availableNames,
  onReservationChange
}) => {
  const [reservations, setReservations] = useState<UserReservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadUserReservations = async () => {
    if (!userName.trim()) {
      setReservations([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await ReservationService.getUserReservations(userName.trim());
      setReservations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserReservations();
  }, [userName]);

  const handleDelete = async (reservation: UserReservation) => {
    setActionLoading(reservation.id);
    setError(null);

    try {
      const date = new Date(reservation.date);
      await ReservationService.deleteReservation(reservation.name, date);
      await loadUserReservations();
      onReservationChange();
      setDeletingId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    // Parse manuel pour éviter les problèmes de fuseau horaire
    const [year, month, day] = dateString.split('-').map(Number);
    
    // Créer la date en heure locale et formater manuellement
    const date = new Date(year, month - 1, day);
    
    const weekdays = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
                   'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    
    const weekday = weekdays[date.getDay()];
    const monthName = months[date.getMonth()];
    
    return `${weekday} ${day} ${monthName} ${year}`;
  };

  const isPastDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    date.setHours(0, 0, 0, 0);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  // Filtrer pour ne garder que les réservations d'aujourd'hui et futures
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const futureReservations = reservations.filter(reservation => {
    const [year, month, day] = reservation.date.split('-').map(Number);
    const reservationDate = new Date(year, month - 1, day);
    return reservationDate >= today;
  });

  const sortedReservations = [...futureReservations].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg" style={{ backgroundColor: '#005953' }}>
          <Calendar className="h-6 w-6" style={{ color: '#ffffff' }} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-secondary-900">Mes réservations</h2>
          <p className="text-secondary-600">Gérez vos réservations de places</p>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="userName" className="block text-sm font-medium text-secondary-700 mb-2">
          Votre nom
        </label>
        <NameSelector
          value={userName}
          onChange={onUserNameChange}
          names={availableNames}
          placeholder="Rechercher et sélectionner votre nom"
        />
        <p className="text-xs text-secondary-500 mt-1">
          Sélectionnez votre nom pour voir et gérer vos réservations
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {!userName.trim() ? (
        <div className="text-center py-8">
          <div className="p-4 bg-secondary-50 rounded-lg">
            <p className="text-secondary-600">
              Entrez votre nom ci-dessus pour voir vos réservations
            </p>
          </div>
        </div>
      ) : loading ? (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-secondary-600">Chargement de vos réservations...</p>
        </div>
      ) : futureReservations.length === 0 ? (
        <div className="text-center py-8">
          <div className="p-4 bg-secondary-50 rounded-lg">
            <p className="text-secondary-600">
              Aucune réservation future trouvée pour <span className="font-medium">{userName}</span>
            </p>
            <p className="text-sm text-secondary-500 mt-1">
              Utilisez le calendrier pour créer une nouvelle réservation
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="h-5 w-5 text-success-600" />
            <span className="font-medium text-secondary-900">
              {futureReservations.length} réservation{futureReservations.length > 1 ? 's' : ''} à venir
            </span>
          </div>

          {sortedReservations.map((reservation) => {
            const isDeleting = deletingId === reservation.id;
            const isActionLoading = actionLoading === reservation.id;
            const [year, month, day] = reservation.date.split('-').map(Number);
            // Créer la date avec l'ajustement pour éviter les problèmes de fuseau horaire
            const reservationDate = new Date(year, month - 1, day + 1);
            const today = new Date();
            const isToday = reservationDate.toDateString() === today.toDateString();

            return (
              <div
                key={reservation.id}
                className={`
                  border rounded-lg p-4 transition-all duration-200
                  ${isToday ? 'bg-primary-50 border-primary-200' : 'bg-white border-secondary-200 hover:border-primary-300'}
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-2 h-2 rounded-full ${isToday ? 'bg-primary-500' : 'bg-success-500'}`}></div>
                      <p className="font-medium text-secondary-900">
                        {(() => {
                          const [year, month, day] = reservation.date.split('-').map(Number);
                          const adjustedDate = new Date(year, month - 1, day + 1);
                          const weekdays = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
                          const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
                                         'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
                          const weekday = weekdays[adjustedDate.getDay()];
                          const monthName = months[adjustedDate.getMonth()];
                          return `${weekday} ${adjustedDate.getDate()} ${monthName} ${adjustedDate.getFullYear()}`;
                        })()}
                      </p>
                      {isToday && (
                        <span className="text-xs bg-primary-200 text-primary-700 px-2 py-1 rounded-full">
                          Aujourd'hui
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-secondary-600">
                      Réservé par : {reservation.name}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 ml-3">
                    <button
                      onClick={() => setDeletingId(reservation.id)}
                      disabled={isActionLoading}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Modal de confirmation de suppression */}
                {isDeleting && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-4">
                          <div className="p-3 bg-red-100 rounded-full">
                            <Trash2 className="h-6 w-6 text-red-600" />
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                          Supprimer la réservation
                        </h3>
                        
                        <p className="text-secondary-600 mb-6">
                          Êtes-vous sûr de vouloir supprimer votre réservation pour le {(() => {
                            const [year, month, day] = reservation.date.split('-').map(Number);
                            const adjustedDate = new Date(year, month - 1, day + 1);
                            const weekdays = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
                            const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
                                           'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
                            const weekday = weekdays[adjustedDate.getDay()];
                            const monthName = months[adjustedDate.getMonth()];
                            return `${weekday} ${adjustedDate.getDate()} ${monthName} ${adjustedDate.getFullYear()}`;
                          })()} ?
                        </p>
                        
                        <div className="flex gap-3">
                          <button
                            onClick={() => setDeletingId(null)}
                            disabled={isActionLoading}
                            className="flex-1 px-4 py-2 bg-secondary-200 text-secondary-700 rounded-lg hover:bg-secondary-300 transition-colors duration-200"
                          >
                            Annuler
                          </button>
                          <button
                            onClick={() => handleDelete(reservation)}
                            disabled={isActionLoading}
                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2"
                          >
                            {isActionLoading ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4" />
                                Supprimer
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyReservations;