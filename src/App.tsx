import React, { useState } from 'react';
import CalendarView from './components/CalendarView';
import Header from './components/Header';
import ReservationModal from './components/ReservationModal';
import { useReservations } from './hooks/useReservations';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleReservation = async (date: Date, name: string) => {
    try {
      await createReservation(name, date);
      setIsModalOpen(false);
    } catch (err) {
      // L'erreur sera gérée par le composant ReservationModal
      throw err;
    }
  };

  const handleMonthChange = (date: Date) => {
    setCurrentDate(date);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
        <Header />
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
        <Header />
        <ErrorMessage message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg mb-8">
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
    </div>
  );
}

export default App;