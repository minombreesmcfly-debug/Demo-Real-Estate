import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

export default function AnnouncementBar() {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-r from-secondary via-primary to-secondary text-black text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] py-1.5 overflow-hidden shrink-0">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: '-100%' }}
        transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
        className="flex items-center gap-12 whitespace-nowrap"
      >
        <span>✦ {t('announcement')}</span>
        <span>✦ {t('announcement')}</span>
        <span>✦ {t('announcement')}</span>
      </motion.div>
    </div>
  );
}
