export type Language = 'es' | 'en';

export const translations = {
  es: {
    // AnnouncementBar
    announcement: "Showroom de Demostración Inmobiliaria Interactiva • Explora como Agencia o Cliente",
    
    // Annotations
    annHereProspects: "✦ Aquí es donde tus prospectos llenarán su información",
    annInfoDirectToDashboard: "✦ Esta información se enviará directa y automáticamente a tu dashboard de administrador",
    annDemoPurpose: "✦ ¡Esto sirve de demostración activa para que agencias de bienes raíces vean cómo funciona!",
    annSoYouUnderstand: "✦ ¡Así funcionará tu próximo sitio web de élite!",
    annHeroVideos: "✦ Aquí colocaríamos recorridos de video, cinema panorámico o tours interactivos",
    annSpeciallyDesigned: "✦ Especialmente optimizado a partir de las imágenes de tus propiedades",
    
    // Navbar
    navHome: "Inicio",
    navCatalog: "Propiedades",
    navServices: "Servicios",
    navUpload: "Subir Propiedad",
    navContact: "Contacto",
    
    // HomeTourHero
    heroImmersive: "Experiencia Inmersiva",
    heroDesc: "Vive un recorrido tridimensional de alta fidelidad de tus residencias de lujo desde cualquier dispositivo.",
    btnStartTour: "Iniciar Tour Digital",
    btnGallery: "Galería HD",
    bannerCoverHelp: "✦ Aquí colocaríamos videos de alta calidad, imágenes panorámicas o recorridos 3D interactivos, especialmente diseñado e integrado para potenciar tus propiedades.",
    
    // VirtualTourModal
    tourTitle: "Tour Digital Inmersivo",
    tourGuideline: "Usa los hotspots para explorar detalles",
    tourMute: "Mudo",
    tourUnmute: "Activar audio espacial",
    viewSala: "Estancia Principal",
    viewCocina: "Cocina de Autor",
    viewTerraza: "Terraza Suspendida",
    // hotspot titles & desc
    hotspotDomoticaTitle: "Domo Bioclimático",
    hotspotDomoticaDesc: "Sensores inteligentes de luz solar y climatización integrada automatizada.",
    hotspotCristalTitle: "Cristalería Inteligente",
    hotspotCristalDesc: "Tecnología electrocrómica que se aclara u oscurece a un toque para privacidad.",
    hotspotIslaTitle: "Cubiertas de Cuarzo Puro",
    hotspotIslaDesc: "Material antibacteriano e irrompible de grado premium moldeado por láser.",
    hotspotElectroTitle: "Electrodomésticos Ocultos",
    hotspotElectroDesc: "Gabinetes integrados de apertura táctil silencioso y diseño europeo.",
    hotspotAlbercaTitle: "Piscina Semivolada",
    hotspotAlbercaDesc: "Acrílico estructural reforzado con vistas infinitas hacia el horizonte urbano.",
    hotspotFireTitle: "Fogatero Bioetanol",
    hotspotFireDesc: "Calefacción ecológica certificada de última generación integrada en pieza de piedra.",

    // PropertyGrid
    gridSubtitle: "Colección de residencias de lujo seleccionadas",
    gridTitle: "Explora Nuestras Propiedades",
    searchPlaceholder: "Buscar por título, ciudad o ubicación...",
    noPropertiesFound: "No se encontraron propiedades que coincidan con tu búsqueda.",

    // PropertyCard
    cardExclusive: "Exclusiva",
    cardFeatured: "★ Destacada",
    cardAgent: "Agente",
    cardUnassigned: "Sin asignar",
    btnScheduleVisit: "Agendar Visita",
    // Bed / Bath / Sqft
    featBeds: "Recámaras",
    featBaths: "Baños",
    featSqft: "m² m-const",

    // BookingModal
    bookTitle: "Solicitud de Cita",
    bookAgentInCharge: "Agente a cargo",
    labelDate: "Fecha",
    labelTime: "Hora",
    placeholderName: "NOMBRE COMPLETO",
    placeholderEmail: "CORREO ELECTRÓNICO",
    placeholderPhone: "NÚMERO TELEFÓNICO (WHATSAPP)",
    btnSubmitBook: "Confirmar Registro Elite",
    bookSuccessTitle: "Cita Agendada con Éxito",
    bookSuccessMessage: "Un concierge altamente calificado se pondrá en contacto en breve.",

    // Services
    servSubtitle: "Gestión de Agencias Premium",
    servTitle: "Potencie su Presencia Digital",
    servDesc: "Nuestra plataforma ayuda a las inmobiliarias y corredores autónomos a distribuir sus servicios de manera eficiente, ofreciendo una experiencia altamente interactiva a cada prospecto.",
    servMarketingTitle: "Marketing de Élite",
    servMarketingDesc: "Campañas automáticas y distribución instantánea de fichas exclusivas.",
    servToursTitle: "Tours Digitales",
    servToursDesc: "Showroom interactivo con galerías HD e integraciones listas para usar.",
    servCRMTitle: "CRM y Leads",
    servCRMDesc: "Gestión unificada de citas asociando agentes a cargo de forma rápida.",

    // Footer
    footerDesc: "Liderando la revolución digital en el sector inmobiliario de lujo en Latinoamérica.",
    footerExplore: "Explorar",
    footerServices: "Servicios",
    footerContact: "Contacto",
    footerMadeIn: "Hecho en el Futuro",
    footerVersion: "v1.0 Sophisticated Dark",

    // DemoPortal (Floating Panel)
    portalLabel: "Panel Demo Inmobiliario",
    portalConsole: "Consola de Prueba",
    portalSandbox: "Demo Sandbox Portal",
    roleVisitor: "Visitante",
    roleAgent: "Agente",
    roleAdmin: "Administrador",
    tabCustomize: "Personalizar",
    tabAdmin: "Dashboard Admin",
    tabAgent: "Dashboard Agente",
    
    // DemoPortal Customizer
    custGuideTitle: "Guía del Cliente Inmobiliario",
    custGuideDesc: "Esta web es un simulador avanzado diseñado para agencias inmobiliarias. Puede interactuar con estas herramientas para ver cómo lucirá el catálogo de su propia marca.",
    custColTitle: "1. Personalizar Colores Globales",
    custTitleBanner: "2. Frase de Portada / Banner principal",
    custTitleInputPlaceholder: "Aquí iría tu portada / Residencia Atlántida",
    custTitleSub: "* Cambia dinámicamente el título del showroom principal superior.",
    custCompanyTitle: "3. Datos de la Empresa Inmobiliaria",
    custEmailPub: "Email Público",
    custTelWhatsApp: "Teléfono / WhatsApp",

    // DemoPortal Admin
    adminAccessActive: "Acceso de Administrador Activo",
    adminAccessDesc: "Usted tiene control absoluto sobre la asignación de propiedades, agentes, visitas y catálogo global.",
    adminRegAgent: "Registrar Nuevo Agente",
    adminAgentName: "Nombre del Agente",
    adminAgentEmail: "Email del Agente",
    adminAgentPhone: "Teléfono (Opcional)",
    adminAgentZone: "Zona de Especialidad",
    btnCreateAgent: "Crear Perfil de Agente",
    btnCreateAgentSaving: "Guardando...",
    adminQuickReg: "¿Registro rápido?",
    btnSimulateGoogle: "Simular Registro Google",
    adminPortfolioAssign: "Asignación Activa de Portfolio",
    adminUnassignedAgent: "Sin agente",
    adminGlobalVisits: "Visitas Globales y Leads",
    adminNoVisits: "Sin registros de visita aún.",
    adminVisStatusDone: "Visita Realizada",
    adminVisStatusContacted: "Contactado",
    adminVisStatusCancelled: "Cancelado",
    adminVisStatusPending: "Pendiente",
    adminVisProgress: "Progreso",
    adminVisAgent: "Agente",

    // DemoPortal Agent
    agentSelectDemo: "1. Seleccionar Agente Demo para probar",
    agentSelectAlert: "Primero crea un agente en el tab de Administrador o con Google.",
    agentActiveConcierge: "CONCIERGE ACTIVO",
    agentMyLeads: "Mis Prospectos y Leads",
    agentNoLeads: "No tienes prospectos asignados a tus residencias todavía.",
    agentResidences: "Mis Residencias Listadas",

    // UploadModal
    upTitle: "Subir Nueva Propiedad",
    upLabelTitle: "Título de la Propiedad",
    upLabelDesc: "Descripción Corta",
    upLabelPrice: "Precio (MXN)",
    upLabelLoc: "Ubicación (Ciudad, Estado)",
    upLabelImage: "URL de la Imagen (Unsplash)",
    upLabelFeatures: "Características",
    upLabelBeds: "Recámaras",
    upLabelBaths: "Baños",
    upLabelArea: "Área (m²)",
    upLabelVideo: "URL del Video Recorrido (Opcional)",
    upDragText: "Arrastra y suelta una imagen o haz clic para seleccionar",
    upDragSub: "Sube fotos HD de alta definición para cautivar a tus clientes",
    btnCreateListing: "Publicar Propiedad Colectiva",
    btnListingPublishing: "Publicando...",
    btnInterested: "Me interesa",
    wpInterestedText: "Hola, me interesa una web app para mi sitio web",
  },
  en: {
    // AnnouncementBar
    announcement: "Interactive Real Estate Demonstration Showroom • Explore as Agency or Client",
    
    // Annotations
    annHereProspects: "✦ Here is where your prospects will fill in their information",
    annInfoDirectToDashboard: "✦ This information is sent directly and automatically to your admin dashboard",
    annDemoPurpose: "✦ This serves as an active simulation so real estate companies can see how it works!",
    annSoYouUnderstand: "✦ This is how your prospective automated elite website runs!",
    annHeroVideos: "✦ Here we would embed video walkthroughs, scenic drone films, or virtual tours",
    annSpeciallyDesigned: "✦ Specially designed and optimized using your properties' photos",
    
    // Navbar
    navHome: "Home",
    navCatalog: "Properties",
    navServices: "Services",
    navUpload: "Upload Property",
    navContact: "Contact",
    
    // HomeTourHero
    heroImmersive: "Immersive Experience",
    heroDesc: "Experience a high-fidelity three-dimensional walkthrough of your luxury residences from any device.",
    btnStartTour: "Start Digital Tour",
    btnGallery: "HD Gallery",
    bannerCoverHelp: "✦ Here we would embed premium videos, panoramic scenes, or interactive 3D virtual tours, specifically tailored and integrated to elevate your properties.",
    
    // VirtualTourModal
    tourTitle: "Immersive Digital Tour",
    tourGuideline: "Use hotspots to explore specific details",
    tourMute: "Mute",
    tourUnmute: "Enable spatial audio",
    viewSala: "Main Residence",
    viewCocina: "Chef's Kitchen",
    viewTerraza: "Suspended Terrace",
    // hotspot titles & desc
    hotspotDomoticaTitle: "Bioclimatic Dome",
    hotspotDomoticaDesc: "Intelligent solar exposure sensors and automated integrated climate control.",
    hotspotCristalTitle: "Smart Glass Panel",
    hotspotCristalDesc: "Electrochromic translucent technology that clears or darkens instantly with a tap.",
    hotspotIslaTitle: "Pure Quartz Countertop",
    hotspotIslaDesc: "Anti-bacterial and ultra-durable premium grade material custom laser molded.",
    hotspotElectroTitle: "Concealed Premium Appliances",
    hotspotElectroDesc: "Fully integrated cabinets featuring silent touch release and European styling.",
    hotspotAlbercaTitle: "Cantilevered Pool",
    hotspotAlbercaDesc: "Reinforced structural acrylic offering seamless views looking into urban horizons.",
    hotspotFireTitle: "Bioethanol Fire pit",
    hotspotFireDesc: "Eco-friendly emission-free certified heater built into luxury stone structure.",

    // PropertyGrid
    gridSubtitle: "Collection of curated premium residences",
    gridTitle: "Explore Our Portfolio",
    searchPlaceholder: "Search by title, city or location...",
    noPropertiesFound: "No properties found matching your criteria.",

    // PropertyCard
    cardExclusive: "Exclusive",
    cardFeatured: "★ Featured",
    cardAgent: "Agent",
    cardUnassigned: "Unassigned",
    btnScheduleVisit: "Schedule Tour",
    // Bed / Bath / Sqft
    featBeds: "Beds",
    featBaths: "Baths",
    featSqft: "sqft area",

    // BookingModal
    bookTitle: "Schedule Visit Request",
    bookAgentInCharge: "Listing Agent",
    labelDate: "Date",
    labelTime: "Time",
    placeholderName: "FULL NAME",
    placeholderEmail: "EMAIL ADDRESS",
    placeholderPhone: "TELEPHONE NUMBER (WHATSAPP)",
    btnSubmitBook: "Confirm Elite Booking",
    bookSuccessTitle: "Tour Successfully Booked",
    bookSuccessMessage: "A highly-qualified personal concierge will reach out to you shortly.",

    // Services
    servSubtitle: "Premium Agency Solutions",
    servTitle: "Elevate Your Digital Showroom",
    servDesc: "Our platform empowers real estate agencies and independent brokers to seamlessly distribute property listings while delivering top-tier interactive experiences to prospects.",
    servMarketingTitle: "Luxury Branding",
    servMarketingDesc: "Automatic search campaigns and high-end digital interactive materials instantly generated.",
    servToursTitle: "Media Tours",
    servToursDesc: "Immersive VR-ready layouts with high definition response tailored on modern themes.",
    servCRMTitle: "CRM Integration",
    servCRMDesc: "Consolidated agency desk that connects leads directly to properties and agents.",

    // Footer
    footerDesc: "Leading the luxury digital revolution for premium real estate across the Americas.",
    footerExplore: "Explore",
    footerServices: "Services",
    footerContact: "Contact",
    footerMadeIn: "Designed in the Future",
    footerVersion: "v1.0 Sophisticated Dark",

    // DemoPortal (Floating Panel)
    portalLabel: "Real Estate Demo Panel",
    portalConsole: "Test Console",
    portalSandbox: "Demo Sandbox Portal",
    roleVisitor: "Visitor",
    roleAgent: "Agent",
    roleAdmin: "Admin",
    tabCustomize: "Customize",
    tabAdmin: "Admin Desk",
    tabAgent: "Agent Desk",
    
    // DemoPortal Customizer
    custGuideTitle: "Broker & Company Guide",
    custGuideDesc: "This website serves as an interactive simulator for real estate companies. You can tweak components here to test your personalized agency aesthetics live.",
    custColTitle: "1. Brand Theming & Color Preset",
    custTitleBanner: "2. Hero Header Slogan Text",
    custTitleInputPlaceholder: "Your text goes here / Atlantis Residence",
    custTitleSub: "* Realtime reflection on the high-fidelity hero banner above.",
    custCompanyTitle: "3. Corporate Listing Information",
    custEmailPub: "Public Directory Email",
    custTelWhatsApp: "Company Contact / WhatsApp",

    // DemoPortal Admin
    adminAccessActive: "Authorized Administrator Active",
    adminAccessDesc: "Full administrative mastery over listing inventory, agent recruitment, lead assignment, and catalog.",
    adminRegAgent: "Onboard Professional Agent",
    adminAgentName: "Agent Full Name",
    adminAgentEmail: "Agent Professional Email",
    adminAgentPhone: "Contact Cell (Optional)",
    adminAgentZone: "Regional Territory",
    btnCreateAgent: "Onboard Agent Profile",
    btnCreateAgentSaving: "Saving...",
    adminQuickReg: "Want automated setup?",
    btnSimulateGoogle: "Simulate Google Auth",
    adminPortfolioAssign: "Active Inventory Mapping",
    adminUnassignedAgent: "Unassigned",
    adminGlobalVisits: "Global Visit Pipeline",
    adminNoVisits: "No visits registered yet.",
    adminVisStatusDone: "Completed",
    adminVisStatusContacted: "Contacted",
    adminVisStatusCancelled: "Cancelled",
    adminVisStatusPending: "Pending Approval",
    adminVisProgress: "Mapping",
    adminVisAgent: "Agent Assigned",

    // DemoPortal Agent
    agentSelectDemo: "1. Choose Demo Agent to Simulate",
    agentSelectAlert: "Create an agent profile inside the Admin Desk or Google simulation first.",
    agentActiveConcierge: "ACTIVE CONCIERGE",
    agentMyLeads: "My Assigned Inbound Leads",
    agentNoLeads: "No customer leads assigned to your portfolio yet.",
    agentResidences: "My Portfolio Inventory",

    // UploadModal
    upTitle: "Onboard Luxury Property",
    upLabelTitle: "Listing Title",
    upLabelDesc: "Strategic Summary Description",
    upLabelPrice: "Price (MXN)",
    upLabelLoc: "Location Listing (City, Region)",
    upLabelImage: "HD Aspect Photo URL (Unsplash)",
    upLabelFeatures: "Property Stats",
    upLabelBeds: "Bedrooms",
    upLabelBaths: "Baths",
    upLabelArea: "Total Surface (m²)",
    upLabelVideo: "Virtual Video Tour URL (Optional)",
    upDragText: "Drag and drop standard imagery here or click to browse",
    upDragSub: "Publish high definition layouts to maximize buyers trust",
    btnCreateListing: "Publish Interactive Portfolio",
    btnListingPublishing: "Publishing...",
    btnInterested: "I'm interested",
    wpInterestedText: "Hello, I'm interested in a website app for my real estate business",
  }
};
