"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Send,
  CheckCircle,
  Building2,
  Briefcase,
  Factory,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";

type FormView = "select" | "achat" | "fournisseur" | "emploi";

/* =====================================================
   FORM STATE types
   ===================================================== */
interface BaseForm {
  fullName: string;
  company: string;
  phone: string;
  email: string;
  message: string;
}

interface AchatForm extends BaseForm {
  city: string;
  plantType: string;
  requestType: string;
  projectStage: string;
  confirmation: string;
}

interface FournisseurForm extends BaseForm {
  productService: string;
}

interface EmploiForm extends BaseForm {
  position: string;
  experience: string;
}

const plantTypeOptions = [
  /* PLACEHOLDER: Replace with confirmed product type names */
  "[Type de centrale 1 à confirmer]",
  "[Type de centrale 2 à confirmer]",
  "[Type de centrale 3 à confirmer]",
  "[Type de centrale 4 à confirmer]",
  "Je ne sais pas encore",
];

const requestTypeOptions = [
  "Achat d'une centrale à béton",
  "Installation d'une solution",
  "Demande d'information",
  "Comparaison de solutions",
  "Autre",
];

const projectStageOptions = [
  "Projet en étude",
  "Besoin prévu prochainement",
  "Achat en préparation",
  "Demande urgente",
  "Pas encore défini",
];

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-amm-black border border-gray-700 text-white placeholder-gray-500 focus:border-amm-red focus:ring-1 focus:ring-amm-red outline-none transition-colors text-sm";

const labelClass = "block text-sm font-medium text-gray-300 mb-2";

function FieldError({ error }: { error?: string }) {
  if (!error) return null;
  return <p className="text-amm-red text-xs mt-1">{error}</p>;
}

export default function QualificationForm() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [view, setView] = useState<FormView>("select");
  const [submitted, setSubmitted] = useState(false);

  /* ---- Achat form state ---- */
  const [achat, setAchat] = useState<AchatForm>({
    fullName: "",
    company: "",
    phone: "",
    email: "",
    city: "",
    plantType: "",
    requestType: "",
    projectStage: "",
    message: "",
    confirmation: "",
  });
  const [achatErrors, setAchatErrors] = useState<
    Partial<Record<keyof AchatForm, string>>
  >({});

  /* ---- Fournisseur form state ---- */
  const [fournisseur, setFournisseur] = useState<FournisseurForm>({
    fullName: "",
    company: "",
    phone: "",
    email: "",
    message: "",
    productService: "",
  });
  const [fournisseurErrors, setFournisseurErrors] = useState<
    Partial<Record<keyof FournisseurForm, string>>
  >({});

  /* ---- Emploi form state ---- */
  const [emploi, setEmploi] = useState<EmploiForm>({
    fullName: "",
    company: "",
    phone: "",
    email: "",
    message: "",
    position: "",
    experience: "",
  });
  const [emploiErrors, setEmploiErrors] = useState<
    Partial<Record<keyof EmploiForm, string>>
  >({});

  /* ---- Handlers ---- */
  function handleAchatChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setAchat((p) => ({ ...p, [name]: value }));
    if (achatErrors[name as keyof AchatForm])
      setAchatErrors((p) => ({ ...p, [name]: "" }));
  }

  function handleFournisseurChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setFournisseur((p) => ({ ...p, [name]: value }));
    if (fournisseurErrors[name as keyof FournisseurForm])
      setFournisseurErrors((p) => ({ ...p, [name]: "" }));
  }

  function handleEmploiChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setEmploi((p) => ({ ...p, [name]: value }));
    if (emploiErrors[name as keyof EmploiForm])
      setEmploiErrors((p) => ({ ...p, [name]: "" }));
  }

  /* ---- Validation ---- */
  function validateAchat(): boolean {
    const er: Partial<Record<keyof AchatForm, string>> = {};
    if (!achat.fullName.trim()) er.fullName = "Requis";
    if (!achat.company.trim()) er.company = "Requis";
    if (!achat.phone.trim()) er.phone = "Requis";
    if (!achat.email.trim()) er.email = "Requis";
    if (!achat.city.trim()) er.city = "Requis";
    if (!achat.plantType) er.plantType = "Requis";
    if (!achat.requestType) er.requestType = "Requis";
    if (!achat.projectStage) er.projectStage = "Requis";
    if (!achat.confirmation) er.confirmation = "Requis";
    setAchatErrors(er);
    return Object.keys(er).length === 0;
  }

  function validateFournisseur(): boolean {
    const er: Partial<Record<keyof FournisseurForm, string>> = {};
    if (!fournisseur.fullName.trim()) er.fullName = "Requis";
    if (!fournisseur.company.trim()) er.company = "Requis";
    if (!fournisseur.phone.trim()) er.phone = "Requis";
    if (!fournisseur.email.trim()) er.email = "Requis";
    if (!fournisseur.productService.trim()) er.productService = "Requis";
    setFournisseurErrors(er);
    return Object.keys(er).length === 0;
  }

  function validateEmploi(): boolean {
    const er: Partial<Record<keyof EmploiForm, string>> = {};
    if (!emploi.fullName.trim()) er.fullName = "Requis";
    if (!emploi.phone.trim()) er.phone = "Requis";
    if (!emploi.email.trim()) er.email = "Requis";
    if (!emploi.position.trim()) er.position = "Requis";
    setEmploiErrors(er);
    return Object.keys(er).length === 0;
  }

  /* ---- Submit handlers ---- */
  const [submitting, setSubmitting] = useState(false);

  async function submitLead(type: string, data: object) {
    setSubmitting(true);
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, ...data }),
      });
    } catch (err) {
      console.error("Failed to submit lead:", err);
    } finally {
      setSubmitting(false);
      setSubmitted(true);
    }
  }

  async function handleAchatSubmit(e: FormEvent) {
    e.preventDefault();
    if (achat.confirmation === "Non") {
      await submitLead("achat", achat);
      return;
    }
    if (!validateAchat()) return;
    await submitLead("achat", achat);
  }

  async function handleFournisseurSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateFournisseur()) return;
    await submitLead("fournisseur", fournisseur);
  }

  async function handleEmploiSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateEmploi()) return;
    await submitLead("emploi", emploi);
  }

  function goBack() {
    setView("select");
    setSubmitted(false);
  }

  return (
    <section id="form" className="relative py-24 sm:py-32 bg-amm-black-soft">
      <div className="section-divider" />

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
            {view === "select"
              ? "Comment pouvons-nous vous aider ?"
              : view === "achat"
              ? "Demande de centrale à béton"
              : view === "fournisseur"
              ? "Contact service achat"
              : "Candidature"}
          </h2>
          {view === "select" && (
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Sélectionnez votre profil pour accéder au formulaire correspondant.
            </p>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {/* ============ SELECTION CARDS ============ */}
          {view === "select" && !submitted && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
              {/* Card 1 — Achat centrale */}
              <button
                onClick={() => setView("achat")}
                className="group text-left p-8 rounded-2xl bg-amm-black-card border border-gray-800/50 hover:border-amm-red/40 transition-all duration-300 card-3d"
              >
                <div className="w-14 h-14 rounded-xl bg-amm-red/10 flex items-center justify-center mb-5 group-hover:bg-amm-red/20 transition-colors">
                  <Factory className="w-7 h-7 text-amm-red" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3">
                  Besoin d&apos;une centrale à béton
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Vous recherchez une centrale à béton ou des informations sur
                  nos solutions. Décrivez votre projet et nous vous
                  accompagnerons.
                </p>
                <span className="text-amm-red font-semibold text-sm group-hover:translate-x-1 inline-block transition-transform">
                  Commencer →
                </span>
              </button>

              {/* Card 2 — Fournisseur */}
              <button
                onClick={() => setView("fournisseur")}
                className="group text-left p-8 rounded-2xl bg-amm-black-card border border-gray-800/50 hover:border-amm-red/40 transition-all duration-300 card-3d"
              >
                <div className="w-14 h-14 rounded-xl bg-amm-red/10 flex items-center justify-center mb-5 group-hover:bg-amm-red/20 transition-colors">
                  <Building2 className="w-7 h-7 text-amm-red" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3">
                  Vous êtes fournisseur ?
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Pour les demandes fournisseur, veuillez contacter le service
                  achat via le formulaire dédié.
                </p>
                <span className="text-amm-red font-semibold text-sm group-hover:translate-x-1 inline-block transition-transform">
                  Contacter service achat →
                </span>
              </button>

              {/* Card 3 — Emploi / RH */}
              <button
                onClick={() => setView("emploi")}
                className="group text-left p-8 rounded-2xl bg-amm-black-card border border-gray-800/50 hover:border-amm-red/40 transition-all duration-300 card-3d"
              >
                <div className="w-14 h-14 rounded-xl bg-amm-red/10 flex items-center justify-center mb-5 group-hover:bg-amm-red/20 transition-colors">
                  <Briefcase className="w-7 h-7 text-amm-red" />
                </div>
                <h3 className="text-white font-bold text-xl mb-3">
                  Vous cherchez un emploi ?
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">
                  Pour les demandes d&apos;emploi ou de stage, veuillez utiliser le
                  canal de candidature.
                </p>
                <span className="text-amm-red font-semibold text-sm group-hover:translate-x-1 inline-block transition-transform">
                  Postuler ici →
                </span>
              </button>
            </motion.div>
          )}

          {/* ============ ACHAT FORM ============ */}
          {view === "achat" && !submitted && (
            <motion.div
              key="achat"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto"
            >
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Retour aux choix
              </button>

              <form
                onSubmit={handleAchatSubmit}
                className="space-y-6 p-8 rounded-2xl bg-amm-black-card border border-gray-800/50"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Nom complet *</label>
                    <input
                      name="fullName"
                      value={achat.fullName}
                      onChange={handleAchatChange}
                      required
                      className={inputClass}
                    />
                    <FieldError error={achatErrors.fullName} />
                  </div>
                  <div>
                    <label className={labelClass}>Société *</label>
                    <input
                      name="company"
                      value={achat.company}
                      onChange={handleAchatChange}
                      required
                      className={inputClass}
                    />
                    <FieldError error={achatErrors.company} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Téléphone / WhatsApp *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={achat.phone}
                      onChange={handleAchatChange}
                      required
                      className={inputClass}
                    />
                    <FieldError error={achatErrors.phone} />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={achat.email}
                      onChange={handleAchatChange}
                      required
                      className={inputClass}
                    />
                    <FieldError error={achatErrors.email} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Ville / Région *</label>
                  <input
                    name="city"
                    value={achat.city}
                    onChange={handleAchatChange}
                    required
                    className={inputClass}
                  />
                  <FieldError error={achatErrors.city} />
                </div>

                <div>
                  <label className={labelClass}>
                    Type de centrale qui vous intéresse *
                  </label>
                  <select
                    name="plantType"
                    value={achat.plantType}
                    onChange={handleAchatChange}
                    required
                    className={inputClass}
                  >
                    <option value="">Sélectionnez une option</option>
                    {plantTypeOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <FieldError error={achatErrors.plantType} />
                </div>

                <div>
                  <label className={labelClass}>Type de demande *</label>
                  <select
                    name="requestType"
                    value={achat.requestType}
                    onChange={handleAchatChange}
                    required
                    className={inputClass}
                  >
                    <option value="">Sélectionnez une option</option>
                    {requestTypeOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <FieldError error={achatErrors.requestType} />
                </div>

                <div>
                  <label className={labelClass}>
                    Niveau d&apos;avancement du projet *
                  </label>
                  <select
                    name="projectStage"
                    value={achat.projectStage}
                    onChange={handleAchatChange}
                    required
                    className={inputClass}
                  >
                    <option value="">Sélectionnez une option</option>
                    {projectStageOptions.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                  <FieldError error={achatErrors.projectStage} />
                </div>

                <div>
                  <label className={labelClass}>Message</label>
                  <textarea
                    name="message"
                    value={achat.message}
                    onChange={handleAchatChange}
                    rows={4}
                    placeholder="Décrivez votre projet ou votre besoin"
                    className={inputClass + " resize-none"}
                  />
                </div>

                <div>
                  <label className={labelClass}>
                    Votre demande concerne-t-elle un projet de centrale à béton
                    ? *
                  </label>
                  <div className="flex gap-4">
                    {["Oui", "Non"].map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-gray-700 bg-amm-black text-gray-300 cursor-pointer hover:border-amm-red/50 transition-colors has-[:checked]:border-amm-red has-[:checked]:bg-amm-red/10 has-[:checked]:text-white"
                      >
                        <input
                          type="radio"
                          name="confirmation"
                          value={opt}
                          checked={achat.confirmation === opt}
                          onChange={handleAchatChange}
                          required
                          className="sr-only"
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                  <FieldError error={achatErrors.confirmation} />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-amm-red hover:bg-amm-red-dark text-white font-semibold transition-colors shadow-lg shadow-amm-red/20 disabled:opacity-50"
                >
                  {submitting ? "Envoi..." : "Envoyer ma demande"} <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

        {/* ============ FOURNISSEUR FORM ============ */}
          {view === "fournisseur" && !submitted && (
            <motion.div
              key="fournisseur"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto"
            >
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Retour aux choix
              </button>

              <form
                onSubmit={handleFournisseurSubmit}
                className="space-y-6 p-8 rounded-2xl bg-amm-black-card border border-gray-800/50"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Nom complet *</label>
                    <input
                      name="fullName"
                      value={fournisseur.fullName}
                      onChange={handleFournisseurChange}
                      required
                      className={inputClass}
                    />
                    <FieldError error={fournisseurErrors.fullName} />
                  </div>
                  <div>
                    <label className={labelClass}>Société *</label>
                    <input
                      name="company"
                      value={fournisseur.company}
                      onChange={handleFournisseurChange}
                      required
                      className={inputClass}
                    />
                    <FieldError error={fournisseurErrors.company} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Téléphone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={fournisseur.phone}
                      onChange={handleFournisseurChange}
                      required
                      className={inputClass}
                    />
                    <FieldError error={fournisseurErrors.phone} />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={fournisseur.email}
                      onChange={handleFournisseurChange}
                      required
                      className={inputClass}
                    />
                    <FieldError error={fournisseurErrors.email} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    Produit ou service proposé *
                  </label>
                  <input
                    name="productService"
                    value={fournisseur.productService}
                    onChange={handleFournisseurChange}
                    required
                    placeholder="Décrivez brièvement votre offre"
                    className={inputClass}
                  />
                  <FieldError error={fournisseurErrors.productService} />
                </div>

                <div>
                  <label className={labelClass}>Message</label>
                  <textarea
                    name="message"
                    value={fournisseur.message}
                    onChange={handleFournisseurChange}
                    rows={4}
                    placeholder="Informations complémentaires"
                    className={inputClass + " resize-none"}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-amm-red hover:bg-amm-red-dark text-white font-semibold transition-colors shadow-lg shadow-amm-red/20 disabled:opacity-50"
                >
                  {submitting ? "Envoi..." : "Envoyer"} <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

          {/* ============ EMPLOI FORM ============ */}
          {view === "emploi" && !submitted && (
            <motion.div
              key="emploi"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4 }}
              className="max-w-3xl mx-auto"
            >
              <button
                onClick={goBack}
                className="flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Retour aux choix
              </button>

              <form
                onSubmit={handleEmploiSubmit}
                className="space-y-6 p-8 rounded-2xl bg-amm-black-card border border-gray-800/50"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Nom complet *</label>
                    <input
                      name="fullName"
                      value={emploi.fullName}
                      onChange={handleEmploiChange}
                      required
                      className={inputClass}
                    />
                    <FieldError error={emploiErrors.fullName} />
                  </div>
                  <div>
                    <label className={labelClass}>Société actuelle</label>
                    <input
                      name="company"
                      value={emploi.company}
                      onChange={handleEmploiChange}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={labelClass}>Téléphone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={emploi.phone}
                      onChange={handleEmploiChange}
                      required
                      className={inputClass}
                    />
                    <FieldError error={emploiErrors.phone} />
                  </div>
                  <div>
                    <label className={labelClass}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={emploi.email}
                      onChange={handleEmploiChange}
                      required
                      className={inputClass}
                    />
                    <FieldError error={emploiErrors.email} />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Poste souhaité *</label>
                  <input
                    name="position"
                    value={emploi.position}
                    onChange={handleEmploiChange}
                    required
                    placeholder="Ex: Technicien de maintenance, Ingénieur..."
                    className={inputClass}
                  />
                  <FieldError error={emploiErrors.position} />
                </div>

                <div>
                  <label className={labelClass}>Expérience</label>
                  <select
                    name="experience"
                    value={emploi.experience}
                    onChange={handleEmploiChange}
                    className={inputClass}
                  >
                    <option value="">Sélectionnez</option>
                    <option value="junior">Junior (0-2 ans)</option>
                    <option value="confirmé">Confirmé (2-5 ans)</option>
                    <option value="senior">Senior (5+ ans)</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Message / CV</label>
                  <textarea
                    name="message"
                    value={emploi.message}
                    onChange={handleEmploiChange}
                    rows={4}
                    placeholder="Présentez-vous brièvement ou décrivez votre recherche"
                    className={inputClass + " resize-none"}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-amm-red hover:bg-amm-red-dark text-white font-semibold transition-colors shadow-lg shadow-amm-red/20 disabled:opacity-50"
                >
                  {submitting ? "Envoi..." : "Envoyer ma candidature"} <Send className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}

          {/* ============ SUCCESS ============ */}
          {submitted && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 rounded-2xl bg-amm-black-card border border-amm-red/30 max-w-3xl mx-auto"
            >
              <CheckCircle className="w-16 h-16 text-amm-red mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                Demande envoyée
              </h3>
              <p className="text-gray-400 max-w-md mx-auto mb-8">
                Merci pour votre intérêt. Un membre de l&apos;équipe AMM vous
                contactera rapidement.
              </p>
              <button
                onClick={() => {
                  setView("select");
                  setSubmitted(false);
                  setAchat({
                    fullName: "",
                    company: "",
                    phone: "",
                    email: "",
                    city: "",
                    plantType: "",
                    requestType: "",
                    projectStage: "",
                    message: "",
                    confirmation: "",
                  });
                  setFournisseur({
                    fullName: "",
                    company: "",
                    phone: "",
                    email: "",
                    message: "",
                    productService: "",
                  });
                  setEmploi({
                    fullName: "",
                    company: "",
                    phone: "",
                    email: "",
                    message: "",
                    position: "",
                    experience: "",
                  });
                }}
                className="px-6 py-3 rounded-xl border border-amm-red/30 text-amm-red hover:bg-amm-red/10 font-semibold text-sm transition-colors"
              >
                Nouvelle demande
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
