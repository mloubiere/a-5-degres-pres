import React, { useState } from 'react';
import CalendarView from './components/CalendarView';
import Header from './components/Header';
import ReservationModal from './components/ReservationModal';
import Snackbar from './components/Snackbar';
import { useReservations } from './hooks/useReservations';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showLoadingAnimation, setShowLoadingAnimation] = useState(true);
  const [snackbar, setSnackbar] = useState<{
    isVisible: boolean;
    message: string;
    type: 'success' | 'error';
  }>({
    isVisible: false,
    message: '',
    type: 'success'
  });

  const {
    loading,
    error,
    createReservation,
    updateReservation,
    deleteReservation,
    getReservations,
    getAvailableSpots,
    hasReservation
  } = useReservations(currentDate);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleAnimationComplete = () => {
    setShowLoadingAnimation(false);
    // Attendre un peu avant de masquer complètement le loading initial
    setTimeout(() => {
      setIsInitialLoading(false);
    }, 500);
  };

  const handleReservation = async (date: Date, name: string) => {
    try {
      await createReservation(name, date);
      setIsModalOpen(false);
      setSnackbar({
        isVisible: true,
        message: 'Votre réservation de place a été validée',
        type: 'success'
      });
    } catch (err) {
      // L'erreur sera gérée par le composant ReservationModal
      throw err;
    }
  };

  const handleUpdateReservation = async (oldName: string, newName: string, date: Date) => {
    try {
      await updateReservation(oldName, newName, date);
      setIsModalOpen(false);
      setSnackbar({
        isVisible: true,
        message: 'Votre réservation a été modifiée avec succès',
        type: 'success'
      });
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteReservation = async (name: string, date: Date) => {
    try {
      await deleteReservation(name, date);
      setIsModalOpen(false);
      setSnackbar({
        isVisible: true,
        message: 'Votre réservation a été supprimée',
        type: 'success'
      });
    } catch (err) {
      throw err;
    }
  };

  const handleMonthChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, isVisible: false }));
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fbf0e5' }}>
      <Header />
      
      <main className="flex-1 flex flex-col relative">
        {/* Animation de chargement initial */}
        {isInitialLoading && (
          <div className={`
            absolute inset-0 z-10 flex items-center justify-center
            transition-opacity duration-500
            ${showLoadingAnimation ? 'opacity-100' : 'opacity-0'}
          `}>
            <LoadingSpinner onAnimationComplete={handleAnimationComplete} hideHeader />
          </div>
        )}

        {/* Contenu principal */}
        <div className={`
          flex-1 flex flex-col container mx-auto px-2 md:px-4 py-4 md:py-8
          transition-opacity duration-500
          ${isInitialLoading ? 'opacity-0' : 'opacity-100'}
        `}>
          {loading && !isInitialLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-secondary-600 font-medium">Chargement...</p>
              </div>
            </div>
          ) : error ? (
            <ErrorMessage message={error} />
          ) : (
            <div className="flex flex-col max-w-4xl mx-auto w-full">
              <div className="bg-white rounded-xl shadow-lg mb-4 md:mb-8 overflow-hidden">
                <CalendarView
                  currentDate={currentDate}
                  onDateClick={handleDateClick}
                  onMonthChange={handleMonthChange}
                  getAvailableSpots={getAvailableSpots}
                  getReservations={getReservations}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && selectedDate && (
        <ReservationModal
          date={selectedDate}
          availableSpots={getAvailableSpots(selectedDate)}
          reservations={getReservations(selectedDate)}
          onClose={() => setIsModalOpen(false)}
          onReserve={handleReservation}
          onUpdate={handleUpdateReservation}
          onDelete={handleDeleteReservation}
          hasReservation={hasReservation}
        />
      )}

      <Snackbar
        message={snackbar.message}
        type={snackbar.type}
        isVisible={snackbar.isVisible}
        onClose={handleCloseSnackbar}
      />
    </div>
  );
}

export default App;