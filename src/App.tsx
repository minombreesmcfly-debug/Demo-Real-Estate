import { useState, useEffect } from 'react';
import { 
  collection, getDocs, addDoc, serverTimestamp, 
  onSnapshot, query, orderBy, doc, setDoc 
} from 'firebase/firestore';
import { db } from './lib/firebase';
import AnnouncementBar from './components/AnnouncementBar';
import Navbar from './components/Navbar';
import HomeTourHero from './components/HomeTourHero';
import PropertyGrid from './components/PropertyGrid';
import BookingModal from './components/BookingModal';
import UploadModal from './components/UploadModal';
import DemoPortal from './components/DemoPortal';
import VirtualTourModal from './components/VirtualTourModal';
import { LanguageProvider, useLanguage } from './lib/LanguageContext';
import type { Property, Agent, Booking, DemoSettings } from './types';
import { Instagram, Twitter, MessageCircle, Mail, MapPin, Phone } from 'lucide-react';

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

function AppContent() {
  const { t } = useLanguage();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  
  // Real estate states
  const [properties, setProperties] = useState<Property[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentRole, setCurrentRole] = useState<'visitor' | 'agent' | 'admin'>('visitor');
  
  // Global customizable settings with dynamic defaults
  const [siteSettings, setSiteSettings] = useState<DemoSettings>({
    id: 'global',
    primaryColor: '#C5A059',
    coverText: 'Residencia Atlántida',
    contactPhone: '+52 55 9876 5432',
    contactEmail: 'ELITE@DEMO-RE.COM',
    instagramUrl: '#',
    twitterUrl: '#'
  });

  // 1. Core database Seeding (Properties & Agents)
  useEffect(() => {
    const seedData = async () => {
      // Seed Properties if empty
      const propertiesSnapshot = await getDocs(collection(db, 'properties'));
      if (propertiesSnapshot.empty) {
        console.log('Seeding initial luxury properties...');
        const initialProperties = [
          {
            title: "Mansión de Cristal del Futuro",
            description: "Una obra maestra minimalista con vistas panorámicas.",
            price: 45000000,
            location: "Lomas de Chapultepec, CDMX",
            imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
            features: ["5", "6", "850"],
            videoUrl: "#",
            isPinned: true,
            agentName: "Erika Valenzuela",
            createdAt: serverTimestamp()
          },
          {
            title: "Penthouse Nivel Zenith",
            description: "Lujo vertical redefine el horizonte de la ciudad.",
            price: 28500000,
            location: "San Pedro Garza García, NL",
            imageUrl: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
            features: ["3", "4", "420"],
            videoUrl: "#",
            isPinned: false,
            agentName: "Carlos Mendoza",
            createdAt: serverTimestamp()
          },
          {
            title: "Villa Bio-Digital",
            description: "Conexión total con la naturaleza y la tecnología.",
            price: 18900000,
            location: "Tulum, Q. Roo",
            imageUrl: "https://images.unsplash.com/photo-1600566753190-17f0bb2a6c3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
            features: ["4", "4", "350"],
            videoUrl: "#",
            isPinned: false,
            agentName: "Erika Valenzuela",
            createdAt: serverTimestamp()
          }
        ];

        for (const prop of initialProperties) {
          await addDoc(collection(db, 'properties'), prop);
        }
      }

      // Seed Agents if empty
      const agentsSnapshot = await getDocs(collection(db, 'agents'));
      if (agentsSnapshot.empty) {
        console.log('Seeding demo agent profiles...');
        const initialAgents = [
          {
            name: "Erika Valenzuela",
            email: "erika.valenzuela@elite-re.com",
            phone: "+52 55 4321 8765",
            zone: "Lomas de Chapultepec & Polanco",
            photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
            createdAt: new Date().toISOString()
          },
          {
            name: "Carlos Mendoza",
            email: "carlos.mendoza@elite-re.com",
            phone: "+52 55 7654 3210",
            zone: "San Pedro Garza García",
            photoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80",
            createdAt: new Date().toISOString()
          }
        ];

        for (const ag of initialAgents) {
          await addDoc(collection(db, 'agents'), ag);
        }
      }

      // Seed initial customizable Settings
      const settingsDocRef = doc(db, 'settings', 'global');
      const settingsSnap = await getDoc(settingsDocRef);
      if (!settingsSnap.exists()) {
        await setDoc(settingsDocRef, {
          primaryColor: '#C5A059',
          coverText: 'Residencia Atlántida',
          contactPhone: '+52 55 9876 5432',
          contactEmail: 'ELITE@DEMO-RE.COM',
          instagramUrl: '#',
          twitterUrl: '#'
        });
      }
    };

    seedData();
  }, []);

  // Helpers to fetch settings snapshot
  const getDoc = async (docRef: any) => {
    const snap = await getDocs(collection(db, 'settings'));
    return snap.docs.find(d => d.id === 'global');
  };

  // 2. Real-time Listeners
  useEffect(() => {
    // Properties Sync
    const qPr = query(collection(db, 'properties'), orderBy('createdAt', 'desc'));
    const unsubPr = onSnapshot(qPr, (snap) => {
      setProperties(snap.docs.map(d => ({ id: d.id, ...d.data() } as Property)));
    }, (err) => console.log('Pr listen err:', err));

    // Agents Sync
    const qAg = query(collection(db, 'agents'));
    const unsubAg = onSnapshot(qAg, (snap) => {
      setAgents(snap.docs.map(d => ({ id: d.id, ...d.data() } as Agent)));
    }, (err) => console.log('Ag listen err:', err));

    // Bookings Sync
    const qBk = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubBk = onSnapshot(qBk, (snap) => {
      setBookings(snap.docs.map(d => ({ id: d.id, ...d.data() } as Booking)));
    }, (err) => console.log('Bk listen err:', err));

    // Settings Sync
    const unsubSett = onSnapshot(doc(db, 'settings', 'global'), (snap) => {
      if (snap.exists()) {
        setSiteSettings({ id: 'global', ...snap.data() } as DemoSettings);
      }
    }, (err) => console.log('Sett listen err:', err));

    return () => {
      unsubPr();
      unsubAg();
      unsubBk();
      unsubSett();
    };
  }, []);

  // Update Settings back handler
  const handleUpdateSettings = async (newSettings: Partial<DemoSettings>) => {
    const updated = { ...siteSettings, ...newSettings };
    setSiteSettings(updated);
    try {
      await setDoc(doc(db, 'settings', 'global'), newSettings, { merge: true });
    } catch (e) {
      console.error('Error writing settings:', e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative bg-dark-bg text-white font-sans selection:bg-primary selection:text-black">
      {/* 3. Inject Dynamic Custom Primary Palette into CSS Document */}
      <style>{`
        :root {
          --color-primary: ${siteSettings.primaryColor} !important;
          --color-primary-rgb: ${hexToRgb(siteSettings.primaryColor)} !important;
        }
        .neon-glow {
          box-shadow: 0 0 20px rgba(var(--color-primary-rgb), 0.25);
        }
      `}</style>

      <AnnouncementBar />
      <Navbar 
        onUploadClick={() => setIsUploadModalOpen(true)} 
        contactPhone={siteSettings.contactPhone}
      />
      
      <main className="flex-grow">
        <div id="inicio">
          <HomeTourHero 
            coverText={siteSettings.coverText} 
            onStartTour={() => setIsTourOpen(true)}
          />
        </div>
        
        <div id="catalogo">
          <PropertyGrid onBookClick={(prop) => setSelectedProperty(prop)} />
        </div>

        {/* Agency Value presentation */}
        <section id="servicios" className="bg-dark-surface py-20 md:py-32 px-6 border-y border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] md:w-[800px] h-[200px] md:h-[400px] bg-primary/5 blur-[80px] md:blur-[120px] rounded-full -z-10" />
          
          <div className="max-w-7xl mx-auto text-center space-y-6 md:space-y-8">
            <h3 className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.5em] text-primary font-bold">{t('servSubtitle')}</h3>
            <h2 className="text-3xl md:text-6xl font-serif italic tracking-tight text-white leading-tight leading-none uppercase">
              {t('servTitle').split(' ')[0]} <span className="text-primary italic">{t('servTitle').substring(t('servTitle').indexOf(' '))}</span>
            </h2>
            <p className="text-sm md:text-lg text-white/40 max-w-2xl mx-auto font-light leading-relaxed">
              {t('servDesc')}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 pt-12 md:pt-20">
              {[
                { icon: Mail, title: t('servMarketingTitle'), desc: t('servMarketingDesc') },
                { icon: MapPin, title: t('servToursTitle'), desc: t('servToursDesc') },
                { icon: MessageCircle, title: t('servCRMTitle'), desc: t('servCRMDesc') }
              ].map((item, i) => (
                <div key={i} className="bg-dark-bg/50 border border-white/5 p-8 md:p-10 rounded-2xl text-left space-y-4 md:space-y-6 hover:border-primary/30 transition-all group">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/5 rounded-full flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-black transition-all">
                    <item.icon className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <h3 className="text-lg md:text-xl font-medium text-white uppercase tracking-wider">{item.title}</h3>
                  <p className="text-white/30 text-xs md:text-sm leading-relaxed font-light uppercase tracking-wider">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-dark-bg border-t border-white/5 pt-32 pb-12 px-8">
        <div className="max-w-7xl mx-auto space-y-24">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16">
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center border border-primary/30 relative overflow-hidden shrink-0">
                  <div className="w-3 h-3 bg-primary rotate-45"></div>
                </div>
                <h2 className="text-xl font-light uppercase tracking-[0.2em] text-white whitespace-nowrap">DEMO <span className="text-primary font-medium">REAL ESTATE</span></h2>
              </div>
              <p className="text-white/30 text-xs leading-relaxed uppercase tracking-widest font-bold">
                {t('footerDesc')}
              </p>
              <div className="flex items-center gap-6 text-white/40">
                <Instagram className="w-5 h-5 hover:text-primary cursor-pointer transition-colors" />
                <Twitter className="w-5 h-5 hover:text-primary cursor-pointer transition-colors" />
                <MessageCircle className="w-5 h-5 hover:text-accent cursor-pointer transition-colors" />
              </div>
            </div>

            <div className="space-y-8">
              <h4 className="font-bold uppercase tracking-[0.3em] text-[10px] text-primary">{t('footerExplore')}</h4>
              <ul className="space-y-4 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                <li className="hover:text-white cursor-pointer transition-colors">{t('navCatalog')}</li>
                <li className="hover:text-white cursor-pointer transition-colors">{t('btnStartTour')}</li>
                <li className="hover:text-white cursor-pointer transition-colors">{t('navServices')}</li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="font-bold uppercase tracking-[0.3em] text-[10px] text-primary">{t('footerServices')}</h4>
              <ul className="space-y-4 text-[10px] text-white/40 uppercase tracking-widest font-bold">
                <li className="hover:text-white cursor-pointer transition-colors">Vender</li>
                <li className="hover:text-white cursor-pointer transition-colors">Valuación</li>
                <li className="hover:text-white cursor-pointer transition-colors">Privacidad</li>
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="font-bold uppercase tracking-[0.3em] text-[10px] text-primary">{t('footerContact')}</h4>
              <div className="space-y-5">
                <div className="flex items-center gap-3 text-white/40 text-[10px] uppercase font-bold tracking-widest">
                  <Mail className="w-4 h-4 text-primary" />
                  <span>{siteSettings.contactEmail}</span>
                </div>
                <div className="flex items-center gap-3 text-white/40 text-[10px] uppercase font-bold tracking-widest">
                  <Phone className="w-4 h-4 text-primary" />
                  <span>{siteSettings.contactPhone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between pt-10 md:pt-12 border-t border-white/5 gap-6 text-center lg:text-left">
            <p className="text-[8px] md:text-[9px] uppercase font-bold tracking-[0.4em] text-white/20">
              © 2026 DEMO REAL ESTATE • Luxury Property Group
            </p>
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-[8px] md:text-[9px] uppercase font-bold tracking-[0.4em] text-white/20">
              <span className="flex items-center gap-2 underline underline-offset-4 decoration-primary/30">{t('footerMadeIn')}</span>
              <span>{t('footerVersion')}</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating sandbox control portal */}
      <DemoPortal 
        currentRole={currentRole}
        onChangeRole={setCurrentRole}
        onUpdateSettings={handleUpdateSettings}
        siteSettings={siteSettings}
        properties={properties}
        agents={agents}
        bookings={bookings}
        onUploadClick={() => setIsUploadModalOpen(true)}
      />

      <BookingModal 
        property={selectedProperty} 
        onClose={() => setSelectedProperty(null)} 
      />

      <VirtualTourModal 
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        title={siteSettings.coverText}
      />
      
      {isUploadModalOpen && (
        <UploadModal onClose={() => setIsUploadModalOpen(false)} />
      )}
    </div>
  );
}

// Helper to calculate rgb for opacity rules
function hexToRgb(hex: string): string {
  let c = hex.substring(1);
  if (c.length === 3) {
    c = c[0] + c[0] + c[1] + c[1] + c[2] + c[2];
  }
  const num = parseInt(c, 16);
  return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
}
