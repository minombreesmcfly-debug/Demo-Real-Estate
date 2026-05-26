import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Compass, Info, Volume2, VolumeX, Move, ArrowDown, Pointer } from 'lucide-react';
import { useLanguage } from '../lib/LanguageContext';

interface VirtualTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function VirtualTourModal({ isOpen, onClose }: VirtualTourModalProps) {
  const { t } = useLanguage();
  const [activePan, setActivePan] = useState<'sala' | 'cocina' | 'terraza'>('sala');
  const [infoNode, setInfoNode] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);

  // High quality immersive spatial views using bilingual translation mappings
  const views = {
    sala: {
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      label: t('viewSala'),
      nodes: [
        { id: 'domotica', x: '45%', y: '40%', label: t('hotspotDomoticaTitle'), desc: t('hotspotDomoticaDesc') },
        { id: 'cristal', x: '75%', y: '60%', label: t('hotspotCristalTitle'), desc: t('hotspotCristalDesc') }
      ]
    },
    cocina: {
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      label: t('viewCocina'),
      nodes: [
        { id: 'isla', x: '50%', y: '55%', label: t('hotspotIslaTitle'), desc: t('hotspotIslaDesc') },
        { id: 'electro', x: '20%', y: '45%', label: t('hotspotElectroTitle'), desc: t('hotspotElectroDesc') }
      ]
    },
    terraza: {
      image: "https://images.unsplash.com/photo-1600566752229-2734f278d079?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      label: t('viewTerraza'),
      nodes: [
        { id: 'alberca', x: '35%', y: '65%', label: t('hotspotAlbercaTitle'), desc: t('hotspotAlbercaDesc') },
        { id: 'fire', x: '70%', y: '70%', label: t('hotspotFireTitle'), desc: t('hotspotFireDesc') }
      ]
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-2.5 sm:p-4 md:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/92 backdrop-blur-xl"
          />

          {/* Core Interactive Wrapper */}
          <AnimatePresence mode="wait">
            {/* ----------------- MOBILE SCOPE VIEW ----------------- */}
            <div className="md:hidden w-full max-h-[92vh] bg-dark-bg/95 backdrop-blur-md rounded-2xl border border-white/10 overflow-y-auto p-4 flex flex-col space-y-5 relative scrollbar-none z-10">
              {/* Header Box */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white/5 rounded-full flex items-center justify-center border border-primary/40 overflow-hidden shrink-0">
                    <div className="w-2.5 h-2.5 bg-primary rotate-45 animate-pulse"></div>
                  </div>
                  <div>
                    <span className="text-[10px] font-medium tracking-widest text-primary uppercase">
                      DEMO INTERACTIVA
                    </span>
                  </div>
                </div>

                <button 
                  onClick={onClose}
                  className="p-1.5 bg-white/5 border border-white/10 rounded-full text-white/70 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* High Fidelity Interactive Photographic Explanation Tag */}
              <div className="relative bg-primary/[0.03] border border-dashed border-primary/35 p-4 rounded-xl space-y-1.5 overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-primary/5 rounded-full blur-xl pointer-events-none" />
                
                <div className="flex items-center gap-2 text-primary font-serif italic text-xs font-semibold">
                  <span>✦ {t('tourAnnotationTitle')}</span>
                </div>
                
                <p className="text-[10px] text-white/70 leading-relaxed font-light">
                  {t('tourAnnotationText')}
                </p>
                
                <div className="flex items-center gap-1.5 pt-1 text-[8px] font-mono uppercase tracking-widest text-primary font-bold">
                  <span>{t('tourGuideline')}</span>
                  <ArrowDown className="w-2.5 h-2.5 text-primary animate-bounce shrink-0" />
                </div>
              </div>

              {/* Vertical Stacked Immersive Environment Modules (Sala, Cocina, Terraza) */}
              <div className="space-y-6">
                {Object.entries(views).map(([key, view]) => (
                  <div key={key} className="space-y-2 border-b border-white/5 pb-5 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1 rounded-md border border-white/10 w-fit">
                      <Compass className="w-3.5 h-3.5 text-primary animate-spin-slow shrink-0" />
                      <span className="text-[9px] tracking-widest font-black uppercase text-white/90">
                        {view.label}
                      </span>
                    </div>

                    <div className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-black border border-white/10">
                      <img
                        src={view.image}
                        className="absolute inset-0 w-full h-full object-cover opacity-75"
                        alt={view.label}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                      {/* Hotspots Overlayed with Interactive Click Feedback */}
                      {view.nodes.map((node) => (
                        <div
                          key={node.id}
                          className="absolute z-20"
                          style={{ left: node.x, top: node.y }}
                        >
                          <button
                            onClick={() => setInfoNode(infoNode === node.id ? null : node.id)}
                            className={`flex items-center justify-center w-7 h-7 rounded-full transition-all shadow-lg animate-pulse ${
                              infoNode === node.id 
                                ? 'bg-primary text-black border-2 border-white scale-110' 
                                : 'bg-primary/20 border border-primary text-primary'
                            }`}
                          >
                            <Info className="w-3.5 h-3.5 shrink-0" />
                          </button>

                          {/* Float Card Information */}
                          <AnimatePresence>
                            {infoNode === node.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 5 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 5 }}
                                className="absolute left-1/2 -translate-x-1/2 mt-2.5 p-3 bg-dark-bg/95 backdrop-blur-md rounded-lg border border-primary/40 text-white w-48 shadow-2xl z-30 space-y-1"
                              >
                                <h4 className="text-[9px] uppercase tracking-widest font-black text-primary">{node.label}</h4>
                                <p className="text-[8px] text-white/65 leading-relaxed uppercase tracking-wider">{node.desc}</p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ----------------- DESKTOP SCOPE VIEW ----------------- */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="hidden md:flex bg-dark-bg w-full max-w-5xl aspect-video rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl flex-col z-10"
            >
              {/* Immersive Workspace Screen */}
              <div className="relative flex-grow overflow-hidden bg-black flex items-center justify-center">
                
                {/* Active Spatial Environment Layer */}
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activePan}
                    src={views[activePan].image}
                    initial={{ opacity: 0, scale: 1.15, filter: 'blur(10px)' }}
                    animate={{ opacity: 0.7, scale: 1.02, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                    transition={{ duration: 1.2, ease: 'easeInOut' }}
                    className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>

                {/* Ambient shadow overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-black/30 pointer-events-none" />

                {/* Overlay Interactive Hotspot Nodes */}
                <AnimatePresence>
                  {views[activePan].nodes.map((node) => (
                    <motion.div
                      key={node.id}
                      className="absolute z-20"
                      style={{ left: node.x, top: node.y }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <button
                        onClick={() => setInfoNode(infoNode === node.id ? null : node.id)}
                        className="group relative flex items-center justify-center w-8 h-8 rounded-full bg-primary/25 border border-primary text-primary hover:bg-primary hover:text-black transition-all shadow-lg animate-pulse"
                      >
                        <Info className="w-4 h-4 text-primary group-hover:text-black transition-colors" />
                        
                        {/* Node Label Tooltip on Hover */}
                        <span className="absolute bottom-full mb-2 bg-black/80 backdrop-blur-md text-[8px] font-bold tracking-widest uppercase border border-white/10 text-white py-1 px-2.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          {node.label}
                        </span>
                      </button>

                      {/* Active Informational Card Overlay */}
                      {infoNode === node.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute left-1/2 -translate-x-1/2 mt-3 p-4 bg-dark-surface/95 backdrop-blur-md rounded-xl border border-primary/30 text-white w-56 shadow-2xl z-30 space-y-1.5"
                        >
                          <h4 className="text-[10px] uppercase tracking-widest font-black text-primary">{node.label}</h4>
                          <p className="text-[9px] text-white/50 leading-relaxed uppercase tracking-wider">{node.desc}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Live Explanatory Glass Card detailing standard photo processing */}
                <div className="absolute top-24 right-6 z-30 w-72 bg-black/80 backdrop-blur-md border border-dashed border-primary/45 p-4 rounded-xl shadow-2xl space-y-1.5 animate-fade-in text-left">
                  <div className="flex items-center gap-1.5 text-primary">
                    <Compass className="w-4 h-4 shrink-0" />
                    <span className="text-[10px] tracking-widest font-black uppercase text-primary font-bold">
                      {t('tourAnnotationTitle')}
                    </span>
                  </div>
                  <p className="text-[9px] text-white/70 leading-relaxed uppercase tracking-wide font-light">
                    {t('tourAnnotationText')}
                  </p>
                  <div className="flex items-center gap-1.5 text-[8px] tracking-[0.12em] font-black uppercase text-primary/70 pt-0.5">
                    <span>← {t('tourGuideline')}</span>
                  </div>
                </div>

                {/* Spatial Pan Selector Sidebar */}
                <div className="absolute bottom-6 left-6 z-30 flex items-center gap-2">
                  {Object.entries(views).map(([key, view]) => (
                    <button
                      key={key}
                      onClick={() => { setActivePan(key as any); setInfoNode(null); }}
                      className={`px-4 py-2 rounded-lg border text-[8px] font-black uppercase tracking-widest transition-all ${
                        activePan === key 
                          ? 'bg-primary text-black border-primary font-bold shadow-lg' 
                          : 'bg-black/50 hover:bg-black/80 text-white/40 border-white/10'
                      }`}
                    >
                      {view.label}
                    </button>
                  ))}
                </div>

                {/* Top Bar status and controllers */}
                <div className="absolute top-6 left-6 right-6 z-30 flex items-center justify-between">
                  <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md py-2 px-4 rounded-full border border-white/10">
                    <Compass className="w-4 h-4 text-primary animate-spin-slow shrink-0" />
                    <span className="text-[8px] md:text-[9px] tracking-[0.2em] font-black uppercase text-white whitespace-nowrap">
                      {t('tourTitle')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setMuted(!muted)}
                      className="p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white/60 hover:text-white transition-colors"
                      title={muted ? t('tourUnmute') : t('tourMute')}
                    >
                      {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-primary" />}
                    </button>
                    <button 
                      onClick={onClose}
                      className="p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white/60 hover:text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Spatial Guideline prompt */}
                <div className="absolute bottom-6 right-6 pointer-events-none hidden md:flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3.5 py-2 rounded-full border border-white/5 text-[9px] text-white/40 font-bold uppercase tracking-widest">
                  <Move className="w-3.5 h-3.5 text-primary animate-pulse" />
                  <span>{t('tourGuideline')}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
