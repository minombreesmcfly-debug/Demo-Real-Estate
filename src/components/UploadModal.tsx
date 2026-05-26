import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ImagePlus, Loader2, CheckCircle2, DollarSign, MapPin, Type, AlignLeft } from 'lucide-react';
import { db, addDoc, collection, serverTimestamp } from '../lib/firebase';

interface UploadModalProps {
  onClose: () => void;
}

export default function UploadModal({ onClose }: UploadModalProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', // Default placeholder
    bedrooms: '3',
    bathrooms: '2',
    area: '150'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addDoc(collection(db, 'properties'), {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        location: formData.location,
        imageUrl: formData.imageUrl,
        features: [formData.bedrooms, formData.bathrooms, formData.area],
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setTimeout(onClose, 3000);
    } catch (error) {
      console.error('Error uploading property:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-dark-surface w-full max-w-2xl rounded-3xl overflow-hidden relative max-h-[90vh] overflow-y-auto border border-white/10 shadow-2xl"
        >
          {success ? (
            <div className="p-12 md:p-20 text-center space-y-4 md:space-y-6">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/30">
                <CheckCircle2 className="w-10 h-10 md:w-12 md:h-12 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-serif italic text-white uppercase tracking-tighter">Propiedad Publicada</h3>
                <p className="text-white/30 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">Su activo ahora es visible en nuestro catálogo global.</p>
              </div>
            </div>
          ) : (
            <div className="p-6 md:p-10 space-y-8 md:space-y-10">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl md:text-3xl font-serif italic tracking-tight text-white leading-none">Publicar Propiedad</h3>
                  <p className="text-primary text-[8px] md:text-[10px] font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase mt-2">Venda con tecnología del futuro</p>
                </div>
                <button onClick={onClose} className="p-2 md:p-3 hover:bg-white/5 rounded-full transition-colors border border-white/5">
                  <X className="w-4 h-4 md:w-5 md:h-5 text-white/30" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/30 px-1">Título de la Propiedad</label>
                    <div className="relative">
                      <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <input
                        required
                        placeholder="EJ. MANSIÓN MINIMALISTA"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white text-[10px] uppercase tracking-widest focus:outline-none focus:border-primary/30 transition-all font-bold placeholder:text-white/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/30 px-1">Ubicación</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <input
                        required
                        placeholder="CIUDAD, ESTADO"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white text-[10px] uppercase tracking-widest focus:outline-none focus:border-primary/30 transition-all font-bold placeholder:text-white/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/30 px-1">Descripción</label>
                  <div className="relative">
                    <AlignLeft className="absolute left-4 top-5 w-4 h-4 text-primary/40" />
                    <textarea
                      required
                      placeholder="DETALLES SOBRE LA PROPIEDAD..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white text-[10px] uppercase tracking-widest focus:outline-none focus:border-primary/30 transition-all font-bold h-32 placeholder:text-white/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/30 px-1">Precio (USD)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <input
                        required
                        type="number"
                        placeholder="0.00"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white text-[10px] uppercase tracking-widest focus:outline-none focus:border-primary/30 transition-all font-bold placeholder:text-white/20"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[9px] uppercase tracking-[0.3em] font-bold text-white/30 px-1">URL de Imagen Premium</label>
                    <div className="relative">
                      <ImagePlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <input
                        required
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-4 pl-12 pr-4 text-white text-[10px] uppercase tracking-widest focus:outline-none focus:border-primary/30 transition-all font-bold placeholder:text-white/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-4">
                   <div className="space-y-3">
                     <label className="text-[8px] uppercase tracking-widest font-bold text-white/20 block text-center">Beds</label>
                     <input
                       type="number"
                       value={formData.bedrooms}
                       onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                       className="w-full bg-white/5 border border-white/5 rounded-lg py-3 text-center text-white focus:border-primary/30 transition-all text-xs font-bold"
                     />
                   </div>
                   <div className="space-y-3">
                     <label className="text-[8px] uppercase tracking-widest font-bold text-white/20 block text-center">Baths</label>
                     <input
                       type="number"
                       value={formData.bathrooms}
                       onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                       className="w-full bg-white/5 border border-white/5 rounded-lg py-3 text-center text-white focus:border-primary/30 transition-all text-xs font-bold"
                     />
                   </div>
                   <div className="space-y-3">
                     <label className="text-[8px] uppercase tracking-widest font-bold text-white/20 block text-center">Area m²</label>
                     <input
                       type="number"
                       value={formData.area}
                       onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                       className="w-full bg-white/5 border border-white/5 rounded-lg py-3 text-center text-white focus:border-primary/30 transition-all text-xs font-bold"
                     />
                   </div>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full py-5 bg-primary text-black rounded-xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-2xl"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Lanzar Activo al Mercado'}
                </button>
              </form>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
