/*
  # Mise à jour de la capacité maximale à 15 places

  1. Modifications
    - Mise à jour de la fonction `check_max_reservations_per_day` pour permettre 15 réservations par jour au lieu de 12
    
  2. Impact
    - Les nouvelles réservations pourront être créées jusqu'à 15 par jour
    - Les réservations existantes ne sont pas affectées
*/

-- Mise à jour de la fonction pour vérifier le nombre maximum de réservations par jour
CREATE OR REPLACE FUNCTION check_max_reservations_per_day()
RETURNS TRIGGER AS $$
DECLARE
    reservation_count INTEGER;
BEGIN
    -- Compter le nombre de réservations existantes pour cette date
    SELECT COUNT(*) INTO reservation_count
    FROM reservations
    WHERE date = NEW.date;
    
    -- Vérifier si on dépasse la limite de 15 réservations
    IF reservation_count >= 15 THEN
        RAISE EXCEPTION 'Nombre maximum de réservations atteint pour cette date (15 places maximum)';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;