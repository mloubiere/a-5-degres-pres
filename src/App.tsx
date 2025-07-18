import React, { useState } from 'react';
import { Calendar, Users, MapPin, Clock } from 'lucide-react';
import CalendarView from './components/CalendarView';
import Header from './components/Header';
import ReservationModal from './components/ReservationModal';
import { PresenceData } from './types/presence';

function App() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [presenceData, setPresenceData] = useState<PresenceData>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const handleReservation = (date: Date, name: string) => {
    const dateKey = date.toISOString().split('T')[0];
    setPresenceData(prev => ({
      ...prev,
      [dateKey]: [
        ...(prev[dateKey] || []),
        { name, date: dateKey }
      ]
    }));
    setIsModalOpen(false);
  };

  const getAvailableSpots = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    const reservations = presenceData[dateKey] || [];
    return Math.max(0, 12 - reservations.length); // 12 places maximum - réservations
  };

  const getReservations = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    return presenceData[dateKey] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg mb-8">
            <CalendarView
              onDateClick={handleDateClick}
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
        />
      )}
    </div>
  );
}

export default App;