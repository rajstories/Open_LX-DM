import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function PhilosophySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section className="bg-black py-28 md:py-40 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto" ref={containerRef}>
        {/* Animated Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl text-white tracking-tight mb-16 md:mb-24 font-light"
        >
          Influence{' '}
          <span className="font-instrument italic text-white/40 lowercase mx-1">x</span>{' '}
          Revenue
        </motion.h2>

        {/* Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Left: Video */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="rounded-3xl overflow-hidden aspect-[4/3] bg-neutral-900 border border-white/5 w-full"
          >
            <video
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260307_083826_e938b29f-a43a-41ec-a153-3d4730578ab8.mp4"
              className="w-full h-full object-cover"
              muted
              autoPlay
              loop
              playsInline
              preload="auto"
            />
          </motion.div>

          {/* Right: Content blocks */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col gap-8 md:gap-12"
          >
            {/* Block 1 */}
            <div className="flex flex-col">
              <div className="text-white/40 text-xs tracking-widest uppercase mb-4 font-semibold">
                Choose your space
              </div>
              <p className="text-white/70 text-base md:text-lg leading-relaxed font-light">
                Every successful creator journey begins at the intersection of beautiful curation and effortless monetization. We operate at that crossroads, turning your digital footprints into robust streams of revenue.
              </p>
            </div>

            {/* Divider */}
            <div className="w-full h-px bg-white/10" />

            {/* Block 2 */}
            <div className="flex flex-col">
              <div className="text-white/40 text-xs tracking-widest uppercase mb-4 font-semibold">
                Shape the future
              </div>
              <p className="text-white/70 text-base md:text-lg leading-relaxed font-light">
                We believe that creators deserve complete ownership of their audience. Our system is designed to showcase your digital products, services, and booking tools through high-converting glassmorphic checkouts.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
