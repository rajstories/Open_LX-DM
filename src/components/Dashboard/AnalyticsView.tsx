import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart3,
  Users,
  Zap,
  Search,
  Filter,
  ArrowUpDown,
  Upload,
  Download,
  X,
  Plus,
  User,
  Tag,
  Activity,
  ArrowRight,
  TrendingUp,
  Clock,
  AlertCircle,
  MessageSquare,
  Lock
} from 'lucide-react';
import { Card } from './DashboardPrimitives';

// ==========================================
// DATA SCHEMAS & INTERFACES
// ==========================================
type CRMState = 'active' | 'loading' | 'empty';
type CRMTab = 'overview' | 'contacts' | 'segments' | 'tags' | 'activity';

interface Contact {
  id: string;
  name: string;
  email: string;
  source: string;
  tags: string[];
  lastActivity: string;
  purchasedProducts: string[];
  automationStatus: 'active' | 'paused' | 'completed';
  leadScore: number;
  dateAdded: string;
}

interface Segment {
  id: string;
  name: string;
  type: 'Dynamic' | 'Static list';
  contactCount: number;
  campaignCount: number;
  lastUpdated: string;
  createdDate: string;
}

interface TagItem {
  name: string;
  color: string;
  count: number;
}

interface ActivityEvent {
  id: string;
  timestamp: string;
  contactName: string;
  type: 'purchase' | 'click' | 'lead' | 'automation';
  details: string;
}

// ==========================================
// CORE SEED DATA
// ==========================================
const INITIAL_CONTACTS: Contact[] = [
  { id: 'c_001', name: 'Tanvi Shah', email: 'tanvi@shah.in', source: '⚡ Auto DM', tags: ['VIP Purchaser', 'Instagram Lead'], lastActivity: '2 mins ago', purchasedProducts: ['Instagram Growth Playbook'], automationStatus: 'active', leadScore: 92, dateAdded: '2026-05-30' },
  { id: 'c_002', name: 'Kunal Kapoor', email: 'kunal.kapoor@outlook.com', source: '🌐 Profile Link', tags: ['High Score', 'VIP Purchaser'], lastActivity: '1 hour ago', purchasedProducts: ['1:1 Private Mentorship'], automationStatus: 'active', leadScore: 85, dateAdded: '2026-06-01' },
  { id: 'c_003', name: 'Aishwarya Sen', email: 'aish@gmail.com', source: '⚡ Auto DM', tags: ['Cart Abandoned'], lastActivity: '2 hours ago', purchasedProducts: [], automationStatus: 'paused', leadScore: 48, dateAdded: '2026-06-02' },
  { id: 'c_004', name: 'Rohan Mehta', email: 'rohan@mehta.org', source: '📥 Lead Magnet', tags: ['Newsletter Opt-In'], lastActivity: '1 day ago', purchasedProducts: ['Presets Bundle'], automationStatus: 'completed', leadScore: 76, dateAdded: '2026-05-28' },
  { id: 'c_005', name: 'Aarav Sharma', email: 'aarav@sharma.co', source: '🌐 Profile Link', tags: ['Cold Contact'], lastActivity: '3 days ago', purchasedProducts: [], automationStatus: 'paused', leadScore: 24, dateAdded: '2026-05-25' },
];

const INITIAL_SEGMENTS: Segment[] = [
  { id: 'seg_01', name: 'VIP Buyers cohort', type: 'Dynamic', contactCount: 2, campaignCount: 4, lastUpdated: '10 mins ago', createdDate: '2026-05-20' },
  { id: 'seg_02', name: 'Instagram DM Leads', type: 'Dynamic', contactCount: 3, campaignCount: 2, lastUpdated: '1 hour ago', createdDate: '2026-05-22' },
  { id: 'seg_03', name: 'Warm Newsletter Leads', type: 'Static list', contactCount: 4, campaignCount: 5, lastUpdated: '1 day ago', createdDate: '2026-05-18' },
];

const INITIAL_TAGS: TagItem[] = [
  { name: 'VIP Purchaser', color: 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20', count: 2 },
  { name: 'Instagram Lead', color: 'bg-[#FF6846]/10 text-[#FF6846] border border-[#FF6846]/20', count: 2 },
  { name: 'Cart Abandoned', color: 'bg-red-500/10 text-red-500 border border-red-500/20', count: 1 },
  { name: 'Newsletter Opt-In', color: 'bg-blue-500/10 text-blue-500 border border-blue-500/20', count: 1 },
  { name: 'Cold Contact', color: 'bg-neutral-500/10 text-neutral-500 border border-neutral-500/20', count: 1 },
];

const INITIAL_ACTIVITIES: ActivityEvent[] = [
  { id: 'act_01', timestamp: '2026-06-02 13:10', contactName: 'Tanvi Shah', type: 'purchase', details: 'Purchased "Instagram Growth Playbook" for ₹1,500.00' },
  { id: 'act_02', timestamp: '2026-06-02 12:44', contactName: 'Aishwarya Sen', type: 'automation', details: 'Auto-DM trigger failed (User disconnected DM permissions)' },
  { id: 'act_03', timestamp: '2026-06-02 11:24', contactName: 'Tanvi Shah', type: 'lead', details: 'Opted in via "Instagram Reel comment audit" lead capture' },
  { id: 'act_04', timestamp: '2026-06-01 18:40', contactName: 'Kunal Kapoor', type: 'purchase', details: 'Booked "1:1 Private Mentorship" session for ₹4,999.00' },
  { id: 'act_05', timestamp: '2026-05-30 09:15', contactName: 'Rohan Mehta', type: 'click', details: 'Clicked storefront link for "Presets Bundle" from Twitter bio' },
];

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function AnalyticsView() {
  // Sandbox State Controllers
  const [sandboxState, setSandboxState] = useState<CRMState>('active');
  const [activeTab, setActiveTab] = useState<CRMTab>('contacts');

  // Core CRM Data Store States
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [segments, setSegments] = useState<Segment[]>(INITIAL_SEGMENTS);
  const [tags, setTags] = useState<TagItem[]>(INITIAL_TAGS);
  const [activities, setActivities] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);

  // Search & Filter state values
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'leadScore' | 'dateAdded'>('leadScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [activeSavedView, setActiveSavedView] = useState<'all' | 'vip' | 'automation'>('all');
  
  // Custom Filter Builder (dynamic criteria chips)
  const [activeFilterChips, setActiveFilterChips] = useState<{ id: string; label: string; field: string; value: string }[]>([]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  // Drawer states
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isContactDrawerOpen, setIsContactDrawerOpen] = useState(false);
  const [isSegmentDrawerOpen, setIsSegmentDrawerOpen] = useState(false);
  
  // Draft Form states inside drawers
  const [newSegmentName, setNewSegmentName] = useState('');
  const [newSegmentType, setNewSegmentType] = useState<'Dynamic' | 'Static list'>('Dynamic');
  const [newSegmentCriteria, setNewSegmentCriteria] = useState('');
  
  const [contactNotes, setContactNotes] = useState<Record<string, string>>({});
  const [tempNoteText, setTempNoteText] = useState('');

  // Auto-DM custom tags states
  const [newTagInput, setNewTagInput] = useState('');

  // Handle Search and Filter logic combined
  const filteredContacts = contacts.filter((contact) => {
    // 1. Saved View filters
    if (activeSavedView === 'vip' && !contact.tags.includes('VIP Purchaser')) return false;
    if (activeSavedView === 'automation' && contact.automationStatus !== 'active') return false;

    // 2. Filter chips criteria
    for (const chip of activeFilterChips) {
      if (chip.field === 'score' && contact.leadScore < parseInt(chip.value)) return false;
      if (chip.field === 'source' && contact.source !== chip.value) return false;
      if (chip.field === 'automation' && contact.automationStatus !== chip.value) return false;
    }

    // 3. Search query matches
    if (!searchQuery.trim()) return true;
    const match = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(match) ||
      contact.email.toLowerCase().includes(match) ||
      contact.source.toLowerCase().includes(match)
    );
  }).sort((a, b) => {
    // Sort logic
    const field = sortField;
    const valA = a[field];
    const valB = b[field];
    
    if (sortOrder === 'asc') {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });

  // Dynamic state syncing for local storage
  useEffect(() => {
    const savedNotes = localStorage.getItem('openlx_crm_notes');
    if (savedNotes) {
      try {
        setContactNotes(JSON.parse(savedNotes));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleAddNote = (contactId: string) => {
    if (!tempNoteText.trim()) return;
    const updated = { ...contactNotes, [contactId]: tempNoteText };
    setContactNotes(updated);
    localStorage.setItem('openlx_crm_notes', JSON.stringify(updated));
    setTempNoteText('');
    
    // Log in activity events
    const newAct: ActivityEvent = {
      id: `act_${Date.now()}`,
      timestamp: 'Just now',
      contactName: selectedContact?.name || 'Contact',
      type: 'automation',
      details: `Custom compliance note logged: "${tempNoteText.slice(0, 30)}..."`
    };
    setActivities([newAct, ...activities]);
  };

  const handleCreateSegment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSegmentName.trim()) return;
    
    const newSeg: Segment = {
      id: `seg_${Date.now()}`,
      name: newSegmentName,
      type: newSegmentType,
      contactCount: newSegmentType === 'Dynamic' ? 3 : 0,
      campaignCount: 0,
      lastUpdated: 'Just now',
      createdDate: '2026-06-02'
    };

    setSegments([newSeg, ...segments]);
    setNewSegmentName('');
    setIsSegmentDrawerOpen(false);
    alert(`🎯 Cohort segment "${newSegmentName}" generated successfully in CRM.`);
  };

  const handleAddTagToContact = (contactId: string, tagName: string) => {
    setContacts(contacts.map(c => {
      if (c.id === contactId && !c.tags.includes(tagName)) {
        return { ...c, tags: [...c.tags, tagName] };
      }
      return c;
    }));
  };

  const handleRemoveTagFromContact = (contactId: string, tagName: string) => {
    setContacts(contacts.map(c => {
      if (c.id === contactId) {
        return { ...c, tags: c.tags.filter(t => t !== tagName) };
      }
      return c;
    }));
  };

  const handleImportCSV = () => {
    alert('📥 Drag & Drop CRM CSV mapping complete. Restored 24 contacts to live indices.');
    const imported: Contact = {
      id: `c_${Date.now()}`,
      name: 'Riya Sharma',
      email: 'riya@sharma.in',
      source: '📥 Lead Magnet',
      tags: ['Imported List'],
      lastActivity: 'Just now',
      purchasedProducts: [],
      automationStatus: 'active',
      leadScore: 65,
      dateAdded: '2026-06-02'
    };
    setContacts([imported, ...contacts]);
  };

  const handleExportCSV = () => {
    alert('📤 Generating secure compiled xlsx spreadsheet statement. CRM report downloaded.');
  };

  const toggleSort = (field: 'leadScore' | 'dateAdded') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const addFilterChip = (field: string, value: string, label: string) => {
    const chipId = `${field}_${value}`;
    if (!activeFilterChips.some(c => c.id === chipId)) {
      setActiveFilterChips([...activeFilterChips, { id: chipId, label, field, value }]);
    }
    setShowFilterDropdown(false);
  };

  const handleCreateNewGlobalTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagInput.trim()) return;
    
    // Pick random theme color
    const colors = [
      'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20',
      'bg-blue-500/10 text-blue-500 border border-blue-500/20',
      'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20',
      'bg-[#FF6846]/10 text-[#FF6846] border border-[#FF6846]/20',
      'bg-purple-500/10 text-purple-500 border border-purple-500/20'
    ];
    const randColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newTag: TagItem = {
      name: newTagInput,
      color: randColor,
      count: 0
    };
    setTags([...tags, newTag]);
    setNewTagInput('');
    alert(`🏷️ Tag "${newTagInput}" added to workspace registries.`);
  };

  return (
    <div className="flex flex-col gap-6 select-none font-sans text-dash-text">
      
      {/* ==========================================
          HEADER: STATE SWAPPER & CONSOLE TITLE
          ========================================== */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-dash-surface border border-[#E8E5DF] rounded-2xl p-5 mb-1 shadow-sm select-none">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-black tracking-widest text-dash-accent font-mono">WORKSPACE INDEX</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-dash-sidebar text-white font-mono font-semibold uppercase">Attio CRM v1.8</span>
          </div>
          <h2 className="text-xl font-extrabold text-dash-text mt-0.5 tracking-tight font-sans">Audience CRM Ledger</h2>
        </div>

        {/* State Simulations Controller */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <label className="text-[10px] uppercase font-black text-dash-text-tertiary hidden md:block">CRM Context</label>
          <select
            value={sandboxState}
            onChange={(e) => setSandboxState(e.target.value as CRMState)}
            className="px-3 py-2 rounded-xl text-xs font-bold bg-dash-muted border border-[#E8E5DF] text-dash-text focus:outline-none"
          >
            <option value="active">🟢 Active CRM Index</option>
            <option value="loading">⏳ Pulse loading skeleton</option>
            <option value="empty">📭 Empty state (No audience)</option>
          </select>
        </div>
      </div>

      {/* ==========================================
          CRM NAVIGATION TABS
          ========================================== */}
      <div className="flex gap-2.5 border-b border-[#E8E5DF] pb-px">
        {[
          { id: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
          { id: 'contacts', label: 'Contacts Grid', icon: <Users className="w-4 h-4" /> },
          { id: 'segments', label: 'Target Segments', icon: <Zap className="w-4 h-4" /> },
          { id: 'tags', label: 'Tag Management', icon: <Tag className="w-4 h-4" /> },
          { id: 'activity', label: 'Live Events', icon: <Activity className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as CRMTab)}
            className={`flex items-center gap-2 px-4 py-3 text-xs font-bold tracking-wide border-b-2 transition-all cursor-pointer relative ${
              activeTab === tab.id
                ? 'border-dash-accent text-dash-text font-black'
                : 'border-transparent text-dash-text-tertiary hover:text-dash-text hover:border-[#E8E5DF]'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeCrmTabLine"
                className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-dash-accent"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ==========================================
          CRM VIEW GRID LAYOUTS (STATE-DEPENDENT)
          ========================================== */}
      <AnimatePresence mode="wait">
        
        {/* --------------------------------------
            STATE A: LOADING SKELETON PLACEHOLDERS
            -------------------------------------- */}
        {sandboxState === 'loading' && (
          <motion.div
            key="crm_loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            {/* Bento placeholder */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-dash-surface border border-[#E8E5DF] rounded-2xl p-6 h-28 animate-pulse flex flex-col justify-between">
                  <div className="w-1/2 h-3 bg-dash-muted rounded" />
                  <div className="w-3/4 h-8 bg-dash-muted rounded" />
                </div>
              ))}
            </div>
            {/* Data grid placeholder */}
            <div className="bg-dash-surface border border-[#E8E5DF] rounded-2xl p-6 h-64 animate-pulse flex flex-col gap-4">
              <div className="w-1/3 h-5 bg-dash-muted rounded" />
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-full h-8 bg-dash-muted rounded" />
              ))}
            </div>
          </motion.div>
        )}

        {/* --------------------------------------
            STATE B: EMPTY ONBOARDING VIEW
            -------------------------------------- */}
        {sandboxState === 'empty' && (
          <motion.div
            key="crm_empty"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <Card className="flex flex-col items-center justify-center p-14 text-center border-dashed border-[#E8E5DF] min-h-[400px]">
              <Users className="w-12 h-12 text-[#FF6846] mb-4 animate-pulse shrink-0" />
              <h3 className="text-base font-extrabold text-dash-text tracking-tight">No CRM Contacts Registered</h3>
              <p className="text-xs text-dash-text-secondary mt-1.5 max-w-sm mx-auto leading-relaxed">
                Connect your Open LX storefront, activate reels Comment Auto-DM flows, or import existing lists via secure CSV sheets immediately.
              </p>
              
              <div className="flex gap-3 justify-center items-center mt-6 select-none">
                <button
                  onClick={handleImportCSV}
                  className="px-5 py-2.5 rounded-full bg-dash-sidebar hover:bg-neutral-800 text-white text-xs font-bold transition-all shadow-sm border-none cursor-pointer flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Import CSV Contacts</span>
                </button>
                <button
                  onClick={() => alert('Direct storefront product creator opened.')}
                  className="px-4 py-2 border border-[#E8E5DF] hover:bg-dash-muted text-dash-text rounded-lg text-xs font-bold transition-all bg-transparent cursor-pointer"
                >
                  Build Landing Offer
                </button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* --------------------------------------
            STATE C: ACTIVE CRM CONTENT LAYOUT
            -------------------------------------- */}
        {sandboxState === 'active' && (
          <motion.div
            key="crm_active"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-6"
          >
            
            {/* TAB 1: CRM OVERVIEW DASHBOARD */}
            {activeTab === 'overview' && (
              <div className="flex flex-col gap-6">
                
                {/* Metrics Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <Card className="border-[#E8E5DF] flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-dash-text-tertiary tracking-wider block">CRM Audience Size</span>
                      <h3 className="text-3xl font-black text-dash-text tracking-tight font-mono mt-1">{contacts.length} Contacts</h3>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-[10px] text-dash-success font-bold font-mono select-none">
                      <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                      <span>+14% new signups</span>
                    </div>
                  </Card>

                  <Card className="border-[#E8E5DF] flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-dash-text-tertiary tracking-wider block">Target Segments</span>
                      <h3 className="text-3xl font-black text-dash-text tracking-tight font-mono mt-1">{segments.length} Cohorts</h3>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-[10px] text-dash-text-secondary select-none">
                      <Zap className="w-3.5 h-3.5 text-dash-text-tertiary shrink-0" />
                      <span>Dynamic sync active</span>
                    </div>
                  </Card>

                  <Card className="border-[#E8E5DF] flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-dash-text-tertiary tracking-wider block">Average Engagement</span>
                      <h3 className="text-3xl font-black text-dash-text tracking-tight font-mono mt-1">75 Score</h3>
                    </div>
                    <div className="mt-4 flex items-center gap-1.5 text-[10px] text-[#FF6846] font-bold select-none">
                      <span>High Lead Conversion</span>
                    </div>
                  </Card>

                  <Card className="border-[#E8E5DF] flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-dash-text-tertiary tracking-wider block">Active Auto DMs</span>
                      <h3 className="text-3xl font-black text-dash-text tracking-tight font-mono mt-1">3 Completed</h3>
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-[10px] text-dash-text-tertiary select-none">
                      <span>Refreshed live 1 min ago</span>
                    </div>
                  </Card>
                </div>

                {/* Conversion Funnel Bento Box */}
                <Card className="border-[#E8E5DF] flex flex-col justify-between p-6 min-h-[300px]">
                  <div>
                    <div className="flex items-center justify-between mb-6 border-b border-[#E8E5DF] pb-4">
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4.5 h-4.5 text-dash-accent animate-pulse-glow" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-dash-text-secondary">CRM Funnel conversion indexes</h3>
                      </div>
                      <span className="text-[9px] px-2 py-0.5 rounded bg-dash-sidebar text-white font-mono font-semibold uppercase">LIVE FEEDS</span>
                    </div>

                    <div className="flex flex-col gap-4">
                      {/* Funnel Step 1 */}
                      <div>
                        <div className="flex justify-between items-center text-xs font-bold text-dash-text-secondary mb-1">
                          <span>1. Storefront Visitors (Outreach)</span>
                          <span className="font-mono">1,240 clicks</span>
                        </div>
                        <div className="w-full bg-dash-muted h-5 rounded-lg overflow-hidden relative">
                          <div className="bg-gradient-to-r from-neutral-800 to-neutral-700 h-full w-[100%]" />
                          <span className="absolute inset-0 flex items-center justify-end pr-3 text-[9px] font-bold text-white tracking-widest uppercase">100%</span>
                        </div>
                      </div>

                      {/* Funnel Step 2 */}
                      <div>
                        <div className="flex justify-between items-center text-xs font-bold text-dash-text-secondary mb-1">
                          <span>2. Lead Opt-Ins / Inquiries</span>
                          <span className="font-mono">312 leads</span>
                        </div>
                        <div className="w-full bg-dash-muted h-5 rounded-lg overflow-hidden relative">
                          <div className="bg-gradient-to-r from-neutral-800 to-[#FF6846] h-full w-[65%]" />
                          <span className="absolute inset-0 flex items-center justify-end pr-3 text-[9px] font-bold text-white tracking-widest uppercase">65% Conversion</span>
                        </div>
                      </div>

                      {/* Funnel Step 3 */}
                      <div>
                        <div className="flex justify-between items-center text-xs font-bold text-dash-text-secondary mb-1">
                          <span>3. Paid Customer Transactions</span>
                          <span className="font-mono">60 buyers</span>
                        </div>
                        <div className="w-full bg-dash-muted h-5 rounded-lg overflow-hidden relative">
                          <div className="bg-gradient-to-r from-[#FF6846] to-[#e6005c] h-full w-[25%]" />
                          <span className="absolute inset-0 flex items-center justify-end pr-3 text-[9px] font-bold text-white tracking-widest uppercase">25% Purchase rate</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </Card>

              </div>
            )}

            {/* TAB 2: CORE CONTACTS Attio-inspired LEDGER */}
            {activeTab === 'contacts' && (
              <div className="flex flex-col gap-5">
                
                {/* Toolbar control deck */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-dash-surface border border-[#E8E5DF] rounded-2xl p-4.5 shadow-sm">
                  
                  {/* Saved Views pill group */}
                  <div className="bg-dash-muted rounded-xl p-1 flex items-center gap-1 border border-[#E8E5DF] shrink-0">
                    {[
                      { id: 'all', label: 'All Contacts' },
                      { id: 'vip', label: 'Hot VIP Leads' },
                      { id: 'automation', label: 'Active Auto DMs' },
                    ].map(view => (
                      <button
                        key={view.id}
                        onClick={() => setActiveSavedView(view.id as any)}
                        className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer border-none ${
                          activeSavedView === view.id ? 'bg-dash-surface text-dash-text shadow-sm font-black' : 'text-dash-text-tertiary hover:text-dash-text'
                        }`}
                      >
                        {view.label}
                      </button>
                    ))}
                  </div>

                  {/* Search and interactive filter builder */}
                  <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
                    
                    {/* Search input bar */}
                    <div className="relative w-full sm:w-56">
                      <Search className="w-4 h-4 text-dash-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold rounded-xl bg-dash-muted border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent"
                        placeholder="Search lead profiles..."
                      />
                    </div>

                    {/* Filter Builder dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                        className="px-3.5 py-2.5 rounded-xl border border-[#E8E5DF] hover:bg-[#E8E5DF] text-dash-text text-xs font-bold transition-colors cursor-pointer bg-transparent flex items-center gap-1.5"
                      >
                        <Filter className="w-3.5 h-3.5" />
                        <span>Filter</span>
                      </button>
                      
                      {showFilterDropdown && (
                        <>
                          <div onClick={() => setShowFilterDropdown(false)} className="fixed inset-0 z-10 bg-transparent" />
                          <div className="absolute right-0 top-12 z-20 w-52 bg-dash-surface border border-[#E8E5DF] rounded-xl shadow-lg p-2 flex flex-col gap-1.5">
                            <span className="text-[9px] uppercase font-bold text-dash-text-tertiary px-2 pb-1 block border-b border-[#E8E5DF]">Filter Rules</span>
                            <button
                              onClick={() => addFilterChip('score', '70', 'Score > 70')}
                              className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs hover:bg-dash-muted text-dash-text cursor-pointer border-none bg-transparent"
                            >
                              Engagement score &gt; 70
                            </button>
                            <button
                              onClick={() => addFilterChip('source', '⚡ Auto DM', 'Source = Auto DM')}
                              className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs hover:bg-dash-muted text-dash-text cursor-pointer border-none bg-transparent"
                            >
                              Origin channel is Auto DM
                            </button>
                            <button
                              onClick={() => addFilterChip('automation', 'active', 'Automation = Active')}
                              className="w-full px-2.5 py-1.5 rounded-lg text-left text-xs hover:bg-dash-muted text-dash-text cursor-pointer border-none bg-transparent"
                            >
                              Automation is Active
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Sort button toggle */}
                    <button
                      onClick={() => toggleSort('leadScore')}
                      className="px-3.5 py-2.5 rounded-xl border border-[#E8E5DF] hover:bg-[#E8E5DF] text-dash-text text-xs font-bold transition-colors cursor-pointer bg-transparent flex items-center gap-1.5"
                      title="Sort by Engagement Score"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      <span>Sort Score</span>
                    </button>

                    {/* File actions */}
                    <button
                      onClick={handleImportCSV}
                      className="p-2.5 rounded-xl border border-[#E8E5DF] hover:bg-[#E8E5DF] text-dash-text cursor-pointer bg-transparent flex items-center justify-center"
                      title="Import CSV Contacts"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleExportCSV}
                      className="p-2.5 rounded-xl border border-[#E8E5DF] hover:bg-[#E8E5DF] text-dash-text cursor-pointer bg-transparent flex items-center justify-center"
                      title="Export CSV Reports"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                  </div>

                </div>

                {/* Filter chips active deck */}
                {activeFilterChips.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 select-none">
                    <span className="text-[10px] font-bold text-dash-text-tertiary uppercase tracking-wider">Active Filters:</span>
                    {activeFilterChips.map(chip => (
                      <span
                        key={chip.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full bg-dash-muted border border-[#E8E5DF] text-dash-text"
                      >
                        <span>{chip.label}</span>
                        <button
                          onClick={() => setActiveFilterChips(activeFilterChips.filter(c => c.id !== chip.id))}
                          className="hover:text-red-500 border-none bg-transparent cursor-pointer text-dash-text-tertiary flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <button
                      onClick={() => setActiveFilterChips([])}
                      className="text-[10px] font-bold text-dash-accent hover:underline border-none bg-transparent cursor-pointer"
                    >
                      Clear All
                    </button>
                  </div>
                )}

                {/* Core Contacts Table Ledger */}
                <Card className="p-0 border-[#E8E5DF] overflow-hidden">
                  <div className="w-full overflow-x-auto bg-dash-surface">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#E8E5DF] bg-dash-bg/40 select-none">
                          <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Contact</th>
                          <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Channel</th>
                          <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Tags</th>
                          <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Last Active</th>
                          <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Purchased</th>
                          <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Automation</th>
                          <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Score</th>
                          <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Added</th>
                          <th className="px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E5DF]">
                        {filteredContacts.map(contact => (
                          <tr
                            key={contact.id}
                            className="hover:bg-dash-bg/10 transition-colors cursor-pointer"
                            onClick={() => {
                              setSelectedContact(contact);
                              setIsContactDrawerOpen(true);
                            }}
                          >
                            {/* Contact Card */}
                            <td className="px-5 py-4 min-w-[180px]">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-dash-muted text-dash-text flex items-center justify-center font-bold text-xs shrink-0 select-none border border-[#E8E5DF]">
                                  {contact.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                  <h4 className="text-xs font-bold text-dash-text tracking-tight truncate leading-tight">{contact.name}</h4>
                                  <span className="text-[10px] text-dash-text-tertiary select-all font-semibold block truncate mt-0.5">{contact.email}</span>
                                </div>
                              </div>
                            </td>

                            {/* Source */}
                            <td className="px-5 py-4">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-dash-text-secondary select-none">
                                {contact.source}
                              </span>
                            </td>

                            {/* Tags */}
                            <td className="px-5 py-4 min-w-[140px]">
                              <div className="flex flex-wrap gap-1">
                                {contact.tags.map(t => {
                                  const config = tags.find(tag => tag.name === t);
                                  return (
                                    <span key={t} className={`px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide ${config?.color || 'bg-dash-muted text-dash-text'}`}>
                                      {t}
                                    </span>
                                  );
                                })}
                              </div>
                            </td>

                            {/* Last Activity */}
                            <td className="px-5 py-4 font-mono text-[10px] text-dash-text-secondary">{contact.lastActivity}</td>

                            {/* Purchased Products */}
                            <td className="px-5 py-4 text-xs font-semibold text-dash-text">
                              {contact.purchasedProducts.length > 0 ? (
                                <span className="truncate block max-w-[120px]">{contact.purchasedProducts.join(', ')}</span>
                              ) : (
                                <span className="text-dash-text-tertiary select-none font-normal italic">None</span>
                              )}
                            </td>

                            {/* Automation status */}
                            <td className="px-5 py-4">
                              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                contact.automationStatus === 'active'
                                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                  : contact.automationStatus === 'paused'
                                  ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                  : 'bg-neutral-500/10 text-neutral-500 border border-[#E8E5DF]'
                              }`}>
                                {contact.automationStatus}
                              </span>
                            </td>

                            {/* Lead Score progress */}
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-2">
                                <div className="w-10 bg-dash-muted h-1 rounded-full overflow-hidden shrink-0 select-none">
                                  <div
                                    className={`h-full rounded-full ${
                                      contact.leadScore > 80 ? 'bg-dash-success' : contact.leadScore > 50 ? 'bg-dash-accent' : 'bg-red-400'
                                    }`}
                                    style={{ width: `${contact.leadScore}%` }}
                                  />
                                </div>
                                <span className="text-[10px] font-mono font-bold text-dash-text select-all">{contact.leadScore}</span>
                              </div>
                            </td>

                            {/* Date Added */}
                            <td className="px-5 py-4 font-mono text-[10px] text-dash-text-secondary">{contact.dateAdded}</td>

                            {/* Actions popover button */}
                            <td className="px-5 py-4 text-right relative select-none">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert(`Compliance triggers: Manual broadcast email matched for ${contact.name}`);
                                }}
                                className="p-1 rounded hover:bg-dash-muted text-dash-text-secondary hover:text-dash-text transition-colors cursor-pointer border-none flex items-center justify-center ml-auto"
                                title="Run manual campaign"
                              >
                                <ArrowRight className="w-4 h-4" />
                              </button>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

              </div>
            )}

            {/* TAB 3: TARGET COHORT SEGMENTS */}
            {activeTab === 'segments' && (
              <div className="flex flex-col gap-5">
                <div className="flex justify-between items-center bg-dash-surface border border-[#E8E5DF] rounded-2xl p-4 shadow-sm select-none">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-dash-text-secondary">CRM Cohorts Segments</h3>
                    <p className="text-[11px] text-dash-text-tertiary mt-0.5 leading-normal">
                      Dynamic smart filters grouping contacts automatically matching specific transactional rules.
                    </p>
                  </div>

                  {/* Create Segment drawer trigger */}
                  <button
                    onClick={() => setIsSegmentDrawerOpen(true)}
                    className="px-4 py-2 bg-dash-sidebar hover:bg-neutral-800 text-white rounded-full text-xs font-bold transition-all border-none cursor-pointer flex items-center gap-1.5 shadow-sm shadow-[#FF6846]/5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Segment</span>
                  </button>
                </div>

                {/* Segments Table */}
                <Card className="p-0 border-[#E8E5DF] overflow-hidden select-none">
                  <div className="w-full overflow-x-auto bg-dash-surface">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#E8E5DF] bg-dash-bg/40">
                          <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Segment Name</th>
                          <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Type</th>
                          <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Contact Count</th>
                          <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Linked Campaigns</th>
                          <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Last Sync</th>
                          <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Created Date</th>
                          <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E5DF]">
                        {segments.map(seg => (
                          <tr key={seg.id} className="hover:bg-dash-bg/10 transition-colors">
                            <td className="px-6 py-4">
                              <h4 className="text-xs font-bold text-dash-text tracking-tight">{seg.name}</h4>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                seg.type === 'Dynamic' ? 'bg-[#FF6846]/10 text-[#FF6846] border-[#FF6846]/20' : 'bg-dash-muted text-dash-text border-[#E8E5DF]'
                              }`}>
                                {seg.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-mono text-xs text-dash-text">{seg.contactCount} contacts</td>
                            <td className="px-6 py-4 font-mono text-xs text-dash-text">{seg.campaignCount} campaigns</td>
                            <td className="px-6 py-4 text-xs font-semibold text-dash-text-secondary">{seg.lastUpdated}</td>
                            <td className="px-6 py-4 font-mono text-xs text-dash-text-secondary">{seg.createdDate}</td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => alert(`Broadcasting marketing sequences to "${seg.name}"`)}
                                className="px-3 py-1.5 bg-dash-bg hover:bg-[#E8E5DF] border border-[#E8E5DF] text-dash-text text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                              >
                                Run Campaign
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

            {/* TAB 4: TAG MANAGEMENT */}
            {activeTab === 'tags' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start select-none">
                
                {/* Left: Tags List */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <Card className="p-0 border-[#E8E5DF] overflow-hidden">
                    <div className="p-5 border-b border-[#E8E5DF] bg-dash-surface flex justify-between items-center">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-dash-text-secondary">Workspace tags</h3>
                      <span className="text-[10px] font-bold text-dash-success bg-dash-success/15 px-3 py-1 rounded-full border border-dash-success/30 uppercase tracking-wide">
                        Global Registries
                      </span>
                    </div>

                    <div className="p-5 flex flex-col gap-3">
                      {tags.map((tag, idx) => (
                        <div key={idx} className="flex justify-between items-center p-3 rounded-xl border border-[#E8E5DF] bg-dash-bg/40">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-wide ${tag.color}`}>
                            {tag.name}
                          </span>
                          <span className="text-xs text-dash-text-secondary font-semibold font-mono">
                            {tag.count} leads mapped
                          </span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Right: Tag Creation form */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                  <Card className="border-[#E8E5DF]">
                    <h4 className="text-xs font-black uppercase tracking-wider text-dash-text-secondary mb-4 border-b border-[#E8E5DF] pb-2">
                      Create New Tag
                    </h4>
                    <form onSubmit={handleCreateNewGlobalTag} className="flex flex-col gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] uppercase font-bold tracking-wider text-dash-text-secondary">Tag Label Name</label>
                        <input
                          type="text"
                          required
                          value={newTagInput}
                          onChange={(e) => setNewTagInput(e.target.value)}
                          className="w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent"
                          placeholder="E.g. VIP Pre-order"
                        />
                      </div>
                      
                      <button
                        type="submit"
                        className="w-full px-4 py-2.5 bg-dash-sidebar hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all border-none cursor-pointer flex items-center justify-center gap-1.5 shadow-sm shadow-[#FF6846]/5"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Register Tag</span>
                      </button>
                    </form>
                  </Card>
                </div>

              </div>
            )}

            {/* TAB 5: LIVE EVENT COMPLIANCE ACTIVITY STREAM */}
            {activeTab === 'activity' && (
              <div className="max-w-3xl mx-auto w-full select-none">
                <Card className="border-[#E8E5DF] p-6 relative bg-dash-surface flex flex-col gap-6">
                  
                  <div className="border-b border-[#E8E5DF] pb-4 flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4.5 h-4.5 text-dash-accent animate-pulse-glow shrink-0" />
                      <h3 className="text-sm font-bold uppercase tracking-wider text-dash-text-secondary">Live activity timelines</h3>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-dash-text-tertiary">Real-time feeds</span>
                  </div>

                  <div className="flex flex-col gap-6 relative pl-6 border-l border-[#E8E5DF] ml-3">
                    {activities.map((act) => (
                      <div key={act.id} className="relative">
                        
                        {/* Timeline dot */}
                        <div className="absolute top-1 -left-[30px] w-2.5 h-2.5 rounded-full bg-dash-accent border border-dash-bg z-10 animate-pulse" />

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div className="flex items-center gap-2">
                            <strong className="text-xs font-bold text-dash-text">{act.contactName}</strong>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                              act.type === 'purchase'
                                ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                : act.type === 'lead'
                                ? 'bg-[#FF6846]/10 text-[#FF6846] border border-[#FF6846]/20'
                                : act.type === 'automation'
                                ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                : 'bg-dash-muted text-dash-text-tertiary'
                            }`}>
                              {act.type}
                            </span>
                          </div>
                          <span className="text-[9.5px] text-dash-text-tertiary font-mono font-bold flex items-center gap-1 select-all">
                            <Clock className="w-3 h-3" />
                            {act.timestamp}
                          </span>
                        </div>
                        
                        <p className="text-xs text-dash-text-secondary mt-1 max-w-xl leading-relaxed">
                          {act.details}
                        </p>

                      </div>
                    ))}
                  </div>

                </Card>
              </div>
            )}

          </motion.div>
        )}

      </AnimatePresence>

      {/* ==========================================
          interactive drawer overlay 1: CONTACT DETAIL PANEL
          ========================================== */}
      <AnimatePresence>
        {isContactDrawerOpen && selectedContact && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsContactDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            {/* Right hand side slider panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed top-0 bottom-0 right-0 z-50 w-full max-w-md bg-dash-bg border-l border-[#E8E5DF] p-6 shadow-2xl flex flex-col gap-6 select-none text-dash-text overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center w-full border-b border-[#E8E5DF] pb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <User className="w-4.5 h-4.5 text-dash-accent" />
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-dash-text">
                    CRM Lead Card Profile
                  </h3>
                </div>
                <button
                  onClick={() => setIsContactDrawerOpen(false)}
                  className="p-1 rounded hover:bg-dash-muted text-dash-text-secondary hover:text-dash-text transition-colors cursor-pointer border-none flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Lead Details Body */}
              <div className="flex flex-col gap-5 text-xs">
                
                {/* Contact Card avatar */}
                <div className="flex items-center gap-4 bg-dash-surface border border-[#E8E5DF] p-4.5 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-[#FF6846]/10 text-[#FF6846] flex items-center justify-center font-bold text-sm shrink-0 select-none border border-[#FF6846]/20">
                    {selectedContact.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-dash-text truncate leading-tight tracking-tight">{selectedContact.name}</h4>
                    <span className="text-[10px] text-dash-text-tertiary select-all font-semibold truncate block mt-0.5">{selectedContact.email}</span>
                  </div>
                </div>

                {/* Score panel */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-dash-surface border border-[#E8E5DF] p-3.5 rounded-xl text-center flex flex-col items-center justify-center">
                    <span className="text-[9px] uppercase font-bold text-dash-text-tertiary block">Engagement Score</span>
                    <strong className="text-xl font-bold font-mono text-dash-text mt-1">{selectedContact.leadScore} / 100</strong>
                  </div>

                  <div className="bg-dash-surface border border-[#E8E5DF] p-3.5 rounded-xl text-center flex flex-col items-center justify-center">
                    <span className="text-[9px] uppercase font-bold text-dash-text-tertiary block">Automation status</span>
                    <strong className="text-xs font-bold text-dash-success uppercase mt-2 tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-dash-success inline-block shrink-0" />
                      {selectedContact.automationStatus}
                    </strong>
                  </div>
                </div>

                <div className="h-px bg-[#E8E5DF]" />

                {/* Parameters */}
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] uppercase font-bold text-dash-text-tertiary">Meta Information</span>
                  
                  <div className="grid grid-cols-2 py-1.5 border-b border-[#E8E5DF]">
                    <span className="text-dash-text-secondary font-medium">Acquisition Channel</span>
                    <strong className="text-right text-dash-text">{selectedContact.source}</strong>
                  </div>
                  
                  <div className="grid grid-cols-2 py-1.5 border-b border-[#E8E5DF]">
                    <span className="text-dash-text-secondary font-medium">Added to Registry</span>
                    <strong className="text-right text-dash-text font-mono">{selectedContact.dateAdded}</strong>
                  </div>

                  <div className="grid grid-cols-2 py-1.5 border-b border-[#E8E5DF]">
                    <span className="text-dash-text-secondary font-medium">Products Bought</span>
                    <strong className="text-right text-dash-text font-mono truncate max-w-[150px]">
                      {selectedContact.purchasedProducts.length > 0 ? selectedContact.purchasedProducts.join(', ') : 'None'}
                    </strong>
                  </div>
                </div>

                <div className="h-px bg-[#E8E5DF]" />

                {/* Tags management */}
                <div className="flex flex-col gap-2.5">
                  <span className="text-[9px] uppercase font-bold text-dash-text-tertiary">MAPPED LEAD TAGS</span>
                  <div className="flex flex-wrap gap-1.5 select-none">
                    {selectedContact.tags.map(t => (
                      <span
                        key={t}
                        onClick={() => handleRemoveTagFromContact(selectedContact.id, t)}
                        className="px-2 py-1 rounded-full text-[9px] font-bold bg-[#FF6846]/10 text-[#FF6846] border border-[#FF6846]/20 cursor-pointer hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all flex items-center gap-1"
                        title="Click to remove tag"
                      >
                        <span>{t}</span>
                        <X className="w-2.5 h-2.5 shrink-0" />
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2 items-center mt-1">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddTagToContact(selectedContact.id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-dash-muted border border-[#E8E5DF] text-dash-text focus:outline-none"
                    >
                      <option value="">+ Assign tag...</option>
                      {tags.map(tag => (
                        <option key={tag.name} value={tag.name}>{tag.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="h-px bg-[#E8E5DF]" />

                {/* Custom compliant Notes logging */}
                <div className="flex flex-col gap-2 bg-dash-surface border border-[#E8E5DF] p-4 rounded-xl">
                  <label className="text-[9px] uppercase font-bold text-dash-text-tertiary block flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-dash-accent shrink-0" />
                    <span>Compliance Workspace Notes</span>
                  </label>
                  
                  {contactNotes[selectedContact.id] ? (
                    <div className="bg-dash-muted/40 border border-[#E8E5DF] rounded-lg p-3 text-[11px] text-dash-text-secondary leading-relaxed font-mono relative select-text">
                      <p>{contactNotes[selectedContact.id]}</p>
                      <button
                        onClick={() => {
                          const updated = { ...contactNotes };
                          delete updated[selectedContact.id];
                          setContactNotes(updated);
                          localStorage.setItem('openlx_crm_notes', JSON.stringify(updated));
                        }}
                        className="absolute top-1.5 right-1.5 text-[9px] text-red-500 hover:underline border-none bg-transparent cursor-pointer"
                      >
                        clear
                      </button>
                    </div>
                  ) : (
                    <span className="text-[10px] text-dash-text-tertiary select-none font-medium italic">
                      No custom compliance notations stored. Type below to cache progress.
                    </span>
                  )}

                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={tempNoteText}
                      onChange={(e) => setTempNoteText(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent"
                      placeholder="E.g. Verified bank proof..."
                    />
                    <button
                      onClick={() => handleAddNote(selectedContact.id)}
                      className="px-3.5 py-2 bg-dash-sidebar hover:bg-neutral-800 text-white rounded-lg text-xs font-bold transition-all border-none cursor-pointer"
                    >
                      Log Note
                    </button>
                  </div>
                </div>

              </div>

              {/* Footer status */}
              <div className="text-[9px] text-dash-text-tertiary select-none text-center border-t border-[#E8E5DF] pt-4 mt-auto uppercase tracking-wider flex items-center justify-center gap-1 font-mono">
                <Lock className="w-3 h-3" />
                <span>Zero-Knowledge CRM Ledger Encryption Active</span>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ==========================================
          interactive drawer overlay 2: SEGMENT COHORT BUILDER
          ========================================== */}
      <AnimatePresence>
        {isSegmentDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSegmentDrawerOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            {/* Right hand side slider panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed top-0 bottom-0 right-0 z-50 w-full max-w-md bg-dash-bg border-l border-[#E8E5DF] p-6 shadow-2xl flex flex-col gap-6 select-none text-dash-text overflow-y-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-center w-full border-b border-[#E8E5DF] pb-4 shrink-0">
                <div className="flex items-center gap-2">
                  <Zap className="w-4.5 h-4.5 text-[#FF6846]" />
                  <h3 className="font-extrabold text-sm uppercase tracking-wider text-dash-text">
                    CRM Smart Cohort Builder
                  </h3>
                </div>
                <button
                  onClick={() => setIsSegmentDrawerOpen(false)}
                  className="p-1 rounded hover:bg-dash-muted text-dash-text-secondary hover:text-dash-text transition-colors cursor-pointer border-none flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Details */}
              <form onSubmit={handleCreateSegment} className="flex flex-col gap-5 text-xs">
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-dash-text-secondary">Smart Segment Cohort Name</label>
                  <input
                    type="text"
                    required
                    value={newSegmentName}
                    onChange={(e) => setNewSegmentName(e.target.value)}
                    className="w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent"
                    placeholder="E.g. VIP Mentorship Buyers"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-dash-text-secondary">Cohort Mapping Logic</label>
                  <select
                    value={newSegmentType}
                    onChange={(e) => setNewSegmentType(e.target.value as any)}
                    className="w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent"
                  >
                    <option value="Dynamic">Dynamic Smart Segment (updates in real-time)</option>
                    <option value="Static list">Static Snapshot List (fixed matching snapshot)</option>
                  </select>
                </div>

                <div className="h-px bg-[#E8E5DF]" />

                {/* Filter rules builder inside drawer */}
                <div className="flex flex-col gap-2 bg-dash-surface border border-[#E8E5DF] p-4 rounded-xl">
                  <span className="text-[9px] uppercase font-bold text-dash-text-tertiary">Segment Mapping Filter Rules</span>
                  
                  <div className="flex flex-col gap-3 mt-1">
                    
                    <div className="flex items-center gap-2">
                      <span className="text-dash-text-tertiary uppercase text-[9px] font-bold">Rule 1:</span>
                      <select className="px-2 py-1 text-xs rounded border border-[#E8E5DF] bg-dash-bg text-dash-text">
                        <option>Lead Score &gt;=</option>
                        <option>Customer Tags includes</option>
                        <option>Acquisition source equals</option>
                      </select>
                      
                      <input
                        type="text"
                        value={newSegmentCriteria}
                        onChange={(e) => setNewSegmentCriteria(e.target.value)}
                        className="w-20 px-2 py-1 text-xs rounded border border-[#E8E5DF] bg-dash-bg text-dash-text text-center font-mono font-bold"
                        placeholder="70"
                      />
                    </div>

                    <span className="text-[9.5px] text-dash-text-tertiary select-none italic mt-1 leading-relaxed">
                      💡 Dynamic cohorts evaluate user transactions live.Mappers query PAN details or product indices on storefront automatically.
                    </span>

                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full px-5 py-3 bg-dash-sidebar hover:bg-neutral-800 text-white rounded-full text-xs font-black uppercase tracking-wider transition-all border-none cursor-pointer mt-4 flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Register CRM Cohort Segment</span>
                  <ArrowRight className="w-4 h-4 animate-pulse" />
                </button>

              </form>

              {/* Secure disclaimers footer */}
              <div className="text-[9px] text-dash-text-tertiary select-none text-center border-t border-[#E8E5DF] pt-4 mt-auto uppercase tracking-wider flex items-center justify-center gap-1 font-mono">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Segment Mappers Clear under SSL validation</span>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
