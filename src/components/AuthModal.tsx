import { useState, useEffect } from 'react';
import { Globe, Eye, EyeOff, LogIn, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
  onSuccess?: (username?: string) => void;
}

export default function AuthModal({ isOpen, onClose, initialMode = 'signin', onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Sync mode with initialMode prop when modal opens
  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setShowPassword(false);
      setEmail('');
      setUsername('');
      setPassword('');
      setAgreeTerms(false);
    }
  }, [isOpen, initialMode]);

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signup' && !agreeTerms) {
      alert('Please agree to the Terms of Service & Privacy Policy.');
      return;
    }
    
    const resolvedUsername = mode === 'signup' ? username : email.split('@')[0];
    if (mode === 'signin') {
      alert(`Welcome back! Logging in as: ${email}`);
    } else {
      alert(`Profile created successfully! Your custom link: openlx.dm/${username}`);
    }
    
    onClose();
    if (onSuccess) {
      onSuccess(resolvedUsername);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex bg-black overflow-y-auto md:overflow-hidden select-none font-sans"
        >
          {/* Main Container */}
          <div className="w-full min-h-screen flex flex-col md:flex-row relative">
            
            {/* Global close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-40 w-10 h-10 rounded-full flex items-center justify-center bg-black/5 hover:bg-neutral-100 md:bg-white/5 md:hover:bg-white/10 text-neutral-500 md:text-white/60 hover:text-black md:hover:text-white transition-all cursor-pointer border-none"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* LEFT COLUMN: Redesigned with $100M Premium Startup Style */}
            <div className="hidden md:flex md:w-[45%] lg:w-[50%] bg-[#0D0908] text-white flex-col justify-between p-12 relative overflow-hidden select-none border-r border-white/5">
              
              {/* Radial Ambient Glow Lights */}
              <div className="absolute top-[10%] left-[5%] w-[450px] h-[450px] bg-orange-600/10 rounded-full blur-[110px] animate-pulse-glow pointer-events-none" />
              <div className="absolute bottom-[10%] right-[5%] w-[400px] h-[400px] bg-pink-600/5 rounded-full blur-[120px] pointer-events-none" />
              
              {/* Creator Tagline */}
              <div className="relative z-10 text-white/50 text-xs tracking-wider uppercase font-semibold select-text">
                The ultimate hub for creators
              </div>

              {/* Title & 3D Perspective Floating Smartphone Mockup */}
              <div className="my-auto flex flex-col items-center justify-center relative z-10 w-full pt-8">
                <h2 className="text-white font-sans tracking-[-0.05em] leading-[0.95] font-black text-[clamp(44px,5.5vw,68px)] text-center mb-12 select-text">
                  Scale your <br />
                  influence
                </h2>

                {/* 3D Perspective Tilted Floating Smartphone Container */}
                <div className="perspective-1000 preserve-3d w-full flex justify-center items-center">
                  <div className="preserve-3d animate-float-tilt w-[280px] h-[555px] bg-black rounded-[46px] p-3 border-[6px] border-neutral-800 shadow-[-30px_30px_60px_-15px_rgba(0,0,0,0.85),_0_0_80px_rgba(255,87,34,0.15)] relative">
                    
                    {/* Diagonal glass reflection mask */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none rounded-[38px] z-20" />

                    {/* Smartphone Dynamic Island */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5.5 bg-black rounded-full z-30 flex items-center justify-between px-3">
                      <div className="w-1.5 h-1.5 bg-neutral-900 rounded-full" />
                      <div className="w-2.5 h-1.5 bg-neutral-900 rounded-full" />
                    </div>

                    {/* Phone screen container */}
                    <div className="w-full h-full bg-[#0a0504] rounded-[38px] overflow-hidden flex flex-col pt-8 p-3.5 relative text-left select-none">
                      
                      {/* Subtle inner background lights */}
                      <div className="absolute top-[-30px] left-[-30px] w-36 h-36 bg-orange-600/10 rounded-full blur-2xl pointer-events-none" />
                      <div className="absolute bottom-[-30px] right-[-30px] w-36 h-36 bg-pink-600/10 rounded-full blur-2xl pointer-events-none" />

                      {/* Mock profile card */}
                      <div className="flex flex-col items-center text-center mt-2.5 mb-3.5 relative z-10">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#ff4d15] to-[#e6005c] p-0.5 shadow-lg mb-2">
                          <div className="w-full h-full rounded-full bg-neutral-900 flex items-center justify-center text-white font-bold text-base">
                            JD
                          </div>
                        </div>
                        <h3 className="text-white text-xs font-bold tracking-tight">Julia Dev</h3>
                        <p className="text-[#ff5722] text-[9px] mt-0.5 font-semibold">openlx.dm/julia</p>
                      </div>

                      {/* Analytics Box */}
                      <div className="liquid-glass rounded-2xl p-3 mb-3.5 bg-white/5 border border-white/5 relative z-10">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[8px] text-white/50 uppercase tracking-widest font-bold">Monthly Revenue</span>
                          <span className="text-[11px] text-[#ff5722] font-black">$3,420.00</span>
                        </div>
                        {/* CSS-based Bar Chart */}
                        <div className="flex gap-1.5 items-end justify-between h-9 pt-1 px-0.5">
                          <div className="w-2 bg-white/10 rounded-t-sm h-[35%]" />
                          <div className="w-2 bg-white/10 rounded-t-sm h-[55%]" />
                          <div className="w-2 bg-white/20 rounded-t-sm h-[30%]" />
                          <div className="w-2 bg-white/20 rounded-t-sm h-[70%]" />
                          <div className="w-2 bg-gradient-to-t from-[#ff4d15] to-[#e6005c] rounded-t-sm h-[90%]" />
                          <div className="w-2 bg-gradient-to-t from-[#ff4d15] to-[#e6005c] rounded-t-sm h-[80%]" />
                          <div className="w-2 bg-white/30 rounded-t-sm h-[45%]" />
                        </div>
                      </div>

                      {/* Creator Page Products */}
                      <div className="flex flex-col gap-2 relative z-10 flex-1 overflow-y-auto pr-0.5">
                        {/* Product 1 */}
                        <div className="liquid-glass rounded-xl p-2.5 bg-white/5 border border-white/5 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center text-xs">
                              📚
                            </div>
                            <div>
                              <h4 className="text-[9px] text-white font-medium">Creator Playbook (PDF)</h4>
                              <p className="text-[8px] text-white/40">Step-by-step monetization</p>
                            </div>
                          </div>
                          <span className="text-[9px] text-white/80 font-bold">$19</span>
                        </div>

                        {/* Product 2 */}
                        <div className="liquid-glass rounded-xl p-2.5 bg-white/5 border border-white/5 flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-pink-500/10 flex items-center justify-center text-xs">
                              📅
                            </div>
                            <div>
                              <h4 className="text-[9px] text-white font-medium">1:1 Strategy (30m)</h4>
                              <p className="text-[8px] text-white/40">Private consultation call</p>
                            </div>
                          </div>
                          <span className="text-[9px] text-white/80 font-bold">Book</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom tag decoration */}
              <div className="relative z-10 flex items-center gap-2 text-[10px] text-white/30 select-none">
                <Globe className="w-4 h-4 text-white/20 animate-spin-slow" />
                <span>Global Creator Infrastructure v2.4</span>
              </div>
            </div>

            {/* RIGHT COLUMN: Pure White Forms with Curvatures */}
            <div className="w-full md:w-[55%] lg:w-[50%] bg-white text-black p-8 md:p-12 lg:p-16 flex flex-col justify-between rounded-t-3xl md:rounded-t-none md:rounded-l-[40px] lg:rounded-l-[60px] relative z-10 shadow-[-15px_0_50px_rgba(0,0,0,0.15)] min-h-screen">
              
              {/* Header: Branding on Left, State Toggle on Right */}
              <header className="flex justify-between items-center w-full mb-8">
                <div className="flex items-center gap-2 cursor-pointer" onClick={onClose}>
                  <Logo light={false} />
                </div>
                
                {/* Auth Mode Toggle Link */}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
                  className="flex items-center gap-1.5 text-xs md:text-sm text-neutral-500 hover:text-black transition-colors font-medium border-none bg-transparent cursor-pointer font-sans"
                >
                  <User className="w-4 h-4 text-neutral-400" />
                  {mode === 'signin' ? (
                    <>
                      Don't have an account? <span className="text-[#ff4d15] font-semibold underline ml-1 font-sans">Sign Up</span>
                    </>
                  ) : (
                    <>
                      Already have an account? <span className="text-[#ff4d15] font-semibold underline ml-1 font-sans">Sign In</span>
                    </>
                  )}
                </button>
              </header>

              {/* Form Area */}
              <main className="max-w-md w-full mx-auto my-auto py-8">
                <h1 className="text-4xl lg:text-5xl font-bold font-sans tracking-tight mb-8 text-neutral-900">
                  {mode === 'signin' ? 'Sign In' : 'Sign Up'}
                </h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  {/* Email Input */}
                  <div className="flex flex-col gap-1.5">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={mode === 'signin' ? 'Email or Username' : 'Email Address'}
                      className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-[#ff4d15] focus:ring-1 focus:ring-[#ff4d15]/20 focus:outline-none text-sm transition-all font-sans"
                    />
                  </div>

                  {/* Slug / Username Input (Only for Sign Up) */}
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col gap-1.5"
                    >
                      <div className="flex rounded-xl border border-neutral-200 overflow-hidden focus-within:border-[#ff4d15] focus-within:ring-1 focus-within:ring-[#ff4d15]/20 transition-all">
                        <span className="bg-neutral-50 px-4 py-4 text-neutral-400 text-sm flex items-center border-r border-neutral-200 select-none font-semibold font-sans">
                          openlx.dm/
                        </span>
                        <input
                          type="text"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))}
                          placeholder="username"
                          className="w-full px-4 py-4 focus:outline-none text-sm border-none bg-transparent font-sans"
                        />
                      </div>
                      <p className="text-[10px] text-neutral-400 px-1 font-sans">This will be your custom link-in-bio URL.</p>
                    </motion.div>
                  )}

                  {/* Password Input */}
                  <div className="flex flex-col gap-1.5 relative w-full">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-5 py-4 rounded-xl border border-neutral-200 focus:border-[#ff4d15] focus:ring-1 focus:ring-[#ff4d15]/20 focus:outline-none text-sm transition-all pr-12 font-sans"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black border-none bg-transparent cursor-pointer flex items-center justify-center p-1"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Forgot Password Link (Only for Sign In) */}
                  {mode === 'signin' && (
                    <a
                      href="#"
                      onClick={(e) => e.preventDefault()}
                      className="text-xs font-semibold text-[#ff4d15] hover:text-[#d33a12] transition-colors self-start ml-1 font-sans"
                    >
                      Forgot password?
                    </a>
                  )}

                  {/* Terms & Conditions (Only for Sign Up) */}
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-start gap-2.5 px-1 mt-1 font-sans"
                    >
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-1 w-4 h-4 rounded text-[#ff4d15] focus:ring-[#ff4d15] border-neutral-300 cursor-pointer"
                      />
                      <label htmlFor="terms" className="text-xs text-neutral-500 leading-normal cursor-pointer select-none font-sans">
                        I agree to the <a href="#" className="text-neutral-800 underline font-medium hover:text-[#ff4d15]">Terms of Service</a> and <a href="#" className="text-neutral-800 underline font-medium hover:text-[#ff4d15]">Privacy Policy</a>.
                      </label>
                    </motion.div>
                  )}

                  {/* Submit Button (Gradient orange/red) */}
                  <button
                    type="submit"
                    className="w-full py-4 mt-4 rounded-full bg-gradient-to-r from-[#ff4d15] to-[#e6005c] hover:opacity-95 text-white font-semibold text-sm shadow-md shadow-orange-500/10 hover:shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer border-none font-sans"
                  >
                    <span>{mode === 'signin' ? 'Sign In' : 'Create Profile'}</span>
                    <LogIn className="w-4.5 h-4.5" />
                  </button>
                </form>
              </main>

              {/* Footer */}
              <footer className="flex justify-between items-center text-[10px] text-neutral-400 mt-8 pt-4 border-t border-neutral-100 w-full select-none font-sans">
                <div>© 2006-2026 Openlx DM Inc.</div>
                <div className="flex gap-4 items-center">
                  <a href="#" className="hover:text-black transition-colors font-medium">Contact Us</a>
                  <div className="flex items-center gap-1 cursor-pointer hover:text-black transition-colors">
                    <span>English</span>
                    <span className="text-[8px]">▼</span>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
