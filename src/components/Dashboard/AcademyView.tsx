import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Search,
  Clock,
  CheckCircle2,
  Play,
  TrendingUp,
  Sliders,
  ChevronRight,
  Compass
} from 'lucide-react';
import { Card } from './DashboardPrimitives';

// ==========================================
// DATA SCHEMAS & INTERFACES
// ==========================================
type AcademyState = 'active' | 'loading' | 'empty';
type CourseCategory = 'all' | 'monetization' | 'growth' | 'setup' | 'security';

interface Course {
  id: string;
  title: string;
  category: CourseCategory;
  level: 'Beginner' | 'Intermediate' | 'Expert';
  duration: string;
  topic: string;
  progress?: number; // percent completed
  readTime?: string;
  isEditorial?: boolean;
  desc: string;
  bgGradient: string;
}

// ==========================================
// CORE SEED DATA
// ==========================================
const MASTERCLASS_COURSE: Course = {
  id: 'c_mc_1',
  title: 'Instagram Reels Commerce Masterclass: 0 to ₹100k Gross',
  category: 'monetization',
  level: 'Intermediate',
  duration: '2h 40m video',
  topic: 'Instagram Commerce',
  progress: 45,
  isEditorial: true,
  desc: 'Learn advanced reels comment automation strategies, comment-to-DM checkout funnel loops, and spatial design principles to optimize digital product conversions.',
  bgGradient: 'from-[#FF6846] via-[#FF6846]/95 to-[#e6005c]'
};

const CONTINUE_COURSES: Course[] = [
  { id: 'c_con_1', title: 'Lead magnet checklist conversions', category: 'growth', level: 'Beginner', duration: '35m lesson', topic: 'Lead Generation', progress: 85, desc: 'A quick tutorial on building high-conversion lead capture templates for comment automations.', bgGradient: 'from-neutral-900 to-neutral-850' },
  { id: 'c_con_2', title: 'Storefront SEO & pricing strategies', category: 'monetization', level: 'Intermediate', duration: '1h 10m lesson', topic: 'Product Curation', progress: 60, desc: 'How to structure tiered product prices and search-engine optimize storefront descriptions.', bgGradient: 'from-neutral-900 to-neutral-850' },
  { id: 'c_con_3', title: 'KYC payout clearances & tax registry', category: 'security', level: 'Expert', duration: '20m lesson', topic: 'Compliance', progress: 10, desc: 'Everything you need to verify PAN profiles and unlock unlimited settlement clearing limits.', bgGradient: 'from-neutral-900 to-neutral-850' },
];

const PLATFORM_TUTORIALS: Course[] = [
  { id: 'c_tut_1', title: 'Comment auto-dm setup in 3 mins', category: 'setup', level: 'Beginner', duration: '3m read', topic: 'Auto DM Setup', desc: 'Step-by-step reels curation framework, comment automations, and audience triggers setup.', bgGradient: 'from-neutral-800 to-neutral-850' },
  { id: 'c_tut_2', title: 'Connect NSDL tax KYC clearances', category: 'security', level: 'Intermediate', duration: '5m read', topic: 'KYC Compliance', desc: 'Securely link tax parameters and match Aadhaar consent registries on Open LX.', bgGradient: 'from-neutral-800 to-neutral-850' },
  { id: 'c_tut_3', title: 'Configure UPI instant payment routes', category: 'setup', level: 'Beginner', duration: '4m read', topic: 'Payments Setup', desc: 'Calibrate direct clearing Stripe routing lines for UPI, credit cards, and bank settlements.', bgGradient: 'from-neutral-800 to-neutral-850' },
];

const MONETIZATION_PLAYBOOKS: Course[] = [
  { id: 'c_play_1', title: 'Convert DM chats to storefront checkouts', category: 'monetization', level: 'Intermediate', duration: '18m read', topic: 'Funnels Optimization', desc: 'Leverage ManyChat-tier delay elements and link button cards to drive users from comments to secure cash checkouts.', bgGradient: 'from-neutral-900 to-neutral-850' },
  { id: 'c_play_2', title: 'Launch pre-orders via story reply webhooks', category: 'monetization', level: 'Expert', duration: '35m read', topic: 'Pre-Orders Launch', desc: 'Configuring active story reply keywords to capture initial bookings before formal storefront product launches.', bgGradient: 'from-neutral-900 to-neutral-850' },
  { id: 'c_play_3', title: 'Scale payouts to ₹10L monthly limits', category: 'security', level: 'Expert', duration: '15m read', topic: 'Security Registry', desc: 'Auditing IFSC routing numbers and cheque proofs to wave standard payout volume limitations.', bgGradient: 'from-neutral-900 to-neutral-850' },
];

const NICHE_COURSES: Course[] = [
  { id: 'c_niche_1', title: 'Fitness Coach: Custom Strategy Slot Bookings', category: 'monetization', level: 'Intermediate', duration: '25m read', topic: 'Fitness Niche', desc: 'Pre-create customized strategy slots, pre-requisite forms, and UPI settlement clearing triggers.', bgGradient: 'from-neutral-850 to-neutral-900' },
  { id: 'c_niche_2', title: 'Digital Artist: Lightroom LUT Preset Packs', category: 'growth', level: 'Beginner', duration: '15m read', topic: 'Art Niche', desc: 'How to distribute assets packs automatically via reals comment triggers comment automation.', bgGradient: 'from-neutral-850 to-neutral-900' },
  { id: 'c_niche_3', title: 'Finance Blogger: KYC Payout Optimization', category: 'security', level: 'Expert', duration: '30m read', topic: 'Finance Niche', desc: 'Filing tax parameters correctly to maintain maximum clearance velocity on weekly payout settlements.', bgGradient: 'from-neutral-850 to-neutral-900' },
];

// ==========================================
// CORE VIEW LAYER
// ==========================================
export default function AcademyView() {
  const [sandboxState, setSandboxState] = useState<AcademyState>('active');
  const [activeCategory, setActiveCategory] = useState<CourseCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Combined Search and Category Filters
  const filterCoursesList = (list: Course[]) => {
    return list.filter(c => {
      if (activeCategory !== 'all' && c.category !== activeCategory) return false;
      if (!searchQuery.trim()) return true;
      const match = searchQuery.toLowerCase();
      return (
        c.title.toLowerCase().includes(match) ||
        c.topic.toLowerCase().includes(match) ||
        c.desc.toLowerCase().includes(match)
      );
    });
  };

  const filteredTutorials = filterCoursesList(PLATFORM_TUTORIALS);
  const filteredPlaybooks = filterCoursesList(MONETIZATION_PLAYBOOKS);
  const filteredNiches = filterCoursesList(NICHE_COURSES);

  // If search matches nothing across all directories
  const isSearchEmpty =
    filteredTutorials.length === 0 &&
    filteredPlaybooks.length === 0 &&
    filteredNiches.length === 0;

  return (
    <div className="flex flex-col gap-6 select-none font-sans text-dash-text">
      
      {/* ==========================================
          HEADER & STATE CONTROLLER
          ========================================== */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-dash-surface border border-[#E8E5DF] rounded-2xl p-5 mb-1 shadow-sm select-none">
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

      {/* ==========================================
          DYNAMIC CONTENT VIEWER (STATE-DEPENDENT)
          ========================================== */}
      <AnimatePresence mode="wait">
        
        {/* --------------------------------------
            STATE A: LOADING SKELETONS
            -------------------------------------- */}
            {sandboxState === 'loading' && (
          <motion.div
            key="academy_loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Masterclass skeleton */}
            <div className="w-full h-80 rounded-2xl bg-dash-surface border border-[#E8E5DF] animate-pulse p-8 flex flex-col justify-between">
              <div className="w-1/4 h-3 bg-dash-muted rounded" />
              <div className="w-3/4 h-12 bg-dash-muted rounded" />
              <div className="w-1/2 h-5 bg-dash-muted rounded" />
            </div>

            {/* Carousel skeletons */}
            <div className="flex flex-col gap-3">
              <div className="w-48 h-4 bg-dash-muted rounded animate-pulse" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-dash-surface border border-[#E8E5DF] rounded-xl p-5 h-36 animate-pulse flex flex-col justify-between">
                    <div className="w-1/2 h-3 bg-dash-muted rounded" />
                    <div className="w-full h-8 bg-dash-muted rounded" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* --------------------------------------
            STATE B: EMPTY SEARCH RESULTS
            -------------------------------------- */}
        {(sandboxState === 'empty' || (sandboxState === 'active' && isSearchEmpty)) && (
          <motion.div
            key="academy_empty"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <Card className="flex flex-col items-center justify-center p-14 text-center border-dashed border-[#E8E5DF] min-h-[400px]">
              <Compass className="w-12 h-12 text-[#FF6846] mb-4 animate-pulse shrink-0" />
              <h3 className="text-base font-extrabold text-dash-text tracking-tight">No Playbooks Match Search Query</h3>
              <p className="text-xs text-dash-text-secondary mt-1.5 max-w-sm mx-auto leading-relaxed">
                Try searching broad terms like "comment", "KYC", "UPI", "Stripe" or toggle category selectors below to explore setup playbooks.
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

        {/* --------------------------------------
            STATE C: ACTIVE PREMIUM Hub CATALOG
            -------------------------------------- */}
        {sandboxState === 'active' && !isSearchEmpty && (
          <motion.div
            key="academy_active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            
            {/* 1. CINEMATIC EDITORIAL HERO MASTERCLASS BANNER */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-[#E8E5DF] shadow-md bg-dash-surface select-none">
              
              {/* Premium dark glow background */}
              <div className="absolute inset-0 bg-gradient-to-tr from-[#0D0908] via-neutral-900 to-[#1c1c1e] z-0" />
              
              {/* Vibrant orange/pink gradient blur */}
              <div className="absolute right-[-40px] top-[-40px] w-96 h-96 bg-gradient-to-tr from-[#FF6846] to-[#e6005c] rounded-full blur-[80px] opacity-15 pointer-events-none" />

              <div className="relative z-10 p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 text-left">
                
                {/* Masterclass metadata description */}
                <div className="flex-1 flex flex-col gap-3">
                  
                  {/* Category & Badge Row */}
                  <div className="flex items-center gap-2">
                    <span className="bg-[#FF6846]/10 text-[#FF6846] border border-[#FF6846]/20 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full font-mono">
                      MASTERCLASS
                    </span>
                    <span className="text-[10px] text-white/55 font-semibold flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      {MASTERCLASS_COURSE.duration}
                    </span>
                    <span className="text-[10px] text-white/55 font-bold font-mono">
                      • {MASTERCLASS_COURSE.level}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-white leading-tight tracking-tight max-w-2xl font-sans">
                    {MASTERCLASS_COURSE.title}
                  </h3>

                  <p className="text-white/60 text-xs leading-relaxed max-w-xl font-light">
                    {MASTERCLASS_COURSE.desc}
                  </p>

                  {/* Inline progress bar */}
                  {MASTERCLASS_COURSE.progress !== undefined && (
                    <div className="flex items-center gap-3 w-full max-w-sm mt-2 select-none">
                      <div className="flex-1 bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#FF6846] to-[#e6005c] rounded-full" style={{ width: `${MASTERCLASS_COURSE.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-white/60">{MASTERCLASS_COURSE.progress}% Completed</span>
                    </div>
                  )}

                </div>

                {/* Big Editorial Button */}
                <button
                  type="button"
                  onClick={() => alert(`Starting Masterclass Sequence: ${MASTERCLASS_COURSE.title}`)}
                  className="px-6 py-3.5 rounded-full bg-[#FF6846] hover:opacity-95 text-white text-xs font-black uppercase tracking-wider transition-all border-none cursor-pointer shadow-lg shadow-[#FF6846]/15 flex items-center gap-2 shrink-0 md:self-center self-start"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Resume Masterclass</span>
                </button>

              </div>
            </div>

            {/* 2. CONTINUE LEARNING CAROUSEL SECTION */}
            {activeCategory === 'all' && !searchQuery && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 select-none">
                  <Sliders className="w-4 h-4 text-dash-accent" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-dash-text-secondary">Continue Learning Paths</h3>
                </div>

                {/* Grid listing paths */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {CONTINUE_COURSES.map(course => (
                    <div
                      key={course.id}
                      onClick={() => alert(`Resuming course lesson: ${course.title}`)}
                      className="bg-dash-surface border border-[#E8E5DF] hover:border-[#DEDAD2] rounded-2xl p-5 flex flex-col justify-between h-44 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all cursor-pointer relative overflow-hidden group select-none text-left"
                    >
                      {/* Gradient outline overlay */}
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-dash-accent/10 group-hover:bg-dash-accent transition-colors" />

                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[9px] font-bold font-mono text-dash-text-tertiary">
                          <span className="uppercase tracking-wider">{course.topic}</span>
                          <span>{course.level}</span>
                        </div>
                        <h4 className="text-xs font-black text-dash-text tracking-tight group-hover:text-dash-accent transition-colors line-clamp-2 leading-snug">
                          {course.title}
                        </h4>
                        <p className="text-[10px] text-dash-text-secondary leading-normal line-clamp-2 font-light">
                          {course.desc}
                        </p>
                      </div>

                      {/* Progress & Duration details */}
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#E8E5DF] shrink-0">
                        <span className="text-[9.5px] text-dash-text-tertiary font-mono font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {course.duration}
                        </span>
                        <span className="text-[10px] font-mono font-black text-dash-success">{course.progress}% done</span>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==========================================
                SEARCH & CATEGORY FILTERS STICKY BAR
                ========================================== */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-dash-surface border border-[#E8E5DF] rounded-2xl p-4 shadow-sm select-none">
              
              {/* Category selector pills */}
              <div className="bg-dash-muted rounded-xl p-1 flex flex-wrap items-center gap-1 border border-[#E8E5DF] shrink-0">
                {[
                  { id: 'all', label: 'All Playbooks' },
                  { id: 'monetization', label: 'Monetization' },
                  { id: 'growth', label: 'Instagram Growth' },
                  { id: 'setup', label: 'Auto-DM Setup' },
                  { id: 'security', label: 'KYC Security' },
                ].map(view => (
                  <button
                    key={view.id}
                    onClick={() => setActiveCategory(view.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer border-none ${
                      activeCategory === view.id ? 'bg-dash-surface text-dash-text shadow-sm font-black' : 'text-dash-text-tertiary hover:text-dash-text'
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
                  className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold rounded-xl bg-dash-muted border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent"
                  placeholder="Search Academy playbooks..."
                />
              </div>

            </div>

            {/* 3. PLATFORM SETUP TUTORIALS GRID */}
            {filteredTutorials.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 select-none">
                  <CheckCircle2 className="w-4 h-4 text-dash-success shrink-0" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-dash-text-secondary">3. Quick Platform Setup Tutorials</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {filteredTutorials.map(course => (
                    <div
                      key={course.id}
                      onClick={() => alert(`Loading Guide: ${course.title}`)}
                      className="bg-dash-surface border border-[#E8E5DF] hover:border-[#DEDAD2] rounded-2xl p-5 flex flex-col justify-between h-40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all cursor-pointer select-none text-left"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[9px] font-bold font-mono text-dash-text-tertiary">
                          <span className="uppercase tracking-wider">{course.topic}</span>
                          <span>{course.level}</span>
                        </div>
                        <h4 className="text-xs font-black text-dash-text tracking-tight hover:text-dash-accent transition-colors line-clamp-2 leading-snug">
                          {course.title}
                        </h4>
                        <p className="text-[10px] text-dash-text-secondary leading-normal line-clamp-2 font-light mt-0.5">
                          {course.desc}
                        </p>
                      </div>

                      {/* Read time and direct button */}
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#E8E5DF] shrink-0">
                        <span className="text-[9.5px] text-dash-text-tertiary font-mono font-bold flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-dash-text-tertiary" />
                          {course.duration}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-dash-text-tertiary" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. MONETIZATION PLAYBOOKS GRID */}
            {filteredPlaybooks.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 select-none">
                  <TrendingUp className="w-4 h-4 text-[#FF6846] shrink-0" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-dash-text-secondary">4. Monetization Playbooks</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {filteredPlaybooks.map(course => (
                    <div
                      key={course.id}
                      onClick={() => alert(`Loading Playbook: ${course.title}`)}
                      className="bg-dash-surface border border-[#E8E5DF] hover:border-[#DEDAD2] rounded-2xl p-5 flex flex-col justify-between h-40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all cursor-pointer select-none text-left"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[9px] font-bold font-mono text-dash-text-tertiary">
                          <span className="uppercase tracking-wider">{course.topic}</span>
                          <span>{course.level}</span>
                        </div>
                        <h4 className="text-xs font-black text-dash-text tracking-tight hover:text-dash-accent transition-colors line-clamp-2 leading-snug">
                          {course.title}
                        </h4>
                        <p className="text-[10px] text-dash-text-secondary leading-normal line-clamp-2 font-light mt-0.5">
                          {course.desc}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#E8E5DF] shrink-0">
                        <span className="text-[9.5px] text-dash-text-tertiary font-mono font-bold flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-dash-text-tertiary" />
                          {course.duration}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-dash-text-tertiary" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. NICHE-SPECIFIC RECOMMENDATIONS GRID */}
            {filteredNiches.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 select-none">
                  <Compass className="w-4 h-4 text-dash-accent shrink-0 animate-spin-slow" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-dash-text-secondary">5. Niche-Specific Recommendations</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {filteredNiches.map(course => (
                    <div
                      key={course.id}
                      onClick={() => alert(`Loading Niche Playbook: ${course.title}`)}
                      className="bg-dash-surface border border-[#E8E5DF] hover:border-[#DEDAD2] rounded-2xl p-5 flex flex-col justify-between h-40 hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all cursor-pointer select-none text-left"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center text-[9px] font-bold font-mono text-dash-text-tertiary">
                          <span className="uppercase tracking-wider">{course.topic}</span>
                          <span>{course.level}</span>
                        </div>
                        <h4 className="text-xs font-black text-dash-text tracking-tight hover:text-dash-accent transition-colors line-clamp-2 leading-snug">
                          {course.title}
                        </h4>
                        <p className="text-[10px] text-dash-text-secondary leading-normal line-clamp-2 font-light mt-0.5">
                          {course.desc}
                        </p>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#E8E5DF] shrink-0">
                        <span className="text-[9.5px] text-dash-text-tertiary font-mono font-bold flex items-center gap-1">
                          <BookOpen className="w-3 h-3 text-dash-text-tertiary" />
                          {course.duration}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-dash-text-tertiary" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PCI-DSS and encryption compliance footer */}
            <Card className="flex flex-col sm:flex-row justify-between items-center p-5 border-[#E8E5DF] select-none mt-2 shrink-0 bg-dash-surface gap-3">
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

    </div>
  );
}
