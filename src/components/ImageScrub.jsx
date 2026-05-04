import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { frames, framesReady } from '../utils/preloadFrames';
import { useIsMobile } from '../hooks/useIsMobile';

gsap.registerPlugin(ScrollTrigger);

const TOTAL_FRAMES = 80;

// ── Interpolating canvas draw — crossfades between frames for smooth video feel ──
let drawPending = false;
let latestProgress = 0;

function scheduleInterpolatedDraw(canvas, progress) {
  latestProgress = progress;
  if (drawPending) return;
  drawPending = true;
  requestAnimationFrame(() => {
    drawPending = false;
    const p    = latestProgress;
    const exact = p * (TOTAL_FRAMES - 1);
    const idxA  = Math.floor(exact);
    const idxB  = Math.min(idxA + 1, TOTAL_FRAMES - 1);
    const t     = exact - idxA; // blend factor 0…1

    const imgA = frames[idxA];
    if (!imgA || !imgA.complete || !imgA.naturalWidth) return;

    const ctx = canvas.getContext('2d');
    const cW = canvas.width, cH = canvas.height;
    const sc = Math.max(cW / imgA.naturalWidth, cH / imgA.naturalHeight);
    const dW = imgA.naturalWidth * sc, dH = imgA.naturalHeight * sc;
    const dx = (cW - dW) / 2,  dy = (cH - dH) / 2;

    ctx.clearRect(0, 0, cW, cH);
    ctx.globalAlpha = 1;
    ctx.drawImage(imgA, dx, dy, dW, dH);

    // Blend next frame on top — eliminates the hard-cut between frames
    const imgB = frames[idxB];
    if (imgB && imgB.complete && imgB.naturalWidth && t > 0.01) {
      ctx.globalAlpha = t;
      ctx.drawImage(imgB, dx, dy, dW, dH);
      ctx.globalAlpha = 1;
    }
  });
}

// ─── Phase components ───

function Phase1({ r }) {
  return (
    <div ref={r} className="absolute inset-0 flex flex-col items-center justify-end select-none pointer-events-none" style={{ opacity: 0, paddingBottom: '10vh', paddingLeft: '4vw', paddingRight: '4vw' }}>
      <div className="overflow-hidden">
        <span className="phase-word font-syne font-extrabold uppercase text-[var(--accent-red)] block"
          style={{ fontSize: 'clamp(36px, 8vw, 130px)', lineHeight: 0.88, letterSpacing: '-0.04em', textAlign: 'center' }}>
          ENGINEER
        </span>
      </div>
      <div className="overflow-hidden">
        <span className="phase-word font-syne font-extrabold uppercase block"
          style={{
            fontSize: 'clamp(36px, 8vw, 130px)', lineHeight: 0.88, letterSpacing: '-0.04em',
            WebkitTextFillColor: 'transparent', WebkitTextStroke: '1.5px rgba(255,255,255,0.85)', textAlign: 'center',
          }}>
          STUDENT
        </span>
      </div>
      <div style={{ width: 60, height: 2, background: 'var(--accent-red)', marginTop: 14, boxShadow: '0 0 10px var(--accent-red)' }} />
    </div>
  );
}

function Phase2({ r }) {
  return (
    <div ref={r} className="absolute inset-0 flex flex-col items-start justify-end select-none pointer-events-none" style={{ paddingLeft: 'clamp(16px,6vw,8vw)', paddingBottom: '10vh', opacity: 0 }}>
      <div className="overflow-hidden">
        <span className="phase-word font-syne font-extrabold uppercase text-white block" style={{ fontSize: 'clamp(30px, 7vw, 108px)', lineHeight: 0.9, letterSpacing: '-0.03em' }}>BUILDING</span>
      </div>
      <div className="overflow-hidden">
        <span className="phase-word font-syne font-extrabold uppercase block" style={{ fontSize: 'clamp(22px, 5vw, 72px)', lineHeight: 0.9, letterSpacing: '-0.02em', color: 'var(--accent-red)' }}>INTELLIGENT</span>
      </div>
      <div className="overflow-hidden">
        <span className="phase-word font-syne font-bold uppercase text-white/60 block" style={{ fontSize: 'clamp(16px, 3.2vw, 50px)', lineHeight: 1, letterSpacing: '-0.01em' }}>SYSTEMS</span>
      </div>
    </div>
  );
}

function Phase3({ r }) {
  return (
    <div ref={r} className="absolute inset-0 flex flex-col items-end justify-end select-none pointer-events-none" style={{ paddingRight: 'clamp(16px,6vw,8vw)', paddingBottom: '10vh', opacity: 0 }}>
      <div className="overflow-hidden">
        <span className="phase-word font-syne font-extrabold uppercase text-white block text-right" style={{ fontSize: 'clamp(30px, 7vw, 108px)', lineHeight: 0.9, letterSpacing: '-0.04em' }}>SOFTWARE</span>
      </div>
      <div className="overflow-hidden">
        <span className="phase-word font-syne font-extrabold uppercase block text-right" style={{ fontSize: 'clamp(30px, 7vw, 108px)', lineHeight: 0.9, letterSpacing: '-0.04em', color: 'var(--accent-red)' }}>DEVELOPER</span>
      </div>
      <div style={{ marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 999, border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.08)' }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-red)', boxShadow: '0 0 6px var(--accent-red)' }} />
        <span className="font-space uppercase tracking-[0.28em] text-[var(--accent-red)]" style={{ fontSize: 10 }}>@ IILM University</span>
      </div>
    </div>
  );
}

function Phase4({ r }) {
  return (
    <div ref={r} className="absolute inset-0 flex items-end justify-center select-none pointer-events-none" style={{ opacity: 0, paddingBottom: '8vh' }}>
      <div className="flex flex-col items-center gap-3 px-9 py-7 max-w-md text-center" style={{
        background: 'rgba(10, 0, 0, 0.7)',
        border: '1px solid rgba(239,68,68,0.22)', borderRadius: 20,
        boxShadow: '0 0 0 1px rgba(239,68,68,0.06), 0 24px 60px rgba(0,0,0,0.6)',
      }}>
        <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg, transparent, var(--accent-red), transparent)' }} />
        <span className="font-space text-[10px] tracking-[0.5em] uppercase text-[var(--accent-red)]">About Me</span>
        <h3 className="font-syne font-extrabold text-white m-0" style={{ fontSize: 'clamp(20px, 2.5vw, 32px)' }}>Suryadeep Banerjee</h3>
        <p className="text-gray-400 leading-relaxed m-0" style={{ fontSize: 'clamp(12px, 1vw, 15px)' }}>
          B.Tech student at IILM University — building intelligent systems at the intersection of{' '}
          <span style={{ color: 'var(--accent-red)', fontWeight: 600 }}>AI</span>{' '}and scalable engineering.
        </p>
        <div style={{ width: 36, height: 2, background: 'var(--accent-red)', boxShadow: '0 0 8px var(--accent-red)' }} />
        <div style={{ width: '100%', height: 1, background: 'linear-gradient(90deg, transparent, var(--accent-red), transparent)' }} />
      </div>
    </div>
  );
}

function Phase5({ r }) {
  return (
    <div ref={r} className="absolute inset-0 flex flex-col items-center justify-end select-none pointer-events-none" style={{ opacity: 0, paddingBottom: '10vh' }}>
      <div className="overflow-hidden">
        <span className="phase-word font-syne font-extrabold uppercase text-white block text-center"
          style={{ fontSize: 'clamp(44px, 10vw, 140px)', lineHeight: 0.85, letterSpacing: '-0.05em' }}>BUILDING</span>
      </div>
      <div className="overflow-hidden">
        <span className="phase-word font-syne font-extrabold uppercase block text-center"
          style={{ fontSize: 'clamp(44px, 10vw, 140px)', lineHeight: 0.85, letterSpacing: '-0.05em', color: 'var(--accent-red)' }}>THE FUTURE</span>
      </div>
      <div style={{ marginTop: 22, width: 'clamp(100px, 18vw, 240px)', height: 2, background: 'linear-gradient(90deg, transparent, var(--accent-red), transparent)', boxShadow: '0 0 16px var(--accent-red)' }} />
    </div>
  );
}

// ─── Main ───

export default function ImageScrub() {
  const containerRef  = useRef(null);
  const canvasRef     = useRef(null);
  const scrubInnerRef = useRef(null);
  const p1 = useRef(null), p2 = useRef(null), p3 = useRef(null),
        p4 = useRef(null), p5 = useRef(null);
  const ownTriggers   = useRef([]);
  const isMobile      = useIsMobile();

  useEffect(() => {
    const canvas = canvasRef.current;

    const fitCanvas = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    fitCanvas();
    window.addEventListener('resize', fitCanvas);

    canvas.style.opacity = '1';
    framesReady.then(() => scheduleInterpolatedDraw(canvas, 0));

    // ── Auto-pace frame advancement ──────────────────────────────────────────
    // targetP follows scroll; currentP chases targetP at MAX_SPEED per frame.
    // Result: frames advance at their own cinematic pace regardless of scroll speed.
    let targetP  = 0;
    let currentP = 0;
    let isActive = false;
    let rafId    = null;

    const MAX_SPEED = 0.008; // max Δprogress per frame ≈ 2.1s minimum full traversal @ 60fps

    const tick = () => {
      const delta = targetP - currentP;
      if (Math.abs(delta) > 0.0003) {
        currentP += Math.sign(delta) * Math.min(Math.abs(delta), MAX_SPEED);
        currentP  = Math.max(0, Math.min(1, currentP));
        scheduleInterpolatedDraw(canvas, currentP);
      }
      if (isActive) rafId = requestAnimationFrame(tick);
    };

    const startRaf = () => { if (!isActive) { isActive = true; rafId = requestAnimationFrame(tick); } };
    const stopRaf  = () => { isActive = false; cancelAnimationFrame(rafId); };

    ownTriggers.current.push(ScrollTrigger.create({
      trigger : containerRef.current,
      start   : '3% top',
      end     : '92% top',
      onUpdate    : (s) => { targetP = s.progress; },
      onEnter     : startRaf,
      onLeave     : stopRaf,
      onEnterBack : startRaf,
      onLeaveBack : stopRaf,
    }));

    // ── Scale-in on entry ──
    if (scrubInnerRef.current) {
      const scaleIn = gsap.fromTo(scrubInnerRef.current,
        { scale: 1.06 },
        { scale: 1.0, ease: 'none',
          scrollTrigger: { trigger: containerRef.current, start: 'top bottom', end: 'top 30%', scrub: true } }
      );
      ownTriggers.current.push(scaleIn.scrollTrigger);
    }

    // ── Fade canvas OUT at end ──
    const fadeOut = gsap.to(canvas, {
      opacity: 0,
      scrollTrigger: { trigger: containerRef.current, start: '90% top', end: '97% top', scrub: 1 },
    });
    ownTriggers.current.push(fadeOut.scrollTrigger);

    // ── Phase text ──
    const SEGMENTS = [
      [0.00, 0.17], [0.20, 0.37], [0.40, 0.57], [0.60, 0.76], [0.82, 1.00],
    ];

    const tl = gsap.timeline({
      scrollTrigger: { trigger: containerRef.current, start: '3% top', end: 'bottom bottom', scrub: 1.8 },
    });

    [p1, p2, p3, p4, p5].forEach((r, i) => {
      if (!r.current) return;
      const [inAt, outAt] = SEGMENTS[i];
      const dur = 0.06;
      tl.fromTo(r.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: dur, ease: 'power3.out' }, inAt);
      const words = r.current.querySelectorAll('.phase-word');
      if (words.length > 1) {
        tl.fromTo(words, { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.012, duration: dur, ease: 'power4.out' }, inAt + 0.005);
      }
      tl.to(r.current, { opacity: 0, y: -45, duration: dur, ease: 'power3.in' }, outAt);
    });

    ownTriggers.current.push(tl.scrollTrigger);

    return () => {
      stopRaf();
      window.removeEventListener('resize', fitCanvas);
      ownTriggers.current.forEach(st => st && st.kill());
      tl.kill();
    };
  }, []);

  return (
    <div id="image-scrub" ref={containerRef} className="relative w-full" style={{ height: isMobile ? '400vh' : '700vh' }}>
      <div ref={scrubInnerRef} className="scrub-inner sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">

        {/* ── Image ── */}
        <div
          className="absolute w-[92vw] h-[72vh] md:w-[68vw] md:h-[76vh]"
          style={{
            borderRadius: '16px',
            overflow: 'hidden',
            WebkitMaskImage: 'radial-gradient(ellipse 88% 85% at 50% 50%, black 45%, transparent 100%)',
            maskImage: 'radial-gradient(ellipse 88% 85% at 50% 50%, black 45%, transparent 100%)',
          }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ display: 'block' }}
          />
        </div>

        {/* ── Phase text — full viewport overlay ── */}
        <div className="absolute inset-0 z-10 pointer-events-none select-none">
          <Phase1 r={p1} />
          <Phase2 r={p2} />
          <Phase3 r={p3} />
          <Phase4 r={p4} />
          <Phase5 r={p5} />
        </div>

      </div>
    </div>
  );
}
