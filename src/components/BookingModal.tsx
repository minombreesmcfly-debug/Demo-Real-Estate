import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Calendar, Clock, User, Phone, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { db, addDoc, collection, serverTimestamp } from '../lib/firebase';
import type { Property } from '../types';
import { useLanguage } from '../lib/LanguageContext';

interface BookingModalProps {
  property: Property | null;
  onClose: () => void;
}

export default function BookingModal({ property, onClose }: BookingModalProps) {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!property) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'bookings'), {
        propertyId: property.id,
        propertyName: property.title,
        userName: formData.name,
        userEmail: formData.email,
        userPhone: formData.phone,
        dateTime: `${formData.date}T${formData.time}`,
        status: "Pendiente",
        agentId: property.agentId || "",
        agentName: property.agentName || "Sin asignar",
        createdAt: serverTimestamp()
      });
      setSuccess(true);
      setTimeout(onClose, 3000);
    } catch (error) {
      console.error('Error booking tour:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!property) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Outer relative container to hold absolute hand-made annotations around */}
        <div className="relative z-10 w-full max-w-lg my-8">

          {/* Handdrawn Annotation LEFT (Pointing to Inputs / Desktop Only) */}
          <div className="hidden xl:block absolute -left-80 top-12 w-72 text-left space-y-3 pointer-events-none select-none">
            <div className="flex items-start gap-3 bg-black/40 p-4 rounded-2xl border border-primary/20 backdrop-blur-sm">
              <span className="text-3xl">✍</span>
              <div>
                <p className="font-handwritten text-[22px] text-primary leading-tight font-bold">
                  {t('annHereProspects')}
                </p>
                <div className="h-2" />
                <svg className="w-20 h-10 text-primary mt-1 animate-pulse" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M10,5 C40,5 50,30 90,25" strokeDasharray="4,4" />
                  <path d="M80,18 L90,25 L81,32" />
                </svg>
              </div>
            </div>
          </div>

          {/* Handdrawn Annotation RIGHT (Pointing to Admin Dashboard Sync / Desktop Only) */}
          <div className="hidden xl:block absolute -right-82 top-24 w-76 text-left space-y-3 pointer-events-none select-none">
            <div className="flex items-start gap-3 bg-black/40 p-5 rounded-2xl border border-primary/20 backdrop-blur-sm">
              <span className="text-3xl">🎯</span>
              <div>
                <p className="font-handwritten text-[21px] text-primary leading-tight font-bold">
                  {t('annInfoDirectToDashboard')}
                </p>
                <p className="font-handwritten text-sm text-white/50 leading-tight mt-1.5">
                  {t('annDemoPurpose')}
                </p>
                <p className="font-handwritten text-[17px] text-primary/80 font-semibold leading-tight mt-2.5 italic">
                  {t('annSoYouUnderstand')}
                </p>
                <div className="h-2" />
                <svg className="w-20 h-10 text-primary mt-1 -scale-x-100 animate-pulse" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M10,5 C40,5 50,30 90,25" strokeDasharray="4,4" />
                  <path d="M80,18 L90,25 L81,32" />
                </svg>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-dark-surface w-full rounded-2xl md:rounded-3xl overflow-hidden relative border border-white/10 shadow-2xl"
          >
            {/* Mobile Annotation Header Panel */}
            <div className="xl:hidden bg-primary/10 border-b border-primary/20 p-4 text-center">
              <p className="font-handwritten text-[18px] text-primary leading-tight font-bold">
                ✍ {t('annHereProspects')}
              </p>
            </div>

            {success ? (
              <div className="p-8 md:p-12 text-center space-y-4 md:space-y-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto border border-primary/30">
                  <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl md:text-2xl font-serif italic text-white">{t('bookSuccessTitle')}</h3>
                  <p className="text-white/40 text-[8px] md:text-[10px] uppercase tracking-widest font-bold">{t('bookSuccessMessage')}</p>
                </div>
              </div>
            ) : (
              <>
                <div className="p-6 md:p-8 border-b border-white/5 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl md:text-2xl font-serif italic text-white tracking-tight">{t('bookTitle')}</h3>
                    <p className="text-[8px] md:text-[10px] text-primary font-bold uppercase tracking-widest mt-1">{property.title}</p>
                    <p className="text-[8px] text-white/50 uppercase tracking-widest mt-1">
                      {t('bookAgentInCharge')}: <span className="text-primary font-bold">{property.agentName || t('cardUnassigned')}</span>
                    </p>
                  </div>
                  <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors border border-white/5 cursor-pointer">
                    <X className="w-4 h-4 md:w-5 md:h-5 text-white/30" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/30 px-1">{t('labelDate')}</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                        <input
                          required
                          type="date"
                          value={formData.date}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white text-xs focus:outline-none focus:border-primary/30 transition-all cursor-pointer"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/30 px-1">{t('labelTime')}</label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                        <input
                          required
                          type="time"
                          value={formData.time}
                          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                          className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white text-xs focus:outline-none focus:border-primary/30 transition-all cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <input
                        required
                        type="text"
                        placeholder={t('placeholderName')}
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white text-xs focus:outline-none focus:border-primary/30 transition-all font-bold placeholder:text-white/20"
                      />
                    </div>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <input
                        required
                        type="email"
                        placeholder={t('placeholderEmail')}
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white text-xs focus:outline-none focus:border-primary/30 transition-all font-bold placeholder:text-white/20"
                      />
                    </div>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                      <input
                        required
                        type="tel"
                        placeholder={t('placeholderPhone')}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-3 pl-11 pr-4 text-white text-xs focus:outline-none focus:border-primary/30 transition-all font-bold placeholder:text-white/20"
                      />
                    </div>
                  </div>

                  <button
                    disabled={loading}
                    type="submit"
                    className="w-full py-4 bg-primary text-black rounded-xl font-black uppercase tracking-[0.2em] text-[10px] hover:bg-white transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-2xl cursor-pointer"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('btnSubmitBook')}
                  </button>
                </form>

                {/* Mobile Annotation Footer Panel */}
                <div className="xl:hidden bg-white/5 p-4 py-5 text-center rounded-b-3xl border-t border-white/5 space-y-2">
                  <p className="font-handwritten text-[16px] text-primary/90 leading-tight">
                    🎯 {t('annInfoDirectToDashboard')}
                  </p>
                  <p className="font-handwritten text-[13px] text-white/50 leading-tight">
                    {t('annDemoPurpose')}
                  </p>
                  <p className="font-handwritten text-[14px] text-primary/80 italic font-bold">
                    {t('annSoYouUnderstand')}
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}
