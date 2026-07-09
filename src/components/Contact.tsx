"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Globe,
  Briefcase,
  Camera,
  Play,
  ExternalLink,
} from "lucide-react";

/* =====================================================
   PLACEHOLDER: Replace all contact values with real AMM data
   ===================================================== */

const contactMethods = [
  {
    icon: Phone,
    title: "Téléphone",
    /* PLACEHOLDER: Replace with real AMM phone number */
    value: "[téléphone AMM à intégrer]",
    /* PLACEHOLDER: Replace with real phone link */
    href: "tel:PHONE_NUMBER",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    /* PLACEHOLDER: Replace with real WhatsApp number */
    value: "[numéro WhatsApp à intégrer]",
    /* PLACEHOLDER: Replace with real WhatsApp link */
    href: "https://wa.me/WHATSAPP_NUMBER",
  },
  {
    icon: Mail,
    title: "Email",
    /* PLACEHOLDER: Replace with real AMM email */
    value: "[email AMM à intégrer]",
    /* PLACEHOLDER: Replace with real email link */
    href: "mailto:EMAIL_ADDRESS",
  },
  {
    icon: MapPin,
    title: "Adresse",
    /* PLACEHOLDER: Replace with real AMM address */
    value: "[adresse AMM à intégrer]",
    href: "#",
  },
];

/* =====================================================
   PLACEHOLDER: Replace all social links with real URLs
   ===================================================== */
const socialLinks = [
  { icon: Globe, label: "Facebook", href: "[lien Facebook à intégrer]" },
  { icon: Briefcase, label: "LinkedIn", href: "[lien LinkedIn à intégrer]" },
  { icon: Camera, label: "Instagram", href: "[lien Instagram à intégrer]" },
  { icon: Play, label: "YouTube", href: "[lien YouTube à intégrer]" },
  { icon: MessageCircle, label: "WhatsApp", href: "[lien WhatsApp à intégrer]" },
];

export default function Contact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="relative py-24 sm:py-32 bg-amm-black">
      <div className="section-divider" />
      <div className="absolute inset-0 industrial-grid opacity-10" />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <span className="text-amm-red font-semibold tracking-[0.2em] text-sm uppercase mb-4 block">
            Contact
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
            Contact &amp; Localisation
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Retrouvez AMM et contactez notre équipe pour vos projets de
            centrales à béton.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left — contact cards + social */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={index}
                  href={method.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    delay: 0.3 + index * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group p-6 rounded-xl bg-amm-black-card border border-gray-800/50 hover:border-amm-red/30 transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-lg bg-amm-red/10 flex items-center justify-center mb-4 group-hover:bg-amm-red/20 transition-colors">
                    <method.icon className="w-6 h-6 text-amm-red" />
                  </div>
                  <h3 className="text-white font-semibold mb-1">
                    {method.title}
                  </h3>
                  <p className="text-gray-500 text-sm">{method.value}</p>
                </motion.a>
              ))}
            </div>

            {/* Social media */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">
                Suivez-nous
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-amm-black-card border border-gray-800/50 flex items-center justify-center hover:border-amm-red/50 hover:bg-amm-red/10 transition-all duration-300"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5 text-gray-400" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right — map */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative rounded-2xl overflow-hidden border border-gray-800/50 h-[420px] bg-amm-black-card">
              {/* =====================================================
                  REPLACE THIS MAP: Use a real Google Maps embed
                  Current: placeholder
                  ===================================================== */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center px-8">
                  <MapPin className="w-12 h-12 text-amm-red/40 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm font-medium mb-2">
                    Google Maps location placeholder
                  </p>
                  <p className="text-gray-600 text-xs">
                    Replace with exact AMM location
                  </p>
                </div>
              </div>
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-amm-red/90 rounded-lg">
                <span className="text-white text-xs font-semibold">AMM</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
