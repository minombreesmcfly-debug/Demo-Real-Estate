import { motion } from 'motion/react';
import { Play, Shield, Zap, Globe, CornerLeftUp } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

interface HomeTourHeroProps {
  coverText?: string;
  onStartTour?: () => void;
}

export default function HomeTourHero({ coverText, onStartTour }: HomeTourHeroProps) {
  const { t } = useLanguage();
  const textToShow = coverText || "Residencia Atlántida";

  return (
    <section className="relative min-h-[60vh] sm:min-h-[70vh] md:h-[80vh] flex items-center justify-center overflow-hidden p-2 sm:p-4 md:p-8">
      <div className="absolute inset-0 bg-dark-bg rounded-xl sm:rounded-2xl md:rounded-3xl m-1 sm:m-2 md:m-8 overflow-hidden border border-white/5 shadow-2xl">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
          className="w-full h-full object-cover opacity-50 md:opacity-40 transition-transform duration-1000 hover:scale-105"
          alt="Home Tour"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent" />
        
        <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-8 md:p-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-3 sm:space-y-6 max-w-3xl"
          >
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-2 text-primary">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="text-[8px] md:text-[10px] font-bold uppercase tracking-[0.3em]">{t('heroImmersive')}</span>
              </div>
              {textToShow.toLowerCase().includes('portada') && (
                <span className="bg-primary/20 backdrop-blur-md rounded border border-primary/40 text-primary py-1 px-2.5 uppercase tracking-widest text-[8px] md:text-[9px] font-black self-start">
                  ✦ Aquí iría la portada de tu inmobiliaria
                </span>
              )}
            </div>
            
            <h2 className="text-2xl sm:text-5xl md:text-8xl font-serif italic tracking-tight leading-tight text-white drop-shadow-2xl uppercase">
              {textToShow}
            </h2>
            
            <p className="text-xs sm:text-lg text-white/50 max-w-md font-light leading-relaxed">
              {t('heroDesc')}
            </p>
            
            {/* Relative buttons wrapper with absolute sketched annotations */}
            <div className="relative flex flex-col sm:flex-row gap-2.5 md:gap-4 pt-3 pb-16 sm:pb-0 items-start">
              <button 
                onClick={onStartTour}
                className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 bg-primary text-black font-black text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                {t('btnStartTour')}
              </button>
              <button 
                onClick={onStartTour}
                className="w-full sm:w-auto px-6 sm:px-10 py-3 sm:py-4 bg-white/5 backdrop-blur-md border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer"
              >
                {t('btnGallery')}
              </button>

              {/* Handdrawn interactive annotations */}
              <div className="pt-2 sm:pt-0 sm:absolute sm:left-0 sm:top-full mt-2 max-w-xs md:max-w-md bg-black/80 sm:bg-transparent p-3 sm:p-0 rounded-xl border border-white/5 sm:border-none">
                <div className="flex gap-2">
                  <CornerLeftUp className="w-6 h-6 text-primary shrink-0 rotate-180 sm:rotate-0" />
                  <div>
                    <p className="font-handwritten text-xl text-primary leading-tight">
                      {t('annHeroVideos')}
                    </p>
                    <p className="font-handwritten text-sm text-white/50 leading-tight">
                      {t('annSpeciallyDesigned')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 md:top-12 md:right-12">
          <div className="glass-dark px-3 py-1.5 sm:px-6 sm:py-3 rounded-full border border-white/10">
            <span className="text-xs sm:text-2xl font-serif italic text-white">$1.8M USD</span>
          </div>
        </div>
      </div>
    </section>
  );
}
