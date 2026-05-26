import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings, Users, Briefcase, Calendar, ChevronRight, CheckCircle2, 
  Trash2, Plus, Sparkles, LogIn, ExternalLink, ShieldCheck, 
  Paintbrush, Layers, Phone, Mail, Globe, Save, HelpCircle, 
  MessageCircle, Star, UserPlus
} from 'lucide-react';
import { 
  collection, getDocs, addDoc, updateDoc, doc, 
  onSnapshot, query, orderBy, getDoc, setDoc 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Property, Booking, Agent, DemoSettings } from '../types';
import { useLanguage } from '../lib/LanguageContext';

interface DemoPortalProps {
  currentRole: 'visitor' | 'agent' | 'admin';
  onChangeRole: (role: 'visitor' | 'agent' | 'admin') => void;
  onUpdateSettings: (settings: Partial<DemoSettings>) => void;
  siteSettings: DemoSettings;
  properties: Property[];
  agents: Agent[];
  bookings: Booking[];
  onUploadClick: () => void;
}

export default function DemoPortal({
  currentRole,
  onChangeRole,
  onUpdateSettings,
  siteSettings,
  properties,
  agents,
  bookings,
  onUploadClick
}: DemoPortalProps) {
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'customizer' | 'admin' | 'agent'>('customizer');
  
  // Custom states for forms
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentEmail, setNewAgentEmail] = useState('');
  const [newAgentPhone, setNewAgentPhone] = useState('');
  const [newAgentZone, setNewAgentZone] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Active Simulated Agent selection
  const [activeAgentId, setActiveAgentId] = useState<string>('');

  // Auto select first agent if none chosen
  useEffect(() => {
    if (agents.length > 0 && !activeAgentId) {
      setActiveAgentId(agents[0].id);
    }
  }, [agents, activeAgentId]);

  // Handle color preset selection
  const colorPresets = [
    { label: 'Sophisticated Gold', value: '#C5A059' },
    { label: 'Sapphire Ocean', value: '#2563EB' },
    { label: 'Emerald Valley', value: '#10B981' },
    { label: 'Ruby Prestige', value: '#EF4444' },
    { label: 'Rose Minimalist', value: '#EC4899' },
    { label: 'Sunset Amber', value: '#F97316' }
  ];

  // Create standard agent
  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName || !newAgentEmail) return;
    setIsRegistering(true);
    try {
      await addDoc(collection(db, 'agents'), {
        name: newAgentName,
        email: newAgentEmail,
        phone: newAgentPhone || '+52 55 ' + Math.floor(10000000 + Math.random() * 90000000),
        zone: newAgentZone || (language === 'es' ? 'General Lujo' : 'General Luxury'),
        photoUrl: `https://images.unsplash.com/photo-${[
          '1534528741775-53994a69daeb',
          '1507003211169-0a1dd7228f2d',
          '1500648767791-00dcc994a43e',
          '1494790108377-be9c29b29330'
        ][Math.floor(Math.random() * 4)]}?auto=format&fit=crop&w=150&q=80`,
        createdAt: new Date().toISOString()
      });
      setNewAgentName('');
      setNewAgentEmail('');
      setNewAgentPhone('');
      setNewAgentZone('');
    } catch (err) {
      console.error('Error creating agent:', err);
    } finally {
      setIsRegistering(false);
    }
  };

  // Google Login / Agent Self Signup handler (Simulated)
  const handleGoogleAgentRegister = async () => {
    const defaultPhotos = [
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'
    ];
    const names = ['Mariela Sánchez', 'Fernando Reyes', 'Laura Quintanilla'];
    const selectedPhoto = defaultPhotos[Math.floor(Math.random() * defaultPhotos.length)];
    const selectedName = names[Math.floor(Math.random() * names.length)];
    const simulatedEmail = `${selectedName.toLowerCase().replace(/ /g, '.')}@google-agent.com`;

    try {
      await addDoc(collection(db, 'agents'), {
        name: selectedName,
        email: simulatedEmail,
        phone: '+52 55 ' + Math.floor(10000000 + Math.random() * 90000000),
        zone: language === 'es' ? 'Zonas Residenciales' : 'Residential Territory',
        photoUrl: selectedPhoto,
        createdAt: new Date().toISOString()
      });
      alert(
        language === 'es'
          ? `¡Registro exitoso con Google! Te has registrado como: ${selectedName}`
          : `Google registration successful! You registered as: ${selectedName}`
      );
    } catch (e) {
      console.error(e);
    }
  };

  // Update lead status
  const handleUpdateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        status: newStatus
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Assign or reassign agent to a property
  const handleAssignAgentToProperty = async (propertyId: string, agentId: string) => {
    const selectedAgent = agents.find(a => a.id === agentId);
    try {
      await updateDoc(doc(db, 'properties', propertyId), {
        agentId: agentId || '',
        agentName: selectedAgent ? selectedAgent.name : (language === 'es' ? 'Sin asignar' : 'Unassigned')
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle property pinning order
  const handleTogglePinProperty = async (propertyId: string, currentPinStatus: boolean) => {
    try {
      await updateDoc(doc(db, 'properties', propertyId), {
        isPinned: !currentPinStatus
      });
    } catch (e) {
      console.error(e);
    }
  };

  // Selected agent object for the agent panel
  const currentAgent = agents.find(a => a.id === activeAgentId);

  // Filter bookings for the active agent or general bookings assigned to active agent
  const agentBookings = bookings.filter(b => {
    const prop = properties.find(p => p.id === b.propertyId);
    return b.agentId === activeAgentId || (prop && prop.agentId === activeAgentId);
  });

  return (
    <>
      {/* Floating Call to Action to enter Demo Portal / Sandbox Configurator */}
      <div className="fixed bottom-6 left-6 z-50">
        <motion.button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-5 py-3 rounded-full bg-primary text-black font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 shadow-2xl transition-all neon-glow cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Settings className="w-4 h-4 animate-spin-slow text-black fill-current" />
          <span>{t('portalLabel')}</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-100 flex justify-end items-stretch overflow-hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Panel Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-lg bg-dark-bg border-l border-white/10 shadow-2xl overflow-hidden flex flex-col h-full z-10"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-dark-surface">
                <div>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-primary fill-current animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{t('portalConsole')}</span>
                  </div>
                  <h3 className="text-xl font-serif italic text-white tracking-wide">{t('portalSandbox')}</h3>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 border border-white/5 bg-white/5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5 text-white/40" />
                </button>
              </div>

              {/* Quick Role Switcher */}
              <div className="p-4 bg-dark-surface/60 border-b border-white/5 grid grid-cols-3 gap-2">
                <button
                  onClick={() => { onChangeRole('visitor'); setActiveTab('customizer'); }}
                  className={`py-2 text-[8px] md:text-[9px] font-bold uppercase tracking-widest rounded-lg border transition-all cursor-pointer ${
                    currentRole === 'visitor' 
                      ? 'bg-primary text-black border-primary' 
                      : 'bg-white/5 text-white/40 border-white/5 hover:text-white'
                  }`}
                >
                  {t('roleVisitor')}
                </button>
                <button
                  onClick={() => { onChangeRole('agent'); setActiveTab('agent'); }}
                  className={`py-2 text-[8px] md:text-[9px] font-bold uppercase tracking-widest rounded-lg border transition-all cursor-pointer ${
                    currentRole === 'agent' 
                      ? 'bg-primary text-black border-primary' 
                      : 'bg-white/5 text-white/40 border-white/5 hover:text-white'
                  }`}
                >
                  {t('roleAgent')}
                </button>
                <button
                  onClick={() => { onChangeRole('admin'); setActiveTab('admin'); }}
                  className={`py-2 text-[8px] md:text-[9px] font-bold uppercase tracking-widest rounded-lg border transition-all cursor-pointer ${
                    currentRole === 'admin' 
                      ? 'bg-primary text-black border-primary' 
                      : 'bg-white/5 text-white/40 border-white/5 hover:text-white'
                  }`}
                >
                  {t('roleAdmin')}
                </button>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex border-b border-white/5 text-[9px] uppercase tracking-widest font-black text-white/40 bg-dark-surface/30">
                <button
                  onClick={() => setActiveTab('customizer')}
                  className={`flex-1 py-4 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'customizer' ? 'text-primary border-primary bg-white/[0.02]' : 'border-transparent hover:text-white'
                  }`}
                >
                  <Paintbrush className="w-3 h-3 text-primary" />
                  {t('tabCustomize')}
                </button>
                
                <button
                  onClick={() => { onChangeRole('admin'); setActiveTab('admin'); }}
                  className={`flex-1 py-4 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'admin' ? 'text-primary border-primary bg-white/[0.02]' : 'border-transparent hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3 text-primary" />
                  {t('tabAdmin')}
                </button>

                <button
                  onClick={() => { onChangeRole('agent'); setActiveTab('agent'); }}
                  className={`flex-1 py-4 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    activeTab === 'agent' ? 'text-primary border-primary bg-white/[0.02]' : 'border-transparent hover:text-white'
                  }`}
                >
                  <Users className="w-3 h-3 text-primary" />
                  {t('tabAgent')}
                </button>
              </div>

              {/* Panel Content Body */}
              <div className="flex-grow p-6 space-y-8 overflow-y-auto">
                
                {/* 1. TAB: CUSTOMIZER */}
                {activeTab === 'customizer' && (
                  <div className="space-y-6">
                    <div className="space-y-2 bg-white/[0.02] p-4 rounded-xl border border-white/5">
                      <h4 className="text-[10px] font-bold tracking-widest uppercase text-primary mb-1">{t('custGuideTitle')}</h4>
                      <p className="text-white/40 text-xs leading-relaxed font-light">{t('custGuideDesc')}</p>
                    </div>

                    {/* Color Theming */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Paintbrush className="w-4 h-4 text-primary" />
                        <h4 className="text-[10px] font-black tracking-widest uppercase text-white">{t('custColTitle')}</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {colorPresets.map((preset) => (
                          <button
                            key={preset.label}
                            onClick={() => onUpdateSettings({ primaryColor: preset.value })}
                            className={`flex items-center gap-2 p-3 rounded-xl border bg-dark-surface/50 text-left transition-all cursor-pointer ${
                              siteSettings.primaryColor === preset.value 
                                ? 'border-primary shadow-[0_0_10px_rgba(197,160,89,0.1)] text-white' 
                                : 'border-white/5 text-white/50 hover:border-white/20'
                            }`}
                          >
                            <span 
                              className="w-4 h-4 rounded-full border border-white/20 shrink-0" 
                              style={{ backgroundColor: preset.value }}
                            />
                            <span className="text-[9px] font-semibold uppercase tracking-wider">{preset.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Slogan details */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4 text-primary" />
                        <h4 className="text-[10px] font-black tracking-widest uppercase text-white">{t('custTitleBanner')}</h4>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={siteSettings.coverText}
                          onChange={(e) => onUpdateSettings({ coverText: e.target.value })}
                          placeholder={t('custTitleInputPlaceholder')}
                          className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-primary/30 transition-all font-bold uppercase placeholder:text-white/20"
                        />
                        <p className="text-[8px] text-white/30 uppercase tracking-widest px-1">
                          {t('custTitleSub')}
                        </p>
                      </div>
                    </div>

                    {/* Listing Corporate structure */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-primary" />
                        <h4 className="text-[10px] font-black tracking-widest uppercase text-white">{t('custCompanyTitle')}</h4>
                      </div>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[8px] uppercase tracking-widest font-bold text-white/30 px-1">{t('custEmailPub')}</label>
                            <input
                              type="text"
                              value={siteSettings.contactEmail}
                              onChange={(e) => onUpdateSettings({ contactEmail: e.target.value })}
                              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-primary/30 font-bold tracking-wider"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] uppercase tracking-widest font-bold text-white/30 px-1">{t('custTelWhatsApp')}</label>
                            <input
                              type="text"
                              value={siteSettings.contactPhone}
                              onChange={(e) => onUpdateSettings({ contactPhone: e.target.value })}
                              className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white text-xs focus:outline-none focus:border-primary/30 font-bold tracking-wider"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}


                {/* 2. TAB: DASHBOARD ADMINISTRADOR */}
                {activeTab === 'admin' && (
                  <div className="space-y-6">
                    <div className="space-y-2 bg-primary/5 p-4 rounded-xl border border-primary/20">
                      <h4 className="text-[10px] font-bold tracking-widest uppercase text-primary flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {t('adminAccessActive')}
                      </h4>
                      <p className="text-white/40 text-xs leading-relaxed font-light">{t('adminAccessDesc')}</p>
                    </div>

                    {/* Recruit agent */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-black tracking-widest uppercase text-white flex items-center gap-1">
                          <Users className="w-4 h-4 text-primary" />
                          {t('adminRegAgent')}
                        </h4>
                      </div>

                      {/* Onboard Agent Form */}
                      <form onSubmit={handleCreateAgent} className="space-y-3 bg-dark-surface/50 border border-white/5 p-4 rounded-xl">
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            required
                            type="text"
                            placeholder={t('adminAgentName')}
                            value={newAgentName}
                            onChange={(e) => setNewAgentName(e.target.value)}
                            className="bg-white/5 border border-white/5 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-primary/30"
                          />
                          <input
                            required
                            type="email"
                            placeholder={t('adminAgentEmail')}
                            value={newAgentEmail}
                            onChange={(e) => setNewAgentEmail(e.target.value)}
                            className="bg-white/5 border border-white/5 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-primary/30"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <input
                            type="text"
                            placeholder={t('adminAgentPhone')}
                            value={newAgentPhone}
                            onChange={(e) => setNewAgentPhone(e.target.value)}
                            className="bg-white/5 border border-white/5 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-primary/30"
                          />
                          <input
                            type="text"
                            placeholder={t('adminAgentZone')}
                            value={newAgentZone}
                            onChange={(e) => setNewAgentZone(e.target.value)}
                            className="bg-white/5 border border-white/5 rounded-lg py-2.5 px-3 text-white text-xs focus:outline-none focus:border-primary/30"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={isRegistering}
                          className="w-full py-2 bg-primary text-black font-black uppercase text-[9px] tracking-widest rounded-lg flex items-center justify-center gap-1.5 hover:bg-white transition-all cursor-pointer"
                        >
                          <UserPlus className="w-3.5 h-3.5" />
                          {isRegistering ? t('btnCreateAgentSaving') : t('btnCreateAgent')}
                        </button>
                      </form>

                      {/* Google simulation */}
                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <span className="text-[9px] font-bold text-white/40 uppercase tracking-wider">{t('adminQuickReg')}</span>
                        <button
                          onClick={handleGoogleAgentRegister}
                          className="py-1 px-3 bg-white/5 hover:bg-white/10 text-white rounded-md text-[8px] font-bold uppercase tracking-widest border border-white/10 flex items-center gap-1 cursor-pointer"
                        >
                          <LogIn className="w-3 h-3 text-primary animate-pulse" />
                          {t('btnSimulateGoogle')}
                        </button>
                      </div>
                    </div>

                    {/* Portfolio Mapping Mapping */}
                    <div className="space-y-4 pt-2">
                      <h4 className="text-[10px] font-black tracking-widest uppercase text-white flex items-center gap-1 mb-2">
                        <Briefcase className="w-4 h-4 text-primary" />
                        {t('adminPortfolioAssign')} ({properties.length})
                      </h4>
                      <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                        {properties.map((prop) => (
                          <div key={prop.id} className="bg-dark-surface/50 p-3 rounded-lg border border-white/5 flex items-center justify-between gap-3 text-xs">
                            <div className="min-w-0">
                              <p className="font-bold text-white truncate text-xs uppercase">{prop.title}</p>
                              <p className="text-[9px] text-white/30 truncate uppercase mt-0.5">{prop.location}</p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                onClick={() => handleTogglePinProperty(prop.id, !!prop.isPinned)}
                                className={`p-1.5 rounded border transition-all cursor-pointer ${
                                  prop.isPinned 
                                    ? 'bg-primary/25 border-primary text-primary' 
                                    : 'bg-white/5 border-transparent text-white/30 hover:text-white'
                                }`}
                                title={prop.isPinned ? "Featured" : "Mark as featured"}
                              >
                                <Star className={`w-3.5 h-3.5 ${prop.isPinned ? 'fill-current' : ''}`} />
                              </button>

                              <select
                                value={prop.agentId || ''}
                                onChange={(e) => handleAssignAgentToProperty(prop.id, e.target.value)}
                                className="bg-black/40 text-white border border-white/10 rounded px-2 py-1 text-[10px] font-black tracking-wider uppercase focus:outline-none focus:border-primary max-w-[120px] cursor-pointer"
                              >
                                <option value="">{t('adminUnassignedAgent')}</option>
                                {agents.map((ag) => (
                                  <option key={ag.id} value={ag.id}>
                                    {ag.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Bookings / Lead overview pipeline */}
                    <div className="space-y-4 pt-2">
                      <h4 className="text-[10px] font-black tracking-widest uppercase text-white flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-primary" />
                        {t('adminGlobalVisits')} ({bookings.length})
                      </h4>
                      <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                        {bookings.length === 0 ? (
                          <div className="text-center py-6 text-white/25 text-xs">{t('adminNoVisits')}</div>
                        ) : (
                          bookings.map((book) => {
                            const dateStr = new Date(book.dateTime).toLocaleString(language === 'es' ? 'es-MX' : 'en-US', {
                              day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                            });
                            const pAgent = agents.find(ag => ag.id === book.agentId || properties.find(p => p.id === book.propertyId)?.agentId === ag.id);
                            
                            // Map string matching for translation logic
                            let statusLabel = book.status || 'Pendiente';
                            if (book.status === 'Visita Realizada') statusLabel = t('adminVisStatusDone');
                            else if (book.status === 'Contactado') statusLabel = t('adminVisStatusContacted');
                            else if (book.status === 'Cancelado') statusLabel = t('adminVisStatusCancelled');
                            else if (book.status === 'Pendiente') statusLabel = t('adminVisStatusPending');

                            return (
                              <div key={book.id} className="bg-dark-surface/40 border border-white/5 p-3 rounded-lg flex flex-col gap-2">
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-bold text-white text-xs uppercase">{book.userName}</p>
                                    <p className="text-[9px] text-white/30 tracking-widest uppercase mt-0.5">{book.userPhone} | {book.userEmail}</p>
                                  </div>
                                  <span className={`px-2 py-0.5 rounded-full text-[7px] font-black uppercase tracking-wider ${
                                    book.status === 'Visita Realizada' ? 'bg-green-500/20 text-green-400 border border-green-500/20' :
                                    book.status === 'Contactado' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/20' :
                                    book.status === 'Cancelado' ? 'bg-red-500/20 text-red-500 border border-red-500/20' :
                                    'bg-primary/20 text-primary border border-primary/20'
                                  }`}>
                                    {statusLabel}
                                  </span>
                                </div>
                                <div className="text-[10px] uppercase font-bold text-white/40 tracking-wider flex justify-between border-t border-white/[0.03] pt-2 mt-1">
                                  <span>{t('adminVisProgress')}: <span className="text-white font-medium">{book.propertyName}</span> ({dateStr})</span>
                                  <span>{t('adminVisAgent')}: <span className="text-primary">{pAgent ? pAgent.name : t('cardUnassigned')}</span></span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                )}


                {/* 3. TAB: DASHBOARD DE AGENTE */}
                {activeTab === 'agent' && (
                  <div className="space-y-6">
                    {/* Active simulator profile selection */}
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest font-black text-white/40">{t('agentSelectDemo')}</label>
                      {agents.length === 0 ? (
                        <div className="text-white/30 text-xs py-4 bg-white/[0.02] text-center border border-white/5 rounded-xl">
                          {t('agentSelectAlert')}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <select
                            value={activeAgentId}
                            onChange={(e) => setActiveAgentId(e.target.value)}
                            className="flex-grow bg-white/5 text-white border border-white/10 rounded-xl py-3 px-4 text-xs font-black uppercase tracking-widest focus:outline-none focus:border-primary cursor-pointer"
                          >
                            {agents.map((ag) => (
                              <option key={ag.id} value={ag.id} className="bg-dark-surface uppercase text-[10px]">
                                {ag.name} - ({ag.zone})
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>

                    {currentAgent && (
                      <div className="space-y-6 pt-2 animate-fade-in">
                        {/* active card header */}
                        <div className="bg-dark-surface p-4 rounded-xl border border-white/5 flex items-center gap-4">
                          <img 
                            src={currentAgent.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                            alt={currentAgent.name}
                            className="w-12 h-12 rounded-full object-cover border border-primary/40 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-[7.5px] font-black uppercase tracking-widest text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                              {t('agentActiveConcierge')}
                            </span>
                            <h4 className="text-sm font-bold text-white uppercase mt-1">{currentAgent.name}</h4>
                            <p className="text-[9px] text-white/40 uppercase tracking-widest">{currentAgent.zone} | {currentAgent.phone}</p>
                          </div>
                        </div>

                        {/* Leads filter for logged concierge */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-white">
                              {t('agentMyLeads')} ({agentBookings.length})
                            </h5>
                          </div>

                          <div className="space-y-3 overflow-y-auto max-h-[400px]">
                            {agentBookings.length === 0 ? (
                              <div className="text-center py-10 bg-white/[0.02] rounded-xl border border-white/5 text-white/20 text-xs">
                                {t('agentNoLeads')}
                              </div>
                            ) : (
                              agentBookings.map((book) => {
                                const visitDate = new Date(book.dateTime).toLocaleString(language === 'es' ? 'es-MX' : 'en-US', {
                                  day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                                });
                                // Build custom WhatsApp invite message link for agent
                                const wpMessage = language === 'es' 
                                  ? `Hola ${book.userName}, soy tu agente de Demo Estate. Te contacto para confirmar la cita agendada el ${visitDate} para la propiedad ${book.propertyName}.`
                                  : `Hello ${book.userName}, this is your Demo Estate agent. I am contacting you to confirm your scheduled tour on ${visitDate} for the property ${book.propertyName}.`;
                                const cleanPhone = book.userPhone.replace(/\D/g, '');
                                const wpLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(wpMessage)}`;

                                return (
                                  <div key={book.id} className="bg-dark-surface/50 border border-white/5 p-4 rounded-xl space-y-3">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <p className="font-bold text-white text-xs uppercase">{book.userName}</p>
                                        <p className="text-[8.5px] text-white/40 font-semibold tracking-wider">{book.userEmail}</p>
                                        <p className="text-[8.5px] text-primary/80 font-bold uppercase tracking-widest mt-0.5">{book.propertyName}</p>
                                      </div>
                                      <select
                                        value={book.status || 'Pendiente'}
                                        onChange={(e) => handleUpdateBookingStatus(book.id, e.target.value)}
                                        className="bg-black/40 text-xs font-bold text-primary border border-white/5 rounded px-2.5 py-1 cursor-pointer"
                                      >
                                        <option value="Pendiente">{t('adminVisStatusPending')}</option>
                                        <option value="Contactado">{t('adminVisStatusContacted')}</option>
                                        <option value="Visita Realizada">{t('adminVisStatusDone')}</option>
                                        <option value="Cancelado">{t('adminVisStatusCancelled')}</option>
                                      </select>
                                    </div>

                                    <div className="flex items-center gap-3 pt-2 border-t border-white/[0.03] text-[9px] uppercase tracking-widest font-black text-white/40 justify-between">
                                      <span>{language === 'es' ? 'Cita' : 'Tour'}: <span className="text-white">{visitDate}</span></span>
                                      
                                      <div className="flex items-center gap-2">
                                        <a
                                          href={wpLink}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="px-2.5 py-1.5 bg-[#25D366] text-black hover:bg-white rounded-lg transition-all flex items-center gap-1 font-black shrink-0 cursor-pointer"
                                        >
                                          <MessageCircle className="w-3.5 h-3.5 fill-current" />
                                          WhatsApp
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>

                        {/* Assigned inventory view */}
                        <div className="space-y-3 pt-2">
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-white">
                            {t('agentResidences')} ({properties.filter(p => p.agentId === activeAgentId).length})
                          </h5>
                          <div className="grid grid-cols-2 gap-3">
                            {properties.filter(p => p.agentId === activeAgentId).map(prop => (
                              <div key={prop.id} className="bg-dark-surface/30 p-2.5 rounded-lg border border-white/5 text-center space-y-1.5">
                                <img
                                  src={prop.imageUrl}
                                  alt={prop.title}
                                  className="w-full h-20 object-cover rounded-md"
                                  referrerPolicy="no-referrer"
                                />
                                <div className="space-y-0.5">
                                  <p className="font-bold text-white text-[9px] truncate uppercase">{prop.title}</p>
                                  <p className="text-primary text-[8px] font-bold font-serif italic">${new Intl.NumberFormat('es-MX').format(prop.price)}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sticky Premium Call-To-Action Footer for WhatsApp conversion */}
              <div className="p-5 bg-dark-surface border-t border-white/10 flex flex-col gap-3 sticky bottom-0 left-0 right-0 z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.5)] shrink-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary">
                    {language === 'es' ? '¿Listo para tu propio sitio de élite?' : 'Ready for your own elite site?'}
                  </span>
                </div>
                <a
                  href={`https://wa.me/526622243358?text=${encodeURIComponent(t('wpInterestedText'))}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-4 bg-primary hover:bg-white text-black font-black uppercase text-[10px] tracking-[0.25em] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 rounded-xl shadow-[0_4px_20px_rgba(197,160,89,0.3)] duration-300 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 text-black fill-current animate-pulse shrink-0" />
                  {t('btnInterested')}
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
