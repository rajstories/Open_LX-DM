interface LogoProps {
  variant?: 'symbol' | 'full';
  className?: string;
  light?: boolean; // If true, renders "Open" in white/off-white. If false, renders in deep charcoal.
}

export default function Logo({ variant = 'full', className = '', light = true }: LogoProps) {
  // Brand color palette based on psychology
  // Coral Orange: #FF6846 (Creativity, energy, conversion)
  // Deep Charcoal: #0E0E10 (Premium, professional, stable)
  // Off-White: #F6F4F0 (Clarity, openness)
  
  const textPrimaryColor = light ? 'text-white' : 'text-[#0E0E10]';

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      
      {/* 1. GEOMETRIC INTERLOCKING O-L-X SYMBOL */}
      <svg
        className="w-7 h-7 shrink-0 transition-transform duration-300 hover:scale-105"
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Open LX Symbol"
      >
        {/* Hexagonal glowing base/shadow */}
        <defs>
          <linearGradient id="coralGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FF6846" />
            <stop offset="100%" stopColor="#E6005C" />
          </linearGradient>
        </defs>

        {/* The interlocking Hexagon (representing O, L, X) */}
        {/* Drawn precisely to match the logo image's sharp angled segments and dynamic cuts */}
        <path
          d="M 38 18 
             L 74 38 
             L 74 54 
             L 38 34 
             L 38 82 
             L 74 102 
             L 74 86 
             L 38 66 
             L 38 52
             L 74 72
             L 74 74"
          stroke="url(#coralGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Interlocking dynamic 'X' legs */}
        <path
          d="M 74 42 
             L 102 18 
             M 74 62 
             L 102 86 
             M 102 86
             L 86 102"
          stroke="url(#coralGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* 2. PREMIUM WORDMARK (Only if variant is 'full') */}
      {variant === 'full' && (
        <span className="flex items-center font-sans tracking-tight text-lg font-extrabold select-text">
          <span className={`${textPrimaryColor} transition-colors duration-300`}>Open</span>
          <span className="text-[#FF6846] ml-1.5 transition-colors duration-300">LX</span>
        </span>
      )}
    </div>
  );
}
