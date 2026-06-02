import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Globe,
  DollarSign,
  TrendingUp,
  Sliders,
  ShieldCheck
} from 'lucide-react';
import { Card } from './DashboardPrimitives';

// ==========================================
// DATA SCHEMAS & INTERFACES
// ==========================================
type MarketplaceState = 'active' | 'loading' | 'empty';
type AppCategory = 'all' | 'grow' | 'monetize' | 'engage' | 'automate' | 'analyze' | 'integrate';
type AppStatus = 'active' | 'inactive' | 'setup_needed';

interface AppIntegration {
  id: string;
  name: string;
  category: AppCategory;
  desc: string;
  status: AppStatus;
  isPopular?: boolean;
  isPro?: boolean;
  setupStepsCompleted?: number;
  setupStepsTotal?: number;
  icon: 'zap' | 'globe' | 'dollar' | 'trending' | 'sliders' | 'shield';
}

// ==========================================
// CORE SEED DATA
// ==========================================
const RECOMMENDED_APPS: AppIntegration[] = [
  {
    id: 'app_rec_1',
    name: 'NSDL Aadhaar Compliance Sync',
    category: 'integrate',
    desc: 'Link Aadhaar consent registries directly with NSDL tax verification nodes to clear daily processing limits instantly.',
    status: 'setup_needed',
    isPopular: true,
    setupStepsCompleted: 1,
    setupStepsTotal: 3,
    icon: 'shield'
  },
  {
    id: 'app_rec_2',
    name: 'Instagram Comments Webhook App',
    category: 'automate',
    desc: 'Clears comment auto-DM sequence flows, keyword matches, and lead capture templates direct on your Instagram reels.',
    status: 'active',
    isPro: true,
    icon: 'zap'
  }
];

const RECENTLY_ACTIVATED: AppIntegration[] = [
  { id: 'app_rec_2', name: 'Instagram Comments Webhook App', category: 'automate', desc: 'Trigger auto-DMs on Instagram comments.', status: 'active', icon: 'zap' },
  { id: 'app_act_1', name: 'Consolidated Weekly Stripe Clears', category: 'monetize', desc: 'Route digital storefront payout balances to SBI bank direct routes.', status: 'active', icon: 'dollar' },
];

const ALL_APPS: AppIntegration[] = [
  // Grow
  { id: 'app_grow_1', name: 'Instagram Reels comment audit', category: 'grow', desc: 'Generate reels comment lead-captures, reels automations, and audience triggers.', status: 'active', isPopular: true, icon: 'trending' },
  { id: 'app_grow_2', name: 'Bio Link Custom Curation', category: 'grow', desc: 'Aesthetic glassmorphic bio link templates matching Outfit typography.', status: 'active', icon: 'globe' },
  
  // Monetize
  { id: 'app_mon_1', name: 'Consolidated Weekly Stripe Clears', category: 'monetize', desc: 'Route digital storefront payout balances to SBI bank direct routes.', status: 'active', icon: 'dollar' },
  { id: 'app_mon_2', name: 'UPI Checkout clearing routes', category: 'monetize', desc: 'Instant UPI conversion funnels direct inside direct DMs.', status: 'inactive', isPro: true, icon: 'sliders' },
  
  // Engage
  { id: 'app_eng_1', name: 'Auto-DM Email lead captures', category: 'engage', desc: 'Prompt and index customer email details inside Direct DMs.', status: 'setup_needed', setupStepsCompleted: 2, setupStepsTotal: 3, icon: 'shield' },
  
  // Automate
  { id: 'app_aut_1', name: 'Instagram Comments Webhook App', category: 'automate', desc: 'Clears comment auto-DM sequence flows, keyword matches, and lead capture templates direct on your Instagram reels.', status: 'active', isPro: true, icon: 'zap' },
  
  // Analyze
  { id: 'app_ana_1', name: 'Attio-inspired Lead CRM Ledger', category: 'analyze', desc: 'Monitor conversion progress, lead scores, and custom note timelines.', status: 'active', icon: 'trending' },
  
  // Integrate
  { id: 'app_int_1', name: 'NSDL Aadhaar Compliance Sync', category: 'integrate', desc: 'Link Aadhaar consent registries directly with NSDL tax verification nodes to clear daily processing limits instantly.', status: 'setup_needed', isPopular: true, setupStepsCompleted: 1, setupStepsTotal: 3, icon: 'shield' },
];

// ==========================================
// CORE VIEW LAYER
// ==========================================
export default function ExploreAppsView() {
  const [sandboxState, setSandboxState] = useState<MarketplaceState>('active');
  const [activeCategory, setActiveCategory] = useState<AppCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [apps, setApps] = useState<AppIntegration[]>(ALL_APPS);

  // Connection stats
  const activeCount = apps.filter(a => a.status === 'active').length;
  const totalCount = apps.length;

  const handleToggleApp = (id: string, currentStatus: AppStatus) => {
    let nextStatus: AppStatus = 'inactive';
    if (currentStatus === 'inactive') {
      nextStatus = 'setup_needed';
    } else if (currentStatus === 'setup_needed') {
      nextStatus = 'active';
    }
    
    setApps(apps.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: nextStatus,
          setupStepsCompleted: nextStatus === 'setup_needed' ? 1 : undefined,
          setupStepsTotal: nextStatus === 'setup_needed' ? 3 : undefined
        };
      }
      return a;
    }));

    alert(`Integration status changed to ${nextStatus.replace('_', ' ')}`);
  };

  const filterAppsList = (list: AppIntegration[]) => {
    return list.filter(a => {
      if (activeCategory !== 'all' && a.category !== activeCategory) return false;
      if (!searchQuery.trim()) return true;
      const match = searchQuery.toLowerCase();
      return (
        a.name.toLowerCase().includes(match) ||
        a.desc.toLowerCase().includes(match)
      );
    });
  };

  const filteredApps = filterAppsList(apps);

  const renderIcon = (type: AppIntegration['icon']) => {
    const classStr = "w-5 h-5 text-[#FF6846]";
    if (type === 'zap') return <Zap className={classStr} />;
    if (type === 'globe') return <Globe className={classStr} />;
    if (type === 'dollar') return <DollarSign className={classStr} />;
    if (type === 'trending') return <TrendingUp className={classStr} />;
    if (type === 'sliders') return <Sliders className={classStr} />;
    return <ShieldCheck className={classStr} />;
  };

  return (
    <div className="flex flex-col gap-6 select-none font-sans text-dash-text">
      
      {/* ==========================================
          HEADER & STATE CONTROLLER
          ========================================== */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-dash-surface border border-[#E8E5DF] rounded-2xl p-5 mb-1 shadow-sm select-none">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-dash-accent font-mono">Internal Marketplace</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-dash-sidebar text-white font-mono font-semibold uppercase">APP STORE</span>
          </div>
          <h2 className="text-xl font-extrabold text-dash-text mt-0.5 tracking-tight font-sans">Explore Apps & Integrations</h2>
        </div>

        {/* State Simulations Controller */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <label className="text-[10px] uppercase font-black text-dash-text-tertiary hidden md:block">Marketplace Mode</label>
          <select
            value={sandboxState}
            onChange={(e) => setSandboxState(e.target.value as MarketplaceState)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-dash-muted border border-[#E8E5DF] text-dash-text focus:outline-none"
          >
            <option value="active">🟢 Active Marketplace Catalog</option>
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
            key="market_loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Stats skeleton */}
            <div className="w-full h-24 rounded-2xl bg-dash-surface border border-[#E8E5DF] animate-pulse p-6 flex justify-between items-center">
              <div className="w-1/3 h-4 bg-dash-muted rounded" />
              <div className="w-24 h-8 bg-dash-muted rounded" />
            </div>

            {/* Grid Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-dash-surface border border-[#E8E5DF] rounded-xl p-5 h-44 animate-pulse flex flex-col justify-between">
                  <div className="w-1/2 h-3 bg-dash-muted rounded" />
                  <div className="w-full h-8 bg-dash-muted rounded" />
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* --------------------------------------
            STATE B: EMPTY SEARCH RESULTS
            -------------------------------------- */}
        {(sandboxState === 'empty' || (sandboxState === 'active' && filteredApps.length === 0)) && (
          <motion.div
            key="market_empty"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <Card className="flex flex-col items-center justify-center p-14 text-center border-dashed border-[#E8E5DF] min-h-[400px]">
              <Compass className="w-12 h-12 text-[#FF6846] mb-4 animate-pulse shrink-0" />
              <h3 className="text-base font-extrabold text-dash-text tracking-tight">No Integrations Match Query</h3>
              <p className="text-xs text-dash-text-secondary mt-1.5 max-w-sm mx-auto leading-relaxed">
                Try searching broad categories like "NSDL", "Stripe", "Reels comment audit", or "Auto DM email capture" to calibrate app webhooks.
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
        {sandboxState === 'active' && filteredApps.length > 0 && (
          <motion.div
            key="market_active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            
            {/* 1. CONNECTED INTEGRATIONS STATISTICS HUB (Connected App Count) */}
            <div className="w-full bg-dash-surface border border-[#E8E5DF] rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm select-none">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-dash-success/15 border-2 border-dash-success/20 flex items-center justify-center text-xs font-black text-dash-success font-mono">
                  {activeCount}
                </div>
                <div>
                  <h4 className="text-xs font-black text-dash-text-secondary uppercase">Connected App registries Mapped</h4>
                  <p className="text-[11px] text-dash-text-tertiary mt-0.5 leading-normal">
                    {activeCount} of {totalCount} integrations are fully activated. Direct webhook clearance routes clear SBI bank settling schedules weekly.
                  </p>
                </div>
              </div>

              {/* Bulk Disconnect */}
              <button
                type="button"
                onClick={() => {
                  if (confirm('Disconnect all active webhooks?')) {
                    setApps(apps.map(a => ({ ...a, status: 'inactive', setupStepsCompleted: undefined })));
                    alert('All integrations disconnected.');
                  }
                }}
                className="px-4 py-2 border border-[#E8E5DF] hover:bg-red-500/5 text-red-500 hover:border-red-500/20 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer bg-transparent shrink-0"
              >
                Bulk Disconnect
              </button>
            </div>

            {/* 2. RECOMMENDED TOOLS SECTION ( Spotlight Features) */}
            {activeCategory === 'all' && !searchQuery && (
              <div className="flex flex-col gap-3 select-none">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-dash-accent" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-dash-text-secondary">Spotlight Recommended Mappers</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {RECOMMENDED_APPS.map(app => (
                    <div
                      key={app.id}
                      className="bg-gradient-to-tr from-[#0D0908] via-neutral-900 to-[#1c1c1e] border border-[#E8E5DF] rounded-2xl p-6 flex flex-col justify-between h-52 relative overflow-hidden group select-none text-left"
                    >
                      {/* Gradient border glows */}
                      <div className="absolute right-[-20px] top-[-20px] w-36 h-36 bg-[#FF6846]/10 rounded-full blur-2xl opacity-40" />

                      <div className="flex flex-col gap-2 relative z-10">
                        <div className="flex justify-between items-start">
                          <div className="p-2 bg-white/5 rounded-xl border border-white/10 shrink-0">
                            {renderIcon(app.icon)}
                          </div>
                          
                          {/* Badges */}
                          <div className="flex gap-1.5">
                            {app.isPopular && (
                              <span className="bg-[#FF6846]/15 text-[#FF6846] border border-[#FF6846]/20 text-[9px] font-black px-2 py-0.5 rounded uppercase">POPULAR</span>
                            )}
                            {app.isPro && (
                              <span className="bg-blue-500/15 text-blue-400 border border-blue-500/20 text-[9px] font-black px-2 py-0.5 rounded uppercase">PRO</span>
                            )}
                          </div>
                        </div>

                        <h4 className="text-xs font-black text-white tracking-tight leading-snug mt-1.5">{app.name}</h4>
                        <p className="text-white/60 text-[10.5px] leading-relaxed max-w-md font-light">
                          {app.desc}
                        </p>
                      </div>

                      {/* Setup and CTA */}
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/10 shrink-0 relative z-10">
                        
                        {/* Setup Progress */}
                        {app.setupStepsCompleted !== undefined && app.setupStepsTotal !== undefined ? (
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-white/10 h-1 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-dash-accent rounded-full"
                                style={{ width: `${(app.setupStepsCompleted / app.setupStepsTotal) * 100}%` }}
                              />
                            </div>
                            <span className="text-[9.5px] font-mono text-white/55">
                              Setup: step {app.setupStepsCompleted} of {app.setupStepsTotal}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[9.5px] text-dash-success font-bold tracking-wide uppercase flex items-center gap-1 font-mono">
                            <CheckCircle2 className="w-3 h-3 text-dash-success" />
                            <span>Clearing active</span>
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => handleToggleApp(app.id, app.status)}
                          className="px-3.5 py-1.5 bg-[#FF6846] hover:opacity-95 text-white text-[9.5px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer border-none"
                        >
                          {app.status === 'active' ? 'Configure' : app.status === 'setup_needed' ? 'Continue Setup' : 'Connect App'}
                        </button>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. RECENTLY ACTIVATED TOOLS SECTION */}
            {activeCategory === 'all' && !searchQuery && (
              <div className="flex flex-col gap-3 select-none">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-dash-accent shrink-0" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-dash-text-secondary">Recently Mapped Activations</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {RECENTLY_ACTIVATED.map(app => (
                    <div
                      key={app.id}
                      className="bg-dash-surface border border-[#E8E5DF] rounded-xl p-4 flex justify-between items-center select-none text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-dash-muted rounded-lg shrink-0">
                          {renderIcon(app.icon)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-dash-text leading-tight tracking-tight">{app.name}</h4>
                          <span className="text-[10px] text-dash-text-tertiary font-mono block mt-0.5">{app.category} • cleared</span>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold text-dash-success bg-dash-success/15 px-2.5 py-0.5 rounded border border-dash-success/30 uppercase tracking-wide">
                        ACTIVE
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==========================================
                SEARCH & CATEGORY FILTERS STICKY BAR
                ========================================== */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-dash-surface border border-[#E8E5DF] rounded-2xl p-4 shadow-sm select-none">
              
              {/* Category pills */}
              <div className="bg-dash-muted rounded-xl p-1 flex flex-wrap items-center gap-1 border border-[#E8E5DF] shrink-0">
                {[
                  { id: 'all', label: 'All Catalog' },
                  { id: 'grow', label: 'Grow Audience' },
                  { id: 'monetize', label: 'Monetize' },
                  { id: 'engage', label: 'Engage' },
                  { id: 'automate', label: 'Automate' },
                  { id: 'analyze', label: 'Analyze' },
                  { id: 'integrate', label: 'Integrate' },
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

              {/* Search tool input */}
              <div className="relative w-full sm:w-56">
                <Search className="w-4 h-4 text-dash-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold rounded-xl bg-dash-muted border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent"
                  placeholder="Search extensions catalog..."
                />
              </div>

            </div>

            {/* 4. APP CATALOG GRID (SLEEK RICH CARDS) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredApps.map(app => (
                <div
                  key={app.id}
                  className="bg-dash-surface border border-[#E8E5DF] hover:border-[#DEDAD2] rounded-2xl p-5 flex flex-col justify-between h-[190px] hover:shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all select-none text-left"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-start select-none">
                      <div className="p-2 bg-dash-muted rounded-xl shrink-0">
                        {renderIcon(app.icon)}
                      </div>
                      
                      {/* Badges */}
                      <div className="flex gap-1.5 select-none">
                        {app.isPopular && (
                          <span className="bg-[#FF6846]/10 text-[#FF6846] border border-[#FF6846]/20 text-[9px] font-black px-2 py-0.5 rounded uppercase font-mono">POPULAR</span>
                        )}
                        {app.isPro && (
                          <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 text-[9px] font-black px-2 py-0.5 rounded uppercase font-mono">PRO</span>
                        )}
                      </div>
                    </div>

                    <h4 className="text-xs font-black text-dash-text tracking-tight leading-snug mt-1">{app.name}</h4>
                    <p className="text-dash-text-secondary text-[10px] leading-relaxed line-clamp-2 font-light">
                      {app.desc}
                    </p>
                  </div>

                  {/* Setup progress bar where relevant */}
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#E8E5DF] shrink-0">
                    
                    {/* Setup steps */}
                    {app.status === 'setup_needed' && app.setupStepsCompleted !== undefined && app.setupStepsTotal !== undefined ? (
                      <div className="flex items-center gap-1.5 select-none">
                        <div className="w-10 bg-dash-muted h-1 rounded-full overflow-hidden shrink-0">
                          <div className="h-full bg-dash-accent rounded-full" style={{ width: `${(app.setupStepsCompleted / app.setupStepsTotal) * 100}%` }} />
                        </div>
                        <span className="text-[9px] font-mono text-dash-text-tertiary">Step {app.setupStepsCompleted}/{app.setupStepsTotal}</span>
                      </div>
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        app.status === 'active'
                          ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                          : 'bg-neutral-500/10 text-neutral-500 border border-[#E8E5DF]'
                      }`}>
                        {app.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    )}

                    {/* CTA toggle */}
                    <button
                      type="button"
                      onClick={() => handleToggleApp(app.id, app.status)}
                      className={`px-3 py-1.5 text-[9.5px] font-black uppercase tracking-wider rounded-lg transition-colors border-none cursor-pointer ${
                        app.status === 'active'
                          ? 'bg-dash-muted text-dash-text hover:bg-[#E8E5DF]'
                          : 'bg-dash-sidebar text-white hover:bg-neutral-800'
                      }`}
                    >
                      {app.status === 'active' ? 'Disconnect' : app.status === 'setup_needed' ? 'Resume Setup' : 'Activate'}
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* PCI-DSS and security disclaimer block */}
            <Card className="flex flex-col sm:flex-row justify-between items-center p-5 border-[#E8E5DF] select-none mt-2 shrink-0 bg-dash-surface gap-3">
              <span className="text-[10px] text-dash-text-secondary font-medium">
                🔒 Webhook clearing routes PCI-DSS compliant. Identity parameters stored under zero-knowledge parameters.
              </span>
              <span className="text-[9px] uppercase font-bold text-dash-text-tertiary tracking-wider font-mono">
                Open LX APP WEBHOOKS © 2026
              </span>
            </Card>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
