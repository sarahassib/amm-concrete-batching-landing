import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Products from "@/components/Products";
import QualificationForm from "@/components/QualificationForm";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CustomCursor from "@/components/CustomCursor";

export default function Home() {
  return (
    <>
      <CustomCursor />
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
