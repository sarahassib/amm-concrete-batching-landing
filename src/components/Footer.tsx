"use client";

import { Phone, Mail, MapPin, MessageCircle, Globe, Briefcase, Camera, Play } from "lucide-react";

const footerLinks = [
  {
    title: "Solutions",
    links: [
      { label: "Centrales mobiles", href: "#products" },
      { label: "Centrales modulaires", href: "#products" },
      { label: "Centrales fixes", href: "#products" },
    ],
  },
  {
    title: "Entreprise",
    links: [
      { label: "À propos", href: "#home" },
      { label: "Contact", href: "#contact" },
      { label: "Devis", href: "#form" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative bg-amm-black-soft border-t border-gray-800/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              {/* PLACEHOLDER: Replace /images/logo-amm.png with your real logo */}
              <img
                src="/images/logo-amm.png"
                alt="AMM Logo"
                className="h-8 w-auto"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  e.currentTarget.nextElementSibling?.classList.remove("hidden");
                }}
              />
              <span className="hidden text-white font-bold text-lg">
                AMM
              </span>
              <span className="text-white font-bold text-lg">AMM</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm">
              Atlantic Machinery Manufacturing — Solutions de production de
              béton pour les professionnels du BTP et de l&apos;industrie.
            </p>
            <div className="space-y-2">
              {/* PLACEHOLDER: Replace all contact info with real AMM data */}
              <a href="tel:PHONE_NUMBER" className="flex items-center gap-2 text-gray-400 hover:text-amm-red text-sm transition-colors">
                <Phone className="w-4 h-4" /> [téléphone AMM à intégrer]
              </a>
              <a href="mailto:EMAIL_ADDRESS" className="flex items-center gap-2 text-gray-400 hover:text-amm-red text-sm transition-colors">
                <Mail className="w-4 h-4" /> [email AMM à intégrer]
              </a>
              <span className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" /> [adresse AMM à intégrer]
              </span>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-white font-semibold text-sm mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-gray-500 hover:text-amm-red text-sm transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">Suivez-nous</h4>
            <div className="flex flex-wrap gap-3">
              {/* PLACEHOLDER: Replace all href with real social URLs */}
              {[
                { icon: Globe, label: "Facebook", href: "#" },
                { icon: Briefcase, label: "LinkedIn", href: "#" },
                { icon: Camera, label: "Instagram", href: "#" },
                { icon: Play, label: "YouTube", href: "#" },
                { icon: MessageCircle, label: "WhatsApp", href: "#" },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-amm-black-card border border-gray-800/50 flex items-center justify-center hover:border-amm-red/50 hover:bg-amm-red/10 transition-all"
                  aria-label={s.label}
                >
                  <s.icon className="w-4 h-4 text-gray-500" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-800/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-xs">
            &copy; {new Date().getFullYear()} AMM — Atlantic Machinery
            Manufacturing. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              Mentions légales
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-400 text-xs transition-colors">
              Politique de confidentialité
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
