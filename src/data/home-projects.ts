/**
 * Les réalisations affichées en onglets sur la page d'accueil.
 *
 * Un clic sur un onglet change le texte, les chiffres ET le carrousel
 * de photos. Pour ajouter un projet, il suffit d'ajouter une entrée
 * ici — aucun composant à toucher.
 *
 * Les photos sans source restent masquees jusqu'a leur ajout.
 */

export type Projet = {
  id: string;
  /** Libellé court affiché dans l'onglet. */
  onglet: string;
  titre: string;
  secteur: string;
  texte: string;
  /** Deux à trois résultats maximum : au-delà, plus rien ne ressort. */
  kpis: { valeur: string; libelle: string }[];
  photos: {
    src?: string;
    alt: string;
    /** Si renseigné, la vignette (src) sert d'affiche et le clic lance cette vidéo à la place de la photo. */
    video?: string;
  }[];
};

export const PROJETS: Projet[] = [
  {
    id: "olivia",
    onglet: "Olivia Yacé",
    titre: "Olivia Yacé — Fashion Week de Paris",
    secteur: "Mode & beauté",
    texte:
      "Miss Univers Côte d'Ivoire arrive à Paris pour une semaine de défilés, sans dispositif de contenu organisé. Nous l'accompagnons sur cinq défilés, avec une production quotidienne et une diffusion en continu sur Instagram et TikTok.",
    kpis: [
      { valeur: "1,88 M", libelle: "vues cumulées Instagram + TikTok" },
      { valeur: "5", libelle: "défilés couverts en une semaine" },
    ],
    photos: [
      { src: "/images/home/olivia-fashion-week.jpg", alt: "Olivia Yacé en robe rouge pour la Fashion Week de Paris" },
      { src: "/images/home/olivia-portrait.webp", alt: "Portrait d'Olivia Yacé en robe vert clair pendant la Fashion Week" },
      { src: "/images/home/olivia-inclover.webp", alt: "Olivia Yacé et une invitée lors du défilé Inclover" },
      { src: "/images/home/olivia-front-row.webp", alt: "Olivia Yacé au premier rang d'un défilé pendant la Fashion Week" },
    ],
  },
  {
    id: "denza",
    onglet: "DENZA · BYD",
    titre: "DENZA (BYD) — lancement européen",
    secteur: "Automobile",
    texte:
      "Une marque automobile chinoise se présente pour la première fois au marché européen, à l'Opéra Garnier. Couverture photo et vidéo de la soirée, valorisation des véhicules et des invités, contenus presse et réseaux livrés dans la foulée.",
    kpis: [
      { valeur: "Opéra Garnier", libelle: "révélation de marque, médias et créateurs réunis" },
      { valeur: "48 h", libelle: "premiers formats courts livrés" },
    ],
    photos: [
      { src: "/images/home/denza-vehicule.jpg", alt: "DENZA Z9 GT présentée devant l'Opéra Garnier" },
      { src: "/images/home/denza-presentation.jpg", alt: "Présentation de la DENZA Z9 GT lors du lancement parisien" },
      { src: "/images/home/denza-lancement.jpg", alt: "Invitée près du véhicule lors du lancement DENZA" },
    ],
  },
  {
    id: "geely",
    onglet: "Geely",
    titre: "Geely — lancement de l'E2 au pied de la Tour Eiffel",
    secteur: "Automobile · Lifestyle",
    texte:
      "Quatre mois après son arrivée en France, le constructeur chinois Geely choisit la mode plutôt que le luxe exclusif pour lancer sa citadine électrique E2 : un village sur les quais de Seine mêlant automobile, mode, beauté et bien-être, avec Printemps et Mod'Art comme partenaires. Six photographes TALAREF mobilisés sur trois jours pour couvrir le lancement.",
    kpis: [
      { valeur: "3 jours", libelle: "28-30 août, quais de Seine face à la Tour Eiffel" },
      { valeur: "6 photographes", libelle: "mobilisés sur le village Geely" },
    ],
    photos: [
      { src: "/images/home/geely-eiffel-tower.jpg", alt: "Invitée posant devant la Geely E2 avec la Tour Eiffel en arrière-plan" },
      { src: "/images/home/geely-e2-seine.jpg", alt: "Invitée devant la Geely E2 sur les quais de Seine, Palais de Chaillot en arrière-plan" },
      { src: "/images/home/geely-e2-village.jpg", alt: "Mannequin posant sur la Geely E2 dans le village de l'événement" },
      { src: "/images/home/geely-eiffel-robe.jpg", alt: "Invitée en robe fleurie devant la Tour Eiffel et la Geely E2" },
    ],
  },
  {
    id: "psg",
    onglet: "PSG",
    titre: "PSG — média day et handball",
    secteur: "Sport",
    texte:
      "Notre fondateur est photographe accrédité PSG. Captation de la séance d'entraînement avant la demi-finale de Youth League, interview de Yohan Cabaye, et production des images de Wallem Peleka en match.",
    kpis: [
      { valeur: "Accrédité", libelle: "photographe PSG" },
      { valeur: "Terrain + studio", libelle: "du match au réseau social du club" },
    ],
    photos: [
      { alt: "Entraînement" },
      { alt: "Interview" },
      { src: "/images/home/psg-champions-starligue.jpg", alt: "L'équipe de handball du PSG sacrée championne de LNH Starligue 2025-2026, confettis sur le podium" },
      { alt: "Vestiaire" },
    ],
  },
  {
    id: "printemps",
    onglet: "Printemps",
    titre: "Printemps — événement client privé",
    secteur: "Retail · corporate",
    texte:
      "Soirée privée réservée aux meilleurs clients du Printemps, avec présentations produit. Capsule vidéo du défilé et couverture photo de la soirée, livrées pour un usage interne comme pour les réseaux.",
    kpis: [
      { valeur: "Capsule vidéo", libelle: "défilé de mode" },
      { valeur: "Événement privé", libelle: "clients VIP, discrétion requise" },
    ],
    photos: [
      {
        src: "/images/home/printemps-defile-poster.jpg",
        alt: "Défilé Printemps Vélizy, mode automne-hiver",
        video: "/videos/printemps-defile.mp4",
      },
      { src: "/images/home/printemps-presentation.jpg", alt: "Présentation d'accessoires lors de la soirée privée Printemps" },
      { src: "/images/home/printemps-details.jpg", alt: "Sacs et cadeaux Printemps et Chanel" },
      { src: "/images/home/printemps-invites.jpg", alt: "Invitées à la soirée privée Printemps" },
    ],
  },
  {
    id: "monela",
    onglet: "Monela Hair",
    titre: "Monela Hair — campagne marketing",
    secteur: "Beauté · e-commerce",
    texte:
      "Marque de raw hair et virgin hair, forte concurrence, présence en ligne à structurer. Création de la campagne marketing complète, production des visuels et activation par nos ambassadrices.",
    kpis: [
      { valeur: "30 k€", libelle: "de chiffre d'affaires sur l'année 2025" },
      { valeur: "Campagne", libelle: "visuels + activation ambassadrices" },
    ],
    photos: [
      { src: "/images/home/monela-campagne.jpg", alt: "Trois modèles de la campagne Monela Hair" },
      { src: "/images/home/monela-portrait.jpg", alt: "Portrait réalisé pour Monela Hair" },
      { src: "/images/home/monela-detail.jpg", alt: "Photographie de la campagne Monela Hair" },
    ],
  },
  {
    id: "maison-ernest",
    onglet: "Maison Ernest",
    titre: "Maison Ernest — collection Printemps-Été 2025",
    secteur: "Mode · Luxe",
    texte:
      "Captation de la nouvelle collection de la maison de chaussures parisienne : plans produit et interviews des invités, livrés en formats courts pour les réseaux de la marque.",
    kpis: [
      { valeur: "Printemps-Été 2025", libelle: "présentation de collection" },
      { valeur: "Produit + interviews", libelle: "plans détaillés et prises de parole" },
    ],
    photos: [
      { src: "/images/home/maison-ernest-collage.jpg", alt: "Escarpins et bottines Maison Ernest exposés en vitrine" },
      { src: "/images/home/maison-ernest-poster.jpg", alt: "Escarpin doré Maison Ernest sur guéridon en vitrine parisienne" },
      { src: "/images/home/maison-ernest-detail.jpg", alt: "Semelle intérieure gravée Maison Ernest Paris" },
    ],
  },
  {
    id: "philipp-plein",
    onglet: "Philipp Plein",
    titre: "Philipp Plein — soirée VIP à Cannes",
    secteur: "Mode · Événementiel",
    texte:
      "Couverture d'une soirée Philipp Plein en marge du Festival de Cannes : portraits des invités, dont Paul Pogba, ambiance rooftop face à la mer.",
    kpis: [
      { valeur: "Paul Pogba", libelle: "portrait exclusif" },
      { valeur: "Cannes", libelle: "soirée VIP de la marque" },
    ],
    photos: [
      { src: "/images/home/philipp-plein-pogba.jpg", alt: "Paul Pogba souriant lors de la soirée Philipp Plein à Cannes" },
      { src: "/images/home/philipp-plein-cuba-gooding.jpg", alt: "Philipp Plein et Cuba Gooding Jr. lors de la soirée" },
    ],
  },
  {
    id: "studio",
    onglet: "Studio",
    titre: "Le studio TALAREF",
    secteur: "Studio · Levallois-Perret",
    texte:
      "Notre studio à Levallois-Perret, ouvert 24h/24 : plateau, coin lounge et matériel disponibles pour vos tournages, seul ou accompagné.",
    kpis: [
      { valeur: "24h/24", libelle: "studio ouvert" },
      { valeur: "Plateau + lounge", libelle: "tournage clé en main" },
    ],
    // En attente des photos compressées (voir /Users/toshh/Pictures/Studio/iloveimg-converted).
    photos: [
      { alt: "Coin lounge du studio TALAREF" },
      { alt: "Espace de travail et matériel du studio TALAREF" },
    ],
  },
];

/** Marques affichées dans le bandeau défilant. */
export const CLIENTS = [
  "PSG", "PHILIPP PLEIN", "PRINTEMPS", "PUMA", "UNESCO", "FRANCE 24",
  "DENZA · BYD", "GEELY", "CANAL+ AFRICA", "QUAI 54",
  "FASHION WEEK PARIS", "BUSINESS AFRICA", "PAROLES PARIS", "IMPULSTAR",
  "MAISON ERNEST",
];

/** Catégories utilisées pour filtrer la galerie /videos. */
export const CATEGORIES_VIDEOS = ["Mode", "Sport", "Musique", "Interview"] as const;

/**
 * Vidéos mises en avant. `youtubeId` déclenche la façade YouTube ;
 * `videoSrc` (+ `poster` en option) déclenche la façade vidéo directe
 * (mp4 hébergé dans /public), pour les clips qui ne sont pas sur YouTube.
 * `categorie` sert au filtrage sur la page /videos.
 * `accueil: false` masque la vidéo sur la home tout en la gardant dans la
 * galerie complète /videos — utile quand plusieurs clips viennent du même
 * événement et qu'on ne veut en montrer qu'un seul en avant-première.
 */
export const VIDEOS = [
  { libelle: "Récap · lancement DENZA", sous: "Opéra Garnier", youtubeId: "", categorie: "Automobile" },
  { libelle: "Fashion Week · Olivia Yacé", sous: "Cinq défilés", youtubeId: "JlxF80oCKTw", categorie: "Mode" },
  { libelle: "Interview · panel UNESCO", sous: "JIFA", youtubeId: "", categorie: "Interview" },
  {
    libelle: "Sport · PSG Handball",
    sous: "Wallem Peleka",
    youtubeId: "",
    videoSrc: "/videos/psg-wallem-peleka.mp4",
    poster: "/images/home/psg-wallem-poster.jpg",
    categorie: "Sport",
  },
  { libelle: "Récap · Boléman", sous: "Release party", youtubeId: "ofFGC8O-6uA", categorie: "Musique" },
  { libelle: "Concert · Impulstar", sous: "Franglish", youtubeId: "JTVFrjeYeLo", categorie: "Musique" },
  {
    libelle: "Interview · Flora Coquerel",
    sous: "Africa Next Awards",
    youtubeId: "Xz1uzdz6cuo",
    // Ce Short n'a pas de vignette maxresdefault chez YouTube (404 silencieux,
    // une image grise valide est quand même renvoyée) : on force hqdefault.
    poster: "https://i.ytimg.com/vi/Xz1uzdz6cuo/hqdefault.jpg",
    categorie: "Interview",
  },
  { libelle: "Interview · Yolande Yacé", sous: "Africa Next Awards", youtubeId: "OR0ogHV-4E4", categorie: "Interview", accueil: false },
  { libelle: "Interview · Aline Etokabeka", sous: "Africa Next Awards", youtubeId: "4foP3hDcJ08", categorie: "Interview", accueil: false },
  { libelle: "Interview · Denise Epoté", sous: "Africa Next Awards", youtubeId: "o3PR3mYETjA", categorie: "Interview", accueil: false },
  {
    libelle: "Défilé · Printemps Vélizy",
    sous: "Mode automne-hiver",
    youtubeId: "",
    videoSrc: "/videos/printemps-defile.mp4",
    poster: "/images/home/printemps-defile-poster.jpg",
    categorie: "Mode",
  },
  {
    libelle: "POV · Photographe PSG",
    sous: "Wallem Peleka",
    youtubeId: "",
    videoSrc: "/videos/pov-psg.mp4",
    poster: "/images/home/pov-psg-poster.jpg",
    categorie: "Sport",
  },
  {
    libelle: "Campagne · Maison Ernest",
    sous: "Printemps-Été 2025",
    youtubeId: "",
    videoSrc: "/videos/maison-ernest-campagne.mp4",
    poster: "/images/home/maison-ernest-poster.jpg",
    categorie: "Mode",
  },
  {
    libelle: "Vidéo immersive en studio",
    sous: "@didibofficial & @63wog",
    youtubeId: "",
    videoSrc: "/videos/studio-immersion.mp4",
    poster: "/images/home/studio-immersion-poster.jpg",
    categorie: "Musique",
  },
];
