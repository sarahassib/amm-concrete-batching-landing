"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { ArrowRight } from "lucide-react";

const products = [
  {
    /* PLACEHOLDER: Replace with real product image or video */
    media: "/images/product-type-1.jpeg",
    /* PLACEHOLDER: Replace with confirmed product type name */
    title: "[Type de centrale 1 à confirmer]",
    description:
      "Solution à valider selon votre besoin, votre configuration et votre chantier.",
  },
  {
    media: "/images/product-type-2.jpeg",
    title: "[Type de centrale 2 à confirmer]",
    description:
      "Solution adaptée selon les contraintes du projet et les éléments techniques disponibles.",
  },
  {
    media: "/images/product-type-3.jpeg",
    title: "[Type de centrale 3 à confirmer]",
    description:
      "Solution à étudier selon le niveau de mobilité, d'installation et d'exploitation souhaité.",
  },
  {
    media: "/images/product-type-4.jpeg",
    title: "[Type de centrale 4 à confirmer]",
    description:
      "Solution à confirmer avec AMM selon les objectifs du projet.",
  },
];

export default function Products() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="products" className="relative py-24 sm:py-32 bg-amm-black">
      <div className="section-divider" />
      <div className="absolute inset-0 industrial-grid opacity-10" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16 sm:mb-20"
        >
          <span className="text-amm-red font-semibold tracking-[0.2em] text-sm uppercase mb-4 block">
            Nos Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Nos types de centrales à béton
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto leading-relaxed">
            Découvrez les principaux types de centrales à béton proposés par
            AMM. Les détails techniques seront validés selon votre projet.
          </p>
        </motion.div>

        {/* Product grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {products.map((product, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.7,
                delay: 0.15 + index * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="card-3d group rounded-2xl bg-amm-black-card border border-gray-800/50 hover:border-amm-red/30 overflow-hidden flex flex-col"
            >
              {/* Media area */}
              {/* ===========================================================
                  REPLACE THIS MEDIA: Use real product images or videos
                  Current placeholders: /images/product-type-{1-4}.jpg
                  =========================================================== */}
              <div className="relative aspect-[4/3] overflow-hidden bg-amm-black-soft">
                <img
                  src={product.media}
                  alt={product.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                {/* Fallback when no image */}
                <div className="absolute inset-0 bg-gradient-to-br from-amm-black-soft to-amm-gray-dark/30" />
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-white font-bold text-lg mb-3">
                  {product.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6 flex-1">
                  {product.description}
                </p>
                <a
                  href="#form"
                  className="inline-flex items-center gap-2 text-amm-red hover:text-amm-red-light font-semibold text-sm group/link transition-colors mt-auto"
                >
                  Voir détails
                  <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

