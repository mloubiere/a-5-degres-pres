export interface Reservation {
  name: string;
  date: string;
}

export interface PresenceData {
  [date: string]: Reservation[];
}