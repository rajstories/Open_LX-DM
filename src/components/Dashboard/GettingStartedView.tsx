import { useState } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Zap,
  BookOpen,
  ArrowRight,
  Plus,
  AlertCircle,
  Play
} from 'lucide-react';
import { Card, MetricCard, PhonePreview, Banner, ProgressTracker } from './DashboardPrimitives';

interface GettingStartedViewProps {
  username: string;
}

interface StorefrontItem {
  id: string;
  title: string;
  type: 'product' | 'booking' | 'link';
  price?: string;
  icon: string;
}

export default function GettingStartedView({ username }: GettingStartedViewProps) {
  const [bio, setBio] = useState('Digital Creator, Strategist, and Entrepreneur. Helping you scale.');
  const [storefrontItems, setStorefrontItems] = useState<StorefrontItem[]>([
    { id: '1', title: '1:1 Discovery Call', type: 'booking', price: 'Book', icon: '📅' },
    { id: '2', title: 'Instagram Growth Formula (PDF)', type: 'product', price: '$19', icon: '📚' },
  ]);
  const [autoDMToggle, setAutoDMToggle] = useState(false);
  const [kycDismissed, setKycDismissed] = useState(false);

  // Quick Action: Add a digital product
  const handleAddProduct = () => {
    const newProduct: StorefrontItem = {
      id: `prod_${Date.now()}`,
      title: 'Premium LUTs & Presets Pack',
      type: 'product',
      price: '$35',
      icon: '🎨',
    };
    setStorefrontItems((prev) => [...prev, newProduct]);
    alert('🎨 Product "Premium LUTs & Presets Pack" added to your storefront preview!');
  };

  // Quick Action: Add a custom booking
  const handleAddBooking = () => {
    const newBooking: StorefrontItem = {
      id: `book_${Date.now()}`,
      title: 'Brand Partnership Audit',
      type: 'booking',
      price: '$120',
      icon: '💼',
    };
    setStorefrontItems((prev) => [...prev, newBooking]);
    alert('💼 Booking service "Brand Partnership Audit" added to your storefront preview!');
  };

  // Quick Action: Add custom link
  const handleAddLink = () => {
    const newLink: StorefrontItem = {
      id: `link_${Date.now()}`,
      title: 'Join my Discord Community',
      type: 'link',
      price: 'Free',
      icon: '💬',
    };
    setStorefrontItems((prev) => [...prev, newLink]);
    alert('💬 Social link "Join my Discord Community" added to your storefront preview!');
  };

  // Steps for ProgressTracker
  const steps = [
    {
      id: 'step1',
      title: 'Setup Custom Subdomain & Bio',
      description: 'Your storefront is hosted at openlx.dm/' + (username || 'username') + '. Customise your description below.',
      isCompleted: bio.length > 10,
    },
    {
      id: 'step2',
      title: 'Publish First Digital Product',
      description: 'List templates, courses, assets or PDF playbooks for your audience to buy.',
      isCompleted: storefrontItems.some((item) => item.type === 'product'),
      onClick: handleAddProduct,
    },
    {
      id: 'step3',
      title: 'Configure Auto DM Automation',
      description: 'Automatically send files or custom links when someone comments on your Instagram posts.',
      isCompleted: autoDMToggle,
      onClick: () => setAutoDMToggle(!autoDMToggle),
    },
  ];

  return (
    <div className="flex flex-col gap-6 md:gap-8 select-none">
      
      {/* 1. Welcoming Hero & Headline */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-dash-text font-sans tracking-tight">
            Welcome back, <span className="font-instrument italic font-light text-dash-accent">{username || 'Creator'}</span>
          </h1>
          <p className="text-sm text-dash-text-secondary mt-1 font-medium leading-relaxed">
            Here is your live cockpit. Complete steps to launch your storefront and start earning.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-dash-text-secondary bg-[#E8E5DF]/40 border border-[#E8E5DF] rounded-full px-4 py-2 shrink-0 shadow-sm select-all">
          <span className="text-[#FF6846] select-none">●</span> openlx.dm/{username || 'creator'}
        </div>
      </div>

      {/* 2. KYC Alerts (Conditional banner) */}
      {!kycDismissed && (
        <Banner
          title="KYC Profile Pending Verification"
          description="Your payouts are held temporarily until your identity verification is approved. Verify now to enable instant bank transfers."
          actionText="Complete KYC"
          onAction={() => alert('KYC registration wizard initiated.')}
          type="warning"
          onDismiss={() => setKycDismissed(true)}
        />
      )}

      {/* 3. Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <MetricCard
          title="Storefront Analytics"
          value="₹48,250.00"
          change="+14.2%"
          changeType="positive"
          icon={<ShoppingBag className="w-5 h-5 text-dash-accent" />}
        />
        <MetricCard
          title="Auto DM Conversions"
          value="84.5%"
          progress={84.5}
          icon={<Zap className="w-5 h-5 text-amber-500" />}
        />
        <MetricCard
          title="KyC Verification"
          value="Pending"
          change="Verification required"
          changeType="neutral"
          icon={<AlertCircle className="w-5 h-5 text-[#FF6846]" />}
        />
      </div>

      {/* 4. Split Layout: Interactive Bento Controls (Left) vs Live Mobile Mockup (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        
        {/* Bento Board Controls (Left 2 columns) */}
        <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
          
          {/* Progress Roadmap Tracker */}
          <ProgressTracker title="Your Launch Roadmap" steps={steps} />

          {/* Quick Actions Bento Box */}
          <div className="flex flex-col gap-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-dash-text-secondary px-1">
              Storefront Setup Bento Board
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Dynamic Bio Customizer Card */}
              <Card className="flex flex-col justify-between min-h-[170px]">
                <div>
                  <div className="flex items-center gap-2 text-dash-accent mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Profile Editor</span>
                  </div>
                  <h4 className="text-sm font-bold text-dash-text tracking-tight">Customise your bio</h4>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full mt-3 px-3 py-2 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent transition-all"
                    placeholder="E.g. Creative director & coach..."
                  />
                </div>
                <div className="mt-4 text-[10px] text-dash-text-secondary leading-normal">
                  Type custom bio above to update the phone preview instantly.
                </div>
              </Card>

              {/* Add Storefront Items Bento */}
              <Card className="flex flex-col justify-between min-h-[170px]">
                <div>
                  <div className="flex items-center gap-2 text-dash-accent mb-2">
                    <Plus className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Storefront Items</span>
                  </div>
                  <h4 className="text-sm font-bold text-dash-text tracking-tight">Add new storefront contents</h4>
                  <div className="flex flex-wrap gap-2 mt-3.5">
                    <button
                      onClick={handleAddProduct}
                      className="px-3 py-2 rounded-lg bg-dash-bg hover:bg-dash-muted border border-[#E8E5DF] text-xs font-bold text-dash-text flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <span>📚 Add Product</span>
                    </button>
                    <button
                      onClick={handleAddBooking}
                      className="px-3 py-2 rounded-lg bg-dash-bg hover:bg-dash-muted border border-[#E8E5DF] text-xs font-bold text-dash-text flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <span>📅 Add Booking</span>
                    </button>
                    <button
                      onClick={handleAddLink}
                      className="px-3 py-2 rounded-lg bg-dash-bg hover:bg-dash-muted border border-[#E8E5DF] text-xs font-bold text-dash-text flex items-center gap-1.5 cursor-pointer transition-all"
                    >
                      <span>💬 Add Social Link</span>
                    </button>
                  </div>
                </div>
                <div className="mt-4 text-[10px] text-dash-text-secondary leading-normal">
                  Items appear in glass capsules inside the mockup.
                </div>
              </Card>

              {/* AutoDM Trigger Activator */}
              <Card className="flex flex-col justify-between min-h-[170px] md:col-span-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-amber-500 mb-2">
                      <Zap className="w-4 h-4" />
                      <span className="text-[10px] uppercase font-bold tracking-widest">Automation Engine</span>
                    </div>
                    <h4 className="text-sm font-bold text-dash-text tracking-tight">Setup Automations (Auto DM)</h4>
                    <p className="text-xs text-dash-text-secondary mt-1 leading-relaxed">
                      Configure your DM triggers. Whenever an user comments "START" or "BUY" on your Instagram posts, we send them storefront link instantly.
                    </p>
                  </div>
                  
                  {/* Custom active toggle button */}
                  <button
                    onClick={() => {
                      setAutoDMToggle(!autoDMToggle);
                      alert(autoDMToggle ? 'Instagram automation paused' : 'Instagram automation activated successfully!');
                    }}
                    className={`px-5 py-2.5 rounded-full font-bold text-xs cursor-pointer shadow-sm transition-all border-none shrink-0 ${
                      autoDMToggle
                        ? 'bg-dash-success text-white hover:opacity-95'
                        : 'bg-dash-accent text-white hover:bg-dash-accent-hover'
                    }`}
                  >
                    {autoDMToggle ? 'Active (Pause)' : 'Activate Triggers'}
                  </button>
                </div>

                <div className="mt-4 pt-3.5 border-t border-[#E8E5DF] flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-[10px] text-dash-text-secondary">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${autoDMToggle ? 'bg-dash-success animate-pulse' : 'bg-dash-text-tertiary'}`} />
                    <span>Trigger keyword: <strong className="text-dash-text select-all">"BUY"</strong> or <strong className="text-dash-text select-all">"OPEN"</strong></span>
                  </div>
                  <div>
                    Status: <strong className={autoDMToggle ? 'text-dash-success' : 'text-neutral-500'}>{autoDMToggle ? 'Running' : 'Paused'}</strong>
                  </div>
                </div>
              </Card>

            </div>
          </div>

        </div>

        {/* Live Smartphone Mockup Preview (Right column) */}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-dash-text-secondary px-1">
            Live Preview Mockup
          </h3>
          <PhonePreview username={username} bio={bio} items={storefrontItems} />
        </div>

      </div>

      {/* 5. Recommended Learning Video Section */}
      <div className="flex flex-col gap-4 mt-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-dash-text-secondary px-1">
          Explore Learning Series
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <Card className="flex gap-4 p-5 hover:border-dash-accent/30 transition-all select-none">
            <div className="w-24 h-24 md:w-32 md:h-24 bg-neutral-900 rounded-xl relative overflow-hidden flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
              <Play className="w-10 h-10 text-[#FF6846] opacity-80 fill-[#FF6846]" />
              <span className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-white tracking-widest select-none">
                12:40
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-dash-accent uppercase tracking-widest">Creator Series</span>
                <h4 className="text-sm font-bold text-dash-text tracking-tight mt-1 leading-snug">
                  Grow Your Instagram Profile & Automate Comments
                </h4>
                <p className="text-xs text-dash-text-secondary mt-1 line-clamp-2 leading-relaxed">
                  Learn best practices to format reels, hook viewers, and trigger the Auto DM engine to convert views to actual buyers.
                </p>
              </div>
              <button
                onClick={() => alert('Playing video: "Grow your Instagram Profile & Automate Comments"')}
                className="mt-3 text-xs font-bold text-dash-accent hover:text-dash-accent-hover transition-colors flex items-center gap-1 cursor-pointer border-none bg-transparent self-start"
              >
                <span>Watch Tutorial</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>

          <Card className="flex gap-4 p-5 hover:border-dash-accent/30 transition-all select-none">
            <div className="w-24 h-24 md:w-32 md:h-24 bg-neutral-900 rounded-xl relative overflow-hidden flex items-center justify-center shrink-0 border border-white/5 shadow-inner">
              <BookOpen className="w-10 h-10 text-[#FF6846] opacity-80" />
              <span className="absolute bottom-2 right-2 bg-black/80 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold text-white tracking-widest select-none">
                10 mins
              </span>
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[9px] font-bold text-dash-accent uppercase tracking-widest">Strategy Playbook</span>
                <h4 className="text-sm font-bold text-dash-text tracking-tight mt-1 leading-snug">
                  Making your first ₹10,000 online using Openlx DM
                </h4>
                <p className="text-xs text-dash-text-secondary mt-1 line-clamp-2 leading-relaxed">
                  A comprehensive breakdown on naming products, setting accurate prices, and structuring custom storefront links.
                </p>
              </div>
              <button
                onClick={() => alert('Opening strategy playbook: "Making your first ₹10,000 online"')}
                className="mt-3 text-xs font-bold text-dash-accent hover:text-dash-accent-hover transition-colors flex items-center gap-1 cursor-pointer border-none bg-transparent self-start"
              >
                <span>Read Playbook</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>

        </div>
      </div>

    </div>
  );
}
