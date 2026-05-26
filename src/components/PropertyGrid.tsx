import { useState, useEffect } from 'react';
import { db, collection, onSnapshot, query, orderBy, limit } from '../lib/firebase';
import type { Property } from '../types';
import PropertyCard from './PropertyCard';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Loader2 } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

interface PropertyGridProps {
  onBookClick: (property: Property) => void;
}

export default function PropertyGrid({ onBookClick }: PropertyGridProps) {
  const { t } = useLanguage();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'properties'), orderBy('createdAt', 'desc'), limit(12));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Property));
      setProperties(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const sortedProperties = [...properties].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  const filteredProperties = sortedProperties.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="px-4 md:px-6 py-12 md:py-20 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 md:gap-8 mb-12 md:mb-16">
        <div className="space-y-3 md:space-y-4 text-center lg:text-left">
          <h3 className="text-[8px] md:text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-primary font-bold">{t('gridSubtitle')}</h3>
          <h2 className="text-3xl md:text-6xl font-serif italic tracking-tight text-white leading-tight">
            {t('gridTitle').split(' ')[0]} <span className="text-primary italic">{t('gridTitle').substring(t('gridTitle').indexOf(' '))}</span>
          </h2>
        </div>

        <div className="relative group w-full lg:min-w-[350px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder={t('searchPlaceholder').toUpperCase()}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-[9px] md:text-[10px] uppercase tracking-widest text-white focus:outline-none focus:border-primary/30 transition-all font-bold placeholder:text-white/20"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-white/40 font-bold uppercase tracking-widest text-xs">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProperties.map((property) => (
              <PropertyCard 
                key={property.id} 
                property={property} 
                onBookClick={onBookClick} 
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filteredProperties.length === 0 && (
        <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/10 border-dashed">
          <p className="text-white/40 font-medium">{t('noPropertiesFound')}</p>
        </div>
      )}
    </section>
  );
}
