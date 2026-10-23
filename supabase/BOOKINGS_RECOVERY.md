# Rétablissement des réservations dans l’admin

## Constats vérifiés le 23 octobre 2026

- Les journaux Vercel de production signalent `PGRST205` : la table `public.studio_bookings` est absente du cache de schéma. Une lecture directe avec la configuration locale confirme cette erreur.
- La requête de production `/api/admin/event-bookings` a échoué avec `PGRST303`, `JWT issued at future`. Le contrôle direct effectué ensuite avec la configuration locale peut accéder à Supabase : cela ne valide pas la clé configurée sur Vercel. Vérifier cette configuration et refaire une lecture en production avant de conclure que l’erreur a disparu.
- Une lecture directe confirme l’absence de `event_bookings.client_email_sent_at`. La migration événementielle existante ajoute les trois colonnes de suivi des emails si elles manquent.
- Le secours Stripe peut retourner `booking_date: ""`. Le formatage précédent déclenche alors `RangeError: Invalid time value`. Le correctif local conserve ces lignes avec « Date non renseignée » et protège aussi les dates d’emails invalides.

## Ordre des migrations

Dans le SQL Editor du projet Supabase utilisé en production, exécuter les fichiers existants dans cet ordre :

1. `supabase/event-bookings.sql` : compléter le schéma événementiel et le suivi des emails.
2. `supabase/studio-bookings.sql` : créer le stockage des réservations payées.
3. `supabase/creator-promo-codes.sql` : ajouter les colonnes utilisées par le code de réservation actuellement présent dans ce checkout.

Ces scripts ne suppriment pas les réservations existantes. Ils n’ont pas été exécutés pendant ce diagnostic.

## Réservations historiques

La création de `studio_bookings` n’importe aucune ancienne session Stripe. Le secours actuel se déclenche uniquement en cas d’erreur Supabase : dès que la table existe, une table vide produit une liste studio vide.

Avant de considérer la reprise terminée, importer les réservations historiques payées avec leurs métadonnées, en utilisant `stripe_session_id` pour éviter les doublons. Identifier séparément les sessions sans date valide, sans leur inventer de date. Ne pas rejouer les webhooks sans contrôler leurs autres effets (emails et agenda).

## Vérification après rétablissement

- Déployer le correctif d’affichage local.
- Vérifier que les deux API admin répondent correctement avec une session admin et que l’API studio utilise la base.
- Comparer les réservations importées aux paiements Stripe et vérifier les clients, dates, créneaux et montants.
- Vérifier la modification d’une réservation en base et la présence des colonnes de suivi des emails.

Le diagnostic n’a modifié ni la base de production, ni les clés Vercel, et n’a envoyé aucun email.
