"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Video background — shifted down to avoid logo area */}
      {/* =====================================================
          REPLACE THIS VIDEO: Use the real AMM hero video
          Current placeholder: /videos/hero-centrale-beton.mp4
          ===================================================== */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center"
        style={{ objectPosition: "50% 25%" }}
        poster="/images/hero-poster.jpg"
      >
        <source src="/videos/hero-centrale-beton.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-amm-black/90 via-amm-black/50 to-amm-black/80" />

      {/* Industrial grid pattern */}
      <div className="absolute inset-0 industrial-grid opacity-20" />

      {/* Red accent lines */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amm-red/30 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amm-red/30 to-transparent" />

      {/* Content — pushed slightly down */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block text-amm-red font-semibold tracking-[0.3em] text-xs sm:text-sm uppercase mb-6 border border-amm-red/20 px-4 py-2 rounded-full"
        >
          
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-6xl md:text-8xl font-bold text-white leading-[1.05] mb-6 max-w-5xl mx-auto"
        >
          CENTRAL A BETON{" "}
          <span className="text-amm-red">Fabricant</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-gray-300 text-lg sm:text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Des solutions adaptées pour vos projets BTP, industriels et béton.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#form"
            className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-amm-red hover:bg-amm-red-dark text-white font-semibold text-base transition-all duration-300 shadow-lg shadow-amm-red/20"
          >
            Get Offer
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#products"
            className="group flex items-center gap-3 px-8 py-4 rounded-xl border border-white/20 hover:border-amm-red/50 text-gray-300 hover:text-white font-medium transition-all duration-300"
          >
            Voir Product
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-6 h-6 text-amm-gray animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}
