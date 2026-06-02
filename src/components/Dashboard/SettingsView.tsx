import { useState } from 'react';
import { Settings, Save, Globe, ShieldAlert } from 'lucide-react';
import { Card } from './DashboardPrimitives';

interface SettingsViewProps {
  username: string;
}

export default function SettingsView({ username }: SettingsViewProps) {
  const [subdomain, setSubdomain] = useState(username || 'creator');
  const [currency, setCurrency] = useState('INR');
  const [notifications, setNotifications] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('🎉 Workspace settings saved successfully!');
  };

  return (
    <div className="flex flex-col gap-6 select-none">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-dash-text font-sans tracking-tight">Platform Settings</h2>
        <p className="text-xs text-dash-text-secondary mt-1 font-medium leading-relaxed">
          Configure storefront branding colors, workspace custom domain slugs, and notification webhooks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
        
        {/* Left Card: Core Workspace Config (2 columns) */}
        <Card className="lg:col-span-2 border-[#E8E5DF]">
          <div className="flex items-center gap-2 text-dash-accent mb-6 border-b border-[#E8E5DF] pb-4">
            <Settings className="w-5 h-5 text-dash-accent" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-dash-text-secondary">
              Workspace Configuration
            </h3>
          </div>

          <form onSubmit={handleSave} className="flex flex-col gap-5">
            
            {/* Custom domain / slug */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase font-bold tracking-wider text-dash-text-secondary">
                Creator Page Subdomain
              </label>
              <div className="flex rounded-xl border border-[#E8E5DF] overflow-hidden focus-within:border-dash-accent transition-all bg-dash-bg/40">
                <span className="bg-[#E8E5DF]/50 px-4 py-3 text-dash-text-secondary text-xs font-semibold select-none flex items-center border-r border-[#E8E5DF]">
                  openlx.dm/
                </span>
                <input
                  type="text"
                  required
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase())}
                  className="w-full px-4 py-3 text-xs font-semibold focus:outline-none border-none bg-transparent"
                />
              </div>
              <p className="text-[9px] text-dash-text-tertiary">Changes your storefront link. Old slugs will redirect automatically.</p>
            </div>

            {/* Currency settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-dash-text-secondary">
                  Default Display Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-3 text-xs font-semibold rounded-lg bg-dash-bg border border-[#E8E5DF] text-dash-text focus:outline-none focus:border-dash-accent transition-all"
                >
                  <option value="INR">INR (₹) - Rupee</option>
                  <option value="USD">USD ($) - Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                  <option value="GBP">GBP (£) - Pound</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 justify-center pt-5">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="notifToggle"
                    checked={notifications}
                    onChange={(e) => setNotifications(e.target.checked)}
                    className="w-4 h-4 rounded text-dash-accent focus:ring-dash-accent border-[#E8E5DF] cursor-pointer"
                  />
                  <label htmlFor="notifToggle" className="text-xs font-semibold text-dash-text-secondary cursor-pointer select-none">
                    Email notification on every sale
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-full bg-dash-sidebar text-white text-xs font-bold hover:bg-neutral-800 transition-colors shadow-sm cursor-pointer border-none flex items-center justify-center gap-1.5 self-end mt-4"
            >
              <Save className="w-4 h-4 text-white" />
              <span>Save Changes</span>
            </button>

          </form>
        </Card>

        {/* Right Info: Privacy & Settings Checklist (1 column) */}
        <div className="lg:col-span-1 flex flex-col gap-5">
          
          <Card className="border-[#E8E5DF] bg-dash-surface flex flex-col gap-4">
            <div className="flex items-center gap-2 text-dash-accent">
              <Globe className="w-4.5 h-4.5" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-dash-text-secondary">Custom Domain</h4>
            </div>
            <p className="text-xs text-dash-text-secondary leading-relaxed">
              Connect your personalized top-level domain (e.g. <code className="text-dash-text font-bold">julia.com</code>) to display your Openlx DM storefront page.
            </p>
            <button
              onClick={() => alert('Custom Domain linking wizard is a Pro feature.')}
              className="text-xs font-bold text-dash-accent hover:underline border-none bg-transparent cursor-pointer self-start"
            >
              Configure Custom Domain →
            </button>
          </Card>

          <Card className="border-[#E8E5DF] bg-dash-surface flex flex-col gap-4">
            <div className="flex items-center gap-2 text-red-500">
              <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-dash-text-secondary text-red-500">
                Danger Zone
              </h4>
            </div>
            <p className="text-xs text-dash-text-secondary leading-relaxed">
              Permanently delete your workspace files, storefront links, and associated customer statements. This cannot be undone.
            </p>
            <button
              onClick={() => alert('Account deletion blocked in sandbox.')}
              className="px-4 py-2 border border-red-200 hover:bg-red-500/10 text-xs font-bold text-red-500 rounded-lg transition-colors cursor-pointer self-start"
            >
              Delete Account
            </button>
          </Card>

        </div>

      </div>

    </div>
  );
}
