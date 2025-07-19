import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Users, Calendar as CalendarIcon } from 'lucide-react';
import { Reservation } from '../types/presence';

interface CalendarViewProps {
  currentDate: Date;
  onDateClick: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  getAvailableSpots: (date: Date) => number;
  getReservations: (date: Date) => Reservation[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ 
  currentDate: propCurrentDate,
  onDateClick, 
  onMonthChange,
  getAvailableSpots, 
  getReservations 
}) => {
  const [currentDate, setCurrentDate] = useState(propCurrentDate);

  // Synchroniser avec la prop currentDate
  React.useEffect(() => {
    setCurrentDate(propCurrentDate);
  }, [propCurrentDate]);

  const daysOfWeek = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven'];
  const months = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const dayOfWeek = firstDay.getDay();
    // Convert to Monday start (0=Monday, 1=Tuesday, ..., 4=Friday)
    // Skip weekends entirely
    if (dayOfWeek === 0) return -1; // Sunday - skip
    if (dayOfWeek === 6) return -1; // Saturday - skip
    return dayOfWeek - 1;
  };

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const previousMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
    onMonthChange(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
    onMonthChange(newDate);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isWeekend = (date: Date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

  const renderCalendarDays = () => {
    const firstDay = getFirstDayOfMonth(currentDate);
    const daysInMonth = getDaysInMonth(currentDate);
    const days = [];

    // Days of the month (only weekdays)
    let currentWeekDay = firstDay >= 0 ? firstDay : 0;
    let needsEmptyCell = firstDay > 0;
    
    // Add empty cells for the beginning of the month if needed
    if (needsEmptyCell) {
      for (let i = 0; i < firstDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-24"></div>);
      }
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayOfWeek = date.getDay();
      
      // Skip weekends
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue;
      }
      
      const availableSpots = getAvailableSpots(date);
      const reservations = getReservations(date);
      const isPast = isPastDate(date);
      const isTodayDate = isToday(date);

      // Add empty cells to complete the week if we're starting a new week
      const currentDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to our 0-4 index
      const expectedDayIndex = currentWeekDay % 5;
      
      if (currentDayIndex < expectedDayIndex) {
        // We've moved to a new week, fill remaining cells of previous week
        const cellsToAdd = 5 - expectedDayIndex;
        for (let i = 0; i < cellsToAdd; i++) {
          days.push(<div key={`week-end-${day}-${i}`} className="h-24"></div>);
        }
        currentWeekDay = currentDayIndex;
      } else {
        currentWeekDay = currentDayIndex;
      }

      days.push(
        <div
          key={day}
          onClick={() => !isPast && onDateClick(date)}
          className={`
            h-24 border border-gray-200 p-2 cursor-pointer transition-all duration-200
            ${isTodayDate ? 'bg-primary-50 border-primary-300' : 'bg-white hover:bg-gray-50'}
            ${isPast ? 'bg-gray-100 cursor-not-allowed opacity-50' : ''}
            ${!isPast ? 'hover:shadow-md hover:scale-105' : ''}
          `}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={`text-sm font-medium ${isTodayDate ? 'text-primary-700' : 'text-secondary-900'}`}>
              {day}
            </span>
            {!isPast && (
              <div className={`w-2 h-2 rounded-full ${
                availableSpots === 0 ? 'bg-red-500' : 
                availableSpots < 5 ? 'bg-accent-400' : 
                'bg-success-500'
              }`}></div>
            )}
          </div>
          
          {!isPast && (
            <div className="space-y-1">
              {reservations.length > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-secondary-400" />
                  <span className="text-xs text-secondary-500">
                    {reservations.length} réservé{reservations.length > 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      );
      
      currentWeekDay++;
    }

    return days;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-secondary-600" />
            <h2 className="text-lg font-semibold text-secondary-900">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
          
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors duration-200"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-0">
        {daysOfWeek.map(day => (
          <div key={day} className="bg-secondary-100 p-3 text-center text-sm font-medium text-secondary-700 border-b border-secondary-200">
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default CalendarView;