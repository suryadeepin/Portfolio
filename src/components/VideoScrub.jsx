import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VideoScrub() {
  const containerRef = useRef(null);
  const videoRef     = useRef(null);
  const rafRef       = useRef(null);
  const targetTimeRef = useRef(0);

  // Text phase refs
  const phase1Ref = useRef(null);
  const phase2Ref = useRef(null);
  const phase3Ref = useRef(null);
  const phase4Ref = useRef(null);
  const phase5Ref = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // RAF loop: only seek if target differs by threshold → eliminates stutter
    const seekLoop = () => {
      if (video.readyState >= 1) {
        const diff = Math.abs(video.currentTime - targetTimeRef.current);
        if (diff > 0.04) {
          try {
            if (video.fastSeek) {
              video.fastSeek(targetTimeRef.current);
            } else {
              video.currentTime = targetTimeRef.current;
            }
          } catch (_) {}
        }
      }
      rafRef.current = requestAnimationFrame(seekLoop);
    };

    const onLoaded = () => {
      video.pause();
      video.currentTime = 0;
      rafRef.current = requestAnimationFrame(seekLoop);

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5,
        onUpdate: (self) => {
          if (video.duration) {
            targetTimeRef.current = self.progress * video.duration;
          }
        },
      });
    };

    if (video.readyState >= 1) onLoaded();
    else video.addEventListener('loadedmetadata', onLoaded, { once: true });

    // ── Text timeline ──────────────────────────────────────────────
    // Hide all phases initially
    [phase1Ref, phase2Ref, phase3Ref, phase4Ref, phase5Ref].forEach(r => {
      if (r.current) gsap.set(r.current, { opacity: 0 });
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 2.2, // Smoother, slower feel
      },
    });

    // Phase 1: Engineering Student
    // Cinematic Blur-in and Scale-up
    tl.fromTo(phase1Ref.current.children,
      { y: 100, opacity: 0, filter: 'blur(20px)', scale: 0.8 },
      { 
        y: 0, 
        opacity: 1, 
        filter: 'blur(0px)', 
        scale: 1, 
        stagger: 0.03, 
        ease: 'expo.out', 
        duration: 0.12 
      }, 0
    ).to(phase1Ref.current.children,
      { 
        y: -120, 
        opacity: 0, 
        filter: 'blur(15px)', 
        scale: 1.1, 
        stagger: 0.02, 
        duration: 0.1, 
        ease: 'expo.in' 
      }, 0.15
    );

    // Phase 2: Intelligent Systems
    // Mask reveal with blur reduction
    tl.fromTo(phase2Ref.current,
      { y: 120, opacity: 0, filter: 'blur(20px)', clipPath: 'inset(100% 0 0 0)' },
      { 
        y: 0, 
        opacity: 1, 
        filter: 'blur(0px)', 
        clipPath: 'inset(0% 0 0 0)', 
        duration: 0.12, 
        ease: 'power4.out' 
      }, 0.22
    ).to(phase2Ref.current,
      { 
        opacity: 0, 
        scale: 0.9, 
        filter: 'blur(15px)', 
        duration: 0.1, 
        ease: 'power4.in' 
      }, 0.35
    );

    // Phase 3: Software Dev
    // 3D rotation and bounce with blur
    tl.fromTo(phase3Ref.current.children,
      { y: 150, opacity: 0, filter: 'blur(25px)', rotationX: -90, z: -500 },
      { 
        y: 0, 
        opacity: 1, 
        filter: 'blur(0px)', 
        rotationX: 0, 
        z: 0, 
        stagger: 0.04, 
        duration: 0.15, 
        ease: 'back.out(1.2)' 
      }, 0.42
    ).to(phase3Ref.current,
      { 
        scale: 2, 
        opacity: 0, 
        filter: 'blur(30px)', 
        duration: 0.12, 
        ease: 'power2.inOut' 
      }, 0.58
    );

    // Phase 4: Glass Card
    // Smooth slide from bottom with high blur
    tl.fromTo(phase4Ref.current,
      { y: 200, opacity: 0, filter: 'blur(40px)', scale: 0.9 },
      { 
        y: 0, 
        opacity: 1, 
        filter: 'blur(0px)', 
        scale: 1, 
        duration: 0.15, 
        ease: 'power4.out' 
      }, 0.65
    ).to(phase4Ref.current,
      { 
        y: -150, 
        opacity: 0, 
        filter: 'blur(20px)', 
        scale: 1.05, 
        duration: 0.1, 
        ease: 'power4.in' 
      }, 0.78
    );

    // Phase 5: Building the Future
    // Final letter-spacing and shimmer-in
    tl.fromTo(phase5Ref.current.querySelectorAll('.char'),
      { opacity: 0, filter: 'blur(20px)', y: 50, letterSpacing: '0.5em' },
      { 
        opacity: 1, 
        filter: 'blur(0px)', 
        y: 0, 
        letterSpacing: '0em', 
        stagger: 0.02, 
        duration: 0.15, 
        ease: 'expo.out' 
      }, 0.85
    );

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      tl.kill();
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === containerRef.current) st.kill();
      });
    };
  }, []);

  const p1chars = "Engineering Student".split('');
  const p3chars = "Software Dev".split('');

  return (
    <div id="about" ref={containerRef} className="relative w-full" style={{ height: '500vh' }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Video */}
        <video
          ref={videoRef}
          src="/hero-video.mp4"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.3) saturate(1.3)' }}
        />

        {/* Overlays */}
        <div className="absolute inset-0 z-[1]" style={{ background: 'radial-gradient(ellipse at center, transparent 20%, rgba(3,3,5,0.8) 100%)' }} />
        <div className="absolute inset-0 z-[1] opacity-30 pointer-events-none" style={{ background: 'repeating-linear-gradient(rgba(255,255,255,0.015) 0px 1px, transparent 1px 3px)' }} />
        <div className="absolute bottom-0 left-0 w-full h-[20%] z-[1]" style={{ background: 'linear-gradient(to top, var(--bg-color) 0%, transparent 100%)' }} />

        {/* Text Container */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none select-none">

          {/* Phase 1 */}
          <h2 ref={phase1Ref} className="absolute font-syne font-extrabold text-white flex text-[clamp(40px,6vw,80px)] text-center uppercase tracking-tighter" style={{ textShadow: '0 0 60px var(--accent-violet)' }}>
            {p1chars.map((c, i) => <span key={i} className="inline-block whitespace-pre">{c}</span>)}
          </h2>

          {/* Phase 2 */}
          <div ref={phase2Ref} className="absolute flex flex-col items-center gap-2">
            <h2 className="font-syne font-extrabold text-[clamp(52px,9vw,112px)] text-[var(--accent-violet)] leading-none" style={{ textShadow: '0 0 80px rgba(138,43,226,0.8)' }}>
              Intelligent
            </h2>
            <p className="font-syne font-bold text-[clamp(38px,7vw,80px)] text-white/90 leading-none tracking-tighter">
              Systems
            </p>
          </div>

          {/* Phase 3 */}
          <div ref={phase3Ref} className="absolute flex flex-col items-center gap-2">
            <h2 className="font-syne font-extrabold text-[clamp(52px,9vw,112px)] text-[var(--accent-cyan)] flex leading-none" style={{ textShadow: '0 0 80px rgba(0,255,255,0.8)' }}>
              {p3chars.map((c, i) => <span key={i} className="inline-block whitespace-pre">{c}</span>)}
            </h2>
            <p className="font-syne font-bold text-[clamp(38px,7vw,80px)] text-white/90 leading-none tracking-tighter">at IILM University</p>
          </div>

          {/* Phase 4 */}
          <h3 ref={phase4Ref} className="absolute glass-panel font-space text-[clamp(16px,2vw,24px)] text-[var(--text-color)] tracking-[0.4em] text-center px-10 py-6 uppercase">
            Analytical precision <span className="text-[var(--accent-cyan)]">·</span> Creative insight
          </h3>

          {/* Phase 5 */}
          <div ref={phase5Ref} className="absolute flex flex-col items-center">
            <h2 className="font-syne font-extrabold text-[clamp(44px,8vw,100px)] text-center uppercase tracking-tighter text-gradient">
              {"Building the Future".split('').map((c, i) => (
                <span key={i} className="char inline-block whitespace-pre">{c}</span>
              ))}
            </h2>
            <div className="mt-8 text-[var(--accent-cyan)] animate-bounce">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <polyline points="19 12 12 19 5 12" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
