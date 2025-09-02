import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Hero from "@/components/hero";
import LiveAuction from "@/components/LiveAuction";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <LiveAuction />
      <Footer />
    </div>
  );
}
