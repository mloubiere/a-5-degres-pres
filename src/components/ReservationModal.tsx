import React, { useState } from 'react';
import { X, Calendar, Users, MapPin, UserPlus, Edit3, Trash2, Save } from 'lucide-react';
import { Reservation } from '../types/presence';

interface ReservationModalProps {
  date: Date;
  availableSpots: number;
  reservations: Reservation[];
  onClose: () => void;
  onReserve: (date: Date, name: string) => void;
  onUpdate: (oldName: string, newName: string, date: Date) => void;
  onDelete: (name: string, date: Date) => void;
  hasReservation: (name: string, date: Date) => boolean;
}

const ReservationModal: React.FC<ReservationModalProps> = ({
  date,
  availableSpots,
  reservations,
  onClose,
  onReserve,
  onUpdate,
  onDelete,
  hasReservation
}) => {
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userHasReservation, setUserHasReservation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalName, setOriginalName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Vérifier si l'utilisateur a déjà une réservation quand le nom change
  React.useEffect(() => {
    if (name.trim()) {
      const hasExistingReservation = hasReservation(name.trim(), date);
      setUserHasReservation(hasExistingReservation);
      
      // Si l'utilisateur a une réservation et qu'on n'est pas en mode édition, 
      // passer en mode édition automatiquement
      if (hasExistingReservation && !isEditing) {
        setIsEditing(true);
        setOriginalName(name.trim());
      }
    } else {
      setUserHasReservation(false);
      setIsEditing(false);
      setOriginalName('');
    }
  }, [name, date, hasReservation, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      if (isEditing && originalName) {
        // Mode modification
        await onUpdate(originalName, name.trim(), date);
      } else {
        // Mode création
        await onReserve(date, name.trim());
      }
      // Le modal sera fermé par le parent en cas de succès
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la réservation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!originalName) return;
    
    setError(null);
    setIsSubmitting(true);
    
    try {
      await onDelete(originalName, date);
      // Le modal sera fermé par le parent en cas de succès
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
    } finally {
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleCancelEdit = () => {
    setName('');
    setIsEditing(false);
    setOriginalName('');
    setUserHasReservation(false);
    setError(null);
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
              <div className="p-2 rounded-lg" style={{ backgroundColor: '#005953' }}>
                <Calendar className="h-6 w-6" style={{ color: '#ffffff' }} />
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
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  availableSpots === 0 ? 'bg-red-500' : 
                  availableSpots < 5 ? 'bg-accent-400' : 
                  'bg-success-500'
                }`}></div>
                <p className="text-sm text-primary-700">
                  {availableSpots > 0 ? (
                    <>
                      <span className={`font-semibold ${
                        availableSpots < 5 ? 'text-accent-600' : 'text-success-600'
                      }`}>
                        {availableSpots} places disponibles
                      </span>
                      {availableSpots === 1 ? ' restante' : ' restantes'}
                    </>
                  ) : (
                    <span className="font-semibold text-red-600">Aucune place disponible</span>
                  )}
                </p>
              </div>
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

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {userHasReservation && (
            <div className="bg-accent-50 border border-accent-200 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-accent-400 rounded-full flex-shrink-0"></div>
                <p className="text-sm text-accent-700">
                  {isEditing ? 'Vous pouvez modifier ou supprimer votre réservation.' : 'Vous avez déjà une réservation pour cette date.'}
                </p>
              </div>
            </div>
          )}

          {availableSpots > 0 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-2">
                  Prénom et nom
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="ex : Mathieu Loubière"
                  required
                />
              </div>
              
              {isEditing ? (
                // Mode édition - Afficher les boutons de gestion
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={!name.trim() || isSubmitting || name.trim() === originalName}
                      className={`
                        flex-1 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
                        ${!name.trim() || isSubmitting || name.trim() === originalName
                          ? 'bg-secondary-300 text-secondary-500 cursor-not-allowed'
                          : 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg'
                        }
                      `}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Modification...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Modifier
                        </>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      disabled={isSubmitting}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Supprimer
                    </button>
                  </div>
                  
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="w-full px-4 py-2 bg-secondary-200 text-secondary-700 rounded-lg hover:bg-secondary-300 transition-colors duration-200"
                  >
                    Annuler
                  </button>
                </div>
              ) : (
                // Mode création - Bouton de réservation normal
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
              )}
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
        
        {/* Modal de confirmation de suppression */}
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
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
                  Êtes-vous sûr de vouloir supprimer votre réservation pour le {formatDate(date)} ?
                </p>
                
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 bg-secondary-200 text-secondary-700 rounded-lg hover:bg-secondary-300 transition-colors duration-200"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
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
    </div>
  );
};

export default ReservationModal;