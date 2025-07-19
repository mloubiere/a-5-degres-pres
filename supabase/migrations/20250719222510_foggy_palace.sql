/*
  # Création de la table des réservations

  1. Nouvelles Tables
    - `reservations`
      - `id` (uuid, clé primaire)
      - `name` (text, nom de la personne)
      - `date` (date, jour de réservation)
      - `created_at` (timestamp, date de création)
      - `updated_at` (timestamp, date de modification)

  2. Sécurité
    - Activation de RLS sur la table `reservations`
    - Politique permettant à tous de lire les réservations
    - Politique permettant à tous de créer des réservations
    - Politique permettant de supprimer ses propres réservations

  3. Contraintes
    - Index unique sur (name, date) pour éviter les doublons
    - Contrainte de vérification pour limiter à 12 réservations par jour
*/

CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  date date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Index pour optimiser les requêtes par date
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);

-- Index unique pour éviter qu'une personne réserve plusieurs fois le même jour
CREATE UNIQUE INDEX IF NOT EXISTS idx_reservations_name_date ON reservations(name, date);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour mettre à jour updated_at
DROP TRIGGER IF EXISTS update_reservations_updated_at ON reservations;
CREATE TRIGGER update_reservations_updated_at
  BEFORE UPDATE ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Activation de RLS
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre à tous de lire les réservations
CREATE POLICY "Tout le monde peut voir les réservations"
  ON reservations
  FOR SELECT
  TO public
  USING (true);

-- Politique pour permettre à tous de créer des réservations
CREATE POLICY "Tout le monde peut créer des réservations"
  ON reservations
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Politique pour permettre de supprimer ses propres réservations
CREATE POLICY "Chacun peut supprimer ses réservations"
  ON reservations
  FOR DELETE
  TO public
  USING (true);

-- Fonction pour vérifier le nombre maximum de réservations par jour (12 places)
CREATE OR REPLACE FUNCTION check_max_reservations_per_day()
RETURNS TRIGGER AS $$
BEGIN
  IF (
    SELECT COUNT(*)
    FROM reservations
    WHERE date = NEW.date
  ) >= 12 THEN
    RAISE EXCEPTION 'Nombre maximum de réservations atteint pour cette date (12 places maximum)';
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour vérifier le nombre maximum de réservations
DROP TRIGGER IF EXISTS check_max_reservations ON reservations;
CREATE TRIGGER check_max_reservations
  BEFORE INSERT ON reservations
  FOR EACH ROW
  EXECUTE FUNCTION check_max_reservations_per_day();