Codes promo créateurs
====================

Installation
------------

1. Appliquer `studio-bookings.sql` si la table `studio_bookings` n’existe pas encore.
2. Exécuter `creator-promo-codes.sql` dans le SQL Editor du projet Supabase associé au site, avant de déployer le code Next.js.
3. Déployer puis ouvrir `/admin/promo-codes`, également accessible depuis la console et la page Réservations.
4. Créer un code de contrôle, vérifier son application sur `/reservation`, puis le désactiver après validation.

La migration est additive et réexécutable. La table des codes n’a aucune politique publique : le navigateur passe par les API et les écritures admin exigent une session valide. Aucune clé supplémentaire n’est nécessaire ; les accès Supabase et Stripe existants sont utilisés. Aucun code n’est créé automatiquement.

Comportement
------------

- Réduction en pourcentage (strictement entre 0 et 100) ou montant en euros, avec deux décimales maximum.
- Sélection des familles de prestations, expiration facultative et désactivation réversible.
- Les codes sont insensibles à la casse ; leur libellé est immuable après création pour conserver l’attribution.
- Un seul code par réservation, sans limite d’utilisations. Les formules sur devis et le paiement interne de test sont exclus.
- La réduction s’applique au total, options et forfait de nuit inclus. L’acompte de 30 % est calculé ensuite ; le solde est la différence exacte, en centimes.
- Une réduction aboutissant à un paiement inférieur à 0,50 € est refusée.
- L’API recalcule le prix et revalide le code lors de la création du paiement. Les conditions sont conservées dans la session Stripe : changer le code ensuite ne modifie pas un paiement déjà créé.
- Le webhook vérifie les montants et enregistre le code, le créateur et les montants dans `studio_bookings`. La clé unique `stripe_session_id` empêche le double comptage lors des reprises Stripe.
- Le suivi affiche les réservations confirmées et leurs paiements initiaux (acompte ou totalité). Il exclut les réservations annulées et ne constitue pas un calcul comptable après remboursements ou un système de commissions créateurs.

Validation locale
-----------------

`npm run test:promo` teste les calculs, l’éligibilité, les contrôles admin, la prévisualisation, la création Checkout, le webhook et les reprises sur erreur de base, avec les services externes simulés.

`npx tsc --noEmit` et `npm run build` vérifient l’intégration Next.js. La validation réelle du paiement, des emails et de la base nécessite la migration et les identifiants de l’environnement cible.
