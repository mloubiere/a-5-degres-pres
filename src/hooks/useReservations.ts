import { useState, useEffect, useCallback } from 'react';
import { ReservationService } from '../services/reservationService';
import { Reservation } from '../types/presence';

export const useReservations = (currentDate: Date) => {
  const [reservationsByDate, setReservationsByDate] = useState<{ [date: string]: Reservation[] }>({});
  const [allNames, setAllNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger tous les noms uniques
  const loadAllNames = useCallback(async () => {
    try {
      const names = await ReservationService.getAllUniqueNames();
      setAllNames(names);
    } catch (err) {
      console.error('Erreur lors du chargement des noms:', err);
      // Ne pas afficher d'erreur pour les noms, ce n'est pas critique
    }
  }, []);

  // Charger les réservations du mois
  const loadReservations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const data = await ReservationService.getReservationsByMonth(year, month);
      setReservationsByDate(data);
      // Charger aussi les noms
      await loadAllNames();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des réservations');
      console.error('Erreur lors du chargement des réservations:', err);
    } finally {
      setLoading(false);
    }
  }, [currentDate, loadAllNames]);

  // Charger les réservations au montage et quand le mois change
  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  // Créer une réservation
  const createReservation = useCallback(async (name: string, date: Date) => {
    try {
      await ReservationService.createReservation(name, date);
      // Recharger les réservations après création
      await loadReservations();
    } catch (err) {
      throw err; // Propager l'erreur pour que le composant puisse l'afficher
    }
  }, [loadReservations]);

  // Supprimer une réservation
  const getReservations = useCallback((date: Date): Reservation[] => {
    const dateKey = date.toISOString().split('T')[0];
    return reservationsByDate[dateKey] || [];
  }, [reservationsByDate]);

  // Obtenir le nombre de places disponibles pour une date
  const getAvailableSpots = useCallback((date: Date): number => {
    const reservations = getReservations(date);
    return Math.max(0, 12 - reservations.length);
  }, [getReservations]);

  // Vérifier si une personne a une réservation pour une date
  return {
    reservationsByDate,
    allNames,
    loading,
    error,
    createReservation,
    getReservations,
    getAvailableSpots,
    refreshReservations: loadReservations
  };
};