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
  const [showLoadingScreen, setShowLoadingScreen] = useState(true);
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
    getReservations,
    getAvailableSpots,
    hasReservation
  } = useReservations(currentDate);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleAnimationComplete = () => {
    setShowLoadingScreen(false);
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

  const handleMonthChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, isVisible: false }));
  };

  // Afficher l'écran de chargement avec animation au démarrage
  if (showLoadingScreen) {
    return (
      <LoadingSpinner onAnimationComplete={handleAnimationComplete} />
    );
  }

  // Afficher le spinner normal pendant les opérations de données
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#fbf0e5' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#fbf0e5' }}>
        <Header />
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#fbf0e5' }}>
      <Header />
      
      <main className="flex-1 flex flex-col container mx-auto px-2 md:px-4 py-4 md:py-8">
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
      </main>

      {isModalOpen && selectedDate && (
        <ReservationModal
          date={selectedDate}
          availableSpots={getAvailableSpots(selectedDate)}
          reservations={getReservations(selectedDate)}
          onClose={() => setIsModalOpen(false)}
          onReserve={handleReservation}
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