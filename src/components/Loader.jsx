import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { startPreload, framesReady } from '../utils/preloadFrames';

export default function Loader({ onDone, isMobile = false }) {
  const containerRef    = useRef(null);
  const glassRef        = useRef(null);
  const lettersRef      = useRef(null);
  const roleRef         = useRef(null);
  const fillRef         = useRef(null);
  const numRef          = useRef(null);
  const statusRef       = useRef(null);
  const exitingRef      = useRef(false);
  const progressObj     = useRef({ frames: 0, model: 0 });

  // Called externally when 3-D model finishes loading
  useEffect(() => {
    if (isMobile) {
      // No model on mobile — mark model as done immediately
      progressObj.current.model = 1;
    } else {
      window.__loaderModelReady = () => {
        progressObj.current.model = 1;
        tryExit();
      };
    }
  }, [isMobile]); // eslint-disable-line

  const updateBar = (val) => {
    const pct = Math.round(val * 100);
    if (fillRef.current) fillRef.current.style.width = `${pct}%`;
    if (numRef.current) numRef.current.textContent = `${pct}%`;
  };

  const tryExit = () => {
    if (exitingRef.current) return;
    const { frames, model } = progressObj.current;
    const combined = (frames * 0.7 + model * 0.3); // weight
    updateBar(combined);
    if (frames < 1 || model < 1) return;
    exitingRef.current = true;
    if (statusRef.current) statusRef.current.textContent = 'Ready';
    updateBar(1);
    setTimeout(doExit, 400);
  };

  const doExit = () => {
    // Re-enable scrolling when loader is done
    document.body.style.overflow = '';
    if (onDone) onDone();
    gsap.to(containerRef.current, {
      yPercent: -105, opacity: 0, duration: 0.75, ease: 'power3.inOut',
      onComplete: () => { if (containerRef.current) containerRef.current.style.display = 'none'; },
    });
  };

  useEffect(() => {
    // Disable scrolling while loader is visible
    document.body.style.overflow = 'hidden';

    // Start preloading frames immediately
    startPreload((ratio) => {
      progressObj.current.frames = ratio;
      if (!exitingRef.current) updateBar(
        progressObj.current.frames * 0.7 + progressObj.current.model * 0.3
      );
    });

    framesReady.then(() => {
      progressObj.current.frames = 1;
      tryExit();
    });

    // Entrance animation
    const tl = gsap.timeline();
    tl.fromTo(glassRef.current,
      { opacity: 0, scale: 0.94, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.1
    );
    tl.fromTo(lettersRef.current?.querySelectorAll('.ll') ?? [],
      { y: 50, opacity: 0, filter: 'blur(8px)' },
      { y: 0, opacity: 1, filter: 'blur(0px)', stagger: 0.04, duration: 0.7, ease: 'power4.out' }, 0.3
    );
    tl.fromTo(roleRef.current,
      { opacity: 0, letterSpacing: '0.05em' },
      { opacity: 1, letterSpacing: '0.45em', duration: 0.7, ease: 'power2.out' }, 0.9
    );

    return () => tl.kill();
  }, []); // eslint-disable-line

  return (
    <div ref={containerRef} className="fixed inset-0 flex items-center justify-center overflow-hidden"
      style={{ zIndex: 200, background: 'var(--bg-color)' }}>

      {/* Glow orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle,rgba(127,29,29,0.22) 0%,transparent 65%)', filter: 'blur(60px)', animation: 'orbFloat 9s ease-in-out infinite alternate' }} />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle,rgba(239,68,68,0.1) 0%,transparent 65%)', filter: 'blur(80px)', animation: 'orbFloat 11s ease-in-out infinite alternate-reverse' }} />
      </div>

      {/* Glass card */}
      <div ref={glassRef} className="relative flex flex-col items-center gap-5 opacity-0"
        style={{
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
          borderRadius: '28px', boxShadow: '0 0 0 1px rgba(255,255,255,0.03),0 32px 80px rgba(0,0,0,0.55)',
          padding: isMobile ? '2.5rem 1.5rem' : '3rem 3.5rem', minWidth: 'min(420px,90vw)',
        }}>
        <div className="absolute top-0 left-[10%] right-[10%] h-[1px]"
          style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)' }} />

        {/* Accent dots */}
        <div className="flex gap-2">
          {['var(--accent-blood)', 'var(--accent-crimson)', 'var(--accent-red)'].map((c, i) => (
            <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: c, boxShadow: `0 0 6px ${c}` }} />
          ))}
        </div>

        {/* Status */}
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--accent-red)', boxShadow: '0 0 8px var(--accent-red)' }} />
          <span ref={statusRef} className="font-space text-[9px] tracking-[0.55em] uppercase" style={{ color: 'var(--muted-color)' }}>
            Loading Portfolio
          </span>
        </div>

        {/* Name letters */}
        <div ref={lettersRef} className="flex gap-0.5 overflow-hidden flex-nowrap whitespace-nowrap">
          {'SURYADEEP'.split('').map((c, i) => (
            <span key={i} className="ll font-syne font-extrabold text-white inline-block"
              style={{ fontSize: 'clamp(24px, 8vw, 68px)', lineHeight: 1 }}>{c}</span>
          ))}
          <span className="ll font-syne font-extrabold inline-block ml-1"
            style={{ fontSize: 'clamp(24px, 8vw, 68px)', lineHeight: 1, WebkitTextFillColor: 'transparent', WebkitTextStroke: '1.5px rgba(0,255,255,0.5)' }}>·</span>
        </div>

        {/* Role */}
        <p ref={roleRef} className="font-space uppercase opacity-0"
          style={{ fontSize: '10px', color: 'var(--accent-red)', letterSpacing: '0.45em' }}>
          Developer · Builder
        </p>

        {/* Progress */}
        <div className="w-full flex flex-col gap-2 mt-1">
          <div className="flex justify-between">
            <span className="font-space text-[9px] tracking-widest uppercase" style={{ color: 'var(--muted-color)' }}>Initializing</span>
            <span ref={numRef} className="font-space text-[10px] font-bold" style={{ color: 'var(--accent-red)' }}>0%</span>
          </div>
          <div className="w-full h-[2px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
            <div ref={fillRef} className="h-full rounded-full transition-all duration-150"
              style={{ width: '0%', background: 'linear-gradient(90deg,var(--accent-blood),var(--accent-red))', boxShadow: '0 0 8px rgba(239,68,68,0.6)' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
