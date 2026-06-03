import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Compass,
  Search,
  CheckCircle2,
  Info,
  X,
  Check
} from 'lucide-react';
import { Card } from './DashboardPrimitives';

// ==========================================
// DATA SCHEMAS & INTERFACES
// ==========================================
type AppCategory = 'growth' | 'monetization' | 'automation' | 'integration';

interface AppIntegration {
  id: string;
  name: string;
  category: AppCategory;
  desc: string;
  status: 'active' | 'inactive';
  icon: string;
  iconBg: string;
  iconColor: string;
  requiresSetup?: boolean;
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
}

// ==========================================
// SEED DATA
// ==========================================
const INITIAL_APPS: AppIntegration[] = [
  // Growth
  {
    id: 'auto_dm',
    name: 'AutoDM',
    category: 'growth',
    desc: 'Set Instagram automations to engage with audience and reply to comments.',
    status: 'active',
    icon: 'zap',
    iconBg: 'bg-purple-50',
    iconColor: 'text-[#C084FC]',
    requiresSetup: false
  },
  {
    id: 'super_links',
    name: 'SuperLinks',
    category: 'growth',
    desc: 'Shorten or enable open-in-app for any of your custom landing URLs.',
    status: 'inactive',
    icon: 'link',
    iconBg: 'bg-yellow-50',
    iconColor: 'text-[#EAB308]',
    requiresSetup: false
  },
  {
    id: 'lead_magnets',
    name: 'Lead Magnets',
    category: 'growth',
    desc: 'Run giveaway campaigns or collect unlimited registrations from your content.',
    status: 'inactive',
    icon: 'magnet',
    iconBg: 'bg-red-50',
    iconColor: 'text-[#EF4444]',
    requiresSetup: false
  },
  {
    id: 'bio_links',
    name: 'Bio Links Curation',
    category: 'growth',
    desc: 'Create aesthetic glassmorphic bio link templates matching Outfit typography.',
    status: 'inactive',
    icon: 'layers',
    iconBg: 'bg-teal-50',
    iconColor: 'text-[#0D9488]',
    requiresSetup: false
  },
  // Monetization
  {
    id: 'payment_pages',
    name: 'Payment Pages',
    category: 'monetization',
    desc: 'Sell E-books, PDF files, images, videos, templates, and courses.',
    status: 'inactive',
    icon: 'dollar',
    iconBg: 'bg-orange-50',
    iconColor: 'text-[#F97316]',
    requiresSetup: true
  },
  {
    id: 'bookings',
    name: 'Bookings & Calls',
    category: 'monetization',
    desc: 'Set up a new 1-on-1 session to offer private coaching and consultations.',
    status: 'inactive',
    icon: 'calendar',
    iconBg: 'bg-pink-50',
    iconColor: 'text-[#EC4899]',
    requiresSetup: true
  },
  {
    id: 'events',
    name: 'Events & Tickets',
    category: 'monetization',
    desc: 'Sell live webinar tickets, cohort classes, or admission passes.',
    status: 'inactive',
    icon: 'rocket',
    iconBg: 'bg-violet-50',
    iconColor: 'text-[#8B5CF6]',
    requiresSetup: true
  },
  {
    id: 'locked_content',
    name: 'Locked Content',
    category: 'monetization',
    desc: 'Lock any file or link for a certain price. Visitors pay to unlock.',
    status: 'inactive',
    icon: 'lock',
    iconBg: 'bg-red-50',
    iconColor: 'text-[#EF4444]',
    requiresSetup: false
  },
  {
    id: 'courses',
    name: 'Courses Hub',
    category: 'monetization',
    desc: 'Sell access to structured modules, video collections, and guides.',
    status: 'inactive',
    icon: 'courses',
    iconBg: 'bg-rose-50',
    iconColor: 'text-[#F43F5E]',
    requiresSetup: true
  },
  // Automation & Engagement
  {
    id: 'email_capture',
    name: 'Email Lead Capture',
    category: 'automation',
    desc: 'Automatically capture and index email details inside Instagram DMs.',
    status: 'inactive',
    icon: 'mail',
    iconBg: 'bg-sky-50',
    iconColor: 'text-[#0EA5E9]',
    requiresSetup: false
  },
  {
    id: 'discord_sync',
    name: 'Discord Sync',
    category: 'automation',
    desc: 'Instantly add buyers to exclusive private Discord server roles.',
    status: 'inactive',
    icon: 'discord',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-[#6366F1]',
    requiresSetup: true
  },
  {
    id: 'telegram_sync',
    name: 'Telegram Sync',
    category: 'automation',
    desc: 'Auto-add paid subscribers to premium Telegram channels and groups.',
    status: 'inactive',
    icon: 'telegram',
    iconBg: 'bg-blue-50',
    iconColor: 'text-[#3B82F6]',
    requiresSetup: true
  },
  // Integration & Compliance
  {
    id: 'aadhaar_sync',
    name: 'NSDL Aadhaar Compliance Sync',
    category: 'integration',
    desc: 'Verify creator identities using NSDL nodes to unlock higher daily payout limits.',
    status: 'inactive',
    icon: 'shield',
    iconBg: 'bg-slate-50',
    iconColor: 'text-[#64748B]',
    requiresSetup: true
  },
  {
    id: 'attio_crm',
    name: 'Attio CRM Sync',
    category: 'integration',
    desc: 'Sync leads, scores, activity, and tags to your Attio CRM workspace.',
    status: 'inactive',
    icon: 'database',
    iconBg: 'bg-slate-100',
    iconColor: 'text-[#475569]',
    requiresSetup: true
  },
  {
    id: 'upi_clearing',
    name: 'UPI Payout Clearing',
    category: 'integration',
    desc: 'Configure instant automated settlement to SBI/HDFC checking accounts.',
    status: 'inactive',
    icon: 'credit-card',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-[#10B981]',
    requiresSetup: true
  }
];

// ==========================================
// TOGGLE SWITCH COMPONENT
// ==========================================
const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        checked ? 'bg-[#10B981]' : 'bg-[#E5E5EA]'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          checked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function ExploreAppsView() {
  const [apps, setApps] = useState<AppIntegration[]>(INITIAL_APPS);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedAppForSetup, setSelectedAppForSetup] = useState<AppIntegration | null>(null);
  const [setupStep, setSetupStep] = useState(1);
  const [setupLoading, setSetupLoading] = useState(false);

  // Setup state inputs
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [consentInput, setConsentInput] = useState(false);

  // Stats
  const activeCount = apps.filter(a => a.status === 'active').length;

  const addToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleToggle = (app: AppIntegration) => {
    if (app.status === 'active') {
      // Disconnect
      setApps(prev => prev.map(a => a.id === app.id ? { ...a, status: 'inactive' } : a));
      addToast(`${app.name} has been disconnected.`, 'info');
    } else {
      // Connect
      if (app.requiresSetup) {
        setSelectedAppForSetup(app);
        setSetupStep(1);
        setApiKeyInput('');
        setConsentInput(false);
      } else {
        setApps(prev => prev.map(a => a.id === app.id ? { ...a, status: 'active' } : a));
        addToast(`${app.name} activated successfully!`, 'success');
      }
    }
  };

  const handleSetupComplete = () => {
    if (!selectedAppForSetup) return;

    if (selectedAppForSetup.id === 'aadhaar_sync' && !consentInput) {
      addToast('Aadhaar consent is required to proceed.', 'warning');
      return;
    }
    if (selectedAppForSetup.id !== 'aadhaar_sync' && !apiKeyInput.trim()) {
      addToast('Please enter required API key / parameters to complete connection.', 'warning');
      return;
    }

    setSetupLoading(true);
    setTimeout(() => {
      setApps(prev => prev.map(a => a.id === selectedAppForSetup.id ? { ...a, status: 'active' } : a));
      addToast(`${selectedAppForSetup.name} configured and activated successfully!`, 'success');
      setSetupLoading(false);
      setSelectedAppForSetup(null);
    }, 1200);
  };

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'zap':
        return (
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none">
            <defs>
              <linearGradient id="instaGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#F9153E" />
                <stop offset="30%" stopColor="#E6006F" />
                <stop offset="70%" stopColor="#A200B8" />
                <stop offset="100%" stopColor="#6C00D9" />
              </linearGradient>
            </defs>
            <rect x="3" y="3" width="18" height="18" rx="5" stroke="url(#instaGrad)" strokeWidth="2.2" />
            <circle cx="12" cy="12" r="4" stroke="url(#instaGrad)" strokeWidth="2.2" />
            <circle cx="16.5" cy="7.5" r="1.25" fill="url(#instaGrad)" />
          </svg>
        );
      case 'link':
        return (
          <svg viewBox="0 0 24 24" className="w-6.5 h-6.5" fill="none" stroke="#CA8A04" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        );
      case 'magnet':
        return (
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 10V6a8 8 0 0 1 16 0v4" />
            <path d="M4 10h4V6a4 4 0 0 1 8 0v4h4" />
            <rect x="4" y="10" width="4" height="2.5" rx="0.5" fill="#94A3B8" stroke="none" />
            <rect x="16" y="10" width="4" height="2.5" rx="0.5" fill="#94A3B8" stroke="none" />
            <path d="M6 16c1.5 2 4.5 3 6 3s4.5-1 6-3" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="2 2" />
          </svg>
        );
      case 'layers':
        return (
          <svg viewBox="0 0 24 24" className="w-6.5 h-6.5" fill="none" stroke="#0D9488" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="5" y="2" width="14" height="20" rx="2" />
            <circle cx="12" cy="7" r="2" fill="#0D9488" opacity="0.25" />
            <line x1="9" y1="12" x2="15" y2="12" />
            <line x1="8" y1="16" x2="16" y2="16" />
          </svg>
        );
      case 'dollar':
        return (
          <svg viewBox="0 0 24 24" className="w-6.5 h-6.5" fill="none" stroke="#F97316" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            <line x1="12" y1="11" x2="12" y2="17" />
            <line x1="9" y1="14" x2="15" y2="14" />
          </svg>
        );
      case 'calendar':
        return (
          <svg viewBox="0 0 24 24" className="w-6.5 h-6.5" fill="none" stroke="#EC4899" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
            <circle cx="12" cy="16" r="3" fill="#EC4899" opacity="0.2" />
            <path d="M12 14.5v1.5h1.5" />
          </svg>
        );
      case 'rocket':
        return (
          <svg viewBox="0 0 24 24" className="w-6.5 h-6.5" fill="none" stroke="#8B5CF6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
            <path d="M9 5v14" strokeDasharray="3 3" />
            <polygon points="15.5 9.5 16 11 17.5 11 16.3 12 16.8 13.5 15.5 12.5 14.2 13.5 14.7 12 13.5 11 15 11" fill="#8B5CF6" stroke="none" />
          </svg>
        );
      case 'lock':
        return (
          <svg viewBox="0 0 24 24" className="w-6.5 h-6.5" fill="none" stroke="#EF4444" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            <circle cx="12" cy="16" r="1.5" fill="#EF4444" />
          </svg>
        );
      case 'courses':
        return (
          <svg viewBox="0 0 24 24" className="w-6.5 h-6.5" fill="none" stroke="#F43F5E" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
          </svg>
        );
      case 'mail':
        return (
          <svg viewBox="0 0 24 24" className="w-6.5 h-6.5" fill="none" stroke="#0EA5E9" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 6l-10 7L2 6" />
          </svg>
        );
      case 'discord':
        return (
          <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 5H6a3 3 0 0 0-3 3v8a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V8a3 3 0 0 0-3-3z" />
            <path d="M9 14h2M14 12v4M15 14h2" />
            <circle cx="8" cy="10" r="1" fill="#6366F1" stroke="none" />
            <circle cx="16" cy="10" r="1" fill="#6366F1" stroke="none" />
          </svg>
        );
      case 'telegram':
        return (
          <svg viewBox="0 0 24 24" className="w-6.5 h-6.5" fill="none" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        );
      case 'shield':
        return (
          <svg viewBox="0 0 24 24" className="w-6.5 h-6.5" fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 11l2 2 4-4" />
          </svg>
        );
      case 'database':
        return (
          <svg viewBox="0 0 24 24" className="w-6.5 h-6.5" fill="none" stroke="#475569" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.5" y1="10.5" x2="15.5" y2="6.5" />
            <line x1="8.5" y1="13.5" x2="15.5" y2="17.5" />
          </svg>
        );
      case 'credit-card':
        return (
          <svg viewBox="0 0 24 24" className="w-6.5 h-6.5" fill="none" stroke="#10B981" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2" ry="2" />
            <line x1="2" y1="10" x2="22" y2="10" />
            <line x1="6" y1="15" x2="10" y2="15" />
            <path d="M16 13l-2 3h3l-2 3" />
          </svg>
        );
      default:
        return <Compass className="w-5 h-5 text-dash-text-secondary" />;
    }
  };

  const getFilteredApps = () => {
    return apps.filter(app => {
      const matchSearch = searchQuery.trim() === '' || 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.desc.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCat = activeCategory === 'all' || app.category === activeCategory;
      return matchSearch && matchCat;
    });
  };

  const filteredApps = getFilteredApps();

  // Grouped headings configuration
  const CATEGORY_GROUPS = [
    { id: 'growth', label: 'FOR GROWTH' },
    { id: 'monetization', label: 'FOR MONETIZATION' },
    { id: 'automation', label: 'FOR AUTOMATION & ENGAGEMENT' },
    { id: 'integration', label: 'FOR INTEGRATION & COMPLIANCE' }
  ];

  return (
    <div className="flex flex-col gap-6 font-sans text-dash-text max-w-5xl mx-auto w-full select-none text-left">
      
      {/* ==========================================
          HEADER SECTION
          ========================================== */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2">
        <div>
          <h1 className="text-2xl font-black text-dash-text tracking-tight font-sans">Explore All Apps</h1>
          <p className="text-xs text-dash-text-secondary mt-1">
            Enable storefront integrations, automation webhooks, and compliance mappers.
          </p>
        </div>

        {/* Counter Pill */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-white border border-[#E8E5DF] px-3.5 py-1.5 rounded-full shadow-sm">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[11px] font-bold text-dash-text-secondary">
            {activeCount} active integration{activeCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* ==========================================
          FILTER BAR
          ========================================== */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3 bg-white border border-[#E8E5DF] rounded-2xl p-3 shadow-sm">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: 'All Apps' },
            { id: 'growth', label: 'Growth' },
            { id: 'monetization', label: 'Monetization' },
            { id: 'automation', label: 'Automation' },
            { id: 'integration', label: 'Integrations' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border-none ${
                activeCategory === tab.id
                  ? 'bg-dash-sidebar text-white shadow-sm'
                  : 'bg-transparent text-dash-text-secondary hover:text-dash-text hover:bg-neutral-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 md:max-w-[240px]">
          <Search className="w-4 h-4 text-dash-text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs font-semibold rounded-xl bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent transition-all placeholder:text-dash-text-tertiary"
            placeholder="Search all apps..."
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-dash-text-tertiary hover:text-dash-text cursor-pointer border-none bg-transparent flex items-center justify-center p-0.5 rounded-full hover:bg-neutral-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ==========================================
          APPS GRID SYSTEM (SECTIONAL CATEGORY LAYOUT)
          ========================================== */}
      <div className="flex flex-col gap-8 mt-2 min-h-[300px]">
        {filteredApps.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-14 text-center border-dashed border-[#E8E5DF] min-h-[350px] bg-white">
            <Compass className="w-12 h-12 text-dash-text-tertiary mb-3.5 shrink-0" />
            <h3 className="text-sm font-extrabold text-dash-text tracking-tight">No apps found</h3>
            <p className="text-xs text-dash-text-secondary mt-1 max-w-sm mx-auto leading-relaxed">
              We couldn't find any app matching "{searchQuery}". Try adjusting your filters or search keywords.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveCategory('all'); }}
              className="mt-5 px-4 py-2 bg-dash-sidebar text-white hover:bg-neutral-800 text-xs font-bold rounded-xl border-none cursor-pointer transition-all shadow-sm"
            >
              Reset Filters
            </button>
          </Card>
        ) : (
          CATEGORY_GROUPS.map(group => {
            const groupApps = filteredApps.filter(app => app.category === group.id);
            if (groupApps.length === 0) return null;

            return (
              <div key={group.id} className="flex flex-col gap-4">
                {/* Group Heading */}
                <h3 className="text-[10px] font-black uppercase tracking-wider text-dash-text-secondary">
                  {group.label}
                </h3>

                {/* 2-Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {groupApps.map(app => (
                    <div
                      key={app.id}
                      className="bg-white border border-[#E8E5DF] rounded-2xl p-5 flex items-center justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-200"
                    >
                      {/* Left: Icon Container */}
                      <div className={`w-14 h-14 rounded-2xl ${app.iconBg} flex items-center justify-center shrink-0`}>
                        {renderIcon(app.icon)}
                      </div>

                      {/* Middle: Details */}
                      <div className="flex-1 ml-4 mr-6">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-dash-text tracking-tight leading-none">
                            {app.name}
                          </h4>
                          {app.requiresSetup && app.status === 'inactive' && (
                            <span className="bg-[#FFF7ED] text-[#EA580C] text-[8px] font-bold px-1.5 py-0.5 rounded uppercase font-mono tracking-wider shrink-0 scale-95 origin-left">
                              Setup Required
                            </span>
                          )}
                        </div>
                        <p className="text-[10.5px] text-dash-text-secondary mt-1.5 leading-relaxed font-light line-clamp-2">
                          {app.desc}
                        </p>
                      </div>

                      {/* Right: Toggle Switch */}
                      <div className="shrink-0 flex items-center">
                        <ToggleSwitch
                          checked={app.status === 'active'}
                          onChange={() => handleToggle(app)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* PCI-DSS and security disclaimer block */}
      <Card className="flex flex-col sm:flex-row justify-between items-center p-5 border-[#E8E5DF] mt-4 shrink-0 bg-white gap-3 rounded-2xl shadow-sm">
        <span className="text-[10px] text-dash-text-secondary font-medium">
          🔒 Webhook clearing routes PCI-DSS compliant. Identity parameters stored under zero-knowledge parameters.
        </span>
        <span className="text-[9px] uppercase font-bold text-dash-text-tertiary tracking-wider font-mono">
          Open LX APP WEBHOOKS © 2026
        </span>
      </Card>

      {/* ==========================================
          DYNAMIC SLIDE-OVER DRAWER (SETUP MODAL)
          ========================================== */}
      <AnimatePresence>
        {selectedAppForSetup && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAppForSetup(null)}
              className="fixed inset-0 z-40 bg-black"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="fixed inset-0 m-auto z-50 w-full max-w-md h-fit bg-white border border-[#E8E5DF] rounded-2xl shadow-2xl p-6 overflow-hidden text-left"
            >
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-[#E8E5DF]">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl ${selectedAppForSetup.iconBg} flex items-center justify-center shrink-0`}>
                    {renderIcon(selectedAppForSetup.icon)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-dash-text">Configure {selectedAppForSetup.name}</h3>
                    <p className="text-[10px] text-dash-text-secondary uppercase font-bold tracking-wider font-mono mt-0.5">
                      Integration Setup Wizard
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedAppForSetup(null)}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 text-dash-text-secondary hover:text-dash-text transition-colors cursor-pointer border-none bg-transparent"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Steps Progress */}
              <div className="flex items-center justify-between mt-4 px-1">
                {[
                  { step: 1, label: 'Authorize' },
                  { step: 2, label: 'Link Account' }
                ].map(s => (
                  <div key={s.step} className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      setupStep >= s.step
                        ? 'bg-dash-sidebar text-white'
                        : 'bg-neutral-100 text-neutral-400 border border-neutral-200'
                    }`}>
                      {setupStep > s.step ? <Check className="w-3 h-3" /> : s.step}
                    </div>
                    <span className={`text-[10px] font-bold ${
                      setupStep >= s.step ? 'text-dash-text' : 'text-neutral-400'
                    }`}>
                      {s.label}
                    </span>
                  </div>
                ))}
                <div className="flex-1 border-t border-[#E8E5DF] mx-4" />
              </div>

              {/* Form Content */}
              <div className="py-6 min-h-[140px] flex flex-col justify-center">
                
                {/* Step 1: Authorization & Consent */}
                {setupStep === 1 && (
                  <div className="flex flex-col gap-3">
                    <p className="text-[11px] text-dash-text-secondary leading-relaxed">
                      To activate the integration, you must authorize {selectedAppForSetup.name} to view transaction updates, direct message logs, and settlement metadata from your dashboard.
                    </p>

                    {selectedAppForSetup.id === 'aadhaar_sync' ? (
                      <label className="flex items-start gap-3 p-3 bg-neutral-50 rounded-xl cursor-pointer hover:bg-neutral-100/50 transition-colors border border-[#E8E5DF]">
                        <input
                          type="checkbox"
                          checked={consentInput}
                          onChange={(e) => setConsentInput(e.target.checked)}
                          className="mt-0.5 accent-dash-sidebar rounded cursor-pointer"
                        />
                        <div className="text-[10px] text-dash-text-secondary leading-normal font-light">
                          I consent to link my Aadhaar parameter registry with the NSDL verification gateway nodes.
                        </div>
                      </label>
                    ) : (
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-black uppercase text-dash-text-secondary">
                          {selectedAppForSetup.id === 'attio_crm' ? 'Attio API Secret Key' : 'Seller / Webhook API Key'}
                        </label>
                        <input
                          type="password"
                          value={apiKeyInput}
                          onChange={(e) => setApiKeyInput(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs font-semibold rounded-xl bg-neutral-50 border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent transition-all"
                          placeholder={selectedAppForSetup.id === 'attio_crm' ? 'e.g. attio_sec_...' : 'e.g. pk_live_...'}
                        />
                        <span className="text-[9.5px] text-dash-text-tertiary">
                          Retrieve this secret parameter in your integration dashboard settings.
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 2: Connection Status */}
                {setupStep === 2 && (
                  <div className="flex flex-col items-center justify-center text-center gap-3">
                    {setupLoading ? (
                      <>
                        <div className="w-8 h-8 rounded-full border-2 border-neutral-200 border-t-dash-sidebar animate-spin" />
                        <h4 className="text-xs font-bold text-dash-text mt-2">Linking Integration Credentials...</h4>
                        <p className="text-[10px] text-dash-text-secondary">
                          Pinging API nodes to verify webhook endpoint handshakes.
                        </p>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <h4 className="text-xs font-bold text-dash-text">Integration Authenticated</h4>
                        <p className="text-[10px] text-dash-text-secondary max-w-xs leading-relaxed">
                          Your webhook parameter link checks cleared successfully. Click Complete to finish setup.
                        </p>
                      </>
                    )}
                  </div>
                )}

              </div>

              {/* Actions Footer */}
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E5DF] select-none">
                <button
                  onClick={() => setSelectedAppForSetup(null)}
                  className="px-4 py-2 border border-[#E8E5DF] hover:bg-neutral-50 text-dash-text rounded-xl text-xs font-bold cursor-pointer transition-colors bg-transparent"
                >
                  Cancel
                </button>
                {setupStep === 1 ? (
                  <button
                    onClick={() => setSetupStep(2)}
                    className="px-4 py-2 bg-dash-sidebar text-white hover:bg-neutral-800 rounded-xl text-xs font-bold cursor-pointer transition-colors border-none"
                  >
                    Next &rarr;
                  </button>
                ) : (
                  <button
                    onClick={handleSetupComplete}
                    disabled={setupLoading}
                    className="px-4 py-2 bg-dash-sidebar text-white hover:bg-neutral-800 disabled:opacity-50 disabled:pointer-events-none rounded-xl text-xs font-bold cursor-pointer transition-colors border-none"
                  >
                    Complete Connection
                  </button>
                )}
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
