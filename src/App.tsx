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
    return Math.max(0, 12 - 9 - reservations.length); // 12 places - 9 internes - réservations
  };

  const getReservations = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    return presenceData[dateKey] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Présence au Bureau</h1>
                <p className="text-gray-600">Réservez votre place à l'agence 5 Degrés</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold text-blue-900">Places disponibles</span>
                </div>
                <p className="text-sm text-blue-700">12 places assises par jour</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-5 w-5 text-green-600" />
                  <span className="font-semibold text-green-900">Équipe interne</span>
                </div>
                <p className="text-sm text-green-700">8-9 personnes présentes</p>
              </div>
              
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <span className="font-semibold text-orange-900">Réservation</span>
                </div>
                <p className="text-sm text-orange-700">Simple et rapide</p>
              </div>
            </div>

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