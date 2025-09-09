# Application de Présence au Bureau - 5 Degrés

Une application moderne pour gérer les présences au bureau et optimiser l'utilisation des espaces de travail.

## Problématique

Dans l'ADN de 5 Degrés, l'objectif est d'encourager les collaborateurs à venir au bureau. Cependant, les consultants peuvent être frustrés par :
- Le manque de places disponibles
- L'absence de salles de réunion ou bulles libres
- L'incertitude sur l'espace de travail disponible

## Solution

Cette application permet de :
- Visualiser le nombre de places disponibles par jour
- Réserver sa présence simplement
- Voir qui sera présent (pour favoriser les rencontres)
- Gérer les réservations
- Supprimer une réservation

## Fonctionnalités MVP

- ✅ Interface calendrier intuitive
- ✅ Vue des disponibilités par jour
- ✅ Réservation simple sans authentification
- ✅ Affichage des collègues présents
- ✅ Design responsive et moderne

## Contraintes

- **Places disponibles** : 15 places assises par jour
- **Équipe interne** : 8-9 personnes présentes quotidiennement
- **Places consultants** : 3-4 places variables selon les jours

## Technologies

- React 18 avec TypeScript
- Tailwind CSS pour le styling
- Lucide React pour les icônes
- Vite pour le build et le dev server

## Installation

```bash
npm install
npm run dev
```

## Déploiement

```bash
npm run build
```

## Prochaines étapes

- Persistance des données (base de données)
- Système d'authentification
- Réservation par demi-journée
- Notifications et rappels
- Statistiques de présence
- API REST pour intégration mobile
