import { supabase } from '../lib/supabase';
import { Reservation } from '../types/presence';

export class ReservationService {
  // Récupérer toutes les réservations pour une date donnée
  static async getReservationsByDate(date: Date): Promise<Reservation[]> {
    const dateString = date.toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('reservations')
      .select('name, date')
      .eq('date', dateString)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des réservations:', error);
      throw new Error('Impossible de récupérer les réservations');
    }

    return data || [];
  }

  // Récupérer toutes les réservations pour un mois donné
  static async getReservationsByMonth(year: number, month: number): Promise<{ [date: string]: Reservation[] }> {
    const startDate = new Date(year, month, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('reservations')
      .select('name, date')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des réservations du mois:', error);
      throw new Error('Impossible de récupérer les réservations du mois');
    }

    // Grouper les réservations par date
    const reservationsByDate: { [date: string]: Reservation[] } = {};
    data?.forEach(reservation => {
      if (!reservationsByDate[reservation.date]) {
        reservationsByDate[reservation.date] = [];
      }
      reservationsByDate[reservation.date].push(reservation);
    });

    return reservationsByDate;
  }

  // Créer une nouvelle réservation
  static async createReservation(name: string, date: Date): Promise<void> {
    const dateString = date.toISOString().split('T')[0];

    const { error } = await supabase
      .from('reservations')
      .insert({
        name: name.trim(),
        date: dateString
      });

    if (error) {
      if (error.code === '23505') { // Violation de contrainte unique
        throw new Error('Vous avez déjà une réservation pour cette date');
      }
      if (error.message.includes('Nombre maximum de réservations atteint')) {
        throw new Error('Toutes les places sont occupées pour cette date');
      }
      console.error('Erreur lors de la création de la réservation:', error);
      throw new Error('Impossible de créer la réservation');
    }
  }

  // Supprimer une réservation
  static async deleteReservation(name: string, date: Date): Promise<void> {
    const dateString = date.toISOString().split('T')[0];

    const { error } = await supabase
      .from('reservations')
      .delete()
      .eq('name', name.trim())
      .eq('date', dateString);

    if (error) {
      console.error('Erreur lors de la suppression de la réservation:', error);
      throw new Error('Impossible de supprimer la réservation');
    }
  }

  // Modifier une réservation (changer le nom)
  static async countReservationsByDate(date: Date): Promise<number> {
    const dateString = date.toISOString().split('T')[0];

    const { count, error } = await supabase
      .from('reservations')
      .select('*', { count: 'exact', head: true })
      .eq('date', dateString);

    if (error) {
      console.error('Erreur lors du comptage des réservations:', error);
      return 0;
    }

    return count || 0;
  }

  // Récupérer toutes les réservations d'un utilisateur
  static async getUserReservations(name: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .eq('name', name.trim())
      .order('date', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des réservations utilisateur:', error);
      throw new Error('Impossible de récupérer vos réservations');
    }

    return data || [];
  }

  // Modifier une réservation (changer le nom)
  static async updateReservation(oldName: string, newName: string, date: Date): Promise<void> {
    const dateString = date.toISOString().split('T')[0];

    const { error } = await supabase
      .from('reservations')
      .update({ name: newName.trim() })
      .eq('name', oldName.trim())
      .eq('date', dateString);

    if (error) {
      if (error.code === '23505') { // Violation de contrainte unique
        throw new Error('Une réservation existe déjà avec ce nom pour cette date');
      }
      console.error('Erreur lors de la modification de la réservation:', error);
      throw new Error('Impossible de modifier la réservation');
    }
  }

  // Récupérer tous les noms uniques des réservations
  static async getAllUniqueNames(): Promise<string[]> {
    const { data, error } = await supabase
      .from('reservations')
      .select('name')
      .order('name', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des noms:', error);
      throw new Error('Impossible de récupérer la liste des noms');
    }

    // Extraire les noms uniques
    const uniqueNames = Array.from(new Set(data?.map(item => item.name) || []));
    return uniqueNames.sort();
  }
}