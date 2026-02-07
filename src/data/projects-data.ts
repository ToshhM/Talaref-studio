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
    title: 'ciorane - Refonte',
    slug: 'ciorane-site-web',
    description: 'Proposition d\'une nouvelle identité pour le site web de Ciorane une ESN parisienne',
    content: `
    <div class="flex justify-center my-8">
          <a href="https://ciorane-website.vercel.app/" target="_blank" rel="noopener noreferrer" style="background-color: #3d4f35; border: 2px solid #c8ff00; color: #c8ff00;" class="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-full hover:opacity-90 transition-all duration-300 uppercase tracking-wider">Voir le site web</a>
        </div>
      <div class="prose prose-invert">
        <p class="text-xl text-gray-300 leading-relaxed">Refonte complète du site web de Ciorane, une ESN parisienne spécialisée dans le recrutement IT. L'objectif : moderniser l'image de marque et créer une plateforme performante pour connecter talents et entreprises.</p>

        <h2 class="text-3xl font-black mt-12 mb-6">Le Défi</h2>
        <p class="text-gray-300">Ciorane avait besoin d'un site capable de gérer deux audiences distinctes : les candidats à la recherche d'opportunités et les entreprises en quête de talents. Il fallait créer une expérience fluide pour chacun tout en intégrant un job board complet.</p>

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
    client: 'Ciorane',
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
    title: 'Alter - Shooting Photo',
    slug: 'alter-shooting-photo',
    description: 'Shooting photo pour une marque underground parisienne',
    content: `
      <div class="prose prose-invert">
        <p class="text-xl">Shooting photo pour capturer les pièces des créateurs pour une marque parisienne de vêtement.</p>

        <h2 class="text-3xl font-black mt-12 mb-6">Équipement Utilisé</h2>
        <p>Nous avons utilisé le Sony A7IV avec objectifs 24-70mm f/2.8 pour garantir une netteté parfaite.</p>

        <h2 class="text-3xl font-black mt-12 mb-6">Conditions de Shooting</h2>
        <p>Pour ce projet nous étions au studio Honoré à Paris, c'était ma première fois dans ce studio qui est très bien équipé et choisi par le client.
        En tant normal je shoot au studio NZO à levallois perret, qui est aussi très bien équipé. Nous aurons surement l'occasion de retourner dans ce studio pour de futurs projets.</p>
      </div>
    `,
    category: 'Photo',
    tags: ['Photo', 'Mode', 'Portrait', 'Studio'],
    technologies: ['Sony A7IV', '24-70mm f/2.8', 'Adobe Lightroom', 'Photoshop',],
    client: 'Alter',
    project_date: '2024-14-01',
    featured_image: 'http://www.image-heberg.fr/files/1769892078757193977.jpg',
    images: [
      'https://www.image-heberg.fr/files/176989218170147494.jpg',
      'http://www.image-heberg.fr/files/17698924203016739910.jpg',
      'http://www.image-heberg.fr/files/17698924781155177515.jpg',
      'http://www.image-heberg.fr/files/17698925113046017969.jpg',
    ],
    featured: false,
    published: true,
    order_index: 3,
    created_at: new Date('2024-10-05').toISOString(),
    updated_at: new Date('2024-10-05').toISOString(),
  },

  {
    id: '5',
    title: 'FootFactory',
    slug: 'footfactory',
    description: 'Plateforme sociale et innovante pour révéler des talents dans le foot amateur. ',
    content: `
      <div class="prose prose-invert">
        <div class="flex justify-center my-8">
          <a href="https://zingy-tarsier-b543e4.netlify.app" target="_blank" rel="noopener noreferrer" style="background-color: #3d4f35; border: 2px solid #c8ff00; color: #c8ff00;" class="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-full hover:opacity-90 transition-all duration-300 uppercase tracking-wider">Voir le site web</a>
        </div>
        <p class="text-xl">🧠 Idée : plateforme sociale et innovante pour révéler des talents dans le foot amateur. 
        <br>🎯 Objectifs : donner de la visibilité aux joueurs via des trophées, de la com’ personnalisée, du contenu, du coaching.</p>

        <h2 class="text-3xl font-black mt-12 mb-6">Fonctionnalités</h2>
        <p>🔧 Fonctionnalités clés :<br>
        ● Présentation des projets (IA, trophée, com digitale, investisseurs).<br>
        ● Système de vote (par coachs et public, pondéré), sur les match français U17 U19<br>
        ● Intégration avec d’autres plateformes (Footadata, MTD).<br>
        ● Formulaires dynamiques.<br>
        ● Landing pages événementielles.</p>
    `,
    category: 'Web',
    tags: ['SaaS', 'Dashboard', 'Football', 'Analytics'],
    technologies: ['Next.js', 'reactjs', 'tailwindcss', 'netlify', 'Supabase',],
    client: 'HKZ Media',
    project_date: '2024-03-30',
    featured_image: 'http://www.image-heberg.fr/files/17698928181098605431.png',
    images: [
      'http://www.image-heberg.fr/files/17698928181098605431.png',
      'http://www.image-heberg.fr/files/17698930504078779800.png',
      'https://www.image-heberg.fr/files/17698930834074723247.png',
    ],
    featured: false,
    published: true,
    order_index: 5,
    created_at: new Date('2024-08-30').toISOString(),
    updated_at: new Date('2024-08-30').toISOString(),
  },
  {
    id: '6',
    title: 'Shooting Monela Hair',
    slug: 'shooting-monela-hair',
    description: 'Shooting pour la marque Monela Hair, extensions et perruques',
    content: `
      <div class="prose prose-invert">
        <p class="text-xl">-La marque Monela Hair est spécialisée dans la vente de perruques et d'extensions de cheveux de haute qualité. Nous avons réalisé un shooting photo pour mettre en valeur leurs produits et créer un contenu visuel attrayant pour leur site web et leurs réseaux sociaux.</p>

        <h2 class="text-3xl font-black mt-12 mb-6">Lieux</h2>
        <p>Nous avons réalisé ce shooting dans un cadre naturel et lumineux, dans le studio photo NZO STUDIO PROD à levallois perret </p>
      </div>
    `,
    category: 'Photo',
    tags: ['Branding', 'Photography', 'Shooting', 'Booking'],
    technologies: ['Sony A7IV', 'Godox SL60W', '24mm-70mm F2/8'],
    client: 'Monela Hair',
    project_date: '2025-10-28',
    featured_image: 'https://i.postimg.cc/jjMfnns0/monela_102.jpg',
    images: [
      'https://i.postimg.cc/DzxG447C/monela_22.jpg',
      'https://i.postimg.cc/hG2mQQSF/monela_141.jpg',
      'https://i.postimg.cc/CKc8nnw2/monela_53.jpg',
      'https://i.postimg.cc/TPtb55TS/monela_113.jpg',
    ],
    featured: false,
    published: true,
    order_index: 6,
    created_at: new Date('2024-07-18').toISOString(),
    updated_at: new Date('2024-07-18').toISOString(),
  },
  {
    id: '7',
    title: 'Application mobile - Soon+',
    slug: 'soon-application-mobile',
    description: 'Création d\'une application mobile IOS, qui compte les jours avant un evenement',
    content: `
      <div class="prose prose-invert">
        <p class="text-xl">Le but de l'application est simpliste je voulais créer cette application à l'aide du vibe coding pour comprendre
        comment avec l'ia on peut réaliser des applications pour pouvoir proposer ce genre de service et des clients potentiels</p>

        <h2 class="text-3xl font-black mt-12 mb-6">L'idée</h2>
        <p>L'idée de l'application est simpliste j'avais vu su twwitter que des applications de compteur de jouer avzant Noel arrivait à générer des fonds j'ai donc voulu faire ma propre version  en essayant d'aller bien plus
        loin en créant plusieurs événement types nouvel an halloween, le black friday. Mais aussi de proposer à des utilisateurs de créer leurs propres événements. Le côté innovant c'est la partie personnalisation de l'application, une fois l'évènement créer on peut l'on faire un widget disponible sur l'écran d'accueil </p>

        <h2 class="text-3xl font-black mt-12 mb-6">La suite </h2>
        <ul class="space-y-3">
          <li>Etape 1 : Finaliser la partie paiement. En effet l'application est gratuite mais il y a des fonctionnalités payantes le nombre de création d'événement est limité à 3. Il faut aussi payer pour pouvoir ajouter des images à ses widgets personnalisés sur son écran d'accueil.</li>
          <li>Etape 2 : Publication de l'application sur Apple Store </li>
          <li>Etape 3 : Marketer l'application et générer des ventes (ce sera la partie la plus dure car je ne suis pas un marketeux dans l'âme)</li>
          <li>Etape 4 : Retour utilisateurs et amélioration de l'application</li>
        </ul>
      </div>
    `,
    category: 'Web',
    tags: ['UX/UI', 'Mobile', 'IOS', 'Compteur'],
    technologies: ['Figma', 'React Native',],
    client: 'Freelance',
    project_date: '2026-01-25',
    featured_image: 'http://www.image-heberg.fr/files/17701265441175889774.png',
    images: [
      'https://www.image-heberg.fr/files/17701263154169769775.jpg',
      'https://www.image-heberg.fr/files/1770126329308773760.jpg',
      'http://www.image-heberg.fr/files/17701266561175889774.jpg',
      'https://www.image-heberg.fr/files/17701263743907343931.jpg',
    ],
    featured: false,
    published: true,
    order_index: 7,
    created_at: new Date('2024-06-22').toISOString(),
    updated_at: new Date('2024-06-22').toISOString(),
  },
  {
    id: '8',
    title: 'Nzo Studio Prod refonte',
    slug: 'nzo-studio-prod-refonte',
    description: 'Refonte du site web de Nzo Studio Prod',
    content: `
    <div class="flex justify-center my-8">
          <a href="https://nzo-studio-prod.vercel.app/" target="_blank" rel="noopener noreferrer" style="background-color: #3d4f35; border: 2px solid #c8ff00; color: #c8ff00;" class="inline-flex items-center gap-2 px-8 py-4 font-bold rounded-full hover:opacity-90 transition-all duration-300 uppercase tracking-wider">Voir le site web</a>
        </div>
     <div class="prose prose-invert">
  <p class="text-xl">
    Dans la continuité de son évolution, N’zo Prod a récemment fait l’objet d’une seconde refonte complète de son site web.
    L’objectif était d’affirmer plus clairement l’identité de l’agence tout en proposant une expérience plus immersive
    et plus fluide. Cette nouvelle version met en lumière l’univers événementiel B2B de N’zo Prod, son positionnement
    “sérieux sans se prendre au sérieux”, ainsi que l’ensemble de ses expertises : événements corporate, production
    audiovisuelle, studio photo ouvert au public, formation et coaching en communication. Le site s’appuie désormais
    sur un design plus moderne, une structure plus claire et un nouveau showreel pensé comme une véritable immersion
    dans les productions, les événements de gala et les projets créatifs de l’agence.
  </p>
</div>
    `,
    category: 'Web',
    tags: ['WEB', 'REFONTE', 'UX/UI',],
    technologies: ['Figma', 'React', 'Vercel'],
    client: 'NZO PROD',
    project_date: '2026-02-04',
    featured_image: 'http://www.image-heberg.fr/files/17701726452507479635.png',
    images: [
      'http://www.image-heberg.fr/files/17701727414030467405.png',
      'http://www.image-heberg.fr/files/1770173067542683382.png',
      'https://www.image-heberg.fr/files/17701729112165786397.png',
     ],
    featured: false,
    published: true,
    order_index: 7,
    created_at: new Date('2024-06-22').toISOString(),
    updated_at: new Date('2024-06-22').toISOString(),
  },
]
