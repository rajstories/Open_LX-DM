import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function FeaturedVideoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section className="bg-black pt-6 md:pt-10 pb-20 md:pb-32 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.9 }}
          className="relative rounded-3xl overflow-hidden aspect-video w-full bg-neutral-900 border border-white/5"
        >
          {/* Background Video */}
          <video
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260402_054547_9875cfc5-155a-4229-8ec8-b7ba7125cbf8.mp4"
            className="w-full h-full object-cover"
            muted
            autoPlay
            loop
            playsInline
            preload="auto"
          />

          {/* Gradient overlay on video */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

          {/* Bottom overlay content */}
          <div className="absolute inset-x-0 bottom-0 p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6 z-10">
            {/* Left Card */}
            <div className="liquid-glass rounded-2xl p-6 md:p-8 max-w-md">
              <div className="text-white/50 text-xs tracking-widest uppercase mb-3 font-semibold">
                Our Approach
              </div>
              <p className="text-white text-sm md:text-base leading-relaxed font-light">
                We empower creators to turn their influence into a thriving business. Customize your page, display premium content, and connect directly with your supporters.
              </p>
            </div>

            {/* Right Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="liquid-glass rounded-full px-8 py-3 text-white text-sm font-medium cursor-pointer hover:bg-white/5 transition-colors border-none shrink-0"
            >
              Explore more
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
