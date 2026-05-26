import { motion } from 'motion/react';
import { MapPin, Bed, Bath, Maximize, Play, Calendar } from 'lucide-react';
import type { Property } from '../types';
import { useLanguage } from '../lib/LanguageContext';

interface PropertyCardProps {
  key?: string | number;
  property: Property;
  onBookClick: (property: Property) => void;
}

export default function PropertyCard({ property, onBookClick }: PropertyCardProps) {
  const { t } = useLanguage();
  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0
  }).format(property.price);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -10 }}
      className="bg-dark-surface group overflow-hidden rounded-2xl transition-all duration-500 border border-white/5 hover:border-primary/50"
    >
      <div className="relative aspect-[4/3] md:aspect-[3/2] overflow-hidden bg-dark-bg">
        <img
          src={property.imageUrl || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
        
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="bg-black/50 backdrop-blur-md px-2 py-0.5 rounded-full text-[7px] md:text-[8px] font-bold uppercase tracking-[0.2em] text-primary border border-primary/30">
            {t('cardExclusive')}
          </span>
          {property.isPinned && (
            <span className="bg-primary hover:bg-white text-black px-2 py-0.5 rounded-full text-[7px] md:text-[8px] font-black uppercase tracking-[0.2em] self-start flex items-center gap-1 shadow-lg">
              {t('cardFeatured')}
            </span>
          )}
        </div>

        {property.videoUrl && (
          <div className="absolute top-3 right-3 opacity-80 backdrop-blur-sm bg-white/5 border border-white/10 p-1.5 rounded-full">
            <Play className="w-3 h-3 text-white fill-current" />
          </div>
        )}
      </div>

      <div className="p-4 md:p-6 space-y-3 md:space-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-white/40 text-[8px] md:text-[10px] uppercase font-bold tracking-widest">
              <MapPin className="w-2.5 h-2.5 text-primary" />
              {property.location}
            </div>
            {property.agentName && (
              <span className="text-[7.5px] md:text-[8.5px] uppercase font-black tracking-widest text-white/50 bg-white/5 border border-white/5 px-2 py-0.5 rounded">
                {t('cardAgent')}: <span className="text-primary font-bold">{property.agentName}</span>
              </span>
            )}
          </div>
          <h3 className="text-base md:text-lg font-medium text-white group-hover:text-primary transition-colors line-clamp-1 uppercase">
            {property.title}
          </h3>
          <p className="text-lg md:text-xl font-serif italic text-primary">
            {formattedPrice} USD
          </p>
        </div>

        <div className="flex items-center justify-between py-3 md:py-4 border-y border-white/5 text-white/40 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">
          <div className="flex items-center gap-1">
            <Bed className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            {property.features[0] || '3'} {t('featBeds').toLowerCase()}
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            {property.features[1] || '2'} {t('featBaths').toLowerCase()}
          </div>
          <div className="flex items-center gap-1">
            <Maximize className="w-3 h-3 md:w-4 md:h-4 text-primary" />
            {property.features[2] || '120'}m²
          </div>
        </div>

        <div className="pt-1">
          <button
            onClick={() => onBookClick(property)}
            className="w-full py-3 md:py-4 bg-white/5 hover:bg-primary hover:text-black border border-white/10 hover:border-primary transition-all text-[8px] md:text-[10px] font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-3 h-3" />
            {t('btnScheduleVisit')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
