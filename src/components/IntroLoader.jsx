import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const IntroLoader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Fake progress loading from 0 to 100 over 2.5 seconds
    const duration = 2500;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min(Math.floor((currentStep / steps) * 100), 100);
      setProgress(nextProgress);
      if (currentStep >= steps) {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] bg-[#050508] flex items-center justify-center flex-col pointer-events-none"
      initial={{ opacity: 1, filter: "blur(0px)" }}
      exit={{ 
        opacity: 0, 
        filter: "blur(20px)",
        scale: 1.1,
        transition: { duration: 1.5, ease: "easeInOut" }
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a1a24] via-[#050508] to-[#050508] opacity-60 z-0" />
      
      <div className="relative z-10 w-full max-w-4xl px-8 flex flex-col items-center justify-center h-full">
        
        {/* Massive 3D-styled typography that feels modern */}
        <div className="relative overflow-hidden mb-4">
          <motion.h1 
            className="font-['Syne'] font-black text-[15vw] md:text-[10vw] leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#e8e8f0] via-[#6c63ff] to-[#43e8d8] tracking-tighter"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            SURYADEEP
          </motion.h1>
        </div>

        <div className="relative w-full max-w-sm mt-12 flex justify-between items-center font-['Space_Mono'] text-[#5a5a70] text-sm md:text-base border-t border-white/10 pt-4">
          <motion.span 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Initializing System
          </motion.span>
          <motion.span 
            className="text-[#e8e8f0]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
          >
            {/* Guarantee fixed width for percentage so it doesn't jump */}
            <span className="inline-block w-8 text-right">{progress}</span>%
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
};

export default IntroLoader;
