import { Upload, Instagram, Twitter, MessageCircle, Home, Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

interface NavbarProps {
  onUploadClick: () => void;
  contactPhone?: string;
  brandName?: string;
}

export default function Navbar({ onUploadClick, contactPhone, brandName }: NavbarProps) {
  const { language, toggleLanguage, t } = useLanguage();
  const cleanPhone = (contactPhone || "525598765432").replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=Hola, estoy interesado en una de sus propiedades.`;

  return (
    <nav className="sticky top-0 z-50 glass-dark border-b border-white/10 px-4 md:px-8 py-4 md:py-6 animate-fade-in">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-white/5 rounded-full flex items-center justify-center border border-primary/50 relative overflow-hidden shrink-0">
            <div className="w-3 h-3 md:w-4 md:h-4 bg-primary rotate-45 animate-pulse"></div>
          </div>
          <div>
            <span className="text-sm md:text-xl font-light tracking-[0.1em] md:tracking-[0.2em] uppercase text-white whitespace-nowrap">
              DEMO <span className="text-primary font-medium">ESTATE</span>
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
          <a href="#catalogo" className="hover:text-primary hover:border-b hover:border-primary/50 transition-all pb-1">{t('navCatalog')}</a>
          <a href="#inicio" className="hover:text-primary transition-colors">{t('navHome')}</a>
          <a href="#servicios" className="hover:text-primary transition-colors">{t('navServices')}</a>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          {/* Quick Language Toggle Pill */}
          <div className="flex items-center bg-white/5 border border-white/10 p-0.5 rounded-full shrink-0">
            <button
              onClick={() => language !== 'es' && toggleLanguage()}
              className={cn(
                "px-2 md:px-2.5 py-1 text-[8px] md:text-[9px] uppercase tracking-widest font-black rounded-full transition-all cursor-pointer",
                language === 'es' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'
              )}
            >
              ES
            </button>
            <button
              onClick={() => language !== 'en' && toggleLanguage()}
              className={cn(
                "px-2 md:px-2.5 py-1 text-[8px] md:text-[9px] uppercase tracking-widest font-black rounded-full transition-all cursor-pointer",
                language === 'en' ? 'bg-primary text-black' : 'text-white/40 hover:text-white'
              )}
            >
              EN
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-4 border-l border-white/10 pl-6 pr-1">
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className="text-white/40 hover:text-accent transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
          
          <button
            onClick={onUploadClick}
            className="px-3 md:px-5 py-2 bg-white/5 border border-white/20 text-[8px] md:text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all flex items-center gap-2 font-bold whitespace-nowrap cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
          >
            <Upload className="w-3 h-3 text-primary" />
            <span className="hidden xs:inline">{t('navUpload')}</span>
            <span className="xs:hidden">{t('navUpload')}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
