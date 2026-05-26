import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Compass, Radio, Info, Eye, Volume2, VolumeX, Maximize2, Move } from 'lucide-react';

interface VirtualTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function VirtualTourModal({ isOpen, onClose, title }: VirtualTourModalProps) {
  const [activePan, setActivePan] = useState<'sala' | 'cocina' | 'terraza'>('sala');
  const [infoNode, setInfoNode] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);

  // High quality immersive spatial views
  const views = {
    sala: {
      image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      label: "Estancia Principal",
      nodes: [
        { id: 'domotica', x: '45%', y: '40%', label: "Domo Bioclimático", desc: "Sensores inteligentes de luz solar y climatización integrada." },
        { id: 'cristal', x: '75%', y: '60%', label: "Cristalería Inteligente", desc: "Tecnología electrocrómica que se aclara u oscurece a un toque." }
      ]
    },
    cocina: {
      image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      label: "Cocina de Autor",
      nodes: [
        { id: 'isla', x: '50%', y: '55%', label: "Cubiertas de Cuarzo Puro", desc: "Material antibacteriano e irrompible moldeado por láser." },
        { id: 'electro', x: '20%', y: '45%', label: "Electrodomésticos Ocultos", desc: "Gabinetes integrados de apertura táctil silenciosa." }
      ]
    },
    terraza: {
      image: "https://images.unsplash.com/photo-1600566752229-2734f278d079?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80",
      label: "Terraza Suspendida",
      nodes: [
        { id: 'alberca', x: '35%', y: '65%', label: "Piscina Semivolada", desc: "Acrílico estructural con vistas infinitas al horizonte." },
        { id: 'fire', x: '70%', y: '70%', label: "Fogatero Bioetanol", desc: "Calefacción limpia integrada en diseño pétreo." }
      ]
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-2 md:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-xl"
          />

          {/* Spatial View Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            className="bg-dark-bg w-full max-w-5xl aspect-video rounded-2xl md:rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl flex flex-col z-10"
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

              {/* Dynamic Camera Drift Loop (to simulate active 3D camera pan) */}
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
                    transition={{ delay: 0.5 }}
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

              {/* Spatial Pan Selector Sidebar */}
              <div className="absolute bottom-6 left-6 z-30 flex items-center gap-2">
                {Object.entries(views).map(([key, view]) => (
                  <button
                    key={key}
                    onClick={() => { setActivePan(key as any); setInfoNode(null); }}
                    className={`px-4 py-2 rounded-lg border text-[8px] font-black uppercase tracking-widest transition-all ${
                      activePan === key 
                        ? 'bg-primary text-black border-primary' 
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
                    Tour Digital Inmersivo • {views[activePan].label}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMuted(!muted)}
                    className="p-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full text-white/60 hover:text-white transition-colors"
                    title={muted ? "Activar audio espacial" : "Mute"}
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
              <div className="absolute bottom-6 right-6 pointer-events-none hidden md:flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3.5 py-2 rounded-full border border-white/5 text-xs text-white/40 font-bold uppercase tracking-widest">
                <Move className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span>Usa los hotspots para explorar detalles</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
