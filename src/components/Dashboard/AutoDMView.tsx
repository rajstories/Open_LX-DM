import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Plus,
  Play,
  Pause,
  Trash2,
  Search,
  Filter,
  Clock,
  Check,
  MessageSquare,
  Link,
  ArrowLeft,
  Lock,
  TrendingUp
} from 'lucide-react';
import { Card } from './DashboardPrimitives';

// ==========================================
// DATA SCHEMAS & INTERFACES
// ==========================================
type AutoDMTab = 'automations' | 'templates' | 'activity' | 'settings';
type AutomationStatus = 'active' | 'paused' | 'draft' | 'error';
type TriggerType = 'post_comment' | 'reel_comment' | 'story_reply' | 'keyword_dm';
type DelayType = 'immediate' | '5s' | '10s' | '1m';

interface AutomationRule {
  id: string;
  name: string;
  triggerType: TriggerType;
  triggerKeyword: string;
  status: AutomationStatus;
  sentCount: number;
  clickCount: number;
  conversionRate: string;
  // Node configurations
  leadCaptureEnabled: boolean;
  delay: DelayType;
  replyMessage: string;
  btnLabel: string;
  btnLink: string;
  fallbackMsg: string;
  conditionsEnabled: boolean;
  conditionMinScore: number;
}

interface ActivityEvent {
  id: string;
  timestamp: string;
  keyword: string;
  userHandle: string;
  channel: string;
  status: 'sent' | 'clicked' | 'opt_in' | 'failed';
  details: string;
}

// ==========================================
// CORE SEED DATA
// ==========================================
const INITIAL_RULES: AutomationRule[] = [
  {
    id: 'rule_1',
    name: 'Instagram Reel Playbook Opt-in',
    triggerType: 'reel_comment',
    triggerKeyword: 'BUY',
    status: 'active',
    sentCount: 240,
    clickCount: 142,
    conversionRate: '59%',
    leadCaptureEnabled: true,
    delay: '5s',
    replyMessage: 'Hey! Here is the link to purchase the Instagram Growth Playbook PDF instantly.',
    btnLabel: 'Get Playbook PDF',
    btnLink: 'openlx.dm/creator/playbook',
    fallbackMsg: 'Hey! Please comment BUY on my latest reels to trigger the automatic delivery links.',
    conditionsEnabled: true,
    conditionMinScore: 50
  },
  {
    id: 'rule_2',
    name: '1:1 Coaching Consult Trigger',
    triggerType: 'keyword_dm',
    triggerKeyword: 'COACH',
    status: 'active',
    sentCount: 120,
    clickCount: 85,
    conversionRate: '70%',
    leadCaptureEnabled: false,
    delay: 'immediate',
    replyMessage: 'Thanks for reaching out! Book your 1:1 strategy slot via this scheduling page.',
    btnLabel: 'Schedule Call Slot',
    btnLink: 'openlx.dm/creator/coaching',
    fallbackMsg: 'Hey! Slot schedules are compiled weekly. Reach out if links expire.',
    conditionsEnabled: false,
    conditionMinScore: 0
  },
  {
    id: 'rule_3',
    name: 'Lightroom LUT Preset Guide',
    triggerType: 'post_comment',
    triggerKeyword: 'PRESETS',
    status: 'paused',
    sentCount: 45,
    clickCount: 12,
    conversionRate: '26%',
    leadCaptureEnabled: true,
    delay: '10s',
    replyMessage: 'Exclusive Presets are here! Grab the Lightroom LUT presets pack inside.',
    btnLabel: 'Download Presets Pack',
    btnLink: 'openlx.dm/creator/presets',
    fallbackMsg: 'Hey! Presets slots are capped today. Try again shortly.',
    conditionsEnabled: false,
    conditionMinScore: 0
  },
  {
    id: 'rule_4',
    name: 'Aadhaar Compliance Handouts',
    triggerType: 'story_reply',
    triggerKeyword: 'SECURE',
    status: 'error',
    sentCount: 8,
    clickCount: 0,
    conversionRate: '0%',
    leadCaptureEnabled: true,
    delay: '1m',
    replyMessage: 'Secure KYC compliance documents delivered instantly.',
    btnLabel: 'Download KYC PDF',
    btnLink: 'openlx.dm/creator/kyc_secure',
    fallbackMsg: 'KYC check limits reached in webhook sandbox.',
    conditionsEnabled: true,
    conditionMinScore: 70
  }
];

const INITIAL_ACTIVITIES: ActivityEvent[] = [
  { id: 'ev_01', timestamp: '2 mins ago', keyword: 'BUY', userHandle: '@tanvi_shah', channel: 'Reel Comment', status: 'opt_in', details: 'Lead capture opt-in matched email tanvi@shah.in' },
  { id: 'ev_02', timestamp: '1 hour ago', keyword: 'COACH', userHandle: '@kunal_k', channel: 'Direct DM', status: 'clicked', details: 'Clicked storefront Consult call schedule link' },
  { id: 'ev_03', timestamp: '2 hours ago', keyword: 'BUY', userHandle: '@aish_sen', channel: 'Reel Comment', status: 'sent', details: 'Conversational DM replied sequence successfully triggered' },
  { id: 'ev_04', timestamp: '1 day ago', keyword: 'SECURE', userHandle: '@rohan_m', channel: 'Story Reply', status: 'failed', details: 'NSDL Aadhaar trigger error: Webhook credential mismatch' }
];

// ==========================================
// MAIN WORKSPACE COMPONENT
// ==========================================
export default function AutoDMView() {
  const [activeTab, setActiveTab] = useState<AutoDMTab>('automations');
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES);
  const [activities, setActivities] = useState<ActivityEvent[]>(INITIAL_ACTIVITIES);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AutomationStatus>('all');

  // Builder States
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);

  // Draft Builder Node state values (for dynamic Phone Preview rendering)
  const [builderName, setBuilderName] = useState('New Smart Automation');
  const [builderTriggerType, setBuilderTriggerType] = useState<TriggerType>('reel_comment');
  const [builderKeyword, setBuilderKeyword] = useState('OFFER');
  const [builderMessage, setBuilderMessage] = useState('Hey! Here is the exclusive link to grab our curated digital goods catalog.');
  const [builderBtnLabel, setBuilderBtnLabel] = useState('Download Catalog');
  const [builderBtnLink, setBuilderBtnLink] = useState('openlx.dm/creator/storefront');
  const [builderLeadCapture, setBuilderLeadCapture] = useState(true);
  const [builderDelay, setBuilderDelay] = useState<DelayType>('immediate');
  const [builderFallback, setBuilderFallback] = useState('Oops! Please type OFFER to get the catalog links direct in your inbox.');
  const [builderConditions, setBuilderConditions] = useState(false);
  const [builderMinScore, setBuilderMinScore] = useState(50);

  // Test Flow Simulator State (Conversational preview micro-animations)
  const [simStep, setSimStep] = useState(0);
  const [simMessages, setSimMessages] = useState<{ sender: 'user' | 'bot'; text: string; link?: string; btn?: string }[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  // Filter rules
  const filteredRules = rules.filter(rule => {
    if (statusFilter !== 'all' && rule.status !== statusFilter) return false;
    if (!searchQuery.trim()) return true;
    const match = searchQuery.toLowerCase();
    return (
      rule.name.toLowerCase().includes(match) ||
      rule.triggerKeyword.toLowerCase().includes(match)
    );
  });

  const handleOpenNewBuilder = () => {
    setEditingRule(null);
    setBuilderName('New Reels Automation');
    setBuilderTriggerType('reel_comment');
    setBuilderKeyword('GIFT');
    setBuilderMessage('Congratulations! Grab your exclusive curated free presets guide pack using the CTA card below.');
    setBuilderBtnLabel('Get Presets Pack');
    setBuilderBtnLink('openlx.dm/presets_free');
    setBuilderLeadCapture(true);
    setBuilderDelay('5s');
    setBuilderFallback('Oops! Please comment GIFT on my reel to trigger the link payout.');
    setBuilderConditions(false);
    setBuilderMinScore(50);
    
    // Reset simulator
    setSimStep(0);
    setSimMessages([]);
    setIsBuilderOpen(true);
  };

  const handleOpenEditBuilder = (rule: AutomationRule) => {
    setEditingRule(rule);
    setBuilderName(rule.name);
    setBuilderTriggerType(rule.triggerType);
    setBuilderKeyword(rule.triggerKeyword);
    setBuilderMessage(rule.replyMessage);
    setBuilderBtnLabel(rule.btnLabel);
    setBuilderBtnLink(rule.btnLink);
    setBuilderLeadCapture(rule.leadCaptureEnabled);
    setBuilderDelay(rule.delay);
    setBuilderFallback(rule.fallbackMsg);
    setBuilderConditions(rule.conditionsEnabled);
    setBuilderMinScore(rule.conditionMinScore);

    // Reset simulator
    setSimStep(0);
    setSimMessages([]);
    setIsBuilderOpen(true);
  };

  const handleDeleteRule = (id: string, name: string) => {
    if (confirm(`Confirm deletion of webhook automation rule: "${name}"?`)) {
      setRules(rules.filter(r => r.id !== id));
    }
  };

  const handleToggleStatus = (id: string, current: AutomationStatus) => {
    const next: AutomationStatus = current === 'active' ? 'paused' : 'active';
    setRules(rules.map(r => r.id === id ? { ...r, status: next } : r));
    alert(`Status updated successfully: Webhook limits adjusted to ${next}`);
  };

  // Publish workflow builder rules
  const handlePublishAutomation = () => {
    if (!builderKeyword.trim()) {
      alert('Please fill out trigger word keyword.');
      return;
    }

    const payload: AutomationRule = {
      id: editingRule ? editingRule.id : `rule_${Date.now()}`,
      name: builderName,
      triggerType: builderTriggerType,
      triggerKeyword: builderKeyword.toUpperCase().trim(),
      status: 'active',
      sentCount: editingRule ? editingRule.sentCount : 0,
      clickCount: editingRule ? editingRule.clickCount : 0,
      conversionRate: editingRule ? editingRule.conversionRate : '0%',
      leadCaptureEnabled: builderLeadCapture,
      delay: builderDelay,
      replyMessage: builderMessage,
      btnLabel: builderBtnLabel,
      btnLink: builderBtnLink,
      fallbackMsg: builderFallback,
      conditionsEnabled: builderConditions,
      conditionMinScore: builderMinScore
    };

    if (editingRule) {
      setRules(rules.map(r => r.id === editingRule.id ? payload : r));
      alert(`⚡ Automation Rule "${builderName}" updated in Instagram Webhooks!`);
    } else {
      setRules([payload, ...rules]);
      alert(`⚡ Automation Rule "${builderName}" registered successfully!`);
    }
    
    // Log Activity Event
    const newEv: ActivityEvent = {
      id: `ev_${Date.now()}`,
      timestamp: 'Just now',
      keyword: builderKeyword.toUpperCase().trim(),
      userHandle: '@system',
      channel: builderTriggerType === 'reel_comment' ? 'Reel Comment' : 'Direct DM',
      status: 'sent',
      details: `New compiled trigger webhook published successfully: ${builderKeyword}`
    };
    setActivities([newEv, ...activities]);

    setIsBuilderOpen(false);
  };

  // Step-by-Step DM Conversation Simulation
  const runSimulation = () => {
    setIsSimulating(true);
    setSimStep(1);
    setSimMessages([]);

    // 1. Comment Trigger
    setTimeout(() => {
      setSimMessages(prev => [
        ...prev,
        { sender: 'user', text: `[Trigger] Commented "${builderKeyword}" on your Reels video!` }
      ]);
      setSimStep(2);
    }, 600);

    // 2. Typing indicator and Reply
    setTimeout(() => {
      setSimMessages(prev => [
        ...prev,
        { sender: 'bot', text: builderMessage }
      ]);
      setSimStep(3);
    }, 1500);

    // 3. Lead Capture or CTA Button direct
    if (builderLeadCapture) {
      setTimeout(() => {
        setSimMessages(prev => [
          ...prev,
          { sender: 'bot', text: '📬 Please type your email below to unlock the secure download link card...' }
        ]);
        setSimStep(4);
      }, 2500);

      setTimeout(() => {
        setSimMessages(prev => [
          ...prev,
          { sender: 'user', text: 'tanvi@shah.in' }
        ]);
        setSimStep(5);
      }, 3500);

      setTimeout(() => {
        setSimMessages(prev => [
          ...prev,
          { sender: 'bot', text: '✓ Verified email capture! Here is your download link payload card:', btn: builderBtnLabel, link: builderBtnLink }
        ]);
        setSimStep(6);
        setIsSimulating(false);
      }, 4500);
    } else {
      setTimeout(() => {
        setSimMessages(prev => [
          ...prev,
          { sender: 'bot', btn: builderBtnLabel, link: builderBtnLink, text: 'Click below to purchase storefront payload details:' }
        ]);
        setSimStep(6);
        setIsSimulating(false);
      }, 2500);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full select-none text-dash-text font-sans pb-10">
      
      <AnimatePresence mode="wait">
        
        {/* ==========================================
            VIEW 1: AUTOMATIONS DASHBOARD VIEW
            ========================================== */}
        {!isBuilderOpen && (
          <motion.div
            key="dashboard_view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            {/* Console header */}
            <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-dash-surface border border-[#E8E5DF] rounded-2xl p-5 mb-1 shadow-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-black tracking-widest text-dash-accent font-mono">CONVERSATION AUTOMATIONS</span>
                  <span className="text-[9px] px-2 py-0.5 rounded bg-dash-sidebar text-white font-mono font-semibold uppercase">API Connected</span>
                </div>
                <h2 className="text-xl font-extrabold text-dash-text mt-0.5 tracking-tight font-sans">Auto DM Funnel Studio</h2>
              </div>

              {/* Create Automation trigger */}
              <button
                onClick={handleOpenNewBuilder}
                className="px-5 py-2.5 bg-dash-sidebar hover:bg-neutral-800 text-white rounded-full text-xs font-black uppercase tracking-wider transition-all border-none cursor-pointer flex items-center gap-1.5 shadow-sm shadow-[#FF6846]/5"
              >
                <Plus className="w-4 h-4" />
                <span>Create Automation</span>
              </button>
            </div>

            {/* Metrics cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <Card className="border-[#E8E5DF] flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-dash-text-tertiary tracking-wider block">Messages Sent</span>
                  <h3 className="text-3xl font-black text-dash-text tracking-tight font-mono mt-1">413 total</h3>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[10px] text-dash-success font-bold font-mono select-none">
                  <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                  <span>+28% this week</span>
                </div>
              </Card>

              <Card className="border-[#E8E5DF] flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-dash-text-tertiary tracking-wider block">Replies Triggered</span>
                  <h3 className="text-3xl font-black text-dash-text tracking-tight font-mono mt-1">245 answers</h3>
                </div>
                <div className="mt-4 flex items-center gap-1.5 text-[10px] text-dash-text-secondary select-none">
                  <span>99.8% webhook delivery</span>
                </div>
              </Card>

              <Card className="border-[#E8E5DF] flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-dash-text-tertiary tracking-wider block">Leads Collected</span>
                  <h3 className="text-3xl font-black text-dash-text tracking-tight font-mono mt-1">112 emails</h3>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[10px] text-dash-success font-bold font-mono select-none">
                  <span>+14.5% conversion</span>
                </div>
              </Card>

              <Card className="border-[#E8E5DF] flex flex-col justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-dash-text-tertiary tracking-wider block">Average Conversion</span>
                  <h3 className="text-3xl font-black text-dash-text tracking-tight font-mono mt-1">59.3% Rate</h3>
                </div>
                <div className="mt-4 flex items-center gap-1 text-[10px] text-dash-text-tertiary select-none">
                  <span>Standard ManyChat levels</span>
                </div>
              </Card>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-[#E8E5DF] pb-px select-none">
              {[
                { id: 'automations', label: 'Active webhooks', icon: <Zap className="w-4 h-4" /> },
                { id: 'templates', label: 'Quick Templates', icon: <MessageSquare className="w-4 h-4" /> },
                { id: 'activity', label: 'Activity Logs', icon: <Clock className="w-4 h-4" /> },
                { id: 'settings', label: 'Webhook Settings', icon: <Lock className="w-4 h-4" /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AutoDMTab)}
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
                      layoutId="activeAutoDmTabLine"
                      className="absolute bottom-[-1px] left-0 right-0 h-0.5 bg-dash-accent"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Active automations ledger panel */}
            {activeTab === 'automations' && (
              <div className="flex flex-col gap-5">
                
                {/* Search & filters toolbar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-dash-surface border border-[#E8E5DF] rounded-2xl p-4 shadow-sm">
                  
                  {/* Search keyword input */}
                  <div className="relative w-full sm:w-56">
                    <Search className="w-4 h-4 text-dash-text-tertiary absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs font-semibold rounded-xl bg-dash-muted border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent"
                      placeholder="Search keyword triggers..."
                    />
                  </div>

                  {/* Status rules dropdown filter */}
                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <Filter className="w-3.5 h-3.5 text-dash-text-tertiary hidden sm:block" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="px-3 py-2 rounded-xl text-xs font-bold bg-dash-muted border border-[#E8E5DF] text-dash-text focus:outline-none"
                    >
                      <option value="all">🔍 All Statuses</option>
                      <option value="active">🟢 Active Webhooks</option>
                      <option value="paused">⏸️ Paused</option>
                      <option value="draft">📁 Drafts</option>
                      <option value="error">❌ Errors</option>
                    </select>
                  </div>

                </div>

                {/* Ledger Table */}
                <Card className="p-0 border-[#E8E5DF] overflow-hidden">
                  <div className="w-full overflow-x-auto bg-dash-surface">
                    <table className="w-full border-collapse text-left text-sm">
                      <thead>
                        <tr className="border-b border-[#E8E5DF] bg-dash-bg/40 select-none">
                          <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Webhook Automation Name</th>
                          <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Instagram Trigger</th>
                          <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Delays</th>
                          <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Opt-In Capture</th>
                          <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Outreach Stats</th>
                          <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Status</th>
                          <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-dash-text-secondary text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E5DF]">
                        {filteredRules.map(rule => (
                          <tr key={rule.id} className="hover:bg-dash-bg/10 transition-colors">
                            <td className="px-6 py-4">
                              <h4 className="text-xs font-bold text-dash-text tracking-tight">{rule.name}</h4>
                              <span className="text-[10px] text-dash-text-tertiary select-all font-semibold mt-0.5 truncate block max-w-xs">
                                📎 {rule.btnLink}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2 select-none">
                                <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 text-[10px] font-bold font-mono px-2.5 py-0.5 rounded-full uppercase">
                                  {rule.triggerKeyword}
                                </span>
                                <span className="text-[9.5px] text-dash-text-secondary font-medium">
                                  {rule.triggerType === 'reel_comment' ? 'Reel Comment' : 'Direct DM'}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4 font-mono text-xs text-dash-text-secondary select-none capitalize">
                              {rule.delay}
                            </td>

                            <td className="px-6 py-4 select-none">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                rule.leadCaptureEnabled ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20' : 'bg-dash-muted text-dash-text-tertiary border-[#E8E5DF]'
                              }`}>
                                {rule.leadCaptureEnabled ? '📬 Email Capture' : 'Direct payload'}
                              </span>
                            </td>

                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div>
                                  <span className="text-[10px] text-dash-text-secondary block font-mono">DMs: **{rule.sentCount}**</span>
                                  <span className="text-[10px] text-dash-text-secondary block font-mono">Clicks: **{rule.clickCount}**</span>
                                </div>
                                <span className="text-xs font-black font-mono text-dash-text bg-[#FF6846]/10 text-[#FF6846] px-2 py-0.5 rounded border border-[#FF6846]/20">
                                  {rule.conversionRate}
                                </span>
                              </div>
                            </td>

                            <td className="px-6 py-4 select-none">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                rule.status === 'active'
                                  ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20'
                                  : rule.status === 'paused'
                                  ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20'
                                  : rule.status === 'error'
                                  ? 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse'
                                  : 'bg-neutral-500/10 text-neutral-500 border border-[#E8E5DF]'
                              }`}>
                                <span className={`w-1 h-1 rounded-full ${
                                  rule.status === 'active' ? 'bg-emerald-500' : rule.status === 'paused' ? 'bg-amber-500' : rule.status === 'error' ? 'bg-red-500' : 'bg-neutral-500'
                                }`} />
                                <span>{rule.status}</span>
                              </span>
                            </td>

                            <td className="px-6 py-4 text-right select-none">
                              <div className="flex items-center gap-2 justify-end">
                                <button
                                  onClick={() => handleToggleStatus(rule.id, rule.status)}
                                  className="p-1.5 rounded-lg hover:bg-dash-muted text-dash-text-secondary hover:text-dash-text transition-colors cursor-pointer border-none flex items-center justify-center"
                                  title={rule.status === 'active' ? 'Pause Automation' : 'Resume Automation'}
                                >
                                  {rule.status === 'active' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => handleOpenEditBuilder(rule)}
                                  className="px-2 py-1 bg-dash-bg border border-[#E8E5DF] hover:bg-[#E8E5DF] text-dash-text text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                                >
                                  Edit Node
                                </button>
                                <button
                                  onClick={() => handleDeleteRule(rule.id, rule.name)}
                                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer border-none flex items-center justify-center"
                                  title="Delete Automation"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

              </div>
            )}

            {/* Other tabs fallback */}
            {activeTab !== 'automations' && (
              <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-[#E8E5DF] min-h-[300px]">
                <Zap className="w-12 h-12 text-dash-text-tertiary mb-3 animate-pulse" />
                <h4 className="text-sm font-bold text-dash-text tracking-tight">{activeTab.toUpperCase()} View is active</h4>
                <p className="text-xs text-dash-text-secondary mt-1 max-w-sm leading-relaxed">
                  Instagram Graph API webhooks and response templates are cleared. Edit storefront links or configure active keywords to test conversational sandbox cleared.
                </p>
              </Card>
            )}

          </motion.div>
        )}

        {/* ==========================================
            VIEW 2: STACKED WORKFLOW BUILDER VIEW
            ========================================== */}
        {isBuilderOpen && (
          <motion.div
            key="builder_view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col gap-6"
          >
            {/* Top Back bar */}
            <div className="flex justify-between items-center bg-dash-surface border border-[#E8E5DF] rounded-2xl p-4 shadow-sm select-none">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsBuilderOpen(false)}
                  className="p-2 rounded-xl hover:bg-dash-muted text-dash-text-secondary hover:text-dash-text transition-all cursor-pointer border-none flex items-center justify-center"
                  title="Return to Dashboard"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase font-bold text-dash-accent font-mono">Workflow Builder</span>
                    <span className="text-[8px] bg-dash-sidebar text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider select-none font-mono">
                      DYNAMIC PREVIEW
                    </span>
                  </div>
                  <input
                    type="text"
                    value={builderName}
                    onChange={(e) => setBuilderName(e.target.value)}
                    className="bg-transparent border-none text-sm font-black text-dash-text focus:outline-none focus:bg-dash-muted/40 p-0.5 rounded min-w-[200px]"
                    placeholder="Automation Name"
                  />
                </div>
              </div>

              {/* Publish button */}
              <button
                onClick={handlePublishAutomation}
                className="px-5 py-2 bg-[#FF6846] text-white rounded-full text-xs font-black uppercase tracking-wider transition-all border-none cursor-pointer flex items-center gap-1.5 shadow-sm shadow-[#FF6846]/10"
              >
                <span>Publish Webhook</span>
                <Check className="w-4 h-4" />
              </button>
            </div>

            {/* Split screen content layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
              
              {/* Left Column: Stacked Workflow Cards (7 columns) */}
              <div className="lg:col-span-7 flex flex-col gap-5 relative">
                
                {/* Node 1: Select Trigger */}
                <div className="bg-dash-surface border border-[#E8E5DF] rounded-2xl p-5 relative shadow-sm">
                  <div className="absolute -left-[14px] top-6 w-7 h-7 rounded-full bg-dash-sidebar border border-neutral-700 text-white flex items-center justify-center font-bold text-xs shadow-md select-none font-mono">
                    1
                  </div>
                  
                  <div className="pl-4 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase tracking-wider text-dash-text-secondary">Node 1: Select Webhook Trigger</h4>
                      <span className="text-[9px] font-bold text-dash-accent uppercase">IG Graph Webhook</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase font-bold text-dash-text-tertiary">Trigger Type</label>
                        <select
                          value={builderTriggerType}
                          onChange={(e) => setBuilderTriggerType(e.target.value as TriggerType)}
                          className="px-3 py-2.5 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none"
                        >
                          <option value="reel_comment">Comment on Reels</option>
                          <option value="post_comment">Comment on Posts</option>
                          <option value="story_reply">Story Direct Reply</option>
                          <option value="keyword_dm">Direct Inbox DM</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase font-bold text-dash-text-tertiary">Keyword Match</label>
                        <input
                          type="text"
                          required
                          value={builderKeyword}
                          onChange={(e) => setBuilderKeyword(e.target.value.toUpperCase())}
                          className="px-3 py-2 text-xs font-mono font-bold rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text uppercase focus:outline-none focus:border-dash-accent"
                          placeholder="E.g. BUY"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node 2: Optional Conditions */}
                <div className="bg-dash-surface border border-[#E8E5DF] rounded-2xl p-5 relative shadow-sm">
                  <div className="absolute -left-[14px] top-6 w-7 h-7 rounded-full bg-dash-sidebar border border-neutral-700 text-white flex items-center justify-center font-bold text-xs shadow-md select-none font-mono">
                    2
                  </div>
                  
                  <div className="pl-4 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase tracking-wider text-dash-text-secondary">Node 2: Optional Gating Conditions</h4>
                      <span className="text-[9px] font-bold text-dash-text-tertiary uppercase">Segment Filters</span>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex gap-2.5 items-center select-none">
                        <input
                          type="checkbox"
                          id="builderConditions"
                          checked={builderConditions}
                          onChange={(e) => setBuilderConditions(e.target.checked)}
                          className="rounded text-[#FF6846] focus:ring-[#FF6846] w-4 h-4 cursor-pointer"
                        />
                        <label htmlFor="builderConditions" className="text-xs font-bold text-dash-text cursor-pointer">
                          Activate lead score conditional gating
                        </label>
                      </div>

                      {builderConditions && (
                        <div className="flex items-center gap-3 mt-1.5 animate-pulse-glow">
                          <span className="text-xs font-bold text-dash-text-secondary">Filter Rule: Lead Score must exceed:</span>
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={builderMinScore}
                            onChange={(e) => setBuilderMinScore(parseInt(e.target.value))}
                            className="w-16 px-2 py-1 text-xs rounded border border-[#E8E5DF] bg-dash-bg text-dash-text text-center font-mono font-bold"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Node 3: Reply message sequence */}
                <div className="bg-dash-surface border border-[#E8E5DF] rounded-2xl p-5 relative shadow-sm">
                  <div className="absolute -left-[14px] top-6 w-7 h-7 rounded-full bg-dash-sidebar border border-neutral-700 text-white flex items-center justify-center font-bold text-xs shadow-md select-none font-mono">
                    3
                  </div>
                  
                  <div className="pl-4 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase tracking-wider text-dash-text-secondary">Node 3: Configure Reply Sequence</h4>
                      <span className="text-[9px] font-bold text-dash-accent uppercase">DM template</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase font-bold text-dash-text-tertiary">Conversational Reply Message</label>
                      <textarea
                        required
                        rows={3}
                        value={builderMessage}
                        onChange={(e) => setBuilderMessage(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Node 4: Delays */}
                <div className="bg-dash-surface border border-[#E8E5DF] rounded-2xl p-5 relative shadow-sm">
                  <div className="absolute -left-[14px] top-6 w-7 h-7 rounded-full bg-dash-sidebar border border-neutral-700 text-white flex items-center justify-center font-bold text-xs shadow-md select-none font-mono">
                    4
                  </div>
                  
                  <div className="pl-4 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase tracking-wider text-dash-text-secondary">Node 4: Time Delay parameters</h4>
                      <span className="text-[9px] font-bold text-dash-text-tertiary uppercase">Clearing timer</span>
                    </div>

                    <div className="flex gap-2 select-none">
                      {[
                        { id: 'immediate', label: '⚡ Immediate' },
                        { id: '5s', label: '⏳ 5 Seconds' },
                        { id: '10s', label: '⏳ 10 Seconds' },
                        { id: '1m', label: '⏳ 1 Minute' },
                      ].map(pill => (
                        <button
                          key={pill.id}
                          type="button"
                          onClick={() => setBuilderDelay(pill.id as DelayType)}
                          className={`px-3 py-2.5 border rounded-lg text-[10px] font-black uppercase tracking-wide cursor-pointer transition-colors ${
                            builderDelay === pill.id
                              ? 'bg-dash-sidebar text-white border-dash-sidebar'
                              : 'bg-dash-bg text-dash-text border-[#E8E5DF] hover:bg-dash-muted'
                          }`}
                        >
                          {pill.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Node 5: CTA links or buttons */}
                <div className="bg-dash-surface border border-[#E8E5DF] rounded-2xl p-5 relative shadow-sm">
                  <div className="absolute -left-[14px] top-6 w-7 h-7 rounded-full bg-dash-sidebar border border-neutral-700 text-white flex items-center justify-center font-bold text-xs shadow-md select-none font-mono">
                    5
                  </div>
                  
                  <div className="pl-4 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase tracking-wider text-dash-text-secondary">Node 5: Add Buttons or Links</h4>
                      <span className="text-[9px] font-bold text-dash-accent uppercase">Storefront payload</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase font-bold text-dash-text-tertiary">Button Text</label>
                        <input
                          type="text"
                          required
                          value={builderBtnLabel}
                          onChange={(e) => setBuilderBtnLabel(e.target.value)}
                          className="px-3 py-2 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase font-bold text-dash-text-tertiary">Payload CTA Link</label>
                        <input
                          type="text"
                          required
                          value={builderBtnLink}
                          onChange={(e) => setBuilderBtnLink(e.target.value)}
                          className="px-3 py-2 text-xs font-mono font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Node 6: Lead-Capture step */}
                <div className="bg-dash-surface border border-[#E8E5DF] rounded-2xl p-5 relative shadow-sm">
                  <div className="absolute -left-[14px] top-6 w-7 h-7 rounded-full bg-dash-sidebar border border-neutral-700 text-white flex items-center justify-center font-bold text-xs shadow-md select-none font-mono">
                    6
                  </div>
                  
                  <div className="pl-4 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase tracking-wider text-dash-text-secondary">Node 6: Interactive Lead-Capture step</h4>
                      <span className="text-[9px] font-bold text-dash-text-tertiary uppercase">CRM compiler</span>
                    </div>

                    <div className="flex gap-2.5 items-center select-none">
                      <input
                        type="checkbox"
                        id="builderLeadCapture"
                        checked={builderLeadCapture}
                        onChange={(e) => setBuilderLeadCapture(e.target.checked)}
                        className="rounded text-[#FF6846] focus:ring-[#FF6846] w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="builderLeadCapture" className="text-xs font-bold text-dash-text cursor-pointer">
                        Request user email inside DM before delivering payload link card
                      </label>
                    </div>
                  </div>
                </div>

                {/* Node 7: Fallback Response */}
                <div className="bg-dash-surface border border-[#E8E5DF] rounded-2xl p-5 relative shadow-sm">
                  <div className="absolute -left-[14px] top-6 w-7 h-7 rounded-full bg-dash-sidebar border border-neutral-700 text-white flex items-center justify-center font-bold text-xs shadow-md select-none font-mono">
                    7
                  </div>
                  
                  <div className="pl-4 flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs font-black uppercase tracking-wider text-dash-text-secondary">Node 7: Webhook Fallback Response</h4>
                      <span className="text-[9px] font-bold text-dash-text-tertiary uppercase">Default safety</span>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase font-bold text-dash-text-tertiary">Fallback Template message</label>
                      <textarea
                        required
                        rows={2}
                        value={builderFallback}
                        onChange={(e) => setBuilderFallback(e.target.value)}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent resize-none"
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Live Phone Mockup Preview (5 columns) */}
              <div className="lg:col-span-5 sticky top-24 flex flex-col gap-4 select-none">
                
                <Card className="border-[#E8E5DF] bg-dash-surface flex flex-col justify-between p-6 h-[640px]">
                  
                  <div>
                    {/* Header preview controllers */}
                    <div className="flex justify-between items-center mb-4 select-none">
                      <div className="flex items-center gap-1.5">
                        <MessageSquare className="w-4 h-4 text-[#FF6846]" />
                        <h4 className="text-[10px] uppercase font-black text-dash-text-secondary tracking-wider">
                          Conversation simulator (Node 8 & 9)
                        </h4>
                      </div>
                      
                      {/* Test flow button */}
                      <button
                        type="button"
                        onClick={runSimulation}
                        disabled={isSimulating}
                        className={`px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest cursor-pointer border-none flex items-center gap-1 transition-all ${
                          isSimulating ? 'bg-dash-muted text-dash-text-tertiary cursor-not-allowed' : 'bg-dash-sidebar hover:bg-neutral-800 text-white shadow-sm'
                        }`}
                      >
                        <Play className="w-2.5 h-2.5 shrink-0" />
                        <span>{isSimulating ? 'Testing...' : 'Test Flow'}</span>
                      </button>
                    </div>

                    {/* Realistic Phone container */}
                    <div className="w-[280px] h-[480px] bg-black rounded-[40px] p-2.5 border-[5px] border-neutral-800 shadow-xl mx-auto relative overflow-hidden flex flex-col">
                      {/* Island */}
                      <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-4.5 bg-black rounded-full z-30" />

                      {/* Conversation bubbles screen */}
                      <div className="w-full h-full bg-[#0D0908] rounded-[32px] overflow-hidden flex flex-col pt-7 px-3 pb-2 relative text-left">
                        
                        {/* Neon gradients background blur */}
                        <div className="absolute top-[-20px] left-[-20px] w-28 h-28 bg-[#FF6846]/10 rounded-full blur-2xl pointer-events-none" />
                        <div className="absolute bottom-[-20px] right-[-20px] w-28 h-28 bg-pink-600/10 rounded-full blur-2xl pointer-events-none" />

                        {/* Top Direct header */}
                        <div className="flex items-center gap-2 border-b border-white/5 pb-2 mb-3 z-10 shrink-0 select-none">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#FF6846] to-[#e6005c] p-0.5 flex items-center justify-center shrink-0">
                            <div className="w-full h-full rounded-full bg-[#0D0908] flex items-center justify-center text-[8px] font-bold text-white uppercase">JD</div>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold text-white block">creator_studio</span>
                            <span className="text-[7.5px] text-white/55 block mt-0.5">Active now • Instagram Direct</span>
                          </div>
                        </div>

                        {/* Dynamic chat thread container */}
                        <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-0.5 scrollbar-none z-10 select-text">
                          
                          {/* Default welcome instruction bubble */}
                          {simStep === 0 && (
                            <div className="text-center py-10 px-4 select-none">
                              <MessageSquare className="w-8 h-8 text-white/20 mx-auto mb-2" />
                              <span className="text-[9.5px] text-white/40 block leading-relaxed font-light">
                                Click **"Test Flow"** above to run a hardware-cleared conversational DM sandbox simulation.
                              </span>
                            </div>
                          )}

                          {/* Render dynamic simulation bubble messages */}
                          {simMessages.map((msg, idx) => (
                            <div
                              key={idx}
                              className={`flex flex-col max-w-[85%] ${
                                msg.sender === 'user' ? 'self-end items-end ml-auto' : 'self-start items-start mr-auto'
                              }`}
                            >
                              <div className={`p-2.5 rounded-xl text-[9.5px] leading-relaxed font-medium ${
                                msg.sender === 'user'
                                  ? 'bg-[#FF6846] text-white rounded-br-none font-semibold'
                                  : 'bg-white/10 text-white rounded-bl-none'
                              }`}>
                                {msg.text}
                              </div>

                              {/* Render Link button payload card inside direct DM if available */}
                              {msg.btn && msg.link && (
                                <div className="mt-1.5 w-full bg-white/5 border border-white/10 rounded-xl p-2.5 flex flex-col gap-2.5 text-left animate-pulse-glow">
                                  <div>
                                    <span className="text-[8px] uppercase tracking-widest text-[#FF6846] font-black">STOREFRONT OFFER</span>
                                    <h5 className="text-[9.5px] text-white font-bold leading-tight truncate mt-0.5">{msg.btn}</h5>
                                    <span className="text-[8.5px] text-white/45 font-mono block truncate mt-0.5">{msg.link}</span>
                                  </div>
                                  <a
                                    href="#"
                                    onClick={(e) => { e.preventDefault(); alert(`Cleared: Redirecting to storefront ${msg.link}`); }}
                                    className="w-full bg-[#FF6846] text-white text-[9px] font-black text-center py-1.5 rounded-lg select-none hover:opacity-90 transition-opacity border-none flex items-center justify-center gap-1"
                                  >
                                    <Link className="w-3 h-3" />
                                    <span>{msg.btn}</span>
                                  </a>
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Typings loader indicator */}
                          {isSimulating && (
                            <div className="bg-white/5 text-white/60 p-2.5 rounded-xl rounded-bl-none text-[8px] font-mono font-bold self-start animate-pulse max-w-[80px]">
                              typing...
                            </div>
                          )}

                        </div>

                      </div>
                    </div>

                  </div>

                  {/* PCI-DSS and NSDL validation indicators */}
                  <div className="text-[9px] text-dash-text-tertiary select-none text-center border-t border-[#E8E5DF] pt-3.5 uppercase tracking-wider flex items-center justify-center gap-1 font-mono shrink-0 mt-2">
                    <Lock className="w-3 h-3" />
                    <span>SSL Conversational Clearance Rails Active</span>
                  </div>

                </Card>

              </div>

            </div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}
