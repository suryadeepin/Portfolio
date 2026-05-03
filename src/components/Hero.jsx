import { useRef, useEffect, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsMobile } from '../hooks/useIsMobile';

gsap.registerPlugin(ScrollTrigger);

// ── Tech icons ────────────────────────────────────────────────────────────────
const TECH = [
  { id: 'js',     label: 'JS',  color: '#ffffff', bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.12)' },
  { id: 'ts',     label: 'TS',  color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)'   },
  { id: 'react',  label: '⚛',   color: '#ffffff', bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.12)' },
  { id: 'py',     label: 'Py',  color: '#b91c1c', bg: 'rgba(185,28,28,0.12)',   border: 'rgba(185,28,28,0.30)'   },
  { id: 'node',   label: 'N',   color: '#ffffff', bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.12)' },
  { id: 'git',    label: 'Git', color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)'   },
  { id: 'mongo',  label: 'DB',  color: '#ffffff', bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.12)' },
  { id: 'cpp',    label: 'C++', color: '#b91c1c', bg: 'rgba(185,28,28,0.12)',   border: 'rgba(185,28,28,0.30)'   },
];

const ICON_SIZE = 40;
const CLUSTER_R = 58; // radius that gives ~2px gap between 40px icons in a circle of 8

// Precompute circle positions (no overlap guaranteed at r=58 with 8×40px icons)
const CIRCLE_POS = TECH.map((_, i) => {
  const angle = (i / TECH.length) * Math.PI * 2 - Math.PI / 2;
  return { x: Math.cos(angle) * CLUSTER_R, y: Math.sin(angle) * CLUSTER_R, r: 0 };
});

// Generate random scatter positions with force-separation at mount
function makeScatterPositions(count) {
  const MIN_DIST = ICON_SIZE + 10; // 50px minimum gap center-to-center
  const pos = Array.from({ length: count }, (_, i) => {
    const base  = (i / count) * Math.PI * 2 - Math.PI / 2;
    const jitter = (Math.random() - 0.5) * Math.PI * 0.7;
    const angle  = base + jitter;
    const dist   = 100 + Math.random() * 70;
    return {
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      r: (Math.random() - 0.5) * 40,
    };
  });

  // Push overlapping icons apart
  for (let iter = 0; iter < 120; iter++) {
    let moved = false;
    for (let i = 0; i < pos.length; i++) {
      for (let j = i + 1; j < pos.length; j++) {
        const dx = pos[j].x - pos[i].x;
        const dy = pos[j].y - pos[i].y;
        const d  = Math.sqrt(dx * dx + dy * dy) || 0.001;
        if (d < MIN_DIST) {
          const push = (MIN_DIST - d) / 2 + 1;
          const nx = dx / d, ny = dy / d;
          pos[i].x -= nx * push; pos[i].y -= ny * push;
          pos[j].x += nx * push; pos[j].y += ny * push;
          moved = true;
        }
      }
    }
    if (!moved) break;
  }
  return pos;
}

// ── TechCluster ───────────────────────────────────────────────────────────────
function TechCluster() {
  const [scattered, setScattered] = useState(false);
  const leaveTimer = useRef(null);

  // Generate scatter positions once per mount (random each load)
  const scatterPos = useMemo(() => makeScatterPositions(TECH.length), []);

  const onEnter = () => {
    clearTimeout(leaveTimer.current);
    setScattered(true);
  };
  const onLeave = () => {
    leaveTimer.current = setTimeout(() => setScattered(false), 250);
  };

  // Wrapper size must encompass both clustered (diameter ~156px) and scattered (~340px)
  // We size it for the cluster and let the hover area be the cluster circle
  return (
    <div
      className="absolute pointer-events-auto hidden sm:block"
      style={{
        // Center of blank upper-left space — between navbar and name text, left of model
        top : '28%',
        left: '20%',
        transform: 'translate(-50%, -50%)',
        width : 160, height: 160,
        zIndex: 15,
        animation: 'orbFloat 16s ease-in-out infinite alternate',
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      {/* Pulse ring — only in clustered state */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%,-50%)',
        width: 156, height: 156, borderRadius: '50%',
        border: '1px solid rgba(239,68,68,0.18)',
        opacity: scattered ? 0 : 0.7,
        transition: 'opacity 0.4s ease',
        animation: 'pulseGlow 3s ease-in-out infinite',
        pointerEvents: 'none',
      }} />

      {/* Hover hint text */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%',
        transform: 'translate(-50%, -90px)',
        opacity: scattered ? 0 : 0.55,
        transition: 'opacity 0.35s ease',
        pointerEvents: 'none',
        whiteSpace: 'nowrap',
        fontFamily: 'Space Mono, monospace',
        fontSize: 8,
        letterSpacing: '0.28em',
        textTransform: 'uppercase',
        color: 'rgba(239,68,68,0.8)',
      }}>hover</div>

      {/* Icons */}
      {TECH.map((t, i) => {
        const cp = CIRCLE_POS[i];
        const sp = scatterPos[i];
        const pos = scattered ? sp : cp;

        return (
          // Outer: scatter/cluster transform with spring
          <div key={t.id} style={{
            position: 'absolute',
            left: '50%', top: '50%',
            transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) rotate(${pos.r}deg)`,
            transition: `transform ${scattered ? '0.5s' : '0.6s'} cubic-bezier(0.34,1.56,0.64,1)`,
            transitionDelay: scattered
              ? `${i * 0.03}s`
              : `${(TECH.length - 1 - i) * 0.025}s`,
          }}>
            {/* Inner: individual float bob — separate element = no transform conflict */}
            <div style={{
              animation: `techFloat ${5.5 + i * 0.6}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}>
              {/* Icon tile */}
              <div
                title={t.id.toUpperCase()}
                style={{
                  width: ICON_SIZE, height: ICON_SIZE,
                  background: t.bg,
                  border: `1px solid ${t.border}`,
                  borderRadius: 10,
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  boxShadow: `0 4px 16px rgba(0,0,0,0.4), 0 0 10px ${t.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'default',
                  perspective: 200,
                  transition: 'box-shadow 0.25s ease, transform 0.25s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = `0 8px 28px rgba(0,0,0,0.5), 0 0 22px ${t.border}`;
                  e.currentTarget.style.transform = 'scale(1.18) rotateX(6deg)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = `0 4px 16px rgba(0,0,0,0.4), 0 0 10px ${t.border}`;
                  e.currentTarget.style.transform = 'scale(1) rotateX(0deg)';
                }}
              >
                <span style={{
                  color: t.color,
                  fontSize: t.label === '⚛' ? 18 : (t.label.length > 2 ? 11 : 13),
                  fontFamily: 'Space Mono, monospace',
                  fontWeight: 700,
                  letterSpacing: t.label.length > 2 ? '-0.5px' : 0,
                  textShadow: `0 0 10px ${t.color}80`,
                  userSelect: 'none',
                }}>
                  {t.label}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
export default function Hero() {
  const containerRef = useRef(null);
  const textRef      = useRef(null);
  const isMobile     = useIsMobile();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-line',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.08, duration: 1, ease: 'power3.out', delay: 3.5 }
      );
      gsap.fromTo('.hero-badge',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 4.0 }
      );
      gsap.to(textRef.current, {
        y: -100, opacity: 0,
        scrollTrigger: { trigger: '#hero', start: 'top top', end: '65% top', scrub: true },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full h-screen pointer-events-none overflow-hidden"
    >
      {/* Tech cluster — desktop only (upper-left blank space) */}
      {!isMobile && <TechCluster />}

      {/* Text block */}
      <div
        ref={textRef}
        className="absolute pointer-events-auto"
        style={isMobile
          ? {
              // Mobile: centered, full width, positioned near the top
              top: '22vh',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              padding: '0 5vw',
              zIndex: 10,
              textAlign: 'center',
            }
          : {
              // Desktop: bottom-left
              bottom: '7vh',
              left: '5vw',
              zIndex: 10,
              maxWidth: '46vw',
            }
        }
      >
        <div className="hero-line flex items-center gap-2 mb-2" style={{ opacity: 0, justifyContent: isMobile ? 'center' : 'flex-start' }}>
          <span style={{ width: 22, height: 1, background: 'var(--accent-red)', display: 'block', flexShrink: 0 }} />
          <span className="font-space uppercase tracking-[0.32em] text-[var(--accent-red)]"
            style={{ fontSize: 'clamp(8px, 0.85vw, 11px)', whiteSpace: 'nowrap' }}>
            Hello, I&apos;m
          </span>
        </div>

        <h1 className="hero-line font-syne font-extrabold leading-[0.9] tracking-tighter text-white m-0"
          style={{ fontSize: isMobile ? 'clamp(20px, 8.5vw, 56px)' : 'clamp(32px, 5.5vw, 78px)', opacity: 0, whiteSpace: 'nowrap' }}>
          SURYADEEP
        </h1>
        <h2 className="hero-line font-syne font-extrabold leading-[0.9] tracking-tighter m-0"
          style={{
            fontSize: isMobile ? 'clamp(16px, 6.5vw, 40px)' : 'clamp(26px, 4.2vw, 62px)', opacity: 0,
            whiteSpace: 'nowrap',
            WebkitTextFillColor: 'transparent',
            WebkitTextStroke: '1.5px rgba(239,68,68,0.7)',
          }}>
          BANERJEE
        </h2>

        <div className="hero-line my-3" style={{ opacity: 0 }}>
          <div style={{ width: 44, height: 1.5, background: 'linear-gradient(90deg, var(--accent-red), transparent)' }} />
        </div>

        <div className="hero-badge" style={{ opacity: 0 }}>
          <div
            className="inline-flex flex-col gap-2.5 px-5 py-4 rounded-xl pointer-events-auto"
            style={{
              background: 'rgba(12,0,0,0.6)',
              border: '1px solid rgba(239,68,68,0.16)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              width: isMobile ? '100%' : 'auto',
            }}
          >
            <p className="font-space text-gray-400 uppercase tracking-[0.22em] m-0"
              style={{ fontSize: 'clamp(9px, 0.95vw, 13px)', whiteSpace: 'nowrap', textAlign: isMobile ? 'center' : 'left' }}>
              Software Engineering Student
            </p>
            <div className="flex gap-5" style={{ justifyContent: isMobile ? 'center' : 'flex-start' }}>
              {[
                { label: 'GitHub',   href: 'https://github.com/suryadeepin' },
                { label: 'LinkedIn', href: 'https://www.linkedin.com/in/suryadeep-banerjee' },
                { label: 'Résumé',   href: '/Resume.pdf' },
              ].map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer"
                  className="hero-nav-link font-space uppercase tracking-widest"
                  style={{ fontSize: 'clamp(9px, 0.9vw, 13px)', color: 'rgba(239,68,68,0.75)', textDecoration: 'none' }}>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="hero-badge flex items-center gap-2 mt-5" style={{ opacity: 0, justifyContent: isMobile ? 'center' : 'flex-start' }}>
          <div style={{ width: 1, height: 28, background: 'linear-gradient(180deg, transparent, var(--accent-red))' }} />
          <span className="font-space text-[8px] tracking-[0.38em] uppercase text-[var(--accent-red)]">Scroll</span>
        </div>
      </div>
    </section>
  );
}
