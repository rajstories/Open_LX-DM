import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function ServicesSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut' as const,
      },
    },
  };

  const services = [
    {
      video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4',
      tag: 'Monetize',
      title: 'Digital Products & Services',
      description: 'Sell e-books, course bundles, checklists, or host 1-on-1 booking sessions. Process payments globally with high-converting checkouts.',
    },
    {
      video: 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260324_151826_c7218672-6e92-402c-9e45-f1e0f454bdc4.mp4',
      tag: 'Identity',
      title: 'Link In Bio & Analytics',
      description: 'Build a beautiful, highly-customizable glassmorphic landing page. Uncover audience insights and track your visitor growth in real-time.',
    },
  ];

  return (
    <section className="bg-black py-28 md:py-40 px-6 relative overflow-hidden">
      {/* Subtle radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(255,255,255,0.02)_0%,_transparent_60%)] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10" ref={containerRef}>
        {/* Header Row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7 }}
          className="flex justify-between items-end mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-5xl text-white tracking-tight font-light">
            What we do
          </h2>
          <span className="text-white/40 text-sm hidden md:inline tracking-wider uppercase font-semibold">
            Our services
          </span>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="liquid-glass rounded-3xl overflow-hidden group flex flex-col h-full bg-neutral-900/10"
            >
              {/* Card video area */}
              <div className="aspect-video w-full overflow-hidden relative">
                <video
                  src={service.video}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  muted
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
              </div>

              {/* Card body */}
              <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <span className="uppercase tracking-widest text-white/40 text-xs font-semibold">
                      {service.tag}
                    </span>
                    <div className="liquid-glass rounded-full p-2 text-white/80 group-hover:text-white group-hover:bg-white/10 transition-colors">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-white text-xl md:text-2xl mb-3 tracking-tight font-normal">
                    {service.title}
                  </h3>
                  <p className="text-white/50 text-sm leading-relaxed font-light">
                    {service.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
