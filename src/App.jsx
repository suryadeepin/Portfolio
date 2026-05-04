import { useState, useEffect } from 'react';
import { startPreload } from './utils/preloadFrames';
import { useIsMobile } from './hooks/useIsMobile';
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
  const isMobile = useIsMobile();

  // Handle global styles & mobile logic
  useEffect(() => {
    // Force scroll to top on every refresh
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Disable scrollbar for a cleaner cinematic look
    document.body.style.overflowX = 'hidden';
    document.body.style.scrollbarWidth = 'none'; // Firefox
    document.body.style.msOverflowStyle = 'none'; // IE/Edge
  }, []);

  // Guarantee absolute top position the exact moment the content mounts
  useEffect(() => {
    if (loaderDone) {
      window.scrollTo(0, 0);
    }
  }, [loaderDone]);

  return (
    <>
      {/* Custom cursor — desktop only (no pointer on touch) */}
      {!isMobile && <CustomCursor />}

      {/* Loader: on mobile skip model-ready gate (no model loaded) */}
      <Loader onDone={() => setLoaderDone(true)} isMobile={isMobile} />

      {/* 3D model — only on desktop */}
      {!isMobile && <HeroAvatar isReady={loaderDone} />}

      {/* Subtle ambient background */}
      <GlobalBackground />

      {/* 
        CRITICAL FIX: 
        We physically do not render the <main> content until the loader finishes. 
        If the page has no content, it has no height. If it has no height, it is 
        100% physically impossible for any browser or device to scroll it.
      */}
      {loaderDone && (
        <>
          <Navbar />
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
      )}
    </>
  );
}

export default App;
