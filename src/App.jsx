import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import BootLoader from './components/BootLoader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Stats from './components/Stats';
import About from './components/About';
import HowItWorks from './components/HowItWorks';
import Domains from './components/Domains';
import Registration from './components/Registration';
import FAQ from './components/FAQ';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';
import Admin from './components/Admin';

function useHashRoute() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return hash;
}

export default function App() {
  const [booting, setBooting] = useState(true);
  const hash = useHashRoute();

  if (hash === '#/admin') {
    return <Admin />;
  }

  return (
    <div className="relative min-h-screen bg-[#f7f3e8] text-[#141414]">
      <AnimatePresence>{booting && <BootLoader key="boot" onDone={() => setBooting(false)} />}</AnimatePresence>

      <Navbar />
      <main>
        <Hero />
        <Marquee />
        <Stats />
        <About />
        <HowItWorks />
        <Domains />
        <Registration />
        <FAQ />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}