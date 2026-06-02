import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Monitor,
  Smartphone,
  Share2,
  Palette,
  BarChart3,
  Globe,
  Settings,
  Sparkles,
  Layers,
  ChevronRight,
  Upload,
  Trophy,
  AlertCircle
} from 'lucide-react';
import { Card } from './DashboardPrimitives';

// ==========================================
// DATA SCHEMAS & INTERFACES
// ==========================================
interface StorefrontBlock {
  id: string;
  type: 'link' | 'product' | 'booking' | 'course' | 'lead_magnet' | 'community' | 'media' | 'testimonial' | 'faq';
  title: string;
  description?: string;
  price?: string;
  linkUrl?: string;
  icon: string;
  isEnabled: boolean;
  mediaUrl?: string;
  authorName?: string;
  faqAnswer?: string;
}

interface ProfileData {
  name: string;
  bio: string;
  avatarText: string;
  instagram: string;
  twitter: string;
  linkedin?: string;
  youtube?: string;
  website: string;
}

interface StorefrontViewProps {
  username: string;
}

export default function StorefrontView({ username }: StorefrontViewProps) {
  // ==========================================
  // ONBOARDING WIZARD STATES
  // ==========================================
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploaded, setIsUploaded] = useState(false);
  const [goalSelection, setGoalSelection] = useState<'sell' | 'leads' | 'bookings' | 'community' | 'links'>('sell');
  const [includePromoBlock, setIncludePromoBlock] = useState(true);
  
  // Mobile preview toggle for onboarding
  const [mobileShowPreview, setMobileShowPreview] = useState(false);

  // Profile data starts with onboarding values
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    bio: '',
    avatarText: username ? username.slice(0, 2).toUpperCase() : 'ME',
    instagram: username || '',
    twitter: '',
    linkedin: '',
    youtube: '',
    website: '',
  });

  // Dynamic recommended block details in step 4
  const [recommendedBlock, setRecommendedBlock] = useState<StorefrontBlock>({
    id: 'promo_block',
    type: 'product',
    title: 'Instagram Growth Formula Playbook (PDF)',
    description: 'The blueprint to monetize reels and trigger conversational flows.',
    price: '₹1,500',
    linkUrl: 'https://openlx.co/playbook',
    icon: '📚',
    isEnabled: true,
  });

  // Update recommended block when goal changes
  useEffect(() => {
    const blockTemplates: Record<string, StorefrontBlock> = {
      sell: {
        id: 'promo_block',
        type: 'product',
        title: 'Premium LUTs & Presets Pack (eBook)',
        description: 'Complete presets workflow to edit cinematic videos in 1 click.',
        price: '₹999',
        linkUrl: 'https://openlx.co/presets',
        icon: '🎨',
        isEnabled: true,
      },
      leads: {
        id: 'promo_block',
        type: 'lead_magnet',
        title: 'Join my Weekly Creator Automation Letter',
        description: 'Get free automations scripts and monetization guides direct to your inbox.',
        price: 'Free',
        linkUrl: 'https://openlx.co/newsletter',
        icon: '🎁',
        isEnabled: true,
      },
      bookings: {
        id: 'promo_block',
        type: 'booking',
        title: '1:1 Private Partner Audit Session (30m)',
        description: 'Strategy review of your storefront and monetization triggers.',
        price: 'Book',
        linkUrl: 'https://openlx.co/audit',
        icon: '📅',
        isEnabled: true,
      },
      community: {
        id: 'promo_block',
        type: 'community',
        title: 'Private VIP Discord Creator Circle',
        description: 'Daily networking group chats with top-tier creator partners.',
        price: '₹499/mo',
        linkUrl: 'https://openlx.co/community',
        icon: '💬',
        isEnabled: true,
      },
      links: {
        id: 'promo_block',
        type: 'link',
        title: 'View my full Creative Portfolio Hub',
        description: 'Link-in-bio to view client cases and custom projects.',
        price: 'Go',
        linkUrl: 'https://openlx.co/portfolio',
        icon: '🔗',
        isEnabled: true,
      },
    };

    setRecommendedBlock(blockTemplates[goalSelection]);
  }, [goalSelection]);

  // ==========================================
  // MAIN EDITOR STATES
  // ==========================================
  const [activeSubTab, setActiveSubTab] = useState<'store' | 'appearance' | 'analytics' | 'settings'>('store');
  const [previewMode, setPreviewMode] = useState<'mobile' | 'desktop'>('mobile');
  const [publishStatus, setPublishStatus] = useState<'live' | 'draft'>('live');
  const [selectedTheme, setSelectedTheme] = useState<'luxury-dark' | 'warm-cream' | 'glass-glow' | 'coral-sunset'>('luxury-dark');
  
  const [blocks, setBlocks] = useState<StorefrontBlock[]>([
    {
      id: 'block_1',
      type: 'product',
      title: 'Instagram Growth Formula Playbook (eBook)',
      description: 'Step-by-step reels curation framework, comment automations, and audience triggers.',
      price: '₹1,500',
      linkUrl: 'https://openlx.co/creator/playbook',
      icon: '📚',
      isEnabled: true,
    },
    {
      id: 'block_2',
      type: 'booking',
      title: '1:1 Private Partner Audit Call',
      description: 'Review your storefront assets, conversion metrics, and content calendars.',
      price: 'Book',
      linkUrl: 'https://openlx.co/creator/audit',
      icon: '📅',
      isEnabled: true,
    },
  ]);

  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // ==========================================
  // ONBOARDING SIMULATORS
  // ==========================================
  const startSimulatedUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setIsUploaded(true);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  const handlePublishOnboarding = () => {
    // Inject the final selections from onboarding into the actual editor states!
    const finalBlocks = [...blocks];
    if (includePromoBlock) {
      finalBlocks.unshift(recommendedBlock);
    }
    setBlocks(finalBlocks);
    setIsOnboarded(true);
  };

  // ==========================================
  // BLOCK UTILITY MUTATORS
  // ==========================================
  const handleAddBlock = (type: StorefrontBlock['type']) => {
    const blockTemplates: Record<StorefrontBlock['type'], Partial<StorefrontBlock>> = {
      link: { title: 'Join my newsletter list', linkUrl: 'https://mysite.com', icon: '🔗' },
      product: { title: 'Premium Lightroom LUT Presets Pack', description: 'Transform reels grading in 1 click.', price: '₹999', linkUrl: 'https://mysite.com', icon: '🎨' },
      booking: { title: '30-Minute Consultation Strategy Slot', description: 'Instant calendar scheduler.', price: 'Book', linkUrl: 'https://mysite.com', icon: '📅' },
      course: { title: 'Full Stack Creator Masterclass Course', description: '12 video modules from zero to ₹1L/mo.', price: '₹12,499', linkUrl: 'https://mysite.com', icon: '🎓' },
      lead_magnet: { title: 'Download Free PDF Automations Template', description: 'Join newsletter to grab instant download links.', price: 'Free', linkUrl: 'https://mysite.com', icon: '🎁' },
      community: { title: 'Join our Private VIP Discord Circle', description: 'Daily brainstorming chats with high-tier creators.', price: '₹499/mo', linkUrl: 'https://mysite.com', icon: '💬' },
      media: { title: 'Watch: My Content Engine Workflow Video', description: 'Embedded video lesson.', linkUrl: 'https://youtube.com/watch?v=demo', icon: '📹' },
      testimonial: { title: 'The automation triggers saved me 15 hours a week. Storefront setup took under 3 minutes!', authorName: 'Rohan Shah, Creator', icon: '💬' },
      faq: { title: 'What is the refund policy?', faqAnswer: 'We offer full 100% money-back guarantees if completed under 7 days.', icon: '❓' },
    };

    const template = blockTemplates[type];
    const newBlock: StorefrontBlock = {
      id: `block_${Date.now()}`,
      type,
      title: template.title || 'Custom Block',
      description: template.description,
      price: template.price,
      linkUrl: template.linkUrl,
      icon: template.icon || '🔗',
      isEnabled: true,
      mediaUrl: template.mediaUrl,
      authorName: template.authorName,
      faqAnswer: template.faqAnswer,
    };

    setBlocks((prev) => [...prev, newBlock]);
    setIsPickerOpen(false);
  };

  const handleDeleteBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleDuplicateBlock = (id: string) => {
    const targetIdx = blocks.findIndex((b) => b.id === id);
    if (targetIdx === -1) return;
    const duplicated: StorefrontBlock = {
      ...blocks[targetIdx],
      id: `block_${Date.now()}`,
      title: `${blocks[targetIdx].title} (Copy)`,
    };
    setBlocks((prev) => {
      const updated = [...prev];
      updated.splice(targetIdx + 1, 0, duplicated);
      return updated;
    });
  };

  const handleBlockChange = (id: string, field: keyof StorefrontBlock, value: any) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, [field]: value } : b)));
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;
    setBlocks((prev) => {
      const updated = [...prev];
      const temp = updated[index];
      updated[index] = updated[newIndex];
      updated[newIndex] = temp;
      return updated;
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`openlx.co/${username || 'creator'}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const themes = {
    'luxury-dark': {
      bg: 'bg-[#0D0908]',
      textColor: 'text-white',
      mutedText: 'text-neutral-400',
      accentColor: 'text-[#FF6846]',
      accentBg: 'bg-[#FF6846]',
      cardBg: 'bg-white/5 border border-white/5 backdrop-blur-md',
      fontClass: 'font-sans',
      glow: 'shadow-[0_0_50px_rgba(255,104,70,0.03)]',
      phoneBackdrop: 'from-[#ff4d15]/10 to-[#e6005c]/5',
    },
    'warm-cream': {
      bg: 'bg-[#F6F4F0]',
      textColor: 'text-[#171817]',
      mutedText: 'text-[#6F736F]',
      accentColor: 'text-[#FF6846]',
      accentBg: 'bg-[#FF6846]',
      cardBg: 'bg-white border border-[#E8E5DF] shadow-[0_2px_8px_rgba(0,0,0,0.02)]',
      fontClass: 'font-instrument not-italic',
      glow: '',
      phoneBackdrop: 'from-[#FF6846]/5 to-[#E8E5DF]/10',
    },
    'glass-glow': {
      bg: 'bg-gradient-to-br from-[#0c1020] via-[#070b19] to-[#02050b]',
      textColor: 'text-white',
      mutedText: 'text-blue-200/50',
      accentColor: 'text-cyan-400',
      accentBg: 'bg-cyan-400',
      cardBg: 'bg-blue-950/20 border border-blue-400/10 backdrop-blur-lg shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]',
      fontClass: 'font-sans',
      glow: 'shadow-[0_0_50px_rgba(34,211,238,0.05)]',
      phoneBackdrop: 'from-cyan-500/10 to-blue-500/5',
    },
    'coral-sunset': {
      bg: 'bg-gradient-to-br from-[#ff7e5f] to-[#feb47b]',
      textColor: 'text-[#1d1616]',
      mutedText: 'text-[#1d1616]/60',
      accentColor: 'text-[#e75a36]',
      accentBg: 'bg-[#e75a36]',
      cardBg: 'bg-white/75 border border-white/30 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.04)]',
      fontClass: 'font-sans',
      glow: 'shadow-lg',
      phoneBackdrop: 'from-orange-500/15 to-yellow-500/5',
    },
  };

  const theme = themes[selectedTheme] || themes['luxury-dark'];

  // ==========================================
  // RENDER 1: FIRST-TIME ONBOARDING WIZARD
  // ==========================================
  if (!isOnboarded) {
    const isStep1Valid = profile.name.trim().length > 2 && profile.bio.trim().length > 5;
    const isStep2Valid = profile.instagram.trim().length > 1;

    return (
      <div className="flex-1 flex flex-col min-h-screen text-dash-text select-none font-sans pb-16">
        
        {/* Onboarding header with Save & Exit and Step Indicators */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-dash-surface border border-[#E8E5DF] rounded-2xl p-5 mb-6 shadow-sm">
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-dash-accent">First-Time Setup</span>
            <h2 className="text-xl font-extrabold text-dash-text mt-0.5 font-sans tracking-tight">Onboarding Wizard</h2>
          </div>

          {/* Compact step indicators */}
          <div className="flex items-center gap-2 text-xs font-bold text-dash-text-secondary select-none">
            {[1, 2, 3, 4, 5].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                    currentStep === s
                      ? 'bg-dash-sidebar text-white border-dash-sidebar'
                      : currentStep > s
                      ? 'bg-dash-success text-white border-dash-success'
                      : 'bg-dash-bg text-dash-text-tertiary border-[#E8E5DF]'
                  }`}
                >
                  {currentStep > s ? '✓' : s}
                </div>
                {s < 5 && <div className={`w-4 h-0.5 ${currentStep > s ? 'bg-dash-success' : 'bg-[#E8E5DF]'}`} />}
              </div>
            ))}
          </div>

          {/* Skip / Save later */}
          <button
            onClick={() => setIsOnboarded(true)}
            className="px-4 py-2 rounded-full border border-[#E8E5DF] hover:bg-dash-muted transition-colors text-xs font-bold text-dash-text cursor-pointer shrink-0"
          >
            Save & Exit
          </button>
        </div>

        {/* Mobile Preview Toggle Floating Pill */}
        <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30 select-none">
          <button
            onClick={() => setMobileShowPreview(!mobileShowPreview)}
            className="px-6 py-3 rounded-full bg-dash-sidebar text-white text-xs font-extrabold shadow-xl border-none flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            {mobileShowPreview ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
            <span>{mobileShowPreview ? 'Edit Details Form' : 'Show Storefront Preview'}</span>
          </button>
        </div>

        {/* Split screen content layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT SIDE: Viewport-Contained Form Panel */}
          <div className={`lg:col-span-7 flex flex-col gap-6 ${mobileShowPreview ? 'hidden lg:flex' : 'flex'}`}>
            
            <AnimatePresence mode="wait">
              
              {/* STEP 1: IDENTITY */}
              {currentStep === 1 && (
                <motion.div
                  key="step_1"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="flex flex-col gap-5"
                >
                  <Card className="border-[#E8E5DF]">
                    <h3 className="text-base font-extrabold text-dash-text tracking-tight mb-1 font-sans">
                      1. Define Creator Identity
                    </h3>
                    <p className="text-xs text-dash-text-secondary mb-6 leading-relaxed">
                      Initialize your storefront handle, name, and editorial bio.
                    </p>

                    <div className="flex flex-col gap-5">
                      {/* Avatar upload slot */}
                      <div className="flex items-center gap-4 border border-[#E8E5DF] rounded-xl p-4 bg-dash-bg/40">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF6846] to-[#e6005c] p-0.5 flex items-center justify-center shrink-0 shadow-sm relative overflow-hidden">
                          <div className="w-full h-full rounded-full bg-dash-surface flex items-center justify-center font-black text-lg text-dash-text select-none">
                            {isUploaded ? '✓' : profile.avatarText}
                          </div>
                        </div>

                        <div className="flex-1">
                          <span className="text-[10px] uppercase font-bold text-dash-text-tertiary tracking-wider block mb-1">
                            Mock Profile Photo
                          </span>
                          
                          {isUploading ? (
                            <div className="w-full">
                              <div className="flex justify-between items-center text-[10px] text-dash-text-secondary font-bold mb-1">
                                <span>Uploading file...</span>
                                <span>{uploadProgress}%</span>
                              </div>
                              <div className="w-full bg-[#E8E5DF] h-1.5 rounded-full overflow-hidden">
                                <div className="h-full bg-dash-accent transition-all duration-200" style={{ width: `${uploadProgress}%` }} />
                              </div>
                            </div>
                          ) : isUploaded ? (
                            <span className="text-xs font-bold text-dash-success flex items-center gap-1">
                              ✓ Simulated file verified successfully!
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={startSimulatedUpload}
                              className="px-4 py-2 border border-dashed border-[#E8E5DF] hover:border-dash-accent rounded-lg bg-dash-surface text-xs font-bold text-dash-text cursor-pointer transition-colors flex items-center gap-1.5"
                            >
                              <Upload className="w-3.5 h-3.5" />
                              <span>Simulate Photo Upload</span>
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Display name */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-black tracking-wider text-dash-text-secondary">
                          Display Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          placeholder="E.g. @Aishwarya_Sen"
                          className="w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] focus:outline-none focus:border-dash-accent transition-all"
                        />
                        {!profile.name.trim() && (
                          <p className="text-[9px] text-amber-600 flex items-center gap-1 mt-0.5">
                            <AlertCircle className="w-3 h-3" /> Display handle is required.
                          </p>
                        )}
                      </div>

                      {/* Bio */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-black tracking-wider text-dash-text-secondary">
                          Short Bio Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          required
                          rows={3}
                          value={profile.bio}
                          onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                          placeholder="E.g. Creative strategist. Helping brands scale visual reels and monetization trigger automations."
                          className="w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] focus:outline-none focus:border-dash-accent transition-all resize-none leading-relaxed"
                        />
                        {profile.bio.trim().length <= 5 && (
                          <p className="text-[9px] text-amber-600 flex items-center gap-1 mt-0.5">
                            <AlertCircle className="w-3 h-3" /> Bio must be longer than 5 characters.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end mt-8 border-t border-[#E8E5DF] pt-4 select-none">
                      <button
                        onClick={() => setCurrentStep(2)}
                        disabled={!isStep1Valid}
                        className={`px-6 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer border-none flex items-center gap-1 shadow-sm ${
                          isStep1Valid
                            ? 'bg-dash-sidebar text-white hover:bg-neutral-800'
                            : 'bg-[#E8E5DF] text-dash-text-tertiary cursor-not-allowed'
                        }`}
                      >
                        <span>Social profiles</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* STEP 2: SOCIAL PROFILES */}
              {currentStep === 2 && (
                <motion.div
                  key="step_2"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="flex flex-col gap-5"
                >
                  <Card className="border-[#E8E5DF]">
                    <h3 className="text-base font-extrabold text-dash-text tracking-tight mb-1 font-sans">
                      2. Social Profile Links
                    </h3>
                    <p className="text-xs text-dash-text-secondary mb-6 leading-relaxed">
                      Connect public handles to display social badges in your storefront mockup.
                    </p>

                    <div className="flex flex-col gap-4">
                      {/* Instagram */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-black tracking-wider text-dash-text-secondary">
                          Instagram handle <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={profile.instagram}
                          onChange={(e) => setProfile({ ...profile, instagram: e.target.value.replace(/[^a-zA-Z0-9_.]/g, '') })}
                          placeholder="username"
                          className="w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] focus:outline-none focus:border-dash-accent font-mono"
                        />
                      </div>

                      {/* Twitter */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-black tracking-wider text-dash-text-secondary">
                          X (Twitter) handle <span className="text-dash-text-tertiary select-none font-normal lowercase italic">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={profile.twitter}
                          onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                          placeholder="username"
                          className="w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] focus:outline-none focus:border-dash-accent font-mono"
                        />
                      </div>

                      {/* YouTube */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-black tracking-wider text-dash-text-secondary">
                          YouTube channel <span className="text-dash-text-tertiary select-none font-normal lowercase italic">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={profile.youtube}
                          onChange={(e) => setProfile({ ...profile, youtube: e.target.value })}
                          placeholder="E.g. @MyChannel"
                          className="w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] focus:outline-none focus:border-dash-accent"
                        />
                      </div>

                      {/* Website */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] uppercase font-black tracking-wider text-dash-text-secondary">
                          Personal website URL <span className="text-dash-text-tertiary select-none font-normal lowercase italic">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          value={profile.website}
                          onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                          placeholder="www.myblog.com"
                          className="w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] focus:outline-none focus:border-dash-accent font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between mt-8 border-t border-[#E8E5DF] pt-4 select-none">
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="px-5 py-2.5 rounded-full border border-[#E8E5DF] text-xs font-bold text-dash-text hover:bg-dash-muted transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setCurrentStep(3)}
                        disabled={!isStep2Valid}
                        className={`px-6 py-2.5 rounded-full text-xs font-extrabold transition-all cursor-pointer border-none flex items-center gap-1 shadow-sm ${
                          isStep2Valid
                            ? 'bg-dash-sidebar text-white hover:bg-neutral-800'
                            : 'bg-[#E8E5DF] text-dash-text-tertiary cursor-not-allowed'
                        }`}
                      >
                        <span>Business goals</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* STEP 3: BUSINESS GOALS */}
              {currentStep === 3 && (
                <motion.div
                  key="step_3"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="flex flex-col gap-5"
                >
                  <Card className="border-[#E8E5DF]">
                    <h3 className="text-base font-extrabold text-dash-text tracking-tight mb-1 font-sans">
                      3. Select Monetisation Goal
                    </h3>
                    <p className="text-xs text-dash-text-secondary mb-6 leading-relaxed">
                      Choose your core objective. This pre-formats customized storefront widgets on launch.
                    </p>

                    {/* Goal Bento choice list */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Goal 1: Sell Products */}
                      <div
                        onClick={() => setGoalSelection('sell')}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all flex gap-3.5 items-start ${
                          goalSelection === 'sell'
                            ? 'border-[#FF6846] bg-[#FF6846]/5 shadow-sm'
                            : 'border-[#E8E5DF] hover:border-[#DEDAD2] bg-white'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-xs shrink-0 select-none">📚</div>
                        <div>
                          <h4 className="text-xs font-extrabold text-dash-text">Sell Digital Products</h4>
                          <p className="text-[10px] text-dash-text-secondary mt-1 leading-normal">
                            Deliver PDFs, eBooks, filters, presets, assets, and course modules.
                          </p>
                        </div>
                      </div>

                      {/* Goal 2: Collect Leads */}
                      <div
                        onClick={() => setGoalSelection('leads')}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all flex gap-3.5 items-start ${
                          goalSelection === 'leads'
                            ? 'border-[#FF6846] bg-[#FF6846]/5 shadow-sm'
                            : 'border-[#E8E5DF] hover:border-[#DEDAD2] bg-white'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-xs shrink-0 select-none">🎁</div>
                        <div>
                          <h4 className="text-xs font-extrabold text-dash-text">Collect Lead Emails</h4>
                          <p className="text-[10px] text-dash-text-secondary mt-1 leading-normal">
                            Grow newsletters lists and distribute free lead asset links.
                          </p>
                        </div>
                      </div>

                      {/* Goal 3: Offer Bookings */}
                      <div
                        onClick={() => setGoalSelection('bookings')}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all flex gap-3.5 items-start ${
                          goalSelection === 'bookings'
                            ? 'border-[#FF6846] bg-[#FF6846]/5 shadow-sm'
                            : 'border-[#E8E5DF] hover:border-[#DEDAD2] bg-white'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-xs shrink-0 select-none">📅</div>
                        <div>
                          <h4 className="text-xs font-extrabold text-dash-text">Offer Call Bookings</h4>
                          <p className="text-[10px] text-dash-text-secondary mt-1 leading-normal">
                            Schedule mentorship video slots, partnership audits, and coach sessions.
                          </p>
                        </div>
                      </div>

                      {/* Goal 4: Grow community */}
                      <div
                        onClick={() => setGoalSelection('community')}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all flex gap-3.5 items-start ${
                          goalSelection === 'community'
                            ? 'border-[#FF6846] bg-[#FF6846]/5 shadow-sm'
                            : 'border-[#E8E5DF] hover:border-[#DEDAD2] bg-white'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-xs shrink-0 select-none">💬</div>
                        <div>
                          <h4 className="text-xs font-extrabold text-dash-text">Grow Paid Community</h4>
                          <p className="text-[10px] text-dash-text-secondary mt-1 leading-normal">
                            Direct VIP Discord access or premium Telegram circle links.
                          </p>
                        </div>
                      </div>

                    </div>

                    <div className="flex justify-between mt-8 border-t border-[#E8E5DF] pt-4 select-none">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="px-5 py-2.5 rounded-full border border-[#E8E5DF] text-xs font-bold text-dash-text hover:bg-dash-muted transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setCurrentStep(4)}
                        className="px-6 py-2.5 rounded-full bg-dash-sidebar hover:bg-neutral-800 text-white text-xs font-extrabold transition-all shadow-sm border-none flex items-center gap-1 cursor-pointer"
                      >
                        <span>Configure block</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* STEP 4: CONFIGURE RECOMMENDED CONTENT BLOCK */}
              {currentStep === 4 && (
                <motion.div
                  key="step_4"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  className="flex flex-col gap-5"
                >
                  <Card className="border-[#E8E5DF]">
                    <h3 className="text-base font-extrabold text-dash-text tracking-tight mb-1 font-sans">
                      4. Configure Recommended Block
                    </h3>
                    <p className="text-xs text-dash-text-secondary mb-6 leading-relaxed">
                      We have pre-formatted this recommended content block based on your Step 3 goals.
                    </p>

                    {/* Preview configuration */}
                    <div className="flex flex-col gap-4 border border-[#E8E5DF] rounded-xl p-4 bg-dash-bg/40">
                      
                      <div className="flex justify-between items-center mb-1 select-none">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-dash-surface border border-[#E8E5DF] text-dash-text-secondary">
                          <span>{recommendedBlock.icon}</span>
                          <span>Recommended block</span>
                        </span>
                        
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="promoToggle"
                            checked={includePromoBlock}
                            onChange={(e) => setIncludePromoBlock(e.target.checked)}
                            className="w-4 h-4 rounded text-dash-accent focus:ring-dash-accent border-[#E8E5DF] cursor-pointer"
                          />
                          <label htmlFor="promoToggle" className="text-[10px] font-bold text-dash-text-secondary cursor-pointer">
                            Include in mockup
                          </label>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] uppercase font-bold text-dash-text-tertiary">Block Title</label>
                          <input
                            type="text"
                            value={recommendedBlock.title}
                            onChange={(e) => setRecommendedBlock({ ...recommendedBlock, title: e.target.value })}
                            className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-dash-surface border border-[#E8E5DF] focus:outline-none"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[9px] uppercase font-bold text-dash-text-tertiary">Description Details</label>
                          <textarea
                            rows={2}
                            value={recommendedBlock.description}
                            onChange={(e) => setRecommendedBlock({ ...recommendedBlock, description: e.target.value })}
                            className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-dash-surface border border-[#E8E5DF] focus:outline-none resize-none"
                          />
                        </div>

                        {recommendedBlock.price && (
                          <div className="flex flex-col gap-1">
                            <label className="text-[9px] uppercase font-bold text-dash-text-tertiary">Display Price / Badge</label>
                            <input
                              type="text"
                              value={recommendedBlock.price}
                              onChange={(e) => setRecommendedBlock({ ...recommendedBlock, price: e.target.value })}
                              className="w-1/3 px-3 py-2 text-xs font-mono font-bold rounded-lg bg-dash-surface border border-[#E8E5DF] focus:outline-none"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between mt-8 border-t border-[#E8E5DF] pt-4 select-none">
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="px-5 py-2.5 rounded-full border border-[#E8E5DF] text-xs font-bold text-dash-text hover:bg-dash-muted transition-colors cursor-pointer"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setCurrentStep(5)}
                        className="px-6 py-2.5 rounded-full bg-dash-sidebar hover:bg-neutral-800 text-white text-xs font-extrabold transition-all shadow-sm border-none flex items-center gap-1 cursor-pointer"
                      >
                        <span>Publish store</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* STEP 5: PUBLISH & CELEBRATE */}
              {currentStep === 5 && (
                <motion.div
                  key="step_5"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col gap-5"
                >
                  <Card className="border-[#E8E5DF] text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-dash-success/10 text-dash-success flex items-center justify-center mx-auto mb-4 animate-bounce">
                      <Trophy className="w-8 h-8 text-dash-success" />
                    </div>
                    
                    <h3 className="text-xl font-extrabold text-dash-text tracking-tight font-sans">
                      Your storefront is ready!
                    </h3>
                    <p className="text-xs text-dash-text-secondary mt-1 max-w-sm mx-auto leading-relaxed">
                      Congratulations! Your Open LX storefront has been successfully initialized and published inside sandbox profiles.
                    </p>

                    <div className="my-6 p-4 rounded-xl border border-dash-success/20 bg-dash-success/5 max-w-md mx-auto">
                      <span className="text-[8px] uppercase font-extrabold tracking-wider text-dash-text-tertiary select-none block">Public Store Slug</span>
                      <strong className="text-sm font-bold text-dash-text select-all block mt-1">openlx.co/{username || 'creator'}</strong>
                      
                      <div className="flex gap-2 justify-center mt-3">
                        <button
                          onClick={handleCopyLink}
                          className="px-4 py-2 bg-dash-sidebar text-white text-xs font-bold rounded-lg hover:bg-neutral-800 shadow-sm transition-all cursor-pointer border-none"
                        >
                          {copiedLink ? 'Copied URL!' : 'Copy Storefront Link'}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-center mt-8 border-t border-[#E8E5DF] pt-5 select-none">
                      <button
                        onClick={handlePublishOnboarding}
                        className="px-8 py-3 rounded-full bg-dash-accent hover:bg-dash-accent-hover text-white text-xs font-extrabold shadow-md shadow-orange-500/15 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer border-none"
                      >
                        <Sparkles className="w-4 h-4 text-white" />
                        <span>Enter Creator Studio Dashboard</span>
                      </button>
                    </div>
                  </Card>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* RIGHT SIDE: Sticky Smartphone Mockup Preview */}
          <div className={`lg:col-span-5 sticky top-24 w-full flex justify-center items-center ${mobileShowPreview ? 'flex' : 'hidden lg:flex'}`}>
            
            <div className="w-[280px] h-[550px] bg-black rounded-[46px] p-3 border-[6px] border-neutral-800 shadow-[-15px_15px_40px_rgba(0,0,0,0.1),_0_0_50px_rgba(255,104,70,0.03)] relative overflow-hidden flex flex-col select-none">
              {/* Reflections */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded-[38px] z-20" />

              {/* Dynamic Island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-black rounded-full z-30 flex items-center justify-between px-3">
                <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
                <div className="w-2.5 h-1.5 bg-neutral-900 rounded-full" />
              </div>

              {/* Screen content */}
              <div className={`w-full h-full ${theme.bg} rounded-[38px] overflow-hidden flex flex-col pt-8 p-3.5 relative text-left scrollbar-thin select-none ${theme.textColor} ${theme.fontClass} ${theme.glow}`}>
                {/* Background neon glows */}
                <div className="absolute top-[-30px] left-[-30px] w-36 h-36 bg-orange-600/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute bottom-[-30px] right-[-30px] w-36 h-36 bg-pink-600/10 rounded-full blur-2xl pointer-events-none" />

                {/* Profile Header card */}
                <div className="flex flex-col items-center text-center mt-2 mb-4 relative z-10">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF6846] to-[#e6005c] p-0.5 shadow-lg mb-2 flex items-center justify-center shrink-0">
                    <div className={`w-full h-full rounded-full ${theme.bg} flex items-center justify-center font-black text-sm uppercase tracking-wider`}>
                      {profile.avatarText || 'CD'}
                    </div>
                  </div>
                  <h3 className="text-xs font-bold tracking-tight">{profile.name || '@your_handle'}</h3>
                  <p className={`text-[9px] mt-0.5 font-bold ${theme.accentColor}`}>openlx.co/{username || 'username'}</p>
                  <p className={`text-[9px] mt-2 px-3 leading-relaxed font-light ${theme.mutedText} min-h-[25px]`}>
                    {profile.bio || 'Your brand tagline appears here...'}
                  </p>

                  {/* Social pills */}
                  <div className="flex gap-2.5 mt-3 justify-center items-center select-none">
                    {profile.instagram && <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] bg-white/5 border border-white/5">📸</span>}
                    {profile.twitter && <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] bg-white/5 border border-white/5">🐦</span>}
                    {profile.linkedin && <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] bg-white/5 border border-white/5">💼</span>}
                    {profile.website && <span className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] bg-white/5 border border-white/5">🌐</span>}
                  </div>
                </div>

                {/* Storefront blocks view */}
                <div className="flex flex-col gap-2 relative z-10 flex-1 overflow-y-auto pr-0.5 scrollbar-thin">
                  {/* Recommended Promo Block (renders in step 3 and 4) */}
                  {currentStep >= 3 && includePromoBlock && (
                    <div className={`rounded-xl p-2.5 border ${theme.cardBg} flex justify-between items-center bg-white/10 hover:scale-[1.01] transition-all`}>
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-xs shrink-0 select-none">
                          {recommendedBlock.icon}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[9px] font-bold truncate leading-tight">{recommendedBlock.title}</h4>
                          {recommendedBlock.description && (
                            <p className={`text-[8px] truncate leading-normal mt-0.5 font-light ${theme.mutedText}`}>
                              {recommendedBlock.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/5 shrink-0 bg-white/5`}>
                        {recommendedBlock.price || 'Go'}
                      </span>
                    </div>
                  )}

                  {/* Standard initial blocks */}
                  {blocks.map((block) => (
                    <div
                      key={block.id}
                      className={`rounded-xl p-2.5 border ${theme.cardBg} flex justify-between items-center opacity-70`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-xs shrink-0 select-none">
                          {block.icon}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-[9px] font-bold truncate leading-tight">{block.title}</h4>
                        </div>
                      </div>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/5 shrink-0 bg-white/5`}>
                        {block.price || 'Go'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Footer seal */}
                <div className="mt-4 pt-1 flex items-center justify-center gap-1 opacity-30 select-none shrink-0 bg-transparent">
                  <span className="text-[7px] tracking-widest uppercase font-extrabold text-white">Powered by Open LX</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  }

  // ==========================================
  // RENDER 2: THE COMPLETED SHOPIFY-LIKE EDITOR
  // ==========================================
  return (
    <div className="flex-1 flex flex-col h-full select-none text-dash-text font-sans pb-10">
      
      {/* A. TOPBAR DECK */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-dash-surface border border-[#E8E5DF] rounded-2xl p-4 mb-6 shadow-sm">
        
        {/* Navigation tabs */}
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setActiveSubTab('store')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'store'
                ? 'bg-dash-sidebar text-white'
                : 'text-dash-text-secondary hover:text-dash-text hover:bg-dash-muted'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Store Blocks</span>
          </button>
          <button
            onClick={() => setActiveSubTab('appearance')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'appearance'
                ? 'bg-dash-sidebar text-white'
                : 'text-dash-text-secondary hover:text-dash-text hover:bg-dash-muted'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Appearance Theme</span>
          </button>
          <button
            onClick={() => setActiveSubTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'analytics'
                ? 'bg-dash-sidebar text-white'
                : 'text-dash-text-secondary hover:text-dash-text hover:bg-dash-muted'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Block Clicks</span>
          </button>
          <button
            onClick={() => setActiveSubTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'settings'
                ? 'bg-dash-sidebar text-white'
                : 'text-dash-text-secondary hover:text-dash-text hover:bg-dash-muted'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>SEO Settings</span>
          </button>
        </div>

        {/* Action Controls & Devices */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          
          {/* Device Swapper */}
          <div className="bg-dash-muted rounded-xl p-1 flex items-center gap-1 border border-[#E8E5DF]">
            <button
              onClick={() => setPreviewMode('mobile')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer border-none flex items-center justify-center ${
                previewMode === 'mobile' ? 'bg-dash-surface text-dash-text shadow-sm' : 'text-dash-text-tertiary hover:text-dash-text'
              }`}
              title="Mobile Mockup"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPreviewMode('desktop')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer border-none flex items-center justify-center ${
                previewMode === 'desktop' ? 'bg-dash-surface text-dash-text shadow-sm' : 'text-dash-text-tertiary hover:text-dash-text'
              }`}
              title="Desktop Mockup"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>

          <div className="h-6 w-px bg-[#E8E5DF] hidden sm:block" />

          {/* Status Indicator */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPublishStatus(publishStatus === 'live' ? 'draft' : 'live');
                alert(publishStatus === 'live' ? 'Storefront hidden. Currently set to Draft.' : 'Storefront publish live successfully!');
              }}
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-sm border border-[#E8E5DF] transition-all ${
                publishStatus === 'live' ? 'bg-dash-success/15 text-dash-success border-dash-success/30' : 'bg-dash-text-tertiary/10 text-dash-text-secondary'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${publishStatus === 'live' ? 'bg-dash-success animate-pulse' : 'bg-dash-text-tertiary'}`} />
              <span>{publishStatus === 'live' ? 'Live' : 'Draft'}</span>
            </button>
          </div>

          {/* Share trigger */}
          <button
            onClick={() => setIsShareOpen(true)}
            className="p-2.5 rounded-full bg-dash-sidebar text-white hover:bg-neutral-800 transition-colors shadow-md cursor-pointer border-none flex items-center justify-center"
            title="Share storefront"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* B. SPLIT CONTENT WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start relative">
        
        {/* LEFT COLUMN: EDITABLE CONTROLS & BLOCKS (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6 md:gap-8">

          {activeSubTab === 'store' && (
            <>
              {/* Profile Inline Editor */}
              <Card className="border-[#E8E5DF]">
                <div className="flex items-center gap-2 text-dash-accent mb-4 border-b border-[#E8E5DF] pb-3 select-none">
                  <Globe className="w-4.5 h-4.5" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Branding Header Editor</h3>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#FF6846] to-[#e6005c] p-0.5 flex items-center justify-center shrink-0 shadow-md">
                      <div className="w-full h-full rounded-full bg-dash-surface flex items-center justify-center text-lg font-black text-dash-text select-none">
                        {profile.avatarText}
                      </div>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[9px] uppercase font-bold text-dash-text-tertiary">Avatar Initials</label>
                        <input
                          type="text"
                          maxLength={2}
                          value={profile.avatarText}
                          onChange={(e) => setProfile({ ...profile, avatarText: e.target.value.toUpperCase() })}
                          className="w-full mt-1 px-3 py-2 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] focus:outline-none focus:border-dash-accent transition-all"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] uppercase font-bold text-dash-text-tertiary">Profile Name</label>
                        <input
                          type="text"
                          value={profile.name}
                          onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                          className="w-full mt-1 px-3 py-2 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] focus:outline-none focus:border-dash-accent transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] uppercase font-bold text-dash-text-tertiary">Bio / Headline Description</label>
                    <textarea
                      rows={2}
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] focus:outline-none focus:border-dash-accent transition-all resize-none leading-relaxed"
                      placeholder="Bio description..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-bold text-dash-text-tertiary">Instagram Handle</label>
                      <input
                        type="text"
                        value={profile.instagram}
                        onChange={(e) => setProfile({ ...profile, instagram: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] focus:outline-none focus:border-dash-accent"
                        placeholder="username"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[9px] uppercase font-bold text-dash-text-tertiary">Twitter Handle</label>
                      <input
                        type="text"
                        value={profile.twitter}
                        onChange={(e) => setProfile({ ...profile, twitter: e.target.value })}
                        className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] focus:outline-none focus:border-dash-accent"
                        placeholder="username"
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Blocks Stack Header */}
              <div className="flex justify-between items-center px-1">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-dash-text-secondary select-none">
                    Storefront Content Blocks
                  </h3>
                  <p className="text-[10px] text-dash-text-tertiary select-none">Configure active storefront bento layout cards.</p>
                </div>
                <button
                  onClick={() => setIsPickerOpen(true)}
                  className="px-4 py-2.5 rounded-full bg-dash-accent hover:bg-dash-accent-hover text-white text-xs font-extrabold shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer border-none"
                >
                  <Plus className="w-4 h-4 text-white" />
                  <span>Add Block</span>
                </button>
              </div>

              {/* Blocks Stack Card Items */}
              <div className="flex flex-col gap-4">
                <AnimatePresence initial={false}>
                  {blocks.map((block, idx) => (
                    <motion.div
                      key={block.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="w-full"
                    >
                      <div className="bg-dash-surface border border-[#E8E5DF] hover:border-[#DEDAD2] rounded-2xl p-5 shadow-sm hover:shadow-[0_4px_16px_rgba(0,0,0,0.015)] transition-all flex items-start gap-4">
                        
                        {/* Drag Reorder handles */}
                        <div className="flex flex-col items-center gap-1.5 text-dash-text-tertiary select-none shrink-0 pt-2">
                          <button
                            onClick={() => handleMoveBlock(idx, 'up')}
                            disabled={idx === 0}
                            className={`p-1 rounded hover:bg-dash-muted cursor-pointer transition-colors border-none flex items-center justify-center ${
                              idx === 0 ? 'opacity-30 pointer-events-none' : ''
                            }`}
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-[9px] font-bold font-mono text-dash-text-tertiary">{idx + 1}</span>
                          <button
                            onClick={() => handleMoveBlock(idx, 'down')}
                            disabled={idx === blocks.length - 1}
                            className={`p-1 rounded hover:bg-dash-muted cursor-pointer transition-colors border-none flex items-center justify-center ${
                              idx === blocks.length - 1 ? 'opacity-30 pointer-events-none' : ''
                            }`}
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Block Form editors */}
                        <div className="flex-1 flex flex-col gap-3">
                          <div className="flex justify-between items-center select-none">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-dash-bg border border-[#E8E5DF] text-dash-text-secondary">
                              <span>{block.icon}</span>
                              <span>{block.type.replace('_', ' ')}</span>
                            </span>

                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleBlockChange(block.id, 'isEnabled', !block.isEnabled)}
                                className={`text-[10px] font-bold cursor-pointer transition-all border-none bg-transparent ${
                                  block.isEnabled ? 'text-[#FF6846] hover:text-[#d45638]' : 'text-dash-text-tertiary hover:text-dash-text'
                                }`}
                              >
                                {block.isEnabled ? 'Active' : 'Hidden'}
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2.5">
                            <input
                              type="text"
                              value={block.title}
                              onChange={(e) => handleBlockChange(block.id, 'title', e.target.value)}
                              className="w-full px-3 py-2 text-xs font-bold rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent transition-all"
                            />

                            {block.type !== 'link' && block.type !== 'testimonial' && block.type !== 'media' && (
                              <textarea
                                rows={2}
                                value={block.description || ''}
                                onChange={(e) => handleBlockChange(block.id, 'description', e.target.value)}
                                className="w-full px-3 py-2 text-xs font-medium rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent transition-all resize-none leading-relaxed"
                              />
                            )}

                            {block.type === 'testimonial' && (
                              <input
                                type="text"
                                value={block.authorName || ''}
                                onChange={(e) => handleBlockChange(block.id, 'authorName', e.target.value)}
                                className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent"
                                placeholder="Review Author name"
                              />
                            )}

                            {block.type === 'faq' && (
                              <textarea
                                rows={2}
                                value={block.faqAnswer || ''}
                                onChange={(e) => handleBlockChange(block.id, 'faqAnswer', e.target.value)}
                                className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent resize-none"
                              />
                            )}

                            {(block.type === 'product' || block.type === 'course' || block.type === 'booking' || block.type === 'lead_magnet' || block.type === 'community') && (
                              <div className="grid grid-cols-3 gap-2.5">
                                <div className="col-span-1">
                                  <input
                                    type="text"
                                    value={block.price || ''}
                                    onChange={(e) => handleBlockChange(block.id, 'price', e.target.value)}
                                    className="w-full px-3 py-2 text-xs font-mono font-bold rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent"
                                  />
                                </div>
                                <div className="col-span-2">
                                  <input
                                    type="text"
                                    value={block.linkUrl || ''}
                                    onChange={(e) => handleBlockChange(block.id, 'linkUrl', e.target.value)}
                                    className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent"
                                  />
                                </div>
                              </div>
                            )}

                            {(block.type === 'link' || block.type === 'media') && (
                              <input
                                type="text"
                                value={block.linkUrl || ''}
                                onChange={(e) => handleBlockChange(block.id, 'linkUrl', e.target.value)}
                                className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent"
                              />
                            )}
                          </div>

                          <div className="flex justify-end items-center gap-2 mt-2 border-t border-[#E8E5DF] pt-3.5 select-none">
                            <button
                              onClick={() => handleDuplicateBlock(block.id)}
                              className="p-1.5 rounded-lg hover:bg-dash-muted text-dash-text-secondary hover:text-dash-text transition-colors cursor-pointer border-none flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteBlock(block.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/10 text-neutral-400 hover:text-red-500 transition-colors cursor-pointer border-none flex items-center justify-center"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                        </div>

                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {blocks.length === 0 && (
                  <Card className="flex flex-col items-center justify-center p-12 text-center border-dashed border-[#E8E5DF]">
                    <Layers className="w-10 h-10 text-dash-text-tertiary mb-3 animate-pulse" />
                    <h4 className="text-sm font-bold text-dash-text tracking-tight">Your storefront is empty</h4>
                  </Card>
                )}
              </div>
            </>
          )}

          {activeSubTab === 'appearance' && (
            <Card className="border-[#E8E5DF] select-none">
              <div className="flex items-center gap-2 text-dash-accent mb-6 border-b border-[#E8E5DF] pb-4">
                <Palette className="w-5 h-5 text-dash-accent" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-dash-text-secondary">
                  Appearance Themes & Branding
                </h3>
              </div>

              <div className="flex flex-col gap-6">
                <div>
                  <h4 className="text-xs font-bold text-dash-text uppercase tracking-wider mb-3">Theme Presets</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      onClick={() => setSelectedTheme('luxury-dark')}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col gap-2.5 ${
                        selectedTheme === 'luxury-dark' ? 'border-[#FF6846] bg-neutral-950/20' : 'border-[#E8E5DF] bg-white'
                      }`}
                    >
                      <div className="h-14 rounded-lg bg-[#0D0908]" />
                      <span className="text-xs font-bold text-dash-text">Luxury Dark</span>
                    </div>
                    <div
                      onClick={() => setSelectedTheme('warm-cream')}
                      className={`cursor-pointer rounded-2xl p-4 border transition-all flex flex-col gap-2.5 ${
                        selectedTheme === 'warm-cream' ? 'border-[#FF6846] bg-neutral-950/20' : 'border-[#E8E5DF] bg-white'
                      }`}
                    >
                      <div className="h-14 rounded-lg bg-[#F6F4F0]" />
                      <span className="text-xs font-bold text-dash-text">Warm Cream</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeSubTab === 'analytics' && (
            <Card className="border-[#E8E5DF] select-none">
              <div className="flex items-center gap-2 text-dash-accent mb-6 border-b border-[#E8E5DF] pb-4">
                <BarChart3 className="w-5 h-5 text-dash-accent" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-dash-text-secondary">
                  Content Blocks click logs
                </h3>
              </div>
              {/* clicks */}
            </Card>
          )}

          {activeSubTab === 'settings' && (
            <Card className="border-[#E8E5DF] select-none">
              <div className="flex items-center gap-2 text-dash-accent mb-6 border-b border-[#E8E5DF] pb-4">
                <Settings className="w-5 h-5 text-dash-accent" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-dash-text-secondary">
                  SEO & Custom Slug details
                </h3>
              </div>
            </Card>
          )}

        </div>

        {/* RIGHT COLUMN MOCKUP */}
        <div className="lg:col-span-5 sticky top-24 w-full flex justify-center items-center">
          <div className="w-[280px] h-[550px] bg-black rounded-[46px] p-3 border-[6px] border-neutral-800 shadow-2xl relative overflow-hidden flex flex-col select-none">
            <div className={`w-full h-full ${theme.bg} rounded-[38px] overflow-hidden flex flex-col pt-8 p-3.5 relative text-left scrollbar-thin select-none ${theme.textColor} ${theme.fontClass} ${theme.glow}`}>
              <div className="flex flex-col items-center text-center mt-2 mb-4 relative z-10">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#FF6846] to-[#e6005c] p-0.5 shadow-lg mb-2 flex items-center justify-center shrink-0">
                  <div className={`w-full h-full rounded-full ${theme.bg} flex items-center justify-center font-black text-sm uppercase tracking-wider`}>
                    {profile.avatarText}
                  </div>
                </div>
                <h3 className="text-xs font-bold tracking-tight">{profile.name}</h3>
                <p className={`text-[9px] mt-0.5 font-bold ${theme.accentColor}`}>openlx.co/{username || 'username'}</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* BLOCK PICKER DRAWER */}
      <AnimatePresence>
        {isPickerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPickerOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-dash-bg p-6 flex flex-col justify-between border-l border-[#E8E5DF]"
            >
              <div className="flex justify-between items-center w-full border-b border-[#E8E5DF] pb-4">
                <h3 className="font-extrabold text-base tracking-tight">Block Templates</h3>
                <button onClick={() => setIsPickerOpen(false)} className="p-1 rounded bg-dash-muted">X</button>
              </div>
              <div className="flex flex-col gap-3 overflow-y-auto py-4">
                <button onClick={() => handleAddBlock('product')} className="p-3 text-left border rounded-xl hover:border-dash-accent">📚 Add Product</button>
                <button onClick={() => handleAddBlock('booking')} className="p-3 text-left border rounded-xl hover:border-dash-accent">📅 Add Booking</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* SHARE DRAWER */}
      <AnimatePresence>
        {isShareOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm cursor-pointer"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 inset-x-0 z-50 w-full max-w-lg mx-auto bg-dash-bg rounded-t-3xl border-t border-[#E8E5DF] p-6 shadow-2xl flex flex-col gap-4"
            >
              <div className="flex justify-between items-center w-full border-b border-[#E8E5DF] pb-3">
                <h3 className="font-extrabold text-sm uppercase tracking-wider">Share storefront profile</h3>
                <button onClick={() => setIsShareOpen(false)} className="p-1 rounded">X</button>
              </div>
              <div className="flex justify-between items-center p-3 bg-dash-surface border border-[#E8E5DF] rounded-xl">
                <span className="text-xs font-bold">openlx.co/{username || 'creator'}</span>
                <button onClick={handleCopyLink} className="px-4 py-2 bg-dash-sidebar text-white rounded-lg text-xs font-bold">{copiedLink ? 'Copied' : 'Copy link'}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
