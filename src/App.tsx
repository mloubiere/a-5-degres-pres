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
      <div className="min-h-screen" style={{ backgroundColor: '#fbf0e5' }}>
        <Header />
        <LoadingSpinner />
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
    </div>
  );
}

export default App;