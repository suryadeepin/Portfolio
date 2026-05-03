import { useState, useEffect } from 'react';
import { startPreload } from './utils/preloadFrames';
import CustomCursor from './components/CustomCursor';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import GlobalBackground from './components/GlobalBackground';
import HeroAvatar from './components/HeroAvatar';
import Hero from './components/Hero';
import Bio from './components/Bio';
import ImageScrub from './components/ImageScrub';
import Skills from './components/Skills';
import Experience from './components/Experience';
import ResumeSection from './components/ResumeSection';
import Contact from './components/Contact';

// Kick-start frame preloading IMMEDIATELY (before any component mounts)
startPreload();

function App() {
  const [loaderDone, setLoaderDone] = useState(false);

  return (
    <>
      <CustomCursor />

      {/* Loader waits for both model + frames to be ready */}
      <Loader onDone={() => setLoaderDone(true)} />

      {/* 3D model always mounted so it loads during loader */}
      <HeroAvatar />

      {/* Subtle ambient background */}
      <GlobalBackground />

      {loaderDone && <Navbar />}

      <main className="relative" style={{ zIndex: 10, background: 'transparent' }}>
        <Hero />
        <Bio />
        <ImageScrub />
        <Skills />
        <Experience />
        <ResumeSection />
        <Contact />
      </main>
    </>
  );
}

export default App;
