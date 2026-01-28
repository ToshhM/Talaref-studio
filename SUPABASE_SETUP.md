# Configuration Supabase pour le Portfolio

Ce guide vous explique comment configurer Supabase pour le système de portfolio.

## Étape 1: Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Connectez-vous ou créez un compte
3. Cliquez sur "New Project"
4. Remplissez les informations:
   - **Name**: talaref-portfolio (ou votre choix)
   - **Database Password**: Créez un mot de passe fort (notez-le!)
   - **Region**: Choisissez la région la plus proche
5. Cliquez sur "Create new project"
6. Attendez quelques minutes que le projet soit créé

## Étape 2: Récupérer vos credentials

1. Dans le dashboard Supabase, allez dans "Settings" (icône engrenage)
2. Cliquez sur "API" dans le menu de gauche
3. Copiez les valeurs suivantes:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Longue clé commençant par `eyJh...`

## Étape 3: Configurer les variables d'environnement

1. Créez un fichier `.env.local` à la racine du projet
2. Copiez le contenu de `.env.example`
3. Remplacez les valeurs par vos credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_publique
```

## Étape 4: Créer la table `projects`

1. Dans Supabase, allez dans "SQL Editor" (menu de gauche)
2. Cliquez sur "New Query"
3. Copiez-collez le SQL suivant:

```sql
-- Create projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    category TEXT NOT NULL CHECK (category IN ('Photo', 'Web', 'Design', 'Projects')),
    tags TEXT[] DEFAULT '{}',
    technologies TEXT[] DEFAULT '{}',
    client TEXT,
    project_date DATE,
    featured_image TEXT,
    images TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    published BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_published ON projects(published);
CREATE INDEX idx_projects_featured ON projects(featured);

-- Create function to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Public can view published projects"
    ON projects
    FOR SELECT
    USING (published = true);

-- Create policy for authenticated users (optional, for admin)
CREATE POLICY "Authenticated users can manage projects"
    ON projects
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
```

4. Cliquez sur "Run" (ou F5)
5. Vérifiez qu'il n'y a pas d'erreurs

## Étape 5: Ajouter des données de test

1. Toujours dans le SQL Editor, créez une nouvelle requête
2. Copiez-collez le SQL suivant pour ajouter des projets de test:

```sql
INSERT INTO projects (
    title,
    slug,
    description,
    content,
    category,
    tags,
    technologies,
    client,
    project_date,
    featured_image,
    images,
    featured,
    published,
    order_index
)
VALUES
-- Projet 1: E-commerce Web
(
    'Site E-commerce Premium',
    'site-ecommerce-premium',
    'Développement d''une plateforme e-commerce moderne avec paiements intégrés et gestion de stock en temps réel.',
    '<p>Ce projet ambitieux consistait à créer une plateforme e-commerce complète de A à Z. L''objectif était de fournir une expérience d''achat fluide et moderne tout en garantissant des performances optimales.</p><h2>Défis Techniques</h2><p>L''un des principaux défis était d''assurer la synchronisation en temps réel des stocks entre plusieurs canaux de vente. Nous avons mis en place une architecture événementielle utilisant Supabase Realtime.</p>',
    'Web',
    ARRAY['E-commerce', 'Next.js', 'Stripe', 'Supabase'],
    ARRAY['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Stripe API', 'Framer Motion'],
    'TechStore Paris',
    '2024-12-15',
    '/images/projects/placeholder-1.jpg',
    ARRAY['/images/projects/placeholder-1.jpg', '/images/projects/placeholder-2.jpg'],
    true,
    true,
    1
),

-- Projet 2: Design Identité Visuelle
(
    'Identité Visuelle Luxe',
    'identite-visuelle-luxe',
    'Création d''une identité de marque complète pour une marque de luxe parisienne incluant logo, charte graphique et déclinaisons.',
    '<p>Mission de branding pour une maison de luxe émergente à Paris. Le projet incluait la création d''un logo élégant, d''une charte graphique sophistiquée et de nombreuses déclinaisons print et digital.</p>',
    'Design',
    ARRAY['Branding', 'Logo', 'Luxe', 'Print'],
    ARRAY['Figma', 'Adobe Illustrator', 'Adobe Photoshop', 'InDesign'],
    'Maison Laurent',
    '2024-11-20',
    '/images/projects/placeholder-3.jpg',
    ARRAY['/images/projects/placeholder-3.jpg', '/images/projects/placeholder-4.jpg'],
    true,
    true,
    2
),

-- Projet 3: Photographie Drone
(
    'Reportage Photo Drone',
    'reportage-photo-drone',
    'Captation aérienne et terrestre pour un projet immobilier de prestige avec vues spectaculaires.',
    '<p>Shooting photo et vidéo utilisant des drones de dernière génération pour capturer un ensemble immobilier d''exception.</p><h2>Équipement Utilisé</h2><p>DJI Mavic 3 Pro pour les prises aériennes, et Canon R5 pour les photos terrestres.</p>',
    'Photo',
    ARRAY['Drone', 'Immobilier', 'Aérien', 'Architecture'],
    ARRAY['DJI Mavic 3 Pro', 'Adobe Lightroom', 'Photoshop', 'DaVinci Resolve'],
    'Immobilier Premium SAS',
    '2024-10-05',
    '/images/projects/placeholder-5.jpg',
    ARRAY['/images/projects/placeholder-5.jpg', '/images/projects/placeholder-6.jpg', '/images/projects/placeholder-7.jpg'],
    false,
    true,
    3
),

-- Projet 4: Application Mobile
(
    'Application Mobile Fitness',
    'application-mobile-fitness',
    'Application mobile de coaching sportif avec suivi personnalisé et plans d''entraînement adaptatifs.',
    '<p>Développement iOS et Android d''une app fitness complète avec backend temps réel. Interface intuitive et gamification pour motiver les utilisateurs.</p>',
    'Projects',
    ARRAY['Mobile', 'Fitness', 'Health', 'React Native'],
    ARRAY['React Native', 'Expo', 'Firebase', 'TypeScript', 'Redux'],
    'FitLife App Inc',
    '2024-09-12',
    '/images/projects/placeholder-2.jpg',
    ARRAY['/images/projects/placeholder-2.jpg'],
    true,
    true,
    4
),

-- Projet 5: Dashboard Analytics
(
    'Dashboard Analytics B2B',
    'dashboard-analytics-b2b',
    'Interface de visualisation de données complexes pour une solution SaaS B2B avec exports automatisés.',
    '<p>Dashboard interactif permettant de visualiser des métriques business en temps réel. Intégration avec multiples sources de données et exports personnalisés.</p>',
    'Web',
    ARRAY['SaaS', 'Dashboard', 'Data Viz', 'Analytics'],
    ARRAY['Next.js', 'D3.js', 'Chart.js', 'PostgreSQL', 'Prisma'],
    'DataFlow Inc',
    '2024-08-30',
    '/images/projects/placeholder-4.jpg',
    ARRAY['/images/projects/placeholder-4.jpg', '/images/projects/placeholder-1.jpg'],
    false,
    true,
    5
);
```

3. Cliquez sur "Run"
4. Vérifiez qu'il n'y a pas d'erreurs

## Étape 6: Vérifier les données

1. Dans Supabase, allez dans "Table Editor"
2. Sélectionnez la table "projects"
3. Vous devriez voir vos 5 projets de test

## Étape 7: Tester l'application

1. Retournez dans votre terminal
2. Lancez le serveur de développement:
   ```bash
   npm run dev
   ```
3. Allez sur `http://localhost:3000/portfolio`
4. Vous devriez voir vos projets s'afficher!

## Ajout d'Images Réelles

Pour ajouter vos vraies images:

1. Placez vos images dans `/public/images/projects/`
2. Mettez à jour les projets dans Supabase:
   ```sql
   UPDATE projects
   SET featured_image = '/images/projects/votre-vraie-image.jpg',
       images = ARRAY['/images/projects/img1.jpg', '/images/projects/img2.jpg']
   WHERE slug = 'slug-du-projet';
   ```

## Ajouter un Nouveau Projet

```sql
INSERT INTO projects (
    title,
    slug,
    description,
    content,
    category,
    tags,
    technologies,
    client,
    project_date,
    featured_image,
    images,
    featured,
    published,
    order_index
) VALUES (
    'Titre du Projet',
    'slug-du-projet',
    'Description courte du projet.',
    '<p>Contenu HTML complet du projet...</p>',
    'Web', -- ou 'Photo', 'Design', 'Projects'
    ARRAY['Tag1', 'Tag2', 'Tag3'],
    ARRAY['Tech1', 'Tech2', 'Tech3'],
    'Nom du Client',
    '2024-12-01',
    '/images/projects/mon-projet.jpg',
    ARRAY['/images/projects/mon-projet-1.jpg', '/images/projects/mon-projet-2.jpg'],
    false, -- true si projet mis en avant
    true,  -- true si publié
    10     -- ordre d'affichage
);
```

## Troubleshooting

### Erreur: "Missing Supabase environment variables"
- Vérifiez que `.env.local` existe et contient les bonnes valeurs
- Redémarrez le serveur de développement (`npm run dev`)

### Les projets ne s'affichent pas
- Vérifiez que les projets ont `published = true`
- Vérifiez vos credentials Supabase dans `.env.local`
- Regardez la console du navigateur pour les erreurs

### Les images ne s'affichent pas
- Vérifiez que les images existent dans `/public/images/projects/`
- Vérifiez les chemins dans la base de données (doivent commencer par `/images/projects/`)

## Support

Pour plus d'aide:
- Documentation Supabase: https://supabase.com/docs
- Documentation Next.js: https://nextjs.org/docs
