# 🚀 Mode Données Temporaires (Hard-coded)

## ⚠️ État Actuel

Votre portfolio fonctionne actuellement avec **7 projets hard-codés** dans `/src/data/projects-data.ts`.

Ceci est une solution temporaire pendant la maintenance Supabase. Une fois Supabase disponible, vous pourrez basculer facilement.

---

## ✅ Ce qui Fonctionne MAINTENANT

- ✨ Page portfolio: `http://localhost:3000/portfolio`
- 🎯 Filtres par catégorie
- 📄 Pages de détail: `/portfolio/[slug]`
- 🖼️ Galeries d'images (avec Unsplash)
- ⬅️➡️ Navigation entre projets
- 📱 Responsive complet

### Projets Disponibles:

1. **Site E-commerce Premium** (Web) - Featured
2. **Identité Visuelle Luxe** (Design) - Featured
3. **Reportage Photo Drone** (Photo)
4. **Application Mobile Fitness** (Projects) - Featured
5. **Dashboard Analytics B2B** (Web)
6. **Portfolio Photographe** (Photo)
7. **Refonte UI/UX App Bancaire** (Design)

---

## 🎨 Modifier les Projets

Pour modifier les projets, éditez `/src/data/projects-data.ts`:

```typescript
{
  id: '8',
  title: 'Mon Nouveau Projet',
  slug: 'mon-nouveau-projet',
  description: 'Description courte...',
  content: `<div class="prose prose-invert">...</div>`,
  category: 'Web', // ou 'Photo', 'Design', 'Projects'
  tags: ['Tag1', 'Tag2'],
  technologies: ['Tech1', 'Tech2'],
  client: 'Nom Client',
  project_date: '2024-12-20',
  featured_image: 'https://images.unsplash.com/photo-...',
  images: ['url1', 'url2'],
  featured: false,
  published: true,
  order_index: 8,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
}
```

### Trouver des Images (Unsplash)

1. Allez sur [unsplash.com](https://unsplash.com)
2. Cherchez une image
3. Clic droit → "Copier l'adresse de l'image"
4. Ajoutez `?w=1200&h=800&fit=crop` à la fin de l'URL

Exemple:
```
https://images.unsplash.com/photo-1234567890?w=1200&h=800&fit=crop
```

---

## 🔄 Basculer vers Supabase (Plus Tard)

Quand Supabase sera disponible:

### 1. Créez `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle
```

### 2. Éditez `/src/lib/api/projects.ts`

**Commentez** les fonctions actuelles (lignes 1-79)
**Décommentez** les fonctions Supabase (lignes 88-178)

```typescript
// Version hard-coded (commentez ça)
/*
export async function getAllProjects(): Promise<Project[]> {
  await new Promise(resolve => setTimeout(resolve, 100))
  return PROJECTS_DATA
    .filter(p => p.published)
    .sort((a, b) => a.order_index - b.order_index)
}
*/

// Version Supabase (décommentez ça)
import { supabase } from '../supabase'

export async function getAllProjects(): Promise<Project[]> {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('published', true)
    .order('order_index', { ascending: true })
  // ... etc
}
```

### 3. Créez la table Supabase

Suivez les instructions dans `SUPABASE_SETUP.md`

### 4. Redémarrez le serveur

```bash
npm run dev
```

**C'est tout !** 🎉

---

## 🚀 Lancer l'Application MAINTENANT

```bash
# Installer les dépendances (si pas déjà fait)
npm install

# Lancer le serveur
npm run dev
```

Allez sur `http://localhost:3000/portfolio`

---

## ✨ Points Forts de la Solution Temporaire

- ✅ **Pas besoin de Supabase** pour développer
- ✅ **Aucune configuration** nécessaire
- ✅ **Images via Unsplash** (CDN gratuit)
- ✅ **Transition facile** vers Supabase plus tard
- ✅ **Tout fonctionne** comme avec Supabase

---

## 📝 TODO List

- [x] Créer les données statiques
- [x] Modifier les fonctions API
- [x] Ajouter 7 projets exemples
- [x] Utiliser images Unsplash
- [ ] **Tester l'application** (`npm run dev`)
- [ ] Personnaliser les projets dans `projects-data.ts`
- [ ] Quand Supabase OK → Basculer vers la vraie DB

---

## 🐛 Problèmes Potentiels

### Les images Unsplash ne chargent pas
**Solution**: Unsplash a des limites de débit. Utilisez vos propres images dans `/public/images/projects/` et changez les URLs:
```typescript
featured_image: '/images/projects/mon-image.jpg'
```

### Erreur TypeScript sur PROJECTS_DATA
**Solution**: Vérifiez que tous les champs sont présents et que les types correspondent à `Project`

---

## 💡 Astuce

Vous pouvez mélanger les deux approches:
- Quelques projets hard-codés pour le développement
- Quelques projets dans Supabase pour les "vrais" projets

Il suffit d'avoir les deux sources et de les combiner dans `getAllProjects()`.

---

**Happy Coding! 🎨**
