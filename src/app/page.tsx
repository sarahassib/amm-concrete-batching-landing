import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import QualificationForm from "@/components/QualificationForm";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-amm-black">
        <Hero />
        <Products />
        <QualificationForm />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
