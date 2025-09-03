import React, { useState } from 'react';
import CalendarView from './components/CalendarView';
import Header from './components/Header';
import ReservationModal from './components/ReservationModal';
import MyReservations from './components/MyReservations';
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
  const [activeTab, setActiveTab] = useState<'calendar' | 'reservations'>('calendar');
  const [userName, setUserName] = useState('');
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
    allNames,
    createReservation,
    getReservations,
    getAvailableSpots,
    refreshReservations
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

  const handleMonthChange = (date: Date) => {
    setCurrentDate(date);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, isVisible: false }));
  };

  const handleReservationChange = () => {
    refreshReservations();
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
              {/* Navigation par onglets */}
              <div className="bg-white rounded-xl shadow-lg mb-4 overflow-hidden">
                <div className="border-b border-gray-200">
                  <nav className="flex">
                    <button
                      onClick={() => setActiveTab('calendar')}
                      className={`
                        flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200
                        ${activeTab === 'calendar'
                          ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                          : 'text-secondary-600 hover:text-secondary-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      📅 Calendrier
                    </button>
                    <button
                      onClick={() => setActiveTab('reservations')}
                      className={`
                        flex-1 px-4 py-3 text-sm font-medium transition-colors duration-200
                        ${activeTab === 'reservations'
                          ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50'
                          : 'text-secondary-600 hover:text-secondary-900 hover:bg-gray-50'
                        }
                      `}
                    >
                      📋 Mes réservations
                    </button>
                  </nav>
                </div>
              </div>

              {/* Contenu selon l'onglet actif */}
              {activeTab === 'calendar' ? (
              <div className="bg-white rounded-xl shadow-lg mb-4 md:mb-8 overflow-hidden">
                <CalendarView
                  currentDate={currentDate}
                  onDateClick={handleDateClick}
                  onMonthChange={handleMonthChange}
                  getAvailableSpots={getAvailableSpots}
                  getReservations={getReservations}
                />
              </div>
              ) : (
                <MyReservations
                  userName={userName}
                  onUserNameChange={setUserName}
                  availableNames={allNames}
                  onReservationChange={handleReservationChange}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {isModalOpen && selectedDate && (
        <ReservationModal
          date={selectedDate}
          availableSpots={getAvailableSpots(selectedDate)}
          reservations={getReservations(selectedDate)}
          availableNames={allNames}
          onClose={() => setIsModalOpen(false)}
          onReserve={handleReservation}
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