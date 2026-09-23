import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import BootLoader from './components/BootLoader';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Stats from './components/Stats';
import About from './components/About';
import Faceoff from './components/Faceoff';
import Factions from './components/Factions';
import HowItWorks from './components/HowItWorks';
import EventTimeline from './components/EventTimeline';
import Domains from './components/Domains';
import Registration from './components/Registration';
import FAQ from './components/FAQ';
import FinalCta from './components/FinalCta';
import Footer from './components/Footer';
import Admin from './components/Admin';
import ErrorState from './components/ErrorState';
import ChatBot from './components/ChatBot';
import Particles from './components/Particles';
import CursorGlow from './components/CursorGlow';
import Stars from './components/Stars';
import NightGlow from './components/NightGlow';

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

  if (hash.startsWith('#/')) {
    return <ErrorState kind={404} />;
  }

  return (
    <div className="relative min-h-screen text-[#DFECF4]">
      <NightGlow />
      <Stars />
      <Particles />
      <CursorGlow />
      <div className="noise-overlay" />

      <AnimatePresence>{booting && <BootLoader key="boot" onDone={() => setBooting(false)} />}</AnimatePresence>

      <Navbar />
      <main className="relative" style={{ zIndex: 10 }}>
        <Hero />
        <div className="section-divider" />
        <Marquee />
        <div className="section-divider" />
        <Stats />
        <div className="section-divider" />
        <About />
        <div className="section-divider" />
        <Faceoff />
        <div className="section-divider" />
        <Factions />
        <div className="section-divider" />
        <HowItWorks />
        <div className="section-divider" />
        <EventTimeline />
        <div className="section-divider" />
        <Domains />
        <div className="section-divider" />
        <Registration />
        <div className="section-divider" />
        <FAQ />
        <div className="section-divider" />
        <FinalCta />
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
}
