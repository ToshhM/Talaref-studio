# Accès Admin — Réservations événement

## Avant de tester en prod

Le code compile et type-check correctement (`npx tsc --noEmit` OK), mais 3 choses doivent être en place côté prod avant que ça marche réellement :

### 1. Appliquer la migration SQL sur Supabase

Le fichier [`supabase/event-bookings.sql`](supabase/event-bookings.sql) crée la table `event_bookings`. Il n'est **pas appliqué automatiquement**.

→ Aller dans le dashboard Supabase du projet → **SQL Editor** → coller le contenu du fichier → **Run**.

Sans ça, toutes les routes (`/api/event-booking`, `/api/admin/event-bookings`) renverront une erreur 500.

### 2. Ajouter les variables d'environnement sur l'hébergeur (Vercel)

| Variable | Rôle | Déjà présente pour d'autres features ? |
|---|---|---|
| `ADMIN_PASSWORD` | Mot de passe pour se connecter à `/admin/login` | **Nouvelle — à ajouter** |
| `ADMIN_SESSION_SECRET` | Secret pour signer le cookie de session admin (HMAC) | **Nouvelle — à ajouter** |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet Supabase | Déjà utilisée (contact, projects) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role Supabase (accès admin, bypass RLS) | Déjà utilisée (Stripe webhook) |

Choisir un `ADMIN_PASSWORD` fort et un `ADMIN_SESSION_SECRET` aléatoire (ex: `openssl rand -hex 32`).

### 3. Redéployer

Une fois les variables ajoutées sur Vercel, redéployer (ou pousser un commit) pour qu'elles soient prises en compte.

## Comment se connecter à l'admin

1. Aller sur `https://talaref.co/admin/login` (ou l'URL de preview/staging équivalente).
2. Entrer le mot de passe défini dans `ADMIN_PASSWORD`.
3. Redirection automatique vers `/admin/bookings` — liste des réservations avec possibilité de modifier créneau/date/statut ou supprimer une réservation.
4. La session dure 12h (cookie httpOnly), pas besoin de se reconnecter à chaque visite.

Pas de notion d'utilisateur/email — un seul mot de passe partagé donne accès à tout l'admin.

## Ce qui a été testé localement

- Type-check (`tsc --noEmit`) : OK
- Build Next.js complet : **pas testé en local**, car il nécessite les variables d'env ci-dessus (le build échoue sinon dès qu'il évalue les modules serveur qui lisent `process.env`).

→ Avant de considérer que c'est "fonctionnel en prod", il faut au minimum : appliquer la migration SQL, poser les 2 nouvelles variables, redéployer, puis tester le parcours complet (réservation publique → apparition dans `/admin/bookings` → modification/suppression).
