# Images des Projets Portfolio

Ce dossier contient les images utilisées pour le portfolio.

## Structure recommandée

```
projects/
├── placeholder-1.jpg
├── placeholder-2.jpg
├── placeholder-3.jpg
├── placeholder-4.jpg
├── placeholder-5.jpg
├── placeholder-6.jpg
├── placeholder-7.jpg
└── placeholder-project.jpg (image par défaut)
```

## Spécifications des Images

- **Format**: JPG, PNG, ou WebP
- **Dimensions recommandées**: 1200x800px minimum (ratio 3:2)
- **Taille fichier**: < 500KB par image (optimisé)
- **Nommage**: Utiliser le kebab-case avec des noms descriptifs

## Où placer vos images

1. Ajoutez vos images dans ce dossier (`/public/images/projects/`)
2. Dans Supabase, référencez les images avec le chemin: `/images/projects/nom-image.jpg`
3. Les images seront automatiquement optimisées par Next.js Image

## Images placeholder

Pour tester le portfolio, vous pouvez:
- Utiliser des images d'unsplash.com
- Utiliser des générateurs de placeholder (placeholder.com, picsum.photos)
- Créer vos propres images de test

## Exemple dans Supabase

```sql
INSERT INTO projects (
  ...
  featured_image,
  images
) VALUES (
  ...
  '/images/projects/mon-projet.jpg',
  ARRAY['/images/projects/mon-projet-1.jpg', '/images/projects/mon-projet-2.jpg']
);
```
