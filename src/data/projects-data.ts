import { Project } from '@/lib/database.types'

/**
 * Projets hard-codés pour tester le portfolio
 * Une fois Supabase disponible, ces données seront remplacées par la base de données
 */
export const PROJECTS_DATA: Project[] = [
  {
    id: '1',
    title: 'Monela Hair',
    slug: 'site-ecommerce-premium',
    description: 'Développement d\'un site web e-commerce pour Monela Hair, une marque de perruques et extensions de cheveux.',
    content: `
      <div class="prose prose-invert">
        <p class="text-xl">Ce projet ambitieux consistait à créer une plateforme shopify. L'objectif était de fournir une expérience d'achat fluide et moderne tout en garantissant des performances optimales.</p>

        <h2 class="text-3xl font-black mt-12 mb-6">Défis Techniques</h2>
        <p>L'un des principaux défis était d'assurer la synchronisation en temps réel des stocks entre plusieurs canaux de vente. Mais surout la gestion des moyens de paiement pour la clientèle.</p>

        <h2 class="text-3xl font-black mt-12 mb-6">Solutions Apportées</h2>
        <ul class="space-y-3">
          <li>✅ Intégration Stripe pour les paiements sécurisés</li>
          <li>✅ Integration de Klarna , Mollie et les différent moyens de paiements</li>
        </ul>

        <h2 class="text-3xl font-black mt-12 mb-6">Résultats</h2>
        <p>Aujourd'hui, le site est presque à ça 100e commandes, on est content du résultats</p>
      </div>
    `,
    category: 'Web',
    tags: ['E-commerce', 'Shopify', 'Stripe',],
    technologies: ['Shopify'],
    client: 'Monela Hair',
    project_date: '2023-09-01',
    featured_image: '/images/projects/monela/nouveaute.png',
    images: [
      '/images/projects/monela/sublimez-vous.png',
      '/images/projects/monela/abonnez.png',
      '/images/projects/monela/nouveaute.png',
    ],
    featured: true,
    published: true,
    order_index: 1,
    created_at: new Date('2024-12-15').toISOString(),
    updated_at: new Date('2024-12-15').toISOString(),
  },
  {
    id: '2',
    title: 'Coriane - Refonte',
    slug: 'coriane-site-web',
    description: 'Proposition d\'une nouvelle identité pour le site web de Coriane une ESN parisienne',
    content: `
      <div class="prose prose-invert">
        <p class="text-xl text-gray-300 leading-relaxed">Refonte complète du site web de Coriane, une ESN parisienne spécialisée dans le recrutement IT. L'objectif : moderniser l'image de marque et créer une plateforme performante pour connecter talents et entreprises.</p>

        <h2 class="text-3xl font-black mt-12 mb-6">Le Défi</h2>
        <p class="text-gray-300">Coriane avait besoin d'un site capable de gérer deux audiences distinctes : les candidats à la recherche d'opportunités et les entreprises en quête de talents. Il fallait créer une expérience fluide pour chacun tout en intégrant un job board complet.</p>

        <h2 class="text-3xl font-black mt-12 mb-6">Processus Créatif</h2>
        <p class="text-gray-300 mb-6">Nous avons débuté par une phase approfondie de design thinking et d'analyse de l'existant pour comprendre les besoins des utilisateurs.(voir ci-dessous, l'existante)</p>
        <img src="/images/projects/coriane/cirorane-web.png" alt="Aperçu du site Coriane" class="rounded-lg my-8 w-full">
        <img src="/images/projects/coriane/ciorane-web2.png" alt="Aperçu du site Coriane" class="rounded-lg my-8 w-full">

        <h2 class="text-3xl font-black mt-12 mb-6 text-center">Solutions Apportées</h2>

        <h2 class="text-3xl font-black mt-12 mb-6">Pages Publiques</h2>
        <ul class="space-y-3 text-gray-300">
          <li>🏠 <strong>Accueil</strong> — Hero impactant avec navigation claire entre candidats et entreprises</li>
          <li>👤 <strong>Espace Candidats</strong> — Parcours, bibliothèque de certifications et coaching personnalisé</li>
          <li>🏢 <strong>Espace Entreprises</strong> — Offres, garantie de compétences et axes techniques</li>
          <li>📋 <strong>Portage Salarial</strong> — Offre transparente à 5% avec comparatifs détaillés</li>
          <li>💼 <strong>Job Board</strong> — Système dynamique avec filtres avancés</li>
          <li>📄 <strong>Détail d'offre</strong> — Compétences requises, durée et localisation</li>
        </ul>

        <h2 class="text-3xl font-black mt-12 mb-6">Back-Office Administration</h2>
        <ul class="space-y-3 text-gray-300">
          <li>🔐 Authentification sécurisée via Supabase</li>
          <li>✏️ Gestion complète des offres d'emploi (CRUD)</li>
          <li>🗄️ Base de données PostgreSQL cloud</li>
          <li>🛡️ Protection des accès et des données sensibles</li>
        </ul>

        <h2 class="text-3xl font-black mt-12 mb-6">Performance & Qualité</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div class="bg-white/5 rounded-lg p-4 border border-white/10">
            <p class="text-2xl font-bold text-white">100%</p>
            <p class="text-sm text-gray-400">Responsive Design</p>
          </div>
          <div class="bg-white/5 rounded-lg p-4 border border-white/10">
            <p class="text-2xl font-bold text-white">SSR</p>
            <p class="text-sm text-gray-400">Optimisation SEO Next.js</p>
          </div>
          <div class="bg-white/5 rounded-lg p-4 border border-white/10">
            <p class="text-2xl font-bold text-white">HTTPS</p>
            <p class="text-sm text-gray-400">Sécurité renforcée</p>
          </div>
          <div class="bg-white/5 rounded-lg p-4 border border-white/10">
            <p class="text-2xl font-bold text-white">&lt;2s</p>
            <p class="text-sm text-gray-400">Temps de chargement</p>
          </div>
        </div>
      </div>
    `,
    category: 'Web',
    tags: ['Site web', 'Refonte', 'UX/UI', 'Job board'],
    technologies: ['React', 'NextJs', 'Supabase', 'Tailwind CSS', 'TypeScript', 'Figma'],
    client: 'Coriane',
    project_date: '2026-01-25',
    featured_image: '/images/projects/coriane/coriane.png',
    images: [
      '/images/projects/coriane/coriane.png',
      '/images/projects/coriane/competence.png',
      '/images/projects/coriane/jobboard.png',
      '/images/projects/coriane/Quisommes.png',
    ],
    featured: true,
    published: true,
    order_index: 2,
    created_at: new Date('2024-11-20').toISOString(),
    updated_at: new Date('2024-11-20').toISOString(),
  },
  {
    id: '3',
    title: 'Reportage Photo Drone',
    slug: 'reportage-photo-drone',
    description: 'Captation aérienne et terrestre pour un projet immobilier de prestige avec vues spectaculaires.',
    content: `
      <div class="prose prose-invert">
        <p class="text-xl">Shooting photo et vidéo utilisant des drones de dernière génération pour capturer un ensemble immobilier d'exception surplombant la Méditerranée.</p>

        <h2 class="text-3xl font-black mt-12 mb-6">Équipement Utilisé</h2>
        <p>Nous avons déployé le DJI Mavic 3 Pro pour les prises aériennes, offrant une qualité d'image exceptionnelle même en conditions de lumière difficiles. Pour les photos terrestres, le Canon R5 avec objectifs prime garantit une netteté parfaite.</p>

        <h2 class="text-3xl font-black mt-12 mb-6">Conditions de Shooting</h2>
        <p>Le timing était crucial pour ce projet. Nous avons effectué plusieurs sessions à l'aube et au crépuscule pour capturer la golden hour, moment où la lumière sublime l'architecture du bâtiment.</p>
      </div>
    `,
    category: 'Photo',
    tags: ['Drone', 'Immobilier', 'Aérien', 'Architecture'],
    technologies: ['DJI Mavic 3 Pro', 'Canon R5', 'Adobe Lightroom', 'Photoshop', 'DaVinci Resolve'],
    client: 'Immobilier Premium SAS',
    project_date: '2024-10-05',
    featured_image: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1518005020951-eccb494ad742?w=1200&h=800&fit=crop',
    ],
    featured: false,
    published: true,
    order_index: 3,
    created_at: new Date('2024-10-05').toISOString(),
    updated_at: new Date('2024-10-05').toISOString(),
  },
  {
    id: '4',
    title: 'Application Mobile Fitness',
    slug: 'application-mobile-fitness',
    description: 'Application mobile de coaching sportif avec suivi personnalisé et plans d\'entraînement adaptatifs.',
    content: `
      <div class="prose prose-invert">
        <p class="text-xl">Développement iOS et Android d'une application fitness complète avec backend temps réel. Interface intuitive et gamification pour motiver les utilisateurs à atteindre leurs objectifs.</p>

        <h2 class="text-3xl font-black mt-12 mb-6">Fonctionnalités Clés</h2>
        <ul class="space-y-3">
          <li>💪 Plans d'entraînement personnalisés par IA</li>
          <li>📊 Tracking en temps réel des performances</li>
          <li>🏆 Système de badges et achievements</li>
          <li>👥 Communauté et défis entre amis</li>
          <li>📱 Synchronisation multi-appareils</li>
          <li>🎯 Objectifs SMART et rappels intelligents</li>
        </ul>

        <h2 class="text-3xl font-black mt-12 mb-6">Stack Technique</h2>
        <p>Nous avons choisi React Native avec Expo pour garantir une expérience native sur iOS et Android tout en partageant le maximum de code. Firebase gère l'authentification et la base de données en temps réel.</p>
      </div>
    `,
    category: 'Projects',
    tags: ['Mobile', 'Fitness', 'Health', 'React Native'],
    technologies: ['React Native', 'Expo', 'Firebase', 'TypeScript', 'Redux Toolkit'],
    client: 'FitLife App Inc',
    project_date: '2024-09-12',
    featured_image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=1200&h=800&fit=crop',
    ],
    featured: true,
    published: true,
    order_index: 4,
    created_at: new Date('2024-09-12').toISOString(),
    updated_at: new Date('2024-09-12').toISOString(),
  },
  {
    id: '5',
    title: 'Dashboard Analytics B2B',
    slug: 'dashboard-analytics-b2b',
    description: 'Interface de visualisation de données complexes pour une solution SaaS B2B avec exports automatisés.',
    content: `
      <div class="prose prose-invert">
        <p class="text-xl">Dashboard interactif permettant de visualiser des métriques business en temps réel. Intégration avec multiples sources de données et exports personnalisés en PDF, Excel et CSV.</p>

        <h2 class="text-3xl font-black mt-12 mb-6">Visualisations</h2>
        <p>Nous avons créé plus de 15 types de graphiques différents utilisant D3.js et Chart.js pour offrir une flexibilité maximale dans la présentation des données. Chaque visualisation est interactive et responsive.</p>

        <h2 class="text-3xl font-black mt-12 mb-6">Performance</h2>
        <p>Malgré le traitement de millions de points de données, le dashboard reste fluide grâce à des techniques de virtualisation et de lazy loading. Les requêtes sont optimisées avec des indexes PostgreSQL appropriés.</p>
      </div>
    `,
    category: 'Web',
    tags: ['SaaS', 'Dashboard', 'Data Viz', 'Analytics'],
    technologies: ['Next.js', 'D3.js', 'Chart.js', 'PostgreSQL', 'Prisma', 'TanStack Query'],
    client: 'DataFlow Inc',
    project_date: '2024-08-30',
    featured_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop',
    ],
    featured: false,
    published: true,
    order_index: 5,
    created_at: new Date('2024-08-30').toISOString(),
    updated_at: new Date('2024-08-30').toISOString(),
  },
  {
    id: '6',
    title: 'Portfolio Photographe',
    slug: 'portfolio-photographe',
    description: 'Site portfolio élégant pour un photographe professionnel avec galeries interactives et système de réservation.',
    content: `
      <div class="prose prose-invert">
        <p class="text-xl">Création d'un site portfolio sur mesure mettant en valeur le travail d'un photographe de mode et portrait. L'accent est mis sur l'expérience visuelle avec des transitions fluides et un design minimaliste.</p>

        <h2 class="text-3xl font-black mt-12 mb-6">Galeries Interactives</h2>
        <p>Nous avons développé un système de galeries personnalisé avec lazy loading progressif, lightbox immersive et navigation au clavier pour les power users. Les images sont optimisées automatiquement selon l'appareil.</p>

        <h2 class="text-3xl font-black mt-12 mb-6">Système de Réservation</h2>
        <p>Un module de prise de rendez-vous intégré permet aux clients de réserver directement des séances photo. Synchronisation avec Google Calendar et envoi automatique de confirmations.</p>
      </div>
    `,
    category: 'Photo',
    tags: ['Portfolio', 'Photography', 'Galerie', 'Booking'],
    technologies: ['Next.js', 'Sanity CMS', 'Cloudinary', 'Calendly API', 'Tailwind CSS'],
    client: 'Atelier Lumière',
    project_date: '2024-07-18',
    featured_image: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&h=800&fit=crop',
    ],
    featured: false,
    published: true,
    order_index: 6,
    created_at: new Date('2024-07-18').toISOString(),
    updated_at: new Date('2024-07-18').toISOString(),
  },
  {
    id: '7',
    title: 'Refonte UI/UX App Bancaire',
    slug: 'refonte-ui-ux-app-bancaire',
    description: 'Redesign complet de l\'interface d\'une application bancaire mobile pour améliorer l\'UX et l\'accessibilité.',
    content: `
      <div class="prose prose-invert">
        <p class="text-xl">Refonte totale de l'expérience utilisateur d'une application bancaire utilisée par plus de 100 000 clients. L'objectif était de simplifier les parcours tout en respectant les contraintes réglementaires strictes du secteur financier.</p>

        <h2 class="text-3xl font-black mt-12 mb-6">Recherche Utilisateur</h2>
        <p>Nous avons conduit 45 interviews utilisateurs et analysé plus de 10 000 sessions analytics pour identifier les points de friction majeurs. Ces insights ont guidé toutes nos décisions de design.</p>

        <h2 class="text-3xl font-black mt-12 mb-6">Résultats Mesurables</h2>
        <ul class="space-y-3">
          <li>📈 +45% de satisfaction utilisateur (NPS)</li>
          <li>⚡ -60% de temps pour effectuer un virement</li>
          <li>✅ +30% d'utilisateurs actifs mensuels</li>
          <li>♿ Conformité WCAG 2.1 niveau AA</li>
        </ul>
      </div>
    `,
    category: 'Design',
    tags: ['UX/UI', 'Mobile', 'Fintech', 'Accessibilité'],
    technologies: ['Figma', 'Principle', 'UserTesting', 'Hotjar', 'Maze'],
    client: 'BankTech Solutions',
    project_date: '2024-06-22',
    featured_image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=800&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&h=800&fit=crop',
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&h=800&fit=crop',
    ],
    featured: false,
    published: true,
    order_index: 7,
    created_at: new Date('2024-06-22').toISOString(),
    updated_at: new Date('2024-06-22').toISOString(),
  },
]
