import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  ShoppingBag,
  Zap,
  BarChart3,
  Settings,
  ShieldCheck,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  Sparkles,
  User,
  BookOpen,
  Compass
} from 'lucide-react';
import Logo from '../Logo';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
  badge?: string;
}

function SidebarItem({ icon, label, active, collapsed, onClick, badge }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer border-none relative ${
        active
          ? 'bg-[#FF6846] text-white'
          : 'text-neutral-400 hover:text-white hover:bg-[#252724]'
      }`}
    >
      <div className="shrink-0 flex items-center justify-center w-5 h-5">{icon}</div>
      {!collapsed && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="flex-1 text-left truncate font-sans"
        >
          {label}
        </motion.span>
      )}
      {!collapsed && badge && (
        <span className="bg-[#FF6846]/25 text-[#FF6846] text-[9px] font-bold px-2 py-0.5 rounded-full select-none">
          {badge}
        </span>
      )}
      {active && !collapsed && (
        <motion.div
          layoutId="sidebarActiveIndicator"
          className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full"
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        />
      )}
    </button>
  );
}

interface DashboardShellProps {
  username: string;
  onLogout: () => void;
  children: React.ReactNode;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function DashboardShell({
  username,
  onLogout,
  children,
  currentTab,
  setCurrentTab,
}: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Home Dashboard', icon: <Home className="w-4.5 h-4.5" /> },
    { id: 'storefront', label: 'Storefront Products', icon: <ShoppingBag className="w-4.5 h-4.5" /> },
    { id: 'autodm', label: 'Auto DM Automations', icon: <Zap className="w-4.5 h-4.5" />, badge: 'New' },
    { id: 'analytics', label: 'Audience & Sales', icon: <BarChart3 className="w-4.5 h-4.5" /> },
    { id: 'kyc', label: 'KYC & Payments', icon: <ShieldCheck className="w-4.5 h-4.5" /> },
    { id: 'academy', label: 'Creator Academy', icon: <BookOpen className="w-4.5 h-4.5" /> },
    { id: 'explore_apps', label: 'Explore Apps', icon: <Compass className="w-4.5 h-4.5" /> },
    { id: 'settings', label: 'Platform Settings', icon: <Settings className="w-4.5 h-4.5" /> },
  ];

  const handleTabClick = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileOpen(false);
  };

  return (
    <div className="h-screen w-full bg-dash-bg text-dash-text font-sans flex select-none overflow-hidden">
      
      {/* 1. DESKTOP SIDEBAR (collapsible) */}
      <aside
        className={`hidden md:flex flex-col justify-between bg-dash-sidebar text-white transition-all duration-300 border-r border-[#252724] shrink-0 h-screen sticky top-0 z-30 ${
          collapsed ? 'w-20 p-3' : 'w-[240px] p-5'
        }`}
      >
        {/* Top brand */}
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center gap-2.5 px-2">
              <Logo variant={collapsed ? 'symbol' : 'full'} />
            </div>
            
            {/* Collapse toggle button */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg hover:bg-[#252724] text-neutral-400 hover:text-white transition-colors cursor-pointer border-none flex items-center justify-center"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1.5">
            {menuItems.map((item) => (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={currentTab === item.id}
                collapsed={collapsed}
                onClick={() => handleTabClick(item.id)}
                badge={item.badge}
              />
            ))}
          </nav>
        </div>

        {/* Bottom profile info & logout */}
        <div className="flex flex-col gap-4 border-t border-[#252724] pt-4">
          <div className={`flex items-center gap-3 px-2 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6846] to-[#e6005c] p-0.5 flex items-center justify-center shrink-0">
              <div className="w-full h-full rounded-full bg-dash-sidebar flex items-center justify-center text-xs font-bold text-white uppercase">
                {username ? username.slice(0, 2) : 'JD'}
              </div>
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <h5 className="text-xs font-bold truncate tracking-tight text-white leading-normal">
                  {username || 'creator'}
                </h5>
                <p className="text-[10px] text-neutral-400 truncate leading-normal">
                  openlx.dm/{username || 'creator'}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onLogout}
            className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer border-none ${
              collapsed ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* 2. MOBILE DRAWER SYSTEM */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black md:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-[260px] bg-dash-sidebar text-white p-5 flex flex-col justify-between border-r border-[#252724] md:hidden"
            >
              <div className="flex flex-col gap-8">
                <div className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2.5">
                    <Logo variant="full" />
                  </div>
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-[#252724] text-neutral-400 hover:text-white transition-colors cursor-pointer border-none flex items-center justify-center"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="flex flex-col gap-1.5">
                  {menuItems.map((item) => (
                    <SidebarItem
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      active={currentTab === item.id}
                      collapsed={false}
                      onClick={() => handleTabClick(item.id)}
                      badge={item.badge}
                    />
                  ))}
                </nav>
              </div>

              <div className="flex flex-col gap-4 border-t border-[#252724] pt-4">
                <div className="flex items-center gap-3 px-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6846] to-[#e6005c] p-0.5 flex items-center justify-center shrink-0">
                    <div className="w-full h-full rounded-full bg-dash-sidebar flex items-center justify-center text-xs font-bold text-white uppercase">
                      {username ? username.slice(0, 2) : 'JD'}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h5 className="text-xs font-bold truncate text-white leading-normal">
                      {username || 'creator'}
                    </h5>
                    <p className="text-[10px] text-neutral-400 truncate leading-normal">
                      openlx.dm/{username || 'creator'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={onLogout}
                  className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-xs font-semibold text-neutral-400 hover:text-white hover:bg-red-500/10 hover:text-red-400 transition-all cursor-pointer border-none"
                >
                  <LogOut className="w-4.5 h-4.5 shrink-0" />
                  <span>Log Out</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. CORE CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        
        {/* Sticky Topbar */}
        <header className="sticky top-0 z-20 w-full bg-dash-bg/85 backdrop-blur-md border-b border-[#E8E5DF] px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="p-2 rounded-lg hover:bg-dash-muted text-dash-text md:hidden cursor-pointer border-none flex items-center justify-center"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumb / Title */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-dash-text-tertiary select-none uppercase tracking-wider">Creator Studio</span>
              <span className="text-xs text-dash-text-tertiary select-none font-light">/</span>
              <span className="text-xs font-bold text-dash-text capitalize tracking-wide">
                {menuItems.find((i) => i.id === currentTab)?.label || 'Console'}
              </span>
            </div>
          </div>

          {/* Quick Actions (Upgrade to Pro, Notifications, Profile) */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6846]/10 to-[#e6005c]/10 text-[#FF6846] text-xs font-bold hover:from-[#FF6846]/15 hover:to-[#e6005c]/15 transition-all border border-[#FF6846]/20 cursor-pointer shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-[#FF6846]" />
              <span>Upgrade to Pro</span>
            </button>

            <button className="relative p-2.5 rounded-full hover:bg-dash-muted text-dash-text-secondary hover:text-dash-text transition-all cursor-pointer border-none flex items-center justify-center">
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#FF6846] rounded-full ring-2 ring-dash-bg animate-pulse" />
            </button>

            <div className="h-5 w-px bg-[#E8E5DF]" />

            <div className="flex items-center gap-2.5 pl-1.5">
              <div className="w-8 h-8 rounded-full bg-dash-muted flex items-center justify-center text-dash-text border border-[#E8E5DF]">
                <User className="w-4 h-4" />
              </div>
            </div>
          </div>
        </header>

        {/* Main View Area */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full flex flex-col gap-6 md:gap-8">
          {children}
        </main>
      </div>
    </div>
  );
}
