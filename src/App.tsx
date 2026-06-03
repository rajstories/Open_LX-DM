import { useEffect, useRef, useState } from 'react';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

// Import our modular subcomponents
import AboutSection from './components/AboutSection';
import FeaturedVideoSection from './components/FeaturedVideoSection';
import PhilosophySection from './components/PhilosophySection';
import ServicesSection from './components/ServicesSection';
import AuthModal from './components/AuthModal';
import Logo from './components/Logo';

// Import our Dashboard subcomponents
import DashboardShell from './components/Dashboard/DashboardShell';
import GettingStartedView from './components/Dashboard/GettingStartedView';
import StorefrontView from './components/Dashboard/StorefrontView';
import AutoDMView from './components/Dashboard/AutoDMView';
import AnalyticsView from './components/Dashboard/AnalyticsView';
import KYCView from './components/Dashboard/KYCView';
import SettingsView from './components/Dashboard/SettingsView';
import AcademyView from './components/Dashboard/AcademyView';
import ExploreAppsView from './components/Dashboard/ExploreAppsView';

export default function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isFading = useRef(false);
  const fadeTarget = useRef<number | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const hasTriggeredFadeOut = useRef(false);
  
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [currentTab, setCurrentTab] = useState('home');

  // JS requestAnimationFrame based loop fade logic (no CSS transitions)
  const fadeVideo = (to: number, duration: number, callback?: () => void) => {
    const video = videoRef.current;
    if (!video) return;

    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }

    const startOpacity = parseFloat(video.style.opacity || '0');
    const startTime = performance.now();
    isFading.current = true;
    fadeTarget.current = to;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentOpacity = startOpacity + (to - startOpacity) * progress;

      if (videoRef.current) {
        videoRef.current.style.opacity = currentOpacity.toString();
      }

      if (progress < 1) {
        animationFrameId.current = requestAnimationFrame(animate);
      } else {
        isFading.current = false;
        fadeTarget.current = null;
        animationFrameId.current = null;
        if (callback) callback();
      }
    };

    animationFrameId.current = requestAnimationFrame(animate);
  };

  const handleCanPlay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch((err) => console.log('Autoplay blocked initially:', err));
    if (parseFloat(video.style.opacity || '0') < 1 && fadeTarget.current !== 1) {
      fadeVideo(1, 500);
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const remaining = video.duration - video.currentTime;
    if (remaining <= 0.55 && !hasTriggeredFadeOut.current && video.duration > 0) {
      hasTriggeredFadeOut.current = true;
      fadeVideo(0, 500);
    }
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;

    video.style.opacity = '0';
    setTimeout(() => {
      video.currentTime = 0;
      video.play()
        .then(() => {
          hasTriggeredFadeOut.current = false;
          fadeVideo(1, 500);
        })
        .catch((err) => {
          console.log('Loop play failed:', err);
          hasTriggeredFadeOut.current = false;
          fadeVideo(1, 500);
        });
    }, 100);
  };

  useEffect(() => {
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);
  if (isAuthenticated) {
    return (
      <DashboardShell
        username={username}
        onLogout={() => {
          setIsAuthenticated(false);
          setCurrentTab('home');
        }}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      >
        {currentTab === 'home' && <GettingStartedView username={username} />}
        {currentTab === 'storefront' && <StorefrontView username={username} />}
        {currentTab === 'autodm' && <AutoDMView />}
        {currentTab === 'analytics' && <AnalyticsView />}
        {currentTab === 'kyc' && <KYCView />}
        {currentTab === 'academy' && <AcademyView />}
        {currentTab === 'explore_apps' && <ExploreAppsView />}
        {currentTab === 'settings' && <SettingsView username={username} />}
      </DashboardShell>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen w-full relative flex flex-col font-sans select-none overflow-x-hidden">
      
      {/* SECTION 1 -- HERO (full-viewport) */}
      <header className="min-h-screen relative flex flex-col overflow-hidden bg-black w-full">
        {/* Background video */}
        <video
          ref={videoRef}
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_074625_a81f018a-956b-43fb-9aee-4d1508e30e6a.mp4"
          className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none"
          style={{ opacity: 0 }}
          muted
          autoPlay
          playsInline
          preload="auto"
          onCanPlay={handleCanPlay}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />

        {/* Navbar */}
        <nav className="relative z-20 px-6 py-6 w-full mt-4">
          <div className="liquid-glass rounded-full max-w-5xl mx-auto px-6 py-3 flex justify-between items-center bg-white/5 backdrop-blur-md">
            {/* Left brand & Nav links */}
            <div className="flex items-center">
              <Logo />
              {/* Nav links (hidden on mobile) */}
              <div className="hidden md:flex items-center gap-8 ml-8">
                <a href="#features" className="text-white/85 hover:text-white text-sm font-medium transition-colors">
                  Features
                </a>
                <a href="#pricing" className="text-white/85 hover:text-white text-sm font-medium transition-colors">
                  Pricing
                </a>
                <a href="#about" className="text-white/85 hover:text-white text-sm font-medium transition-colors">
                  About
                </a>
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => { setAuthMode('signup'); setIsAuthOpen(true); }}
                className="text-white hover:text-white/85 text-sm font-medium cursor-pointer transition-colors border-none bg-transparent"
              >
                Sign Up
              </button>
              <button
                onClick={() => { setAuthMode('signin'); setIsAuthOpen(true); }}
                className="liquid-glass rounded-full px-6 py-2 text-white text-sm font-medium cursor-pointer hover:bg-white/5 transition-all"
              >
                Login
              </button>
            </div>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center -translate-y-[8%] md:-translate-y-[12%] max-w-5xl mx-auto">
          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="text-6xl md:text-8xl lg:text-9xl text-white tracking-tight whitespace-nowrap font-instrument font-light select-text leading-none"
          >
            Monetize Your <em className="italic font-instrument not-italic font-light">Audience</em>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-white/85 text-sm md:text-base leading-relaxed px-4 max-w-xl mt-8 font-light"
          >
            Build your storefront, automate engagement, sell products and services, and grow your creator business from one platform.
          </motion.p>

          {/* Manifesto button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-8"
          >
            <button
              onClick={() => { setAuthMode('signup'); setIsAuthOpen(true); }}
              className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium cursor-pointer hover:bg-white/5 transition-all"
            >
              Create Your Profile
            </button>
          </motion.div>
        </div>

        {/* Social icons footer */}
        <footer className="relative z-10 flex justify-center gap-4 pb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white cursor-pointer hover:bg-white/5 transition-all"
            aria-label="Instagram"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white cursor-pointer hover:bg-white/5 transition-all"
            aria-label="Twitter"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
            </svg>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="liquid-glass rounded-full p-4 text-white/80 hover:text-white cursor-pointer hover:bg-white/5 transition-all"
            aria-label="Globe Website"
          >
            <Globe className="w-5 h-5" />
          </motion.button>
        </footer>
      </header>

      {/* SECTION 2 -- ABOUT SECTION */}
      <div id="about">
        <AboutSection />
      </div>

      {/* SECTION 3 -- FEATURED VIDEO */}
      <FeaturedVideoSection />

      {/* SECTION 4 -- PHILOSOPHY */}
      <PhilosophySection />

      {/* SECTION 5 -- SERVICES */}
      <div id="features">
        <ServicesSection />
      </div>

      {/* Auth Modal Overlay */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
        onSuccess={(resolvedUsername) => {
          setUsername(resolvedUsername || 'Creator');
          setIsAuthenticated(true);
        }}
      />
    </div>
  );
}
