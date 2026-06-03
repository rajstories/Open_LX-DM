import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Search,
  Compass,
  Play,
  Check,
  Lock,
  Info,
  X
} from 'lucide-react';
import { Card } from './DashboardPrimitives';

// ==========================================
// DATA SCHEMAS & INTERFACES
// ==========================================
type AcademyState = 'active' | 'loading' | 'empty';
type CourseCategory = 'all' | 'monetization' | 'growth' | 'setup';

interface PlaylistCourse {
  id: string;
  title: string;
  category: CourseCategory;
  desc: string;
  duration: string;
  indexText: string;
  glowColor: string;
  gradient: string;
  keyword: string;
  iconType: 'browser' | 'card' | 'mobile' | 'play' | 'globe' | 'shield' | 'target';
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

// ==========================================
// CORE SEED DATA
// ==========================================
const FEATURED_MASTERCLASS = {
  title: 'The only Masterclass you need to Make Money Online',
  desc: 'Learn the proven model to make money online - used by thousands of creators to turn Instagram engagement into daily income.',
  outcomes: [
    { value: '10x', label: 'Increase in followers' },
    { value: '200-300', label: 'Automated DMs/day' },
    { value: '5,000+', label: 'Comments on single reel' },
    { value: '₹500 - ₹5,000', label: 'Daily from product sales' }
  ]
};

const TUTORIALS_PLAYLIST: PlaylistCourse[] = [
  {
    id: 'c_tut_1',
    title: 'Getting started with Open LX',
    category: 'setup',
    desc: 'Learn how to set up Store, AutoDM, and Digital Products to start selling.',
    duration: '3m video',
    indexText: '01 // SETUP',
    glowColor: 'bg-indigo-500/10',
    gradient: 'from-[#6366F1]/20 via-[#0D0E12] to-[#06B6D4]/10',
    keyword: 'START',
    iconType: 'browser'
  },
  {
    id: 'c_tut_2',
    title: 'How to Sell Digital Products on Open LX',
    category: 'monetization',
    desc: 'Learn how to create and sell digital products with ease.',
    duration: '5m video',
    indexText: '02 // MONETIZE',
    glowColor: 'bg-rose-500/10',
    gradient: 'from-[#F43F5E]/20 via-[#0D0E12] to-[#F59E0B]/10',
    keyword: 'SELL',
    iconType: 'card'
  },
  {
    id: 'c_tut_3',
    title: 'How to Set Up Your Online Store with Open LX',
    category: 'setup',
    desc: 'A complete guide to setting up your online store and linking accounts.',
    duration: '4m video',
    indexText: '03 // BIO LINK',
    glowColor: 'bg-amber-500/10',
    gradient: 'from-[#D97706]/20 via-[#0D0E12] to-[#EA580C]/10',
    keyword: 'STORE',
    iconType: 'mobile'
  },
  {
    id: 'c_tut_4',
    title: 'How to Create Online Courses with Open LX',
    category: 'monetization',
    desc: 'Step-by-step guide to creating and selling courses.',
    duration: '6m video',
    indexText: '04 // COURSES',
    glowColor: 'bg-sky-500/10',
    gradient: 'from-[#0EA5E9]/20 via-[#0D0E12] to-[#6366F1]/10',
    keyword: 'LEARN',
    iconType: 'play'
  }
];

const NICHES_PLAYLIST: PlaylistCourse[] = [
  {
    id: 'c_niche_1',
    title: 'How to earn and multiply your earnings as a Travel Creator',
    category: 'growth',
    desc: 'Learn how travel creators turn content into consistent income.',
    duration: '12m video',
    indexText: '05 // TRAVEL',
    glowColor: 'bg-blue-500/10',
    gradient: 'from-[#3B82F6]/20 via-[#0D0E12] to-[#8B5CF6]/10',
    keyword: 'TRAVEL',
    iconType: 'globe'
  },
  {
    id: 'c_niche_2',
    title: 'How to create a new online income stream as Doctors',
    category: 'monetization',
    desc: 'Discover how doctors can build an additional income stream online.',
    duration: '15m video',
    indexText: '06 // DOCTOR',
    glowColor: 'bg-teal-500/10',
    gradient: 'from-[#0D9488]/20 via-[#0D0E12] to-[#10B981]/10',
    keyword: 'INCOME',
    iconType: 'shield'
  },
  {
    id: 'c_niche_3',
    title: 'Making money online with your passion for fitness',
    category: 'growth',
    desc: 'Learn how to make money online with your passion for fitness.',
    duration: '10m video',
    indexText: '07 // FITNESS',
    glowColor: 'bg-red-500/10',
    gradient: 'from-[#EF4444]/20 via-[#0D0E12] to-[#F97316]/10',
    keyword: 'FITNESS',
    iconType: 'target'
  }
];

// ==========================================
// ABSTRACT VECTOR GRAPHICS FOR MINIMAL THUMBNAILS
// ==========================================
const renderThumbnailVector = (type: string) => {
  const activeStroke = "#FF6846"; // branding highlight color accent
  switch (type) {
    case 'browser':
      return (
        <svg viewBox="0 0 100 60" className="w-24 h-14 opacity-50 group-hover:opacity-90 transition-all duration-300" fill="none" strokeWidth="1.5">
          <rect x="5" y="5" width="90" height="50" rx="4" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
          <line x1="5" y1="16" x2="95" y2="16" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
          <circle cx="12" cy="10" r="1.5" className="fill-white/25 group-hover:fill-white/50 transition-colors duration-300" stroke="none" />
          <circle cx="18" cy="10" r="1.5" className="fill-white/25 group-hover:fill-white/50 transition-colors duration-300" stroke="none" />
          <circle cx="24" cy="10" r="1.5" className="fill-white/25 group-hover:fill-white/50 transition-colors duration-300" stroke="none" />
          <line x1="25" y1="16" x2="25" y2="55" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
          <line x1="32" y1="24" x2="55" y2="24" stroke={activeStroke} strokeWidth="1.8" />
          <line x1="32" y1="34" x2="46" y2="34" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
        </svg>
      );
    case 'card':
      return (
        <svg viewBox="0 0 100 60" className="w-24 h-14 opacity-50 group-hover:opacity-90 transition-all duration-300" fill="none" strokeWidth="1.5">
          <rect x="12" y="10" width="76" height="40" rx="4" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
          <rect x="20" y="17" width="14" height="9" rx="1.5" stroke={activeStroke} strokeWidth="1.8" />
          <line x1="20" y1="33" x2="56" y2="33" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
          <line x1="20" y1="40" x2="44" y2="40" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
          <circle cx="72" cy="21" r="3.5" stroke={activeStroke} strokeWidth="1.5" />
        </svg>
      );
    case 'mobile':
      return (
        <svg viewBox="0 0 100 60" className="w-24 h-14 opacity-50 group-hover:opacity-90 transition-all duration-300" fill="none" strokeWidth="1.5">
          <rect x="38" y="5" width="24" height="50" rx="5" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
          <line x1="45" y1="10" x2="55" y2="10" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" strokeWidth="1" />
          <circle cx="50" cy="50" r="1.5" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
          <rect x="43" y="16" width="14" height="7" rx="1" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
          <rect x="43" y="26" width="14" height="7" rx="1" stroke={activeStroke} strokeWidth="1.8" />
          <rect x="43" y="36" width="14" height="7" rx="1" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
        </svg>
      );
    case 'play':
      return (
        <svg viewBox="0 0 100 60" className="w-24 h-14 opacity-50 group-hover:opacity-90 transition-all duration-300" fill="none" strokeWidth="1.5">
          <rect x="8" y="8" width="84" height="44" rx="4" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
          <circle cx="50" cy="30" r="9" stroke={activeStroke} strokeWidth="1.8" />
          <polygon points="48,27 48,33 54,30" fill={activeStroke} stroke="none" />
        </svg>
      );
    case 'globe':
      return (
        <svg viewBox="0 0 100 60" className="w-24 h-14 opacity-50 group-hover:opacity-90 transition-all duration-300" fill="none" strokeWidth="1.5">
          <circle cx="50" cy="30" r="22" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
          <ellipse cx="50" cy="30" rx="9" ry="22" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
          <ellipse cx="50" cy="30" rx="22" ry="7" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
          <line x1="28" y1="30" x2="72" y2="30" stroke={activeStroke} strokeWidth="1.8" />
        </svg>
      );
    case 'shield':
      return (
        <svg viewBox="0 0 100 60" className="w-24 h-14 opacity-50 group-hover:opacity-90 transition-all duration-300" fill="none" strokeWidth="1.5">
          <path d="M50 8 C30 11, 30 16, 30 26 C30 40, 50 50, 50 52 C50 50, 70 40, 70 26 C70 16, 70 11, 50 8 Z" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
          <path d="M43 28 L48 33 L57 23" stroke={activeStroke} strokeWidth="2.2" />
        </svg>
      );
    case 'target':
      return (
        <svg viewBox="0 0 100 60" className="w-24 h-14 opacity-50 group-hover:opacity-90 transition-all duration-300" fill="none" strokeWidth="1.5">
          <circle cx="50" cy="30" r="21" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
          <circle cx="50" cy="30" r="14" stroke={activeStroke} strokeWidth="1.8" />
          <circle cx="50" cy="30" r="7" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
          <line x1="50" y1="5" x2="50" y2="9" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
          <line x1="50" y1="51" x2="50" y2="55" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
          <line x1="25" y1="30" x2="29" y2="30" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
          <line x1="71" y1="30" x2="75" y2="30" className="stroke-white/15 group-hover:stroke-white/30 transition-colors duration-300" />
        </svg>
      );
    default:
      return null;
  }
};

// ==========================================
// CORE VIEW LAYER
// ==========================================
export default function AcademyView() {
  const [sandboxState, setSandboxState] = useState<AcademyState>('active');
  const [activeCategory, setActiveCategory] = useState<CourseCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Simulation handlers
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const addToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handlePlayVideo = (title: string) => {
    setSelectedVideo(title);
    setShowVideoModal(true);
    addToast(`Playing: "${title}"`, 'success');
  };

  // Search & filter matching logic
  const filterList = (list: PlaylistCourse[]) => {
    return list.filter(item => {
      const matchSearch = searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === 'all' || item.category === activeCategory;
      return matchSearch && matchCat;
    });
  };

  const filteredTutorials = filterList(TUTORIALS_PLAYLIST);
  const filteredNiches = filterList(NICHES_PLAYLIST);

  const isSearchEmpty = filteredTutorials.length === 0 && filteredNiches.length === 0;

  return (
    <div className="flex flex-col gap-6 font-sans text-dash-text select-none text-left max-w-6xl mx-auto w-full pb-8">
      
      {/* ==========================================
          HEADER SECTION (WITH STATE TOGGLE FOR TESTING)
          ========================================== */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-[#E8E5DF] rounded-2xl p-5 mb-1 shadow-sm select-none">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-dash-accent font-mono">Creator Education</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-dash-sidebar text-white font-mono font-semibold uppercase">ACADEMY</span>
          </div>
          <h2 className="text-xl font-extrabold text-dash-text mt-0.5 tracking-tight font-sans">Creator Studio Academy</h2>
        </div>

        {/* State Simulations Controller */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <label className="text-[10px] uppercase font-black text-dash-text-tertiary hidden md:block">Academy Mode</label>
          <select
            value={sandboxState}
            onChange={(e) => setSandboxState(e.target.value as AcademyState)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-dash-muted border border-[#E8E5DF] text-dash-text focus:outline-none"
          >
            <option value="active">🟢 Active Hub Catalog</option>
            <option value="loading">⏳ Pulse loading skeletons</option>
            <option value="empty">📭 Empty search state</option>
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* ==========================================
            STATE 1: LOADING SKELETONS
            ========================================== */}
        {sandboxState === 'loading' && (
          <motion.div
            key="academy_loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-8"
          >
            <div className="w-full h-[380px] bg-white border border-[#E8E5DF] rounded-2xl animate-pulse p-6 flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-[45%] h-full bg-neutral-100 rounded-xl" />
              <div className="flex-1 flex flex-col justify-between py-2 gap-4">
                <div className="w-1/3 h-4 bg-neutral-100 rounded" />
                <div className="w-3/4 h-10 bg-neutral-100 rounded" />
                <div className="w-full h-24 bg-neutral-100 rounded" />
                <div className="w-1/2 h-10 bg-neutral-100 rounded" />
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-48 h-4 bg-neutral-100 rounded animate-pulse" />
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="flex flex-col gap-3">
                    <div className="aspect-video w-full bg-neutral-100 rounded-xl animate-pulse" />
                    <div className="w-3/4 h-3 bg-neutral-100 rounded" />
                    <div className="w-full h-6 bg-neutral-100 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ==========================================
            STATE 2: EMPTY STATE
            ========================================== */}
        {(sandboxState === 'empty' || (sandboxState === 'active' && isSearchEmpty)) && (
          <motion.div
            key="academy_empty"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <Card className="flex flex-col items-center justify-center p-14 text-center border-dashed border-[#E8E5DF] min-h-[400px] bg-white">
              <Compass className="w-12 h-12 text-dash-text-tertiary mb-4 animate-pulse shrink-0" />
              <h3 className="text-base font-extrabold text-dash-text tracking-tight">No Playbooks Match Search Query</h3>
              <p className="text-xs text-dash-text-secondary mt-1.5 max-w-sm mx-auto leading-relaxed">
                Try searching broad terms like "Setup", "Sell", "Travel", or "Niche" to explore setup playbooks.
              </p>
              
              <div className="flex gap-3 justify-center items-center mt-6 select-none">
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
                  className="px-5 py-2.5 rounded-full bg-dash-sidebar hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm border-none cursor-pointer flex items-center gap-1.5"
                >
                  <span>Reset Search Filter</span>
                </button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* ==========================================
            STATE 3: ACTIVE PLAYBOOKS HUB
            ========================================== */}
        {sandboxState === 'active' && !isSearchEmpty && (
          <motion.div
            key="academy_active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-8"
          >
            
            {/* 1. CINEMATIC HERO COVER BANNER */}
            <div className="relative w-full rounded-2xl overflow-hidden bg-gradient-to-b from-[#111A13] via-[#0E0E10] to-[#0E0E10] py-16 text-center select-none shadow-md">
              <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#10B981]/5 rounded-full blur-[100px] pointer-events-none" />
              
              <div className="relative z-10 px-6 max-w-3xl mx-auto flex flex-col items-center">
                <span className="text-amber-400 font-bold tracking-widest text-[10px] uppercase flex items-center gap-2 font-mono">
                  🎓 Creator Academy
                </span>
                <h1 className="text-3xl md:text-5xl font-light text-white tracking-tight mt-4 max-w-2xl mx-auto leading-tight font-sans select-text">
                  Learn how to grow and sell with Open LX
                </h1>
              </div>
            </div>

            {/* 2. ESSENTIALS - START HERE SECTION */}
            {activeCategory === 'all' && !searchQuery && (
              <div className="flex flex-col gap-4 text-left">
                <h3 className="text-sm font-black uppercase tracking-wider text-dash-text-secondary flex items-center gap-2">
                  👉 Essentials - Start here
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-2 bg-white border border-[#E8E5DF] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(0,0,0,0.02)] p-6 gap-6">
                  {/* Left: Video Player Mock */}
                  <div
                    onClick={() => handlePlayVideo(FEATURED_MASTERCLASS.title)}
                    className="aspect-video w-full bg-[#0D0E12] rounded-xl overflow-hidden flex items-center justify-center relative group cursor-pointer border border-neutral-800/40 shadow-xl select-none transition-all duration-300 hover:border-neutral-700/60"
                  >
                    {/* Mesh Gradient Blur */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#FF6846]/20 via-[#0D0E12] to-[#B45309]/10 opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    {/* Dot Grid */}
                    <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                    
                    <div className="absolute w-32 h-32 bg-[#FF6846]/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Text background keyword */}
                    <span className="absolute top-4 left-4 text-[13px] font-black tracking-[0.25em] text-white/[0.04] font-mono select-none uppercase">
                      MASTERCLASS
                    </span>

                    {/* Left corner mini tag */}
                    <span className="absolute left-4 bottom-3 text-[9px] font-bold tracking-widest text-neutral-500 font-mono select-none uppercase">
                      00 // COMMERCIAL ROADMAP
                    </span>

                    {/* Stylized background graphics */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-35 group-hover:opacity-55 transition-opacity duration-300 pointer-events-none">
                      <svg viewBox="0 0 100 60" className="w-32 h-20" fill="none" strokeWidth="1.5">
                        <rect x="10" y="15" width="24" height="14" rx="2" className="stroke-white/20" />
                        <rect x="66" y="15" width="24" height="14" rx="2" className="stroke-white/20" />
                        <circle cx="50" cy="42" r="10" stroke="#FF6846" strokeWidth="1.8" />
                        <path d="M22 29 L22 42 L40 42" className="stroke-white/15" />
                        <path d="M78 29 L78 42 L60 42" className="stroke-white/15" />
                        <path d="M50 32 L50 20 L40 20" className="stroke-white/15" />
                      </svg>
                    </div>

                    {/* Floating Play Badge */}
                    <div className="w-13 h-13 bg-white text-black hover:bg-[#FF6846] hover:text-white rounded-full flex items-center justify-center absolute inset-0 m-auto shadow-2xl transform scale-100 group-hover:scale-110 group-hover:bg-[#FF6846] group-hover:text-white transition-all duration-300 z-20">
                      <Play className="w-5 h-5 text-current fill-current translate-x-0.5 transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Right: Info details */}
                  <div className="flex flex-col justify-between">
                    <div>
                      <h4 className="text-base font-extrabold text-dash-text leading-tight tracking-tight">
                        {FEATURED_MASTERCLASS.title}
                      </h4>
                      <p className="text-xs text-dash-text-secondary mt-2.5 leading-relaxed font-light">
                        {FEATURED_MASTERCLASS.desc}
                      </p>
                      
                      {/* Grid of Outcomes */}
                      <div className="grid grid-cols-2 gap-3 mt-5">
                        {FEATURED_MASTERCLASS.outcomes.map((item, idx) => (
                          <div key={idx} className="bg-neutral-50 border border-[#E8E5DF] px-3.5 py-2.5 rounded-xl flex flex-col justify-center">
                            <span className="text-xs font-black text-dash-text leading-tight">{item.value}</span>
                            <span className="text-[10px] text-dash-text-secondary mt-0.5 leading-normal font-light">{item.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pro Action Button */}
                    <button
                      onClick={() => handlePlayVideo(FEATURED_MASTERCLASS.title)}
                      className="w-full mt-6 py-3.5 bg-gradient-to-r from-[#B45309] to-[#D97706] hover:opacity-95 text-white text-xs font-bold rounded-xl border-none cursor-pointer flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Resume Masterclass (Included in Pro)</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ==========================================
                SEARCH & CATEGORY FILTERS STICKY BAR
                ========================================== */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white border border-[#E8E5DF] rounded-2xl p-4 shadow-sm select-none">
              
              {/* Category pills */}
              <div className="bg-dash-muted rounded-xl p-1 flex flex-wrap items-center gap-1 border border-[#E8E5DF] shrink-0">
                {[
                  { id: 'all', label: 'All Playbooks' },
                  { id: 'setup', label: 'Learn Open LX' },
                  { id: 'monetization', label: 'Monetization' },
                  { id: 'growth', label: 'Niche Playbooks' },
                ].map(view => (
                  <button
                    key={view.id}
                    onClick={() => setActiveCategory(view.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none ${
                      activeCategory === view.id ? 'bg-dash-sidebar text-white shadow-sm font-black' : 'text-dash-text-secondary hover:text-dash-text'
                    }`}
                  >
                    {view.label}
                  </button>
                ))}
              </div>

              {/* Search Topic input */}
              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 text-dash-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold rounded-xl bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent placeholder:text-dash-text-tertiary transition-all"
                  placeholder="Search playbooks..."
                />
              </div>

            </div>

            {/* 3. PLATFORM SETUP TUTORIALS GRID (LEARN HOW TO USE) */}
            {filteredTutorials.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-dash-text-secondary flex items-center gap-2">
                  🚀 Learn how to use Open LX
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredTutorials.map(course => (
                    <div
                      key={course.id}
                      onClick={() => handlePlayVideo(course.title)}
                      className="flex flex-col text-left group cursor-pointer"
                    >
                      {/* Video Thumbnail */}
                      <div className="aspect-video w-full rounded-2xl bg-[#0D0E12] relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-neutral-800/40 flex items-center justify-center group-hover:border-neutral-700/60 transition-all duration-300">
                        {/* Mesh gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-tr ${course.gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />
                        
                        {/* Premium Dot Grid Overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                        
                        {/* Glowing focal point behind icon */}
                        <div className="absolute w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-[#FF6846]/10 transition-colors duration-300 pointer-events-none" />

                        {/* Large, elegant semi-transparent keyword */}
                        <span className="absolute top-4 left-4 text-[13px] font-black tracking-[0.25em] text-white/[0.04] group-hover:text-white/[0.08] font-mono select-none uppercase transition-colors duration-300">
                          {course.keyword}
                        </span>

                        {/* Clean wireframe vector in center */}
                        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none transform group-hover:scale-105 transition-transform duration-300">
                          {renderThumbnailVector(course.iconType)}
                        </div>

                        {/* Tiny elegant index label in bottom-left */}
                        <span className="absolute left-4 bottom-3 text-[9px] font-bold tracking-widest text-neutral-500 font-mono select-none uppercase">
                          {course.indexText}
                        </span>

                        {/* Floating Play Badge */}
                        <div className="w-11 h-11 bg-white text-black hover:bg-[#FF6846] hover:text-white rounded-full flex items-center justify-center absolute inset-0 m-auto shadow-xl transform scale-100 group-hover:scale-110 group-hover:bg-[#FF6846] group-hover:text-white transition-all duration-300 z-20">
                          <Play className="w-4 h-4 text-current fill-current translate-x-0.5 transition-colors duration-300" />
                        </div>
                      </div>

                      {/* Info details below */}
                      <h4 className="text-xs font-bold text-dash-text mt-3 group-hover:text-dash-accent transition-colors leading-snug line-clamp-2">
                        {course.title}
                      </h4>
                      <p className="text-[10px] text-dash-text-secondary mt-1.5 leading-relaxed font-light line-clamp-2">
                        {course.desc}
                      </p>
                      
                      <span className="text-[9.5px] font-mono font-bold text-dash-text-tertiary mt-2.5 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-dash-text-tertiary" />
                        {course.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. NICHE-SPECIFIC RECOMMENDATIONS (EARNING MONEY IN NICHE) */}
            {filteredNiches.length > 0 && (
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-black uppercase tracking-wider text-dash-text-secondary flex items-center gap-2">
                  💸 Earning money in your niche
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNiches.map(course => (
                    <div
                      key={course.id}
                      onClick={() => handlePlayVideo(course.title)}
                      className="flex flex-col text-left group cursor-pointer"
                    >
                      {/* Video Thumbnail */}
                      <div className="aspect-video w-full rounded-2xl bg-[#0D0E12] relative overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.2)] border border-neutral-800/40 flex items-center justify-center group-hover:border-neutral-700/60 transition-all duration-300">
                        {/* Mesh gradient overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-tr ${course.gradient} opacity-80 group-hover:opacity-100 transition-opacity duration-300`} />
                        
                        {/* Premium Dot Grid Overlay */}
                        <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
                        
                        {/* Glowing focal point behind icon */}
                        <div className="absolute w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-[#FF6846]/10 transition-colors duration-300 pointer-events-none" />

                        {/* Large, elegant semi-transparent keyword */}
                        <span className="absolute top-4 left-4 text-[13px] font-black tracking-[0.25em] text-white/[0.04] group-hover:text-white/[0.08] font-mono select-none uppercase transition-colors duration-300">
                          {course.keyword}
                        </span>

                        {/* Clean wireframe vector in center */}
                        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none transform group-hover:scale-105 transition-transform duration-300">
                          {renderThumbnailVector(course.iconType)}
                        </div>

                        {/* Tiny elegant index label in bottom-left */}
                        <span className="absolute left-4 bottom-3 text-[9px] font-bold tracking-widest text-neutral-500 font-mono select-none uppercase">
                          {course.indexText}
                        </span>

                        {/* Floating Play Badge */}
                        <div className="w-11 h-11 bg-white text-black hover:bg-[#FF6846] hover:text-white rounded-full flex items-center justify-center absolute inset-0 m-auto shadow-xl transform scale-100 group-hover:scale-110 group-hover:bg-[#FF6846] group-hover:text-white transition-all duration-300 z-20">
                          <Play className="w-4.5 h-4.5 text-current fill-current translate-x-0.5 transition-colors duration-300" />
                        </div>
                      </div>

                      {/* Info details below */}
                      <h4 className="text-xs font-bold text-dash-text mt-3 group-hover:text-dash-accent transition-colors leading-snug line-clamp-2">
                        {course.title}
                      </h4>
                      <p className="text-[10px] text-dash-text-secondary mt-1.5 leading-relaxed font-light line-clamp-2">
                        {course.desc}
                      </p>
                      
                      <span className="text-[9.5px] font-mono font-bold text-dash-text-tertiary mt-2.5 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-dash-text-tertiary" />
                        {course.duration}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Encryption & compliance disclaimer footer */}
            <Card className="flex flex-col sm:flex-row justify-between items-center p-5 border-[#E8E5DF] mt-4 shrink-0 bg-white gap-3 rounded-2xl shadow-sm">
              <span className="text-[10px] text-dash-text-secondary font-medium">
                🔒 Direct PCI-DSS audited SSL tutorials clearance rails active in sandbox.
              </span>
              <span className="text-[9px] uppercase font-bold text-dash-text-tertiary tracking-wider font-mono">
                Open LX Creator Academy © 2026
              </span>
            </Card>

          </motion.div>
        )}

      </AnimatePresence>

      {/* ==========================================
          MODAL: VIDEO PLAYER OVERLAY MOCK
          ========================================== */}
      <AnimatePresence>
        {showVideoModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVideoModal(false)}
              className="fixed inset-0 z-40 bg-black"
            />

            {/* Video Player Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="fixed inset-0 m-auto z-50 w-full max-w-2xl h-fit bg-[#0E0E10] border border-[#252724] rounded-2xl shadow-2xl overflow-hidden text-left"
            >
              {/* Header */}
              <div className="flex justify-between items-center p-4 border-b border-[#252724]">
                <h3 className="text-xs font-bold text-white truncate max-w-lg">Watching: {selectedVideo}</h3>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white transition-colors cursor-pointer border-none bg-transparent"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Simulated Video Player */}
              <div className="aspect-video w-full bg-black relative flex items-center justify-center">
                {/* Glowing status */}
                <div className="absolute inset-0 bg-gradient-to-tr from-[#111A13] via-[#0E0E10] to-[#0E0E10] opacity-90" />
                
                <div className="z-10 text-center flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 flex items-center justify-center animate-pulse">
                    <Play className="w-5 h-5 text-[#10B981] fill-[#10B981] translate-x-px" />
                  </div>
                  <span className="text-xs text-white font-medium">Streaming lesson content securely...</span>
                  <span className="text-[10px] text-neutral-500 font-mono">Open LX Video Server Clearance</span>
                </div>

                {/* Progress bar overlay at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-neutral-800">
                  <div className="bg-[#10B981] h-full w-[15%] rounded-r animate-pulse" />
                </div>
              </div>

              {/* Modal footer controls */}
              <div className="p-4 border-t border-[#252724] flex justify-between items-center text-xs">
                <span className="text-neutral-400">Resolution: 1080p (Auto)</span>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-xs font-bold border-none cursor-pointer transition-colors"
                >
                  Dismiss Player
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ==========================================
          TOAST FEEDBACK ALERTS
          ========================================== */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 select-none pointer-events-none">
        <AnimatePresence>
          {toasts.map(toast => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-3 bg-neutral-900 text-white rounded-xl shadow-lg border border-neutral-800 text-xs font-semibold pointer-events-auto"
            >
              {toast.type === 'success' ? (
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : toast.type === 'warning' ? (
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-sky-400 shrink-0" />
              )}
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  );
}
